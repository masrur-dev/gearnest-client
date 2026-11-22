
import type { ReactNode } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  PackageOpen,
} from "lucide-react";

type HeaderProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function DashboardPageHeader({
  title,
  description,
  children,
}: HeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>

        {description && (
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardCard({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-5 text-foreground shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

type BannerProps = {
  title?: string;
  message?: string;
  description?: string;
  children?: ReactNode;
  variant?: "info" | "success" | "warning" | "error";
  className?: string;
};

export function InfoBanner({
  title,
  message,
  description,
  children,
  variant = "info",
  className = "",
}: BannerProps) {
  const styles = {
    info: "border-border bg-muted text-foreground",
    success: "border-border bg-muted text-foreground",
    warning: "border-border bg-muted text-foreground",
    error: "border-destructive/25 bg-destructive/10 text-destructive",
  };

  const Icon =
    variant === "success"
      ? CheckCircle2
      : variant === "error"
        ? AlertCircle
        : Info;

  return (
    <div
      className={`flex gap-3 rounded-xl border p-4 ${styles[variant]} ${className}`}
    >
      <Icon className="mt-0.5 size-5 shrink-0" />

      <div className="space-y-1 text-sm">
        {title && <p className="font-semibold">{title}</p>}
        {(message || description) && (
          <p>{message || description}</p>
        )}
        {children}
      </div>
    </div>
  );
}

type EmptyStateProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function DashboardEmptyState({
  title,
  description,
  children,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <PackageOpen className="mx-auto mb-4 size-10 text-muted-foreground" />

      <h2 className="text-lg font-bold text-foreground">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

import type { LucideIcon } from "lucide-react";

// Add this component at the bottom of dashboard-ui.tsx
type EmptyStateWithIconProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
};

export function EmptyState({
  title,
  description,
  icon: Icon,
  children,
}: EmptyStateWithIconProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center shadow-sm">
      {Icon && (
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-muted">
          <Icon className="size-7 text-muted-foreground" />
        </div>
      )}

      <h2 className="text-xl font-bold text-foreground">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}

      {children && (
        <div className="mt-6">{children}</div>
      )}
    </div>
  );
}
