
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { authFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type FavoriteEntry = {
  equipmentId: string;
};

export default function FavoriteButton({
  equipmentId,
  equipmentName,
  iconOnly = false,
  className,
}: {
  equipmentId: string;
  equipmentName: string;
  iconOnly?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [favorited, setFavorited] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [favoriteLoadError, setFavoriteLoadError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function check() {
      try {
        const response = await authFetch("/api/favorites");

        if (!active) return;

        if (response.status === 401) {
          setFavorited(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`Unable to load favorites (${response.status}).`);
        }

        const result = (await response.json()) as {
          success?: boolean;
          data?: FavoriteEntry[];
        };

        if (!active) return;

        if (result.success !== true || !Array.isArray(result.data)) {
          throw new Error("The favorites response was invalid.");
        }

        setFavorited(result.data.some((entry) => entry.equipmentId === equipmentId));
      } catch (error) {
        if (!active) return;

        if (
          error instanceof Error &&
          error.message === "Authentication required"
        ) {
          setFavorited(false);
          return;
        }

        setFavoriteLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load favorite status."
        );
      }
    }

    void check();

    return () => {
      active = false;
    };
  }, [equipmentId, retryCount]);

  async function toggle() {
    if (busy) return;

    if (favorited === null) return;

    // Anonymous visitors are sent to the login page first.
    if (!favorited) {
      try {
        const probe = await authFetch("/api/dashboard/me");

        if (probe.status === 401) {
          router.push(
            `/login?callbackUrl=${encodeURIComponent(
              `/equipment/${equipmentId}`
            )}`
          );
          return;
        }
      } catch {
        router.push(
          `/login?callbackUrl=${encodeURIComponent(
            `/equipment/${equipmentId}`
          )}`
        );
        return;
      }
    }

    setBusy(true);

    try {
      const response = await authFetch(
        `/api/favorites/${equipmentId}`,
        { method: favorited ? "DELETE" : "POST" }
      );

      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || "Unable to update favorites");
      }

      setFavorited(!favorited);
      toast.success(
        favorited
          ? "Removed from favorites"
          : `Saved “${equipmentName}” to favorites`
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setBusy(false);
    }
  }

  if (favorited === null) {
    if (favoriteLoadError) {
      return (
        <Button
          type="button"
          onClick={() => {
            setFavoriteLoadError("");
            setFavorited(null);
            setRetryCount((count) => count + 1);
          }}
          aria-label="Retry loading favorite status"
          title={favoriteLoadError}
          variant="outline"
          size={iconOnly ? "icon-sm" : "sm"}
          interaction="compact"
          className={className}
        >
          <AlertCircle size={16} aria-hidden="true" />
          {!iconOnly && "Retry"}
        </Button>
      );
    }

    return (
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex items-center justify-center border border-border bg-card text-muted-foreground",
          iconOnly ? "size-8 rounded-full" : "size-11 rounded-xl",
          className,
        )}
      >
        <Loader2 size={18} className="animate-spin" />
      </span>
    );
  }

  return (
    <Button
      type="button"
      onClick={() => void toggle()}
      disabled={busy}
      aria-pressed={favorited}
      aria-label={
        favorited ? "Remove from favorites" : "Add to favorites"
      }
      title={favorited ? "Remove from favorites" : "Add to favorites"}
      variant={favorited ? "secondary" : "outline"}
      size={iconOnly ? "icon-sm" : "sm"}
      interaction="compact"
      className={className}
    >
      {busy ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Heart
          size={16}
          fill={favorited ? "currentColor" : "none"}
        />
      )}
      {!iconOnly && (favorited ? "Saved" : "Save")}
    </Button>
  );
}
