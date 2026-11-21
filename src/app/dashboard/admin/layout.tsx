
import { RoleSection } from "@/components/dashboard/RoleSection";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RoleSection allow={["Admin"]}>{children}</RoleSection>;
}
