import { useId, useMemo } from 'react';

import styles from './MiniSparkline.module.css';

type MiniSparklineProps = {
  data: readonly number[];
  tone?: 'positive' | 'negative';
  width?: number;
  height?: number;
};

const SVG_PADDING = 2;

function createPath(
  data: readonly number[],
  width: number,
  height: number,
): string {
  if (data.length < 2) {
    return '';
  }

  const minimum = Math.min(...data);
  const maximum = Math.max(...data);
  const range = maximum - minimum || 1;

  return data
    .map((value, index) => {
      const x =
        SVG_PADDING +
        (index / (data.length - 1)) * (width - SVG_PADDING * 2);

      const normalizedValue = (value - minimum) / range;

      const y =
        height -
        SVG_PADDING -
        normalizedValue * (height - SVG_PADDING * 2);

      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
}

export function MiniSparkline({
  data,
  tone = 'negative',
  width = 180,
  height = 32,
}: MiniSparklineProps) {
  const gradientId = useId().replaceAll(':', '');

  const validData = useMemo(
  () => data.filter(
    (value): value is number =>
      typeof value === 'number' &&
      Number.isFinite(value),
  ),
  [data],
);

  const linePath = useMemo(
    () => createPath(validData, width, height),
    [validData, width, height],
  );

  const areaPath = linePath
    ? `${linePath} L ${width - SVG_PADDING} ${height} L ${SVG_PADDING} ${height} Z`
    : '';

  return (
    <svg
      className={styles.sparkline}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={`${tone} market sparkline`}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="currentColor"
            stopOpacity="0.22"
          />
          <stop
            offset="100%"
            stopColor="currentColor"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>

      {areaPath && (
        <path
          className={styles.area}
          d={areaPath}
          fill={`url(#${gradientId})`}
        />
      )}

      {linePath && (
        <path
          className={styles.line}
          d={linePath}
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}