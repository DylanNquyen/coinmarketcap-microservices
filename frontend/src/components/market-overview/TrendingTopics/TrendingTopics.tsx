import { trendingTopics } from './trendingTopics.data';
import styles from './TrendingTopics.module.css';

export function TrendingTopics() {
  return (
    <section
      className={styles.wrapper}
      aria-label="Trending cryptocurrency topics"
    >
      <button
        className={styles.navigationButton}
        type="button"
        aria-label="Previous topics"
      >
        ‹
      </button>

      <div className={styles.scroller}>
        <ul className={styles.list}>
          {trendingTopics.map((topic) => (
            <li key={topic.label}>
              <button className={styles.chip} type="button">
                <span className={styles.icon} aria-hidden="true">
                  {topic.icon}
                </span>

                <span>{topic.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        className={styles.navigationButton}
        type="button"
        aria-label="Next topics"
      >
        ›
      </button>
    </section>
  );
}