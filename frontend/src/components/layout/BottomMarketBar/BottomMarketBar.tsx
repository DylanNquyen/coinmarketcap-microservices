import { useEffect, type ReactNode } from 'react';

import type { MarketOverviewMetric } from '@/api/marketOverviewApi';
import { useMarketOverviewStore } from '@/store/useMarketOverviewStore';
import {
  usePreferencesStore,
} from '@/store/usePreferencesStore';
import { formatCompactCurrency } from '@/components/coin-table/utils/coinFormatters';

import styles from './BottomMarketBar.module.css';

type MarketStatProps = {
  label: string;
  children: ReactNode;
};

const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
});

const integerFormatter = new Intl.NumberFormat('en-US');

function MarketChange({ metric }: { metric: MarketOverviewMetric }) {
  if (metric.change24h === null) {
    return null;
  }

  const positive = metric.change24h >= 0;

  return (
    <span
      className={`${styles.change} ${
        positive ? styles.positive : styles.negative
      }`}
    >
      {positive ? '▲' : '▼'} {Math.abs(metric.change24h).toFixed(2)}%
    </span>
  );
}

function MarketStat({ label, children }: MarketStatProps) {
  return (
    <div className={styles.stat}>
      <span className={styles.label}>{label}:</span>
      {children}
    </div>
  );
}

export function BottomMarketBar() {
  const currency = usePreferencesStore((state) => state.currency);
  const vi = usePreferencesStore((state) => state.language) === 'vi';
  const data = useMarketOverviewStore((state) => state.data);
  const fetchMarketOverview = useMarketOverviewStore(
    (state) => state.fetchMarketOverview,
  );

  useEffect(() => {
    if (!data) {
      void fetchMarketOverview();
    }
  }, [data, fetchMarketOverview]);

  const metrics = data?.globalMetrics;

  return (
    <aside
      className={styles.bar}
      aria-label="Global market summary"
    >
      <div className={styles.scroller}>
        <div className={styles.stats}>
          <MarketStat label={vi ? 'Tiền mã hóa' : 'Cryptos'}>
            <span className={styles.value}>
              {metrics
                ? compactNumberFormatter.format(metrics.cryptocurrencies)
                : '—'}
            </span>
          </MarketStat>

          <MarketStat label={vi ? 'Sàn giao dịch' : 'Exchanges'}>
            <span className={styles.value}>
              {metrics ? integerFormatter.format(metrics.exchanges) : '—'}
            </span>
          </MarketStat>

          <MarketStat label={vi ? 'Vốn hóa' : 'Market Cap'}>
            <span className={styles.value}>
              {metrics ? formatCompactCurrency(metrics.marketCap.value, currency) : '—'}
            </span>
            {metrics && <MarketChange metric={metrics.marketCap} />}
          </MarketStat>

          <MarketStat label={vi ? 'KL 24 giờ' : '24h Vol'}>
            <span className={styles.value}>
              {metrics ? formatCompactCurrency(metrics.volume24h.value, currency) : '—'}
            </span>
            {metrics && <MarketChange metric={metrics.volume24h} />}
          </MarketStat>

          <MarketStat label={vi ? 'Thống trị' : 'Dominance'}>
            <span className={styles.value}>
              BTC: {metrics ? metrics.btcDominance.value.toFixed(1) : '—'}%
            </span>
            <span className={styles.value}>
              ETH: {metrics ? metrics.ethDominance.value.toFixed(1) : '—'}%
            </span>
          </MarketStat>

          <MarketStat label="⛽ ETH Gas">
            <span className={styles.unavailable} title="Chưa tích hợp Gas API">
              N/A
            </span>
          </MarketStat>

          <MarketStat label={vi ? 'Sợ hãi & Tham lam' : 'Fear & Greed'}>
            <span className={styles.value}>
              {data?.fearAndGreed ? `${data.fearAndGreed.value}/100` : '—'}
            </span>
          </MarketStat>

          <MarketStat label={vi ? 'Tăng hạng 🔥' : 'Boosts 🔥'}>
            <span className={styles.unavailable} title="Chưa tích hợp Boosts API">
              N/A
            </span>
          </MarketStat>
        </div>
      </div>

      <div className={styles.actions}>
        <a href="https://coinmarketcap.com/request/" target="_blank" rel="noreferrer">
          <span>{vi ? 'Đăng ký niêm yết' : 'Get listed'}</span>
          <svg
            className={styles.actionChevron}
            viewBox="0 0 12 12"
            aria-hidden="true"
          >
            <path d="m3.25 4.75 2.75 2.75 2.75-2.75" />
          </svg>
        </a>
        <a href="https://coinmarketcap.com/api/" target="_blank" rel="noreferrer">
          API
        </a>
      </div>
    </aside>
  );
}
