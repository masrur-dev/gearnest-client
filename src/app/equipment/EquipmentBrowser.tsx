"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ButtonLink from "@/components/ui/button-link";
import EquipmentImage from "@/components/equipment/EquipmentImage";
import FavoriteButton from "@/components/equipment/FavoriteButton";
import {
  ArrowRight,
  MapPin,
  Package,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

type Equipment = {
  _id: string;
  name: string;
  description: string;
  category: string;
  rentalPrice: number;
  rentalType: string;
  location: string;
  availableQuantity: number;
  image: string;
  status: string;
};

type ApiResponse = {
  success: boolean;
  count: number;
  data: Equipment[];
  message?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const categories = [
  "Construction",
  "Photography",
  "Transportation",
  "Agriculture",
  "Electronics",
  "Events",
];

export default function EquipmentBrowser({ initialCategory = "" }: { initialCategory?: string }) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    categories.includes(initialCategory) ? initialCategory : "",
  );
  const [rentalType, setRentalType] = useState("");
  const [availability, setAvailability] = useState("");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (category) {
          params.set("category", category);
        }

        if (rentalType) {
          params.set("rentalType", rentalType);
        }

        if (availability) {
          params.set("availability", availability);
        }

        if (minPrice !== "") {
          params.set("minPrice", minPrice);
        }

        if (maxPrice !== "") {
          params.set("maxPrice", maxPrice);
        }

        params.set("sort", sort);

        const response = await fetch(
          `${API_URL}/api/equipment?${params.toString()}`,
          {
            signal: controller.signal,
            cache: "no-store",
          },
        );

        const result: ApiResponse = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch equipment");
        }

        if (!controller.signal.aborted) {
          setEquipment(result.data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setEquipment([]);
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, category, rentalType, availability, sort, minPrice, maxPrice]);

  function resetFilters() {
    setSearch("");
    setCategory("");
    setRentalType("");
    setAvailability("");
    setSort("newest");
    setMinPrice("");
    setMaxPrice("");
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20";

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Page Header */}
      <section className="theme-deep-panel px-5 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 font-semibold text-muted-foreground">
            GearNest Marketplace
          </p>

          <h1 className="text-4xl font-extrabold md:text-5xl">
            Explore All Equipment
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
            Find the right equipment for your next project. Search, compare
            prices and explore flexible rental options.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        {/* Search Bar */}
        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm">
          <Search className="ml-2 shrink-0 text-muted-foreground" />

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search equipment name or location..."
            aria-label="Search equipment"
            className="w-full bg-transparent p-2 text-sm outline-none"
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* Filters Sidebar */}
          <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-7 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <SlidersHorizontal size={19} />
                Filters
              </h2>

              <Button
                type="button"
                onClick={resetFilters}
                variant="ghost"
                size="sm"
                interaction="compact"
              >
                Reset
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-semibold"
                >
                  Category
                </label>

                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputClass}
                >
                  <option value="">All Categories</option>

                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="rentalType"
                  className="mb-2 block text-sm font-semibold"
                >
                  Rental Type
                </label>

                <select
                  id="rentalType"
                  value={rentalType}
                  onChange={(e) => setRentalType(e.target.value)}
                  className={inputClass}
                >
                  <option value="">All Rental Types</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="availability"
                  className="mb-2 block text-sm font-semibold"
                >
                  Availability
                </label>

                <select
                  id="availability"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className={inputClass}
                >
                  <option value="">All Equipment</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold">Price Range ($)</p>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    aria-label="Minimum price"
                    className={inputClass}
                  />

                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    aria-label="Maximum price"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Equipment Results */}
          <div className="min-w-0">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Available Listings</h2>

                <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
                  {loading
                    ? "Loading equipment..."
                    : `${equipment.length} equipment found`}
                </p>
              </div>

              <select
                aria-label="Sort equipment"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
              >
                <option value="newest">Recently Added</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {loading ? (
              <div
                role="status"
                className="flex min-h-64 items-center justify-center gap-3"
              >
                <RefreshCw className="animate-spin text-muted-foreground" />
                <span>Loading equipment...</span>
              </div>
            ) : error ? (
              <div
                role="alert"
                className="rounded-2xl border border-destructive/25 bg-destructive/10 p-10 text-center"
              >
                <h3 className="text-xl font-bold text-destructive">
                  Unable to Load Equipment
                </h3>
                <p className="mt-3 text-sm text-destructive">{error}</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Check that your Express server is running.
                </p>
              </div>
            ) : equipment.length === 0 ? (
              <div className="rounded-2xl border bg-card p-12 text-center">
                <Package size={48} className="mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-xl font-bold">No Equipment Found</h3>
                <p className="mt-2 text-muted-foreground">
                  Try changing your search or filters.
                </p>
                <Button
                  type="button"
                  onClick={resetFilters}
                  variant="outline"
                  className="mt-6"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {equipment.map((item) => (
                  <article
                    key={item._id}
                    className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-lg"
                  >
                    <div className="relative flex h-48 items-center justify-center bg-linear-to-br from-muted to-card">
                      <FavoriteButton
                        equipmentId={item._id}
                        equipmentName={item.name}
                        iconOnly
                        className="absolute right-3 top-3 z-10 rounded-full border-border/10 bg-card text-foreground shadow-sm hover:bg-muted"
                      />
                      {item.image?.startsWith("https://") ||
                      item.image?.startsWith("http://") ||
 item.image?.startsWith("/images/equipment/") ? (
                        <EquipmentImage
                          src={item.image}
                          alt={item.name}
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-contain p-5"
                        />
                      ) : (
                        <Package
                          size={68}
                          strokeWidth={1.2}
                          className="text-muted-foreground"
                        />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
                        {item.category}
                      </span>

                      <h3 className="mt-2 min-h-14 text-lg font-bold">
                        {item.name}
                      </h3>

                      <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin size={15} />
                        {item.location}
                      </p>

                      <div className="mt-4">
                        {item.availableQuantity > 0 ? (
                          <span className="rounded-full bg-success px-3 py-1 text-xs font-semibold text-success-foreground">
                            Available
                          </span>
                        ) : (
                          <span className="rounded-full bg-destructive/15 px-3 py-1 text-xs font-semibold text-destructive">
                            Unavailable
                          </span>
                        )}
                      </div>

                      <div className="mt-5 border-t border-border pt-4">
                        <p className="text-sm text-muted-foreground">Rental Price</p>

                        <p className="mt-1">
                          <span className="text-2xl font-extrabold">
                            ${item.rentalPrice}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            /{item.rentalType.toLowerCase().replace(/ly$/, "")}
                          </span>
                        </p>
                      </div>

                      <ButtonLink
                        href={`/equipment/${encodeURIComponent(item._id)}`}
                        variant="secondary"
                        className="mt-5 w-full"
                      >
                        View Details
                        <ArrowRight size={16} data-button-arrow />
                      </ButtonLink>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
