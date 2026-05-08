import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './config.service';
import { configSchema } from './config.schema';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configSchema,
      validationOptions: { abortEarly: false },
      isGlobal: true,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
