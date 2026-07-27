import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306, // Cổng của auth-db
      username: 'root',
      password: 'rootpassword', // Mật khẩu đặt trong docker-compose.yml
      database: 'auth_db',
      entities: [User],
      synchronize: true, // Tự động tạo bảng DB trong môi trường dev
    }),
    AuthModule,
  ],
})
export class AppModule {}