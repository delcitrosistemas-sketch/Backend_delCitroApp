import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AtGuard } from './common/guards';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://delcitro-app.vercel.app',
        'https://delcitro-4dtqmgo7x-delcitros-projects.vercel.app',
        'https://delcitro-app-git-main-delcitros-projects.vercel.app',
        /\.vercel\.app$/,
        process.env.FRONTEND_URL,
      ].filter(Boolean),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
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

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const reflector = new Reflector();
  app.useGlobalGuards(new AtGuard(reflector));

  const port = process.env.PORT || 3001;

  await app.listen(port, '0.0.0.0');
  console.log(`Servidor ejecutándose en puerto ${port}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap().catch((error) => {
  console.error('Error al iniciar la aplicación:', error);
  process.exit(1);
});

config(); // Esto carga las variables del .env

console.log('Cloudinary Config Check:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? '***SET***' : 'MISSING',
});
