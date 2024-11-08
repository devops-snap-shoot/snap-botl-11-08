import { BaseAgent } from './baseAgent';
import { AgentResponse, Perspective } from './types';

export class PerspectiveAgent extends BaseAgent {
  constructor() {
    super(
      'Perspective Generator',
      'Generate key perspectives for a given topic'
    );
  }

  async execute(query: string): Promise<AgentResponse> {
    try {
      const perspectives = await this.generatePerspectives(query);
      
      return {
        success: true,
        data: { perspectives }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async generatePerspectives(query: string): Promise<Perspective[]> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Generate 1-3 key perspectives for the given topic. Each perspective should offer a unique angle for research.'
        },
        {
          role: 'user',
          content: query
        }
      ],
      temperature: 0.7
    });

    return JSON.parse(completion.choices[0].message.content || '[]');
  }
}