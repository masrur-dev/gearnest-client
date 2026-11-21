import { Suspense } from "react";
import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";

const heading = Poppins({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800", "900"],
});

const body = Roboto({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GearNest | Equipment Rental Platform",
  description:
    "Rent construction, photography, agriculture, and event equipment with GearNest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <Suspense fallback={<div className="h-20" />}>
          <Navbar />
        </Suspense>

        <div className="flex-1">{children}</div>

        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
