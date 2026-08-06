import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CryptoService } from './crypto.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { MarketOverviewService } from './market-overview.service';

type AuthenticatedRequest = {
  user: {
    sub: number;
  };
};

@Controller('crypto')
export class CryptoController {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly marketOverviewService: MarketOverviewService,
  ) {}

  @Get()
  getCoins() {
    return this.cryptoService.getTopCoins();
  }

  @Get('market-overview')
  getMarketOverview() {
    return this.marketOverviewService.getMarketOverview();
  }

  @UseGuards(JwtAuthGuard)
  @Post('watchlist')
  addToWatchlist(
    @Req() request: AuthenticatedRequest,
    @Body() body: { coinId: string },
  ) {
    return this.cryptoService.addToWatchlist(request.user.sub, body.coinId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('watchlist')
  getWatchlist(@Req() request: AuthenticatedRequest) {
    return this.cryptoService.getUserWatchlist(request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('watchlist/:coinId')
  removeFromWatchlist(
    @Req() request: AuthenticatedRequest,
    @Param('coinId') coinId: string,
  ) {
    return this.cryptoService.removeFromWatchlist(request.user.sub, coinId);
  }
}
