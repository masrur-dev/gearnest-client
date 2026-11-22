import Link from "next/link";
import { Wrench } from "lucide-react";

import SubscribeForm from "@/components/layout/SubscribeForm";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "All Equipment", href: "/equipment" },
  { label: "About Us", href: "/about" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Contact Us", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="theme-deep-panel">
      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:py-14 lg:px-8">
        <div className="grid min-w-0 gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          {/* Brand + newsletter */}
          <div className="min-w-0">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="rounded-xl bg-white/15 p-2 text-white">
                <Wrench size={20} />
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                GearNest
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-white/70">
              Your trusted equipment rental marketplace. Find the right tools
              for every project, or turn your idle gear into income.
            </p>

            <div className="mt-6 max-w-md">
              <p className="mb-2 text-sm font-bold text-white">
                Subscribe to our newsletter
              </p>
              <SubscribeForm tone="dark" />
            </div>
          </div>

          {/* Quick links */}
          <div className="min-w-0">
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.16em] text-white">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-3 text-sm">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit text-white/70 transition-colors duration-200 hover:text-white motion-reduce:transition-none"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="min-w-0">
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.16em] text-white">
              Contact
            </h3>
            <p className="text-sm leading-7 text-white/70">
              Questions about a rental or a listing? Our team is ready to help
              you find the right gear.
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors duration-200 hover:text-white motion-reduce:transition-none"
            >
              Contact support
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/15 pt-6 text-sm text-white/75 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 GearNest. All rights reserved.</p>
          <p>Rent smarter. Own less.</p>
        </div>
      </div>
    </footer>
  );
}
