import type { Metadata } from "next";
import { Suspense } from "react";
import EquipmentBrowser from "./EquipmentBrowser";

export const metadata: Metadata = {
  title: "Browse Equipment | GearNest",
  description: "Search and compare equipment rentals by category, price, location, and availability.",
};

type PageProps = {
  searchParams: Promise<{ category?: string | string[] }>;
};

async function EquipmentPageContent({ searchParams }: PageProps) {
  const params = await searchParams;
  const category = Array.isArray(params.category) ? params.category[0] : params.category;

  return <EquipmentBrowser initialCategory={category} />;
}

export default function AllEquipmentPage(props: PageProps) {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background p-8"><div className="mx-auto h-64 max-w-7xl animate-pulse rounded-2xl bg-muted" /></main>}>
      <EquipmentPageContent searchParams={props.searchParams} />
    </Suspense>
  );
}
