
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import ButtonLink from "@/components/ui/button-link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock3,
  Construction,
  Laptop,
  ShieldCheck,
  Tractor,
  Truck,
  Wallet,
  PartyPopper,
} from "lucide-react";

const categories = [
  { name: "Construction", Icon: Construction },
  { name: "Photography", Icon: Camera },
  { name: "Transportation", Icon: Truck },
  { name: "Agriculture", Icon: Tractor },
  { name: "Electronics", Icon: Laptop },
  { name: "Events", Icon: PartyPopper },
];

export default function Home() {
  return (
    <main className="bg-background text-foreground">

      {/* Hero */}
      <section className="relative overflow-hidden theme-deep-panel px-5 py-24 text-white lg:py-36">
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-background/25 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span className="mb-6 inline-block rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-primary">
              Your Equipment Rental Marketplace
            </span>

            <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Rent the Right Gear.
              <span className="block text-primary">
                Get More Done.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
              Discover equipment for construction,
              photography, events, agriculture and more.
              Find the right gear for your next project.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <ButtonLink
                href="/equipment"
                size="lg"
              >
                Explore Equipment
                <ArrowRight size={18} data-button-arrow />
              </ButtonLink>
              <ButtonLink
                href="#how-it-works"
                variant="outline"
                size="lg"
              >
                How It Works
              </ButtonLink>
            </div>
          </motion.div>

          <div className="relative mx-auto aspect-square w-full max-w-[520px]" aria-label="Popular GearNest equipment" role="group">
            <div className="absolute inset-[12%] rounded-full bg-accent/20 blur-3xl" />

            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.15 }}
              className="absolute left-[7%] top-[3%] h-[48%] w-[48%] drop-shadow-[0_18px_24px_rgba(0,0,0,0.25)]"
            >
              <Image
                src="/images/equipment/photography/canon-r6-mark-ii.jpg"
                alt="Canon camera available to rent"
                fill
                sizes="(max-width: 1024px) 45vw, 250px"
                className="mask mask-hexagon-2 object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.28 }}
              className="absolute right-[3%] top-[9%] h-[42%] w-[42%] drop-shadow-[0_18px_24px_rgba(0,0,0,0.25)]"
            >
              <Image
                src="/images/equipment/construction/cat-320.jpg"
                alt="CAT construction excavator available to rent"
                fill
                sizes="(max-width: 1024px) 40vw, 220px"
                className="mask mask-hexagon object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.4 }}
              className="absolute bottom-[3%] left-[1%] h-[43%] w-[43%] drop-shadow-[0_18px_24px_rgba(0,0,0,0.25)]"
            >
              <Image
                src="/images/equipment/agriculture/john-deere-5075e.jpg"
                alt="John Deere tractor available to rent"
                fill
                sizes="(max-width: 1024px) 40vw, 225px"
                className="mask mask-pentagon object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.52 }}
              className="absolute bottom-[1%] right-[4%] h-[41%] w-[41%] drop-shadow-[0_18px_24px_rgba(0,0,0,0.25)]"
            >
              <Image
                src="/images/equipment/transportation/ford-transit.jpg"
                alt="Ford Transit van available to rent"
                fill
                sizes="(max-width: 1024px) 38vw, 215px"
                className="mask mask-triangle-2 object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="theme-deep-panel px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="font-semibold text-foreground">
              Browse by Category
            </p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Find Equipment for Every Need
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map(({ name, Icon }) => (
              <Link
                href={`/equipment?category=${encodeURIComponent(name)}`}
                key={name}
                className="rounded-2xl border border-border/10 bg-card p-6 text-center text-foreground transition duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none"
              >
                <Icon size={36} className="mx-auto mb-4 text-foreground" />
                <h3 className="font-semibold">{name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Live marketplace callout */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="rounded-3xl bg-card p-8 shadow-sm md:flex md:items-center md:justify-between md:p-12"><div><p className="font-semibold text-muted-foreground">GearNest Marketplace</p><h2 className="mt-2 text-3xl font-bold md:text-4xl">Explore current listings</h2><p className="mt-4 max-w-2xl leading-7 text-muted-foreground">See equipment that is actually available, then compare rental prices, locations, and terms.</p></div><ButtonLink href="/equipment" variant="secondary" className="mt-6 shrink-0 md:mt-0">Browse equipment<ArrowRight size={18} data-button-arrow/></ButtonLink></div></div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Why Choose GearNest?
          </h2>
          <p className="mt-4 text-muted-foreground">
            A simpler way to find and rent equipment.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            { Icon: Wallet, title: "Affordable Rentals", text: "Compare equipment and choose a rental option that fits your budget." },
            { Icon: ShieldCheck, title: "Managed Listings", text: "Equipment listings go through an administrative approval process." },
            { Icon: Clock3, title: "Flexible Rental Periods", text: "Find equipment offered with daily, weekly or monthly rental options." },
          ].map(({ Icon, title, text }) => (
            <div key={title} className="rounded-2xl border p-8">
              <Icon size={36} className="mb-5 text-muted-foreground" />
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Extra Section: How It Works */}
      <section id="how-it-works" className="theme-deep-panel py-20 text-white">
        <div className="mx-auto max-w-7xl px-5 text-center lg:px-8">
          <h2 className="text-3xl font-bold md:text-4xl">
            How GearNest Works
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              ["01", "Explore Equipment", "Search and compare available equipment."],
              ["02", "Select Rental Dates", "Choose your rental period and quantity."],
              ["03", "Complete Payment", "Pay securely through Stripe Checkout."],
            ].map(([step, title, description]) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-white/10 p-8">
                <span className="text-4xl font-extrabold text-muted-foreground">
                  {step}
                </span>
                <h3 className="mt-4 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extra Section: Owner CTA */}
      <section className="theme-deep-panel px-5 py-16 text-center">
        <CheckCircle2 size={40} className="mx-auto mb-5" />
        <h2 className="text-3xl font-extrabold md:text-4xl">
          Have Equipment to Rent?
        </h2>
        <p className="mx-auto mt-4 max-w-xl">
          Join GearNest as an equipment owner and reach
          customers looking for the right gear.
        </p>
        <ButtonLink
          href="/register"
          variant="secondary"
          size="lg"
          className="mt-7"
        >
          Become an Owner
        </ButtonLink>
      </section>
    </main>
  );
}
