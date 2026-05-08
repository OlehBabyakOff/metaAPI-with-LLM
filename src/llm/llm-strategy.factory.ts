import { Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { AppConfigService } from '@config/config.service';

import { ILlmStrategy, LLM_STRATEGIES } from './interfaces/llm-strategy.interface';

@Injectable()
export class LlmStrategyFactory {
  private readonly logger = new Logger(LlmStrategyFactory.name);
  private readonly registry = new Map<string, ILlmStrategy>();

  constructor(
    @Inject(LLM_STRATEGIES)
    private readonly strategies: ILlmStrategy[],
    private readonly config: AppConfigService,
  ) {
    this.registry = new Map(
      strategies.map((strategy) => {
        this.logger.log(`LLM strategy registered: ${strategy.providerName}`);

        return [strategy.providerName, strategy];
      }),
    );
  }

  getStrategy(provider?: string): ILlmStrategy {
    const providerName = provider ?? this.config.llmProvider;
    const strategy = this.registry.get(providerName);

    if (!strategy) {
      throw new NotFoundException(`LLM strategy not found: ${providerName}`);
    }

    return strategy;
  }
}
