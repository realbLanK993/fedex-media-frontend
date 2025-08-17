import { Article } from "@/lib/types/article";
import { NewsletterGroups, NewsletterPeople } from "@/lib/types/newsletter";

// lib/apiService.ts
const API_BASE_URL = "/api/dashboard";

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
  const res = await fetch(API_BASE_URL + "/articles");
  if (!res.ok) {
    console.error("Failed to fetch articles");
  } else {
    return await res.json();
  }
};
