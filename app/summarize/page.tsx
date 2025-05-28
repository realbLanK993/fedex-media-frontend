// app/summarize/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Loader2,
  ExternalLinkIcon,
  AlertTriangleIcon,
  BookOpenText,
} from "lucide-react";
import Link from "next/link";
import { fetchSummary, SummaryApiResponse } from "@/lib/apiService";

// Import ReactMarkdown and remark-gfm
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useCommandPaletteStore } from "@/store/command-pallete";
import { toTitleCase } from "@/lib/utils";

export default function SummarizePage() {
  const router = useRouter();
  const { initialAiQuery, setInitialAiQuery } = useCommandPaletteStore();

  const [summaryData, setSummaryData] = useState<SummaryApiResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);

  const initialTopicProcessedRef = useRef(false);

  useEffect(() => {
    if (initialAiQuery && !initialTopicProcessedRef.current) {
      console.log(
        "SummarizePage: Processing topic from Zustand:",
        initialAiQuery
      );
      setCurrentTopic(initialAiQuery);
      setIsLoading(true);
      setError(null);
      setSummaryData(null);
      initialTopicProcessedRef.current = true;

      fetchSummary(initialAiQuery.trim())
        .then((data) => {
          setSummaryData(data);
        })
        .catch((err) => {
          console.error("Failed to fetch summary:", err);
          setError(
            err instanceof Error
              ? err.message
              : "An unknown error occurred while fetching the summary."
          );
        })
        .finally(() => {
          setIsLoading(false);
        });

      setInitialAiQuery(null);
    } else if (
      !initialAiQuery &&
      !currentTopic &&
      !isLoading &&
      !summaryData &&
      !error
    ) {
      console.log(
        "SummarizePage: No initial topic from Zustand, and not currently processing."
      );
      setError(
        "No topic was provided for summarization. Please use the 'Ask AI' palette."
      );
      setIsLoading(false);
    }
  }, [
    initialAiQuery,
    setInitialAiQuery,
    currentTopic,
    isLoading,
    summaryData,
    error,
  ]);

  useEffect(() => {
    if (!initialAiQuery && !summaryData && !error && !isLoading) {
      initialTopicProcessedRef.current = false;
    }
  }, [initialAiQuery, summaryData, error, isLoading]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="bg-card border-b p-4 flex items-center justify-between sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          asChild
        >
          <Link href="/" aria-label="Back to dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-lg font-semibold flex items-center">
          <BookOpenText className="mr-2 h-5 w-5" />
          Topic Summary
        </h1>
        <div className="w-8"></div>
      </header>

      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          {isLoading && (
            <Card>
              <CardHeader>
                <div className="animate-pulse h-7 bg-muted rounded w-3/4 mb-2"></div>
                <div className="animate-pulse h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="animate-pulse h-4 bg-muted rounded w-full"></div>
                <div className="animate-pulse h-4 bg-muted rounded w-full"></div>
                <div className="animate-pulse h-4 bg-muted rounded w-5/6"></div>
                <div className="animate-pulse h-4 bg-muted rounded w-full"></div>
                <div className="animate-pulse h-4 bg-muted rounded w-3/4"></div>
                <div className="mt-6 pt-4 border-t border-muted/50">
                  <div className="animate-pulse h-5 bg-muted rounded w-1/4 mb-3"></div>
                  <div className="flex flex-wrap gap-2">
                    <div className="animate-pulse h-7 bg-muted rounded-full w-28"></div>
                    <div className="animate-pulse h-7 bg-muted rounded-full w-24"></div>
                    <div className="animate-pulse h-7 bg-muted rounded-full w-32"></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="animate-pulse h-10 bg-muted rounded w-24"></div>
              </CardFooter>
            </Card>
          )}

          {error && !isLoading && (
            <Card className="border-destructive bg-destructive/10 text-destructive">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangleIcon className="mr-2 h-6 w-6" />
                  Error Generating Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{error}</p>
                <p className="mt-2 text-sm text-destructive/80">
                  Please ensure the topic is clear, try a different topic, or
                  check if the AI service is available.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => router.push("/")}>
                  Go to Dashboard
                </Button>
              </CardFooter>
            </Card>
          )}

          {!isLoading && !error && summaryData && currentTopic && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {toTitleCase(currentTopic)}
                </CardTitle>
                <CardDescription>
                  AI-generated summary based on retrieved articles for the topic
                  above.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  // Apply Tailwind Typography styles for nice default markdown rendering
                  className="prose dark:prose-invert max-w-none text-foreground"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {summaryData.response}
                  </ReactMarkdown>
                </div>

                {summaryData.metadata && summaryData.metadata.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-border">
                    <h4 className="text-md font-semibold mb-3 text-muted-foreground">
                      Sources:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {summaryData.metadata.map((meta, index) => (
                        <a
                          key={index}
                          href={meta.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Badge
                            variant="secondary"
                            className="hover:bg-primary/20 transition-colors py-1 px-2.5 text-xs sm:text-sm"
                          >
                            {meta.outlet || new URL(meta.url).hostname}
                            <ExternalLinkIcon className="ml-1.5 h-3.5 w-3.5" />
                          </Badge>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" onClick={() => router.back()}>
                  Go Back
                </Button>
              </CardFooter>
            </Card>
          )}

          {!isLoading && !error && !currentTopic && !summaryData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-muted-foreground">
                  <AlertTriangleIcon className="mr-2 h-5 w-5" />
                  No Topic Provided
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  No topic was specified for summarization. Please use the "Ask
                  AI" command palette to enter a topic.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" onClick={() => router.push("/")}>
                  Go to Dashboard
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
