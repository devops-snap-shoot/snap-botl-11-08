export interface SearxResult {
  title: string;
  url: string;
  content: string;
}

export interface Source {
  title: string;
  url: string;
  snippet: string;
}

export interface SearchResponse {
  answer: string;
  sources: Source[];
}

export interface SearchState {
  isLoading: boolean;
  error: string | null;
  data: SearchResponse | null;
}