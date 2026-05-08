import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from '@config/config.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'debug', 'log'] });

  const config = app.get(AppConfigService);

  await app.listen(config.port);
}

bootstrap();
