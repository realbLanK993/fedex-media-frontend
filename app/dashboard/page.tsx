import ArticlesList from "@/components/articles";
import ArticleNavbar from "@/components/layout/article";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAiStore } from "@/store/aiBar";

export default function Dashboard() {
  return (
    <ScrollArea className="flex flex-1 h-[calc(100vh-70px)]">
      <div className="flex flex-col gap-4 p-4 w-full">
        <ArticleNavbar />
        <div className="h-full">
          <ArticlesList />
        </div>
      </div>
    </ScrollArea>
  );
}
