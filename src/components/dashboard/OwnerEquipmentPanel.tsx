
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Loader2,
  MapPin,
  Package,
  Pencil,
  PlusCircle,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { authFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import ButtonLink from "@/components/ui/button-link";
import { formatMoney } from "@/lib/booking";

type OwnerEquipment = {
  _id: string;
  name: string;
  category: string;
  location: string;
  rentalPrice: number;
  rentalType: string;
  availableQuantity: number;
  status: string;
  brand?: string;
  createdAt?: string;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  data?: OwnerEquipment[];
};

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending review" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
] as const;

const statusBadge: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-accent text-accent-foreground" },
  approved: { label: "Approved", className: "bg-success text-success-foreground" },
  rejected: { label: "Rejected", className: "bg-destructive/15 text-destructive" },
  removed: { label: "Removed", className: "bg-muted text-muted-foreground" },
};

export default function OwnerEquipmentPanel() {
  const [equipment, setEquipment] = useState<OwnerEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<(typeof STATUS_TABS)[number]["key"]>("all");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await authFetch("/api/owner/equipment");
      const result = (await response.json()) as ApiResponse;

      if (response.status === 401) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      if (response.status === 403) {
        throw new Error("Owner access is required to view your listings.");
      }

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.message || `Unable to load listings (${response.status})`
        );
      }

      setEquipment(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load listings"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function removeEquipment(item: OwnerEquipment) {
    if (busyId) return;

    const confirmed = window.confirm(
      `Remove “${item.name}” from your listings?`
    );
    if (!confirmed) return;

    setBusyId(item._id);

    try {
      const response = await authFetch(
        `/api/owner/equipment/${item._id}`,
        { method: "DELETE" }
      );

      const result = (await response.json()) as ApiResponse;

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || "Unable to remove listing");
      }

      setEquipment((previous) =>
        previous.filter((entry) => entry._id !== item._id)
      );
      toast.success(result.message || "Listing removed");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setBusyId(null);
    }
  }

  const visible = equipment.filter((item) => {
    const matchesTab = tab === "all" || item.status === tab;

    if (!matchesTab) return false;
    if (!search.trim()) return true;

    const query = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query)
    );
  });

  const counts = {
    all: equipment.length,
    pending: equipment.filter((e) => e.status === "pending").length,
    approved: equipment.filter((e) => e.status === "approved").length,
    rejected: equipment.filter((e) => e.status === "rejected").length,
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((entry) => (
            <Button
              key={entry.key}
              type="button"
              onClick={() => setTab(entry.key)}
              variant={tab === entry.key ? "secondary" : "outline"}
              size="sm"
              interaction="compact"
            >
              {entry.label}
              <span className="ml-1.5 text-xs opacity-80">
                {counts[entry.key]}
              </span>
            </Button>
          ))}
        </div>

        <div className="flex w-full gap-2 sm:w-auto">
          <div className="relative min-w-0 flex-1 sm:flex-none">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Filter listings…"
              aria-label="Filter your listings"
              className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary sm:w-56"
            />
          </div>

          <Button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            variant="outline"
            size="sm"
            interaction="compact"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div
          role="status"
          className="flex min-h-40 items-center justify-center gap-3 rounded-2xl border border-border bg-card text-sm text-muted-foreground shadow-sm"
        >
          <Loader2 size={17} className="animate-spin text-muted-foreground" />
          Loading your listings…
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/25 bg-destructive/10 p-6 text-sm text-destructive"
        >
          <p className="font-semibold">Unable to load listings</p>
          <p className="mt-1">{error}</p>
          <Button
            type="button"
            onClick={() => void load()}
            variant="outline"
            size="sm"
          >
            Try again
          </Button>
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-input bg-card px-6 py-12 text-center shadow-sm">
          <Package size={40} className="mx-auto text-muted-foreground" />
          <h3 className="mt-3 font-bold text-foreground">
            {tab === "all" && !search
              ? "No listings yet"
              : "No listings match this filter"}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {tab === "all" && !search
              ? "Add your first piece of equipment to start renting it out."
              : "Try another tab or clear the search."}
          </p>
          <ButtonLink
            href="/dashboard/owner/add-equipment"
            className="mt-5"
          >
            <PlusCircle size={16} />
            Add Equipment
          </ButtonLink>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-border bg-muted text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Equipment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visible.map((item) => {
                  const badge =
                    statusBadge[item.status] ?? statusBadge.removed;
                  const busy = busyId === item._id;

                  return (
                    <tr key={item._id} className="hover:bg-muted">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-foreground">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.brand ? `${item.brand} · ` : ""}
                          {item.category}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-semibold text-foreground">
                        {formatMoney(item.rentalPrice)}
                        <span className="text-xs font-normal text-muted-foreground">
                          /{item.rentalType.toLowerCase()}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {item.availableQuantity}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={13} aria-hidden="true" />
                          {item.location}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {item.status === "approved" ? (
                            <ButtonLink
                              href={`/equipment/${item._id}`}
                              variant="outline"
                              size="xs"
                              interaction="compact"
                            >
                              View
                            </ButtonLink>
                          ) : null}

                          <ButtonLink
                            href={`/dashboard/owner/add-equipment?edit=${item._id}`}
                            variant="outline"
                            size="xs"
                            interaction="compact"
                          >
                            <Pencil size={13} />
                            Edit
                          </ButtonLink>

                          <Button
                            type="button"
                            disabled={busy}
                            onClick={() => void removeEquipment(item)}
                            variant="destructive"
                            size="xs"
                            interaction="compact"
                          >
                            {busy ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Trash2 size={13} />
                            )}
                            Remove
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs leading-5 text-muted-foreground">
        Data from <code className="font-mono">GET /api/owner/equipment</code>{" "}
        — your listings in every state, including items still waiting
        for approval.
      </p>
    </div>
  );
}
