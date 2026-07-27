import { Controller, Get, Post, Body, Query, UseGuards, Req} from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get()
  async getCoins() {
    return await this.cryptoService.getTopCoins();
  }

  // BẢO VỆ API WATCHLIST BẰNG JWT GUARD
  @UseGuards(JwtAuthGuard)
  @Post('watchlist')
  async addToWatchlist(@Req() req: any, @Body() body: { coinId: string }) {
    // req.user được gán tự động từ JwtAuthGuard sau khi verify thành công từ auth-ms
    const userId = req.user.sub; 
    return await this.cryptoService.addToWatchlist(userId, body.coinId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('watchlist')
  async getWatchlist(@Req() req: any) {
    const userId = req.user.sub;
    return await this.cryptoService.getUserWatchlist(userId);
  }
}