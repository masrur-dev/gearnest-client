
import { CheckCircle2, ArrowRight } from "lucide-react";
import ButtonLink from "@/components/ui/button-link";

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg rounded-2xl border bg-card p-10 text-center shadow-sm">
        <CheckCircle2 className="mx-auto size-16 text-muted-foreground" />

        <h1 className="mt-6 text-3xl font-bold text-foreground">
          Payment Submitted
        </h1>

        <p className="mt-4 text-muted-foreground">
          You have returned from Stripe Checkout.
          Your payment status will be confirmed
          after server verification.
        </p>

        <ButtonLink
          href="/dashboard/customer/rentals"
          className="mt-8"
        >
          View My Rentals
          <ArrowRight size={18} data-button-arrow />
        </ButtonLink>
      </div>
    </main>
  );
}
