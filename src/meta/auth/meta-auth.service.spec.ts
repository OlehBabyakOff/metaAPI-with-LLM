import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { MetaAuthService } from './meta-auth.service';
import { MetaApiAdapter } from '../adapters/meta-api.adapter';
import { AppConfigService } from '../../config/config.service';

const mockAdapter = {
  buildOAuthUrl: jest.fn().mockReturnValue('https://facebook.com/oauth?mock'),
  exchangeCode: jest.fn().mockResolvedValue({ access_token: 'short-token' }),
  getLongLivedToken: jest.fn().mockResolvedValue({ access_token: 'long-token' }),
};

const mockConfig = {
  metaAppId: 'test-app-id',
  metaRedirectUri: 'http://localhost:3000/auth/meta/callback',
};

describe('MetaAuthService', () => {
  let service: MetaAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetaAuthService,
        { provide: MetaApiAdapter, useValue: mockAdapter },
        { provide: AppConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<MetaAuthService>(MetaAuthService);

    jest.clearAllMocks();
  });

  describe('initiateOAuth', () => {
    it('should return url and state', () => {
      const result = service.initiateOAuth();

      expect(result.url).toBe('https://facebook.com/oauth?mock');
      expect(result.state).toBeDefined();
    });

    it('should generate state as 32 char hex string', () => {
      const { state } = service.initiateOAuth();

      expect(state).toHaveLength(32);
      expect(state).toMatch(/^[a-f0-9]+$/);
    });

    it('should generate unique state on each call', () => {
      const first = service.initiateOAuth();
      const second = service.initiateOAuth();

      expect(first.state).not.toBe(second.state);
    });

    it('should call buildOAuthUrl with correct params', () => {
      const { state } = service.initiateOAuth();

      expect(mockAdapter.buildOAuthUrl).toHaveBeenCalledWith({
        clientId: 'test-app-id',
        redirectUri: 'http://localhost:3000/auth/meta/callback',
        scopes: ['pages_show_list'],
        state,
      });
    });
  });

  describe('handleCallback', () => {
    it('should throw UnauthorizedException on invalid state', async () => {
      await expect(service.handleCallback('any-code', 'invalid-state')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw with correct message on invalid state', async () => {
      await expect(service.handleCallback('any-code', 'invalid-state')).rejects.toThrow(
        'Invalid OAuth state',
      );
    });

    it('should return long-lived access token on valid state', async () => {
      mockAdapter.exchangeCode.mockResolvedValue({ access_token: 'short-token' });
      mockAdapter.getLongLivedToken.mockResolvedValue({ access_token: 'long-token' });

      const { state } = service.initiateOAuth();

      const result = await service.handleCallback('real-code', state);

      expect(result.accessToken).toBe('long-token');
    });

    it('should exchange code with correct value', async () => {
      const { state } = service.initiateOAuth();

      await service.handleCallback('real-code', state);

      expect(mockAdapter.exchangeCode).toHaveBeenCalledWith('real-code');
    });

    it('should exchange short token for long-lived token', async () => {
      mockAdapter.exchangeCode.mockResolvedValue({ access_token: 'short-token' });

      const { state } = service.initiateOAuth();

      await service.handleCallback('real-code', state);

      expect(mockAdapter.getLongLivedToken).toHaveBeenCalledWith('short-token');
    });

    it('should delete state after successful callback', async () => {
      const { state } = service.initiateOAuth();

      await service.handleCallback('code', state);

      await expect(service.handleCallback('code', state)).rejects.toThrow(UnauthorizedException);
    });

    it('should not call exchangeCode on invalid state', async () => {
      await expect(service.handleCallback('code', 'bad-state')).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockAdapter.exchangeCode).not.toHaveBeenCalled();
    });
  });
});
