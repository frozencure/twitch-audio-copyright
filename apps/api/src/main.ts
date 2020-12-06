/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ServeStaticExceptionFilter } from './app/http-exception.filter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
    optionsSuccessStatus: 204
  });
  app.use(cookieParser());
  const port = process.env.PORT || 3333;
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useStaticAssets(path.join(process.cwd(), 'apps/api/src/assets/public'));

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
