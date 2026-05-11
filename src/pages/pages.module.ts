import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';
import { PagesRepository } from './repositories/pages.repository';
import { Page, PageSchema } from './schemas/page.schema';
import { MetaModule } from '../meta/meta.module';
import { LlmModule } from '../llm/llm.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }]),
    MetaModule,
    LlmModule,
  ],
  controllers: [PagesController],
  providers: [PagesService, PagesRepository],
})
export class PagesModule {}
