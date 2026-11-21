
"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Package,
  RefreshCw,
  Search,
} from "lucide-react";

type Equipment = {
  _id: string;
  name: string;
  category: string;
  rentalPrice: number;
  rentalType: string;
  location: string;
  availableQuantity: number;
  ownerName?: string;
  ownerId?: string;
  status?: string;
};

type ApiResponse = {
  success: boolean;
  count: number;
  data: Equipment[];
  message?: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export default function EquipmentListPanel({
  ownerFilter,
}: {
  ownerFilter?: { id: string; name: string };
}) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/api/equipment?sort=newest`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        const result: ApiResponse = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to fetch equipment"
          );
        }

        if (!controller.signal.aborted) {
          setEquipment(Array.isArray(result.data) ? result.data : []);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setEquipment([]);
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong"
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => controller.abort();
  }, []);

  const visible = equipment.filter((item) => {
    if (ownerFilter && item.ownerId !== ownerFilter.id) {
      return false;
    }

    if (!search.trim()) {
      return true;
    }

    const query = search.toLowerCase();

    return (
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div
        role="status"
        className="flex min-h-48 items-center justify-center gap-3 rounded-2xl border border-border bg-card text-sm text-muted-foreground shadow-sm"
      >
        <RefreshCw size={16} className="animate-spin text-muted-foreground" />
        Loading equipment…
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center"
      >
        <h2 className="font-bold text-red-700">
          Unable to load equipment
        </h2>
        <p className="mt-2 text-sm text-red-600">{error}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Check that the GearNest API server is running.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-sm sm:w-72">
          <Search size={15} className="text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Filter by name, category, location…"
            aria-label="Filter equipment"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        <p className="text-sm text-muted-foreground" aria-live="polite">
          {visible.length} listing
          {visible.length === 1 ? "" : "s"}
          {ownerFilter ? ` owned by ${ownerFilter.name}` : ""}
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-input bg-card p-10 text-center shadow-sm">
          <Package
            size={40}
            className="mx-auto text-muted-foreground"
          />
          <h2 className="mt-3 font-bold text-foreground">
            No equipment found
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {ownerFilter
              ? "The public catalogue has no approved listings attributed to your account yet."
              : "The catalogue is empty right now."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border bg-muted text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Equipment</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((item) => (
                  <tr key={item._id} className="hover:bg-muted">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">
                        {item.name}
                      </p>
                      {item.ownerName ? (
                        <p className="text-xs text-muted-foreground">
                          Listed by {item.ownerName}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 font-semibold text-foreground">
                      ${item.rentalPrice}
                      <span className="text-xs font-normal text-muted-foreground">
                        /
                        {item.rentalType
                          .toLowerCase()
                          .replace(/ly$/, "")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={13} aria-hidden="true" />
                        {item.location}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {item.availableQuantity > 0 ? (
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
                          {item.availableQuantity} available
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                          Unavailable
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs leading-5 text-muted-foreground">
        Data from <code className="font-mono">GET /api/equipment</code>
        {ownerFilter
          ? " — the API has no owner filter yet, so listings are matched to your account id in the browser."
          : " — the API returns up to 50 approved listings per request."}
      </p>
    </div>
  );
}
