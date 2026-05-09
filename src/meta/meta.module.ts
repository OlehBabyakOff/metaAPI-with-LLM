import { Module } from '@nestjs/common';
import { MetaApiAdapter } from './adapters/meta-api.adapter';
import { MetaAuthService } from './auth/meta-auth.service';
import { MetaAuthController } from './auth/meta-auth.controller';

@Module({
  controllers: [MetaAuthController],
  providers: [MetaApiAdapter, MetaAuthService],
  exports: [MetaApiAdapter],
})
export class MetaModule {}
