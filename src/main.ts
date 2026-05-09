import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from '@config/config.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'debug', 'log'] });

  const logger = new Logger('Bootstrap');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Meta Description Manager')
    .setDescription('Service for generating and updating Meta Page descriptions using LLM`s')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const config = app.get(AppConfigService);

  await app.listen(config.port);

  logger.log(`Server running on http://localhost:${config.port}`);
  logger.log(`Swagger docs: http://localhost:${config.port}/api/docs`);
}

bootstrap();
