import { SequelizeModuleOptions } from '@nestjs/sequelize';
//TODO: configure to use from env
export const sequelizeConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'time-sheet',
  autoLoadModels: true,
  synchronize: true, // disable this in production
  logging: false,
};
