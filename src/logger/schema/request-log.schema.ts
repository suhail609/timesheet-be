import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RequestLogDocument = RequestLog & Document;

@Schema({ timestamps: true })
export class RequestLog {
  @Prop()
  method: string;

  @Prop()
  url: string;

  @Prop({ type: Object })
  body: Record<string, any>;

  @Prop({ type: Object })
  headers: Record<string, any>;

  @Prop()
  ip: string;

  @Prop()
  userAgent: string;

  @Prop()
  statusCode: number;

  @Prop()
  duration: number;
}

export const RequestLogSchema = SchemaFactory.createForClass(RequestLog);
