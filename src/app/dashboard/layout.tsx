
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <DashboardSidebar />

      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b bg-white px-6">
          <SidebarTrigger />

          <h1 className="text-lg font-semibold text-slate-900">
            GearNest Dashboard
          </h1>
        </header>

        <div className="min-w-0 flex-1 bg-slate-50 p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
