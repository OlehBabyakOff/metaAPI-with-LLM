import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { LlmModule } from './llm/llm.module';
import { HttpModule } from './http/http.module';
import { MetaModule } from './meta/meta.module';

@Module({
  imports: [AppConfigModule, LlmModule, HttpModule, MetaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
