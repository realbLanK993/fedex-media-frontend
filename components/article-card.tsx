// components/ArticleCard.tsx
import { Article } from "@/data/articles"; // Adjust path if src directory is used
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ArticleCardProps {
  article: Article;
}

const getSentimentColor = (sentiment: Article["sentiment"]) => {
  switch (sentiment?.toLowerCase()) {
    case "positive":
      return "bg-green-500 hover:bg-green-600";
    case "negative":
      return "bg-red-500 hover:bg-red-600";
    case "neutral":
      return "bg-yellow-500 hover:bg-yellow-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">
          <Link
            href={article.hyperlink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {article.headline}
          </Link>
        </CardTitle>
        <CardDescription>
          {article.outlet} - {article.date}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          {article.country} | {article.company} | {article.media_type}
        </p>
        <p className="text-sm leading-relaxed">
          {article.summary.substring(0, 200)}
          {article.summary.length > 200 ? "..." : ""}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {article.keyword &&
            article.keyword
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean)
              .map((k) => (
                <Badge key={k} variant="secondary">
                  {k}
                </Badge>
              ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Badge className={`${getSentimentColor(article.sentiment)} text-white`}>
          {article.sentiment}
        </Badge>
        <div className="flex flex-wrap gap-1 text-xs">
          {article.financial_performance === 1 && (
            <Badge variant="outline">Financial</Badge>
          )}
          {article.innovation === 1 && (
            <Badge variant="outline">Innovation</Badge>
          )}
          {article.regulatory === 1 && (
            <Badge variant="outline">Regulatory</Badge>
          )}
          {article.environment_responsibility === 1 && (
            <Badge variant="outline">Environment</Badge>
          )}
          {article.social_responsibility === 1 && (
            <Badge variant="outline">Social</Badge>
          )}
          {article.community_responsibility === 1 && (
            <Badge variant="outline">Community</Badge>
          )}
          {article.e_commerce === 1 && (
            <Badge variant="outline">E-commerce</Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
