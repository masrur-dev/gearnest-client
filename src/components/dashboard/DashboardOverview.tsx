
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, RefreshCw } from "lucide-react";

import { authFetch } from "@/lib/api";
import {
  menuForRole,
  roleApiPath,
  type UserRole,
} from "@/lib/roles";

import { Skeleton } from "@/components/ui/skeleton";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import { Button } from "@/components/ui/button";

type OverviewUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type BackendState =
  | { status: "loading" }
  | { status: "verified"; message: string }
  | { status: "error"; message: string };

const actionDescriptions: Record<UserRole, Record<string, string>> = {
  Customer: {
    "/dashboard/customer/rentals":
      "Track your current and past equipment rentals.",
    "/dashboard/customer/favorites":
      "Keep the equipment you want to rent in one place.",
    "/dashboard/profile": "Update your contact details and photo.",
  },
  Owner: {
    "/dashboard/owner/add-equipment":
      "Publish a new listing to the GearNest marketplace.",
    "/dashboard/owner/equipment":
      "Manage the equipment you have listed for rent.",
    "/dashboard/owner/rentals":
      "Review rental activity for your equipment.",
    "/dashboard/profile": "Update your contact details and photo.",
  },
  Admin: {
    "/dashboard/admin/users":
      "View registered accounts and manage their roles.",
    "/dashboard/admin/equipment":
      "Browse every listing published on the platform.",
    "/dashboard/admin/rentals":
      "Platform-wide rental activity, once the API is available.",
    "/dashboard/profile": "Update your contact details and photo.",
  },
};

export default function DashboardOverview({
  user,
}: {
  user: OverviewUser;
}) {
  const [backend, setBackend] = useState<BackendState>({
    status: "loading",
  });

  const verifyBackend = useCallback(() => {
    let active = true;

    authFetch(roleApiPath[user.role])
      .then(async (response) => {
        if (!active) return;

        if (response.status === 401) {
          setBackend({
            status: "error",
            message: "Your session has expired. Please sign in again.",
          });
          return;
        }

        if (response.status === 403) {
          setBackend({
            status: "error",
            message: "Your role is not permitted to call this API.",
          });
          return;
        }

        if (!response.ok) {
          setBackend({
            status: "error",
            message: "The dashboard API returned an error.",
          });
          return;
        }

        const payload = await response.json();

        if (!active) return;

        setBackend({
          status: "verified",
          message:
            typeof payload?.message === "string"
              ? payload.message
              : "Authenticated dashboard endpoint reachable.",
        });
      })
      .catch((error: unknown) => {
        if (!active) return;

        setBackend({
          status: "error",
          message:
            error instanceof Error && error.message === "Authentication required"
              ? "Your session has expired. Please sign in again."
              : error instanceof Error
                ? error.message
                : "Unable to reach the GearNest API.",
        });
      });

    return () => {
      active = false;
    };
  }, [user.role]);

  useEffect(() => {
    return verifyBackend();
  }, [verifyBackend]);

  function handleRetry() {
    setBackend({ status: "loading" });
    verifyBackend();
  }

  const actions = menuForRole(user.role).filter(
    (item) => item.url !== "/dashboard"
  );

  return (
    <div className="space-y-6">
      <div className="theme-deep-panel rounded-2xl p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold text-muted-foreground">
          {user.role} Dashboard
        </p>

        <h1 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
          Welcome back, {user.name.split(" ")[0]}!
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Manage your GearNest account from here. Every section
          below only shows data your role is allowed to access.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-white/10 px-3 py-1 font-medium">
            {user.email}
          </span>
          <span className="rounded-full bg-primary px-3 py-1 font-semibold text-primary-foreground">
            {user.role}
          </span>
        </div>
      </div>

      <DashboardMetrics role={user.role} />

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                backend.status === "verified"
                  ? "bg-muted text-foreground"
                  : backend.status === "error"
                    ? "bg-red-100 text-red-700"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {backend.status === "loading" ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <BadgeCheck size={18} />
              )}
            </span>

            <div>
              <h2 className="text-sm font-bold text-foreground">
                {backend.status === "loading"
                  ? "Verifying your dashboard access…"
                  : backend.status === "verified"
                    ? "Protected API connected"
                    : "Protected API unavailable"}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {backend.status === "loading"
                  ? `Calling GET ${roleApiPath[user.role]} with your JWT…`
                  : backend.status === "verified"
                    ? backend.message
                    : backend.message}
              </p>
            </div>
          </div>

          {backend.status === "error" ? (
            <Button
              type="button"
              onClick={handleRetry}
              variant="outline"
              size="sm"
              interaction="compact"
            >
              <RefreshCw size={15} />
              Retry
            </Button>
          ) : null}
        </div>
      </div>

      <section aria-label="Dashboard sections">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Quick access
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {actions.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-border hover:shadow-md"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground transition group-hover:bg-muted group-hover:text-foreground">
                <item.icon size={20} />
              </span>

              <h3 className="mt-4 flex items-center gap-1.5 font-bold text-foreground">
                {item.title}
                <ArrowRight
                  size={15}
                  className="text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-muted-foreground"
                />
              </h3>

              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                {actionDescriptions[user.role][item.url] ??
                  "Open this dashboard section."}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-44 rounded-2xl" />
      <Skeleton className="h-24 rounded-2xl" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    </div>
  );
}
