
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Camera, Save, ShieldCheck } from "lucide-react";

import { authFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/lib/roles";
import {
  DashboardPageHeader,
  DashboardCard,
} from "@/components/dashboard/dashboard-ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

type ProfileData = {
  name: string;
  email: string;
  image: string;
  phone: string;
  address: string;
  role: UserRole;
};

type Props = {
  initial: {
    name: string;
    email: string;
    role: UserRole;
  };
};

const inputClass =
  "w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20 disabled:bg-muted disabled:text-muted-foreground";

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";

  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

function validate(form: ProfileData): string | null {
  const name = form.name.trim();

  if (name.length < 1) return "Display name is required.";
  if (name.length > 100) return "Display name must be 100 characters or fewer.";

  const phone = form.phone.trim();

  if (phone) {
    if (phone.length > 30) {
      return "Phone number must be 30 characters or fewer.";
    }

    if (!/^\+?[\d\s\-()]+$/.test(phone)) {
      return "Phone number may only contain digits, spaces, +, - and parentheses.";
    }

    const digits = phone.replace(/\D/g, "");

    if (digits.length < 5 || digits.length > 15) {
      return "Phone number must contain between 5 and 15 digits.";
    }
  }

  if (form.address.length > 300) {
    return "Address must be 300 characters or fewer.";
  }

  const image = form.image.trim();

  if (image && !/^(https?:\/\/|\/)\S+$/i.test(image)) {
    return "Profile photo must be an http(s) URL or a relative path.";
  }

  return null;
}

export default function ProfileForm({ initial }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<ProfileData>({
    name: initial.name,
    email: initial.email,
    image: "",
    phone: "",
    address: "",
    role: initial.role,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [dirty, setDirty] = useState(false);

  const completionFields = [
    form.name.trim(),
    form.email.trim(),
    form.image.trim(),
    form.phone.trim(),
    form.address.trim(),
  ];
  const completion = Math.round(
    (completionFields.filter(Boolean).length / completionFields.length) * 100,
  );
  const completionCircumference = 2 * Math.PI * 27;

  useEffect(() => {
    const controller = new AbortController();

    async function loadProfile() {
      try {
        const response = await authFetch("/api/users/me", {
          signal: controller.signal,
        });

        if (response.status === 401) {
          throw new Error(
            "Your session has expired. Please sign in again."
          );
        }

        if (!response.ok) {
          throw new Error("Unable to load your profile.");
        }

        const payload = await response.json();

        if (controller.signal.aborted) return;

        const user = payload?.user;

        if (user) {
          setForm({
            name:
              typeof user.name === "string"
                ? user.name
                : initial.name,
            email:
              typeof user.email === "string"
                ? user.email
                : initial.email,
            image: typeof user.image === "string" ? user.image : "",
            phone: typeof user.phone === "string" ? user.phone : "",
            address:
              typeof user.address === "string" ? user.address : "",
            role: initial.role,
          });
        }

        setLoadError("");
      } catch (error) {
        if (controller.signal.aborted) return;

        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load your profile."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => controller.abort();
  }, [initial]);

  function update<K extends keyof ProfileData>(
    key: K,
    value: ProfileData[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setDirty(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validate(form);

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSaving(true);

    try {
      const response = await authFetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          image: form.image.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
        }),
      });

      const payload = await response.json().catch(() => null);

      if (response.status === 401) {
        toast.error("Your session has expired. Please sign in again.");
        return;
      }

      if (!response.ok || payload?.success === false) {
        throw new Error(
          payload?.message || "The server rejected this update."
        );
      }

      setDirty(false);
      toast.success("Profile updated successfully.");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save your profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4" role="status">
        <span className="sr-only">Loading your profile…</span>
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  if (loadError) {
    return (
      <>
        <DashboardPageHeader
          title="My Profile"
          description="Your personal details on GearNest."
        />

        <div
          role="alert"
          className="rounded-2xl border border-destructive/25 bg-destructive/10 p-8 text-center"
        >
          <h2 className="font-bold text-destructive">
            Unable to load your profile
          </h2>
          <p className="mt-2 text-sm text-destructive">{loadError}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardPageHeader
        title="My Profile"
        description="Update how you appear to renters and owners on GearNest."
      />

      <div className="grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-4">
          <DashboardCard className="p-4 text-center sm:p-5">
            <div className="relative mx-auto flex size-24 items-center justify-center">
              <svg
                className="absolute inset-0 size-full -rotate-90 text-muted"
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" strokeWidth="4" />
                <circle
                  cx="32"
                  cy="32"
                  r="27"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={completionCircumference}
                  strokeDashoffset={completionCircumference * (1 - completion / 100)}
                  className="transition-[stroke-dashoffset] duration-500"
                />
              </svg>
              <Avatar className="size-20">
                {form.image ? (
                  <AvatarImage
                    src={form.image}
                    alt={form.name || "Profile photo"}
                  />
                ) : null}
                <AvatarFallback className="text-lg font-bold">
                  {initialsOf(form.name)}
                </AvatarFallback>
              </Avatar>
            </div>

            <p className="mt-2 text-sm font-semibold text-foreground" aria-live="polite">
              Profile {completion}% complete
            </p>

            <p className="mt-4 font-bold text-foreground">
              {form.name || "Unnamed account"}
            </p>
            <p className="mt-0.5 break-all text-sm text-muted-foreground">
              {form.email}
            </p>

            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              <ShieldCheck size={13} aria-hidden="true" />
              {form.role} account
            </span>

            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Your role is managed by GearNest administrators and
              cannot be edited here.
            </p>
          </DashboardCard>
        </div>

        <DashboardCard>
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="profile-name"
                  className="mb-1.5 block text-sm font-semibold text-foreground"
                >
                  Display Name
                </label>
                <input
                  id="profile-name"
                  className={inputClass}
                  value={form.name}
                  maxLength={100}
                  required
                  onChange={(event) => update("name", event.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="profile-email"
                  className="mb-1.5 block text-sm font-semibold text-foreground"
                >
                  Email Address
                </label>
                <input
                  id="profile-email"
                  className={inputClass}
                  value={form.email}
                  readOnly
                  disabled
                  aria-describedby="profile-email-help"
                />
                <p
                  id="profile-email-help"
                  className="mt-1.5 text-xs text-muted-foreground"
                >
                  Email changes are handled through account settings,
                  not this form.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="profile-image"
                  className="mb-1.5 block text-sm font-semibold text-foreground"
                >
                  Profile Photo URL
                </label>
                <input
                  id="profile-image"
                  type="url"
                  className={inputClass}
                  value={form.image}
                  placeholder="https://example.com/photo.jpg"
                  onChange={(event) => update("image", event.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="profile-phone"
                  className="mb-1.5 block text-sm font-semibold text-foreground"
                >
                  Phone Number
                </label>
                <input
                  id="profile-phone"
                  type="tel"
                  className={inputClass}
                  value={form.phone}
                  maxLength={30}
                  placeholder="+1 555 0100"
                  onChange={(event) => update("phone", event.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="profile-address"
                  className="mb-1.5 block text-sm font-semibold text-foreground"
                >
                  Address
                </label>
                <textarea
                  id="profile-address"
                  rows={3}
                  maxLength={300}
                  className={`${inputClass} resize-none`}
                  value={form.address}
                  placeholder="Street, city, postal code"
                  onChange={(event) => update("address", event.target.value)}
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {form.address.length}/300 characters
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5">
              <Button
                type="submit"
                disabled={saving || !dirty}
                loading={saving}
                variant="secondary"
              >
                {!saving && (
                  <Save size={15} />
                )}
                {saving ? "Saving…" : "Save Changes"}
              </Button>

              {dirty ? (
                <span className="text-xs text-muted-foreground">
                  Unsaved changes
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Camera size={13} aria-hidden="true" />
                  All changes saved
                </span>
              )}
            </div>
          </form>
        </DashboardCard>
      </div>
    </>
  );
}
