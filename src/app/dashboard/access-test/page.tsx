
"use client";

import { useState } from "react";
import { authFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";

const endpoints = [
  { name: "My Profile", path: "/api/dashboard/me" },
  { name: "Customer", path: "/api/dashboard/customer" },
  { name: "Owner", path: "/api/dashboard/owner" },
  { name: "Admin", path: "/api/dashboard/admin" },
];

export default function AccessTestPage() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleTest(path: string) {
    setLoading(true);

    try {
      const response = await authFetch(path);
      const data = await response.json();

      setResult(
        JSON.stringify(
          {
            status: response.status,
            ...data,
          },
          null,
          2
        )
      );
    } catch (error) {
      setResult(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="text-3xl font-bold">
        GearNest Role Access Test
      </h1>

      <p className="mt-3 text-muted-foreground">
        Test Customer, Owner and Admin permissions.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {endpoints.map((item) => (
          <Button
            key={item.path}
            disabled={loading}
            onClick={() => handleTest(item.path)}
            variant="secondary"
            className="h-auto min-h-12 whitespace-normal px-4 py-4"
          >
            Test {item.name}
          </Button>
        ))}
      </div>

      <pre className="mt-8 min-h-40 overflow-auto rounded-xl theme-deep-panel p-6 text-sm text-muted-foreground">
        {result || "Click a button to test access"}
      </pre>
    </main>
  );
}
