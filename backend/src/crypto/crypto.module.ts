import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.service';
import { CryptoGateway } from './crypto.gateway';
import { Watchlist } from './watchlist.entity';
import { MarketOverviewService } from './market-overview.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Watchlist])],
  controllers: [CryptoController],
  providers: [CryptoService, CryptoGateway, MarketOverviewService],
  exports: [CryptoService],
})
export class CryptoModule {}
