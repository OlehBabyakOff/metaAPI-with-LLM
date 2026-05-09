import { Injectable } from '@nestjs/common';
import { LlmStrategyFactory } from './llm-strategy.factory';

import { GenerateDescriptionInput } from './interfaces/llm-strategy.interface';

@Injectable()
export class LlmService {
  constructor(private readonly strategyFactory: LlmStrategyFactory) {}

  async generateDescription(input: GenerateDescriptionInput): Promise<string> {
    const { customPrompt } = input;

    const prompt = customPrompt ?? this.buildDefaultPrompt();

    const strategy = this.strategyFactory.getStrategy();

    return strategy.generateDescription(prompt);
  }

  private buildDefaultPrompt(): string {
    return '';
  }
}
