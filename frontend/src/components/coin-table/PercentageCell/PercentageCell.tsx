import { formatPercentage } from '../utils/coinFormatters';

import styles from './PercentageCell.module.css';

type PercentageCellProps = {
  value: number | null | undefined;
};

export function PercentageCell({
  value,
}: PercentageCellProps) {
  if (!Number.isFinite(value)) {
    return <span className={styles.neutral}>—</span>;
  }

  const numericValue = value as number;
  const isPositive = numericValue >= 0;

  return (
    <span
      className={[
        styles.percentage,
        isPositive ? styles.positive : styles.negative,
      ].join(' ')}
    >
      <span className={styles.indicator} aria-hidden="true">
        {isPositive ? '▲' : '▼'}
      </span>

      {formatPercentage(numericValue)}
    </span>
  );
}