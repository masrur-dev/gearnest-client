
import { DashboardPageHeader } from "@/components/dashboard/dashboard-ui";
import OwnerEquipmentPanel from "@/components/dashboard/OwnerEquipmentPanel";
import { getSessionUser } from "@/lib/session";

export default async function OwnerEquipmentPage() {
  const user = await getSessionUser();

  if (!user) {
    return null;
  }

  return (
    <>
      <DashboardPageHeader
        title="My Equipment"
        description="Manage the listings attributed to your GearNest account."
      />

      <OwnerEquipmentPanel />
    </>
  );
}
