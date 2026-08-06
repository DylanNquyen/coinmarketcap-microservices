import {
  formatCurrency,
  getPriceFractionDigits,
} from '../utils/coinFormatters';

import styles from './PriceCell.module.css';
import { usePreferencesStore } from '@/store/usePreferencesStore';

type PriceCellProps = {
  price: number;
  isUp?: boolean;
};

export function PriceCell({
  price,
  isUp,
}: PriceCellProps) {
  const fractionDigits = getPriceFractionDigits(price);
  const currency = usePreferencesStore((state) => state.currency);

  const priceClassName = [
    styles.price,
    isUp === true ? styles.priceUp : '',
    isUp === false ? styles.priceDown : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={priceClassName}>
      {formatCurrency(price, fractionDigits, currency)}
    </span>
  );
}
