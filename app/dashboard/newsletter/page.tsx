"use client";

export default function FedExNewsletterPage() {
  const newsletterUrl = `${process.env.NEXT_PUBLIC_RAG_API_URL}/newsletter/`;

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
    <div className="h-full bg-background">

      <iframe
        src={newsletterUrl}
        title="FedEx Newsletter"
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
}
