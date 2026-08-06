import { useEffect } from 'react';

import { PageContainer } from '@/components/layout/PageContainer';
import { AdvertisementCard } from '@/components/market-overview/AdvertisementCard';
import { FearGreedGauge } from '@/components/market-overview/FearGreedGauge';
import { MarketStatCard } from '@/components/market-overview/MarketStatCard';
import { MiniSparkline } from '@/components/market-overview/MiniSparkline';
import { NetworkFilter } from '@/components/market-overview/NetworkFilter';
import { TrendingTopics } from '@/components/market-overview/TrendingTopics';
import { useMarketOverviewStore } from '@/store/useMarketOverviewStore';
import {
  USD_TO_VND_RATE,
  usePreferencesStore,
} from '@/store/usePreferencesStore';
import { formatCompactCurrency } from '@/components/coin-table/utils/coinFormatters';

import styles from './MarketOverview.module.css';

const marketCapData = [
  95, 70, 32, 52, 45, 48, 49, 47, 46, 48, 47, 48, 47, 47,
];

const cmc20Data = [
  98, 61, 30, 55, 48, 49, 47, 48, 47, 48, 48, 49, 48, 48,
];

const liquidationData = [
  24, 52, 30, 65, 42, 71, 36, 62, 33, 74, 48, 67, 39, 60,
];

function formatUsd(value: number, currency: 'USD' | 'VND') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'VND' ? 0 : 2,
    maximumFractionDigits: currency === 'VND' ? 0 : 2,
  }).format(currency === 'VND' ? value * USD_TO_VND_RATE : value);
}

function getChangePresentation(change: number) {
  return {
    text: `${change >= 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(2)}%`,
    tone: change >= 0 ? 'positive' : 'negative',
  } as const;
}

export function MarketOverview() {
  const currency = usePreferencesStore((state) => state.currency);
  const language = usePreferencesStore((state) => state.language);
  const vi = language === 'vi';
  const data = useMarketOverviewStore((state) => state.data);
  const fetchMarketOverview = useMarketOverviewStore(
    (state) => state.fetchMarketOverview,
  );

  useEffect(() => {
    void fetchMarketOverview();

    const refreshInterval = window.setInterval(() => {
      void fetchMarketOverview();
    }, 5 * 60 * 1000);

    return () => window.clearInterval(refreshInterval);
  }, [fetchMarketOverview]);

  const marketCap = data?.globalMarketCap;
  const cmc20 = data?.cmc20;
  const fearAndGreed = data?.fearAndGreed;
  const marketCapChange = getChangePresentation(
    marketCap?.change24h ?? -1.46,
  );
  const cmc20Change = getChangePresentation(
    cmc20?.change24h ?? -1.66,
  );

  return (
    <section className={styles.section}>
      <PageContainer>
        <div className={styles.content}>
          <div className={styles.topRow}>
            <div className={styles.grid}>
              <MarketStatCard
                title={vi ? 'Vốn hóa thị trường' : 'Market Cap'}
                value={
                  marketCap
                    ? formatCompactCurrency(marketCap.value, currency)
                    : formatCompactCurrency(2_160_000_000_000, currency)
                }
                change={marketCapChange.text}
                changeTone={marketCapChange.tone}
                footer={
                  <div className={styles[`${marketCapChange.tone}Chart`]}>
                    <MiniSparkline
                      data={marketCapData}
                      tone={marketCapChange.tone}
                    />
                  </div>
                }
              />

              <MarketStatCard
                title="CMC20"
                value={cmc20 ? formatUsd(cmc20.value, currency) : formatUsd(128.94, currency)}
                change={cmc20Change.text}
                changeTone={cmc20Change.tone}
                footer={
                  <div className={styles[`${cmc20Change.tone}Chart`]}>
                    <MiniSparkline
                      data={cmc20Data}
                      tone={cmc20Change.tone}
                    />
                  </div>
                }
              />

              <MarketStatCard
                title={vi ? 'Thanh lý (24 giờ)' : 'Liquidations (24h)'}
                value={formatCompactCurrency(267_400_000, currency)}
                change="▲ 40.84%"
                changeTone="positive"
                footer={
                  <div className={styles.positiveChart}>
                    <MiniSparkline
                      data={liquidationData}
                      tone="positive"
                    />
                  </div>
                }
              />

              <MarketStatCard
                title={vi ? 'Chỉ số Sợ hãi & Tham lam' : 'Fear & Greed Index'}
                footer={
                  <FearGreedGauge
                    value={fearAndGreed?.value ?? 34}
                    label={
                      vi
                        ? ({ Fear: 'Sợ hãi', Greed: 'Tham lam', Neutral: 'Trung lập' }[
                            fearAndGreed?.label ?? 'Fear'
                          ] ?? fearAndGreed?.label ?? 'Sợ hãi')
                        : fearAndGreed?.label ?? 'Fear'
                    }
                  />
                }
              />
            </div>

            <AdvertisementCard />
          </div>

          <TrendingTopics />
          <NetworkFilter />
        </div>
      </PageContainer>
    </section>
  );
}
