"use client";

import * as React from "react";

import {
  articleDataAtom,
  filteredArticleDataAtom,
  isFilter,
} from "@/store/filterStore";
import { ScrollArea } from "../ui/scroll-area";
import { Database, Filter, Loader2 } from "lucide-react";
import { toast } from "sonner";
import EmptyState from "../ui/empty-state";
import { getArticles } from "@/app/api-service";
import { useAtom, useAtomValue } from "jotai";
import ArticleCard, { LeaderDisplay } from "./card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

const ArticlesList = () => {
  const [currentPage, setCurrentPage] = React.useState<number | null>(null);
  const [data, setData] = useAtom(articleDataAtom);
  const filteredData = useAtomValue(filteredArticleDataAtom);
  const filterEnabled = useAtomValue(isFilter);
  const targetElementRef = React.useRef<HTMLDivElement | null>(null);
  const minPage = 1;
  const maxPage = Math.floor(
    filteredData ? filteredData.length / ITEMS_PER_PAGE : 1
  );

  React.useEffect(() => {
    if (!data) {
      getArticles()
        .then(async (res) => {
          if (res) {
            setData(res);
          } else {
            toast.error("Error when fetching articles");
          }
        })
        .catch(() => {
          console.error("Error when fetching articles");
          toast.error("Error when fetching articles");
        });
    }
  }, []);

  React.useEffect(() => {
    const locallyAvailable = window.localStorage.getItem("page");
    if (locallyAvailable) {
      setCurrentPage(() => parseInt(locallyAvailable));
    } else {
      window.localStorage.setItem("page", "1");
      setCurrentPage(() => 1);
    }
  }, [data]);

  (() => {
    if (targetElementRef.current) {
      targetElementRef.current.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    }
  })();

  return (
    <React.Fragment>
      <ScrollArea className="flex flex-1 h-[calc(100vh-333px)]">
        <div ref={targetElementRef} />
        <div className="flex flex-col gap-4 w-full">
          {currentPage ? (
            data && data.length > 0 ? (
              filteredData &&
              filteredData
                .slice(
                  (currentPage - 1) * ITEMS_PER_PAGE,
                  currentPage * ITEMS_PER_PAGE
                )
                .map((article: any, index: number) => (
                  <Link
                    key={index}
                    href={`/dashboard/article/${article.id ?? ((currentPage - 1) * ITEMS_PER_PAGE + index)}`}
                    className="group block"
                  >
                    <div className="flex bg-background hover:shadow-lg transition-shadow border mb-6 h-40">
                      <div className="bg-gray-200 w-1/3 min-w-[140px] max-w-[200px] h-full relative flex-shrink-0">
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] tracking-wider font-bold px-1.5 py-0.5 rounded-sm z-10">
                          {article.outlet.substring(0, 3).toUpperCase()}
                        </div>
                      </div>
                      <div className="w-2/3 py-3 px-6 flex flex-col justify-between">
                        <div className="flex flex-col gap-2">
                          <small className="text-gray-500 font-medium">{article.company} • {article.country ?? "India"}</small>
                          <h3 className="group-hover:text-primary text-xl font-medium leading-tight line-clamp-3">
                            {article.headline}
                          </h3>
                        </div>
                        <p className="text-gray-400 text-xs font-medium">
                          {article.date}
                        </p>
                      </div>
                    </div>
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
          data &&
          data.length > ITEMS_PER_PAGE && (
            <div className="flex w-full gap-4 justify-center items-center">
              <Button
                disabled={currentPage === minPage}
                onClick={() => {
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
