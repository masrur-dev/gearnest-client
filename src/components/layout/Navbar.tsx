"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Menu,
  X,
  Wrench,
  ChevronDown,
  LayoutDashboard,
  UserRound,
  Settings,
  LogOut,
  Loader2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { authFetch } from "@/lib/api";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import ButtonLink from "@/components/ui/button-link";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Main navigation links
const links = [
  { label: "Home", href: "/" },
  { label: "All Equipment", href: "/equipment" },
  { label: "About", href: "/about" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Contact", href: "/contact" },
];

const navColors = {
  link: "text-muted-foreground hover:text-muted-foreground dark:text-muted-foreground dark:hover:text-muted-foreground",
  active: "text-foreground dark:text-muted-foreground",
  mobileLink:
    "text-foreground hover:bg-muted hover:text-foreground dark:text-muted-foreground dark:hover:bg-muted/70 dark:hover:text-muted-foreground",
  secondaryLink:
    "text-foreground hover:bg-muted hover:text-foreground dark:text-muted-foreground dark:hover:bg-muted/70 dark:hover:text-muted-foreground",
};

type UserRole = "Customer" | "Owner" | "Admin";

type ProfileUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

// User profile dropdown
function ProfileDropdown({
  user,
}: {
  user: ProfileUser;
}) {
  const router = useRouter();

  const [role, setRole] = useState<UserRole | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  // Fetch actual user role from protected backend
  useEffect(() => {
    let active = true;

    async function loadRole() {
      try {
        const response = await authFetch(
          "/api/dashboard/me"
        );

        if (!response.ok) {
          throw new Error(
            "Unable to fetch authenticated user role"
          );
        }

        const result = await response.json();
        const verifiedRole = result.user?.role;

        if (!active) return;

        if (
          verifiedRole === "Customer" ||
          verifiedRole === "Owner" ||
          verifiedRole === "Admin"
        ) {
          setRole(verifiedRole);
        }
      } catch (error) {
        console.error(
          "Profile role loading failed:",
          error
        );
      } finally {
        if (active) {
          setRoleLoading(false);
        }
      }
    }

    void loadRole();

    return () => {
      active = false;
    };
  }, [user.id]);

  // Better Auth logout
  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");

    try {
      const result = await authClient.signOut();

      if (result.error) {
        throw new Error(
          result.error.message ||
            "Unable to sign out"
        );
      }

      router.replace("/login");
      router.refresh();
    } catch (error) {
      setLogoutError(
        error instanceof Error
          ? error.message
          : "Logout failed. Please try again."
      );
    } finally {
      setLoggingOut(false);
    }
  }

  // Avatar initials
  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            aria-label="Open profile menu"
            variant="outline"
            size="sm"
            interaction="compact"
            className="group h-11 rounded-full border border-border/70 bg-card/80 px-1.5 pr-3 text-foreground shadow-[0_6px_20px_-10px_var(--theme-shadow)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:bg-muted/60 hover:shadow-[0_12px_26px_-10px_var(--theme-shadow)] motion-reduce:transform-none motion-reduce:transition-none dark:border-border dark:bg-card/80 dark:text-foreground dark:hover:border-primary dark:hover:bg-muted/70"
          />
        }
      >
        <Avatar className="size-8 ring-2 ring-background/80 shadow-[0_4px_12px_-4px_var(--theme-shadow)] transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none dark:ring-border">
          {user.image && (
            <AvatarImage
              src={user.image}
              alt={user.name}
            />
          )}

          <AvatarFallback className="bg-primary font-bold text-primary-foreground">
            {initials || "U"}
          </AvatarFallback>
        </Avatar>

        <span className="hidden max-w-24 flex-col items-start text-left xl:flex">
          <span className="w-full truncate text-xs font-bold text-foreground dark:text-foreground">
            {user.name}
          </span>
          <span className="text-[10px] font-semibold text-muted-foreground dark:text-muted-foreground">
            {roleLoading ? "Checking..." : role ?? "Profile"}
          </span>
        </span>

        <ChevronDown
          size={14}
          className="ml-1 text-muted-foreground transition-transform duration-200 group-data-[popup-open]:rotate-180 dark:text-muted-foreground"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-72 origin-top-right rounded-2xl border border-border/80 bg-card/95 p-2 shadow-[0_20px_50px_-20px_var(--theme-shadow)] backdrop-blur-xl data-[side=bottom]:animate-in data-[side=bottom]:fade-in-0 data-[side=bottom]:slide-in-from-top-2 data-[side=bottom]:zoom-in-95 data-[side=top]:animate-in data-[side=top]:fade-in-0 data-[side=top]:slide-in-from-bottom-2 data-[side=top]:zoom-in-95 motion-reduce:animate-none dark:border-border dark:bg-background/95"
      >
        {/* Profile information */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="mb-1 flex items-center gap-3 rounded-xl border border-border/80 bg-muted px-3 py-3 dark:border-border">
              <div className="relative shrink-0">
                <Avatar className="size-11 ring-2 ring-primary/40 shadow-[0_8px_16px_-8px_var(--theme-shadow)] transition-transform duration-300 hover:scale-105 motion-reduce:transition-none dark:ring-ring/60">
                  {user.image && (
                    <AvatarImage
                      src={user.image}
                      alt={user.name}
                    />
                  )}
                  <AvatarFallback className="bg-primary font-bold text-primary-foreground">
                    {initials || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-1 -right-2 rounded-full border-2 border-border bg-background px-1.5 py-0.5 text-[8px] font-bold leading-none text-foreground">
                  {roleLoading ? "…" : role ?? "User"}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-foreground dark:text-muted-foreground">
                  Welcome,
                </p>
                <p className="truncate font-bold text-foreground dark:text-foreground">
                  {user.name || "User"}
                </p>
                <p className="truncate text-xs font-medium text-muted-foreground dark:text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-muted/80 dark:bg-muted" />

        {/* Profile navigation */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            render={<Link href="/dashboard" />}
            className="rounded-lg py-2.5 text-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground motion-reduce:transition-none dark:text-foreground dark:hover:bg-muted/70 dark:hover:text-muted-foreground"
          >
            <LayoutDashboard className="mr-2 size-4" />
            My Dashboard
          </DropdownMenuItem>

          <DropdownMenuItem
            render={<Link href="/dashboard/profile" />}
            className="rounded-lg py-2.5 text-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground motion-reduce:transition-none dark:text-foreground dark:hover:bg-muted/70 dark:hover:text-muted-foreground"
          >
            <UserRound className="mr-2 size-4" />
            My Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            render={<Link href="/dashboard/profile" />}
            className="rounded-lg py-2.5 text-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground motion-reduce:transition-none dark:text-foreground dark:hover:bg-muted/70 dark:hover:text-muted-foreground"
          >
            <Settings className="mr-2 size-4" />
            Account Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-muted/80 dark:bg-muted" />

        {/* Logout */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={loggingOut}
            onClick={() => void handleLogout()}
            className="rounded-lg py-2.5 text-rose-600 transition-colors duration-200 hover:bg-rose-50 hover:text-rose-700 motion-reduce:transition-none dark:text-rose-300 dark:hover:bg-rose-950/40 dark:hover:text-rose-200"
          >
            {loggingOut ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 size-4" />
            )}

            {loggingOut
              ? "Signing out..."
              : "Logout"}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {logoutError && (
          <p
            role="alert"
            className="px-2 py-2 text-xs text-rose-600"
          >
            {logoutError}
          </p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Main Navbar
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const pathname = usePathname();

  const { data: session, isPending } =
    authClient.useSession();

  const user = session?.user;

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  function isLinkActive(href: string) {
    const [path, hash] = href.split("#");
    const targetPath = path || "/";

    return pathname === targetPath && currentHash === (hash ? `#${hash}` : "");
  }

  function handleNavigationClick(href: string) {
    const hashIndex = href.indexOf("#");
    setCurrentHash(hashIndex >= 0 ? href.slice(hashIndex) : "");
    setOpen(false);
  }

  useEffect(() => {
    const syncHash = () => setCurrentHash(window.location.hash);

    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
  }, [pathname]);

  // Track scroll to switch between transparent and glass styles
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, {
      passive: true,
    });
    return () =>
      window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      {/* Floating glass shell */}
      <div
        className={`mx-auto max-w-[1440px] rounded-2xl border backdrop-blur-xl transition-all duration-200 ease-out motion-reduce:transition-none ${
          scrolled
            ? "border-border/60 bg-card/85 shadow-[0_16px_45px_-18px_rgba(15,23,42,0.4),inset_0_1px_0_rgba(255,255,255,0.85)] dark:border-border/50 dark:bg-background/85 dark:shadow-[0_16px_45px_-18px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)]"
            : "border-transparent bg-card/30 shadow-none dark:border-transparent dark:bg-background/30"
        }`}
      >
        <nav className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
          {/* Brand */}
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            onClick={() => setOpen(false)}
          >
            <span className="relative rounded-xl bg-primary p-2 text-primary-foreground shadow-[0_8px_18px_-8px_var(--theme-shadow)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none">
              <span className="absolute inset-0 rounded-xl bg-card/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <Wrench size={21} className="relative" />
            </span>

            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-primary">
                Gear
              </span>
              <span className="text-foreground dark:text-foreground">
                Nest
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-1 rounded-full border border-border/70 bg-card/60 p-1 lg:flex dark:border-border/70 dark:bg-card/60">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleNavigationClick(link.href)}
                aria-current={isLinkActive(link.href) ? "page" : undefined}
                className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 motion-reduce:transition-none ${
                  isLinkActive(link.href)
                    ? "bg-primary text-primary-foreground shadow-[0_6px_16px_-6px_var(--theme-shadow)]"
                    : navColors.link
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop login/profile */}
          <div className="hidden items-center gap-2.5 lg:flex">
            <ThemeToggle />
            {isPending ? (
              <div className="h-10 w-24 animate-pulse rounded-full bg-muted/60" />
            ) : user ? (
              <ProfileDropdown
                key={user.id}
                user={user}
              />
            ) : (
              <>
                <Link
                  href="/login"
                  className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold text-foreground transition-all duration-300 hover:bg-muted hover:text-foreground motion-reduce:transition-none dark:text-muted-foreground dark:hover:bg-muted/70 dark:hover:text-muted-foreground"
                >
                  Sign In
                </Link>

                <ButtonLink
                  href="/register"
                  size="sm"
                  className="whitespace-nowrap rounded-full border-0 bg-primary px-5 py-2 text-primary-foreground shadow-[0_8px_18px_-8px_var(--theme-shadow)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-8px_var(--theme-shadow)] motion-reduce:transform-none motion-reduce:transition-none"
                >
                  Sign Up
                </ButtonLink>
              </>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            {!isPending && user && (
              <ProfileDropdown
                key={user.id}
                user={user}
              />
            )}

            <Button
              type="button"
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              aria-controls={open ? "mobile-navigation" : undefined}
              onClick={() => setOpen(!open)}
              variant="ghost"
              size="icon-sm"
              interaction="compact"
              className="rounded-full border border-border/70 bg-card/80 text-foreground transition-all duration-300 hover:border-border hover:bg-muted motion-reduce:transition-none dark:border-border dark:bg-card/80 dark:text-muted-foreground dark:hover:border-primary dark:hover:bg-muted/70"
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </nav>

        {/* Mobile navigation */}
        {open && (
          <div
            id="mobile-navigation"
            className="animate-in slide-in-from-top-2 fade-in-0 space-y-1.5 border-t border-border/70 bg-card/90 px-4 py-4 duration-300 motion-reduce:animate-none dark:border-border/70 dark:bg-background/90 lg:hidden"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleNavigationClick(link.href)}
                aria-current={isLinkActive(link.href) ? "page" : undefined}
                className={`block rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-300 motion-reduce:transition-none ${
                  isLinkActive(link.href)
                    ? "bg-primary text-primary-foreground shadow-[0_6px_16px_-6px_var(--theme-shadow)]"
                    : navColors.mobileLink
                }`}
              >
                {link.label}
              </Link>
            ))}

            {!isPending && user && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-4 py-2.5 text-sm font-semibold ${navColors.secondaryLink}`}
                >
                  My Dashboard
                </Link>

                <Link
                  href="/dashboard/profile"
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-4 py-2.5 text-sm font-semibold ${navColors.secondaryLink}`}
                >
                  My Profile
                </Link>
              </>
            )}

            {!isPending && !user && (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-4 py-2.5 text-sm font-bold ${navColors.secondaryLink}`}
                >
                  Sign In
                </Link>

                <ButtonLink
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-xl bg-primary text-primary-foreground"
                >
                  Sign Up
                </ButtonLink>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
