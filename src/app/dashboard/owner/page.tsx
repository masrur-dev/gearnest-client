
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authFetch } from "@/lib/api";
import ButtonLink from "@/components/ui/button-link";
import {
  Package,
  PlusCircle,
  ClipboardList,
  ShieldAlert,
} from "lucide-react";

type Owner = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function OwnerDashboardPage() {
  const [user, setUser] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function checkAccess() {
      try {
        const response = await authFetch(
          "/api/dashboard/owner"
        );

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error(
              "Access denied. Owner role is required."
            );
          }

          throw new Error(
            "Unable to verify dashboard access."
          );
        }

        const data = await response.json();

        if (active) {
          setUser(data.user);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Access verification failed."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    checkAccess();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center">
        Checking Owner permissions...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border bg-card p-10 text-center">
        <ShieldAlert
          size={44}
          className="mx-auto mb-4 text-destructive"
        />

        <h1 className="text-2xl font-bold">
          Access Restricted
        </h1>

        <p className="mt-3 text-muted-foreground">
          {error || "Owner access required."}
        </p>

        <ButtonLink
          href="/dashboard"
          variant="secondary"
          className="mt-6"
        >
          Return to Dashboard
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Owner Dashboard
        </h1>

        <p className="mt-2 text-muted-foreground">
          Welcome back, {user.name}.
          Manage your rental equipment here.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {[
          {
            title: "My Equipment",
            icon: Package,
            href: "/dashboard/owner/equipment",
          },
          {
            title: "Add Equipment",
            icon: PlusCircle,
            href: "/dashboard/owner/add-equipment",
          },
          {
            title: "Equipment Rentals",
            icon: ClipboardList,
            href: "/dashboard/owner/rentals",
          },
        ].map((item) => (
          <Link
            href={item.href}
            key={item.title}
            className="rounded-2xl border bg-card p-6 shadow-sm transition hover:shadow-md"
          >
            <item.icon
              size={30}
              className="mb-5 text-muted-foreground"
            />

            <h2 className="text-lg font-bold">
              {item.title}
            </h2>

            <p className="mt-3 text-sm text-muted-foreground">
              Open {item.title.toLowerCase()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
