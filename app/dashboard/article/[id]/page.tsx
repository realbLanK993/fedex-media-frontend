"use client";

import { useAtomValue } from "jotai";
import { filteredArticleDataAtom } from "@/store/filterStore";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowLeft, Layers } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { getArticles, getClusterArticles } from "@/app/api-service";
import Link from "next/link";

// Inner component that uses useSearchParams (must be inside Suspense)
function ArticlePageInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = params.id as string;

  // Cluster context (present when navigating from a cluster dialog)
  const clusterIdParam = searchParams.get("cluster_id");
  const clusterTitle = searchParams.get("cluster_title");
  const fromCluster = !!clusterIdParam;

  const globalData = useAtomValue(filteredArticleDataAtom);
  const [article, setArticle] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [articlesList, setArticlesList] = useState<any[]>([]);

  useEffect(() => {
    const processData = (list: any[]) => {
      setArticlesList(list);
      const idx = list.findIndex((a: any) => String(a.id) === idParam);
      if (idx !== -1) {
        setArticle(list[idx]);
        setCurrentIndex(idx);
      } else {
        // Fallback: treat idParam as a numeric index
        const fallbackIdx = parseInt(idParam);
        if (!isNaN(fallbackIdx) && fallbackIdx >= 0 && fallbackIdx < list.length) {
          setArticle(list[fallbackIdx]);
          setCurrentIndex(fallbackIdx);
        }
      }
    };

    if (fromCluster && clusterIdParam) {
      // When coming from a cluster, scope prev/next to that cluster's articles
      getClusterArticles(parseInt(clusterIdParam)).then((res) => {
        if (res?.articles && res.articles.length > 0) {
          processData(res.articles);
        }
      });
    } else if (globalData && globalData.length > 0) {
      processData(globalData);
    } else {
      getArticles().then((res) => {
        if (res && res.length > 0) processData(res);
      });
    }
  }, [globalData, idParam, clusterIdParam, fromCluster]);

  if (!article) {
    return <div className="p-8">Loading...</div>;
  }

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < articlesList.length - 1;

  /** Build href that preserves cluster context for prev/next */
  const articleHref = (art: any, idx: number) => {
    const base = `/dashboard/article/${art.id ?? idx}`;
    if (fromCluster && clusterIdParam) {
      const qs = new URLSearchParams({
        cluster_id: clusterIdParam,
        ...(clusterTitle ? { cluster_title: clusterTitle } : {}),
      });
      return `${base}?${qs.toString()}`;
    }
    return base;
  };

  const handlePrev = () => {
    if (hasPrev) {
      router.push(articleHref(articlesList[currentIndex - 1], currentIndex - 1));
    }
  };

  const handleNext = () => {
    if (hasNext) {
      router.push(articleHref(articlesList[currentIndex + 1], currentIndex + 1));
    }
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-280px)]">
      {/* ── Top Navigation Bar ── */}
      <div className="flex items-center border-b px-4 py-2 bg-background gap-2">
        {/* Go Back — only visible when coming from a cluster */}
        {fromCluster && clusterIdParam && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/dashboard/clusters/${clusterIdParam}`)}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground mr-2"
          >
            <ArrowLeft size={14} />
            <span>Go Back</span>
            {clusterTitle && (
              <span className="hidden sm:inline text-xs opacity-60 ml-1 truncate max-w-[180px]">
                · {clusterTitle}
              </span>
            )}
          </Button>
        )}

        <div className="flex-1" />

        {/* Article counter */}
        {articlesList.length > 0 && (
          <span className="text-xs text-muted-foreground mr-2">
            {currentIndex + 1} / {articlesList.length}
          </span>
        )}

        {/* Prev / Next */}
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
        {/* ── Main Content ── */}
        <div className="w-full md:w-2/3 p-8 overflow-y-auto">
          {article.outlet && (
            <span className="text-xs tracking-widest font-bold text-red-600 uppercase mb-4 block">
              {article.outlet}
            </span>
          )}
          <h1 className="text-4xl font-light text-primary mb-4 leading-tight">
            {article.headline}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-400 mb-8 flex-wrap">
            
            {article.date && (
              <>
                <span>{article.date}</span>
              </>
            )}
            {article.sentiment && (
              <>
                <span>·</span>
                <span
                  className={`font-semibold ${article.sentiment?.toLowerCase() === "positive"
                    ? "text-green-600"
                    : article.sentiment?.toLowerCase() === "negative"
                      ? "text-red-600"
                      : "text-gray-500"
                    }`}
                >
                  {article.sentiment}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col gap-6 text-primary/80">
            <div
              className="text-lg leading-relaxed prose prose-primary max-w-none"
              dangerouslySetInnerHTML={{ __html: article.summary }}
            />
          </div>

          {article.hyperlink && article.hyperlink !== "#" && (
            <a
              href={article.hyperlink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 text-sm text-primary underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              Read original article →
            </a>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="w-full md:w-1/3 border-l bg-background overflow-y-auto p-6">
          {/* Cluster context card */}
          {fromCluster && clusterTitle && (
            <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Layers size={13} className="text-primary" />
                <span className="text-xs font-bold tracking-widest uppercase text-primary">
                  From Cluster
                </span>
              </div>
              <p className="text-sm font-medium leading-snug">
                {clusterTitle}
              </p>
              <Link
                href={`/dashboard/clusters/${clusterIdParam}`}
                className="text-xs text-primary underline underline-offset-2 mt-2 inline-block hover:opacity-70"
              >
                View cluster →
              </Link>
            </div>
          )}

          <h4 className="font-bold text-sm mb-4">Article Details</h4>
          <div className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-400">

            {article.media_type && (
              <div className="flex justify-between">
                <span className="text-gray-400">Media Type</span>
                <span className="font-medium">{article.media_type}</span>
              </div>
            )}
            {article.keyword && (
              <div className="flex justify-between">
                <span className="text-gray-400">Keyword</span>
                <span className="font-medium">{article.keyword}</span>
              </div>
            )}
            {article.quarter && (
              <div className="flex justify-between">
                <span className="text-gray-400">Quarter</span>
                <span className="font-medium">{article.quarter}</span>
              </div>
            )}
          </div>

          {/* Business Drivers */}
          <h4 className="font-bold text-sm mt-8 mb-4">Business Drivers</h4>
          <div className="flex flex-wrap gap-2">
            {article.financial_performance ? (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                Financial Performance
              </span>
            ) : null}
            {article.innovation ? (
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                Innovation
              </span>
            ) : null}
            {article.regulatory ? (
              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 text-xs rounded-full">
                Regulatory
              </span>
            ) : null}
            {article.environment_responsibility ? (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full">
                Environment
              </span>
            ) : null}
            {article.social_responsibility ? (
              <span className="px-2 py-1 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 text-xs rounded-full">
                Social
              </span>
            ) : null}
            {article.community_responsibility ? (
              <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs rounded-full">
                Community
              </span>
            ) : null}
            {article.e_commerce ? (
              <span className="px-2 py-1 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs rounded-full">
                E-Commerce
              </span>
            ) : null}
            {!article.financial_performance &&
              !article.innovation &&
              !article.regulatory &&
              !article.environment_responsibility &&
              !article.social_responsibility &&
              !article.community_responsibility &&
              !article.e_commerce && (
                <span className="text-xs text-gray-400">None tagged</span>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ArticlePage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <ArticlePageInner />
    </Suspense>
  );
}
