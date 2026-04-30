"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEntityArticles, EntityArticlesResponse } from "@/app/api-service";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import CategoryNav from "@/components/layout/category-nav";
import EmptyState from "@/components/ui/empty-state";
import { Database } from "lucide-react";

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const topic = decodeURIComponent(params.topic as string);

  const [data, setData] = useState<EntityArticlesResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!topic) {
      router.push("/dashboard/home");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await getEntityArticles(topic);
        if (res) setData(res);
      } catch (err) {
        console.error("Failed to fetch topic articles", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topic, router]);

  return (
    <div className="flex flex-col w-full h-[calc(100vh-280px)]">
      <CategoryNav />
      <div className="flex flex-col h-full overflow-hidden p-8">
        <h1 className="text-4xl font-light text-primary mb-8 leading-tight">
          Articles for "{topic}"
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : !data || !data.articles || data.articles.length === 0 ? (
          <div className="h-full flex justify-center items-center">
            <EmptyState
              icon={Database}
              title="No articles available"
              description={`There are currently no articles mentioning the topic "${topic}".`}
            />
          </div>
        ) : (
          <ScrollArea className="flex-1 pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.articles.map((article: any, index: number) => (
                <Link
                  key={article.id ?? index}
                  href={`/dashboard/article/${article.id ?? index}`}
                  className="group block"
                >
                  <div className="flex flex-col bg-background hover:shadow-lg transition-shadow border rounded-md overflow-hidden h-full">
                    <div className="relative p-4 border-b bg-gray-50 flex justify-between items-center">
                      <div className="bg-red-600 text-white text-[10px] tracking-wider font-bold px-1.5 py-0.5 rounded-sm">
                        {article.outlet?.substring(0, 3).toUpperCase() || "N/A"}
                      </div>
                      <small className="text-gray-500 font-medium text-xs">
                        {article.date}
                      </small>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <small className="text-gray-500 font-medium mb-2 block">
                        {article.company} • {article.country ?? "India"}
                      </small>
                      <h3 className="group-hover:text-primary text-lg font-medium leading-tight line-clamp-3 mb-2">
                        {article.headline}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3 mt-auto">
                        {article.summary}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
