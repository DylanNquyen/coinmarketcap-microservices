import { useRef } from 'react';

import { trendingTopics } from './trendingTopics.data';
import styles from './TrendingTopics.module.css';

type ChevronIconProps = {
  direction: 'left' | 'right';
};

function ChevronIcon({ direction }: ChevronIconProps) {
  return (
    <svg
      className={styles.chevronIcon}
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <path
        d={
          direction === 'left'
            ? 'M10 3.5 5.5 8l4.5 4.5'
            : 'M6 3.5 10.5 8 6 12.5'
        }
      />
    </svg>
  );
}

export function TrendingTopics() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollTopics = (direction: 'left' | 'right') => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const distance = Math.max(
      240,
      Math.round(scroller.clientWidth * 0.75),
    );

    scroller.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  return (
    <section
      className={styles.wrapper}
      aria-label="Trending cryptocurrency topics"
    >
      <button
        className={styles.navigationButton}
        type="button"
        aria-label="Previous topics"
        onClick={() => scrollTopics('left')}
      >
        <ChevronIcon direction="left" />
      </button>

      <div className={styles.scroller} ref={scrollerRef}>
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
        onClick={() => scrollTopics('right')}
      >
        <ChevronIcon direction="right" />
      </button>
    </section>
  );
}
