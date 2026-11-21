
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { isUserRole, type UserRole } from "./roles";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const REQUEST_TIMEOUT_MS = 10_000;

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

async function readCookieHeader(): Promise<string> {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

/**
 * Reads the authenticated user from the protected backend.
 *
 * Flow:
 * 1. Forward the Better Auth session cookie to `GET /api/auth/token`
 *    to obtain a short-lived JWT (issued by the JWT plugin).
 * 2. Call `GET /api/dashboard/me` with that JWT and read the role.
 *
 * The result is memoized per request with React `cache()`, so the
 * dashboard shell, role guards and pages share a single round trip.
 *
 * Returns `null` when there is no session, the session expired
 * (401/403), the payload is invalid, or the backend is unreachable.
 */
export const getSessionUser = cache(
  async function getSessionUser(): Promise<SessionUser | null> {
    const cookieHeader = await readCookieHeader();

    if (!cookieHeader) {
      return null;
    }

    try {
      const tokenResponse = await fetch(
        `${API_URL}/api/auth/token`,
        {
          headers: { cookie: cookieHeader },
          cache: "no-store",
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        }
      );

      if (!tokenResponse.ok) {
        return null;
      }

      const tokenPayload = await tokenResponse.json();
      const token = tokenPayload?.token;

      if (typeof token !== "string" || !token) {
        return null;
      }

      const meResponse = await fetch(
        `${API_URL}/api/dashboard/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        }
      );

      if (!meResponse.ok) {
        return null;
      }

      const mePayload = await meResponse.json();
      const user = mePayload?.user;

      if (!user?.id || !isUserRole(user.role)) {
        return null;
      }

      return {
        id: String(user.id),
        name: typeof user.name === "string" ? user.name : "",
        email: typeof user.email === "string" ? user.email : "",
        role: user.role,
      };
    } catch {
      return null;
    }
  }
);

/**
 * Server-side authorization helper: redirects anonymous visitors to
 * the login page instead of letting them render protected content.
 */
export async function requireSessionUser(): Promise<SessionUser> {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login?callbackUrl=%2Fdashboard");
  }

  return user;
}
