import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import AIBar from "@/components/layout/AI/sidebar";
import Unauthenticated from "@/components/layout/unauthenticated";

export const metadata: Metadata = {
  title: "FedEx | Dashboard",
  description: "FedEx Media Presence Tracking Tool Dashboard",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let authenticated = false;
  // const cookieStore = await cookies();
  // const token = cookieStore.get("session_token");
  // if (token && token.value) {
  //   const [sessionId, sessionSecret] = token.value.split(".");
  //   authenticated = await validateSession(sessionId, sessionSecret);
  // }
  return (
    <div className="flex">
      <div className="w-full">
        <Navbar />
        {authenticated ? (
          children
        ) : (
          <main className="h-[calc(100vh-100px)] flex w-full justify-center items-center">
            <Unauthenticated />
          </main>
        )}
      </div>
      <AIBar />
    </div>
  );
}
