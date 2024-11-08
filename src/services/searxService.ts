import axios from 'axios';
import { SearchResult } from './types';
import { SEARX_INSTANCES, RETRY_OPTIONS, API_TIMEOUT, MAX_RESULTS } from './config';
import { withRetry, sanitizeResponse } from './utils';
import { getFallbackResults } from './fallbackService';

const axiosInstance = axios.create({
  timeout: API_TIMEOUT,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'Snap Search Bot/1.0',
  },
});

interface SearxResponse {
  results?: Array<{
    title?: string;
    url?: string;
    content?: string;
    snippet?: string;
  }>;
}

async function querySingleInstance(
  query: string,
  instance: string,
  attempt: number = 0
): Promise<SearchResult[]> {
  try {
    const response = await axiosInstance.get<SearxResponse>(`${instance}/search`, {
      params: {
        q: query,
        format: 'json',
        language: 'en',
        categories: 'general',
        time_range: 'year',
      },
      timeout: API_TIMEOUT * (attempt + 1), // Increase timeout with each attempt
    });

    const data = sanitizeResponse(response.data);

    if (!data?.results || !Array.isArray(data.results)) {
      throw new Error('Invalid response format from search instance');
    }

    return data.results
      .filter(result => 
        result.title?.trim() && 
        result.url?.trim() && 
        (result.content?.trim() || result.snippet?.trim())
      )
      .map(result => ({
        title: String(result.title).trim(),
        url: String(result.url).trim(),
        content: String(result.content || result.snippet).trim(),
      }));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`SearxNG instance ${instance} failed:`, errorMessage);
    throw error;
  }
}

export async function searchAcrossInstances(query: string): Promise<SearchResult[]> {
  const errors: string[] = [];
  const shuffledInstances = [...SEARX_INSTANCES].sort(() => Math.random() - 0.5);
  
  for (const instance of shuffledInstances) {
    for (let attempt = 0; attempt < RETRY_OPTIONS.maxRetries; attempt++) {
      try {
        const results = await querySingleInstance(query, instance, attempt);
        
        if (results && results.length > 0) {
          return results.slice(0, MAX_RESULTS);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`${instance} (attempt ${attempt + 1}): ${errorMessage}`);
        
        // Add delay between retries
        if (attempt < RETRY_OPTIONS.maxRetries - 1) {
          await new Promise(resolve => 
            setTimeout(resolve, RETRY_OPTIONS.delayMs * Math.pow(2, attempt))
          );
        }
        continue;
      }
    }
  }

  // All SearxNG instances failed, throw error to trigger fallback
  throw new Error(`All SearxNG instances failed:\n${errors.join('\n')}`);
}