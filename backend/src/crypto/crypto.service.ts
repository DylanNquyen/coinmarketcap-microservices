import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { Watchlist } from './watchlist.entity';

type CoinPlatformRecord = {
  id: string;
  platforms?: Record<string, string>;
};

const NETWORK_CACHE_TTL_MS = 6 * 60 * 60 * 1000;

const PLATFORM_TO_NETWORK: Record<string, string> = {
  ethereum: 'ethereum',
  'binance-smart-chain': 'bsc',
  solana: 'solana',
  base: 'base',
  'arbitrum-one': 'arbitrum',
  avalanche: 'avalanche',
  'polygon-pos': 'polygon',
  'optimistic-ethereum': 'optimism',
  sui: 'sui',
  aptos: 'aptos',
  cardano: 'cardano',
  'the-open-network': 'ton',
  'near-protocol': 'near',
};

const NATIVE_COIN_NETWORKS: Record<string, string[]> = {
  ethereum: ['ethereum'],
  binancecoin: ['bsc'],
  solana: ['solana'],
  'avalanche-2': ['avalanche'],
  'matic-network': ['polygon'],
  optimism: ['optimism'],
  arbitrum: ['arbitrum'],
  sui: ['sui'],
  aptos: ['aptos'],
  cardano: ['cardano'],
  'the-open-network': ['ton'],
  near: ['near'],
  'flare-networks': ['flare-network'],
  'ethereum-classic': ['ethereum-classic'],
};

@Injectable()
export class CryptoService {
  private coinNetworkMap = new Map<string, string[]>();
  private coinNetworkCacheExpiresAt = 0;

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Watchlist)
    private readonly watchlistRepository: Repository<Watchlist>,
  ) {}

  async getTopCoins() {
    try {
      // Gọi API public của CoinGecko lấy top 10 đồng coin (USD)
      const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=1h,24h,7d';
      
      // Query chống cache ở HTTP client không giúp vượt cache của CoinGecko, nhưng có thể tránh cache trung gian
      const { data } = await firstValueFrom(
  this.httpService.get(url, {
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
    },
    params: {
      _: Date.now(),
    },
    timeout: 15_000,
  }),
);
      const coinNetworkMap = await this.getCoinNetworkMap();
      
      // Chuẩn hóa lại cấu trúc dữ liệu trả về
      return data.map((coin: any, index: number) => ({
  id: coin.id,
  rank: coin.market_cap_rank ?? index + 1,
  name: coin.name,
  symbol: coin.symbol.toUpperCase(),
  image: coin.image,

  price: coin.current_price ?? 0,

  priceChange1h:
    coin.price_change_percentage_1h_in_currency ?? 0,

  priceChange24h:
    coin.price_change_percentage_24h_in_currency ?? 0,

  priceChange7d:
    coin.price_change_percentage_7d_in_currency ?? 0,

  marketCap: coin.market_cap ?? 0,
  volume24h: coin.total_volume ?? 0,
  circulatingSupply: coin.circulating_supply ?? 0,

  sparkline7d: Array.isArray(coin.sparkline_in_7d?.price)
    ? coin.sparkline_in_7d.price
    : [],

  lastUpdated: coin.last_updated ?? null,
  networks: coinNetworkMap.get(coin.id) ?? NATIVE_COIN_NETWORKS[coin.id] ?? [],
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

  private async getCoinNetworkMap(): Promise<Map<string, string[]>> {
    if (Date.now() < this.coinNetworkCacheExpiresAt) {
      return this.coinNetworkMap;
    }

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<CoinPlatformRecord[]>(
          'https://api.coingecko.com/api/v3/coins/list',
          {
            params: { include_platform: true },
            headers: { Accept: 'application/json' },
            timeout: 15_000,
          },
        ),
      );

      const nextMap = new Map<string, string[]>();

      for (const coin of data) {
        const networks = new Set(NATIVE_COIN_NETWORKS[coin.id] ?? []);

        for (const platform of Object.keys(coin.platforms ?? {})) {
          const network = PLATFORM_TO_NETWORK[platform];
          if (network) {
            networks.add(network);
          }
        }

        if (networks.size > 0) {
          nextMap.set(coin.id, [...networks]);
        }
      }

      this.coinNetworkMap = nextMap;
      this.coinNetworkCacheExpiresAt = Date.now() + NETWORK_CACHE_TTL_MS;
    } catch (error) {
      console.warn(
        'Không thể cập nhật dữ liệu network từ CoinGecko:',
        error instanceof Error ? error.message : error,
      );
      this.coinNetworkCacheExpiresAt = Date.now() + 5 * 60 * 1000;
    }

    return this.coinNetworkMap;
  }

  async addToWatchlist(
  userId: number,
  coinId: string,
): Promise<Watchlist> {
  const normalizedCoinId = coinId.trim().toLowerCase();

  const existingItem = await this.watchlistRepository.findOne({
    where: {
      userId,
      coinId: normalizedCoinId,
    },
  });

  if (existingItem) {
    throw new ConflictException(
      'Coin đã tồn tại trong Watchlist.',
    );
  }

  const item = this.watchlistRepository.create({
    userId,
    coinId: normalizedCoinId,
  });

  return this.watchlistRepository.save(item);
}


// Lấy danh sách Watchlist của User
async getUserWatchlist(
  userId: number,
): Promise<Watchlist[]> {
  return this.watchlistRepository.find({
    where: { userId },
    order: {
      createdAt: 'DESC',
    },
  });
}

// Xóa coin khỏi Watchlist của User
async removeFromWatchlist(
  userId: number,
  coinId: string,
): Promise<{ removed: true; coinId: string }> {
  const normalizedCoinId = coinId.trim().toLowerCase();

  const result = await this.watchlistRepository.delete({
    userId,
    coinId: normalizedCoinId,
  });

  if (!result.affected) {
    throw new NotFoundException(
      'Coin không tồn tại trong Watchlist.',
    );
  }

  return {
    removed: true,
    coinId: normalizedCoinId,
  };
}

}


