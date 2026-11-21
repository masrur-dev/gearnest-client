
"use client";

import { usePathname } from "next/navigation";

import { ExternalLink } from "lucide-react";

import { menuForRole, type UserRole } from "@/lib/roles";

import { SidebarTrigger } from "@/components/ui/sidebar";
import ButtonLink from "@/components/ui/button-link";

function titleFor(pathname: string, role: UserRole): string {
  const items = menuForRole(role);

  const match = items.find((item) => {
    if (item.url === "/dashboard") {
      return pathname === "/dashboard";
    }

    return (
      pathname === item.url || pathname.startsWith(`${item.url}/`)
    );
  });

  return match?.title ?? "Dashboard";
}

export default function DashboardTopbar({
  role,
  name,
}: {
  role: UserRole;
  name: string;
}) {
  const pathname = usePathname();
  const title = titleFor(pathname, role);

  return (
    <header className="sticky top-20 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur md:px-6">
      <SidebarTrigger />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-foreground">
          {title}
        </p>
        <p className="hidden truncate text-xs text-muted-foreground sm:block">
          Signed in as {name}
        </p>
      </div>

      <span className="hidden rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground sm:inline-block">
        {role}
      </span>

      <ButtonLink
        href="/"
        variant="outline"
        size="sm"
        interaction="compact"
      >
        <ExternalLink size={14} aria-hidden="true" />
        <span className="hidden md:inline">View Site</span>
      </ButtonLink>
    </header>
  );
}
