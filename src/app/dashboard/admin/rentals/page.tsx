
import BookingList from "@/components/dashboard/BookingList";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-ui";

export default function AdminRentalsPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="All Rentals"
        description="Platform-wide rental activity across every account, filterable by status and searchable by customer or equipment."
      />

      <BookingList scope="admin" />
    </div>
  );
}
