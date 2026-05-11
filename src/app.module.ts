import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppConfigModule } from './config/config.module';
import { LlmModule } from './llm/llm.module';
import { HttpModule } from './http/http.module';
import { MetaModule } from './meta/meta.module';
import { DatabaseModule } from './database/database.module';
import { PagesModule } from './pages/pages.module';

@Module({
  imports: [
    AppConfigModule,
    LlmModule,
    HttpModule,
    MetaModule,
    DatabaseModule,
    PagesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api/*', '/auth/*'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
