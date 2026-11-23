"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Clock3, RefreshCw } from "lucide-react";
import ButtonLink from "@/components/ui/button-link";
import { Button } from "@/components/ui/button";
import { fetchSessionStatus } from "@/lib/payments";

type Verification =
  | { kind: "checking" }
  | { kind: "paid"; bookingStatus: string | null }
  | { kind: "pending" }
  | { kind: "expired" }
  | { kind: "error"; message: string };

async function verifyPayment(sessionId: string): Promise<Verification> {
  try {
    const result = await fetchSessionStatus(sessionId);

    if (result.paymentStatus === "paid") {
      return {
        kind: "paid",
        bookingStatus: result.bookingStatus ?? null,
      };
    }

    if (result.paymentStatus === "expired") {
      return { kind: "expired" };
    }

    if (result.paymentStatus === "pending") {
      return { kind: "pending" };
    }

    throw new Error("The server returned an unknown payment status.");
  } catch (error) {
    return {
      kind: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to verify this payment.",
    };
  }
}

export default function PaymentSuccessStatus({
  sessionId,
}: {
  sessionId: string;
}) {
  const [verification, setVerification] = useState<Verification>(
    sessionId
      ? { kind: "checking" }
      : { kind: "error", message: "The Stripe Checkout session ID is missing." }
  );

  useEffect(() => {
    if (!sessionId) return;

    let active = true;

    async function loadStatus() {
      const result = await verifyPayment(sessionId);
      if (active) setVerification(result);
    }

    void loadStatus();

    return () => {
      active = false;
    };
  }, [sessionId]);

  const isPaid = verification.kind === "paid";
  const isPending = verification.kind === "pending";
  const title =
    verification.kind === "checking"
      ? "Verifying Payment"
      : isPaid
        ? "Payment Confirmed"
        : isPending
          ? "Payment Processing"
          : verification.kind === "expired"
            ? "Checkout Expired"
            : "Payment Status Unavailable";

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-background px-4">
      <div
        className="w-full max-w-lg rounded-2xl border bg-card p-10 text-center shadow-sm"
        aria-live="polite"
      >
        {isPaid ? (
          <CheckCircle2 className="mx-auto size-16 text-success" aria-hidden="true" />
        ) : verification.kind === "checking" || isPending ? (
          <Clock3 className="mx-auto size-16 text-muted-foreground" aria-hidden="true" />
        ) : (
          <AlertCircle className="mx-auto size-16 text-destructive" aria-hidden="true" />
        )}

        <h1 className="mt-6 text-3xl font-bold text-foreground">{title}</h1>

        <p className="mt-4 text-muted-foreground">
          {verification.kind === "checking"
            ? "Checking your payment with GearNest. This may take a moment."
            : isPaid
              ? `Your payment is confirmed.${verification.bookingStatus ? ` Booking status: ${verification.bookingStatus}.` : ""}`
              : isPending
                ? "Stripe has returned your session, but payment is not confirmed yet. Check again shortly."
                : verification.kind === "expired"
                  ? "This checkout session expired before payment was confirmed. You can retry from your rentals."
                  : verification.message}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {(isPending || verification.kind === "error") && sessionId ? (
            <Button
              type="button"
              onClick={() => {
                setVerification({ kind: "checking" });
                void verifyPayment(sessionId).then(setVerification);
              }}
              variant="outline"
            >
              <RefreshCw size={16} aria-hidden="true" />
              Check Again
            </Button>
          ) : null}
          <ButtonLink href="/dashboard/customer/rentals">
            View My Rentals
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
