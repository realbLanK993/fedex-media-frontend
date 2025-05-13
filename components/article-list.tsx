import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Globe, BarChart2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Article {
  url: string
  title: string
  summary: string
  keywords: string[]
  publish_date: string
  text: string
  source: string
  keyword: string
  relevancy_score: number
  focus?: string
  sentiment?: string
  [key: string]: any
}

interface ArticleListProps {
  articles: Article[]
}

export default function ArticleList({ articles }: ArticleListProps) {
  return (
    <div className="grid gap-6">
      {articles.map((article, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {article.title}
                  </a>
                </CardTitle>
                <CardDescription className="flex items-center mt-1 space-x-2">
                  <span className="flex items-center">
                    <Globe className="h-3.5 w-3.5 mr-1" />
                    {article.source.toUpperCase()}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {formatDistanceToNow(new Date(article.publish_date), { addSuffix: true })}
                  </span>
                  <span className="flex items-center">
                    <BarChart2 className="h-3.5 w-3.5 mr-1" />
                    Relevance: {Math.round(article.relevancy_score * 100)}%
                  </span>
                </CardDescription>
              </div>
              {article.sentiment && (
                <Badge
                  variant={
                    article.sentiment === "Positive"
                      ? "default"
                      : article.sentiment === "Negative"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {article.sentiment}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">{article.summary}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {article.keywords.slice(0, 8).map((keyword, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
              {article.keywords.length > 8 && (
                <Badge variant="outline" className="text-xs">
                  +{article.keywords.length - 8} more
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-3 flex flex-wrap gap-1.5">
            {article.local_leader_present && <Badge variant="outline">Local Leader</Badge>}
            {article.executive_leadership && <Badge variant="outline">Executive Leadership</Badge>}
            {article.regulatory && <Badge variant="outline">Regulatory</Badge>}
            {article.business_leadership && <Badge variant="outline">Business Leadership</Badge>}
            {article.focus && <Badge variant="outline">{article.focus}</Badge>}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
