import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Page } from '../schemas/page.schema';
import { BaseRepository } from '../../database/repositories/base.repository';

@Injectable()
export class PagesRepository extends BaseRepository<Page> {
  constructor(@InjectModel(Page.name) private readonly pageModel: Model<Page>) {
    super(pageModel);
  }

  async findByPageId(pageId: string): Promise<Page | null> {
    return this.findOne({ pageId });
  }

  async updateGeneratedDescription(pageId: string, description: string): Promise<Page | null> {
    return this.updateOne({ pageId }, { generatedDescription: description });
  }

  async applyGeneratedDescription(pageId: string): Promise<Page | null> {
    const page = await this.findByPageId(pageId);

    if (!page?.generatedDescription) {
      return null;
    }

    return this.updateOne(
      { pageId },
      {
        description: page.generatedDescription,
        generatedDescription: null,
      },
    );
  }
}
