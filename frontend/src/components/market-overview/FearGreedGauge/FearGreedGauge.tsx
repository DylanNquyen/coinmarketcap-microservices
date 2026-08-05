import styles from './FearGreedGauge.module.css';

type FearGreedGaugeProps = {
  value: number;
  label?: string;
};

const MINIMUM_VALUE = 0;
const MAXIMUM_VALUE = 100;

const CENTER_X = 60;
const CENTER_Y = 58;
const RADIUS = 50;

function clamp(value: number): number {
  return Math.min(MAXIMUM_VALUE, Math.max(MINIMUM_VALUE, value));
}

function getIndicatorPosition(value: number) {
  const normalizedValue = clamp(value);

  // 0 -> 180deg, 100 -> 0deg
  const angleInDegrees = 180 - normalizedValue * 1.8;
  const angleInRadians = (angleInDegrees * Math.PI) / 180;

  return {
    x: CENTER_X + RADIUS * Math.cos(angleInRadians),
    y: CENTER_Y - RADIUS * Math.sin(angleInRadians),
  };
}

export function FearGreedGauge({
  value,
  label = 'Fear',
}: FearGreedGaugeProps) {
  const normalizedValue = clamp(value);
  const indicatorPosition = getIndicatorPosition(normalizedValue);

  return (
    <div
      className={styles.gauge}
      role="img"
      aria-label={`Fear and Greed Index: ${normalizedValue}, ${label}`}
    >
      <svg
        className={styles.svg}
        viewBox="0 0 120 72"
        aria-hidden="true"
      >
        <path
          className={`${styles.segment} ${styles.extremeFear}`}
          d="M 10 58 A 50 50 0 0 1 24.6 22.6"
        />

        <path
          className={`${styles.segment} ${styles.fear}`}
          d="M 26.6 20.6 A 50 50 0 0 1 53 8.5"
        />

        <path
          className={`${styles.segment} ${styles.neutral}`}
          d="M 56 8 A 50 50 0 0 1 82.5 15.5"
        />

        <path
          className={`${styles.segment} ${styles.greed}`}
          d="M 85 17 A 50 50 0 0 1 104 39"
        />

        <path
          className={`${styles.segment} ${styles.extremeGreed}`}
          d="M 105 42 A 50 50 0 0 1 110 58"
        />

        <circle
          className={styles.indicatorOuter}
          cx={indicatorPosition.x}
          cy={indicatorPosition.y}
          r="6"
        />

        <circle
          className={styles.indicatorInner}
          cx={indicatorPosition.x}
          cy={indicatorPosition.y}
          r="3"
        />
      </svg>

      <div className={styles.content}>
        <strong className={styles.value}>{normalizedValue}</strong>
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  );
}