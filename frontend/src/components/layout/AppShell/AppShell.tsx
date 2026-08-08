import { useEffect, type PropsWithChildren } from 'react';

import { AiCopilot } from '@/components/ai-copilot/AiCopilot';
import { MainHeader } from '@/components/layout/MainHeader';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { SecondaryNavigation } from '@/components/layout/SecondaryNavigation';
import { useCryptoStore } from '@/store/useCryptoStore';
import { usePreferencesStore } from '@/store/usePreferencesStore';

import { SiteFooter } from '../SiteFooter';
import { BottomMarketBar } from '@/components/layout/BottomMarketBar';
import styles from './AppShell.module.css';

type AppShellProps = PropsWithChildren;

export function AppShell({ children }: AppShellProps) {
  const initialize = useCryptoStore(
    (state) => state.initialize,
  );
  const initializePreferences = usePreferencesStore(
    (state) => state.initialize,
  );

  useEffect(() => initializePreferences(), [initializePreferences]);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return (
    <div className={styles.shell}>
      <MainHeader />
      <SecondaryNavigation />

      <main className={styles.main}>{children}</main>

      <SiteFooter />
      <ScrollToTop />
      <AiCopilot />
      <BottomMarketBar />
    </div>
  );
}
