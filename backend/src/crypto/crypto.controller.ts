import { Controller, Get } from '@nestjs/common';
import { CryptoService } from './crypto.service';

@Controller('crypto') // Đường dẫn sẽ là /api/crypto
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get() // GET /api/crypto
  async getCoins() {
    return await this.cryptoService.getTopCoins();
  }
}