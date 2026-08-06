import {
  USD_TO_VND_RATE,
  type AppCurrency,
} from '@/store/usePreferencesStore';

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function formatCurrency(
  value: number | null | undefined,
  maximumFractionDigits = 2,
  currency: AppCurrency = 'USD',
): string {
  if (!isFiniteNumber(value)) {
    return '—';
  }

  const convertedValue = currency === 'VND' ? value * USD_TO_VND_RATE : value;

  return new Intl.NumberFormat(currency === 'VND' ? 'vi-VN' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'VND' ? 0 : 2,
    maximumFractionDigits: currency === 'VND' ? 0 : maximumFractionDigits,
  }).format(convertedValue);
}

export function formatCompactCurrency(
  value: number | null | undefined,
  currency: AppCurrency = 'USD',
): string {
  if (!isFiniteNumber(value)) {
    return '—';
  }

  const convertedValue = currency === 'VND' ? value * USD_TO_VND_RATE : value;

  if (currency === 'VND') {
    const units = [
      { threshold: 1e15, divisor: 1e15, suffix: 'triệu tỷ ₫' },
      { threshold: 1e12, divisor: 1e12, suffix: 'nghìn tỷ ₫' },
      { threshold: 1e9, divisor: 1e9, suffix: 'tỷ ₫' },
      { threshold: 1e6, divisor: 1e6, suffix: 'triệu ₫' },
    ];
    const unit = units.find((item) => Math.abs(convertedValue) >= item.threshold);

    if (unit) {
      const amount = new Intl.NumberFormat('vi-VN', {
        maximumFractionDigits: 2,
      }).format(convertedValue / unit.divisor);
      return `${amount} ${unit.suffix}`;
    }
  }

  return new Intl.NumberFormat(currency === 'VND' ? 'vi-VN' : 'en-US', {
    style: 'currency',
    currency,
    notation: currency === 'VND' ? 'standard' : 'compact',
    maximumFractionDigits: 2,
  }).format(convertedValue);
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
