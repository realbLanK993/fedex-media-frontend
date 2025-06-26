// app/newsletter/fedex/page.tsx
"use client"; // This page will primarily be client-side for the iframe

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // For the back button

export default function FedExNewsletterPage() {
  const router = useRouter();
  const newsletterUrl = `${process.env.NEXT_PUBLIC_RAG_API_URL}/newsletter/fedex`;

  if (!process.env.NEXT_PUBLIC_RAG_API_URL) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <p className="text-red-500 font-semibold">
          Error: API URL is not configured. Please set NEXT_PUBLIC_RAG_API_URL.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="bg-card border-b p-4 flex items-center justify-between sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          asChild
        >
          <Link href="/" aria-label="Back to dashboard">
            {" "}
            {/* Or just router.back() */}
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-lg font-semibold">FedEx Newsletter</h1>
        <div className="w-8"></div> {/* Spacer for centering title */}
      </header>

      <main className="flex-grow overflow-hidden">
        {" "}
        {/* Added overflow-hidden for iframe */}
        <iframe
          src={newsletterUrl}
          title="FedEx Newsletter"
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms" // Adjust sandbox as needed
          // Consider adding onError for the iframe if the URL fails to load
        />
      </main>
    </div>
  );
}
