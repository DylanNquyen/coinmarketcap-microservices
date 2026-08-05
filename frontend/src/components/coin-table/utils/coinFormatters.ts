const DEFAULT_CURRENCY = 'USD';

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function formatCurrency(
  value: number | null | undefined,
  maximumFractionDigits = 2,
): string {
  if (!isFiniteNumber(value)) {
    return '—';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: DEFAULT_CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits,
  }).format(value);
}

export function formatCompactCurrency(
  value: number | null | undefined,
): string {
  if (!isFiniteNumber(value)) {
    return '—';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: DEFAULT_CURRENCY,
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercentage(
  value: number | null | undefined,
): string {
  if (!isFiniteNumber(value)) {
    return '—';
  }

  return `${Math.abs(value).toFixed(2)}%`;
}

export function getPriceFractionDigits(price: number): number {
  if (price >= 1) {
    return 2;
  }

  if (price >= 0.01) {
    return 4;
  }

  return 8;
}

export function formatCompactNumber(
  value: number | null | undefined,
): string {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value)
  ) {
    return '—';
  }

  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatSupply(
  value: number | null | undefined,
  symbol: string,
): string {
  const formattedValue = formatCompactNumber(value);

  if (formattedValue === '—') {
    return formattedValue;
  }

  return `${formattedValue} ${symbol.toUpperCase()}`;
}