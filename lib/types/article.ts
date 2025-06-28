export interface Article {
  quarter: string;
  company: string;
  country: string;
  date: string;
  headline: string;
  hyperlink: string;
  outlet: string;
  media_type: string;
  headline_name_included: boolean;
  sentiment: "Positive" | "Negative" | "Neutral" | string;
  financial_performance: 0 | 1;
  innovation: 0 | 1;
  regulatory: 0 | 1;
  environment_responsibility: 0 | 1;
  social_responsibility: 0 | 1;
  community_responsibility: 0 | 1;
  e_commerce: 0 | 1;
  summary: string;
  source: string;
  keyword: string;
  relevancy_score: number;
  // New fields
  text: string; // Full article text
  AMEA_Leader?: string | null; // Can be a name or "None" (or null if "None" means absence of data)
  AMEA_Executive?: string | null;
  Local_Leaders?: string | null;
}

export interface FormData {
  search: string;
  start: Date | undefined;
  end: Date | undefined;
  country: string;
  sentiment: string;
  financialPerformance: boolean;
  innovation: boolean;
  regulatory: boolean;
  environmentResponsibility: boolean;
  socialResponsibility: boolean;
  communityResponsibility: boolean;
  eCommerce: boolean;
}
