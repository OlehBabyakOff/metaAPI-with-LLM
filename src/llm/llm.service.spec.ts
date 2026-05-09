import { Test, TestingModule } from '@nestjs/testing';
import { LlmService } from './llm.service';
import { LlmStrategyFactory } from './llm-strategy.factory';

import { ILlmStrategy } from './interfaces/llm-strategy.interface';

const mockStrategy: ILlmStrategy = {
  providerName: 'mock',
  generateDescription: jest.fn().mockResolvedValue('Generated description'),
};

const mockFactory = {
  getStrategy: jest.fn().mockReturnValue(mockStrategy),
};

describe('LlmService', () => {
  let service: LlmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LlmService, { provide: LlmStrategyFactory, useValue: mockFactory }],
    }).compile();

    service = module.get(LlmService);
  });

  it('should generate description with default prompt', async () => {
    const result = await service.generateDescription({});

    expect(result).toBe('Generated description');
  });

  it('should use custom prompt when provided', async () => {
    const customPrompt = 'My custom prompt';
    await service.generateDescription({
      customPrompt,
    });

    expect(mockStrategy.generateDescription).toHaveBeenCalledWith(customPrompt);
  });
});
