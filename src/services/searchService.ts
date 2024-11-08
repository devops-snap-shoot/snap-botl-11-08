import { SearchResponse } from '../types';
import { searchAcrossInstances } from './searxService';
import { searchWithTavily } from './tavilyService';
import { sanitizeResponse } from './utils';

export class SearchError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'SearchError';
  }
}

export async function performSearch(query: string): Promise<SearchResponse> {
  try {
    if (!query.trim()) {
      throw new SearchError('Search query cannot be empty');
    }

    let searchResults;
    
    try {
      // Try SearxNG first
      searchResults = await searchAcrossInstances(query);
    } catch (searxError) {
      console.warn('SearxNG search failed, falling back to Tavily:', searxError);
      try {
        // Fallback to Tavily
        searchResults = await searchWithTavily(query);
      } catch (tavilyError) {
        console.error('Tavily search failed:', tavilyError);
        throw new SearchError('Search services are currently unavailable');
      }
    }

    if (!searchResults || searchResults.length === 0) {
      throw new SearchError('No search results found for the given query');
    }

    const response: SearchResponse = {
      answer: '',
      sources: searchResults.map(result => ({
        title: result.title,
        url: result.url,
        snippet: result.content,
      })),
    };

    return sanitizeResponse(response);
  } catch (error) {
    if (error instanceof SearchError) {
      throw error;
    }
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Search error details:', {
      query,
      error: error instanceof Error ? error.stack : error
    });
    
    throw new SearchError(errorMessage, error);
  }
}