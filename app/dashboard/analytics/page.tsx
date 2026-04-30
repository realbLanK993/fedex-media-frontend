"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  RefreshCw,
  BarChart2,
  TrendingUp,
  Users,
  Zap,
  AlertTriangle,
  Globe,
  Package,
  ChevronRight,
  Download,
  PieChart,
  Tag,
  Newspaper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const API_BASE_URL = process.env.NEXT_PUBLIC_RAG_API_URL;

// ---------- Types ----------
interface SectionInsight {
  primary_insight: string;
  secondary_insight: string;
}

type ReportData = Record<string, SectionInsight | unknown>;

interface KPISummary {
  share_of_ink: number;
  share_of_voice: number;
  total_social_shares: number;
}

interface TopHeadline {
  headline: string;
  hyperlink: string;
  outlet: string;
  score: number;
}

interface TopTag {
  tag: string;
  count: number;
}

interface CompetitiveSOV {
  company: string;
  share_of_voice: number;
  sov_percentage: number;
}

interface ReportState {
  data: ReportData | null;
  kpi: KPISummary | null;
  headlines: TopHeadline[];
  tags: TopTag[];
  sov: CompetitiveSOV[];
  loading: boolean;
  error: string | null;
}

// ---------- Fetch ----------
const COMPETITORS = ["FedEx", "DHL", "UPS", "Aramex"];

async function fetchApi(path: string, options: RequestInit = {}, params: Record<string, string | string[]> = {}) {
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => url.searchParams.append(key, v));
    } else {
      url.searchParams.set(key, value);
    }
  });

  const res = await fetch(url.toString(), options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

async function fetchExecutiveSummary(): Promise<ReportData> {
  return fetchApi("/reports/executive-summary", { method: "POST" }, {
    main_company: "FedEx",
    competitors: COMPETITORS,
  });
}

async function fetchKPI(): Promise<KPISummary> {
  return fetchApi("/reports/summary", {}, { companies: COMPETITORS });
}

async function fetchTopHeadlines(): Promise<TopHeadline[]> {
  return fetchApi("/reports/top-headlines", {}, { limit: "5", companies: COMPETITORS });
}

async function fetchTopTags(): Promise<TopTag[]> {
  return fetchApi("/reports/top-entities", {}, { limit: "12", companies: COMPETITORS });
}

async function fetchSOVCompetitive(): Promise<CompetitiveSOV[]> {
  return fetchApi("/reports/sov-competitive", {}, { companies: COMPETITORS });
}

// ---------- Helpers ----------
function formatSectionTitle(key: string): string {
  return key
    .replace(/_and_/g, " & ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const SECTION_ICONS: Record<string, React.ElementType> = {
  business_leadership_and_performance: TrendingUp,
  people_and_culture: Users,
  digital_leadership: Zap,
  issues_and_offences: AlertTriangle,
  global_presence: Globe,
  supply_chain: Package,
};

const SECTION_COLORS: Record<string, { bg: string; border: string; icon: string; badge: string }> = {
  business_leadership_and_performance: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    icon: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  },
  people_and_culture: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-800",
    icon: "text-purple-600 dark:text-purple-400",
    badge: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
  },
  digital_leadership: {
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    border: "border-cyan-200 dark:border-cyan-800",
    icon: "text-cyan-600 dark:text-cyan-400",
    badge: "bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300",
  },
  issues_and_offences: {
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    icon: "text-red-600 dark:text-red-400",
    badge: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
  },
};

const DEFAULT_COLOR = {
  bg: "bg-gray-50 dark:bg-gray-900/30",
  border: "border-gray-200 dark:border-gray-700",
  icon: "text-gray-600 dark:text-gray-400",
  badge: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
};

function isSectionInsight(val: unknown): val is SectionInsight {
  return (
    typeof val === "object" &&
    val !== null &&
    ("primary_insight" in val || "secondary_insight" in val)
  );
}

function formatNumber(num: number) {
  return new Intl.NumberFormat("en-US").format(num);
}

const COMPANY_COLORS: Record<string, string> = {
  FedEx: "bg-[#4D148C]",
  UPS: "bg-[#351C15]",
  DHL: "bg-[#D40511]",
  Aramex: "bg-[#E2002B]",
};

