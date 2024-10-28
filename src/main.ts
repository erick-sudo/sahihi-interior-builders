import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { KnownPrismaClientRequestErrorFilter } from './filters/filter.known_prisma_error';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT', { infer: true });

  app.enableCors();
  app.use(cookieParser());

  // A global resource not found exception filter
  app.useGlobalFilters(new KnownPrismaClientRequestErrorFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(port, '0.0.0.0');
}

bootstrap();
