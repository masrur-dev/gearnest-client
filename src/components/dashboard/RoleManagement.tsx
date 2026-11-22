
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { authFetch } from "@/lib/api";

type Role = "Customer" | "Owner" | "Admin";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export default function RoleManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      try {
        const response = await authFetch(
          "/api/admin/role-management/users"
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load users");
        }

        if (active) setUsers(result.data);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Failed to load users"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadUsers();

    return () => {
      active = false;
    };
  }, []);

  async function changeRole(user: User, role: "Customer" | "Owner") {
    if (savingId || user.role === "Admin" || user.role === role) {
      return;
    }

    if (!window.confirm(`Change ${user.name} to ${role}?`)) {
      return;
    }

    setSavingId(user.id);

    try {
      const response = await authFetch(
        `/api/admin/role-management/users/${encodeURIComponent(user.id)}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Role update failed");
      }

      setUsers((previous) =>
        previous.map((item) =>
          item.id === user.id ? { ...item, role } : item
        )
      );

      toast.success(`Role updated to ${role}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to update role"
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-bold text-foreground">
        Manage User Roles
      </h2>

      <p className="mt-2 text-sm text-muted-foreground">
        Assign Customer or Owner permissions to registered users.
      </p>

      {loading ? (
        <div className="mt-6 flex items-center gap-2">
          <Loader2 className="size-5 animate-spin" />
          Loading users...
        </div>
      ) : error ? (
        <p role="alert" className="mt-5 text-destructive">
          {error}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Change Role</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="p-3">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </td>

                  <td className="p-3">{user.role}</td>

                  <td className="p-3">
                    {user.role === "Admin" ? (
                      <span className="text-xs text-foreground">
                        Protected Admin
                      </span>
                    ) : (
                      <select
                        value={user.role}
                        disabled={Boolean(savingId)}
                        onChange={(event) =>
                          void changeRole(
                            user,
                            event.target.value as "Customer" | "Owner"
                          )
                        }
                        className="rounded-lg border bg-card px-3 py-2"
                      >
                        <option value="Customer">Customer</option>
                        <option value="Owner">Owner</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
