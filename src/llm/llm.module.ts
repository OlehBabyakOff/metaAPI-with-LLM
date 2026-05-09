import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { LlmStrategyFactory } from './llm-strategy.factory';
import { OpenAIStrategy } from './strategies/openai.strategy';
import { AnthropicStrategy } from './strategies/anthropic.strategy';

import { ILlmStrategy, LLM_STRATEGIES } from './interfaces/llm-strategy.interface';

@Module({
  providers: [
    LlmService,
    LlmStrategyFactory,
    OpenAIStrategy,
    AnthropicStrategy,
    {
      provide: LLM_STRATEGIES,
      useFactory: (...strategies: ILlmStrategy[]) => strategies,
      inject: [OpenAIStrategy, AnthropicStrategy],
    },
  ],
  exports: [LlmService],
})
export class LlmModule {}
