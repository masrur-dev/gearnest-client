
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Home, ShieldCheck, Wrench } from "lucide-react";

import {
  menuForRole,
  roleLabel,
  type UserRole,
} from "@/lib/roles";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

type DashboardSidebarProps = {
  role: UserRole | null;
};

function isItemActive(pathname: string, url: string) {
  if (url === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === url || pathname.startsWith(`${url}/`);
}

export default function DashboardSidebar({
  role,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const menuItems = role ? menuForRole(role) : [];

  function handleNavigate() {
    if (isMobile) {
      setOpenMobile(false);
    }
  }

  return (
    <Sidebar collapsible="icon" className="pt-20">
      <SidebarHeader className="border-b border-sidebar-border p-2">
        <Link
          href="/"
          onClick={handleNavigate}
          className="flex items-center justify-center gap-3 overflow-hidden rounded-md px-2 py-1.5 hover:bg-sidebar-accent md:justify-start"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wrench size={18} />
          </span>

          <span className="truncate text-lg font-extrabold tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
            Gear<span className="text-muted-foreground">Nest</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {role ? roleLabel(role) : "Dashboard"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            {!role ? (
              <p className="px-2 py-3 text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
                Sign in to load your dashboard menu.
              </p>
            ) : (
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      onClick={handleNavigate}
                      tooltip={item.title}
                      isActive={isItemActive(pathname, item.url)}
                      aria-current={
                        isItemActive(pathname, item.url)
                          ? "page"
                          : undefined
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        {role ? (
          <div className="flex items-center justify-center gap-2 rounded-md bg-sidebar-accent px-2 py-2 text-xs font-semibold text-foreground md:justify-start">
            <ShieldCheck
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="truncate group-data-[collapsible=icon]:hidden">
              {role} Account
            </span>
          </div>
        ) : null}

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/" />}
              onClick={handleNavigate}
              tooltip="Back to Home"
            >
              <Home />
              <span>Back to Home</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
