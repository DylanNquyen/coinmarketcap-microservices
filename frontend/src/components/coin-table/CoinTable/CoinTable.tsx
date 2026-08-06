import { useEffect, useMemo } from 'react';

import { MiniSparkline } from '@/components/market-overview/MiniSparkline';
import { PageContainer } from '@/components/layout/PageContainer';
import { useAuthStore } from '@/store/useAuthStore';
import { useCryptoStore, type Coin } from '@/store/useCryptoStore';
import {
  useTableColumnsStore,
  type OptionalCoinColumn,
} from '@/store/useTableColumnsStore';
import { useTableFiltersStore } from '@/store/useTableFiltersStore';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { useNetworkFilterStore } from '@/store/useNetworkFilterStore';

import { PercentageCell } from '../PercentageCell';
import { PriceCell } from '../PriceCell';
import {
  formatCompactCurrency,
  formatSupply,
} from '../utils/coinFormatters';

import styles from './CoinTable.module.css';

const FIXED_COLUMN_COUNT = 4;

const optionalColumnWidths: Record<OptionalCoinColumn, number> = {
  priceChange1h: 100,
  priceChange24h: 100,
  priceChange7d: 100,
  marketCap: 160,
  volume24h: 160,
  circulatingSupply: 190,
  sparkline7d: 180,
};

function CoinIdentityCell({ coin }: { coin: Coin }) {
  const language = usePreferencesStore((state) => state.language);
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
        {language === 'vi' ? 'Mua' : 'Buy'}
      </button>
    </div>
  );
}

type CoinTableProps = {
  coins?: Coin[];
};

