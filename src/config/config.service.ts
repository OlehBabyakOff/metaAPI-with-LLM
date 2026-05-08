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
}
