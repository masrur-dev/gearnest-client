import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact GearNest",
  description: "Get help with finding equipment or using GearNest.",
};

export default function ContactPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;

  return (
    <main className="min-h-[70vh] bg-background px-5 py-16 text-foreground">
      <div className="mx-auto max-w-4xl">
        <p className="font-semibold text-foreground">Contact</p>
        <h1 className="mt-2 text-4xl font-extrabold">How can we help?</h1>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
          For help with a rental, account, or equipment listing, include the
          email address on your GearNest account and any relevant booking or
          listing details when contacting support.
        </p>

        <div className="mt-9 grid gap-5 md:grid-cols-2">
          {supportEmail ? (
            <a
              href={`mailto:${supportEmail}?subject=GearNest%20support`}
              className="rounded-2xl border bg-card p-6 shadow-sm transition hover:border-border"
            >
              <Mail className="size-7 text-muted-foreground" />
              <h2 className="mt-4 text-lg font-bold">Email support</h2>
              <p className="mt-2 break-all text-sm text-muted-foreground">
                {supportEmail}
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-foreground">
                Open your email app →
              </span>
            </a>
          ) : (
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <Mail className="size-7 text-muted-foreground" />
              <h2 className="mt-4 text-lg font-bold">Email support</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                GearNest support email is being configured. Please check back
                soon.
              </p>
            </div>
          )}

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <MessageCircle className="size-7 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-bold">Rental question?</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Review your bookings, payment status, and rental details from
              your dashboard.
            </p>
            <Link
              href="/dashboard/customer/rentals"
              className="mt-4 inline-block text-sm font-semibold text-foreground"
            >
              Go to My Rentals →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
