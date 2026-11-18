
import { authClient } from "./auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export async function authFetch(endpoint: string) {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication required");
  }

  return fetch(`${API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
    credentials: "include",
    cache: "no-store",
  });
}
