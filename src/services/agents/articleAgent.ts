import { BaseAgent } from './baseAgent';
import { AgentResponse, ResearchResult, ArticleResult } from './types';

export class ArticleAgent extends BaseAgent {
  constructor() {
    super(
      'Article Generation Agent',
      'Generate comprehensive articles with citations based on research results and outlines.'
    );
  }

  async execute(researchResult: ResearchResult): Promise<AgentResponse> {
    try {
      const { content, followUpQuestions, citations } = await this.generateArticle(researchResult);

      return {
        success: true,
        data: {
          content,
          followUpQuestions,
          citations
        }
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
          content: `Generate a comprehensive article based on the provided research and outline. Include citations and follow-up questions.`
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