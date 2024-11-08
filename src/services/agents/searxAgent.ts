import { BaseAgent } from './baseAgent';
import { AgentResponse, SearchResult, OutlineSection } from './types';
import { searchAcrossInstances } from '../searxService';

export class SearxAgent extends BaseAgent {
  constructor() {
    super(
      'SearxNG Agent',
      'Perform broad web searches using SearxNG instances.'
    );
  }

  async execute(query: string): Promise<AgentResponse> {
    try {
      const searchResults = await searchAcrossInstances(query);
      const outline = await this.generateOutline(searchResults);

      return {
        success: true,
        data: {
          query,
          results: searchResults.map(result => ({
            ...result,
            source: 'SearxNG'
          })),
          outline
        }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async generateOutline(results: SearchResult[]): Promise<OutlineSection[]> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
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