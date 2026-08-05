import { globalStats } from '@/components/layout/GlobalStatsBar/globalStats.data';

import styles from './BottomMarketBar.module.css';

export function BottomMarketBar() {
  return (
    <aside
      className={styles.bar}
      aria-label="Global market summary"
    >
      <div className={styles.scroller}>
        <div className={styles.stats}>
          {globalStats.map((item) => (
            <div className={styles.stat} key={item.label}>
              <span className={styles.label}>
                {item.label}:
              </span>

              <span
                className={[
                  styles.value,
                  item.tone === 'positive'
                    ? styles.positive
                    : '',
                  item.tone === 'negative'
                    ? styles.negative
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <a href="#get-listed">Get listed</a>
        <a href="#api">API</a>
      </div>
    </aside>
  );
}