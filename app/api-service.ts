import { Article } from "@/lib/types/article";
import { NewsletterGroups, NewsletterPeople } from "@/lib/types/newsletter";

// lib/apiService.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_RAG_API_URL;

if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_RAG_API_URL is not set in environment variables."
  );
}

// --- Type Definitions ---
export interface ApiMetadata {
  url: string;
  outlet: string;
}

export interface ChatRequestPayload {
  user_id: string;
  message: string;
}

export interface ClusterResponse {
  id: number;
  title: string;
  summary: string;
  article_count: number;
  sentiment: string;
  created_at: string | null;
}

export interface BriefingSource {
  headline: string;
  url: string;
  outlet: string;
}

export interface DailyBriefingResponse {
  date: string;
  briefing_content: string;
  sources: BriefingSource[];
}

export interface ClusterArticlesResponse {
  cluster: ClusterResponse;
  articles: Article[];
}

export interface TopEntityItem {
  entity_text: string;
  entity_label: string;
  mention_count: number;
  wikipedia_title?: string | null;
  wikidata_id?: string | null;
}

export interface ClusterTopEntitiesResponse {
  cluster_id: number;
  entities: TopEntityItem[];
}

export interface TopTagItem {
  tag: string;
  count: number;
}

export interface EntityArticlesResponse {
  entity_text: string;
  articles: Article[];
}

export interface ChatApiResponse {
  response: string;
  metadata: ApiMetadata[];
}
// --- API Functions ---

export async function fetchChatResponse(
  payload: ChatRequestPayload
): Promise<ChatApiResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_RAG_API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ detail: "Unknown server error" }));
    console.error("API Error (/chat):", errorData);
    throw new Error(
      errorData.detail || `HTTP error! status: ${response.status}`
    );
  }
  return response.json();
}

export const getPeopleData: (
  fail?: boolean
) => Promise<NewsletterPeople[]> = async () => {
  const response = await fetch(API_BASE_URL + "/people");
  return (await response.json()) as NewsletterPeople[];
};
export const getGroupData: (
  fail?: boolean
) => Promise<NewsletterGroups[]> = async () => {
  const response = await fetch(API_BASE_URL + "/email_groups");
  return (await response.json()) as NewsletterGroups[];
};

export const getClusters = async (): Promise<ClusterResponse[]> => {
  try {
    const res = await fetch(API_BASE_URL + "/explore/clusters");
    if (!res.ok) {
      console.error("Failed to fetch clusters");
      return [];
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching clusters", error);
    return [];
  }
};

export const getClusterArticles = async (clusterId: number): Promise<ClusterArticlesResponse | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/explore/clusters/${clusterId}/articles`);
    if (!res.ok) {
      console.error(`Failed to fetch articles for cluster ${clusterId}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error(`Error fetching articles for cluster ${clusterId}`, error);
    return null;
  }
};

export const getClusterTopics = async (clusterId: number): Promise<ClusterTopEntitiesResponse | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/explore/clusters/${clusterId}/topics`);
    if (!res.ok) {
      console.error(`Failed to fetch topics for cluster ${clusterId}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error(`Error fetching topics for cluster ${clusterId}`, error);
    return null;
  }
};

import { format } from "date-fns";

