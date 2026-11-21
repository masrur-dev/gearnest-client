
import { Suspense } from "react";

import type { UserRole } from "@/lib/roles";
import { requireSessionUser } from "@/lib/session";

import AccessDenied from "./AccessDenied";
import { DashboardSectionSkeleton } from "./DashboardSkeleton";

async function RoleSectionInner({
  allow,
  children,
}: {
  allow: readonly UserRole[];
  children: React.ReactNode;
}) {
  const user = await requireSessionUser();

  if (!allow.includes(user.role)) {
    return (
      <AccessDenied
        actualRole={user.role}
        allowedRoles={allow}
      />
    );
  }

  return <>{children}</>;
}

/**
 * Server-side role gate for a dashboard section. Anonymous visitors
 * are redirected to the login page, and authenticated users with a
 * different role get an access-denied state instead of the content.
 */
export function RoleSection({
  allow,
  children,
}: {
  allow: readonly UserRole[];
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardSectionSkeleton />}>
      <RoleSectionInner allow={allow}>
        {children}
      </RoleSectionInner>
    </Suspense>
  );
}
