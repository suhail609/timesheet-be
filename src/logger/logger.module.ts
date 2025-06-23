import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestLog, RequestLogSchema } from './schema/request-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RequestLog.name,
        schema: RequestLogSchema,
      },
    ]),
  ],
  providers: [LoggerService],
})
export class LoggerModule {}
