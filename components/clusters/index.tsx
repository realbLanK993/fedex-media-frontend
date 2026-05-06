"use client";

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database, Filter, Loader2 } from "lucide-react";
import { toast } from "sonner";
import EmptyState from "@/components/ui/empty-state";
import { getClusters, ClusterResponse } from "@/app/api-service";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAtomValue } from "jotai";
import { filterAtom, briefingDateAtom } from "@/store/filterStore";

const filterClusters = (clusters: ClusterResponse[], filter: any) => {
  return clusters
    // Search
    .filter((cluster) => {
      if (!filter.search) return true;
      const searchLower = filter.search.toLowerCase();
      return (
        (cluster.title && cluster.title.toLowerCase().includes(searchLower)) ||
        (cluster.summary && cluster.summary.toLowerCase().includes(searchLower))
      );
    })
    // Sentiment
    .filter((cluster) => {
      if (!filter.sentiment || filter.sentiment === "all") return true;
      return cluster.sentiment?.toLowerCase() === filter.sentiment.toLowerCase();
    })
    // Start Date
    .filter((cluster) => {
      if (!filter.start || !cluster.created_at) return true;
      try {
        return new Date(cluster.created_at) >= filter.start;
      } catch (err) {
        return true;
      }
    })
    // End Date
    .filter((cluster) => {
      if (!filter.end || !cluster.created_at) return true;
      try {
        return new Date(cluster.created_at) <= filter.end;
      } catch (err) {
        return true;
      }
    })
    // Attributes
    .filter((cluster) => filter.financialPerformance ? cluster.financial_performance : true)
    .filter((cluster) => filter.innovation ? cluster.innovation : true)
    .filter((cluster) => filter.regulatory ? cluster.regulatory : true)
    .filter((cluster) => filter.environmentResponsibility ? cluster.environment_responsibility : true)
    .filter((cluster) => filter.socialResponsibility ? cluster.social_responsibility : true)
    .filter((cluster) => filter.communityResponsibility ? cluster.community_responsibility : true)
    .filter((cluster) => filter.eCommerce ? cluster.e_commerce : true)
    .filter((cluster) => filter.globalLeadership ? cluster.global_leadership : true)
    .filter((cluster) => filter.executiveLeadership ? cluster.executive_leadership : true)
    .filter((cluster) => filter.businessLeadership ? cluster.business_leadership : true);
};

const ClustersList = () => {
  const [clusters, setClusters] = React.useState<ClusterResponse[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const filter = useAtomValue(filterAtom);
  const briefingDate = useAtomValue(briefingDateAtom);

  React.useEffect(() => {
    setLoading(true);
    getClusters(briefingDate)
      .then((res) => {
        setClusters(res);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error when fetching clusters:", error);
        toast.error("Error when fetching clusters");
        setLoading(false);
      });
  }, [briefingDate]);

  if (loading) {
    return (
      <div className="flex gap-2 justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin" size={16} />
        <span>Fetching clusters...</span>
      </div>
    );
  }

  const filteredClusters = clusters ? filterClusters(clusters, filter) : [];

  if (!clusters || clusters.length === 0) {
    return (
      <div className="h-[60vh] flex justify-center items-center">
        <EmptyState
          icon={Database}
          title="No clusters available"
          description="There are currently no clustered articles to display."
        />
      </div>
    );
  }

  if (filteredClusters.length === 0) {
    return (
      <div className="h-[60vh] flex justify-center items-center">
        <EmptyState
          icon={Filter}
          title="No clusters match filters"
          description="Try adjusting your search, sentiment, or date range."
        />
      </div>
    );
  }

  return (
    <React.Fragment>
      <ScrollArea className="flex flex-1 h-[calc(100vh-333px)] pr-4">
        <div className="flex flex-col gap-4 w-full">
          {filteredClusters.map((cluster) => (
            <Link
              key={cluster.id}
              href={`/dashboard/clusters/${cluster.id}`}
              className="group block"
            >
              <div className="flex flex-col bg-background hover:shadow-lg transition-shadow border mb-4 p-4 rounded-md">
                <div
                  className="prose prose-sm max-w-none text-gray-600 line-clamp-4 mb-3 text-justify [&_h2]:group-hover:text-primary [&_h2]:text-foreground [&_h2]:text-lg [&_h2]:font-medium [&_h2]:leading-tight [&_h2]:mt-0 [&_h2]:mb-2"
                  dangerouslySetInnerHTML={{
                    __html: cluster.summary
                      ? cluster.summary.replace(/^```html\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim()
                      : ""
                  }}
                />

                <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                  <div className="flex justify-center items-center gap-2">
                    <span className={`text-[10px] bg-accent p-2 px-4 tracking-wider font-medium rounded-sm ${cluster.sentiment?.toLowerCase() === 'positive' ? 'text-green-600' :
                      cluster.sentiment?.toLowerCase() === 'negative' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                      {cluster.sentiment?.toUpperCase() || 'NEUTRAL'}
                    </span>
                    <div className="w-1 h-1 bg-gray-600 rounded-full" />
                    <span>{cluster.article_count} Articles</span>
                  </div>
                  <span>{cluster.created_at ? new Date(cluster.created_at).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </React.Fragment>
  );
};

export default ClustersList;

