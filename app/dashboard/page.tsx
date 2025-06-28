import ArticlesList from "@/components/articles";
import ArticleNavbar from "@/components/layout/article";

export default function Dashboard() {
  return (
    <main className="flex flex-1 h-full">
      <div className="flex flex-col gap-4 p-4 w-full">
        <ArticleNavbar />
        <div className="h-full">
          <ArticlesList />
        </div>
      </div>
    </main>
  );
}
