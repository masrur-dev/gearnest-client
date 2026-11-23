
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  CreditCard,
  Loader2,
  MapPin,
  Package,
  RefreshCw,
  Search,
  UserRound,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import { authFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import ButtonLink from "@/components/ui/button-link";
import { startCheckout } from "@/lib/payments";
import {
  BOOKING_STATUSES,
  bookingStatusMetaFor,
  formatMoney,
  paymentStatusMetaFor,
  type Booking,
} from "@/lib/booking";

type Scope = "customer" | "owner" | "admin";

type ApiResponse = {
  success?: boolean;
  message?: string;
  count?: number;
  total?: number;
  data?: Booking[];
};

const endpointFor: Record<Scope, string> = {
  customer: "/api/bookings",
  owner: "/api/bookings/owner/requests",
  admin: "/api/admin/bookings",
};

const scopeCopy: Record<
  Scope,
  { empty: string; searchPlaceholder?: string }
> = {
  customer: {
    empty: "You have not rented anything yet. Browse the catalogue to book your first item.",
  },
  owner: {
    empty: "No rental requests yet. Once customers book your listings they will show up here.",
  },
  admin: {
    empty: "No bookings match the current filter.",
    searchPlaceholder: "Search equipment, customer, email…",
  },
};

function isCancellable(status: string) {
  return status === "pending_payment" || status === "confirmed";
}

function canComplete(status: string) {
  return status === "confirmed" || status === "active";
}

export default function BookingList({
  scope,
  title,
}: {
  scope: Scope;
  title?: string;
}) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const loadRequestId = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++loadRequestId.current;
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (statusFilter) params.set("status", statusFilter);
      if (search.trim() && scope === "admin") {
        params.set("search", search.trim());
      }

      const query = params.toString();
      const response = await authFetch(
        `${endpointFor[scope]}${query ? `?${query}` : ""}`
      );

      const result = (await response.json()) as ApiResponse;

      if (response.status === 401) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.message || `Unable to load bookings (${response.status})`
        );
      }

      if (requestId === loadRequestId.current) {
        setBookings(Array.isArray(result.data) ? result.data : []);
      }
    } catch (err) {
      if (requestId === loadRequestId.current) {
        setError(
          err instanceof Error ? err.message : "Unable to load bookings"
        );
      }
    } finally {
      if (requestId === loadRequestId.current) {
        setLoading(false);
      }
    }
  }, [scope, statusFilter, search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, statusFilter || search ? 250 : 0);

    return () => window.clearTimeout(timer);
  }, [load, statusFilter, search]);

  async function postAction(
    booking: Booking,
    action: "cancel" | "decline" | "complete",
    confirmMessage: string
  ) {
    if (busyId) return;

    if (!window.confirm(confirmMessage)) return;

    setBusyId(booking.id);

    try {
      const response = await authFetch(
        `/api/bookings/${booking.id}/${action}`,
        { method: "POST" }
      );

      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
        refunded?: boolean;
      };

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.message || `Unable to ${action} this booking`
        );
      }

      if (result.refunded) {
        toast.success(result.message || "Booking cancelled and refunded");
      } else {
        toast.success(result.message || `Booking ${action}ed`);
      }

      await load();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setBusyId(null);
    }
  }

  async function payFor(booking: Booking) {
    if (busyId) return;
    setBusyId(booking.id);

    try {
      await startCheckout(booking.id);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to start checkout"
      );
      setBusyId(null);
    }
  }

  const visible = bookings;

  return (
    <div className="space-y-5">
      {title ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {loading
                ? "Loading…"
                : `${visible.length} booking${visible.length === 1 ? "" : "s"}`}
            </p>
          </div>

          <Button
            type="button"
            onClick={() => void load()}
            disabled={loading || Boolean(busyId)}
            variant="outline"
            size="sm"
            interaction="compact"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          aria-label="Filter by booking status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
        >
          <option value="">All statuses</option>
          {BOOKING_STATUSES.map((status) => (
            <option key={status} value={status}>
              {bookingStatusMetaFor(status).label}
            </option>
          ))}
        </select>

        {scope === "admin" ? (
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={scopeCopy.admin.searchPlaceholder}
              aria-label="Search bookings"
              className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>
        ) : null}
      </div>

      {loading ? (
        <div
          role="status"
          className="flex min-h-40 items-center justify-center gap-3 rounded-2xl border border-border bg-card text-sm text-muted-foreground shadow-sm"
        >
          <Loader2 size={17} className="animate-spin text-muted-foreground" />
          Loading bookings…
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/25 bg-destructive/10 p-6 text-sm text-destructive"
        >
          <p className="font-semibold">Unable to load bookings</p>
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
            {statusFilter || search ? "No matching bookings" : "No bookings yet"}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {scopeCopy[scope].empty}
          </p>
          {scope === "customer" && !statusFilter ? (
            <ButtonLink
              href="/equipment"
              className="mt-5"
            >
              Browse Equipment
            </ButtonLink>
          ) : null}
        </div>
      ) : (
        <ul className="space-y-4">
          {visible.map((booking) => {
            const status = bookingStatusMetaFor(booking.status);
            const payment = paymentStatusMetaFor(booking.paymentStatus);
            const busy = busyId === booking.id;

            return (
              <li
                key={booking.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-foreground">
                        {booking.equipmentName || "Equipment"}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>

                      {payment ? (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${payment.className}`}
                        >
                          {payment.label}
                        </span>
                      ) : null}
                    </div>

                    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={15} className="text-muted-foreground" />
                        {booking.startDate}
                        {booking.endDate !== booking.startDate
                          ? ` → ${booking.endDate}`
                          : ""}{" "}
                        · {booking.days} day{booking.days === 1 ? "" : "s"}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Package size={15} className="text-muted-foreground" />
                        Qty {booking.quantity} · {booking.rentalType}
                      </span>

                      <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                        <CreditCard size={15} className="text-muted-foreground" />
                        {formatMoney(booking.totalAmount, booking.currency)}
                      </span>
                    </p>

                    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {scope !== "customer" && booking.customerName ? (
                        <span className="inline-flex items-center gap-1.5">
                          <UserRound size={13} />
                          {booking.customerName}
                          {booking.customerEmail
                            ? ` · ${booking.customerEmail}`
                            : ""}
                        </span>
                      ) : null}

                      {scope === "customer" && booking.ownerName ? (
                        <span className="inline-flex items-center gap-1.5">
                          <UserRound size={13} />
                          Owner: {booking.ownerName}
                        </span>
                      ) : null}

                      {booking.paidAt ? (
                        <span>
                          Paid{" "}
                          {new Date(booking.paidAt).toLocaleDateString()}
                        </span>
                      ) : null}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:shrink-0">
                    {scope === "customer" &&
                    booking.status === "pending_payment" ? (
                      <>
                        <Button
                          type="button"
                          disabled={busy}
                          onClick={() => void payFor(booking)}
                          loading={busy}
                          size="sm"
                        >
                          {!busy && (
                            <CreditCard size={15} />
                          )}
                          Pay now
                        </Button>

                        <Button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            void postAction(
                              booking,
                              "cancel",
                              "Cancel this booking? Any open checkout session will be retired."
                            )
                          }
                          variant="destructive"
                          size="sm"
                          interaction="compact"
                        >
                          <XCircle size={15} />
                          Cancel
                        </Button>
                      </>
                    ) : null}

                    {scope === "customer" &&
                    booking.status === "confirmed" ? (
                      <Button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          void postAction(
                            booking,
                            "cancel",
                            booking.paymentStatus === "paid"
                              ? "Cancel this paid booking? It will be refunded automatically."
                              : "Cancel this booking?"
                          )
                        }
                        variant="destructive"
                        size="sm"
                        interaction="compact"
                      >
                        {busy ? (
                            <Loader2 size={15} className="motion-safe:animate-spin" />
                        ) : (
                          <XCircle size={15} />
                        )}
                        Cancel
                        {booking.paymentStatus === "paid" ? " & refund" : ""}
                      </Button>
                    ) : null}

                    {scope === "owner" &&
                    isCancellable(booking.status) ? (
                      <Button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          void postAction(
                            booking,
                            "decline",
                            booking.paymentStatus === "paid"
                              ? "Decline this request? The customer will be refunded automatically."
                              : "Decline this rental request?"
                          )
                        }
                        variant="destructive"
                        size="sm"
                        interaction="compact"
                      >
                        {busy ? (
                          <Loader2 size={15} className="motion-safe:animate-spin" />
                        ) : (
                          <XCircle size={15} />
                        )}
                        Decline
                      </Button>
                    ) : null}

                    {scope === "owner" &&
                    canComplete(booking.status) ? (
                      <Button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          void postAction(
                            booking,
                            "complete",
                            "Mark this rental as completed?"
                          )
                        }
                        variant="success"
                        size="sm"
                        interaction="compact"
                      >
                        {busy ? (
                          <Loader2 size={15} className="motion-safe:animate-spin" />
                        ) : (
                          <CheckCircle2 size={15} />
                        )}
                        Mark completed
                      </Button>
                    ) : null}

                    <ButtonLink
                      href={`/equipment/${booking.equipmentId}`}
                      variant="outline"
                      size="sm"
                      interaction="compact"
                    >
                      <MapPin size={15} />
                      View item
                    </ButtonLink>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
