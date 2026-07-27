import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Bật CORS cho phép Frontend gọi trực tiếp
  app.setGlobalPrefix('api');
  
  await app.listen(3002); // Chạy Auth Service ở port 3002
  console.log('Auth Microservice đang chạy tại: http://localhost:3002/api');
}
bootstrap();