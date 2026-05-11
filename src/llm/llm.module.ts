import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { LlmStrategyFactory } from './llm-strategy.factory';
import { OpenAIStrategy } from './strategies/openai.strategy';
import { AnthropicStrategy } from './strategies/anthropic.strategy';
import { GeminiStrategy } from './strategies/gemini.strategy';

import { ILlmStrategy, LLM_STRATEGIES } from './interfaces/llm-strategy.interface';

@Module({
  providers: [
    LlmService,
    LlmStrategyFactory,
    OpenAIStrategy,
    AnthropicStrategy,
    GeminiStrategy,
    {
      provide: LLM_STRATEGIES,
      useFactory: (...strategies: ILlmStrategy[]) => strategies,
      inject: [OpenAIStrategy, AnthropicStrategy, GeminiStrategy],
    },
  ],
  exports: [LlmService],
})
export class LlmModule {}
