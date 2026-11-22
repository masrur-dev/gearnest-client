"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

import ButtonLink from "@/components/ui/button-link";
import SubscribeForm from "@/components/layout/SubscribeForm";
import { useClock } from "@/hooks/use-clock";

import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck2,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock3,
  Construction,
  Laptop,
  PackageCheck,
  PartyPopper,
  Search,
  ShieldCheck,
  Sparkles,
  Tractor,
  Truck,
  Wallet,
} from "lucide-react";

const categories = [
  {
    name: "Construction",
    Icon: Construction,
    blurb: "Excavators, lifts & tools",
    tint: "bg-accent text-accent-foreground",
  },
  {
    name: "Photography",
    Icon: Camera,
    blurb: "Cameras, lenses & rigs",
    tint: "bg-secondary text-secondary-foreground",
  },
  {
    name: "Transportation",
    Icon: Truck,
    blurb: "Vans, trailers & movers",
    tint: "bg-accent text-accent-foreground",
  },
  {
    name: "Agriculture",
    Icon: Tractor,
    blurb: "Tractors & field gear",
    tint: "bg-secondary text-secondary-foreground",
  },
  {
    name: "Electronics",
    Icon: Laptop,
    blurb: "Laptops & production tech",
    tint: "bg-accent text-accent-foreground",
  },
  {
    name: "Events",
    Icon: PartyPopper,
    blurb: "Audio, lighting & staging",
    tint: "bg-secondary text-secondary-foreground",
  },
];

const heroImages = [
  {
    src: "/images/equipment/construction/cat-320.jpg",
    alt: "CAT 320 excavator available to rent",
    category: "Construction",
    name: "CAT 320",
  },
  {
    src: "/images/equipment/photography/canon-r6-mark-ii.jpg",
    alt: "Canon EOS R6 Mark II camera available to rent",
    category: "Photography",
    name: "Canon R6 II",
  },
  {
    src: "/images/equipment/agriculture/john-deere-5075e.jpg",
    alt: "John Deere 5075E tractor available to rent",
    category: "Agriculture",
    name: "John Deere 5075E",
  },
  {
    src: "/images/equipment/transportation/ford-transit.jpg",
    alt: "Ford Transit van available to rent",
    category: "Transportation",
    name: "Ford Transit",
  },
];

const exploreImages = [
  {
    src: "/images/equipment/electronics/macbook-pro-14.jpg",
    alt: "MacBook Pro 14 available to rent",
  },
  {
    src: "/images/equipment/photography/canon-r6-mark-ii.jpg",
    alt: "Canon EOS R6 Mark II available to rent",
  },
  {
    src: "/images/equipment/construction/cat-320.jpg",
    alt: "CAT 320 excavator available to rent",
  },
  {
    src: "/images/equipment/transportation/ford-transit.jpg",
    alt: "Ford Transit van available to rent",
  },
];

const reasons = [
  {
    Icon: Wallet,
    title: "Affordable rentals",
    text: "Compare listings and pick a rental option that fits your budget and schedule.",
    tint: "bg-accent text-accent-foreground",
  },
  {
    Icon: ShieldCheck,
    title: "Verified listings",
    text: "Every piece of equipment is reviewed and approved before it goes live.",
    tint: "bg-secondary text-secondary-foreground",
  },
  {
    Icon: Clock3,
    title: "Flexible terms",
    text: "Rent by the day, week, or month with clear pricing and no surprises.",
    tint: "bg-accent text-accent-foreground",
  },
];

const steps = [
  {
    step: "01",
    Icon: Search,
    title: "Browse the marketplace",
    text: "Search by category, location, and price to find the right equipment.",
  },
  {
    step: "02",
    Icon: CalendarCheck2,
    title: "Book your dates",
    text: "Choose your rental period and quantity, then reserve it in a few clicks.",
  },
  {
    step: "03",
    Icon: PackageCheck,
    title: "Pick up and get to work",
    text: "Pay securely online, collect your gear, and return it when you are done.",
  },
];

const stats = [
  { value: "6+", label: "Categories" },
  { value: "24/7", label: "Booking" },
  { value: "100%", label: "Verified" },
];

