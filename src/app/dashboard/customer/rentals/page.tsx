
import BookingList from "@/components/dashboard/BookingList";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-ui";

export default function CustomerRentalsPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My Rentals"
        description="Everything you have rented or reserved on GearNest — pay pending bookings, cancel reservations, and track refunds."
      />

      <BookingList scope="customer" />
    </div>
  );
}
