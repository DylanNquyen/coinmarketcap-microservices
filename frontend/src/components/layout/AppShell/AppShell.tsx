import { useEffect, type PropsWithChildren } from 'react';

import { AiCopilot } from '@/components/ai-copilot/AiCopilot';
import { GlobalStatsBar } from '@/components/layout/GlobalStatsBar';
import { MainHeader } from '@/components/layout/MainHeader';
import { SecondaryNavigation } from '@/components/layout/SecondaryNavigation';
import { useCryptoStore } from '@/store/useCryptoStore';

import { SiteFooter } from '../SiteFooter';
import { BottomMarketBar } from '@/components/layout/BottomMarketBar';
import styles from './AppShell.module.css';

type AppShellProps = PropsWithChildren;

export function AppShell({ children }: AppShellProps) {
  const initialize = useCryptoStore(
    (state) => state.initialize,
  );

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return (
    <div className={styles.shell}>
      <GlobalStatsBar />
      <MainHeader />
      <SecondaryNavigation />

      <main className={styles.main}>{children}</main>

      <SiteFooter />
      <AiCopilot />
      <BottomMarketBar />
    </div>
  );
}