export function CoinTable({ coins: providedCoins }: CoinTableProps) {
  const currency = usePreferencesStore((state) => state.currency);
  const language = usePreferencesStore((state) => state.language);
  const vi = language === 'vi';
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const storeCoins = useCryptoStore((state) => state.coins);
  const displayedCoins = providedCoins ?? storeCoins;
  const loading = useCryptoStore((state) => state.loading);
  const filters = useTableFiltersStore((state) => state.filters);
  const activeNetwork = useNetworkFilterStore(
    (state) => state.activeNetwork,
  );
  const filteredCoins = useMemo(
    () =>
      displayedCoins
        .filter((coin) => {
          if (
            activeNetwork !== 'all' &&
            !coin.networks?.includes(activeNetwork)
          ) {
            return false;
          }

          if (
            filters.marketCapMin !== null &&
            coin.marketCap < filters.marketCapMin
          ) {
            return false;
          }

          if (
            filters.marketCapMax !== null &&
            coin.marketCap > filters.marketCapMax
          ) {
            return false;
          }

          if (
            filters.priceChange24hMin !== null &&
            coin.priceChange24h < filters.priceChange24hMin
          ) {
            return false;
          }

          if (
            filters.priceChange24hMax !== null &&
            coin.priceChange24h > filters.priceChange24hMax
          ) {
            return false;
          }

          if (
            filters.volume24hMin !== null &&
            coin.volume24h < filters.volume24hMin
          ) {
            return false;
          }

          if (
            filters.volume24hMax !== null &&
            coin.volume24h > filters.volume24hMax
          ) {
            return false;
          }

          return true;
        })
        .slice(0, filters.visibleLimit),
    [activeNetwork, displayedCoins, filters],
  );
  const visibleColumns = useTableColumnsStore(
    (state) => state.visibleColumns,
  );
  const isColumnVisible = (column: OptionalCoinColumn) =>
    visibleColumns.includes(column);
  const tableColumnCount =
    FIXED_COLUMN_COUNT + visibleColumns.length;
  const tableMinWidth =
    536 +
    visibleColumns.reduce(
      (total, column) => total + optionalColumnWidths[column],
      0,
    );

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
          {vi ? 'Bảng thị trường tiền mã hóa' : 'Cryptocurrency market table'}
        </h2>

        <div className={styles.tableContainer}>
          <table
            className={styles.table}
            style={{ minWidth: `${tableMinWidth}px` }}
          >
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
                  {vi ? 'Tên' : 'Name'}
                </th>

                <th
                  className={`${styles.headerCell} ${styles.priceColumn}`}
                  scope="col"
                >
                  {vi ? 'Giá' : 'Price'}
                </th>

                {isColumnVisible('priceChange1h') && (
                  <th
                    className={`${styles.headerCell} ${styles.percentageColumn}`}
                    scope="col"
                  >
                    1h %
                  </th>
                )}

                {isColumnVisible('priceChange24h') && (
                  <th
                    className={`${styles.headerCell} ${styles.percentageColumn}`}
                    scope="col"
                  >
                    24h %
                  </th>
                )}

                {isColumnVisible('priceChange7d') && (
                  <th
                    className={`${styles.headerCell} ${styles.percentageColumn}`}
                    scope="col"
                  >
                    7d %
                  </th>
                )}

                {isColumnVisible('marketCap') && (
                  <th
                    className={`${styles.headerCell} ${styles.marketCapColumn}`}
                    scope="col"
                  >
                    {vi ? 'Vốn hóa thị trường' : 'Market Cap'}
                  </th>
                )}

                {isColumnVisible('volume24h') && (
                  <th
                    className={`${styles.headerCell} ${styles.volumeColumn}`}
                    scope="col"
                  >
                    {vi ? 'Khối lượng (24 giờ)' : 'Volume (24h)'}
                  </th>
                )}

                {isColumnVisible('circulatingSupply') && (
                  <th
                    className={`${styles.headerCell} ${styles.supplyColumn}`}
                    scope="col"
                  >
                    {vi ? 'Cung lưu hành' : 'Circulating Supply'}
                  </th>
                )}

                {isColumnVisible('sparkline7d') && (
                  <th
                    className={`${styles.headerCell} ${styles.sparklineColumn}`}
                    scope="col"
                  >
                    {vi ? 'Giá 7 ngày %' : '7d Price%'}
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {loading && filteredCoins.length === 0 ? (
                <CoinTableLoadingRows
                  columnCount={tableColumnCount}
                />
              ) : (
                filteredCoins.map((coin) => {
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

                      {isColumnVisible('priceChange1h') && (
                        <td
                          className={`${styles.cell} ${styles.percentageColumn}`}
                        >
                          <PercentageCell value={coin.priceChange1h} />
                        </td>
                      )}

                      {isColumnVisible('priceChange24h') && (
                        <td
                          className={`${styles.cell} ${styles.percentageColumn}`}
                        >
                          <PercentageCell value={coin.priceChange24h} />
                        </td>
                      )}

                      {isColumnVisible('priceChange7d') && (
                        <td
                          className={`${styles.cell} ${styles.percentageColumn}`}
                        >
                          <PercentageCell value={coin.priceChange7d} />
                        </td>
                      )}

                      {isColumnVisible('marketCap') && (
                        <td
                          className={`${styles.cell} ${styles.marketCapColumn}`}
                        >
                          {formatCompactCurrency(coin.marketCap, currency)}
                        </td>
                      )}

                      {isColumnVisible('volume24h') && (
                        <td
                          className={`${styles.cell} ${styles.volumeColumn}`}
                        >
                          {formatCompactCurrency(coin.volume24h, currency)}
                        </td>
                      )}

                      {isColumnVisible('circulatingSupply') && (
                        <td
                          className={`${styles.cell} ${styles.supplyColumn}`}
                        >
                          {formatSupply(
                            coin.circulatingSupply,
                            coin.symbol,
                          )}
                        </td>
                      )}

                      {isColumnVisible('sparkline7d') && (
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
                      )}
                    </tr>
                  );
                })
              )}

              {!loading && filteredCoins.length === 0 && (
                <tr>
                  <td
                    className={styles.emptyCell}
                    colSpan={tableColumnCount}
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

function CoinTableLoadingRows({
  columnCount,
}: {
  columnCount: number;
}) {
  return (
    <>
      {Array.from({ length: 8 }, (_, rowIndex) => (
        <tr
          key={`coin-table-skeleton-${rowIndex}`}
          className={styles.tableRow}
        >
          {Array.from(
            { length: columnCount },
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
