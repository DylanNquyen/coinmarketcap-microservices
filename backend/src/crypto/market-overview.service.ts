import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

export interface MarketOverviewMetric {
  value: number;
  change24h: number | null;
  updatedAt: string | null;
}

export interface FearAndGreedMetric {
  value: number;
  label: string;
  updatedAt: string | null;
}

export interface GlobalMetrics {
  cryptocurrencies: number;
  exchanges: number;
  marketCap: MarketOverviewMetric;
  volume24h: MarketOverviewMetric;
  btcDominance: MarketOverviewMetric;
  ethDominance: MarketOverviewMetric;
}

export interface MarketOverviewResponse {
  globalMarketCap: MarketOverviewMetric | null;
  globalMetrics: GlobalMetrics | null;
  cmc20: MarketOverviewMetric | null;
  fearAndGreed: FearAndGreedMetric | null;
  fetchedAt: string;
  stale: boolean;
}

type ApiEnvelope = {
  data?: unknown;
  status?: { error_code?: string | number };
};

const API_BASE_URL = 'https://pro-api.coinmarketcap.com/public-api';
const CACHE_TTL_MS = 5 * 60 * 1000;

@Injectable()
export class MarketOverviewService {
  private readonly logger = new Logger(MarketOverviewService.name);
  private cachedResponse: MarketOverviewResponse | null = null;
  private cacheExpiresAt = 0;
  private refreshPromise: Promise<MarketOverviewResponse> | null = null;

  constructor(private readonly httpService: HttpService) {}

  getMarketOverview(): Promise<MarketOverviewResponse> {
    if (this.cachedResponse && Date.now() < this.cacheExpiresAt) {
      return Promise.resolve(this.cachedResponse);
    }

    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.refresh().finally(() => {
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  private async refresh(): Promise<MarketOverviewResponse> {
    const results = await Promise.allSettled([
      this.fetchGlobalMarketCap(),
      this.fetchCmc20(),
      this.fetchFearAndGreed(),
    ]);
    const previous = this.cachedResponse;
    const stale = results.some((result) => result.status === 'rejected');

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const source = ['Global Market Cap', 'CMC20', 'Fear & Greed'][index];
        this.logger.warn(
          `${source} request failed: ${this.getErrorMessage(result.reason)}`,
        );
      }
    });

    const response: MarketOverviewResponse = {
      globalMarketCap:
        results[0].status === 'fulfilled'
          ? results[0].value.marketCap
          : (previous?.globalMarketCap ?? null),
      globalMetrics:
        results[0].status === 'fulfilled'
          ? results[0].value
          : (previous?.globalMetrics ?? null),
      cmc20:
        results[1].status === 'fulfilled'
          ? results[1].value
          : (previous?.cmc20 ?? null),
      fearAndGreed:
        results[2].status === 'fulfilled'
          ? results[2].value
          : (previous?.fearAndGreed ?? null),
      fetchedAt: new Date().toISOString(),
      stale,
    };

    this.cachedResponse = response;
    this.cacheExpiresAt = Date.now() + CACHE_TTL_MS;

    return response;
  }

  private async fetchGlobalMarketCap(): Promise<GlobalMetrics> {
    const data = await this.fetchData('/v1/global-metrics/quotes/latest', {
      convert: 'USD',
    });
    const record = this.asRecord(data);
    const quote = this.asRecord(record.quote);
    const usd = this.asRecord(quote.USD);

    const updatedAt = this.optionalString(
      usd.last_updated ?? record.last_updated,
    );

    return {
      cryptocurrencies: this.requireNumber(
        record.total_cryptocurrencies ?? record.active_cryptocurrencies,
        'cryptocurrency count',
      ),
      exchanges: this.requireNumber(
        record.total_exchanges ?? record.active_exchanges,
        'exchange count',
      ),
      marketCap: {
        value: this.requireNumber(usd.total_market_cap, 'global market cap'),
        change24h: this.optionalNumber(
          usd.total_market_cap_yesterday_percentage_change,
        ),
        updatedAt,
      },
      volume24h: {
        value: this.requireNumber(usd.total_volume_24h, '24h volume'),
        change24h: this.optionalNumber(
          usd.total_volume_24h_yesterday_percentage_change,
        ),
        updatedAt,
      },
      btcDominance: {
        value: this.requireNumber(record.btc_dominance, 'BTC dominance'),
        change24h: this.optionalNumber(
          record.btc_dominance_24h_percentage_change,
        ),
        updatedAt,
      },
      ethDominance: {
        value: this.requireNumber(record.eth_dominance, 'ETH dominance'),
        change24h: this.optionalNumber(
          record.eth_dominance_24h_percentage_change,
        ),
        updatedAt,
      },
    };
  }

  private async fetchCmc20(): Promise<MarketOverviewMetric> {
    const data = await this.fetchData('/v3/index/cmc20-latest');
    const record = this.asRecord(data);

    return {
      value: this.requireNumber(record.value, 'CMC20 value'),
      change24h: this.optionalNumber(record.value_24h_percentage_change),
      updatedAt: this.optionalString(record.last_update),
    };
  }

  private async fetchFearAndGreed(): Promise<FearAndGreedMetric> {
    const data = await this.fetchData('/v3/fear-and-greed/latest');
    const record = this.asRecord(data);

    return {
      value: this.requireNumber(record.value, 'Fear & Greed value'),
      label: this.optionalString(record.value_classification) ?? 'Unknown',
      updatedAt: this.optionalString(record.update_time),
    };
  }

  private async fetchData(
    path: string,
    params?: Record<string, string>,
  ): Promise<unknown> {
    const { data } = await firstValueFrom(
      this.httpService.get<ApiEnvelope>(`${API_BASE_URL}${path}`, {
        headers: { Accept: 'application/json' },
        params,
        timeout: 10_000,
      }),
    );

    if (String(data.status?.error_code ?? 0) !== '0') {
      throw new Error('CoinMarketCap returned an API error');
    }

    return data.data;
  }

  private asRecord(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== 'object') {
      throw new Error('CoinMarketCap returned an invalid response');
    }

    return value as Record<string, unknown>;
  }

  private requireNumber(value: unknown, field: string): number {
    const parsed = this.optionalNumber(value);

    if (parsed === null) {
      throw new Error(`Missing ${field}`);
    }

    return parsed;
  }

  private optionalNumber(value: unknown): number | null {
    const parsed =
      typeof value === 'number'
        ? value
        : typeof value === 'string'
          ? Number(value)
          : Number.NaN;

    return Number.isFinite(parsed) ? parsed : null;
  }

  private optionalString(value: unknown): string | null {
    return typeof value === 'string' && value.length > 0 ? value : null;
  }

  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}
