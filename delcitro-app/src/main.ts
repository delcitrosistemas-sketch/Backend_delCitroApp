import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AtGuard } from './common/guards';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: 'http://localhost:3000',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    },
  });

  app.useGlobalPipes(new ValidationPipe());
  const reflector = new Reflector();
  app.useGlobalGuards(new AtGuard(reflector));
  app.use(cookieParser());
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // las imágenes estarán disponibles en http://localhost:3001/uploads/
  });
  //app.useGlobalGuards(app.get(AtGuard));
  await app.listen(3001);
}
bootstrap();
