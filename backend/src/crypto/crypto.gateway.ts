import { OnModuleDestroy } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { interval, Subscription } from 'rxjs';
import { Server, Socket } from 'socket.io';

import { CryptoService } from './crypto.service';

interface CoinData {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  image: string;
  price: number;
  priceChange1h: number;
  priceChange24h: number;
  priceChange7d: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  sparkline7d: number[];
  lastUpdated: string | null;
  networks: string[];
  isUp?: boolean;
}

const DEFAULT_REFRESH_INTERVAL_MS = 180_000;

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CryptoGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleDestroy
{
  @WebSocketServer()
  server!: Server;

  private refreshSubscription?: Subscription;
  private cachedCoins: CoinData[] = [];
  private isRefreshing = false;

  private readonly refreshIntervalMs =
    Number(process.env.COIN_REFRESH_INTERVAL_MS) || DEFAULT_REFRESH_INTERVAL_MS;

  constructor(private readonly cryptoService: CryptoService) {}

  async afterInit(): Promise<void> {
    console.log('⚡ Crypto WebSocket Gateway initialized');

    await this.refreshMarketData();
    this.startMarketRefresh();
  }

  handleConnection(client: Socket): void {
    console.log(`🔌 WebSocket connected: ${client.id}`);

    // Client mới nhận ngay snapshot gần nhất.
    if (this.cachedCoins.length > 0) {
      client.emit('price_updates', this.cachedCoins);
    }
  }

  handleDisconnect(client: Socket): void {
    console.log(`❌ WebSocket disconnected: ${client.id}`);
  }

  onModuleDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  private startMarketRefresh(): void {
    this.refreshSubscription?.unsubscribe();

    this.refreshSubscription = interval(this.refreshIntervalMs).subscribe(
      () => {
        void this.refreshMarketData();
      },
    );

    console.log(`🔄 CoinGecko refresh interval: ${this.refreshIntervalMs}ms`);
  }

  private async refreshMarketData(): Promise<void> {
    // Tránh request chồng nhau nếu API phản hồi chậm.
    if (this.isRefreshing) {
      return;
    }

    this.isRefreshing = true;

    try {
      const freshCoins = (await this.cryptoService.getTopCoins()) as CoinData[];

      // Khi CoinGecko lỗi hoặc rate-limit, giữ cache cũ.
      if (!Array.isArray(freshCoins) || freshCoins.length === 0) {
        console.warn(
          '⚠️ Không nhận được dữ liệu mới. Tiếp tục sử dụng cache hiện tại.',
        );
        return;
      }

      const previousCoinsById = new Map(
        this.cachedCoins.map((coin) => [coin.id, coin]),
      );

      this.cachedCoins = freshCoins.map((coin) => {
        const previousCoin = previousCoinsById.get(coin.id);

        return {
          ...coin,
          isUp: previousCoin ? coin.price >= previousCoin.price : undefined,
        };
      });

      const bitcoin = freshCoins.find((coin) => coin.id === 'bitcoin');

      if (bitcoin) {
        console.log('BTC snapshot:', {
          price: bitcoin.price,
          priceChange1h: bitcoin.priceChange1h,
          priceChange24h: bitcoin.priceChange24h,
          priceChange7d: bitcoin.priceChange7d,
          lastUpdated: bitcoin.lastUpdated,
          fetchedAt: new Date().toISOString(),
        });
      }

      this.server.emit('price_updates', this.cachedCoins);

      console.log(
        `✅ Updated and emitted ${this.cachedCoins.length} real market records`,
      );
    } catch (error) {
      console.error(
        '❌ Không thể refresh dữ liệu thị trường:',
        error instanceof Error ? error.message : error,
      );
    } finally {
      this.isRefreshing = false;
    }
  }
}
