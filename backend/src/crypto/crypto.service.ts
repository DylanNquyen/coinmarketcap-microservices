import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { Watchlist } from './watchlist.entity';

@Injectable()
export class CryptoService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Watchlist)
    private readonly watchlistRepository: Repository<Watchlist>,
  ) {}

  async getTopCoins() {
    try {
      // Gọi API public của CoinGecko lấy top 10 đồng coin (USD)
      const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=1h,24h,7d';
      
      const { data } = await firstValueFrom(this.httpService.get(url));
      
      // Chuẩn hóa lại cấu trúc dữ liệu trả về cho giống với giao diện CoinMarketCap của bạn
      return data.map((coin: any, index: number) => ({
        id: coin.id,
        rank: index + 1,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        image: coin.image,
        price: coin.current_price,
        priceChange1h: coin.price_change_percentage_1h_in_currency || 0,
        priceChange24h: coin.price_change_percentage_24h_in_currency || 0,
        priceChange7d: coin.price_change_percentage_7d_in_currency || 0,
        marketCap: coin.market_cap,
        volume24h: coin.total_volume,
        circulatingSupply: coin.circulating_supply,
      }));
    } catch (error: any) {
  const status = error?.response?.status;
  const message = error?.message ?? 'Unknown error';

  if (status === 429) {
    console.error(
      '⚠️ CoinGecko trả về 429: đã vượt giới hạn request. Backend sẽ dùng cache và thử lại sau.',
    );
  } else {
    console.error(
      `Lỗi khi gọi CoinGecko${status ? ` (${status})` : ''}:`,
      message,
    );
  }

  return [];
}
  }
  async addToWatchlist(userId: number, coinId: string) {
    const item = this.watchlistRepository.create({ userId, coinId });
    return await this.watchlistRepository.save(item);
  }

  // Lấy danh sách Watchlist của User
  async getUserWatchlist(userId: number) {
    return await this.watchlistRepository.find({ where: { userId } });
  }
}