
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Heart,
  Loader2,
  MapPin,
  Package,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { authFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import ButtonLink from "@/components/ui/button-link";
import { formatMoney } from "@/lib/booking";

type FavoriteEquipment = {
  _id: string;
  name: string;
  category: string;
  location: string;
  rentalPrice: number;
  rentalType: string;
  availableQuantity: number;
  image?: string;
  status?: string;
};

type Favorite = {
  id: string;
  equipmentId: string;
  createdAt: string | null;
  equipment: FavoriteEquipment | null;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  data?: Favorite[];
};

export default function FavoritesList() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await authFetch("/api/favorites");
      const result = (await response.json()) as ApiResponse;

      if (response.status === 401) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.message || `Unable to load favorites (${response.status})`
        );
      }

      setFavorites(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load favorites"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function removeFavorite(favorite: Favorite) {
    if (busyId) return;
    setBusyId(favorite.equipmentId);

    try {
      const response = await authFetch(
        `/api/favorites/${favorite.equipmentId}`,
        { method: "DELETE" }
      );

      const result = (await response.json()) as ApiResponse;

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || "Unable to remove favorite");
      }

      setFavorites((previous) =>
        previous.filter((item) => item.id !== favorite.id)
      );
      toast.success("Removed from favorites");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <div
        role="status"
        className="flex min-h-40 items-center justify-center gap-3 rounded-2xl border border-border bg-card text-sm text-muted-foreground shadow-sm"
      >
        <Loader2 size={17} className="animate-spin text-muted-foreground" />
        Loading favorites…
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700"
      >
        <p className="font-semibold">Unable to load favorites</p>
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
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-input bg-card px-6 py-12 text-center shadow-sm">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-muted">
          <Heart className="size-7 text-muted-foreground" />
        </div>

        <h2 className="text-xl font-bold text-foreground">
          No favorites saved yet
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          Tap the heart on any equipment page to keep it here for
          later.
        </p>

        <ButtonLink
          href="/equipment"
          className="mt-6"
        >
          Find Equipment to Save
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {favorites.length} saved item
        {favorites.length === 1 ? "" : "s"}
      </p>

      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {favorites.map((favorite) => {
          const equipment = favorite.equipment;
          const busy = busyId === favorite.equipmentId;

          if (!equipment) {
            return (
              <li
                key={favorite.id}
                className="rounded-2xl border border-dashed border-input bg-card p-5 text-sm text-muted-foreground"
              >
                <p className="font-semibold text-foreground">
                  Listing no longer available
                </p>
                <p className="mt-1">
                  This item was removed from the catalogue.
                </p>
                <Button
                  type="button"
                  disabled={busy}
                  onClick={() => void removeFavorite(favorite)}
                  variant="destructive"
                  size="xs"
                  interaction="compact"
                >
                  {busy ? "Removing…" : "Remove"}
                </Button>
              </li>
            );
          }

          const available = equipment.availableQuantity > 0;

          return (
            <li
              key={favorite.id}
              className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                    {equipment.category}
                  </span>

                  <h3 className="mt-3 font-bold text-foreground">
                    {equipment.name}
                  </h3>
                </div>

                <Button
                  type="button"
                  aria-label={`Remove ${equipment.name} from favorites`}
                  disabled={busy}
                  onClick={() => void removeFavorite(favorite)}
                  variant="ghost"
                  size="icon-sm"
                  interaction="compact"
                  className="rounded-full"
                >
                  {busy ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Heart size={17} fill="currentColor" />
                  )}
                </Button>
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin size={14} />
                {equipment.location}
              </p>

              <p className="mt-3 text-lg font-bold text-foreground">
                {formatMoney(equipment.rentalPrice)}
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  / {equipment.rentalType.toLowerCase()}
                </span>
              </p>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
                {available ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                    <Package size={13} />
                    {equipment.availableQuantity} available
                  </span>
                ) : (
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                    Unavailable
                  </span>
                )}

                <ButtonLink
                  href={`/equipment/${equipment._id}`}
                  variant="ghost"
                  size="sm"
                  interaction="compact"
                >
                  View details →
                </ButtonLink>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          variant="outline"
          size="sm"
          interaction="compact"
        >
          <RefreshCw size={15} />
          Refresh
        </Button>
      </div>
    </div>
  );
}
