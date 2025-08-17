import { Article } from "@/lib/types/article";
import Link from "next/link";
import Image from "next/image";
export const LeaderDisplay = ({
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
export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={""} target="_blank" rel="noopener noreferrer" className="group">
      <div className="flex gap-4 w-full">
        <Image
          src={article.image ?? "/lg.jpg"}
          alt={article.headline}
          width={100}
          height={100}
          className="w-[20%] h aspect-video object-cover bg-accent"
        />
        <div className="w-full">
          <div className="text-sm ">
            <span>{article.company}</span>
            {/* centerdot html code below */}
            <span className="mx-1"> &bull; </span>
            <span> {article.outlet} </span>
          </div>
          <p className="text-xl font-light">{article.headline}</p>
        </div>
      </div>
    </Link>
  );
}
