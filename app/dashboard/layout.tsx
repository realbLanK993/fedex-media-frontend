import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import AIBar from "@/components/layout/AI/sidebar";

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
      <main>
        <Navbar />
        {children}
      </main>
      <AIBar />
    </div>
  );
}
