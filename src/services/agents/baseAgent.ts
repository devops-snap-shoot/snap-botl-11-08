import OpenAI from 'openai';
import { Agent, AgentResponse } from './types';

export abstract class BaseAgent implements Agent {
  name: string;
  instructions: string;
  functions?: Function[];
  protected openai: OpenAI;
  protected timeout: number = 30000;

  constructor(name: string, instructions: string, functions?: Function[]) {
    this.name = name;
    this.instructions = instructions;
    this.functions = functions;
    this.openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }

  protected async handleError(error: unknown): Promise<AgentResponse> {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`${this.name} error:`, errorMessage);
    return {
      success: false,
      error: errorMessage
    };
  }

  abstract execute(...args: any[]): Promise<AgentResponse>;
}