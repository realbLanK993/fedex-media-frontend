"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Article } from "@/lib/types/article";
import { useFilterStore } from "@/store/filterStore";
import { FilterMessage } from "./filter-enabled";

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

const ArticlesList = () => {
  const data = useFilterStore((state) => state.data);
  const filterEnabled = useFilterStore((state) => state.filterEnabled);
  return (
    <div className="flex flex-col gap-4 w-full">
      {data.length > 0 ? (
        data.map((article, index) => (
          <a
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
          </a>
        ))
      ) : (
        <FilterMessage filterEnabled={filterEnabled} />
      )}
    </div>
  );
};

export default ArticlesList;
