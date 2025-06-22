import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, STATES } from 'mongoose';

@Injectable()
export class MongoDB implements OnApplicationBootstrap {
  private readonly logger = new Logger(MongoDB.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  onApplicationBootstrap() {
    //TODO: event listeners not working and Logger is not logging
    if (this.connection.readyState === STATES.connected)
      console.info(`Connected to MongoDB database: ${this.connection.name}`);

    this.connection.once('open', () => {
      console.info('MongoDB.onApplicationBootstrap() - connection.once');
      this.logger.log(`MongoDB connected: ${this.connection.name}`);
    });

    this.connection.on('connected', () => {
      console.info('Successfully connected to the database');
    });

    this.connection.on('error', (err) => {
      this.logger.error(`MongoDB connection error: ${err}`);
      process.exit(1);
    });
  }
}
