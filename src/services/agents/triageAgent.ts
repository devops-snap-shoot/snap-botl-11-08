import { BaseAgent } from './baseAgent';
import { AgentResponse } from './types';

export class TriageAgent extends BaseAgent {
  constructor() {
    super(
      'Triage Agent',
      'Analyze queries and determine the most appropriate search agent based on complexity and topic.'
    );
  }

  async execute(query: string): Promise<AgentResponse> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: this.instructions
          },
          {
            role: 'user',
            content: `Analyze this query and determine the best search agent: "${query}". Options: WikiAgent (wikipedia), SearxAgent (general web), YDCAgent (complex queries). Respond with just the agent name.`
          }
        ],
        temperature: 0.3,
        max_tokens: 50
      });

      const selectedAgent = completion.choices[0].message.content?.trim();

      return {
        success: true,
        data: { selectedAgent }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}