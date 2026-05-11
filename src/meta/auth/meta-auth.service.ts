import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { MetaApiAdapter } from '../adapters/meta-api.adapter';
import { AppConfigService } from '../../config/config.service';
import { randomBytes } from 'crypto';

@Injectable()
export class MetaAuthService {
  private readonly logger = new Logger(MetaAuthService.name);
  // replace with Redis in the future
  private readonly stateStore = new Map<string, { createdAt: Date }>();

  constructor(
    private readonly metaAdapter: MetaApiAdapter,
    private readonly config: AppConfigService,
  ) {}

  initiateOAuth(): { url: string; state: string } {
    // CSRF protection
    const state = randomBytes(16).toString('hex');

    this.stateStore.set(state, { createdAt: new Date() });

    const url = this.metaAdapter.buildOAuthUrl({
      clientId: this.config.metaAppId,
      redirectUri: this.config.metaRedirectUri,
      scopes: ['pages_show_list', 'pages_manage_metadata'],
      state,
    });

    return { url, state };
  }

  async handleCallback(code: string, state: string): Promise<{ accessToken: string }> {
    if (!this.stateStore.has(state)) {
      throw new UnauthorizedException('Invalid OAuth state');
    }

    this.stateStore.delete(state);

    const shortToken = await this.metaAdapter.exchangeCode(code);

    const token = await this.metaAdapter.getLongLivedToken(shortToken.access_token);

    return { accessToken: token.access_token };
  }
}