// ---------- Sub-components ----------
function InsightCard({
  sectionKey,
  insight,
  index,
}: {
  sectionKey: string;
  insight: SectionInsight;
  index: number;
}) {
  const Icon = SECTION_ICONS[sectionKey] ?? BarChart2;
  const colors = SECTION_COLORS[sectionKey] ?? DEFAULT_COLOR;
  const title = formatSectionTitle(sectionKey);

  return (
    <div
      className={`rounded-xl border ${colors.bg} ${colors.border} p-6 flex flex-col gap-4 transition-shadow hover:shadow-md`}
    >
      {/* Card header */}
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors.badge}`}>
          <Icon size={18} className={colors.icon} />
        </div>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        <span className="ml-auto text-xs font-mono text-muted-foreground opacity-50">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Primary insight */}
      {insight.primary_insight && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
            Primary Insight
          </span>
          <p className="text-sm leading-relaxed text-foreground">
            {insight.primary_insight}
          </p>
        </div>
      )}

      {/* Divider */}
      {insight.primary_insight && insight.secondary_insight && (
        <div className="border-t border-current opacity-10" />
      )}

      {/* Secondary insight */}
      {insight.secondary_insight && (
        <div className="flex gap-2 items-start">
          <ChevronRight
            size={14}
            className="mt-0.5 flex-shrink-0 text-muted-foreground opacity-60"
          />
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
              Additional Context
            </span>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {insight.secondary_insight}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function UnknownSection({ sectionKey, value }: { sectionKey: string; value: unknown }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900/30">
      <h2 className="text-base font-semibold mb-3">{formatSectionTitle(sectionKey)}</h2>
      <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-words font-mono">
        {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}

// ---------- Main Page ----------
export default function AnalyticsPage() {
  const [report, setReport] = useState<ReportState>({
    data: null,
    kpi: null,
    headlines: [],
    tags: [],
    sov: [],
    loading: true,
    error: null,
  });

  const loadReport = async () => {
    setReport((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const [data, kpi, headlines, tags, sov] = await Promise.all([
        fetchExecutiveSummary(),
        fetchKPI(),
        fetchTopHeadlines(),
        fetchTopTags(),
        fetchSOVCompetitive(),
      ]);
      setReport({ data, kpi, headlines, tags, sov, loading: false, error: null });
    } catch (err: any) {
      setReport((prev) => ({
        ...prev,
        loading: false,
        error: err.message ?? "Failed to load report",
      }));
    }
  };

  useEffect(() => {
    loadReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = () => {
    const url = new URL(`${API_BASE_URL}/reports/report/download`);
    url.searchParams.set("main_company", "FedEx");
    url.searchParams.set("country", "India");
    url.searchParams.set("month", "2025-10");
    COMPETITORS.forEach(c => url.searchParams.append("companies", c));
    window.open(url.toString(), "_blank");
  };

  const entries = report.data ? Object.entries(report.data) : [];

  return (
    <ScrollArea className="w-full h-full">
      <div className="flex flex-col w-full min-h-full">
        {/* ---- Header ---- */}
        <div className="flex justify-between items-center border-b px-8 py-4 bg-background sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <BarChart2 className="text-primary h-5 w-5" />
            <div>
              <h1 className="text-xl font-semibold leading-tight">Executive Analytics Report</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="default"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download size={14} />
              Download PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadReport}
              disabled={report.loading}
              className="flex items-center gap-2"
            >
              <RefreshCw size={14} className={report.loading ? "animate-spin" : ""} />
              {report.loading ? "Loading…" : "Refresh"}
            </Button>
          </div>
        </div>

        <div className="flex-1">
          <div className="max-w-6xl mx-auto px-8 py-8">
            {/* ---- Loading ---- */}
            {report.loading && (
              <div className="flex items-center justify-center h-64 gap-3 text-muted-foreground">
                <Loader2 className="animate-spin h-6 w-6" />
                <span>Generating report, this may take a moment…</span>
              </div>
            )}

            {/* ---- Error ---- */}
            {report.error && (
              <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
                <AlertTriangle className="h-10 w-10 text-destructive opacity-60" />
                <p className="text-destructive font-medium">Failed to load report</p>
                <p className="text-sm text-muted-foreground max-w-md">{report.error}</p>
                <Button variant="outline" size="sm" onClick={loadReport}>
                  Try Again
                </Button>
              </div>
            )}

            {/* ---- Report Content ---- */}
            {!report.loading && !report.error && (report.kpi || entries.length > 0) && (
              <>
                {/* Summary strip */}
                <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Analytics Overview</span>
                  <span className="mx-2 opacity-30">|</span>
                  <span>Generated {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>

                {/* KPIs */}
                {report.kpi && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-6 flex flex-col gap-2">
                      <span className="text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400">Share of Ink</span>
                      <span className="text-3xl font-bold text-foreground">{formatNumber(report.kpi.share_of_ink)}</span>
                    </div>
                    <div className="rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30 p-6 flex flex-col gap-2">
                      <span className="text-xs font-bold tracking-widest uppercase text-purple-600 dark:text-purple-400">Share of Voice</span>
                      <span className="text-3xl font-bold text-foreground">{formatNumber(report.kpi.share_of_voice)}</span>
                    </div>
                    <div className="rounded-xl border border-cyan-200 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-950/30 p-6 flex flex-col gap-2">
                      <span className="text-xs font-bold tracking-widest uppercase text-cyan-600 dark:text-cyan-400">Social Shares</span>
                      <span className="text-3xl font-bold text-foreground">{formatNumber(report.kpi.total_social_shares)}</span>
                    </div>
                  </div>
                )}

                {/* Grid for SOV and Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Competitive SOV */}
                  {report.sov && report.sov.length > 0 && (
                    <div className="rounded-xl border bg-card p-6 flex flex-col gap-4">
                      <div className="flex items-center gap-3 mb-2">
                        <PieChart size={18} className="text-primary" />
                        <h2 className="text-base font-semibold tracking-tight">Competitive Share of Voice</h2>
                      </div>
                      <div className="flex flex-col gap-3">
                        {report.sov.map((item) => (
                          <div key={item.company} className="flex flex-col gap-1">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{item.company}</span>
                              <span className="text-muted-foreground">{item.sov_percentage}%</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                              <div
                                className={`h-full ${COMPANY_COLORS[item.company] || "bg-primary"}`}
                                style={{ width: `${item.sov_percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top Tags */}
                  {report.tags && report.tags.length > 0 && (
                    <div className="rounded-xl border bg-card p-6 flex flex-col gap-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Tag size={18} className="text-primary" />
                        <h2 className="text-base font-semibold tracking-tight">Top Trending Tags</h2>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {report.tags.map((tag) => (
                          <div key={tag.tag} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-sm">
                            <span className="font-medium">{tag.tag}</span>
                            <span className="text-xs text-muted-foreground bg-background rounded-full px-1.5 py-0.5">{tag.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Top Headlines */}
                {report.headlines && report.headlines.length > 0 && (
                  <div className="rounded-xl border bg-card p-6 flex flex-col gap-4 mb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <Newspaper size={18} className="text-primary" />
                      <h2 className="text-base font-semibold tracking-tight">Most Impactful Headlines</h2>
                    </div>
                    <div className="flex flex-col gap-4 divide-y">
                      {report.headlines.map((headline, i) => (
                        <div key={i} className="pt-4 first:pt-0 flex flex-col gap-2">
                          <a
                            href={headline.hyperlink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-base font-medium hover:text-primary transition-colors leading-snug"
                          >
                            {headline.headline}
                          </a>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="font-semibold px-2 py-0.5 bg-secondary rounded-md">{headline.outlet}</span>
                            <span>Score: {formatNumber(Math.round(headline.score))}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Executive Summary Grid */}
                {entries.length > 0 && (
                  <>
                    <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground border-b pb-2">
                      <span className="font-medium text-foreground">Executive Insights</span>
                      <span className="mx-2 opacity-30">|</span>
                      <span>{entries.length} sections</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {entries.map(([key, value], i) =>
                        isSectionInsight(value) ? (
                          <InsightCard key={key} sectionKey={key} insight={value} index={i} />
                        ) : (
                          <UnknownSection key={key} sectionKey={key} value={value} />
                        )
                      )}
                    </div>
                  </>
                )}
              </>
            )}

            {/* ---- Empty ---- */}
            {!report.loading && !report.error && entries.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 gap-2 text-muted-foreground">
                <BarChart2 className="h-10 w-10 opacity-30" />
                <p>No report data available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
