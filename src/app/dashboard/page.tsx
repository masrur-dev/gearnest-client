
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
  const router = useRouter();

  const {
    data: session,
    isPending,
    error,
  } = authClient.useSession();

  if (isPending) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <p>Checking your session...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-10 text-center">
        <p>Unable to verify your session.</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="p-10 text-center">
        <h1 className="text-2xl font-bold">
          Login Required
        </h1>

        <Link
          href="/login"
          className="mt-5 inline-block text-amber-600 underline"
        >
          Go to Login
        </Link>
      </main>
    );
  }

  async function handleLogout() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-5xl px-5 py-16">
      <h1 className="text-3xl font-bold">
        Welcome to GearNest!
      </h1>

      <p className="mt-3 text-slate-500">
        Your account is successfully authenticated.
      </p>

      <div className="mt-8 rounded-2xl border bg-white p-8 shadow-sm">
        <p className="mb-4">
          <strong>Name:</strong> {session.user.name}
        </p>

        <p className="mb-4">
          <strong>Email:</strong> {session.user.email}
        </p>

        <p className="mb-6">
          <strong>Status:</strong> Authenticated
        </p>

        <button
          onClick={handleLogout}
          className="rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white hover:bg-slate-800"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
