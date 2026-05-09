import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly nestConfig: ConfigService) {}

  get nodeEnv(): string {
    return this.nestConfig.getOrThrow<string>('NODE_ENV');
  }

  get port(): number {
    return this.nestConfig.getOrThrow<number>('PORT');
  }

  // LLM
  get llmProvider(): string {
    return this.nestConfig.getOrThrow<string>('LLM_PROVIDER');
  }

  get openaiApiKey(): string | undefined {
    return this.nestConfig.getOrThrow<string>('OPENAI_API_KEY');
  }

  get anthropicApiKey(): string | undefined {
    return this.nestConfig.getOrThrow<string>('ANTHROPIC_API_KEY');
  }
}
