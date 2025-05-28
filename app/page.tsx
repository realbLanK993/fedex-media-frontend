// app/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { Article, sampleArticles } from "@/data/article";
import { PaginationControls } from "@/components/pagination-controls";
import { ArticleCard } from "@/components/article-card";
import { ThemeToggle } from "@/components/theme";
import { downloadJsonAsCsv } from "@/lib/utils";
import { SoVDataItem, SoVDisplay } from "@/components/sov-display";
import { useCommandPaletteStore } from "@/store/command-pallete";

// ... (BooleanFilterKey and booleanFilterOptions remain the same) ...
type BooleanFilterKey =
  | "financial_performance"
  | "innovation"
  | "regulatory"
  | "environment_responsibility"
  | "social_responsibility"
  | "community_responsibility"
  | "e_commerce";

const booleanFilterOptions: { key: BooleanFilterKey; label: string }[] = [
  { key: "financial_performance", label: "Financial Performance" },
  { key: "innovation", label: "Innovation" },
  { key: "regulatory", label: "Regulatory" },
  { key: "environment_responsibility", label: "Environment Responsibility" },
  { key: "social_responsibility", label: "Social Responsibility" },
  { key: "community_responsibility", label: "Community Responsibility" },
  { key: "e_commerce", label: "E-commerce" },
];

