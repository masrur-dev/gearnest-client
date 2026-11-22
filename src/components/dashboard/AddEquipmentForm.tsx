
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ClipboardList,
  Image as ImageIcon,
  Loader2,
  PlusCircle,
  ShieldCheck,
} from "lucide-react";

import { authFetch } from "@/lib/api";
import {
  DashboardPageHeader,
  DashboardCard,
} from "@/components/dashboard/dashboard-ui";
import { Button } from "@/components/ui/button";
import ButtonLink from "@/components/ui/button-link";
import { Input } from "@/components/ui/input";

const categories = [
  "Construction",
  "Photography",
  "Transportation",
  "Agriculture",
  "Electronics",
  "Events",
];

const rentalTypes = ["Daily", "Weekly", "Monthly"];

const conditions = ["New", "Excellent", "Good", "Fair"];

type FormValues = {
  name: string;
  description: string;
  category: string;
  brand: string;
  model: string;
  condition: string;
  location: string;
  rentalPrice: string;
  rentalType: string;
  availableQuantity: string;
  image: string;
  rentalTerms: string;
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

const FIELD_ORDER: (keyof FormValues)[] = [
  "name",
  "description",
  "category",
  "brand",
  "model",
  "condition",
  "location",
  "rentalPrice",
  "rentalType",
  "availableQuantity",
  "image",
  "rentalTerms",
];

const EMPTY_FORM: FormValues = {
  name: "",
  description: "",
  category: "",
  brand: "",
  model: "",
  condition: "",
  location: "",
  rentalPrice: "",
  rentalType: "",
  availableQuantity: "",
  image: "",
  rentalTerms: "",
};

const controlClass =
  "w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/20";

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};

  function requireText(key: keyof FormValues, label: string) {
    const value = values[key].trim();

    if (!value) {
      errors[key] = `${label} is required.`;
      return;
    }

    if (value.length > 2000) {
      errors[key] = `${label} must be 2000 characters or fewer.`;
    }
  }

  requireText("name", "Equipment name");
  requireText("description", "Description");
  requireText("brand", "Brand");
  requireText("model", "Model");
  requireText("location", "Location");
  requireText("rentalTerms", "Rental terms");

  if (!categories.includes(values.category)) {
    errors.category = "Choose a category.";
  }

  if (!rentalTypes.includes(values.rentalType)) {
    errors.rentalType = "Choose a rental type.";
  }

  if (!conditions.includes(values.condition)) {
    errors.condition = "Choose a condition.";
  }

  const price = values.rentalPrice.trim();

  if (!price) {
    errors.rentalPrice = "Rental price is required.";
  } else {
    const parsedPrice = Number(price);

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      errors.rentalPrice =
        "Rental price must be a number greater than 0.";
    }
  }

  const quantity = values.availableQuantity.trim();

  if (!quantity) {
    errors.availableQuantity =
      "Available quantity is required.";
  } else {
    const parsedQuantity = Number(quantity);

    if (
      !Number.isFinite(parsedQuantity) ||
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 1
    ) {
      errors.availableQuantity =
        "Available quantity must be a whole number of 1 or more.";
    }
  }

  const image = values.image.trim();

  if (!image) {
    errors.image = "Equipment image URL is required.";
  } else {
    try {
      const parsed = new URL(image);

      if (!["https:", "http:"].includes(parsed.protocol)) {
        throw new Error("Unsupported protocol");
      }
    } catch {
      errors.image =
        "Enter a valid image URL starting with http:// or https://.";
    }
  }

  return errors;
}

function FieldError({
  id,
  message,
}: {
  id: string;
  message?: string;
}) {
  if (!message) return null;

  return (
    <p
      id={`${id}-error`}
      className="mt-1.5 text-xs font-medium text-destructive"
    >
      {message}
    </p>
  );
}

