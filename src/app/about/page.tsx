import type { Metadata } from "next";
import { CheckCircle2, Compass, Handshake, ShieldCheck } from "lucide-react";
import ButtonLink from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "About GearNest | Equipment Rental Marketplace",
  description: "Learn how GearNest helps people find and rent equipment for their next project.",
};

const values = [
  { icon: Compass, title: "Find the right fit", text: "Browse equipment across categories and compare rental options in one place." },
  { icon: Handshake, title: "Connect renters and owners", text: "GearNest gives equipment owners a place to list gear and helps renters discover it." },
  { icon: ShieldCheck, title: "Clear rental details", text: "Review availability, location, rental terms, and pricing before you book." },
];

export default function AboutPage() {
  return <main className="min-h-[70vh] bg-background text-foreground">
    <section className="theme-deep-panel px-5 py-20 text-white"><div className="mx-auto max-w-5xl"><p className="font-semibold text-muted-foreground">About GearNest</p><h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight md:text-5xl">The right equipment makes every project easier.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">GearNest is an equipment rental marketplace built to help renters find the gear they need and help owners make their equipment available to more people.</p></div></section>
    <section className="mx-auto max-w-5xl px-5 py-16"><div className="grid gap-5 md:grid-cols-3">{values.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border bg-card p-6 shadow-sm"><Icon className="size-8 text-muted-foreground"/><h2 className="mt-5 text-lg font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></article>)}</div><div className="mt-10 rounded-2xl bg-muted p-7"><h2 className="text-2xl font-bold">Start with what you need.</h2><p className="mt-2 max-w-2xl text-foreground">Explore available listings or learn how to offer equipment as an owner.</p><div className="mt-5 flex flex-wrap gap-3"><ButtonLink href="/equipment" variant="secondary">Browse equipment</ButtonLink><ButtonLink href="/register" variant="outline"><CheckCircle2 size={17}/>Create an account</ButtonLink></div></div></section>
  </main>;
}
