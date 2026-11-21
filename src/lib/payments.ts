
import { authFetch } from "./api";

type CheckoutResult = {
  success?: boolean;
  message?: string;
  url?: string;
};

/**
 * Creates (or reuses) a Stripe Checkout session for the booking and
 * redirects the browser to Stripe. The server always answers with a
 * `checkout.stripe.com` URL — anything else is treated as a contract
 * violation and never opened.
 */
export async function startCheckout(
  bookingId: string
): Promise<void> {
  const response = await authFetch(
    "/api/payments/create-checkout-session",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
    }
  );

  const result = (await response.json()) as CheckoutResult;

  if (!response.ok || result.success !== true) {
    throw new Error(
      result.message || `Checkout failed (${response.status})`
    );
  }

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

export type SessionStatus = {
  success?: boolean;
  message?: string;
  paymentStatus?: "paid" | "pending" | "expired";
  bookingStatus?: string | null;
};

/**
 * Asks the server for the authoritative state of a Checkout
 * session. The success page never trusts the redirect alone.
 */
export async function fetchSessionStatus(
  sessionId: string
): Promise<SessionStatus> {
  const response = await authFetch(
    `/api/payments/session/${encodeURIComponent(sessionId)}`
  );

  const result = (await response.json()) as SessionStatus;

  if (!response.ok || result.success !== true) {
    throw new Error(
      result.message || `Unable to verify payment (${response.status})`
    );
  }

  return result;
}
