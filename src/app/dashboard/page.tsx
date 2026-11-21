
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import { getSessionUser } from "@/lib/session";

export default async function DashboardPage() {
  const user = await getSessionUser();

  // The dashboard layout already redirects anonymous visitors, so a
  // missing user here only means the session ended mid-render.
  if (!user) {
    return null;
  }

  return <DashboardOverview user={user} />;
}
