import { Module, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { MongooseModule, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AppConfigService } from '../config/config.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => {
        const uri = config.mongoUri;
        if (!uri) {
          throw new Error('MONGO_URI is not defined');
        }

        return {
          uri,
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          autoCreate: true,
        };
      },
    }),
  ],
})
export class DatabaseModule implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  onApplicationBootstrap() {
    this.connection.on('connected', () => this.logger.log('MongoDB connected'));
    this.connection.on('disconnected', () => this.logger.warn('MongoDB disconnected'));
    this.connection.on('error', (err) => this.logger.error('MongoDB error', err));
  }
}
