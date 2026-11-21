
import FavoritesList from "@/components/dashboard/FavoritesList";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-ui";

export default function CustomerFavoritesPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Favorites"
        description="Equipment you save for later, ready to rent."
      />

      <FavoritesList />
    </div>
  );
}
