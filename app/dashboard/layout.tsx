import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import { AuthProvider } from "@/components/provider";
import OldNavbar from "@/components/layout/old-navbar";
import AIBar from "@/components/layout/AI/sidebar";
import Unauthenticated from "@/components/layout/unauthenticated";
import CheckAuth from "./check-auth";
export const metadata: Metadata = {
  title: "FedEx | Dashboard",
  description: "FedEx Media Presence Tracking Tool Dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <div className="w-full">
        <OldNavbar />
        <AuthProvider>{children}</AuthProvider>
      </div>

      <AIBar />
    </div>
  );
}
