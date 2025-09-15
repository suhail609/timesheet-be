import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RequestLog } from '../src/logger/schema/request-log.schema';
// import { RequestLog } from 'src/logger/schema/request-log.schema';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private eventEmitter: EventEmitter2) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl, headers, ip, body } = request;
    const now = Date.now();

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      //TODO: remove authentication request password
      return next.handle().pipe(
        tap((data) => {
          const response = context.switchToHttp().getResponse();
          const statusCode = response.statusCode;
          const duration = Date.now() - now;

          const logPayload: RequestLog = {
            method,
            url: originalUrl,
            body,
            headers,
            ip,
            userAgent: headers['user-agent'],
            statusCode,
            duration,
          };

          this.eventEmitter.emit('request.post.logged', logPayload);
        }),
      );
    }

    return next.handle(); // Continue for other request types
  }
}
