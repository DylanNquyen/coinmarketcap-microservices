import { CoinTable } from '@/components/coin-table/CoinTable';
import { MarketOverview } from '@/components/market-overview/MarketOverview';

export function HomePage() {
  return (
    <>
      <MarketOverview />
      <CoinTable />
    </>
  );
}