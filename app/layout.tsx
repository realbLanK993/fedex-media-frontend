import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { JotaiProvider, ThemeProvider } from "@/components/provider";
export const metadata: Metadata = {
  title: "FedEx",
  description: "FedEx Media Presence Tracking Tool",
};

const ibm_plex = IBM_Plex_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${ibm_plex.className} flex min-h-screen h-full flex-col antialiased`}
      >
        <ThemeProvider>
          <JotaiProvider>
            {children}
            <Toaster />
          </JotaiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
