import { globalStats } from './globalStats.data';
import styles from './GlobalStatsBar.module.css';

export function GlobalStatsBar() {
  return (
    <section
      className={styles.statsBar}
      aria-label="Global cryptocurrency market statistics"
    >
      <div className={styles.scroller}>
        <ul className={styles.statsList}>
          {globalStats.map((stat) => (
            <li key={stat.label} className={styles.statsItem}>
              <span className={styles.label}>{stat.label}:</span>

              <span
                className={[
                  styles.value,
                  stat.tone ? styles[stat.tone] : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {stat.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}