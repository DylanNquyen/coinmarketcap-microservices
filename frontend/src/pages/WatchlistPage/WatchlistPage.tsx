import { useEffect, useMemo } from 'react';

import { CoinTable } from '@/components/coin-table/CoinTable';
import { MarketOverview } from '@/components/market-overview/MarketOverview';
import { useAuthStore } from '@/store/useAuthStore';
import { useCryptoStore } from '@/store/useCryptoStore';

import styles from './WatchlistPage.module.css';

export function WatchlistPage() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const coins = useCryptoStore((state) => state.coins);

  const watchlistCoinIds = useCryptoStore(
    (state) => state.watchlistCoinIds,
  );

  const fetchWatchlist = useCryptoStore(
    (state) => state.fetchWatchlist,
  );

  useEffect(() => {
    if (isAuthenticated) {
      void fetchWatchlist();
    }
  }, [fetchWatchlist, isAuthenticated]);

  const watchlistCoins = useMemo(
    () =>
      coins.filter((coin) =>
        watchlistCoinIds.has(coin.id),
      ),
    [coins, watchlistCoinIds],
  );

  return (
    <>
      <MarketOverview />

      {!isAuthenticated ? (
        <section className={styles.emptyState}>
          <h2>Log in to view your Watchlist</h2>

          <p>
            Sign in to save and manage your favourite
            cryptocurrencies.
          </p>
        </section>
      ) : watchlistCoins.length === 0 ? (
        <section className={styles.emptyState}>
          <h2>Your Watchlist is empty</h2>

          <p>
            Add coins by clicking the star icon in the market
            table.
          </p>
        </section>
      ) : (
        <CoinTable coins={watchlistCoins} />
      )}
    </>
  );
}