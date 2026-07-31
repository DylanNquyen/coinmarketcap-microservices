import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CryptoModule } from './crypto/crypto.module';
import { Watchlist } from './crypto/watchlist.entity';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307, // Chú ý: Cổng 3307 của crypto-db trong Docker!
      username: 'root',
      password: 'rootpassword',
      database: 'crypto_db',
      entities: [Watchlist],
      synchronize: true,
    }),
    CryptoModule,
    AiModule,
  ],
})
export class AppModule {}