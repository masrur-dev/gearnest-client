
import { authClient } from "./auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

/**
 * Fetches a protected backend endpoint with a fresh JWT from the
 * Better Auth JWT plugin attached as `Authorization: Bearer …`.
 *
 * Throws `Error("Authentication required")` when no valid session
 * token could be obtained (signed out or expired session).
 */
export async function authFetch(
  endpoint: string,
  init?: RequestInit
) {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication required");
  }

  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${data.token}`);

  return fetch(`${API_URL}${endpoint}`, {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store",
  });
}
