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
import { XIcon, BotIcon, CalendarIcon, NewspaperIcon } from "lucide-react";

// For Date Range Picker
import { format, parse, isValid } from "date-fns"; // Import date-fns functions
import { DateRange } from "react-day-picker"; // Type for date range
import { cn } from "@/lib/utils"; // Shadcn utility
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Article, sampleArticles } from "@/data/article";
import { useCommandPaletteStore } from "@/store/command-pallete";
import { SoVDataItem, SoVDisplay } from "@/components/sov-display";
import { PaginationControls } from "@/components/pagination-controls";
import { ArticleCard } from "@/components/article-card";
import Link from "next/link";

// Define the filter keys for the boolean flags
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

const ITEMS_PER_PAGE = 5;
const TARGET_COMPANY_NAME = "FedEx"; // Or your target company

// Helper to parse dates like "DD-Mon-YY" (e.g., "04-Mar-25")
const parseArticleDate = (dateString: string): Date | null => {
  // Ensure the format "dd-MMM-yy" matches your article.date string format precisely.
  // E.g., if month is "March", use "dd-MMMM-yy". If year is "2025", use "dd-MMM-yyyy".
  const date = parse(dateString, "dd-MMM-yy", new Date());
  if (!isValid(date)) {
    console.warn(
      `Invalid date string encountered during parsing: ${dateString}`
    );
    return null;
  }
  // Normalize to the start of the day for consistent comparison
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>(sampleArticles);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedSentiment, setSelectedSentiment] = useState<string>("");
  const [activeBooleanFilters, setActiveBooleanFilters] = useState<
    Partial<Record<BooleanFilterKey, boolean>>
  >({});
  const [currentPage, setCurrentPage] = useState(1);
  const { openPalette } = useCommandPaletteStore();

  // State for Date Range Picker
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Example for AMEA Leader filter (if you implement it fully)
  const [selectedAmeaLeader, setSelectedAmeaLeader] = useState<string>("");

  const uniqueCountries = useMemo(() => {
    const countries = new Set(articles.map((article) => article.country));
    return Array.from(countries).sort();
  }, [articles]);

  const uniqueSentiments = useMemo(() => {
    const sentiments = new Set(articles.map((article) => article.sentiment));
    return Array.from(sentiments).sort();
  }, [articles]);

  const uniqueAmeaLeaders = useMemo(() => {
    // Example
    const leaders = new Set(
      articles
        .map((a) => a.AMEA_Leader)
        .filter((l) => l && l.toLowerCase() !== "none" && l.trim() !== "")
    );
    return Array.from(leaders).sort();
  }, [articles]);

  const handleBooleanFilterChange = (
    filterKey: BooleanFilterKey,
    checked: boolean
  ) => {
    setActiveBooleanFilters((prev) => ({ ...prev, [filterKey]: checked }));
  };

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const searchTermLower = searchTerm.toLowerCase();
      const searchMatch =
        article.headline.toLowerCase().includes(searchTermLower) ||
        article.summary.toLowerCase().includes(searchTermLower) ||
        article.keyword.toLowerCase().includes(searchTermLower) ||
        (article.text &&
          article.text.toLowerCase().includes(searchTermLower)) || // Check if article.text exists
        (article.AMEA_Leader &&
          article.AMEA_Leader.toLowerCase().includes(searchTermLower)) ||
        (article.AMEA_Executive &&
          article.AMEA_Executive.toLowerCase().includes(searchTermLower)) ||
        (article.Local_Leaders &&
          article.Local_Leaders.toLowerCase().includes(searchTermLower));

      const countryMatch = selectedCountry
        ? article.country === selectedCountry
        : true;
      const sentimentMatch = selectedSentiment
        ? article.sentiment === selectedSentiment
        : true;
      const ameaLeaderMatch = selectedAmeaLeader
        ? article.AMEA_Leader === selectedAmeaLeader
        : true;

      // Date Range Filter Logic
      let dateMatch = true;
      if (dateRange?.from) {
        const articleDate = parseArticleDate(article.date);
        if (!articleDate) {
          dateMatch = false;
        } else {
          const fromDateStartOfDay = new Date(
            dateRange.from.getFullYear(),
            dateRange.from.getMonth(),
            dateRange.from.getDate()
          );

          if (dateRange.to) {
            const toDateStartOfDay = new Date(
              dateRange.to.getFullYear(),
              dateRange.to.getMonth(),
              dateRange.to.getDate()
            );
            dateMatch =
              articleDate >= fromDateStartOfDay &&
              articleDate <= toDateStartOfDay;
          } else {
            // Only 'from' date is selected; treat as a single day filter for that 'from' date
            dateMatch = articleDate.getTime() === fromDateStartOfDay.getTime();
          }
        }
      }

      const booleanFlagsMatch = booleanFilterOptions.every(({ key }) => {
        if (activeBooleanFilters[key]) {
          return article[key] === 1;
        }
        return true;
      });

      return (
        searchMatch &&
        countryMatch &&
        sentimentMatch &&
        ameaLeaderMatch &&
        dateMatch &&
        booleanFlagsMatch
      );
    });
  }, [
    articles,
    searchTerm,
    selectedCountry,
    selectedSentiment,
    activeBooleanFilters,
    dateRange,
    selectedAmeaLeader,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedCountry,
    selectedSentiment,
    activeBooleanFilters,
    dateRange,
    selectedAmeaLeader,
  ]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredArticles.slice(startIndex, endIndex);
  }, [filteredArticles, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  };

  const resetCountryFilter = () => setSelectedCountry("");
  const resetSentimentFilter = () => setSelectedSentiment("");
  const resetDateRangeFilter = () => setDateRange(undefined);
  const resetAmeaLeaderFilter = () => setSelectedAmeaLeader("");

  const shareOfVoiceData = useMemo((): SoVDataItem[] => {
    if (!filteredArticles || filteredArticles.length === 0) return [];
    const companyCounts = new Map<string, number>();
    filteredArticles.forEach((article) => {
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
    return sovArray.sort((a, b) => {
      if (b.sovPercentage !== a.sovPercentage)
        return b.sovPercentage - a.sovPercentage;
      if (b.count !== a.count) return b.count - a.count;
      return a.companyName.localeCompare(b.companyName);
    });
  }, [filteredArticles]);

  const handleDownloadCsv = () => {
    alert(
      "CSV Download functionality to be fully implemented, including all new fields."
    );
    console.log("Attempting to download CSV for:", filteredArticles);
    // Call your downloadJsonAsCsv(filteredArticles, "report.csv", customHeaders) here.
    // Make sure customHeaders includes the new fields like 'text', 'AMEA_Leader', etc. if needed.
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 pb-4 border-b flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">
          FedEx Media Presence Tracker
        </h1>
        {/* <div className="flex items-center gap-2 sm:gap-4"> */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            onClick={handleDownloadCsv}
            size="sm"
            className="hidden sm:inline-flex"
          >
            Download CSV
          </Button>
          <Button variant="outline" onClick={openPalette} size="sm">
            <BotIcon className="mr-0 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </Button>
          <Link href="/newsletter/fedex">
            <Button variant="outline" size="sm">
              {" "}
              {/* legacyBehavior needs an <a> child for Button asChild */}
              <NewspaperIcon className="mr-0 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Newsletter</span>
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-card p-4 sm:p-6 rounded-lg shadow h-fit sticky top-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-card-foreground">
            Filters
          </h2>

          <div className="mb-4">
            <Label htmlFor="search" className="text-sm font-medium">
              Search Articles
            </Label>
            <Input
              id="search"
              type="text"
              placeholder="Headline, summary, text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Date Range Picker */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="date-range" className="text-sm font-medium">
                Date Range
              </Label>
              {dateRange && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetDateRangeFilter}
                  className="h-auto p-1 text-xs text-muted-foreground hover:text-primary"
                >
                  <XIcon className="h-3 w-3 mr-1" /> Clear
                </Button>
              )}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-range"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={1} // Can be 2 for a wider calendar view
                />
                <div className="p-2 border-t flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDateRange(undefined);
                      // If Popover doesn't close on its own, you might need to manage its open state
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Country Filter */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="country" className="text-sm font-medium">
                Country
              </Label>
              {selectedCountry && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetCountryFilter}
                  className="h-auto p-1 text-xs text-muted-foreground hover:text-primary"
                >
                  <XIcon className="h-3 w-3 mr-1" /> Clear
                </Button>
              )}
            </div>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger id="country" className="mt-1">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                {uniqueCountries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sentiment Filter */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="sentiment" className="text-sm font-medium">
                Sentiment
              </Label>
              {selectedSentiment && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetSentimentFilter}
                  className="h-auto p-1 text-xs text-muted-foreground hover:text-primary"
                >
                  <XIcon className="h-3 w-3 mr-1" /> Clear
                </Button>
              )}
            </div>
            <Select
              value={selectedSentiment}
              onValueChange={setSelectedSentiment}
            >
              <SelectTrigger id="sentiment" className="mt-1">
                <SelectValue placeholder="All Sentiments" />
              </SelectTrigger>
              <SelectContent>
                {uniqueSentiments.map((sentiment) => (
                  <SelectItem key={sentiment} value={sentiment}>
                    {sentiment}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Example AMEA Leader Filter (conditionally rendered) */}
          {uniqueAmeaLeaders.length > 0 && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="ameaLeader" className="text-sm font-medium">
                  AMEA Leader
                </Label>
                {selectedAmeaLeader && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetAmeaLeaderFilter}
                    className="h-auto p-1 text-xs text-muted-foreground hover:text-primary"
                  >
                    <XIcon className="h-3 w-3 mr-1" /> Clear
                  </Button>
                )}
              </div>
              <Select
                value={selectedAmeaLeader}
                onValueChange={setSelectedAmeaLeader}
              >
                <SelectTrigger id="ameaLeader" className="mt-1">
                  <SelectValue placeholder="Any AMEA Leader" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueAmeaLeaders.map((leader) => (
                    <SelectItem key={leader} value={leader ?? ""}>
                      {leader}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="mt-6 pt-4 border-t">
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
          {shareOfVoiceData.length > 0 && (
            <SoVDisplay
              sovData={shareOfVoiceData}
              targetCompany={TARGET_COMPANY_NAME}
            />
          )}

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
