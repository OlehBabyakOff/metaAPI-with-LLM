import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { AppConfigService } from '@config/config.service';

import { ILlmStrategy } from '../interfaces/llm-strategy.interface';

@Injectable()
export class GeminiStrategy implements ILlmStrategy {
  readonly providerName = 'gemini';
  private readonly client: GoogleGenAI;
  private readonly logger = new Logger(GeminiStrategy.name);

  constructor(private readonly config: AppConfigService) {
    this.client = new GoogleGenAI({ apiKey: config.geminiApiKey });
  }

  async generateDescription(prompt: string): Promise<string> {
    this.logger.debug('Generating description using Gemini');

    const response = await this.client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() ?? '';
  }
}
