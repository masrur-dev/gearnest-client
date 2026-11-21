
"use client";

import { useState, type FormEvent } from "react";
import { CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { authFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";

type BookingFormProps = {
  equipmentId: string;
  equipmentName: string;
  rentalPrice: number;
  rentalType: "Daily" | "Weekly" | "Monthly";
  availableQuantity: number;
};

type Booking = {
  id: string;
  equipmentId: string;
  equipmentName: string;
  startDate: string;
  endDate: string;
  quantity: number;
  status: string;
  totalAmount: number;
};

type ApiResult<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
  url?: string;
  bookingId?: string;
};

async function request<T>(
  endpoint: string,
  init?: RequestInit
): Promise<ApiResult<T>> {
  const response = await authFetch(endpoint, init);
  const result = (await response.json()) as ApiResult<T>;

  if (!response.ok || result.success !== true) {
    throw new Error(
      result.message || `Request failed (${response.status})`
    );
  }

  return result;
}

function localToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function overlaps(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
) {
  return aStart <= bEnd && aEnd >= bStart;
}

export default function BookingForm({
  equipmentId,
  equipmentName,
  rentalPrice,
  rentalType,
  availableQuantity,
}: BookingFormProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pendingBookings, setPendingBookings] = useState<
    Booking[]
  >([]);

  const today = localToday();

  async function loadPendingBookings() {
    const result = await request<Booking[]>("/api/bookings");

    const pending = (result.data ?? []).filter(
      (booking) =>
        booking.equipmentId === equipmentId &&
        booking.status === "pending_payment"
    );

    setPendingBookings(pending);
    return pending;
  }

  async function startCheckout(bookingId: string) {
    const result = await request(
      "/api/payments/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId }),
      }
    );

    if (typeof result.url !== "string") {
      throw new Error("Stripe Checkout URL is missing.");
    }

    const url = new URL(result.url);

    if (
      url.protocol !== "https:" ||
      url.hostname !== "checkout.stripe.com"
    ) {
      throw new Error("Invalid Stripe Checkout URL.");
    }

    window.location.assign(url.href);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    if (loading) return;

    if (
      !startDate ||
      !endDate ||
      startDate < today ||
      endDate <= startDate
    ) {
      toast.error("Select a valid rental date range.");
      return;
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > availableQuantity
    ) {
      toast.error("Invalid quantity.");
      return;
    }

    setLoading(true);

    try {
      const pending = await loadPendingBookings();

      // Reuse existing booking for same dates and quantity.
      const existing = pending.find(
        (booking) =>
          booking.startDate === startDate &&
          booking.endDate === endDate &&
          booking.quantity === quantity
      );

      if (existing) {
        toast.info("Resuming your existing booking.");
        await startCheckout(existing.id);
        return;
      }

      // Avoid creating a conflicting hold.
      const conflict = pending.some((booking) =>
        overlaps(
          booking.startDate,
          booking.endDate,
          startDate,
          endDate
        )
      );

      if (conflict) {
        toast.error(
          "You already have a pending booking for overlapping dates. Cancel it or retry its payment below."
        );
        return;
      }

      const result = await request<Booking>(
        "/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            equipmentId,
            startDate,
            endDate,
            quantity,
          }),
        }
      );

      const bookingId =
        result.data?.id ?? result.bookingId;

      if (!bookingId) {
        throw new Error("Booking ID missing.");
      }

      // Save the newly created booking in the UI,
      // so checkout failure doesn't cause a duplicate.
      await loadPendingBookings();

      await startCheckout(bookingId);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Booking failed."
      );

      // Refresh pending reservations after a failed attempt.
      try {
        await loadPendingBookings();
      } catch {
        // Preserve the original error.
      }
    } finally {
      setLoading(false);
    }
  }

  async function retryPayment(bookingId: string) {
    if (loading) return;
    setLoading(true);

    try {
      await startCheckout(bookingId);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Payment retry failed."
      );
    } finally {
      setLoading(false);
    }
  }

  async function cancelBooking(bookingId: string) {
    if (loading) return;
    setLoading(true);

    try {
      await request(
        `/api/bookings/${bookingId}/cancel`,
        { method: "POST" }
      );

      toast.success("Booking cancelled.");
      await loadPendingBookings();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Cancellation failed."
      );
    } finally {
      setLoading(false);
    }
  }

  async function showPendingBookings() {
    if (loading) return;
    setLoading(true);

    try {
      const pending = await loadPendingBookings();

      if (!pending.length) {
        toast.info("No pending bookings for this equipment.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border/10 bg-card p-6 shadow-md shadow-[0_8px_25px_var(--theme-shadow)]">
      <div className="mb-5 flex items-center gap-3">
        <CalendarDays className="size-6 text-muted-foreground" />
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Book Equipment
          </h2>
          <p className="text-sm text-muted-foreground">
            {equipmentName}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-border/5 bg-accent/35 p-4">
        <p className="text-sm text-muted-foreground">
          Rental Price
        </p>
        <p className="text-2xl font-bold text-foreground">
          ${rentalPrice}
          <span className="ml-1 text-sm font-normal">
            / {rentalType}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="booking-start"
            className="mb-2 block text-sm font-medium"
          >
            Start Date
          </label>
          <input
            id="booking-start"
            type="date"
            min={today}
            value={startDate}
            disabled={loading}
            required
            onChange={(e) => {
              setStartDate(e.target.value);
              if (endDate <= e.target.value) {
                setEndDate("");
              }
            }}
            className="w-full rounded-xl border border-border/15 bg-card p-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
          />
        </div>

        <div>
          <label
            htmlFor="booking-end"
            className="mb-2 block text-sm font-medium"
          >
            End Date
          </label>
          <input
            id="booking-end"
            type="date"
            min={startDate || today}
            value={endDate}
            disabled={loading}
            required
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-xl border border-border/15 bg-card p-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
          />
        </div>

        <div>
          <label
            htmlFor="booking-quantity"
            className="mb-2 block text-sm font-medium"
          >
            Quantity
          </label>
          <input
            id="booking-quantity"
            type="number"
            min={1}
            max={availableQuantity}
            step={1}
            value={quantity}
            disabled={loading || availableQuantity < 1}
            required
            onChange={(e) =>
              setQuantity(Number(e.target.value))
            }
            className="w-full rounded-xl border border-border/15 bg-card p-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
          />
        </div>

        <Button
          type="submit"
          loading={loading}
          disabled={availableQuantity < 1}
          className="w-full"
        >
          {loading ? "Processing..." : "Book & Pay"}
        </Button>
      </form>

      <Button
        type="button"
        onClick={showPendingBookings}
        disabled={loading}
        variant="secondary"
        className="mt-4 w-full"
      >
        Manage Pending Bookings
      </Button>

      {pendingBookings.length > 0 && (
        <div className="mt-5 space-y-3 border-t pt-4">
          <h3 className="font-bold text-foreground">
            Your Pending Bookings
          </h3>

          {pendingBookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-xl border border-border bg-muted p-3"
            >
              <p className="text-sm font-medium text-foreground">
                {booking.startDate} to {booking.endDate}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Quantity: {booking.quantity}
              </p>

              <div className="mt-3 flex gap-2">
                <Button
                  type="button"
                  disabled={loading}
                  onClick={() => retryPayment(booking.id)}
                  size="sm"
                  className="flex-1"
                >
                  Retry Payment
                </Button>

                <Button
                  type="button"
                  disabled={loading}
                  onClick={() => cancelBooking(booking.id)}
                  variant="destructive"
                  size="sm"
                  interaction="compact"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
