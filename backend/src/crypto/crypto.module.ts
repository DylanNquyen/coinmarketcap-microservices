import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.service';
import { CryptoGateway } from './crypto.gateway';
import { Watchlist } from './watchlist.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Watchlist])],
  controllers: [CryptoController],
  providers: [CryptoService, CryptoGateway],
})
export class CryptoModule {}