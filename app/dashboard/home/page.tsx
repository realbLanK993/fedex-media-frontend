import ClustersList from "@/components/clusters";
import DailyBriefing from "@/components/daily-briefing";
import ArticleNavbar from "@/components/layout/article";
import CategoryNav from "@/components/layout/category-nav";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Dashboard() {
  return (
    <div>
      <CategoryNav />
      <div className="flex flex-col gap-4 p-4 w-full h-[calc(100vh-280px)]">

        {/* <ArticleNavbar /> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-full w-full">
          <div className="h-full overflow-hidden">
            <DailyBriefing />
          </div>
          <div className="h-full overflow-hidden flex flex-col">
            <h2 className="text-3xl font-light text-primary">Key Discussions</h2>
            <ClustersList />
          </div>
        </div>
      </div>
    </div>
  );
}
