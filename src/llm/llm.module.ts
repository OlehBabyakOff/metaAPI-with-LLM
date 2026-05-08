import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { LlmStrategyFactory } from './llm-strategy.factory';
import { OpenAIStrategy } from './strategies/openai.strategy';

import { ILlmStrategy, LLM_STRATEGIES } from './interfaces/llm-strategy.interface';

@Module({
  providers: [
    LlmService,
    LlmStrategyFactory,
    OpenAIStrategy,
    {
      provide: LLM_STRATEGIES,
      useFactory: (...strategies: ILlmStrategy[]) => strategies,
      inject: [OpenAIStrategy],
    },
  ],
  exports: [LlmService],
})
export class LlmModule {}
