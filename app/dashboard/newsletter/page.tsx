"use client";

import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { briefingDateAtom } from "@/store/filterStore";
import { format } from "date-fns";

export default function FedExNewsletterPage() {
  const briefingDate = useAtomValue(briefingDateAtom);
  const [newsletterHtml, setNewsletterHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNewsletter = async () => {
      setIsLoading(true);
      try {
        const dateStr = format(briefingDate, "dd-MMM-yy").toUpperCase();
        const res = await fetch(`${process.env.NEXT_PUBLIC_RAG_API_URL}/newsletter/by-date?date=${dateStr}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          let html = await res.text();
          // Inject a base tag to ensure any relative paths resolve to the backend
          if (!html.includes("<base ")) {
            const baseTag = `<base href="${process.env.NEXT_PUBLIC_RAG_API_URL}/">`;
            if (html.includes("<head>")) {
              html = html.replace("<head>", `<head>\n  ${baseTag}`);
            } else {
              html = `<head>${baseTag}</head>\n` + html;
            }
          }
          setNewsletterHtml(html);
        } else {
          console.error("Failed to fetch newsletter:", await res.text());
          setNewsletterHtml(`<div style="padding: 20px; font-family: sans-serif;">Error loading newsletter for ${dateStr}</div>`);
        }
      } catch (err) {
        console.error(err);
        setNewsletterHtml(`<div style="padding: 20px; font-family: sans-serif;">Failed to connect to the server.</div>`);
      } finally {
        setIsLoading(false);
      }
    };

    if (briefingDate) {
      fetchNewsletter();
    }
  }, [briefingDate]);

  if (!process.env.NEXT_PUBLIC_RAG_API_URL) {
    return (
      <div className="p-4 md:p-8 text-center">
        <p className="text-red-500 font-semibold">
          Error: API URL is not configured. Please set NEXT_PUBLIC_RAG_API_URL.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full bg-background relative">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <p className="text-lg">Loading newsletter...</p>
        </div>
      )}
      <iframe
        srcDoc={newsletterHtml || undefined}
        title="FedEx Newsletter"
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
}
