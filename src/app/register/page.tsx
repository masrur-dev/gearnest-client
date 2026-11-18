
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

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

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        ...(form.image.trim()
          ? { image: form.image.trim() }
          : {}),
      });

      if (error) {
        toast.error(error.message || "Registration failed");
        return;
      }

      toast.success("Account created successfully!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Unable to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-500";

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-5 py-16">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">
          Create Your GearNest Account
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          Join GearNest and start renting equipment.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Full Name
            </label>
            <input
              id="name"
              required
              className={inputStyle}
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              className={inputStyle}
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="image" className="mb-2 block text-sm font-medium">
              Profile Photo URL
            </label>
            <input
              id="image"
              type="url"
              className={inputStyle}
              value={form.image}
              onChange={(e) =>
                setForm({ ...form, image: e.target.value })
              }
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              className={inputStyle}
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              placeholder="Create a password"
            />
            <p className="mt-2 text-xs text-slate-500">
              Minimum 6 characters, uppercase and lowercase letters.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-500 px-5 py-3 font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-amber-700">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
