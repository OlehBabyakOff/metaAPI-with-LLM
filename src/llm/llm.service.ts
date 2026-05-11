import { Injectable } from '@nestjs/common';
import { LlmStrategyFactory } from './llm-strategy.factory';

import { GenerateDescriptionInput } from './interfaces/llm-strategy.interface';

@Injectable()
export class LlmService {
  constructor(private readonly strategyFactory: LlmStrategyFactory) {}

  async generateDescription(input: GenerateDescriptionInput): Promise<string> {
    const { pageName, category, customPrompt } = input;

    const prompt = customPrompt?.length
      ? customPrompt
      : this.buildDefaultPrompt(pageName, category);

    const strategy = this.strategyFactory.getStrategy();

    return strategy.generateDescription(prompt);
  }

  private buildDefaultPrompt(pageName: string, category: string): string {
    return (
      `Generate a Facebook page description ` +
      `for a page named "${pageName}" in the "${category}" category. ` +
      `Requirements: max 255 characters, professional tone, no hashtags. ` +
      `Return only the description text, nothing else.`
    );
  }
}