const ITEMS_PER_PAGE = 10;
const TARGET_COMPANY_NAME = "Fedex";
export default function HomePage() {
  const [articles] = useState<Article[]>(sampleArticles);
  const [searchTerm, setSearchTerm] = useState("");
  // Initialize with empty string for "All"
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedSentiment, setSelectedSentiment] = useState<string>("");
  const [activeBooleanFilters, setActiveBooleanFilters] = useState<
    Partial<Record<BooleanFilterKey, boolean>>
  >({});
  const [currentPage, setCurrentPage] = useState(1);

  const uniqueCountries = useMemo(() => {
    const countries = new Set(articles.map((article) => article.country));
    return Array.from(countries).sort();
  }, [articles]);

  const uniqueSentiments = useMemo(() => {
    const sentiments = new Set(articles.map((article) => article.sentiment));
    return Array.from(sentiments).sort();
  }, [articles]);

  const handleDownloadCsv = () => {
    // You can choose to download all articles or just the filtered ones
    // For filtered articles:
    if (filteredArticles.length > 0) {
      // Example: Define custom headers if you want a specific order or naming
      const customHeaders = [
        "headline",
        "outlet",
        "date",
        "country",
        "sentiment",
        "summary",
        "keyword",
        "financial_performance", // These will be 0 or 1
        "innovation",
        "regulatory",
        "environment_responsibility",
        "social_responsibility",
        "community_responsibility",
        "e_commerce",
        "hyperlink",
      ];
      // Or, to use all keys from the first object as headers (default behavior of the function if customHeaders is omitted):
      // downloadJsonAsCsv(filteredArticles, "media_presence_report.csv");

      downloadJsonAsCsv(
        filteredArticles,
        "media_presence_report.csv",
        customHeaders
      );
    } else {
      alert("No articles to download based on current filters.");
    }
  };

  const handleBooleanFilterChange = (
    filterKey: BooleanFilterKey,
    checked: boolean
  ) => {
    setActiveBooleanFilters((prev) => ({ ...prev, [filterKey]: checked }));
  };

  const filteredArticles = useMemo(() => {
    if (!articles) return [];
    return articles.filter((article) => {
      const searchMatch =
        article.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.keyword.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter logic using empty string for "All"
      const countryMatch =
        selectedCountry === "" ? true : article.country === selectedCountry;
      const sentimentMatch =
        selectedSentiment === ""
          ? true
          : article.sentiment === selectedSentiment;

      const booleanFlagsMatch = booleanFilterOptions.every(({ key }) => {
        if (activeBooleanFilters[key]) {
          return article[key] === 1;
        }
        return true;
      });

      return searchMatch && countryMatch && sentimentMatch && booleanFlagsMatch;
    });
  }, [
    articles,
    searchTerm,
    selectedCountry,
    selectedSentiment,
    activeBooleanFilters,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCountry, selectedSentiment, activeBooleanFilters]);

  // Calculate Share of Voice data
  const shareOfVoiceData = useMemo((): SoVDataItem[] => {
    if (!filteredArticles || filteredArticles.length === 0) {
      return [];
    }

    const companyCounts = new Map<string, number>();
    filteredArticles.forEach((article) => {
      // Normalize company name for consistent counting (e.g., to lowercase)
      // Or use a more robust normalization if needed
      const normalizedCompany =
        article.company?.trim().toLowerCase() || "Unknown Company";
      companyCounts.set(
        normalizedCompany,
        (companyCounts.get(normalizedCompany) || 0) + 1
      );
    });

    const totalArticlesInFilter = filteredArticles.length;
    const sovArray: SoVDataItem[] = [];

    companyCounts.forEach((count, companyName) => {
      // Capitalize first letter of each word for display
      const displayCompanyName = companyName
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      sovArray.push({
        companyName: displayCompanyName,
        count,
        sovPercentage: (count / totalArticlesInFilter) * 100,
      });
    });

    // Sort by percentage descending, then by count, then by name
    return sovArray.sort((a, b) => {
      if (b.sovPercentage !== a.sovPercentage) {
        return b.sovPercentage - a.sovPercentage;
      }
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.companyName.localeCompare(b.companyName);
    });
  }, [filteredArticles]);

  const { openPalette } = useCommandPaletteStore();

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredArticles.slice(startIndex, endIndex);
  }, [filteredArticles, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Reset functions set state to ""
  const resetCountryFilter = () => setSelectedCountry("");
  const resetSentimentFilter = () => setSelectedSentiment("");

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 pb-4 border-b flex justify-between">
        <h1 className="text-3xl font-bold text-left text-primary">
          FedEx Media Presence Tracker
        </h1>

        <div className="flex gap-4 justify-center items-center">
          <Button onClick={openPalette} variant={"outline"}>
            Ask AI
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-card p-6 rounded-lg shadow h-fit sticky top-6">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">
            Filters
          </h2>

          <div className="mb-4">
            <Label htmlFor="search" className="text-sm font-medium">
              Search Articles
            </Label>
            <Input
              id="search"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Country Filter */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="country" className="text-sm font-medium">
                Country
              </Label>
              {selectedCountry !== "" && ( // Show clear button if a country is selected
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetCountryFilter}
                  className="h-auto p-1 text-muted-foreground hover:text-primary"
                >
                  <XIcon className="h-4 w-4 mr-1" /> Clear
                </Button>
              )}
            </div>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger id="country">
                {/* SelectValue will show placeholder if selectedCountry is "" and not a value of any SelectItem */}
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                {/* No "All Countries" SelectItem with value="". We rely on placeholder. */}
                {uniqueCountries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sentiment Filter */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="sentiment" className="text-sm font-medium">
                Sentiment
              </Label>
              {selectedSentiment !== "" && ( // Show clear button if a sentiment is selected
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetSentimentFilter}
                  className="h-auto p-1 text-muted-foreground hover:text-primary"
                >
                  <XIcon className="h-4 w-4 mr-1" /> Clear
                </Button>
              )}
            </div>
            <Select
              value={selectedSentiment}
              onValueChange={setSelectedSentiment}
            >
              <SelectTrigger id="sentiment">
                {/* SelectValue will show placeholder if selectedSentiment is "" and not a value of any SelectItem */}
                <SelectValue placeholder="All Sentiments" />
              </SelectTrigger>
              <SelectContent>
                {/* No "All Sentiments" SelectItem with value="". We rely on placeholder. */}
                {uniqueSentiments.map((sentiment) => (
                  <SelectItem key={sentiment} value={sentiment}>
                    {sentiment}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-3">Article Attributes</h3>
            {booleanFilterOptions.map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id={key}
                  checked={!!activeBooleanFilters[key]}
                  onCheckedChange={(checked) =>
                    handleBooleanFilterChange(key, !!checked)
                  }
                />
                <Label
                  htmlFor={key}
                  className="text-sm font-normal cursor-pointer"
                >
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-lg font-semibold">
              {filteredArticles.length} article
              {filteredArticles.length !== 1 ? "s" : ""} found
            </p>

            <Button onClick={handleDownloadCsv}>Download CSV</Button>
          </div>
          {/* Share of Voice Display */}
          {shareOfVoiceData.length > 0 && (
            <SoVDisplay
              sovData={shareOfVoiceData}
              targetCompany={TARGET_COMPANY_NAME}
            />
          )}

          {/* Result Count */}
          <div className="mb-4 flex justify-between items-center">
            <p className="text-lg font-semibold">
              {filteredArticles.length} article
              {filteredArticles.length !== 1 ? "s" : ""} found
            </p>
          </div>
          {paginatedArticles.length > 0 ? (
            <>
              {paginatedArticles.map((article, index) => (
                <ArticleCard
                  key={`${article.hyperlink}-${index}`}
                  article={article}
                />
              ))}
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={filteredArticles.length}
              />
            </>
          ) : (
            <div className="text-center py-10 bg-card rounded-lg shadow">
              <p className="text-xl text-muted-foreground">
                No articles found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
