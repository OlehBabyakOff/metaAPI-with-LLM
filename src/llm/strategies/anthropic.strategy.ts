import { Injectable, Logger } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { AppConfigService } from '@config/config.service';

import { ILlmStrategy } from '../interfaces/llm-strategy.interface';

@Injectable()
export class AnthropicStrategy implements ILlmStrategy {
  readonly providerName = 'claude';
  private readonly client: Anthropic;
  private readonly logger = new Logger(AnthropicStrategy.name);

  constructor(private readonly config: AppConfigService) {
    this.client = new Anthropic({ apiKey: config.anthropicApiKey });
  }

  async generateDescription(prompt: string): Promise<string> {
    this.logger.debug('Generating description using Claude');

    const response = await this.client.messages.create({
      model: 'claude-3-haiku-20240307',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    });

    return response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';
  }
}
