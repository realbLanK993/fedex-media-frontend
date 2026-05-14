"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getDailyBriefing, DailyBriefingResponse } from "@/app/api-service";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import ReactMarkdown from "react-markdown";
import { format } from "date-fns";


import { briefingDateAtom } from "@/store/filterStore";
import { useAtomValue } from "jotai";

export default function DailyBriefing() {
  const [briefing, setBriefing] = useState<DailyBriefingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const briefingDate = useAtomValue(briefingDateAtom);

  useEffect(() => {
    setLoading(true);
    getDailyBriefing(briefingDate).then((data) => {
      setBriefing(data);
      setLoading(false);
    });
  }, [briefingDate]);





  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-4 md:pr-6 h-full items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <p>Loading latest briefing...</p>
      </div>
    );
  }

  if (!briefing) {
    return (
      <div className="flex flex-col gap-6 p-4 md:pr-6 h-full">
        <h2 className="text-3xl font-light text-primary">Latest Brief</h2>
        <p className="text-sm text-primary/80">No briefing available today.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:pr-6 h-full">
      <h2 className="text-3xl font-light text-primary">Latest Briefing</h2>

      <ScrollArea className="flex-1 pr-4">
        <div className="flex flex-col gap-4 h-[300px]">
          <p className="text-sm font-medium text-primary/60">{format(briefingDate, "PPPP")}</p>

          <div className="prose prose-sm prose-primary max-w-none text-justify">
            {/<\/?[a-z][\s\S]*>/i.test(briefing.briefing_content || "") ? (
              <div dangerouslySetInnerHTML={{ __html: briefing.briefing_content || "" }} />
            ) : (
              <ReactMarkdown>
                {briefing.briefing_content || ""}
              </ReactMarkdown>
            )}
          </div>

          {briefing.sources && briefing.sources.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <h3 className="text-sm font-semibold mb-2">Sources</h3>
              <ul className="text-xs flex flex-col gap-2">
                {briefing.sources.map((source, idx) => (
                  <li key={idx}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {source.headline}
                    </a>
                    <span className="text-primary/60 ml-2">({source.outlet})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </ScrollArea>

    </div>
  );
}
