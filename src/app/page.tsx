
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock3,
  Construction,
  Laptop,
  ShieldCheck,
  Star,
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

const equipment = [
  { id: "1", name: "Professional DSLR Camera", category: "Photography", price: 35, Icon: Camera },
  { id: "2", name: "Heavy Duty Excavator", category: "Construction", price: 250, Icon: Construction },
  { id: "3", name: "Utility Transport Truck", category: "Transportation", price: 120, Icon: Truck },
  { id: "4", name: "Agricultural Tractor", category: "Agriculture", price: 180, Icon: Tractor },
  { id: "5", name: "Professional Laptop", category: "Electronics", price: 40, Icon: Laptop },
  { id: "6", name: "Event Party Equipment", category: "Events", price: 85, Icon: PartyPopper },
];

const reviews = [
  { name: "Alex Morgan", rating: 5, comment: "Finding equipment for my project was straightforward and convenient." },
  { name: "Sarah Wilson", rating: 5, comment: "A simple way to compare equipment and rental options." },
  { name: "Daniel Carter", rating: 4, comment: "The platform makes it easy to explore different equipment categories." },
  { name: "Emily Parker", rating: 5, comment: "I like the clear layout and flexible rental options." },
];

export default function Home() {
  return (
    <main className="bg-white text-slate-900">

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 px-5 py-24 text-white lg:py-36">
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="mb-6 inline-block rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400">
              Your Equipment Rental Marketplace
            </span>

            <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Rent the Right Gear.
              <span className="block text-amber-400">
                Get More Done.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
              Discover equipment for construction,
              photography, events, agriculture and more.
              Find the right gear for your next project.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/equipment"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-7 py-4 font-bold text-slate-950 transition hover:bg-amber-400"
              >
                Explore Equipment
                <ArrowRight size={18} />
              </Link>
              <a
                href="#how-it-works"
                className="rounded-xl border border-slate-600 px-7 py-4 font-semibold hover:bg-slate-800"
              >
                How It Works
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mb-10">
          <p className="font-semibold text-amber-600">
            Browse by Category
          </p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">
            Find Equipment for Every Need
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map(({ name, Icon }, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center transition hover:border-amber-400 hover:shadow-lg"
            >
              <Icon
                size={36}
                className="mx-auto mb-4 text-amber-600"
              />
              <h3 className="font-semibold">{name}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Equipment */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-semibold text-amber-600">
                Our Collection
              </p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                Featured Equipment
              </h2>
            </div>
            <Link
              href="/equipment"
              className="flex items-center gap-2 font-semibold text-amber-700"
            >
              View All <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {equipment.map(({ id, name, category, price, Icon }, index) => (
              <motion.article
                key={id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl"
              >
                <div className="flex h-52 items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                  <Icon
                    size={72}
                    strokeWidth={1.2}
                    className="text-slate-600"
                  />
                </div>

                <div className="p-6">
                  <span className="text-sm font-semibold text-amber-700">
                    {category}
                  </span>
                  <h3 className="mt-2 text-xl font-bold">
                    {name}
                  </h3>
                  <p className="mt-4 text-slate-500">
                    Starting at{" "}
                    <strong className="text-2xl text-slate-900">
                      ${price}
                    </strong>
                    /day
                  </p>
                  <Link
                    href="/login"
                    className="mt-6 block rounded-xl bg-slate-950 px-5 py-3 text-center font-semibold text-white hover:bg-slate-800"
                  >
                    View Details
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Why Choose GearNest?
          </h2>
          <p className="mt-4 text-slate-500">
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
              <Icon size={36} className="mb-5 text-amber-600" />
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="mt-3 leading-7 text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Extra Section: How It Works */}
      <section id="how-it-works" className="bg-slate-950 py-20 text-white">
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
              <div key={step} className="rounded-2xl bg-slate-900 p-8">
                <span className="text-4xl font-extrabold text-amber-400">
                  {step}
                </span>
                <h3 className="mt-4 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          Customer Reviews
        </h2>
        <p className="mt-3 text-center text-sm text-slate-500">
          Sample reviews for design preview
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review) => (
            <div key={review.name} className="rounded-2xl border p-6">
              <div className="mb-4 flex gap-1 text-amber-500">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={17} fill="currentColor" />
                ))}
              </div>
              <p className="min-h-24 text-sm leading-7 text-slate-600">
                {review.comment}
              </p>
              <h3 className="mt-4 font-bold">{review.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Extra Section: Owner CTA */}
      <section className="bg-amber-500 px-5 py-16 text-center text-slate-950">
        <CheckCircle2 size={40} className="mx-auto mb-5" />
        <h2 className="text-3xl font-extrabold md:text-4xl">
          Have Equipment to Rent?
        </h2>
        <p className="mx-auto mt-4 max-w-xl">
          Join GearNest as an equipment owner and reach
          customers looking for the right gear.
        </p>
        <Link
          href="/register"
          className="mt-7 inline-block rounded-xl bg-slate-950 px-8 py-4 font-bold text-white hover:bg-slate-800"
        >
          Become an Owner
        </Link>
      </section>
    </main>
  );
}
