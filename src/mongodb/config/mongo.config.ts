import { registerAs } from '@nestjs/config';

export interface MongoConfig {
  uri: string;
  // dbName: string;
  // retryAttempts: number;
  // retryDelay: number;
}

export const MONGO_CONFIG_KEY = 'mongodb';

export default registerAs(
  MONGO_CONFIG_KEY,
  (): MongoConfig => ({
    uri:
      process.env.MONGODB_URI ??
      (() => {
        throw new Error('MONGODB_URI is not defined');
      })(),
  }),
);
