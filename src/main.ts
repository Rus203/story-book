import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);

  const publicFolder = configService.get<string>('PUBLIC_FOLDER');
  app.useStaticAssets(path.join(__dirname, '..', publicFolder), {
    index: false,
    prefix: `/${publicFolder}`,
  });

  await app.listen(configService.get('PORT'));
}

bootstrap();
