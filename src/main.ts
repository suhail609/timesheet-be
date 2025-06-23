import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoggingInterceptor } from 'interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3030'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
    // maxAge: 86400,
  });

  const eventEmitter = app.get(EventEmitter2);
  app.useGlobalInterceptors(new LoggingInterceptor(eventEmitter));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(morgan('combined', { immediate: true }));
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
