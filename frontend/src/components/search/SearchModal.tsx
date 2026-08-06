import { useEffect, useMemo, useState } from 'react';

import { useCryptoStore } from '@/store/useCryptoStore';
import {
  usePreferencesStore,
} from '@/store/usePreferencesStore';
import {
  formatCompactCurrency,
  formatCurrency,
} from '@/components/coin-table/utils/coinFormatters';

import styles from './SearchModal.module.css';

type SearchModalProps = {
  onClose: () => void;
};

export function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const coins = useCryptoStore((state) => state.coins);
  const currency = usePreferencesStore((state) => state.currency);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const searchResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return coins.slice(0, 5);
    }

    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(normalizedQuery) ||
        coin.symbol.toLowerCase().includes(normalizedQuery),
    );
  }, [coins, query]);

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Search cryptocurrencies"
      >
        <div className={styles.searchHeader}>
          <svg
            className={styles.searchIcon}
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <circle cx="8.5" cy="8.5" r="5" />
            <path d="m12.3 12.3 4 4" />
          </svg>

          <input
            className={styles.searchInput}
            type="search"
            value={query}
            autoFocus
            placeholder="Search coin, pair, contract address, exchange, or post"
            aria-label="Search coin"
            onChange={(event) => setQuery(event.target.value)}
          />

          <button
            className={styles.closeButton}
            type="button"
            aria-label="Close search"
            onClick={onClose}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="m3 3 10 10M13 3 3 13" />
            </svg>
          </button>
        </div>

        <div className={styles.divider} />

        {coins.length > 0 && (
          <div className={styles.boostedSection}>
            <h3 className={styles.sectionLabel}>Top Boosted</h3>
            <div className={styles.boostedScroller}>
              {coins.slice(0, 5).map((coin, index) => (
                <article
                  key={coin.id}
                  className={`${styles.boostedCard} ${
                    index === 0 ? styles.boostedCardActive : ''
                  }`}
                >
                  <img src={coin.image} alt="" />
                  <div>
                    <strong>{coin.symbol}</strong>
                    <span>{formatCurrency(coin.price, 6, currency)}</span>
                  </div>
                  <span className={styles.boostRank}>
                    ↗ {50 - index * 10}
                  </span>
                </article>
              ))}
            </div>
          </div>
        )}

        <div className={styles.resultsSection}>
          <h3 className={styles.sectionLabel}>
            {query.trim() ? 'Search Results' : 'Trending Crypto'}
          </h3>

          <div className={styles.resultsList}>
            {searchResults.length > 0 ? (
              searchResults.map((coin) => {
                const changePositive = coin.priceChange24h >= 0;

                return (
                  <a
                    key={coin.id}
                    className={styles.resultItem}
                    href={`#coin-${coin.id}`}
                    onClick={onClose}
                  >
                    <img
                      className={styles.coinLogo}
                      src={coin.image}
                      alt=""
                    />

                    <div className={styles.coinIdentity}>
                      <strong>
                        {coin.name}
                        <span className={styles.rankBadge}>
                          #{coin.rank}
                        </span>
                      </strong>
                      <span>{coin.symbol}</span>
                    </div>

                    <div className={styles.marketStats}>
                      <span>
                        MCap: {formatCompactCurrency(coin.marketCap, currency)}
                      </span>
                      <span>
                        Vol(24h):{' '}
                        {formatCompactCurrency(coin.volume24h, currency)}
                      </span>
                    </div>

                    <div className={styles.priceStats}>
                      <strong>{formatCurrency(coin.price, 6, currency)}</strong>
                      <span
                        className={
                          changePositive
                            ? styles.positive
                            : styles.negative
                        }
                      >
                        {changePositive ? '▲' : '▼'}{' '}
                        {Math.abs(coin.priceChange24h).toFixed(2)}%
                      </span>
                    </div>
                  </a>
                );
              })
            ) : (
              <div className={styles.emptyState}>
                No cryptocurrencies found for “{query}”
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
