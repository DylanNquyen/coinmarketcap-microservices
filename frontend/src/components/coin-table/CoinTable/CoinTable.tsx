import { useEffect } from 'react';

import { MiniSparkline } from '@/components/market-overview/MiniSparkline';
import { PageContainer } from '@/components/layout/PageContainer';
import { useAuthStore } from '@/store/useAuthStore';
import { useCryptoStore, type Coin } from '@/store/useCryptoStore';

import { PercentageCell } from '../PercentageCell';
import { PriceCell } from '../PriceCell';
import {
  formatCompactCurrency,
  formatSupply,
} from '../utils/coinFormatters';

import styles from './CoinTable.module.css';

const TABLE_COLUMN_COUNT = 11;

function CoinIdentityCell({ coin }: { coin: Coin }) {
  return (
    <div className={styles.coinIdentity}>
      <img
        className={styles.coinLogo}
        src={coin.image}
        alt=""
        width={24}
        height={24}
        loading="lazy"
      />

      <div className={styles.coinNames}>
        <span className={styles.coinName}>{coin.name}</span>
        <span className={styles.coinSymbol}>
          {coin.symbol.toUpperCase()}
        </span>
      </div>

      <button
        className={styles.buyButton}
        type="button"
        aria-label={`Buy ${coin.name}`}
      >
        Buy
      </button>
    </div>
  );
}

type CoinTableProps = {
  coins?: Coin[];
};

