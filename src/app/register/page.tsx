
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"github" | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
  });

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (loading) return;

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const image = form.image.trim();

    if (!name || !email) {
      toast.error("Name and email are required.");
      return;
    }

    const validPassword =
      form.password.length >= 6 &&
      /[A-Z]/.test(form.password) &&
      /[a-z]/.test(form.password);

    if (!validPassword) {
      toast.error(
        "Password must contain at least 6 characters, uppercase and lowercase letters."
      );
      return;
    }

    if (image) {
      try {
        const parsedUrl = new URL(image);

        if (
          !["http:", "https:"].includes(parsedUrl.protocol)
        ) {
          throw new Error("Invalid image URL");
        }
      } catch {
        toast.error("Please enter a valid profile photo URL.");
        return;
      }
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password: form.password,
        ...(image ? { image } : {}),
      });

      if (error) {
        toast.error(
          error.message || "Registration failed."
        );
        return;
      }

      toast.success("Account created successfully!");

      router.replace("/dashboard");
      router.refresh();
    } catch {
      toast.error(
        "Unable to connect to authentication server."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignIn(provider: "github") {
    if (loading || socialLoading) return;
    setSocialLoading(provider);
    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/dashboard`,
      });
      if (error) {
        toast.error(
          error.message ||
            `Unable to sign up with ${provider}.`
        );
        setSocialLoading(null);
      }
    } catch {
      toast.error(
        "Unable to connect to authentication server."
      );
      setSocialLoading(null);
    }
  }

  const inputStyle =
    "w-full rounded-xl border border-input bg-card px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-background px-5 py-16">
      <div className="blur-gradient-frame w-full max-w-md rounded-2xl">
        <div className="rounded-[14px] border bg-card p-8 text-foreground shadow-sm">
          <h1 className="text-3xl font-bold text-foreground">
            Create Your GearNest Account
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Join GearNest and start renting equipment.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={200}
                disabled={loading}
                className={inputStyle}
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Your full name"
              />
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={loading}
                className={inputStyle}
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                placeholder="you@example.com"
              />
            </div>

            {/* Profile Photo */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Profile Photo URL (Optional)
              </label>

              <input
                id="image"
                name="image"
                type="url"
                autoComplete="off"
                disabled={loading}
                className={inputStyle}
                value={form.image}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    image: e.target.value,
                  }))
                }
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Password
              </label>

              <input
                id="password"
                name="new-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                disabled={loading}
                className={inputStyle}
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                placeholder="Create a password"
              />

              <p className="mt-2 text-xs text-muted-foreground">
                Minimum 6 characters, uppercase and lowercase
                letters.
              </p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-muted" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-muted" />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={loading || socialLoading !== null}
              onClick={() => void handleSocialSignIn("github")}
              className="w-full gap-2"
            >
              {socialLoading === "github" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.21 11.19.6.11.82-.25.82-.56 0-.28-.01-1.02-.02-2-3.34.71-4.04-1.58-4.04-1.58-.55-1.36-1.33-1.73-1.33-1.73-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.21 1.84 1.21 1.07 1.8 2.8 1.28 3.49.98.11-.76.42-1.28.76-1.57-2.67-.29-5.47-1.31-5.47-5.85 0-1.29.47-2.35 1.24-3.18-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.2a11.7 11.7 0 0 1 6 0c2.29-1.52 3.3-1.2 3.3-1.2.66 1.65.24 2.87.12 3.17.77.83 1.24 1.89 1.24 3.18 0 4.55-2.81 5.55-5.49 5.84.43.36.82 1.09.82 2.2 0 1.59-.01 2.88-.01 3.27 0 .31.22.68.83.56A12.02 12.02 0 0 0 24 12.29C24 5.78 18.63.5 12 .5z" />
                </svg>
              )}
              GitHub
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-foreground hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
