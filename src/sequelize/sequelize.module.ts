import { Module } from '@nestjs/common';
import { SequelizeModule as Sequelize } from '@nestjs/sequelize';
import { sequelizeConfig } from './config/sequelize.config';
import { SequelizeService } from './sequelize.service';

@Module({
  imports: [Sequelize.forRoot(sequelizeConfig)],
  exports: [SequelizeModule],
  providers: [SequelizeService],
})
export class SequelizeModule {}

/**
 * install umzug -> "umzug": "^3.8.2"
 * include:
 *  "migration:generate": "ts-node src/sequelize/generate-migration.ts",
 *   "migrate": "ts-node src/sequelize/migration-runner.ts"
 */
