import { UIAgent } from './uiAgent';
import { PerspectiveAgent } from './perspectiveAgent';
import { RetrieverAgent } from './retrieverAgent';
import { WriterAgent } from './writerAgent';
import { AgentResponse, ResearchResult, ArticleResult } from './types';

export class SwarmController {
  private uiAgent: UIAgent;
  private perspectiveAgent: PerspectiveAgent;
  private retrieverAgent: RetrieverAgent;
  private writerAgent: WriterAgent;

  constructor() {
    this.uiAgent = new UIAgent();
    this.perspectiveAgent = new PerspectiveAgent();
    this.retrieverAgent = new RetrieverAgent();
    this.writerAgent = new WriterAgent();
  }

  async processQuery(query: string): Promise<{
    research: ResearchResult;
    article: ArticleResult;
  }> {
    try {
      // 1. Generate perspectives
      const perspectiveResponse = await this.perspectiveAgent.execute(query);
      if (!perspectiveResponse.success) {
        throw new Error(perspectiveResponse.error);
      }

      // 2. Retrieve information
      const retrievalResponse = await this.retrieverAgent.execute(
        query,
        perspectiveResponse.data.perspectives
      );
      if (!retrievalResponse.success) {
        throw new Error(retrievalResponse.error);
      }

      // 3. Generate article
      const writerResponse = await this.writerAgent.execute(
        retrievalResponse.data as ResearchResult
      );
      if (!writerResponse.success) {
        throw new Error(writerResponse.error);
      }

      // 4. Format for presentation
      const uiResponse = await this.uiAgent.execute({
        research: retrievalResponse.data,
        article: writerResponse.data
      });
      if (!uiResponse.success) {
        throw new Error(uiResponse.error);
      }

      return uiResponse.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to process query'
      );
    }
  }
}