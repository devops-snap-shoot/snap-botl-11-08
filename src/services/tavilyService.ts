import { SearchResult } from './types';
import { API_TIMEOUT, MAX_RESULTS } from './config';
import { sanitizeResponse } from './utils';

interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

interface TavilyResponse {
  results: TavilyResult[];
  response_time: number;
}

export async function searchWithTavily(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_TAVILY_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        search_depth: 'advanced',
        max_results: MAX_RESULTS,
      }),
      signal: AbortSignal.timeout(API_TIMEOUT),
    });

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.status}`);
    }

    const data = await response.json() as TavilyResponse;
    const sanitizedData = sanitizeResponse(data);

    return sanitizedData.results
      .filter(result => result.title && result.url && result.content)
      .map(result => ({
        title: result.title.trim(),
        url: result.url.trim(),
        content: result.content.trim(),
      }))
      .slice(0, MAX_RESULTS);
  } catch (error) {
    console.error('Tavily search error:', error);
    throw error;
  }
}