export default function Home() {
  const now = useClock();

  useEffect(() => {
    const focusHowItWorks = () => {
      if (window.location.hash !== "#how-it-works") return;
      document.getElementById("how-it-works")?.focus({ preventScroll: true });
    };
    const handleLinkClick = (event: MouseEvent) => {
      if (
        event.target instanceof Element &&
        event.target.closest('a[href="/#how-it-works"], a[href="#how-it-works"]')
      ) {
        window.setTimeout(focusHowItWorks, 0);
      }
    };

    focusHowItWorks();
    document.addEventListener("click", handleLinkClick);
    window.addEventListener("hashchange", focusHowItWorks);
    return () => {
      document.removeEventListener("click", handleLinkClick);
      window.removeEventListener("hashchange", focusHowItWorks);
    };
  }, []);

  const dateLabel = now
    ? new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(now)
    : "Today";

  const timeLabel = now
    ? new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(now)
    : "--:--";

  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="theme-light-green-panel relative overflow-hidden px-5 pb-20 pt-12 lg:pb-28 lg:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 -top-24 size-[460px] rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-24 size-[380px] rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/3 size-[320px] rounded-full bg-black/10 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl text-white"
          >
            <div className="mb-5 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm">
                <CalendarDays size={14} className="text-white" />
                <span className="tabular-nums">{dateLabel}</span>
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm">
                <Clock3 size={14} className="text-white" />
                <span className="tabular-nums">{timeLabel}</span>
              </span>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white">
              <Sparkles size={15} />
              Your equipment rental marketplace
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight transition-colors duration-300 sm:text-5xl lg:text-6xl dark:text-primary">
              Rent the right gear.
              <span className="block text-white dark:text-primary">
                Build anything.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-white/90">
              Discover construction, photography, agriculture, and event
              equipment from trusted local owners. Compare prices, pick your
              dates, and get to work.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink
                href="/equipment"
                size="lg"
                className="bg-white text-[#344b16] hover:bg-accent hover:text-accent-foreground"
              >
                Browse Equipment
                <ArrowRight size={18} data-button-arrow />
              </ButtonLink>

              <ButtonLink
                href="/#how-it-works"
                variant="outline"
                size="lg"
                className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                How It Works
              </ButtonLink>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-white/90">
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-white" />
                Verified listings
              </li>
              <li className="flex items-center gap-2">
                <Clock3 size={16} className="text-white" />
                Flexible rental terms
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-white" />
                Secure checkout
              </li>
            </ul>
          </motion.div>

          {/* 3D equipment image grid */}
          <div className="relative mx-auto w-full max-w-[540px] [perspective:1400px]">
            <div
              aria-hidden="true"
              className="absolute inset-10 rounded-full bg-linear-to-tr from-primary/25 via-accent/20 to-secondary/25 blur-3xl"
            />

            <div className="relative grid grid-cols-2 gap-4 [transform-style:preserve-3d] transition-transform duration-700 ease-out lg:[transform:rotateX(7deg)_rotateY(-9deg)] lg:hover:[transform:rotateX(0deg)_rotateY(0deg)]">
              {heroImages.map((item, index) => (
                <figure
                  key={item.name}
                  className={`group relative overflow-hidden rounded-[1.6rem] border border-border bg-card shadow-[0_28px_55px_-28px_var(--theme-shadow)] transition-transform duration-500 ease-out [transform:perspective(900px)_rotateX(3deg)_rotateY(-4deg)] hover:[transform:perspective(900px)_rotateX(-5deg)_rotateY(7deg)_translateZ(18px)] motion-reduce:transform-none motion-reduce:transition-none ${
                    index % 2 === 1 ? "lg:translate-y-7" : ""
                  }`}
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 1024px) 45vw, 260px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/15 to-transparent" />
                    <figcaption className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                        {item.category}
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-white">
                        {item.name}
                      </p>
                    </figcaption>
                  </div>
                </figure>
              ))}
            </div>

            <div className="absolute -bottom-3 left-2 hidden items-center gap-2 rounded-2xl border border-border bg-card/95 px-3.5 py-2.5 shadow-xl backdrop-blur sm:flex">
              <BadgeCheck size={18} className="text-primary" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Trusted owners
                </p>
                <p className="text-sm font-extrabold text-foreground">
                  Verified &amp; ready
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Categories */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Equipment category
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
              Find gear for every kind of work.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Six categories, one marketplace. Pick a category to see what is
            available near you.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map(({ name, Icon, blurb, tint }) => (
            <div
              key={name}
              className="blur-gradient-frame w-full rounded-2xl"
            >
              <Link
                href={`/equipment?category=${encodeURIComponent(name)}`}
                className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_40px_-24px_var(--theme-shadow)] motion-reduce:transform-none motion-reduce:transition-none"
              >
                <span
                  className={`inline-flex size-11 items-center justify-center rounded-xl ${tint}`}
                >
                  <Icon size={22} />
                </span>

                <span>
                  <span className="block text-sm font-bold text-foreground">
                    {name}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    {blurb}
                  </span>
                </span>

                <ArrowRight
                  size={16}
                  className="mt-auto text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary motion-reduce:transition-none"
                />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Equipment */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="theme-light-green-panel relative overflow-hidden rounded-[2rem] border border-white/15 p-6 sm:p-8 lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-3xl"
          />

          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/90">
                Explore equipment
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                Browse real listings from local owners.
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-white/90">
                See equipment that is actually available, then compare rental
                prices, locations, and terms before you book.
              </p>

              <div className="mt-7">
                <ButtonLink
                  href="/equipment"
                  size="lg"
                  className="bg-white text-[#344b16] hover:bg-accent hover:text-accent-foreground"
                >
                  Browse Equipment
                  <ArrowRight size={18} data-button-arrow />
                </ButtonLink>
              </div>

              <dl className="mt-8 grid max-w-md grid-cols-3 gap-3">
                {stats.map(({ value, label }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-border bg-card p-3 text-center"
                  >
                    <dt className="text-xl font-extrabold text-foreground">
                      {value}
                    </dt>
                    <dd className="mt-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {exploreImages.map((item) => (
                <div
                  key={item.src}
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 1024px) 45vw, 240px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose GearNest */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
            Why GearNest
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
            Why choose GearNest?
          </h2>
          <p className="mt-4 text-muted-foreground">
            A simpler, safer way to find and rent the equipment you need.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reasons.map(({ Icon, title, text, tint }) => (
            <div
              key={title}
              className="blur-gradient-frame rounded-2xl"
            >
              <div className="group rounded-[15px] border border-border bg-card p-7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_-28px_var(--theme-shadow)] motion-reduce:transform-none motion-reduce:transition-none">
                <span
                  className={`inline-flex size-12 items-center justify-center rounded-xl ${tint}`}
                >
                  <Icon size={24} />
                </span>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How GearNest Works */}
      <section
        id="how-it-works"
        tabIndex={-1}
        className="scroll-mt-24 px-5 py-16 outline-none focus-visible:ring-2 focus-visible:ring-primary lg:px-8 lg:py-20"
      >
        <div className="blur-gradient-frame mx-auto max-w-7xl rounded-[2rem]">
          <div className="theme-deep-panel relative overflow-hidden rounded-[1.9rem] px-6 py-14 sm:px-8 lg:px-12 lg:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-16 top-0 size-64 rounded-full bg-white/10 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-20 right-0 size-72 rounded-full bg-accent/20 blur-3xl"
            />

            <div className="relative mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/70">
                Simple process
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                How GearNest works
              </h2>
              <p className="mt-4 text-white/70">
                From browsing to booking, renting equipment takes just a few
                minutes.
              </p>
            </div>

            <div className="relative mt-12 grid gap-6 [perspective:1200px] md:grid-cols-3">
              {steps.map(({ step, Icon, title, text }) => (
                <div
                  key={step}
                  onPointerMove={(event) => {
                    if (
                      (event.pointerType !== "mouse" &&
                        event.pointerType !== "pen") ||
                      window.matchMedia("(prefers-reduced-motion: reduce)").matches
                    ) {
                      return;
                    }

                    const bounds = event.currentTarget.getBoundingClientRect();
                    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
                    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
                    const rotateX = -y * 14;
                    const rotateY = x * 14;

                    event.currentTarget.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
                  }}
                  onPointerLeave={(event) => {
                    event.currentTarget.style.transform = "";
                  }}
                  className="how-it-works-card rounded-2xl border border-white/15 bg-white/10 p-7 backdrop-blur-sm [transform-style:preserve-3d] transition-[transform,box-shadow] duration-150 ease-out hover:shadow-xl motion-reduce:transition-none"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-white/15 text-accent [transform:translateZ(22px)]">
                      <Icon size={22} />
                    </span>
                    <span className="text-4xl font-extrabold text-white/25 [transform:translateZ(18px)]">
                      {step}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-white [transform:translateZ(16px)]">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-white/70 [transform:translateZ(10px)]">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-linear-to-br from-primary/10 via-background to-accent/15 p-6 sm:p-8 lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 bottom-0 size-56 rounded-full bg-secondary/20 blur-3xl"
          />

          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                Stay in the loop
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
                Get new gear and rental deals in your inbox.
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
                Join the GearNest list for fresh listings, seasonal offers, and
                tips for renters and owners.
              </p>
            </div>

            <SubscribeForm />
          </div>
        </div>
      </section>

      {/* Have Equipment to Rent */}
      <section className="px-5 pb-20 lg:px-8">
        <div className="theme-deep-panel relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:px-8 lg:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 left-0 size-64 rounded-full bg-accent/20 blur-3xl"
          />

          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white">
              <Sparkles size={15} />
              For equipment owners
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Have equipment to rent?
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-white/70">
              Turn idle gear into income. List your equipment on GearNest and
              reach customers who need exactly what you have.
            </p>

            <ButtonLink
              href="/register"
              size="lg"
              className="mt-8 bg-white text-[#424f24] hover:bg-accent hover:text-accent-foreground"
            >
              Become an Owner
              <ArrowRight size={18} data-button-arrow />
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
