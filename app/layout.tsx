// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"; // If you have theme provider
import { AiCommandPalette } from "@/components/command-pallete";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FedEx Media Tracker",
  description: "Track media presence and ask AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider // If you use ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <AiCommandPalette /> {/* Render the palette globally */}
        </ThemeProvider>
      </body>
    </html>
  );
}
