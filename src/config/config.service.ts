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

  // Mongo
  get mongoUri(): string {
    return this.nestConfig.getOrThrow<string>('MONGO_URI');
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

  get geminiApiKey(): string | undefined {
    return this.nestConfig.getOrThrow<string>('GEMINI_API_KEY');
  }

  // Meta
  get metaBaseUrl(): string {
    return this.nestConfig.getOrThrow<string>('META_BASE_URL');
  }

  get metaApiVersion(): string {
    return this.nestConfig.getOrThrow<string>('META_API_VERSION');
  }

  get metaAppId(): string {
    return this.nestConfig.getOrThrow<string>('META_APP_ID');
  }

  get metaAppSecret(): string {
    return this.nestConfig.getOrThrow<string>('META_APP_SECRET');
  }

  get metaRedirectUri(): string {
    return this.nestConfig.getOrThrow<string>('META_REDIRECT_URI');
  }

  get metaScopes(): string[] {
    return this.nestConfig
      .getOrThrow<string>('META_SCOPES')
      .split(',')
      .map((scope) => scope.trim());
  }
}
