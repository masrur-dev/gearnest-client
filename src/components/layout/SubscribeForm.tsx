"use client";

import { useId, useState, type FormEvent } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";

type Tone = "light" | "dark";

type SubscribeFormProps = {
  tone?: Tone;
  className?: string;
};

export default function SubscribeForm({
  tone = "light",
  className,
}: SubscribeFormProps) {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const isDark = tone === "dark";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) return;

    setSubscribed(true);
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div
        className={cn(
          "flex flex-col gap-2 rounded-2xl border p-2 sm:flex-row sm:items-center",
          isDark
            ? "border-white/20 bg-white/10 backdrop-blur-sm"
            : "border-border bg-card shadow-sm",
        )}
      >
        <div
          className={cn(
            "blur-gradient-frame min-w-0 flex-1 rounded-xl",
          )}
        >
          <div
            className={cn(
              "relative rounded-[11px]",
              isDark ? "bg-[#4b5d25] dark:bg-background" : "bg-card",
            )}
          >
            <Mail
              size={17}
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2",
                isDark ? "text-white/60" : "text-muted-foreground",
              )}
            />

            <label htmlFor={inputId} className="sr-only">
              Email address
            </label>

            <input
              id={inputId}
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (subscribed) setSubscribed(false);
              }}
              placeholder="Enter your email address"
              className={cn(
                "h-11 w-full rounded-[11px] bg-transparent pl-11 pr-3 text-sm outline-none transition placeholder:font-medium focus-visible:ring-2",
                isDark
                  ? "text-white placeholder:text-white/55 focus-visible:ring-white/40 dark:text-foreground dark:placeholder:text-muted-foreground"
                  : "text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/40",
              )}
            />
          </div>
        </div>

        <Button
          type="submit"
          className={cn(
            "h-11 shrink-0 rounded-xl px-5",
            isDark &&
              "bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground",
          )}
        >
          Subscribe
        </Button>
      </div>

      <p
        aria-live="polite"
        className={cn(
          "mt-2 flex items-center gap-1.5 px-1 text-xs font-medium",
          isDark ? "text-white/65" : "text-muted-foreground",
        )}
      >
        {subscribed ? (
          <>
            <CheckCircle2
              size={14}
              className={isDark ? "text-accent" : "text-primary"}
            />
            You&apos;re on the list. Watch your inbox for new gear.
          </>
        ) : (
          "No spam. Unsubscribe anytime."
        )}
      </p>
    </form>
  );
}
