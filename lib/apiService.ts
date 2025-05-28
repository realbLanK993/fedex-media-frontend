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

export interface ChatApiResponse {
  response: string;
  metadata: ApiMetadata[];
}

export interface SummaryApiResponse {
  response: string;
  metadata: ApiMetadata[];
}

// --- API Functions ---

export async function fetchChatResponse(
  payload: ChatRequestPayload
): Promise<ChatApiResponse> {
  const response = await fetch(`${API_BASE_URL}/chat`, {
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

export async function fetchSummary(
  topic: string,
  k: number = 3
): Promise<SummaryApiResponse> {
  const queryParams = new URLSearchParams({ topic, k: k.toString() });
  const response = await fetch(
    `${API_BASE_URL}/summarize?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ detail: "Unknown server error" }));
    console.error("API Error (/summarize):", errorData);
    throw new Error(
      errorData.detail || `HTTP error! status: ${response.status}`
    );
  }
  return response.json();
}
