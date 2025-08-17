import ArticlesList from "@/components/articles";
import ArticleNavbar from "@/components/layout/article";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <ArticleNavbar />
      <div className="h-full w-full">
        <ArticlesList />
      </div>
    </div>
  );
}
