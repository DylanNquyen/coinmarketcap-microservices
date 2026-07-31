import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Bật CORS cho phép Frontend kết nối
  app.enableCors({
    origin: 'http://localhost:5173', // Trong môi trường dev có thể để '*' hoặc điền chính xác URL của Frontend React
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // 2. Cấu hình tiền tố URL (Tùy chọn nhưng nên làm, ví dụ: http://localhost:3001/api/...)
  app.setGlobalPrefix('api');

  // 3. Đổi cổng (port) chạy Backend sang 3001 để tránh trùng cổng 3000 của React
  await app.listen(3001);
  console.log('Backend Monolith đang chạy tại: http://localhost:3001/api');
}
bootstrap();