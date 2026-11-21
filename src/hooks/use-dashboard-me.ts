
"use client";

import { useEffect, useState } from "react";

import { authFetch } from "@/lib/api";
import { isUserRole, type UserRole } from "@/lib/roles";

export type DashboardMe = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type DashboardMeState =
  | { status: "loading" }
  | { status: "success"; user: DashboardMe }
  | { status: "error"; message: string };

let cachedUser: DashboardMe | null = null;
let inFlight: Promise<DashboardMe> | null = null;

/**
 * Invalidates the memoized `/api/dashboard/me` response.
 * Call this after sign-out so the next session fetches fresh data.
 */
export function resetDashboardMe() {
  cachedUser = null;
  inFlight = null;
}

/**
 * Loads the authenticated user (including the role) from the
 * protected `GET /api/dashboard/me` endpoint exactly once and
 * memoizes the result for every consumer on the page.
 */
export function fetchDashboardMe(): Promise<DashboardMe> {
  if (cachedUser) {
    return Promise.resolve(cachedUser);
  }

  if (!inFlight) {
    inFlight = (async () => {
      try {
        const response = await authFetch("/api/dashboard/me");

        if (response.status === 401) {
          throw new Error("Your session has expired. Please sign in again.");
        }

        if (response.status === 403) {
          throw new Error("You do not have access to this account.");
        }

        if (!response.ok) {
          throw new Error("Unable to load your account details.");
        }

        const payload = await response.json();
        const user = payload?.user;

        if (!user?.id || !isUserRole(user.role)) {
          throw new Error("The server returned invalid account data.");
        }

        const result: DashboardMe = {
          id: String(user.id),
          name: typeof user.name === "string" ? user.name : "",
          email: typeof user.email === "string" ? user.email : "",
          role: user.role,
        };

        cachedUser = result;
        return result;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Authentication required"
        ) {
          throw new Error("Your session has expired. Please sign in again.");
        }

        throw error;
      } finally {
        inFlight = null;
      }
    })();
  }

  return inFlight;
}

export function useDashboardMe(): DashboardMeState {
  const [state, setState] = useState<DashboardMeState>(() =>
    cachedUser
      ? { status: "success", user: cachedUser }
      : { status: "loading" }
  );

  useEffect(() => {
    let active = true;

    fetchDashboardMe()
      .then((user) => {
        if (!active) {
          return;
        }

        setState((current) =>
          current.status === "success" &&
          current.user.id === user.id
            ? current
            : { status: "success", user }
        );
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        setState({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "Unable to load your account.",
        });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
