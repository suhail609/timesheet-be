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
