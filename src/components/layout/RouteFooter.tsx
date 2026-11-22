"use client";

import { usePathname } from "next/navigation";

import Footer from "@/components/layout/Footer";

export default function RouteFooter() {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) return null;

  return <Footer />;
}
