import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoConfig, {
  MONGO_CONFIG_KEY,
  MongoConfig,
} from './config/mongo.config';
import { MongoDB } from './mongodb.service';

@Module({
  imports: [
    ConfigModule.forFeature(mongoConfig),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.getOrThrow<MongoConfig>(MONGO_CONFIG_KEY);
        return config;
      },
    }),
  ],
  providers: [MongoDB],
})
export class MongoDBModule {}
