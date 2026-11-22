"use client";

import { useEffect, useState } from "react";
import { Activity, CreditCard, Package, Users } from "lucide-react";
import { authFetch } from "@/lib/api";
import { formatMoney } from "@/lib/booking";
import type { UserRole } from "@/lib/roles";

type Row = { status?: string; paymentStatus?: string; totalAmount?: number; currency?: string };
type Result = { success?: boolean; data?: Row[]; count?: number };
type Metric = { label: string; value: string; icon: typeof Activity; note?: string };

async function get<T extends Result>(path: string): Promise<T> {
  const response = await authFetch(path);
  const payload = (await response.json()) as T;
  if (!response.ok || payload.success !== true) throw new Error("Metrics unavailable");
  return payload;
}

export default function DashboardMetrics({ role }: { role: UserRole }) {
  const [metrics, setMetrics] = useState<Metric[] | null>(null);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      const load = async () => {
        const jobs = role === "Customer"
          ? [get("/api/bookings")]
          : role === "Owner"
            ? [get("/api/owner/equipment"), get("/api/bookings/owner/requests")]
            : [get("/api/admin/role-management/users"), get("/api/admin/bookings"), get("/api/admin/approvals/equipment")];
        const results = await Promise.allSettled(jobs);
        if (!active) return;
        const values = results.map((result) => result.status === "fulfilled" ? result.value : null);
        const rows = (result: Result | null) => result?.data ?? [];
        let next: Metric[];

        if (role === "Customer") {
          const bookings = rows(values[0]);
          const paid = bookings.filter((booking) => booking.paymentStatus === "paid");
          const total = paid.reduce((sum, booking) => sum + (booking.totalAmount ?? 0), 0);
          next = [
            { label: "My bookings", value: values[0] ? String(bookings.length) : "—", icon: Package },
            { label: "In progress", value: values[0] ? String(bookings.filter((booking) => ["confirmed", "active"].includes(booking.status ?? "")).length) : "—", icon: Activity },
            { label: "Paid rental total", value: values[0] ? formatMoney(total, paid[0]?.currency || "usd") : "—", icon: CreditCard, note: "Across paid bookings" },
          ];
        } else if (role === "Owner") {
          const equipment = rows(values[0]);
          const bookings = rows(values[1]);
          const paid = bookings.filter((booking) => booking.paymentStatus === "paid");
          const total = paid.reduce((sum, booking) => sum + (booking.totalAmount ?? 0), 0);
          next = [
            { label: "My listings", value: values[0] ? String(equipment.length) : "—", icon: Package },
            { label: "Rental requests", value: values[1] ? String(bookings.length) : "—", icon: Activity },
            { label: "Gross rental volume", value: values[1] ? formatMoney(total, paid[0]?.currency || "usd") : "—", icon: CreditCard, note: "Paid bookings before fees" },
          ];
        } else {
          const users = rows(values[0]);
          const bookings = rows(values[1]);
          const pending = rows(values[2]);
          next = [
            { label: "Registered users", value: values[0] ? String(users.length) : "—", icon: Users },
            { label: "All bookings", value: values[1] ? String(bookings.length) : "—", icon: Activity },
            { label: "Pending equipment", value: values[2] ? String(pending.length) : "—", icon: Package },
          ];
        }
        setMetrics(next);
      };
      void load();
    }, 0);
    return () => { active = false; window.clearTimeout(timer); };
  }, [role]);

  return (
    <section aria-label="Dashboard summary" className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
      {(metrics ?? [
        { label: "Loading summary", value: "…", icon: Activity },
        { label: "Loading summary", value: "…", icon: Package },
        { label: "Loading summary", value: "…", icon: CreditCard },
      ]).map((metric, index) => (
        <article key={`${metric.label}-${index}`} className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between"><p className="text-sm font-medium text-muted-foreground">{metric.label}</p><span className="rounded-xl bg-muted p-2.5 text-foreground"><metric.icon size={18}/></span></div>
          <p className="mt-4 break-words text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{metric.value}</p>
          {metric.note && <p className="mt-1 text-xs text-muted-foreground">{metric.note}</p>}
        </article>
      ))}
    </section>
  );
}
