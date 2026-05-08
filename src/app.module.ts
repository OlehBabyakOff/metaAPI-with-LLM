import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { LlmModule } from './llm/llm.module';

@Module({
  imports: [AppConfigModule, LlmModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
