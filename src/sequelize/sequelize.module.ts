import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  SequelizeModule as Sequelize,
  SequelizeModuleOptions,
} from '@nestjs/sequelize';
import {
  POSTGRES_CONFIG_KEY,
  sequelizeConfig,
} from './config/sequelize.config';
import { SequelizeService } from './sequelize.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [sequelizeConfig], // Load your registered config
    }),
    Sequelize.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config =
          configService.getOrThrow<SequelizeModuleOptions>(POSTGRES_CONFIG_KEY);
        return config;
      },
    }),
  ],
  providers: [SequelizeService],
  exports: [Sequelize],
})
export class SequelizeModule {}

/**
 * install umzug -> "umzug": "^3.8.2"
 * include:
 *  "migration:generate": "ts-node src/sequelize/generate-migration.ts",
 *   "migrate": "ts-node src/sequelize/migration-runner.ts"
 */
