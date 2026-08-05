import { httpClient } from './httpClient';

export interface WatchlistItem {
  id: number;
  userId: number;
  coinId: string;
  createdAt: string;
}

export async function fetchWatchlistApi(): Promise<WatchlistItem[]> {
  const response = await httpClient.get<WatchlistItem[]>(
    '/api/crypto/watchlist',
  );

  return response.data;
}

export async function addToWatchlistApi(
  coinId: string,
): Promise<WatchlistItem> {
  const response = await httpClient.post<WatchlistItem>(
    '/api/crypto/watchlist',
    { coinId },
  );

  return response.data;
}

export async function removeFromWatchlistApi(
  coinId: string,
): Promise<void> {
  await httpClient.delete(
    `/api/crypto/watchlist/${encodeURIComponent(coinId)}`,
  );
}