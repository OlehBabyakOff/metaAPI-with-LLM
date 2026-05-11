import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PagesRepository } from './repositories/pages.repository';
import { MetaApiAdapter, MetaPageResult } from '../meta/adapters/meta-api.adapter';
import { LlmService } from '../llm/llm.service';
import { Page } from './schemas/page.schema';
import { GenerateDescriptionDTO } from './dto/generate-description.dto';

@Injectable()
export class PagesService {
  constructor(
    private readonly pagesRepository: PagesRepository,
    private readonly metaAdapter: MetaApiAdapter,
    private readonly llmService: LlmService,
  ) {}

  async syncPages(accessToken: string): Promise<Page[]> {
    const metaPages = await this.metaAdapter.getUserPages(accessToken);

    await Promise.all(
      metaPages.map((p: MetaPageResult) =>
        this.pagesRepository.upsert(
          { pageId: p.pageId },
          {
            pageId: p.pageId,
            name: p.name,
            description: p.description,
            category: p.category,
            pageAccessToken: p.accessToken,
          },
        ),
      ),
    );

    return this.pagesRepository.findMany();
  }

  async getPages(): Promise<Page[]> {
    return this.pagesRepository.findMany();
  }

  async getPageById(pageId: string): Promise<Page> {
    const page = await this.pagesRepository.findByPageId(pageId);

    if (!page) {
      throw new NotFoundException(`Page ${pageId} not found`);
    }

    return page;
  }

  async generateDescription(
    pageId: string,
    dto: GenerateDescriptionDTO,
  ): Promise<{ description: string }> {
    const page = await this.getPageById(pageId);

    const generated = await this.llmService.generateDescription({
      pageName: page.name,
      category: page.category ?? 'Business',
      customPrompt: dto.customPrompt,
    });

    await this.pagesRepository.updateGeneratedDescription(pageId, generated);

    return { description: generated };
  }

  async applyDescription(pageId: string, pageAccessToken: string): Promise<Page> {
    const page = await this.getPageById(pageId);

    if (!page.generatedDescription) {
      throw new BadRequestException(`No generated description for page ${pageId}`);
    }

    const token = pageAccessToken || page.pageAccessToken;

    if (!token) {
      throw new BadRequestException('Page access token is required');
    }

    await this.metaAdapter.updatePageDescription(pageId, token, page.generatedDescription);

    const updated = await this.pagesRepository.applyGeneratedDescription(pageId);

    if (!updated) {
      throw new NotFoundException(`Page ${pageId} not found after update`);
    }

    return updated;
  }
}
