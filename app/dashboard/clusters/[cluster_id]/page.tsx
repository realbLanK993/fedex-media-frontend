"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getClusterArticles,
  getClusters,
  getClusterTopics,
  ClusterArticlesResponse,
  ClusterResponse,
  TopEntityItem,
} from "@/app/api-service";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

/** Strip leading/trailing ```html … ``` markdown fences from LLM output */
function stripHtmlFences(raw: string): string {
  return raw
    .replace(/^```html\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

export default function ClusterPage() {
  const params = useParams();
  const router = useRouter();
  const clusterId = parseInt(params.cluster_id as string, 10);

  const [data, setData] = useState<ClusterArticlesResponse | null>(null);
  const [clustersList, setClustersList] = useState<ClusterResponse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [topics, setTopics] = useState<TopEntityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isNaN(clusterId)) {
      router.push("/dashboard/home");
      return;
    }

    const fetchData = async () => {
      try {
        const [clusterRes, allClusters, topicsRes] = await Promise.all([
          getClusterArticles(clusterId),
          getClusters(),
          getClusterTopics(clusterId),
        ]);

        if (clusterRes) setData(clusterRes);
        if (allClusters) {
          setClustersList(allClusters);
          const idx = allClusters.findIndex((c) => c.id === clusterId);
          setCurrentIndex(idx);
        }
        if (topicsRes) setTopics(topicsRes.entities);
      } catch (err) {
        console.error("Failed to fetch cluster data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clusterId, router]);

  if (loading) {
    return (
      <div className="p-8 flex items-center">
        <Loader2 className="animate-spin mr-2" size={24} />
        <span>Loading...</span>
      </div>
    );
  }

  if (!data) {
    return <div className="p-8">Cluster Not Found</div>;
  }

  const { cluster, articles } = data;
  const outlets = Array.from(
    new Set(
      articles?.map((a) => a.outlet?.substring(0, 3).toUpperCase()).filter(Boolean)
    )
  );

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < clustersList.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      router.push(`/dashboard/clusters/${clustersList[currentIndex - 1].id}`);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      router.push(`/dashboard/clusters/${clustersList[currentIndex + 1].id}`);
    }
  };

  const cleanSummary = stripHtmlFences(cluster.summary ?? "");

  return (
    <div className="flex flex-col w-full h-[calc(100vh-280px)]">
      {/* Top Navigation */}
      <div className="flex justify-between items-center border-b px-4 py-2 bg-background">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrev}
          disabled={!hasPrev}
        >
          <ChevronLeft size={16} className="mr-1" /> Prev
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          disabled={!hasNext}
        >
          Next <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>

      <div className="flex flex-col md:flex-row h-full overflow-hidden">
        {/* Main Content */}
        <div className="w-full md:w-2/3 p-8 overflow-y-auto">
          {/* <h1 className="text-4xl font-light text-primary mb-8 leading-tight">
            {cluster.title}
          </h1> */}

          <div className="flex flex-col gap-6 text-primary/80">
            <div
              className="text-lg leading-relaxed prose prose-primary max-w-none text-justify"
              dangerouslySetInnerHTML={{ __html: cleanSummary }}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-1/3 border-l bg-background overflow-y-auto">
          <Dialog>
            <DialogTrigger asChild>
              <div className="p-6 border-b flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <h3 className="text-xl font-light text-gray-600">
                  {articles?.length || 0} Sources
                </h3>
                <div className="flex -space-x-2">
                  {outlets.slice(0, 3).map((outlet, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold z-${30 - i * 10} ${i % 3 === 0
                        ? "bg-red-600"
                        : i % 3 === 1
                          ? "bg-blue-600"
                          : "bg-red-500"
                        }`}
                    >
                      {outlet}
                    </div>
                  ))}
                  {outlets.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold z-0">
                      +{outlets.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col p-0">
              <DialogHeader className="p-6 pb-2">
                <DialogTitle>Articles in this Cluster</DialogTitle>
              </DialogHeader>
              <ScrollArea className="flex-1 p-6 pt-0">
                <div className="flex flex-col gap-4 h-[500px]">
                  {articles?.map((article: any, index: number) => (
                    <Link
                      key={article.id ?? index}
                      href={`/dashboard/article/${article.id ?? index}?cluster_id=${clusterId}&cluster_title=${encodeURIComponent(cluster.title)}`}
                      className="group block"
                    >
                      <div className="flex bg-background hover:shadow-lg transition-shadow border mb-2 h-32 rounded-md overflow-hidden">
                        <div className="bg-gray-200 w-1/4 min-w-[100px] h-full relative flex-shrink-0">
                          <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] tracking-wider font-bold px-1.5 py-0.5 rounded-sm z-10">
                            {article.outlet?.substring(0, 3).toUpperCase() ||
                              "N/A"}
                          </div>
                        </div>
                        <div className="w-3/4 py-3 px-4 flex flex-col justify-between">
                          <div className="flex flex-col gap-1">
                            <small className="text-gray-500 font-medium">
                              {article.company} • {article.country ?? "India"}
                            </small>
                            <h3 className="group-hover:text-primary text-md font-medium leading-tight line-clamp-2">
                              {article.headline}
                            </h3>
                          </div>
                          <p className="text-gray-400 text-xs font-medium">
                            {article.date}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {/* Topics from API */}
          <div className="p-6">
            <h4 className="font-bold text-sm mb-6">Key Topics & Entities</h4>
            <div className="flex flex-col gap-4">
              {topics.length === 0 ? (
                <p className="text-sm text-gray-400">No topics available.</p>
              ) : (
                topics.slice(0, 5).map((topic, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center cursor-default"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-300">
                        {topic.entity_label?.substring(0, 3).toUpperCase() ||
                          "ENT"}
                      </div>
                      <div className="flex flex-col">
                        {topic.wikipedia_title ? (
                          <a
                            href={`https://en.wikipedia.org/wiki/${encodeURIComponent(topic.wikipedia_title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-sm text-primary underline hover:opacity-80 transition-opacity"
                          >
                            {topic.entity_text}
                          </a>
                        ) : (
                          <span className="font-bold text-sm">
                            {topic.entity_text}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {topic.entity_label}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
