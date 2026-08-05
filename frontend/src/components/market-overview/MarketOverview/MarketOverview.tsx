import { PageContainer } from '@/components/layout/PageContainer';
import { AdvertisementCard } from '@/components/market-overview/AdvertisementCard';
import { FearGreedGauge } from '@/components/market-overview/FearGreedGauge';
import { MarketStatCard } from '@/components/market-overview/MarketStatCard';
import { MiniSparkline } from '@/components/market-overview/MiniSparkline';
import { TrendingTopics } from '@/components/market-overview/TrendingTopics';

import styles from './MarketOverview.module.css';
import { NetworkFilter } from '../NetworkFilter';

const marketCapData = [
  95, 70, 32, 52, 45, 48, 49, 47, 46, 48, 47, 48, 47, 47,
];

const cmc20Data = [
  98, 61, 30, 55, 48, 49, 47, 48, 47, 48, 48, 49, 48, 48,
];

const liquidationData = [
  24, 52, 30, 65, 42, 71, 36, 62, 33, 74, 48, 67, 39, 60,
];

export function MarketOverview() {
  return (
    <section className={styles.section}>
      <PageContainer>
        <div className={styles.content}>
          <div className={styles.topRow}>
            <div className={styles.grid}>
              <MarketStatCard
                title="Market Cap"
                value="$2.16T"
                change="▼ 1.46%"
                changeTone="negative"
                footer={
                  <div className={styles.negativeChart}>
                    <MiniSparkline data={marketCapData} />
                  </div>
                }
              />

              <MarketStatCard
                title="CMC20"
                value="$128.94"
                change="▼ 1.66%"
                changeTone="negative"
                footer={
                  <div className={styles.negativeChart}>
                    <MiniSparkline data={cmc20Data} />
                  </div>
                }
              />

              <MarketStatCard
                title="Liquidations (24h)"
                value="$267.4M"
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
                title="Fear & Greed"
                footer={<FearGreedGauge value={34} label="Fear" />}
              />
            </div>

            <AdvertisementCard />
          </div>

          <TrendingTopics />
          <NetworkFilter/>
        </div>
      </PageContainer>
    </section>
  );
}