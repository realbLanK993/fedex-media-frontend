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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  const [currentPage, setCurrentPage] = React.useState(1);
  const searchParams = useSearchParams();
  const data = useFilterStore((state) => state.data);
  const filterEnabled = useFilterStore((state) => state.filterEnabled);

  React.useEffect(() => {
    console.log(data, "changing");
    if (searchParams.get("page")) {
      setCurrentPage(parseInt(searchParams.get("page") ?? "1"));
    }
    if (currentPage > data.length / ITEMS_PER_PAGE) {
      setCurrentPage(Math.floor(data.length / ITEMS_PER_PAGE));
    }
  }, [data]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {data.length > 0 ? (
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
                      <CardDescription>{article.source}</CardDescription>
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
                      article.Local_Leaders.toLowerCase() !== "none")) && (
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
      ) : (
        <FilterMessage filterEnabled={filterEnabled} />
      )}
      {data.length > ITEMS_PER_PAGE && (
        <div className="flex w-full justify-end items-end">
          <Pagination className="w-fit mx-0 py-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  isActive={currentPage != 1}
                  href={currentPage > 1 ? `?page=${currentPage - 1}` : ""}
                />
              </PaginationItem>
              <PaginationItem className="w-[100px] hover:bg-none flex justify-center">
                <PaginationLink>
                  Page {currentPage} of{" "}
                  {Math.floor(data.length / ITEMS_PER_PAGE)}
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  isActive={
                    currentPage != Math.floor(data.length / ITEMS_PER_PAGE)
                  }
                  href={
                    currentPage < data.length / ITEMS_PER_PAGE
                      ? `?page=${currentPage + 1}`
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ArticlesList;