export function CoinTable({ coins: providedCoins }: CoinTableProps) {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const storeCoins = useCryptoStore((state) => state.coins);
  const displayedCoins = providedCoins ?? storeCoins;
  const loading = useCryptoStore((state) => state.loading);

  const watchlistCoinIds = useCryptoStore(
    (state) => state.watchlistCoinIds,
  );
  const pendingWatchlistCoinIds = useCryptoStore(
    (state) => state.pendingWatchlistCoinIds,
  );
  const fetchWatchlist = useCryptoStore(
    (state) => state.fetchWatchlist,
  );
  const toggleWatchlist = useCryptoStore(
    (state) => state.toggleWatchlist,
  );
  const clearWatchlistState = useCryptoStore(
    (state) => state.clearWatchlistState,
  );


  useEffect(() => {
    if (isAuthenticated) {
      void fetchWatchlist();
      return;
    }

    clearWatchlistState();
  }, [
    clearWatchlistState,
    fetchWatchlist,
    isAuthenticated,
  ]);

  return (
    <section
      className={styles.section}
      aria-labelledby="coin-table-heading"
    >
      <PageContainer>
        <h2 id="coin-table-heading" className={styles.srOnly}>
          Cryptocurrency market table
        </h2>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th
                  className={`${styles.headerCell} ${styles.watchlistColumn}`}
                  scope="col"
                  aria-label="Watchlist"
                />

                <th
                  className={`${styles.headerCell} ${styles.rankColumn}`}
                  scope="col"
                >
                  #
                </th>

                <th
                  className={`${styles.headerCell} ${styles.nameColumn}`}
                  scope="col"
                >
                  Name
                </th>

                <th
                  className={`${styles.headerCell} ${styles.priceColumn}`}
                  scope="col"
                >
                  Price
                </th>

                <th
                  className={`${styles.headerCell} ${styles.percentageColumn}`}
                  scope="col"
                >
                  1h %
                </th>

                <th
                  className={`${styles.headerCell} ${styles.percentageColumn}`}
                  scope="col"
                >
                  24h %
                </th>

                <th
                  className={`${styles.headerCell} ${styles.percentageColumn}`}
                  scope="col"
                >
                  7d %
                </th>

                <th
                  className={`${styles.headerCell} ${styles.marketCapColumn}`}
                  scope="col"
                >
                  Market Cap
                </th>

                <th
                  className={`${styles.headerCell} ${styles.volumeColumn}`}
                  scope="col"
                >
                  Volume (24h)
                </th>

                <th
                  className={`${styles.headerCell} ${styles.supplyColumn}`}
                  scope="col"
                >
                  Circulating Supply
                </th>

                <th
                  className={`${styles.headerCell} ${styles.sparklineColumn}`}
                  scope="col"
                >
                  Last 7 Days
                </th>
              </tr>
            </thead>

            <tbody>
              {loading && displayedCoins.length === 0 ? (
                <CoinTableLoadingRows />
              ) : (
                displayedCoins.map((coin) => {
                  const isWatchlisted =
                    watchlistCoinIds.has(coin.id);
                  const isPending =
                    pendingWatchlistCoinIds.has(coin.id);

                  return (
                    <tr key={coin.id} className={styles.tableRow}>
                      <td
                        className={`${styles.cell} ${styles.watchlistColumn}`}
                      >
                        <button
                          type="button"
                          className={[
                            styles.watchlistButton,
                            isWatchlisted
                              ? styles.watchlistButtonActive
                              : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          disabled={isPending}
                          aria-pressed={isWatchlisted}
                          aria-label={
                            isWatchlisted
                              ? `Remove ${coin.name} from watchlist`
                              : `Add ${coin.name} to watchlist`
                          }
                          title={
                            isAuthenticated
                              ? isWatchlisted
                                ? 'Xóa khỏi Watchlist'
                                : 'Thêm vào Watchlist'
                              : 'Đăng nhập để sử dụng Watchlist'
                          }
                          onClick={() => {
                            if (!isAuthenticated) {
                              window.alert(
                                'Bạn cần đăng nhập để sử dụng Watchlist.',
                              );
                              return;
                            }

                            void toggleWatchlist(coin.id);
                          }}
                        >
                          {isPending
                            ? '…'
                            : isWatchlisted
                              ? '★'
                              : '☆'}
                        </button>
                      </td>

                      <td
                        className={`${styles.cell} ${styles.rankColumn}`}
                      >
                        {coin.rank}
                      </td>

                      <td
                        className={`${styles.cell} ${styles.nameColumn}`}
                      >
                        <CoinIdentityCell coin={coin} />
                      </td>

                      <td
                        className={`${styles.cell} ${styles.priceColumn}`}
                      >
                        <PriceCell
                          price={coin.price}
                          isUp={coin.isUp}
                        />
                      </td>

                      <td
                        className={`${styles.cell} ${styles.percentageColumn}`}
                      >
                        <PercentageCell value={coin.priceChange1h} />
                      </td>

                      <td
                        className={`${styles.cell} ${styles.percentageColumn}`}
                      >
                        <PercentageCell value={coin.priceChange24h} />
                      </td>

                      <td
                        className={`${styles.cell} ${styles.percentageColumn}`}
                      >
                        <PercentageCell value={coin.priceChange7d} />
                      </td>

                      <td
                        className={`${styles.cell} ${styles.marketCapColumn}`}
                      >
                        {formatCompactCurrency(coin.marketCap)}
                      </td>

                      <td
                        className={`${styles.cell} ${styles.volumeColumn}`}
                      >
                        {formatCompactCurrency(coin.volume24h)}
                      </td>

                      <td
                        className={`${styles.cell} ${styles.supplyColumn}`}
                      >
                        {formatSupply(
                          coin.circulatingSupply,
                          coin.symbol,
                        )}
                      </td>

                      <td
                        className={`${styles.cell} ${styles.sparklineColumn}`}
                      >
                        {coin.sparkline7d.length > 1 ? (
                          <div
                            className={[
                              styles.sparkline,
                              coin.priceChange7d >= 0
                                ? styles.sparklinePositive
                                : styles.sparklineNegative,
                            ].join(' ')}
                          >
                            <MiniSparkline
                              data={coin.sparkline7d}
                              tone={
                                coin.priceChange7d >= 0
                                  ? 'positive'
                                  : 'negative'
                              }
                              width={160}
                              height={42}
                            />
                          </div>
                        ) : (
                          <span className={styles.sparklineEmpty}>
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}

              {!loading && displayedCoins.length === 0 && (
                <tr>
                  <td
                    className={styles.emptyCell}
                    colSpan={TABLE_COLUMN_COUNT}
                  >
                    Không có dữ liệu coin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </PageContainer>
    </section>
  );
}

function CoinTableLoadingRows() {
  return (
    <>
      {Array.from({ length: 8 }, (_, rowIndex) => (
        <tr
          key={`coin-table-skeleton-${rowIndex}`}
          className={styles.tableRow}
        >
          {Array.from(
            { length: TABLE_COLUMN_COUNT },
            (_, cellIndex) => (
              <td key={cellIndex} className={styles.cell}>
                <span className={styles.skeleton} />
              </td>
            ),
          )}
        </tr>
      ))}
    </>
  );
}