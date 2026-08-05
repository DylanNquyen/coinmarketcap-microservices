import type { ReactNode } from 'react';

import styles from './MarketStatCard.module.css';

export type MarketStatCardProps = {
  title: string;
  value?: string;
  change?: string;
  changeTone?: 'positive' | 'negative' | 'neutral';
  footer?: ReactNode;
  className?: string;
};

export function MarketStatCard({
  title,
  value,
  change,
  changeTone = 'neutral',
  footer,
  className = '',
}: MarketStatCardProps) {
  const cardClassName = [styles.card, className]
    .filter(Boolean)
    .join(' ');

  const changeClassName = [
    styles.change,
    styles[changeTone],
  ].join(' ');

  return (
    <article className={cardClassName}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <span className={styles.chevron} aria-hidden="true">
          ›
        </span>
      </header>

      {(value || change) && (
  <div className={styles.valueRow}>
    {value && <strong className={styles.value}>{value}</strong>}

    {change && (
      <span className={changeClassName}>
        {change}
      </span>
    )}
  </div>
)}

      {footer && <div className={styles.footer}>{footer}</div>}
    </article>
  );
}