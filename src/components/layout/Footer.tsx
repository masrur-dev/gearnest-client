
import Link from "next/link";
import { Wrench } from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-slate-950 text-slate-300"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3 lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-2 text-white">
            <Wrench className="text-amber-500" />
            <span className="text-2xl font-bold">
              GearNest
            </span>
          </div>
          <p className="max-w-sm text-sm leading-7 text-slate-400">
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
            <Link href="/#how-it-works">
              How It Works
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-5 font-bold text-white">
            Contact
          </h3>
          <p className="text-sm leading-7">
            Have a question about GearNest?
            Contact information will be available soon.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} GearNest.
        All rights reserved.
      </div>
    </footer>
  );
}
