
import { XCircle, ArrowLeft } from "lucide-react";
import ButtonLink from "@/components/ui/button-link";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg rounded-2xl border bg-card p-10 text-center shadow-sm">
        <XCircle className="mx-auto size-16 text-muted-foreground" />

        <h1 className="mt-6 text-3xl font-bold text-foreground">
          Checkout Cancelled
        </h1>

        <p className="mt-4 text-muted-foreground">
          Checkout was cancelled. Your existing
          booking may still be awaiting payment.
        </p>

        <ButtonLink
          href="/dashboard/customer/rentals"
          className="mt-8"
        >
          My Rentals
          <ArrowLeft size={18} data-button-arrow />
        </ButtonLink>
      </div>
    </main>
  );
}
