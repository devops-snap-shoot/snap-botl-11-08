import { BaseAgent } from './baseAgent';
import { AgentResponse, ResearchResult, ArticleResult } from './types';

export class WriterAgent extends BaseAgent {
  constructor() {
    super(
      'Article Writer',
      'Generate comprehensive articles with citations based on research results'
    );
  }

  async execute(research: ResearchResult): Promise<AgentResponse> {
    try {
      const article = await this.generateArticle(research);

      return {
        success: true,
        data: article
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async generateArticle(research: ResearchResult): Promise<ArticleResult> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Generate a comprehensive article based on the provided research. Include citations and follow-up questions.'
        },
        {
          role: 'user',
          content: JSON.stringify(research)
        }
      ],
      temperature: 0.7
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  }
}