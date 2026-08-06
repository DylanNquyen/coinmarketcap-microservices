import { httpClient } from './httpClient';

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

export interface MarketOverviewData {
  globalMarketCap: MarketOverviewMetric | null;
  globalMetrics: GlobalMetrics | null;
  cmc20: MarketOverviewMetric | null;
  fearAndGreed: FearAndGreedMetric | null;
  fetchedAt: string;
  stale: boolean;
}

export async function fetchMarketOverviewApi() {
  const response = await httpClient.get<MarketOverviewData>(
    '/api/crypto/market-overview',
  );

  return response.data;
}
