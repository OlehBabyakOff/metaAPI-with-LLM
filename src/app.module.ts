import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { LlmModule } from './llm/llm.module';
import { HttpModule } from './http/http.module';

@Module({
  imports: [AppConfigModule, LlmModule, HttpModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
