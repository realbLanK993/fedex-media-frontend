"use client";

import type React from "react";

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
import {
  Users2Icon,
  Building2Icon,
  MapPinIcon,
  ExternalLinkIcon,
  CalendarIcon,
  TagIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon,
} from "lucide-react";
import type { Article } from "@/data/article";

interface ArticleCardProps {
  article: Article;
}

const getSentimentConfig = (sentiment: Article["sentiment"]) => {
  switch (sentiment?.toLowerCase()) {
    case "positive":
      return {
        color: "from-orange-500 to-orange-600",
        icon: TrendingUpIcon,
        textColor: "text-orange-700",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
      };
    case "negative":
      return {
        color: "from-purple-600 to-purple-700",
        icon: TrendingDownIcon,
        textColor: "text-purple-700",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
      };
    case "neutral":
      return {
        color: "from-slate-500 to-gray-600",
        icon: MinusIcon,
        textColor: "text-slate-700",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
      };
    default:
      return {
        color: "from-slate-500 to-gray-600",
        icon: MinusIcon,
        textColor: "text-slate-700",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
      };
  }
};

const LeaderDisplay: React.FC<{ label: string; name: string | null }> = ({
  label,
  name,
}) => {
  if (!name || name.toLowerCase() === "none") {
    return null;
  }
  return (
    <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200">
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-600 to-orange-500 flex items-center justify-center">
        <Users2Icon className="h-4 w-4 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-900 truncate">{name}</p>
      </div>
    </div>
  );
};

export function ArticleCard({ article }: ArticleCardProps) {
  const sentimentConfig = getSentimentConfig(article.sentiment);
  const SentimentIcon = sentimentConfig.icon;

  const categoryBadges = [
    {
      key: "financial_performance",
      label: "Financial",
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
    {
      key: "innovation",
      label: "Innovation",
      color: "bg-orange-100 text-orange-800 border-orange-200",
    },
    {
      key: "regulatory",
      label: "Regulatory",
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
    {
      key: "environment_responsibility",
      label: "Environment",
      color: "bg-orange-100 text-orange-800 border-orange-200",
    },
    {
      key: "social_responsibility",
      label: "Social",
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
    {
      key: "community_responsibility",
      label: "Community",
      color: "bg-orange-100 text-orange-800 border-orange-200",
    },
    {
      key: "e_commerce",
      label: "E-commerce",
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
  ].filter((badge) => article[badge.key as keyof Article] === 1);

  return (
    <Card className="group relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mb-6">
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-orange-500 to-purple-600  opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-[1px] bg-white" />

      {/* Content */}
      <div className="relative z-10">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl font-bold leading-tight mb-2 group-hover:text-purple-600 transition-colors">
                <Link
                  href={article.hyperlink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-start gap-2"
                >
                  <span className="flex-1">{article.headline}</span>
                  <ExternalLinkIcon className="h-4 w-4 flex-shrink-0 mt-1 opacity-60" />
                </Link>
              </CardTitle>
              <CardDescription className="flex items-center gap-4 text-sm">
                <span className="font-medium text-slate-700">
                  {article.outlet}
                </span>
                <div className="flex items-center gap-1 text-slate-500">
                  <CalendarIcon className="h-3 w-3" />
                  {article.date}
                </div>
              </CardDescription>
            </div>

            {/* Sentiment Badge */}
            <div
              className={`flex items-center gap-2 px-3 py-2 ${sentimentConfig.bgColor} ${sentimentConfig.borderColor} border`}
            >
              <SentimentIcon
                className={`h-4 w-4 ${sentimentConfig.textColor}`}
              />
              <span
                className={`text-sm font-semibold ${sentimentConfig.textColor} capitalize`}
              >
                {article.sentiment}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Location and Company Info */}
          <div className="flex flex-wrap items-center gap-4 p-3 bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 bg-purple-100 flex items-center justify-center">
                <MapPinIcon className="h-3 w-3 text-purple-600" />
              </div>
              <span className="font-medium text-slate-700">
                {article.country}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 bg-orange-100 flex items-center justify-center">
                <Building2Icon className="h-3 w-3 text-orange-600" />
              </div>
              <span className="font-medium text-slate-700">
                {article.company}
              </span>
            </div>
            <Badge
              variant="secondary"
              className="bg-slate-200 text-slate-700 hover:bg-slate-300"
            >
              {article.media_type}
            </Badge>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <p className="text-sm leading-relaxed text-slate-600 bg-slate-50 p-4 border-l-4 border-purple-600">
              {article.summary.substring(0, 250)}
              {article.summary.length > 250 ? "..." : ""}
            </p>
          </div>

          {/* Leaders Section */}
          {((article.AMEA_Leader &&
            article.AMEA_Leader.toLowerCase() !== "none") ||
            (article.AMEA_Executive &&
              article.AMEA_Executive.toLowerCase() !== "none") ||
            (article.Local_Leaders &&
              article.Local_Leaders.toLowerCase() !== "none")) && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent flex-1" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-2">
                  Leadership
                </span>
                <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent flex-1" />
              </div>
              <div className="grid gap-2">
                <LeaderDisplay
                  label="AMEA Leader"
                  name={article.AMEA_Leader ?? ""}
                />
                <LeaderDisplay
                  label="AMEA Executive"
                  name={article.AMEA_Executive ?? ""}
                />
                <LeaderDisplay
                  label="Local Leaders"
                  name={article.Local_Leaders ?? ""}
                />
              </div>
            </div>
          )}

          {/* Keywords */}
          {article.keyword && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TagIcon className="h-4 w-4 text-slate-500" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Keywords
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.keyword
                  .split(",")
                  .map((k) => k.trim())
                  .filter(Boolean)
                  .map((k) => (
                    <Badge
                      key={k}
                      variant="outline"
                      className="bg-white hover:bg-slate-50 border-slate-300 text-slate-700 font-medium"
                    >
                      {k}
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </CardContent>

        {/* Category Badges Footer */}
        {categoryBadges.length > 0 && (
          <CardFooter className="pt-4 border-t border-slate-100">
            <div className="w-full">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent flex-1" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-2">
                  Categories
                </span>
                <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent flex-1" />
              </div>
              <div className="flex flex-wrap gap-2">
                {categoryBadges.map((badge) => (
                  <Badge
                    key={badge.key}
                    className={`${badge.color} border font-medium hover:scale-105 transition-transform`}
                  >
                    {badge.label}
                  </Badge>
                ))}
              </div>
            </div>
          </CardFooter>
        )}
      </div>
    </Card>
  );
}
