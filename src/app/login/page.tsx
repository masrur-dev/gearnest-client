"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

function getSafeCallbackUrl(url: string | null): string {
  if (
    !url ||
    !url.startsWith("/") ||
    url.startsWith("//") ||
    url.includes("\\")
  ) {
    return "/dashboard";
  }

  return url;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<
    "github" | "google" | null
  >(null);
  const [error, setError] = useState("");

  async function handleSocialSignIn(provider: "github" | "google") {
    if (loading || socialLoading) return;
    setError("");
    setSocialLoading(provider);
    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: new URL(callbackUrl, window.location.origin).toString(),
      });
      if (result?.error) {
        const message =
          result.error.message || `Unable to sign in with ${provider}.`;
        setError(message);
        toast.error(message);
        setSocialLoading(null);
      }
    } catch {
      const message = `Unable to sign in with ${provider}. Please try again.`;
      setError(message);
      toast.error(message);
      setSocialLoading(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading || socialLoading) return;

    setError("");

    if (!email.trim() || !password) {
      const message = "Please enter your email and password.";
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        const message = result.error.message || "Invalid email or password.";
        setError(message);
        toast.error(message);
        return;
      }

      toast.success("Signed in successfully.");
      router.replace(callbackUrl);
      router.refresh();
    } catch {
      const message = "Unable to sign in. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-background px-4 py-10 sm:py-14">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <section className="theme-deep-panel rounded-3xl px-7 py-9 shadow-xl shadow-[0_10px_35px_var(--theme-shadow)] sm:px-10 sm:py-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-white">
            <span className="size-2 rounded-full bg-background" />
            GEARNEST MEMBER ACCESS
          </span>
          <h1 className="mt-7 max-w-lg text-4xl font-extrabold tracking-tight sm:text-5xl">
            Welcome back to GearNest.
          </h1>
          <p className="mt-5 max-w-lg leading-7 text-white/80">
            Sign in to pick up where you left off, manage your rentals, and
            find the gear you need for your next project.
          </p>
          <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-5">
            <p className="text-sm font-semibold text-white">
              Your projects are ready to move.
            </p>
            <p className="mt-2 text-sm leading-6 text-white/75">
              Browse equipment, keep track of bookings, and save listings to
              your favorites from one account.
            </p>
          </div>
        </section>

        <div className="blur-gradient-frame w-full rounded-3xl">
          <section className="w-full rounded-[22px] border border-border/10 bg-card p-7 text-foreground shadow-lg shadow-[0_8px_25px_var(--theme-shadow)] sm:p-9">
            <div className="mb-7">
              <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-muted text-foreground">
                <LockKeyhole size={23} />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Sign in</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Use your GearNest account to continue.
              </p>
            </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-foreground"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  disabled={loading || socialLoading !== null}
                  className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20 disabled:opacity-60"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  disabled={loading || socialLoading !== null}
                  className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-12 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20 disabled:opacity-60"
                />

                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || socialLoading !== null}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  variant="ghost"
                  size="icon-sm"
                  interaction="compact"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </Button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-destructive/25 bg-destructive/10 p-3 text-sm text-destructive"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              loading={loading}
              disabled={socialLoading !== null}
              size="lg"
              className="w-full"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Social sign-in */}
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
              onClick={() => void handleSocialSignIn("google")}
              className="w-full gap-2"
            >
              {socialLoading === "google" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <svg
                  className="size-4"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 38.05 46.98 31.9 46.98 24.55Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                  />
                </svg>
              )}
              Google
            </Button>
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
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.21 11.19.6.11.82-.25.82-.56 0-.28-.01-1.02-.02-2-3.34.71-4.04-1.58-4.04-1.58-.55-1.36-1.33-1.73-1.33-1.73-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.21 1.84 1.21 1.07 1.8 2.8 1.28 3.49.98.11-.76.42-1.28.76-1.57-2.67-.29-5.47-1.31-5.47-5.85 0-1.29.47-2.35 1.24-3.18-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.2a11.7 11.7 0 0 1 6 0c2.29-1.52 3.3-1.2 3.3-1.2.66 1.65.24 2.87.12 3.17.77.83 1.24 1.89 1.24 3.18 0 4.55-2.81 5.55-5.49 5.84.43.36.82 1.09.82 2.2 0 1.59-.01 2.88-.01 3.27 0 .31.22.68.83.56A12.02 12.02 0 0 0 24 12.29C24 5.78 18.63.5 12 .5z" />
                </svg>
              )}
              GitHub
            </Button>
          </div>

          <p className="mt-7 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-foreground hover:underline"
            >
              Create Account
            </Link>
          </p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[75vh] items-center justify-center">
          <Loader2 className="size-6 animate-spin" />
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
