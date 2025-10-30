import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AtGuard } from './common/guards';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://192.168.137.103:3000',
        'http://localhost:3001',
        'http://192.168.137.103:3001',
        'https://delcitro-app.vercel.app/',
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'X-Debug',
      ],
      credentials: true,
      optionsSuccessStatus: 200,
    },
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  const reflector = new Reflector();
  app.useGlobalGuards(new AtGuard(reflector));
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Servidor ejecutándose en puerto ${port}`);
}
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}

// Export para producción (Vercel)
export default bootstrap;
