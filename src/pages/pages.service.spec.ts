import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PagesService } from './pages.service';
import { PagesRepository } from './repositories/pages.repository';
import { MetaApiAdapter } from '../meta/adapters/meta-api.adapter';
import { LlmService } from '../llm/llm.service';

const mockPage = {
  pageId: 'page-123',
  name: 'My Business',
  category: 'Retail',
  description: 'Old description',
  generatedDescription: null,
  pageAccessToken: 'page-token',
};

const mockRepo = {
  findMany: jest.fn().mockResolvedValue([mockPage]),
  findByPageId: jest.fn().mockResolvedValue(mockPage),
  upsert: jest.fn().mockResolvedValue(mockPage),
  updateGeneratedDescription: jest.fn().mockResolvedValue({
    ...mockPage,
    generatedDescription: 'New description',
  }),
  applyGeneratedDescription: jest.fn().mockResolvedValue({
    ...mockPage,
    description: 'New description',
  }),
};

const mockMetaAdapter = {
  getUserPages: jest
    .fn()
    .mockResolvedValue([
      { id: 'page-123', name: 'My Business', category: 'Retail', access_token: 'token' },
    ]),
  updatePageDescription: jest.fn().mockResolvedValue(true),
};

const mockLlmService = {
  generateDescription: jest.fn().mockResolvedValue('LLM generated text'),
};

describe('PagesService', () => {
  let service: PagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagesService,
        { provide: PagesRepository, useValue: mockRepo },
        { provide: MetaApiAdapter, useValue: mockMetaAdapter },
        { provide: LlmService, useValue: mockLlmService },
      ],
    }).compile();

    service = module.get(PagesService);
    jest.clearAllMocks();
  });

  describe('getPages', () => {
    it('should return all pages', async () => {
      mockRepo.findMany.mockResolvedValue([mockPage]);

      const result = await service.getPages();

      expect(result).toHaveLength(1);
      expect(mockRepo.findMany).toHaveBeenCalled();
    });
  });

  describe('getPageById', () => {
    it('should throw NotFoundException when page not found', async () => {
      mockRepo.findByPageId.mockResolvedValue(null);

      await expect(service.getPageById('randomId')).rejects.toThrow(NotFoundException);
    });

    it('should return page when found', async () => {
      mockRepo.findByPageId.mockResolvedValue(mockPage);

      const result = await service.getPageById('page-123');

      expect(result.pageId).toBe('page-123');
    });
  });

  describe('generateDescription', () => {
    it('should generate and save description', async () => {
      mockRepo.findByPageId.mockResolvedValue(mockPage);

      mockLlmService.generateDescription.mockResolvedValue('LLM generated text');

      const result = await service.generateDescription('page-123', {});

      expect(result).toBe('LLM generated text');
      expect(mockRepo.updateGeneratedDescription).toHaveBeenCalledWith(
        'page-123',
        'LLM generated text',
      );
    });
  });

  describe('applyDescription', () => {
    it('should throw when no generated description', async () => {
      mockRepo.findByPageId.mockResolvedValue({ ...mockPage, generatedDescription: null });

      await expect(service.applyDescription('page-123', 'token')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should apply description to Meta and update DB', async () => {
      mockRepo.findByPageId.mockResolvedValue({
        ...mockPage,
        generatedDescription: 'New description',
      });

      mockRepo.applyGeneratedDescription.mockResolvedValue({
        ...mockPage,
        description: 'New description',
      });

      const result = await service.applyDescription('page-123', 'token');

      expect(mockMetaAdapter.updatePageDescription).toHaveBeenCalledWith(
        'page-123',
        'token',
        'New description',
      );
      expect(result.description).toBe('New description');
    });
  });
});
