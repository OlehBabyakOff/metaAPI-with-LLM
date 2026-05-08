import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { AppConfigService } from '@config/config.service';

import { ILlmStrategy } from '../interfaces/llm-strategy.interface';

@Injectable()
export class OpenAIStrategy implements ILlmStrategy {
  readonly providerName = 'openai';
  private readonly client: OpenAI;
  private readonly logger = new Logger(OpenAIStrategy.name);

  constructor(private readonly config: AppConfigService) {
    this.client = new OpenAI({ apiKey: config.openaiApiKey });
  }

  async generateDescription(prompt: string): Promise<string> {
    this.logger.debug('Generating description using OpenAI');

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_completion_tokens: 300,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content?.trim() ?? '';
  }
}
