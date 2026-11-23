
import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Package,
  CheckCircle2,
  Tag,
  CalendarDays,
} from "lucide-react";
import BookingForm from "@/components/equipment/BookingForm";
import ButtonLink from "@/components/ui/button-link";
import FavoriteButton from "@/components/equipment/FavoriteButton";
import EquipmentImage from "@/components/equipment/EquipmentImage";

type Equipment = {
  _id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  brand?: string;
  model?: string;
  location: string;
  condition?: string;
  rentalTerms?: string;
  rentalPrice: number;
  rentalType: "Daily" | "Weekly" | "Monthly";
  availableQuantity: number;
  status?: string;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const equipment = await getEquipment(id);

  if (!equipment) {
    return {
      title: "Equipment Not Found | GearNest",
      description: "This GearNest equipment listing is unavailable.",
    };
  }

  const description =
    equipment.description?.replace(/\s+/g, " ").trim() ||
    `View rental details for ${equipment.name} on GearNest.`;
  const title = `${equipment.name} | GearNest Equipment Rental`;

  return {
    title,
    description: description.slice(0, 160),
    openGraph: {
      title,
      description: description.slice(0, 160),
      ...(equipment.image ? { images: [equipment.image] } : {}),
    },
  };
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

async function getEquipment(
  id: string
): Promise<Equipment | null> {
  try {
    const response = await fetch(
      `${API_URL}/api/equipment/${encodeURIComponent(id)}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) return null;

    const result = await response.json();

    const equipment = result.data ?? result;

    if (
      !equipment ||
      typeof equipment !== "object" ||
      !equipment._id ||
      !equipment.name
    ) {
      return null;
    }

    return equipment as Equipment;
  } catch (error) {
    console.error("Equipment fetch failed:", error);
    return null;
  }
}

async function EquipmentDetails({
  params,
}: PageProps) {
  const { id } = await params;
  const equipment = await getEquipment(id);

  if (!equipment) {
    return (
      <main className="mx-auto flex min-h-[65vh] max-w-4xl flex-col items-center justify-center px-6 text-center">
        <Package
          size={56}
          className="mb-5 text-muted-foreground"
        />

        <h1 className="text-3xl font-bold text-foreground">
          Equipment Not Found
        </h1>

        <p className="mt-3 text-muted-foreground">
          This equipment is unavailable or could not
          be loaded.
        </p>

        <ButtonLink
          href="/equipment"
          className="mt-6"
        >
          Browse Equipment
        </ButtonLink>
      </main>
    );
  }

  const canBook =
    (equipment.status === undefined ||
      equipment.status === "approved") &&
    equipment.availableQuantity > 0;

  const validRentalType = [
    "Daily",
    "Weekly",
    "Monthly",
  ].includes(equipment.rentalType);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Link
          href="/equipment"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={17} />
          Back to Equipment
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-7 lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-border/10 bg-card shadow-sm">
              <div className="relative flex aspect-video items-center justify-center bg-accent/35">
                <EquipmentImage
                  src={equipment.image}
                  alt={equipment.name}
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-contain p-6"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border/10 bg-card p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-foreground">
                    {equipment.category}
                  </span>

                  {canBook && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success px-3 py-1 text-xs font-semibold text-success-foreground">
                      <CheckCircle2 size={14} />
                      Available
                    </span>
                  )}
                </div>

                <FavoriteButton
                  equipmentId={equipment._id}
                  equipmentName={equipment.name}
                  iconOnly
                  className="rounded-full border-border/10 bg-card text-foreground shadow-sm hover:bg-muted"
                />
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {equipment.name}
              </h1>

              <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={17} />
                {equipment.location}
              </p>

              <div className="mt-7 border-t border-border/10 pt-6">
                <h2 className="text-xl font-bold text-foreground">
                  Description
                </h2>

                <p className="mt-3 whitespace-pre-line leading-7 text-muted-foreground">
                  {equipment.description}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border/10 bg-card p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold text-foreground">
                Equipment Information
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <InfoItem
                  icon={<Tag size={19} />}
                  label="Brand"
                  value={equipment.brand || "Not specified"}
                />

                <InfoItem
                  icon={<Package size={19} />}
                  label="Model"
                  value={equipment.model || "Not specified"}
                />

                <InfoItem
                  icon={<CheckCircle2 size={19} />}
                  label="Condition"
                  value={equipment.condition || "Not specified"}
                />

                <InfoItem
                  icon={<CalendarDays size={19} />}
                  label="Rental Type"
                  value={equipment.rentalType}
                />

                <InfoItem
                  icon={<Package size={19} />}
                  label="Available Quantity"
                  value={String(equipment.availableQuantity)}
                />
              </div>

              {equipment.rentalTerms && (
                <div className="mt-6 border-t border-border/10 pt-5">
                  <h3 className="font-bold text-foreground">
                    Rental Terms
                  </h3>

                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                    {equipment.rentalTerms}
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              {canBook && validRentalType ? (
                <BookingForm
                  equipmentId={equipment._id}
                  equipmentName={equipment.name}
                  rentalPrice={equipment.rentalPrice}
                  rentalType={equipment.rentalType}
                  availableQuantity={equipment.availableQuantity}
                />
              ) : (
                <div className="rounded-2xl border border-border/10 bg-card p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-foreground">
                    Currently Unavailable
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    This equipment cannot be booked right now.
                  </p>

                  <ButtonLink
                    href="/equipment"
                    className="mt-6"
                  >
                    Explore Other Equipment
                  </ButtonLink>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="rounded-lg bg-accent/35 p-2 text-foreground">
        {icon}
      </span>

      <div>
        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 font-semibold text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function EquipmentDetailsPage({
  params,
}: PageProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="h-96 animate-pulse rounded-2xl bg-muted" />
          <div className="mt-6 h-10 w-full max-w-80 animate-pulse rounded-lg bg-muted" />
        </main>
      }
    >
      <EquipmentDetails params={params} />
    </Suspense>
  );
}
