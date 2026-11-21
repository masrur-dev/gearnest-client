
import { Suspense } from "react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import { DashboardShellFallback } from "@/components/dashboard/DashboardSkeleton";
import { requireSessionUser } from "@/lib/session";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

/**
 * The dashboard is intentionally blocking: it streams in after the
 * session has been verified on the server, so no protected markup is
 * rendered before authorization completes.
 */
export const instant = false;

async function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSessionUser();

  return (
    <>
      <DashboardSidebar role={user.role} />

      <SidebarInset>
        <DashboardTopbar role={user.role} name={user.name} />

        <div className="min-w-0 flex-1 bg-background p-4 text-foreground md:p-6">
          {children}
        </div>
      </SidebarInset>
    </>
  );
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider className="min-h-[calc(100svh-5rem)]">
      <Suspense fallback={<DashboardShellFallback />}>
        <DashboardShell>{children}</DashboardShell>
      </Suspense>
    </SidebarProvider>
  );
}
