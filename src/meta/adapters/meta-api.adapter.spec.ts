import { Test, TestingModule } from '@nestjs/testing';
import { MetaApiAdapter } from './meta-api.adapter';
import { HttpService } from '../../http/http.service';
import { AppConfigService } from '../../config/config.service';

const mockHttp = {
  get: jest.fn(),
  post: jest.fn(),
};

const mockConfig = {
  metaAppId: 'app-id',
  metaAppSecret: 'app-secret',
  metaRedirectUri: 'http://localhost:3000/auth/meta/callback',
};

const graphApiUrl = 'https://graph.facebook.com/v25.0/page-id';

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
    it('should return pages array', async () => {
      const mockPages = [{ id: '1', name: 'Page 1', access_token: 'token' }];

      mockHttp.get.mockResolvedValue({ data: mockPages });

      const result = await adapter.getUserPages('user-token');

      expect(result).toEqual([
        {
          pageId: '1',
          name: 'Page 1',
          accessToken: 'token',
          category: 'Business',
          description: undefined,
        },
      ]);
    });
  });

  describe('updatePageDescription', () => {
    it('should call Meta API with correct params', async () => {
      mockHttp.post.mockResolvedValue({ success: true });

      await adapter.updatePageDescription('page-id', 'token', 'New description');

      expect(mockHttp.post).toHaveBeenCalledWith(
        graphApiUrl,
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
