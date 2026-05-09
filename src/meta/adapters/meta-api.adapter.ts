import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '../../http/http.service';
import { AppConfigService } from '../../config/config.service';

export interface RawMetaPage {
  id: string;
  name: string;
  description?: string;
  category?: string;
  access_token: string;
}

interface RawMetaPageListResponse {
  data: RawMetaPage[];
  paging?: { cursors: { before: string; after: string } };
}

interface MetaTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

interface MetaOAuthUrlParams {
  clientId: string;
  redirectUri: string;
  scopes: string[];
  state: string;
}

export interface MetaPageResult {
  pageId: string;
  name: string;
  category: string;
  accessToken: string;
  description?: string;
}

@Injectable()
export class MetaApiAdapter {
  private readonly logger = new Logger(MetaApiAdapter.name);
  private readonly baseUrl = 'https://graph.facebook.com/v25.0';
  private readonly oauthBaseUrl = 'https://www.facebook.com/v25.0/dialog/oauth';
  private readonly tokenUrl = 'https://graph.facebook.com/v25.0/oauth/access_token';

  constructor(
    private readonly http: HttpService,
    private readonly config: AppConfigService,
  ) {}

  // OAuth methods
  buildOAuthUrl(params: MetaOAuthUrlParams): string {
    const url = new URL(this.oauthBaseUrl);

    url.searchParams.set('client_id', params.clientId);
    url.searchParams.set('redirect_uri', params.redirectUri);
    url.searchParams.set('scope', params.scopes.join(','));
    url.searchParams.set('state', params.state);
    url.searchParams.set('response_type', 'code');

    return url.toString();
  }

  async exchangeCode(code: string): Promise<MetaTokenResponse> {
    return this.http.get<MetaTokenResponse>(this.tokenUrl, {
      params: {
        client_id: this.config.metaAppId,
        client_secret: this.config.metaAppSecret,
        redirect_uri: this.config.metaRedirectUri,
        code,
      },
    });
  }

  async getLongLivedToken(shortToken: string): Promise<MetaTokenResponse> {
    return this.http.get<MetaTokenResponse>(this.tokenUrl, {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: this.config.metaAppId,
        client_secret: this.config.metaAppSecret,
        fb_exchange_token: shortToken,
      },
    });
  }

  // Pages methods
  async getUserPages(accessToken: string): Promise<MetaPageResult[]> {
    const response = await this.http.get<RawMetaPageListResponse>(`${this.baseUrl}/me/accounts`, {
      params: {
        access_token: accessToken,
        fields: 'id,name,description,category,access_token',
      },
    });

    return response.data.map((page) => ({
      pageId: page.id,
      name: page.name,
      category: page.category ?? 'Business',
      accessToken: page.access_token,
      description: page.description,
    }));
  }

  async updatePageDescription(
    pageId: string,
    pageAccessToken: string,
    description: string,
  ): Promise<void> {
    await this.http.post<{ success: boolean }>(
      `${this.baseUrl}/${pageId}`,
      { description },
      { params: { access_token: pageAccessToken } },
    );
  }
}
