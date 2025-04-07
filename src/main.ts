import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // Add cookie parser middleware
  app.use(cookieParser());

  // CORS configuration if needed
  app.enableCors({
    origin: true, // Or specify domains: ['http://localhost:3000', 'https://yourdomain.com']
    credentials: true, // Important for cookies to work cross-domain
  });

  await app.listen(3001);
}
bootstrap();