export default function AddEquipmentForm({
  editId,
}: {
  editId?: string;
}) {
  const [form, setForm] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(
    Boolean(editId)
  );
  const [loadError, setLoadError] = useState("");

  const isEditing = Boolean(editId);

  // Prefill the form when opened from ?edit=<id>.
  useEffect(() => {
    if (!editId) return;

    let active = true;

    async function loadExisting() {
      setLoadingExisting(true);
      setLoadError("");

      try {
        const response = await authFetch(
          `/api/owner/equipment/${encodeURIComponent(editId!)}`
        );

        const payload = (await response.json().catch(() => null)) as {
          success?: boolean;
          message?: string;
          data?: Partial<Record<keyof FormValues, unknown>>;
        } | null;

        if (!active) return;

        if (!response.ok || payload?.success === false) {
          throw new Error(
            payload?.message || "Unable to load this listing."
          );
        }

        const data = payload?.data;

        if (!data) {
          throw new Error("This listing could not be loaded.");
        }

        const text = (value: unknown, fallback = "") =>
          typeof value === "string" ? value : fallback;
        const num = (value: unknown) =>
          value === undefined || value === null
            ? ""
            : String(value);

        setForm({
          name: text(data.name),
          description: text(data.description),
          category: text(data.category),
          brand: text(data.brand),
          model: text(data.model),
          condition: text(data.condition),
          location: text(data.location),
          rentalPrice: num(data.rentalPrice),
          rentalType: text(data.rentalType),
          availableQuantity: num(data.availableQuantity),
          image: text(data.image),
          rentalTerms: text(data.rentalTerms),
        });
      } catch (err) {
        if (!active) return;

        setLoadError(
          err instanceof Error
            ? err.message
            : "Unable to load this listing."
        );
      } finally {
        if (active) setLoadingExisting(false);
      }
    }

    void loadExisting();

    return () => {
      active = false;
    };
  }, [editId]);

  function update(key: keyof FormValues, value: string) {
    setForm((current) => ({ ...current, [key]: value }));

    setErrors((current) => {
      if (!current[key]) return current;

      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function errorProps(key: keyof FormValues) {
    const hasError = Boolean(errors[key]);

    return {
      "aria-invalid": hasError ? true : undefined,
      "aria-describedby": hasError
        ? `equipment-${key}-error`
        : undefined,
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    const nextErrors = validate(form);
    setErrors(nextErrors);

    const firstInvalid = FIELD_ORDER.find(
      (key) => nextErrors[key]
    );

    if (firstInvalid) {
      document
        .getElementById(`equipment-${firstInvalid}`)
        ?.focus();
      return;
    }

    setSubmitting(true);

    try {
      const endpoint = isEditing
        ? `/api/owner/equipment/${encodeURIComponent(editId!)}`
        : "/api/owner/equipment";

      const response = await authFetch(endpoint, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          category: form.category,
          brand: form.brand.trim(),
          model: form.model.trim(),
          condition: form.condition,
          location: form.location.trim(),
          rentalPrice: Number(form.rentalPrice.trim()),
          rentalType: form.rentalType,
          availableQuantity: Number(
            form.availableQuantity.trim()
          ),
          image: form.image.trim(),
          rentalTerms: form.rentalTerms.trim(),
        }),
      });

      const payload = await response.json().catch(() => null) as {
        success?: boolean;
        message?: string;
      } | null;

      if (response.status === 401) {
        toast.error(
          "Your session has expired. Please sign in again."
        );
        return;
      }

      if (response.status === 403) {
        toast.error(
          "Owner access is required to publish equipment."
        );
        return;
      }

      if (!response.ok || payload?.success === false) {
        throw new Error(
          payload?.message ||
            "The server could not save this listing."
        );
      }

      if (isEditing) {
        toast.success(
          payload?.message ||
            "Listing updated. It will return to pending review."
        );
      } else {
        setForm(EMPTY_FORM);
        setErrors({});
        toast.success(
          payload?.message ||
            "Equipment submitted for admin approval."
        );
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Authentication required"
      ) {
        toast.error(
          "Your session has expired. Please sign in again."
        );
        return;
      }

      if (error instanceof TypeError) {
        toast.error(
          "Unable to reach the GearNest API. Check that the server is running and try again."
        );
        return;
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to publish this listing."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <DashboardPageHeader
        title={isEditing ? "Edit Equipment" : "Add Equipment"}
        description={
          isEditing
            ? "Update your listing. Editing an approved item returns it to pending review."
            : "Publish a new listing to the GearNest marketplace."
        }
      />

      {loadingExisting ? (
        <div
          role="status"
          className="flex min-h-40 items-center justify-center gap-3 rounded-2xl border border-border bg-card text-sm text-muted-foreground shadow-sm"
        >
          <Loader2 className="animate-spin text-muted-foreground" />
          Loading listing…
        </div>
      ) : loadError ? (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/25 bg-destructive/10 p-6 text-sm text-destructive"
        >
          <p className="font-semibold">Unable to load this listing</p>
          <p className="mt-1">{loadError}</p>
          <ButtonLink
            href="/dashboard/owner/equipment"
            variant="outline"
            size="sm"
            className="mt-4"
          >
            Back to My Equipment
          </ButtonLink>
        </div>
      ) : (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <p className="mb-5 text-sm leading-6 text-muted-foreground">
            Every field is required. New listings start as{" "}
            <span className="font-semibold text-foreground">
              pending
            </span>{" "}
            until an admin approves them.
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="equipment-name"
                className="mb-1.5 block text-sm font-semibold text-foreground"
              >
                Equipment Name
              </label>
              <Input
                id="equipment-name"
                value={form.name}
                onChange={(event) =>
                  update("name", event.target.value)
                }
                disabled={submitting}
                maxLength={2000}
                required
                placeholder="e.g. Compact Excavator"
                className={controlClass}
                {...errorProps("name")}
              />
              <FieldError
                id="equipment-name"
                message={errors.name}
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="equipment-description"
                className="mb-1.5 block text-sm font-semibold text-foreground"
              >
                Description
              </label>
              <textarea
                id="equipment-description"
                rows={4}
                value={form.description}
                onChange={(event) =>
                  update("description", event.target.value)
                }
                disabled={submitting}
                maxLength={2000}
                required
                placeholder="Describe condition, features and included accessories…"
                className={`${controlClass} resize-none`}
                {...errorProps("description")}
              />
              <FieldError
                id="equipment-description"
                message={errors.description}
              />
            </div>

            <div>
              <label
                htmlFor="equipment-category"
                className="mb-1.5 block text-sm font-semibold text-foreground"
              >
                Category
              </label>
              <select
                id="equipment-category"
                value={form.category}
                onChange={(event) =>
                  update("category", event.target.value)
                }
                disabled={submitting}
                required
                className={controlClass}
                {...errorProps("category")}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <FieldError
                id="equipment-category"
                message={errors.category}
              />
            </div>

            <div>
              <label
                htmlFor="equipment-rentalPrice"
                className="mb-1.5 block text-sm font-semibold text-foreground"
              >
                Rental Price ($)
              </label>
              <Input
                id="equipment-rentalPrice"
                type="number"
                min="0"
                step="0.01"
                value={form.rentalPrice}
                onChange={(event) =>
                  update("rentalPrice", event.target.value)
                }
                disabled={submitting}
                required
                placeholder="0"
                className={controlClass}
                {...errorProps("rentalPrice")}
              />
              <FieldError
                id="equipment-rentalPrice"
                message={errors.rentalPrice}
              />
            </div>

            <div>
              <label
                htmlFor="equipment-brand"
                className="mb-1.5 block text-sm font-semibold text-foreground"
              >
                Brand
              </label>
              <Input
                id="equipment-brand"
                value={form.brand}
                onChange={(event) =>
                  update("brand", event.target.value)
                }
                disabled={submitting}
                maxLength={2000}
                required
                placeholder="e.g. Caterpillar"
                className={controlClass}
                {...errorProps("brand")}
              />
              <FieldError
                id="equipment-brand"
                message={errors.brand}
              />
            </div>

            <div>
              <label
                htmlFor="equipment-model"
                className="mb-1.5 block text-sm font-semibold text-foreground"
              >
                Model
              </label>
              <Input
                id="equipment-model"
                value={form.model}
                onChange={(event) =>
                  update("model", event.target.value)
                }
                disabled={submitting}
                maxLength={2000}
                required
                placeholder="e.g. 305 CR"
                className={controlClass}
                {...errorProps("model")}
              />
              <FieldError
                id="equipment-model"
                message={errors.model}
              />
            </div>

            <div>
              <label
                htmlFor="equipment-condition"
                className="mb-1.5 block text-sm font-semibold text-foreground"
              >
                Condition
              </label>
              <select
                id="equipment-condition"
                value={form.condition}
                onChange={(event) =>
                  update("condition", event.target.value)
                }
                disabled={submitting}
                required
                className={controlClass}
                {...errorProps("condition")}
              >
                <option value="">Select a condition</option>
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
              <FieldError
                id="equipment-condition"
                message={errors.condition}
              />
            </div>

            <div>
              <label
                htmlFor="equipment-location"
                className="mb-1.5 block text-sm font-semibold text-foreground"
              >
                Location
              </label>
              <Input
                id="equipment-location"
                value={form.location}
                onChange={(event) =>
                  update("location", event.target.value)
                }
                disabled={submitting}
                maxLength={2000}
                required
                placeholder="e.g. Dhaka, Bangladesh"
                className={controlClass}
                {...errorProps("location")}
              />
              <FieldError
                id="equipment-location"
                message={errors.location}
              />
            </div>

            <div>
              <label
                htmlFor="equipment-rentalType"
                className="mb-1.5 block text-sm font-semibold text-foreground"
              >
                Rental Type
              </label>
              <select
                id="equipment-rentalType"
                value={form.rentalType}
                onChange={(event) =>
                  update("rentalType", event.target.value)
                }
                disabled={submitting}
                required
                className={controlClass}
                {...errorProps("rentalType")}
              >
                <option value="">Select a rental type</option>
                {rentalTypes.map((rentalType) => (
                  <option key={rentalType} value={rentalType}>
                    {rentalType}
                  </option>
                ))}
              </select>
              <FieldError
                id="equipment-rentalType"
                message={errors.rentalType}
              />
            </div>

            <div>
              <label
                htmlFor="equipment-availableQuantity"
                className="mb-1.5 block text-sm font-semibold text-foreground"
              >
                Available Quantity
              </label>
              <Input
                id="equipment-availableQuantity"
                type="number"
                min="1"
                step="1"
                value={form.availableQuantity}
                onChange={(event) =>
                  update(
                    "availableQuantity",
                    event.target.value
                  )
                }
                disabled={submitting}
                required
                placeholder="1"
                className={controlClass}
                {...errorProps("availableQuantity")}
              />
              <FieldError
                id="equipment-availableQuantity"
                message={errors.availableQuantity}
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="equipment-image"
                className="mb-1.5 block text-sm font-semibold text-foreground"
              >
                Equipment Image URL
              </label>
              <Input
                id="equipment-image"
                type="url"
                value={form.image}
                onChange={(event) =>
                  update("image", event.target.value)
                }
                disabled={submitting}
                maxLength={2000}
                required
                placeholder="https://images.example.com/excavator.jpg"
                className={controlClass}
                {...errorProps("image")}
              />
              <FieldError
                id="equipment-image"
                message={errors.image}
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="equipment-rentalTerms"
                className="mb-1.5 block text-sm font-semibold text-foreground"
              >
                Rental Terms
              </label>
              <textarea
                id="equipment-rentalTerms"
                rows={3}
                value={form.rentalTerms}
                onChange={(event) =>
                  update("rentalTerms", event.target.value)
                }
                disabled={submitting}
                maxLength={2000}
                required
                placeholder="e.g. Daily rate includes delivery within 10 km. Refundable deposit required."
                className={`${controlClass} resize-none`}
                {...errorProps("rentalTerms")}
              />
              <FieldError
                id="equipment-rentalTerms"
                message={errors.rentalTerms}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
            <Button
              type="submit"
              loading={submitting}
              className="h-auto min-h-10"
            >
              {!submitting && (
                <PlusCircle />
              )}
              {submitting
                ? isEditing
                  ? "Saving…"
                  : "Publishing…"
                : isEditing
                  ? "Save Changes"
                  : "Publish Listing"}
            </Button>

            <ButtonLink
              href="/dashboard/owner/equipment"
              variant="outline"
            >
              My Equipment
            </ButtonLink>
          </div>
        </form>

        <div className="space-y-4">
          <DashboardCard>
            <h2 className="text-sm font-bold text-foreground">
              Before you publish
            </h2>

            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li className="flex gap-2.5">
                <ClipboardList
                  size={15}
                  className="mt-1 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span>
                  Listings are saved as{" "}
                  <strong className="font-semibold text-foreground">
                    pending
                  </strong>{" "}
                  and go public only after an admin approval.
                </span>
              </li>

              <li className="flex gap-2.5">
                <ImageIcon
                  size={15}
                  className="mt-1 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span>
                  Paste a direct image URL (https://…). File
                  uploads are not supported yet.
                </span>
              </li>

              <li className="flex gap-2.5">
                <ShieldCheck
                  size={15}
                  className="mt-1 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span>
                  Your owner id and approval status are attached
                  by the server from your session — this form
                  never sends them.
                </span>
              </li>
            </ul>

            <p className="mt-4 rounded-xl bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
              {isEditing
                ? "PATCH /api/owner/equipment/:id"
                : "POST /api/owner/equipment"}
            </p>
          </DashboardCard>

          <p className="rounded-xl border border-border bg-card p-4 text-xs leading-5 text-muted-foreground shadow-sm">
            Approved listings appear in the public catalogue and
            in{" "}
            <Link
              href="/dashboard/owner/equipment"
              className="font-semibold text-foreground underline-offset-2 hover:underline"
            >
              My Equipment
            </Link>
            .
          </p>
        </div>
      </div>
      )}
    </>
  );
}
