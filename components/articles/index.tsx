"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useFilterStore } from "@/store/filterStore";
import { FilterMessage } from "./filter-enabled";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";
import { Database, Filter, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import EmptyState from "../ui/empty-state";

const LeaderDisplay = ({
  label,
  name,
}: {
  label: string;
  name: string | null;
}) => {
  if (!name || name.toLowerCase() === "none") return null;

  return (
    <div className="flex items-center gap-2 p-2">
      <div className="min-w-0 flex-1">
        <p className="text-xs">{label}</p>
        <p className="text-sm font-bold">{name}</p>
      </div>
    </div>
  );
};

const ITEMS_PER_PAGE = 10;

const ArticlesList = () => {
  const [currentPage, setCurrentPage] = React.useState<number | null>(null);
  const data = useFilterStore((state) => state.data);
  const filterEnabled = useFilterStore((state) => state.filterEnabled);
  const targetElementRef = React.useRef<HTMLDivElement | null>(null);
  const minPage = 1;
  const maxPage = Math.floor(data.length / ITEMS_PER_PAGE);

  React.useEffect(() => {
    const locallyAvailable = window.localStorage.getItem("page");
    if (locallyAvailable) {
      setCurrentPage((prev) => parseInt(locallyAvailable));
    } else {
      window.localStorage.setItem("page", "1");
      setCurrentPage((prev) => 1);
    }
  }, [data]);

  const scrollToElement = () => {
    if (targetElementRef.current) {
      targetElementRef.current.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    }
  };

  return (
    <React.Fragment>
      <ScrollArea className="flex flex-1 h-[calc(100vh-220px)]">
        <div ref={targetElementRef} />
        <div className="flex flex-col gap-4 w-full">
          {currentPage ? (
            data.length > 0 ? (
              data
                .slice(
                  (currentPage - 1) * ITEMS_PER_PAGE,
                  currentPage * ITEMS_PER_PAGE
                )
                .map((article, index) => (
                  <Link
                    key={index}
                    href={article.hyperlink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex flex-col gap-2">
                          <div className="flex w-full gap-2 justify-between">
                            <small>{article.company.toLocaleUpperCase()}</small>
                            <small className="text-primary">
                              {article.sentiment.toLocaleUpperCase()}
                            </small>
                          </div>
                          <CardTitle className="group-hover:underline">
                            {article.headline}
                          </CardTitle>
                          <div className="flex gap-2 items-center">
                            <CardDescription>{article.country}</CardDescription>
                            <span className="w-1 h-1 bg-primary rounded-full" />
                            <CardDescription>{article.outlet}</CardDescription>
                            <span className="w-1 h-1 bg-primary rounded-full" />
                            <CardDescription>{article.date}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p>{article.summary}</p>
                        {((article.AMEA_Leader &&
                          article.AMEA_Leader.toLowerCase() !== "none") ||
                          (article.AMEA_Executive &&
                            article.AMEA_Executive.toLowerCase() !== "none") ||
                          (article.Local_Leaders &&
                            article.Local_Leaders.toLowerCase() !==
                              "none")) && (
                          <div className="flex flex-col md:flex-row gap-4 mt-4">
                            <LeaderDisplay
                              label="AMEA Leader"
                              name={article.AMEA_Leader ?? ""}
                            />
                            <LeaderDisplay
                              label="AMEA Executive"
                              name={article.AMEA_Executive ?? ""}
                            />
                            <LeaderDisplay
                              label="Local Leaders"
                              name={article.Local_Leaders ?? ""}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))
            ) : filterEnabled ? (
              <EmptyState
                icon={Filter}
                title="No articles found"
                description="Your current filter settings are applied. Modify them to see different articles."
              />
            ) : (
              <div>
                <EmptyState
                  icon={Database}
                  title="No articles available"
                  description="No articles were found. If you think this is a problem, contact system administrator"
                />
              </div>
            )
          ) : (
            <div className="flex gap-2 justify-center items-center h-[60vh]">
              {" "}
              <Loader2 className="animate-spin" size={16} />{" "}
              <span>Fetching data...</span>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="flex flex-1 w-full h-full items-end justify-center p-2">
        {currentPage ? (
          data.length > ITEMS_PER_PAGE && (
            <div className="flex w-full gap-4 justify-center items-center">
              <Button
                disabled={currentPage === minPage}
                onClick={() => {
                  scrollToElement();
                  if (currentPage > minPage) {
                    setCurrentPage((prev) => {
                      if (prev) {
                        return prev - 1;
                      }
                      return prev;
                    });
                  } else {
                    return;
                  }
                }}
              >
                Prev
              </Button>
              <div className="flex gap-2 justify-center items-center">
                {currentPage && (
                  <Input
                    type="number"
                    value={currentPage}
                    onChange={(e) =>
                      setCurrentPage((prev) => {
                        try {
                          const val = parseInt(e.target.value);
                          if (val <= maxPage && val >= minPage) {
                            return val;
                          } else {
                            toast.error(
                              `Enter a valid integer between ${minPage} and ${maxPage}`
                            );
                            return prev;
                          }
                        } catch (err) {
                          console.error("Error: ", (err as Error).message);
                          toast.error(`Error: ${(err as Error).message}`);
                          return 1;
                        }
                      })
                    }
                    min={0}
                    max={Math.floor(data.length / ITEMS_PER_PAGE)}
                    className="w-[60px] border-0 border-b-2 border-accent focus:ring-0 focus-visible:ring-0"
                  />
                )}
                <p>of {Math.floor(data.length / ITEMS_PER_PAGE)}</p>
              </div>
              <Button
                onClick={() => {
                  scrollToElement();
                  if (currentPage < maxPage) {
                    setCurrentPage((prev) => {
                      if (prev) {
                        return prev + 1;
                      }
                      return prev;
                    });
                  }
                  return;
                }}
                disabled={currentPage === maxPage}
              >
                Next
              </Button>
            </div>
          )
        ) : (
          <div className="flex w-full gap-4 justify-center items-center">
            <Skeleton className="px-4 w-16 h-10" />
            <Skeleton className="px-4 w-20 h-10" />
            <Skeleton className="px-4 w-16 h-10" />
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default ArticlesList;
