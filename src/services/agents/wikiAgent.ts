import { BaseAgent } from './baseAgent';
import { AgentResponse, SearchResult, OutlineSection } from './types';
import axios from 'axios';

export class WikiAgent extends BaseAgent {
  constructor() {
    super(
      'Wikipedia Agent',
      'Search and extract information from Wikipedia articles.'
    );
  }

  async execute(query: string): Promise<AgentResponse> {
    try {
      const searchResults = await this.searchWikipedia(query);
      const outline = await this.generateOutline(searchResults);

      return {
        success: true,
        data: {
          query,
          results: searchResults,
          outline
        }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async searchWikipedia(query: string): Promise<SearchResult[]> {
    const response = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        list: 'search',
        srsearch: query,
        format: 'json',
        origin: '*'
      }
    });

    return response.data.query.search.slice(0, 5).map((result: any) => ({
      title: result.title,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}`,
      content: result.snippet.replace(/<\/?[^>]+(>|$)/g, ''),
      source: 'Wikipedia'
    }));
  }

  private async generateOutline(results: SearchResult[]): Promise<OutlineSection[]> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Generate a structured outline based on the search results.'
        },
        {
          role: 'user',
          content: `Create an outline from these results: ${JSON.stringify(results)}`
        }
      ],
      temperature: 0.7
    });

    return JSON.parse(completion.choices[0].message.content || '[]');
  }
}