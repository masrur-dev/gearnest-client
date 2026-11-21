
import { ArrowLeft, ShieldAlert } from "lucide-react";
import ButtonLink from "@/components/ui/button-link";

import type { UserRole } from "@/lib/roles";

export default function AccessDenied({
  actualRole,
  allowedRoles,
}: {
  actualRole: UserRole;
  allowedRoles: readonly UserRole[];
}) {
  return (
    <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted">
        <ShieldAlert className="text-muted-foreground" size={28} />
      </span>

      <h1 className="mt-5 text-2xl font-bold text-foreground">
        Access Denied
      </h1>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Your account is a{" "}
        <span className="font-semibold text-foreground">
          {actualRole}
        </span>{" "}
        account, and this section is restricted to{" "}
        <span className="font-semibold text-foreground">
          {allowedRoles.join(" or ")}
        </span>{" "}
        accounts.
      </p>

      <p className="mt-2 text-sm text-muted-foreground">
        No protected data was loaded for this section.
      </p>

      <ButtonLink
        href="/dashboard"
        variant="secondary"
        className="mt-7"
      >
        <ArrowLeft size={16} data-button-arrow />
        Back to Overview
      </ButtonLink>
    </div>
  );
}
