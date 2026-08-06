import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import {
  defaultTableFilters,
  useTableFiltersStore,
} from '@/store/useTableFiltersStore';

import styles from './FilterModal.module.css';

type FilterModalProps = {
  onClose: () => void;
};

type RangeFieldProps = {
  label: string;
  min: string;
  max: string;
  suffix: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
};

type ComingSoonRowProps = {
  label: string;
  variant?: 'select' | 'range';
};

function toInputValue(value: number | null) {
  return value === null ? '' : String(value);
}

function toNumberOrNull(value: string) {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function RangeField({
  label,
  min,
  max,
  suffix,
  onMinChange,
  onMaxChange,
}: RangeFieldProps) {
  return (
    <div className={styles.filterRow}>
      <span className={styles.label}>{label}</span>
      <div className={styles.rangeFields}>
        <label className={styles.inputShell}>
          <input
            type="number"
            value={min}
            placeholder="Min"
            onChange={(event) => onMinChange(event.target.value)}
          />
          <span>{suffix}</span>
        </label>
        <span className={styles.rangeSeparator}>-</span>
        <label className={styles.inputShell}>
          <input
            type="number"
            value={max}
            placeholder="Max"
            onChange={(event) => onMaxChange(event.target.value)}
          />
          <span>{suffix}</span>
        </label>
      </div>
    </div>
  );
}

function ComingSoonRow({
  label,
  variant = 'select',
}: ComingSoonRowProps) {
  return (
    <div className={styles.filterRow}>
      <span className={styles.label}>{label}</span>

      {variant === 'select' ? (
        <div className={`${styles.selectShell} ${styles.disabled}`}>
          <span>Coming soon</span>
          <span aria-hidden="true">⌄</span>
        </div>
      ) : (
        <div className={styles.rangeFields}>
          <div className={`${styles.inputShell} ${styles.disabled}`}>
            <span>Min</span>
          </div>
          <span className={styles.rangeSeparator}>-</span>
          <div className={`${styles.inputShell} ${styles.disabled}`}>
            <span>Max</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function FilterModal({ onClose }: FilterModalProps) {
  const filters = useTableFiltersStore((state) => state.filters);
  const setFilters = useTableFiltersStore(
    (state) => state.setFilters,
  );

  const [visibleLimit, setVisibleLimit] = useState(() =>
    String(filters.visibleLimit),
  );
  const [marketCapMin, setMarketCapMin] = useState(() =>
    toInputValue(filters.marketCapMin),
  );
  const [marketCapMax, setMarketCapMax] = useState(() =>
    toInputValue(filters.marketCapMax),
  );
  const [priceChangeMin, setPriceChangeMin] = useState(() =>
    toInputValue(filters.priceChange24hMin),
  );
  const [priceChangeMax, setPriceChangeMax] = useState(() =>
    toInputValue(filters.priceChange24hMax),
  );
  const [volumeMin, setVolumeMin] = useState(() =>
    toInputValue(filters.volume24hMin),
  );
  const [volumeMax, setVolumeMax] = useState(() =>
    toInputValue(filters.volume24hMax),
  );

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const resetDraft = () => {
    setVisibleLimit(String(defaultTableFilters.visibleLimit));
    setMarketCapMin('');
    setMarketCapMax('');
    setPriceChangeMin('');
    setPriceChangeMax('');
    setVolumeMin('');
    setVolumeMax('');
  };

  const applyFilters = () => {
    setFilters({
      visibleLimit: Number(visibleLimit),
      marketCapMin: toNumberOrNull(marketCapMin),
      marketCapMax: toNumberOrNull(marketCapMax),
      priceChange24hMin: toNumberOrNull(priceChangeMin),
      priceChange24hMax: toNumberOrNull(priceChangeMax),
      volume24hMin: toNumberOrNull(volumeMin),
      volume24hMax: toNumberOrNull(volumeMax),
    });
    onClose();
  };

  return createPortal(
    <div
      className={styles.overlay}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-modal-title"
      >
        <header className={styles.header}>
          <h2 id="filter-modal-title">Filters</h2>
          <button
            className={styles.closeButton}
            type="button"
            aria-label="Close filters"
            onClick={onClose}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="m3 3 10 10M13 3 3 13" />
            </svg>
          </button>
        </header>

        <div className={styles.form}>
          <div className={styles.filterRow}>
            <span className={styles.label}>Visible Coin Range</span>
            <label className={styles.selectShell}>
              <select
                value={visibleLimit}
                onChange={(event) =>
                  setVisibleLimit(event.target.value)
                }
              >
                <option value="10">Show 10</option>
                <option value="20">Show 20</option>
                <option value="50">Show 50</option>
                <option value="100">Show 100</option>
              </select>
            </label>
          </div>

          <ComingSoonRow label="Networks" />
          <ComingSoonRow label="Category" />
          <ComingSoonRow label="Exchange" />

          <RangeField
            label="Market Cap"
            min={marketCapMin}
            max={marketCapMax}
            suffix="$"
            onMinChange={setMarketCapMin}
            onMaxChange={setMarketCapMax}
          />

          <ComingSoonRow label="FDV" variant="range" />

          <RangeField
            label="Price Change (24h)"
            min={priceChangeMin}
            max={priceChangeMax}
            suffix="%"
            onMinChange={setPriceChangeMin}
            onMaxChange={setPriceChangeMax}
          />

          <RangeField
            label="Volume (24h)"
            min={volumeMin}
            max={volumeMax}
            suffix="$"
            onMinChange={setVolumeMin}
            onMaxChange={setVolumeMax}
          />

          <ComingSoonRow label="Volume Change (24h)" variant="range" />
          <ComingSoonRow label="Age" variant="range" />
        </div>

        <footer className={styles.footer}>
          <button
            className={styles.resetButton}
            type="button"
            onClick={resetDraft}
          >
            <span aria-hidden="true">↻</span>
            Reset
          </button>
          <button
            className={styles.applyButton}
            type="button"
            onClick={applyFilters}
          >
            Apply
          </button>
        </footer>
      </section>
    </div>,
    document.body,
  );
}
