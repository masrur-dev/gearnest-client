
import Link from "next/link";
import { Wrench } from "lucide-react";

export default function Footer() {
  return (
    <footer className="theme-deep-panel text-muted-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3 lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-2 text-white">
            <Wrench className="text-muted-foreground" />
            <span className="text-2xl font-bold">
              GearNest
            </span>
          </div>
          <p className="max-w-sm text-sm leading-7 text-muted-foreground">
            Your trusted equipment rental marketplace.
            Find the right tools for every project.
          </p>
        </div>

        <div>
          <h3 className="mb-5 font-bold text-white">
            Quick Links
          </h3>
          <div className="flex flex-col gap-3 text-sm">
            <Link href="/">Home</Link>
            <Link href="/equipment">All Equipment</Link>
            <Link href="/about">About Us</Link>
            <Link href="/#how-it-works">
              How It Works
            </Link>
            <Link href="/contact">Contact Us</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-5 font-bold text-white">
            Contact
          </h3>
          <p className="text-sm leading-7">
            Need help with a rental or listing? Our contact page has the
            support details and account links you need.
          </p>
          <Link href="/contact" className="mt-3 inline-block text-sm font-semibold text-muted-foreground hover:text-muted-foreground">
            Get in touch →
          </Link>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        © 2026 GearNest. All rights reserved.
      </div>
    </footer>
  );
}
