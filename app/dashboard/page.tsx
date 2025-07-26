import ArticlesList from "@/components/articles";
import ArticleNavbar from "@/components/layout/article";

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
