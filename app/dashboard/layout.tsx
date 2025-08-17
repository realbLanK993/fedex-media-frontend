import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import { AuthProvider } from "@/components/provider";
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
    <div className="flex min-h-screen">
      <div className="w-full">
        <Navbar />
        <AuthProvider>{children}</AuthProvider>
      </div>
    </div>
  );
}
