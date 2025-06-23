import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RequestLog, RequestLogDocument } from './schema/request-log.schema';
import { Model } from 'mongoose';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class LoggerService {
  constructor(
    @InjectModel(RequestLog.name)
    private requestLogModel: Model<RequestLogDocument>,
  ) {}

  @OnEvent('request.post.logged')
  async handlePostRequestLogged(payload: RequestLog) {
    const createdLog = new this.requestLogModel(payload);
    await createdLog.save();
    console.log('POST request logged to MongoDB:', payload.url);
  }
}
