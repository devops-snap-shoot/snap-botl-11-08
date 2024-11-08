import { BaseAgent } from './baseAgent';
import { AgentResponse } from './types';

export class UIAgent extends BaseAgent {
  constructor() {
    super(
      'UI Agent',
      'Handle user interaction and presentation of results'
    );
  }

  async execute(data: any): Promise<AgentResponse> {
    try {
      // Format and prepare data for presentation
      const formattedData = await this.formatOutput(data);
      
      return {
        success: true,
        data: formattedData
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async formatOutput(data: any): Promise<any> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Format the provided data for user presentation. Ensure clarity and readability.'
        },
        {
          role: 'user',
          content: JSON.stringify(data)
        }
      ],
      temperature: 0.3
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  }
}