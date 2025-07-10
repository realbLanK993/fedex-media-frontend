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
      <div className=" p-4 md:p-8 text-center">
        <p className="text-red-500 font-semibold">
          Error: API URL is not configured. Please set NEXT_PUBLIC_RAG_API_URL.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col w-full h-[calc(100vh-70px)] bg-background">
      <main className="flex-grow overflow-hidden">
        {" "}
        {/* Added overflow-hidden for iframe */}
        <iframe
          src={newsletterUrl}
          title="FedEx Newsletter"
          className="w-full h-full border-0 prose"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms" // Adjust sandbox as needed
          // Consider adding onError for the iframe if the URL fails to load
        />
      </main>
    </div>
  );
}
