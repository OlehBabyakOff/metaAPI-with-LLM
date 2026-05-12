import { Test, TestingModule } from '@nestjs/testing';
import { MetaApiAdapter } from './meta-api.adapter';
import { HttpService } from '../../http/http.service';
import { AppConfigService } from '../../config/config.service';

const mockHttp = {
  get: jest.fn(),
  post: jest.fn(),
};

const mockConfig = {
  metaBaseUrl: 'https://graph.facebook.com',
  metaApiVersion: 'v25.0',
  metaAppId: 'app-id',
  metaAppSecret: 'app-secret',
  metaRedirectUri: 'http://localhost:3000/auth/meta/callback',
};

const graphRootUrl = 'https://graph.facebook.com';
const graphApiUrl = `${graphRootUrl}/v25.0`;

describe('MetaApiAdapter', () => {
  let adapter: MetaApiAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetaApiAdapter,
        { provide: HttpService, useValue: mockHttp },
        { provide: AppConfigService, useValue: mockConfig },
      ],
    }).compile();

    adapter = module.get(MetaApiAdapter);

    jest.clearAllMocks();
  });

  describe('buildOAuthUrl', () => {
    it('should build correct OAuth URL', () => {
      const url = adapter.buildOAuthUrl({
        clientId: 'app-id',
        redirectUri: 'http://localhost/callback',
        scopes: ['pages_show_list'],
        state: 'random-state',
      });

      expect(url).toContain('facebook.com');
      expect(url).toContain('app-id');
      expect(url).toContain('pages_show_list');
      expect(url).toContain('random-state');
    });
  });

  describe('getUserPages', () => {
    const mockRawPages = [
      { id: 'page-1', name: 'Page One', access_token: 'page-token-1', category: 'Food' },
      { id: 'page-2', name: 'Page Two', access_token: 'page-token-2' },
    ];

    const mockBatchResults = [
      { code: 200, body: JSON.stringify({ description: 'Page one description' }) },
      { code: 200, body: JSON.stringify({ description: 'Page two description' }) },
    ];

    beforeEach(() => {
      mockHttp.get.mockResolvedValue({ data: mockRawPages });
      mockHttp.post.mockResolvedValue(mockBatchResults);
    });

    it('should fetch pages from /me/accounts', async () => {
      await adapter.getUserPages('user-token');

      expect(mockHttp.get).toHaveBeenCalledWith(`${graphApiUrl}/me/accounts`, {
        params: {
          access_token: 'user-token',
          fields: 'id,name,category,access_token',
        },
      });
    });

    it('should send batch request for descriptions', async () => {
      await adapter.getUserPages('user-token');

      expect(mockHttp.post).toHaveBeenCalledWith(graphRootUrl, null, {
        params: {
          access_token: 'user-token',
          batch: JSON.stringify([
            { method: 'GET', relative_url: 'page-1?fields=description&access_token=page-token-1' },
            { method: 'GET', relative_url: 'page-2?fields=description&access_token=page-token-2' },
          ]),
          include_headers: false,
        },
      });
    });

    it('should map raw pages to MetaPageResult with descriptions', async () => {
      const result = await adapter.getUserPages('user-token');

      expect(result).toEqual([
        {
          pageId: 'page-1',
          name: 'Page One',
          category: 'Food',
          accessToken: 'page-token-1',
          description: 'Page one description',
        },
        {
          pageId: 'page-2',
          name: 'Page Two',
          category: 'Business',
          accessToken: 'page-token-2',
          description: 'Page two description',
        },
      ]);
    });

    it('should return undefined description when batch item fails', async () => {
      mockHttp.post.mockResolvedValue([
        { code: 400, body: null },
        { code: 200, body: JSON.stringify({ description: 'Page two description' }) },
      ]);

      const result = await adapter.getUserPages('user-token');

      expect(result[0]?.description).toBeUndefined();
      expect(result[1]?.description).toBe('Page two description');
    });

    it('should return undefined description when page has no description', async () => {
      mockHttp.post.mockResolvedValue([{ code: 200, body: JSON.stringify({}) }]);

      mockHttp.get.mockResolvedValue({
        data: [mockRawPages[0]],
      });

      const result = await adapter.getUserPages('user-token');

      expect(result[0]?.description).toBeUndefined();
    });

    it('should return empty array when no pages', async () => {
      mockHttp.get.mockResolvedValue({ data: [] });

      const result = await adapter.getUserPages('user-token');

      expect(result).toEqual([]);

      expect(mockHttp.post).not.toHaveBeenCalled();
    });
  });

  describe('updatePageDescription', () => {
    it('should call Meta API with correct params', async () => {
      mockHttp.post.mockResolvedValue({ success: true });

      await adapter.updatePageDescription('page-id', 'token', 'New description');

      expect(mockHttp.post).toHaveBeenCalledWith(
        `${graphApiUrl}/page-id`,
        { description: 'New description' },
        { params: { access_token: 'token' } },
      );
    });

    it('should throw if http post fails', async () => {
      mockHttp.post.mockRejectedValue(new Error('Network error'));

      await expect(
        adapter.updatePageDescription('page-id', 'token', 'New description'),
      ).rejects.toThrow('Network error');
    });
  });
});