export const getDailyBriefing = async (date?: Date): Promise<DailyBriefingResponse | null> => {
  try {
    const url = new URL(API_BASE_URL + "/briefing/daily");
    if (date) {
      const dateStr = format(date, "dd-MMM-yy").toUpperCase();
      url.searchParams.append("date", dateStr);
    }
    const res = await fetch(url.toString());
    if (!res.ok) {
      console.error("Failed to fetch daily briefing");
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching daily briefing", error);
    return null;
  }
};



export const getTopTags = async (limit: number = 20): Promise<TopTagItem[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/reports/top-tags?limit=${limit}`);
    if (!res.ok) {
      console.error("Failed to fetch top tags");
      return [];
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching top tags", error);
    return [];
  }
};

export const getEntityArticles = async (entityText: string): Promise<EntityArticlesResponse | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/explore/entities/${encodeURIComponent(entityText)}/articles`);
    if (!res.ok) {
      console.error(`Failed to fetch articles for entity ${entityText}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error(`Error fetching articles for entity ${entityText}`, error);
    return null;
  }
};

export const createPerson: (
  data: Omit<NewsletterPeople, "id">
) => Promise<Response> = async (data) => {
  return await fetch(API_BASE_URL + "/people", {
    method: "POST",
    body: JSON.stringify({ ...data }),
    headers: {
      "Content-Type": "Application/JSON",
    },
  });
};

export const createGroup: (
  data: Omit<NewsletterGroups, "id">
) => Promise<Response> = async (data) => {
  return await fetch(API_BASE_URL + "/email_groups", {
    method: "POST",
    body: JSON.stringify({ ...data }),
    headers: {
      "Content-Type": "Application/JSON",
    },
  });
};

export const sendEmail: (data: {
  group_ids: number[];
  person_ids: number[];
}) => Promise<Response> = async (data) => {
  return await fetch(API_BASE_URL + "/newsletter/email", {
    method: "POST",
    body: JSON.stringify({ ...data }),
    headers: {
      "Content-Type": "Application/JSON",
    },
  });
};

export const getArticles: () => Promise<Article[] | undefined> = async () => {
  try {
    const res = await fetch(API_BASE_URL + "/articles");
    if (!res.ok) {
      console.error("Failed to fetch articles, falling back to dummy data");
      return generateDummyArticles();
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching articles, falling back to dummy data", error);
    return generateDummyArticles();
  }
};

const generateDummyArticles = (): Article[] => {
  const dummyData: Article[] = [
    {
      quarter: "Q3",
      company: "FedEx",
      country: "India",
      date: "1st July 2025",
      headline: "China's Tianwen-2 Returns Earth, Moon Images as 'Lunar Cave' Robot Tests Continue",
      hyperlink: "#",
      outlet: "TOI",
      media_type: "Online",
      headline_name_included: true,
      sentiment: "Neutral",
      financial_performance: 0,
      innovation: 1,
      regulatory: 0,
      environment_responsibility: 0,
      social_responsibility: 0,
      community_responsibility: 0,
      e_commerce: 0,
      summary: "China's Tianwen-2 mission has successfully captured images of the Earth and Moon. Meanwhile, tests on a lunar cave exploring robot are ongoing, marking significant progress in their deep space exploration capabilities.",
      source: "Times of India",
      keyword: "Space",
      relevancy_score: 85,
      text: "Full text content here...",
    },
    {
      quarter: "Q3",
      company: "Local",
      country: "Malaysia",
      date: "29th June 2025",
      headline: "Amazon announces plans to boost India operations with $233 million investment",
      hyperlink: "#",
      outlet: "ET",
      media_type: "Online",
      headline_name_included: true,
      sentiment: "Positive",
      financial_performance: 1,
      innovation: 0,
      regulatory: 0,
      environment_responsibility: 0,
      social_responsibility: 0,
      community_responsibility: 0,
      e_commerce: 1,
      summary: "Amazon is planning a major expansion in India, injecting an additional $233 million into its operations. This move underscores their commitment to the growing e-commerce market in the region, focusing on infrastructure and logistics.",
      source: "Economic Times",
      keyword: "Investment",
      relevancy_score: 92,
      text: "Full text content here...",
    },
    {
      quarter: "Q3",
      company: "FedEx",
      country: "India",
      date: "28th June 2025",
      headline: "Asian shares mostly higher after US stocks hit another record as Tesla and Nike rally",
      hyperlink: "#",
      outlet: "HT",
      media_type: "Online",
      headline_name_included: false,
      sentiment: "Positive",
      financial_performance: 1,
      innovation: 0,
      regulatory: 0,
      environment_responsibility: 0,
      social_responsibility: 0,
      community_responsibility: 0,
      e_commerce: 0,
      summary: "Asian shares mostly rose on Thursday, following a rise in U.S. stocks to an all-time high, with the S&P 500 up 0.5% and hitting a record for the third time in four days. President Donald Trump announced a deal with Vietnam that will impose a 20% tariff on Vietnamese imports while placing zero tariffs on U.S. goods, benefiting companies like Nike. Tesla shares rose 5% after delivering nearly 374,000 vehicles last quarter, despite a 13% decline in overall sales from the previous year, according to company reports.",
      source: "Hindustan Times",
      keyword: "Stocks",
      relevancy_score: 78,
      text: "Full text content here...",
    },
    {
      quarter: "Q3",
      company: "Local",
      country: "Singapore",
      date: "25th June 2025",
      headline: "Global Supply Chain Disruptions Ease, But Logistics Costs Remain High",
      hyperlink: "#",
      outlet: "TOI",
      media_type: "Online",
      headline_name_included: false,
      sentiment: "Neutral",
      financial_performance: 0,
      innovation: 0,
      regulatory: 0,
      environment_responsibility: 0,
      social_responsibility: 0,
      community_responsibility: 0,
      e_commerce: 0,
      summary: "While the worst of the global supply chain bottlenecks appear to be over, companies are still grappling with elevated logistics and transportation costs compared to pre-pandemic levels.",
      source: "Times of India",
      keyword: "Logistics",
      relevancy_score: 88,
      text: "Full text content here...",
    }
  ];
  return Array(4).fill(dummyData).flat().map((item, index) => ({ ...item, id: index }));
};
