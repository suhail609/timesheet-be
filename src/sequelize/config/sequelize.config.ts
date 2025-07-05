import { registerAs } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const POSTGRES_CONFIG_KEY = 'postgres';

export const sequelizeConfig = registerAs(
  POSTGRES_CONFIG_KEY,
  (): SequelizeModuleOptions => ({
    dialect: 'postgres',
    host:
      process.env.POSTGRES_DB_HOST ??
      (() => {
        throw new Error('POSTGRES_DB_HOST is not defined');
      })(),
    port: parseInt(
      process.env.POSTGRES_DB_PORT ??
        (() => {
          throw new Error('POSTGRES_DB_PORT is not defined');
        })(),
    ),
    username:
      process.env.POSTGRES_DB_USERNAME ??
      (() => {
        throw new Error('POSTGRES_DB_USERNAME is not defined');
      })(),
    password:
      process.env.POSTGRES_DB_PASSWORD ??
      (() => {
        throw new Error('POSTGRES_DB_PASSWORD is not defined');
      })(),
    database:
      process.env.POSTGRES_DB_NAME ??
      (() => {
        throw new Error('POSTGRES_DB_NAME is not defined');
      })(),
    autoLoadModels: true,
    synchronize: true, // TODO: Set false in production
    logging: false,
  }),
);
