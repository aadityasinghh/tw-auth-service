import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from './core/common/filters/http-exception.filter';
import { ResponseInterceptor } from './core/common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

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
