import axios from "axios";
import type {
  DetectionResult,
  PlagiarismResult,
  HumanizationResult,
  AnalysisOptions,
  HistoryItem,
  PaginatedResponse,
} from "@/types/analysis";
import type {
  ReadabilityResult,
  ToneResult,
  GrammarResult,
  TextStatistics,
  WritingSuggestionsResult,
  CitationResult,
  ComparisonResult,
  FullAnalyticsResult,
} from "@/types/analytics";

const api = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

export async function analyzeText(
  text: string,
  mode: string = "deep",
  options?: AnalysisOptions
): Promise<DetectionResult> {
  const { data } = await api.post<DetectionResult>("/detect", {
    text,
    mode,
    ...options,
  });
  return data;
}

export async function analyzePlagiarism(
  text: string,
  options?: AnalysisOptions
): Promise<PlagiarismResult> {
  const { data } = await api.post<PlagiarismResult>("/plagiarism", {
    text,
    ...options,
  });
  return data;
}

export async function humanizeText(
  text: string,
  style: string = "academic",
  options?: AnalysisOptions
): Promise<HumanizationResult> {
  const { data } = await api.post<HumanizationResult>("/humanize", {
    text,
    style,
    ...options,
  });
  return data;
}

export async function getHistory(
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<HistoryItem>> {
  const { data } = await api.get<PaginatedResponse<HistoryItem>>("/history", {
    params: { page, limit },
  });
  return data;
}

export async function getHealth(): Promise<{ status: string }> {
  const { data } = await api.get<{ status: string }>("/health");
  return data;
}

// --- Analytics endpoints ---

export async function analyzeReadability(text: string): Promise<ReadabilityResult> {
  const { data } = await api.post<ReadabilityResult>("/analytics/readability", { text });
  return data;
}

export async function analyzeTone(text: string): Promise<ToneResult> {
  const { data } = await api.post<ToneResult>("/analytics/tone", { text });
  return data;
}

export async function checkGrammar(text: string): Promise<GrammarResult> {
  const { data } = await api.post<GrammarResult>("/analytics/grammar", { text });
  return data;
}

export async function getStatistics(text: string): Promise<TextStatistics> {
  const { data } = await api.post<TextStatistics>("/analytics/statistics", { text });
  return data;
}

export async function getSuggestions(text: string): Promise<WritingSuggestionsResult> {
  const { data } = await api.post<WritingSuggestionsResult>("/analytics/suggestions", { text });
  return data;
}

export async function extractCitations(text: string): Promise<CitationResult> {
  const { data } = await api.post<CitationResult>("/analytics/citations", { text });
  return data;
}

export async function compareTexts(
  textA: string,
  textB: string
): Promise<ComparisonResult> {
  const { data } = await api.post<ComparisonResult>("/analytics/compare", {
    text_a: textA,
    text_b: textB,
  });
  return data;
}

export async function runFullAnalytics(text: string): Promise<FullAnalyticsResult> {
  const { data } = await api.post<FullAnalyticsResult>("/analytics/full", { text });
  return data;
}

// --- Export endpoints ---

export async function exportPdf(
  data: Record<string, unknown>,
  text: string
): Promise<Blob> {
  const response = await api.post(
    "/export/pdf",
    { data, text },
    { responseType: "blob" }
  );
  return response.data;
}

export async function exportJson(data: Record<string, unknown>): Promise<Blob> {
  const response = await api.post(
    "/export/json",
    { data },
    { responseType: "blob" }
  );
  return response.data;
}

export async function exportCsv(data: Record<string, unknown>): Promise<Blob> {
  const response = await api.post(
    "/export/csv",
    { data },
    { responseType: "blob" }
  );
  return response.data;
}

export async function getShareLink(
  data: Record<string, unknown>
): Promise<{ url: string }> {
  const { data: result } = await api.post<{ url: string }>("/export/share", {
    data,
  });
  return result;
}

export default api;
