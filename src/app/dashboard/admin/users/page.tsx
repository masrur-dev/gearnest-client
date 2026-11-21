
"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { authFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";

type Role = "Customer" | "Owner" | "Admin";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

const API = "/api/admin/role-management/users";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  async function loadUsers() {
    const response = await authFetch(API);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to load users");
    }

    return result.data as User[];
  }

  useEffect(() => {
    let active = true;

    loadUsers()
      .then((data) => {
        if (active) setUsers(data);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong"
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function refreshUsers() {
    setLoading(true);
    setError("");

    try {
      const data = await loadUsers();
      setUsers(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to refresh users"
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateRole(
    user: User,
    newRole: "Customer" | "Owner"
  ) {
    if (
      savingId ||
      user.role === "Admin" ||
      user.role === newRole
    ) {
      return;
    }

    const confirmed = window.confirm(
      `Change ${user.name}'s role from ${user.role} to ${newRole}?`
    );

    if (!confirmed) return;

    setSavingId(user.id);

    try {
      const response = await authFetch(
        `${API}/${encodeURIComponent(user.id)}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to update user role"
        );
      }

      setUsers((previous) =>
        previous.map((item) =>
          item.id === user.id
            ? { ...item, role: newRole }
            : item
        )
      );

      toast.success(`${user.name} is now ${newRole}`);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Role update failed"
      );
    } finally {
      setSavingId(null);
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchRole =
      filter === "All" || user.role === filter;

    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          All Users
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage registered GearNest users and account roles.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Users", value: users.length },
          {
            label: "Customers",
            value: users.filter((u) => u.role === "Customer").length,
          },
          {
            label: "Owners",
            value: users.filter((u) => u.role === "Owner").length,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border bg-card p-5 shadow-sm"
          >
            <div className="mb-3 flex items-center gap-2 text-muted-foreground">
              <Users size={17} />
              <span className="text-sm">{item.label}</span>
            </div>

            <p className="text-3xl font-bold text-foreground">
              {loading || error ? "—" : item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Manage User Roles
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Assign Customer or Owner access.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => void refreshUsers()}
            disabled={loading || Boolean(savingId)}
            variant="outline"
            size="sm"
            interaction="compact"
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
        </div>

        <div className="mb-5 flex flex-wrap gap-3">
          <div className="relative min-w-50 flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="search"
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>

          <select
            aria-label="Filter users by role"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-border bg-card px-4 py-2 text-sm"
          >
            <option value="All">All Roles</option>
            <option value="Customer">Customer</option>
            <option value="Owner">Owner</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-14">
            <Loader2 className="animate-spin" />
            Loading users...
          </div>
        ) : error ? (
          <div role="alert" className="rounded-xl bg-red-50 p-5 text-red-700">
            {error}
          </div>
        ) : filteredUsers.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            No users found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-160 text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Current Role</th>
                  <th className="p-4">Manage Role</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="p-4">
                      <p className="font-semibold text-foreground">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.role === "Admin"
                            ? "bg-muted text-foreground"
                            : user.role === "Owner"
                            ? "bg-muted text-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="p-4">
                      {user.role === "Admin" ? (
                        <span className="inline-flex items-center gap-2 text-xs text-foreground">
                          <ShieldCheck size={16} />
                          Protected Admin
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <select
                            aria-label={`Change role for ${user.name}`}
                            value={user.role}
                            disabled={Boolean(savingId)}
                            onChange={(e) =>
                              void updateRole(
                                user,
                                e.target.value as "Customer" | "Owner"
                              )
                            }
                            className="rounded-lg border border-border bg-card px-3 py-2 text-sm disabled:opacity-50"
                          >
                            <option value="Customer">
                              Customer
                            </option>
                            <option value="Owner">
                              Owner
                            </option>
                          </select>

                          {savingId === user.id && (
                            <Loader2
                              size={17}
                              className="animate-spin text-muted-foreground"
                            />
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
