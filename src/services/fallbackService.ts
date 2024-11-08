import axios from 'axios';
import { SearchResult } from './types';
import { FALLBACK_APIS, API_TIMEOUT } from './config';

const axiosInstance = axios.create({
  timeout: API_TIMEOUT,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'Snap Search Bot/1.0',
  },
});

async function searchDuckDuckGo(query: string): Promise<SearchResult[]> {
  const response = await axiosInstance.get(FALLBACK_APIS.duckduckgo, {
    params: {
      q: query,
      format: 'json',
      no_html: 1,
      skip_disambig: 1,
    },
  });

  const { AbstractText, AbstractURL, RelatedTopics } = response.data;
  const results: SearchResult[] = [];

  if (AbstractText && AbstractURL) {
    results.push({
      title: 'Summary',
      url: AbstractURL,
      content: AbstractText,
    });
  }

  RelatedTopics?.slice(0, 4).forEach((topic: any) => {
    if (topic.Text && topic.FirstURL) {
      results.push({
        title: topic.Text.split(' - ')[0],
        url: topic.FirstURL,
        content: topic.Text,
      });
    }
  });

  return results;
}

async function searchWikipedia(query: string): Promise<SearchResult[]> {
  const response = await axiosInstance.get(FALLBACK_APIS.wikipedia, {
    params: {
      action: 'query',
      list: 'search',
      srsearch: query,
      format: 'json',
      utf8: 1,
      origin: '*',
    },
  });

  return response.data.query.search.slice(0, 5).map((result: any) => ({
    title: result.title,
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}`,
    content: result.snippet.replace(/<\/?[^>]+(>|$)/g, ''),
  }));
}

export async function getFallbackResults(query: string): Promise<SearchResult[]> {
  try {
    const results = await searchDuckDuckGo(query);
    if (results.length > 0) return results;
  } catch (error) {
    console.error('DuckDuckGo search failed:', error);
  }

  try {
    const results = await searchWikipedia(query);
    if (results.length > 0) return results;
  } catch (error) {
    console.error('Wikipedia search failed:', error);
  }

  throw new Error('All fallback search methods failed');
}