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
  isUp?: boolean;
}

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

  private priceUpdateSubscription?: Subscription;
  private retryLoadSubscription?: Subscription;
  private cachedCoins: CoinData[] = [];

  constructor(private readonly cryptoService: CryptoService) {}

  async afterInit(): Promise<void> {
    console.log('⚡ WebSocket Gateway đã khởi tạo thành công!');

    await this.loadInitialCoins();
    this.startRealtimePriceUpdates();

    // Nếu lần gọi đầu tiên bị 429, thử tải lại mỗi 60 giây.
    this.startRetryWhenCacheIsEmpty();
  }

  handleConnection(client: Socket): void {
    console.log(`🔌 Client kết nối WebSocket: ${client.id}`);

    // Gửi dữ liệu ngay, không bắt frontend đợi interval đầu tiên.
    if (this.cachedCoins.length > 0) {
      client.emit('price_updates', this.cachedCoins);
    }
  }

  handleDisconnect(client: Socket): void {
    console.log(`❌ Client ngắt kết nối WebSocket: ${client.id}`);
  }

  onModuleDestroy(): void {
    this.priceUpdateSubscription?.unsubscribe();
    this.retryLoadSubscription?.unsubscribe();
  }

  private async loadInitialCoins(): Promise<void> {
    const coins = await this.cryptoService.getTopCoins();

    if (coins.length > 0) {
      this.cachedCoins = coins;
      console.log(`✅ Đã cache ${coins.length} coin từ CoinGecko`);
    } else {
      console.warn(
        '⚠️ Chưa lấy được dữ liệu CoinGecko. Backend sẽ thử lại sau.',
      );
    }
  }

  private startRetryWhenCacheIsEmpty(): void {
    this.retryLoadSubscription?.unsubscribe();

    this.retryLoadSubscription = interval(60_000).subscribe(async () => {
      if (this.cachedCoins.length > 0) {
        return;
      }

      console.log('🔄 Đang thử tải lại dữ liệu CoinGecko...');
      await this.loadInitialCoins();
    });
  }

  private startRealtimePriceUpdates(): void {
    this.priceUpdateSubscription?.unsubscribe();

    this.priceUpdateSubscription = interval(3000).subscribe(() => {
      if (this.cachedCoins.length === 0) {
        return;
      }

      this.cachedCoins = this.cachedCoins.map((coin) => {
        const oldPrice = Number(coin.price);
        const oldChange24h = Number(coin.priceChange24h ?? 0);

        if (!Number.isFinite(oldPrice)) {
          return coin;
        }

        // Biến động ngẫu nhiên từ -0,5% đến +0,5%.
        const randomChangePercent = (Math.random() - 0.5) * 1;

        const newPrice =
          oldPrice * (1 + randomChangePercent / 100);

        return {
          ...coin,

          // Giữ đủ số thập phân cho các coin có giá rất nhỏ.
          price: Number(newPrice.toFixed(8)),

          priceChange24h: Number(
            (oldChange24h + randomChangePercent).toFixed(2),
          ),

          isUp: newPrice >= oldPrice,
        };
      });

      this.server.emit('price_updates', this.cachedCoins);
    });
  }
}