
import BookingList from "@/components/dashboard/BookingList";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-ui";

export default function OwnerRentalsPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Equipment Rentals"
        description="Rental requests and bookings for your listings — decline what you cannot fulfil and close out completed rentals."
      />

      <BookingList scope="owner" />
    </div>
  );
}
