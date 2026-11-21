
import { RoleSection } from "@/components/dashboard/RoleSection";

export default function CustomerDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RoleSection allow={["Customer"]}>{children}</RoleSection>;
}
