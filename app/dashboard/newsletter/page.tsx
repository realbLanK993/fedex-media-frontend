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
    <div className="flex flex-1 flex-col w-full h-[calc(100vh-140px)] bg-background">
      <main className="flex-grow overflow-hidden">
        {" "}
        <iframe
          src={newsletterUrl}
          title="FedEx Newsletter"
          className="w-full h-full border-0 prose"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </main>
    </div>
  );
}
