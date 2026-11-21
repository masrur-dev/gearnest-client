
"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Static loading shell shown while the server resolves the session.
 * Widths mirror the real sidebar so there is no layout shift.
 */
export function DashboardShellFallback() {
  const { state } = useSidebar();

  const width =
    state === "collapsed"
      ? "w-(--sidebar-width-icon)"
      : "w-(--sidebar-width)";

  return (
    <>
      <div
        aria-hidden="true"
        data-slot="sidebar-fallback"
        className={`${width} hidden shrink-0 border-r border-sidebar-border bg-sidebar pt-20 md:block`}
      >
        <div className="space-y-4 p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-lg" />
            <Skeleton className="h-5 w-24" />
          </div>

          <div className="space-y-3 pt-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-4/5" />
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-20 z-30 flex h-14 items-center gap-3 border-b border-border bg-card px-4 md:px-6">
          <Skeleton className="size-7 rounded-md" />
          <Skeleton className="h-4 w-40" />
        </header>

        <div className="min-w-0 flex-1 bg-background p-4 md:p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-80 max-w-full" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/** Loading state used inside dashboard sections and pages. */
export function DashboardSectionSkeleton({
  rows = 3,
}: {
  rows?: number;
}) {
  return (
    <div role="status" aria-live="polite" className="space-y-4">
      <span className="sr-only">Loading dashboard content…</span>
      <Skeleton className="h-7 w-48" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-20 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
