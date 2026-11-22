
// import { DashboardPageHeader, InfoBanner } from "@/components/dashboard/dashboard-ui";
// import EquipmentListPanel from "@/components/dashboard/EquipmentListPanel";

// export default function AdminEquipmentPage() {
//   return (
//     <>
//       <DashboardPageHeader
//         title="All Equipment"
//         description="Every approved listing currently published on GearNest."
//       />

//       <InfoBanner>
//         Equipment data comes from the public{" "}
//         <code className="font-mono">GET /api/equipment</code>{" "}
//         endpoint — the API does not expose pending or rejected
//         listings, so only approved items appear here.
//       </InfoBanner>

//       <EquipmentListPanel />
//     </>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Package,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { authFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";

type Equipment = {
  _id: string;
  name: string;
  category: string;
  brand: string;
  location: string;
  rentalPrice: number;
  rentalType: string;
  ownerName?: string;
  status: string;
};

export default function AdminEquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(
    null
  );

  async function fetchEquipment() {
    const response = await authFetch(
      "/api/admin/approvals/equipment"
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to load equipment"
      );
    }

    return result.data as Equipment[];
  }

  useEffect(() => {
    let active = true;

    fetchEquipment()
      .then((data) => {
        if (active) {
          setEquipment(data);
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load equipment"
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function refreshEquipment() {
    setLoading(true);
    setError("");

    try {
      const data = await fetchEquipment();
      setEquipment(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to refresh equipment"
      );
    } finally {
      setLoading(false);
    }
  }

  async function reviewEquipment(
    id: string,
    status: "approved" | "rejected",
    reason?: string
  ) {
    if (processingId) return;

    setProcessingId(id);

    try {
      const body: Record<string, string> = { status };

      if (status === "rejected") {
        body.reason = reason ?? "";
      }

      const response = await authFetch(
        `/api/admin/approvals/equipment/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to update equipment"
        );
      }

      setEquipment((previous) =>
        previous.filter((item) => item._id !== id)
      );

      toast.success(result.message);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setProcessingId(null);
    }
  }

  function rejectEquipment(item: Equipment) {
    if (processingId) return;

    const reason = window.prompt(
      `Reject “${item.name}”?\n\nEnter a reason for the owner (required, max 500 characters):`
    );

    if (reason === null) return;

    const trimmed = reason.trim();

    if (!trimmed) {
      toast.error("A rejection reason is required.");
      return;
    }

    if (trimmed.length > 500) {
      toast.error("The reason must be 500 characters or fewer.");
      return;
    }

    void reviewEquipment(item._id, "rejected", trimmed);
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Equipment Approval
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review equipment submitted by owners.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => void refreshEquipment()}
          disabled={loading || Boolean(processingId)}
          variant="outline"
          size="sm"
          interaction="compact"
        >
          <RefreshCw size={16} />
          Refresh
        </Button>
      </div>

      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-muted p-3 text-foreground">
            <Package size={24} />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Pending Equipment
            </p>
            <p className="text-2xl font-bold text-foreground">
              {loading ? "..." : error ? "—" : equipment.length}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl border bg-card p-12">
          <Loader2 className="animate-spin text-muted-foreground" />
          <span>Loading equipment...</span>
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/25 bg-destructive/10 p-6 text-destructive"
        >
          {error}
        </div>
      ) : equipment.length === 0 ? (
        <div className="rounded-2xl border bg-card p-12 text-center">
          <CheckCircle2
            size={48}
            className="mx-auto mb-4 text-muted-foreground"
          />
          <h2 className="text-xl font-bold text-foreground">
            All Caught Up!
          </h2>
          <p className="mt-2 text-muted-foreground">
            No equipment is waiting for approval.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {equipment.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-foreground">
                      {item.name}
                    </h2>

                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                      Pending
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {item.brand} • {item.category}
                  </p>

                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={15} />
                    {item.location}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Owner: {item.ownerName || "Unknown"}
                  </p>

                  <p className="font-semibold text-foreground">
                    ${item.rentalPrice} / {item.rentalType}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    disabled={Boolean(processingId)}
                    onClick={() =>
                      void reviewEquipment(
                        item._id,
                        "approved"
                      )
                    }
                    variant="success"
                    size="sm"
                    interaction="compact"
                  >
                    {processingId === item._id ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <CheckCircle2 size={17} />
                    )}
                    Approve
                  </Button>

                  <Button
                    type="button"
                    disabled={Boolean(processingId)}
                    onClick={() => rejectEquipment(item)}
                    variant="destructive"
                    size="sm"
                    interaction="compact"
                  >
                    <XCircle size={17} />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
