
import {
  ClipboardList,
  Heart,
  LayoutDashboard,
  Package,
  PlusCircle,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

export const USER_ROLES = ["Customer", "Owner", "Admin"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === "string" &&
    (USER_ROLES as readonly string[]).includes(value)
  );
}

export type MenuItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

const overviewItem: MenuItem = {
  title: "Overview",
  url: "/dashboard",
  icon: LayoutDashboard,
};

const profileItem: MenuItem = {
  title: "My Profile",
  url: "/dashboard/profile",
  icon: UserRound,
};

const roleMenus: Record<UserRole, MenuItem[]> = {
  Customer: [
    {
      title: "My Rentals",
      url: "/dashboard/customer/rentals",
      icon: Package,
    },
    {
      title: "Favorites",
      url: "/dashboard/customer/favorites",
      icon: Heart,
    },
  ],

  Owner: [
    {
      title: "Add Equipment",
      url: "/dashboard/owner/add-equipment",
      icon: PlusCircle,
    },
    {
      title: "My Equipment",
      url: "/dashboard/owner/equipment",
      icon: Package,
    },
    {
      title: "Equipment Rentals",
      url: "/dashboard/owner/rentals",
      icon: ClipboardList,
    },
  ],

  Admin: [
    {
      title: "All Users",
      url: "/dashboard/admin/users",
      icon: Users,
    },
    {
      title: "All Equipment",
      url: "/dashboard/admin/equipment",
      icon: Package,
    },
    {
      title: "All Rentals",
      url: "/dashboard/admin/rentals",
      icon: ClipboardList,
    },
  ],
};

export function menuForRole(role: UserRole): MenuItem[] {
  return [overviewItem, ...roleMenus[role], profileItem];
}

export const roleApiPath: Record<UserRole, string> = {
  Customer: "/api/dashboard/customer",
  Owner: "/api/dashboard/owner",
  Admin: "/api/dashboard/admin",
};

export function roleLabel(role: UserRole): string {
  return `${role} Dashboard`;
}
