
export const BOOKING_STATUSES = [
  "pending_payment",
  "confirmed",
  "active",
  "completed",
  "cancelled",
  "expired",
  "refunded",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | null;

export type Booking = {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImage?: string;
  ownerId: string;
  ownerName: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  quantity: number;
  rentalType: string;
  startDate: string;
  endDate: string;
  days: number;
  units: number;
  unitPrice: number;
  totalAmount: number;
  currency: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paidAt: string | null;
  stripeSessionId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

type StatusMeta = {
  label: string;
  className: string;
};

export const bookingStatusMeta: Record<BookingStatus, StatusMeta> = {
  pending_payment: {
    label: "Awaiting payment",
    className: "bg-accent text-accent-foreground",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-success text-success-foreground",
  },
  active: {
    label: "Active",
    className: "bg-success text-success-foreground",
  },
  completed: {
    label: "Completed",
    className: "bg-muted text-foreground",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-destructive/15 text-destructive",
  },
  expired: {
    label: "Expired",
    className: "bg-muted text-muted-foreground",
  },
  refunded: {
    label: "Refunded",
    className: "bg-success text-success-foreground",
  },
};

export const paymentStatusMeta: Record<
  Exclude<PaymentStatus, null>,
  StatusMeta
> = {
  pending: {
    label: "Payment pending",
    className: "bg-accent text-accent-foreground",
  },
  paid: {
    label: "Paid",
    className: "bg-success text-success-foreground",
  },
  failed: {
    label: "Payment failed",
    className: "bg-destructive/15 text-destructive",
  },
  refunded: {
    label: "Refunded",
    className: "bg-success text-success-foreground",
  },
};

export function isBookingStatus(
  value: unknown
): value is BookingStatus {
  return (
    typeof value === "string" &&
    (BOOKING_STATUSES as readonly string[]).includes(value)
  );
}

export function bookingStatusMetaFor(
  status: string
): StatusMeta {
  if (isBookingStatus(status)) {
    return bookingStatusMeta[status];
  }

  return { label: status, className: "bg-muted text-muted-foreground" };
}

export function paymentStatusMetaFor(
  status: PaymentStatus
): StatusMeta | null {
  if (status && status in paymentStatusMeta) {
    return paymentStatusMeta[status];
  }

  return null;
}

export function formatMoney(
  amount: number,
  currency = "usd"
): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export function formatDateRange(
  startDate: string,
  endDate: string
): string {
  return startDate === endDate ? startDate : `${startDate} → ${endDate}`;
}
