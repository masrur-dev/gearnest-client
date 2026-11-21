
import { RoleSection } from "@/components/dashboard/RoleSection";

export default function OwnerDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RoleSection allow={["Owner"]}>{children}</RoleSection>;
}
