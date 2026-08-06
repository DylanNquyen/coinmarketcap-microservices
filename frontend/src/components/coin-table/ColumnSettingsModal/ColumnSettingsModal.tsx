import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import {
  defaultVisibleColumns,
  useTableColumnsStore,
  type OptionalCoinColumn,
} from '@/store/useTableColumnsStore';

import styles from './ColumnSettingsModal.module.css';

type ColumnSettingsModalProps = {
  onClose: () => void;
};

const columnOptions: Array<{
  id: OptionalCoinColumn;
  label: string;
  group: string;
}> = [
  { id: 'priceChange1h', label: '1h %', group: 'Price Change' },
  { id: 'priceChange24h', label: '24h %', group: 'Price Change' },
  { id: 'priceChange7d', label: '7d %', group: 'Price Change' },
  { id: 'marketCap', label: 'Market Cap', group: 'Market Cap' },
  { id: 'volume24h', label: 'Volume (24h)', group: 'Volume' },
  {
    id: 'circulatingSupply',
    label: 'Circulating Supply',
    group: 'Supply',
  },
  { id: 'sparkline7d', label: '7d Price%', group: 'Charts' },
];

const groups = [
  'Price Change',
  'Market Cap',
  'Volume',
  'Supply',
  'Charts',
];

export function ColumnSettingsModal({
  onClose,
}: ColumnSettingsModalProps) {
  const visibleColumns = useTableColumnsStore(
    (state) => state.visibleColumns,
  );
  const setVisibleColumns = useTableColumnsStore(
    (state) => state.setVisibleColumns,
  );
  const [draftColumns, setDraftColumns] = useState<
    OptionalCoinColumn[]
  >(() => [...visibleColumns]);

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

  const toggleColumn = (columnId: OptionalCoinColumn) => {
    setDraftColumns((current) =>
      current.includes(columnId)
        ? current.filter((id) => id !== columnId)
        : [...current, columnId],
    );
  };

  const applyChanges = () => {
    const orderedColumns = columnOptions
      .map((option) => option.id)
      .filter((id) => draftColumns.includes(id));

    setVisibleColumns(orderedColumns);
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
        aria-labelledby="column-settings-title"
      >
        <header className={styles.header}>
          <div>
            <h2 id="column-settings-title" className={styles.title}>
              Choose up to{' '}
              <span>{draftColumns.length}/7</span> metrics
            </h2>
            <p className={styles.description}>
              Add or remove the metrics shown in the coin table.
            </p>
          </div>

          <button
            className={styles.closeButton}
            type="button"
            aria-label="Close column settings"
            onClick={onClose}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="m3 3 10 10M13 3 3 13" />
            </svg>
          </button>
        </header>

        <div className={styles.toolbar}>
          <span className={styles.preset}>Custom</span>
          <button
            className={styles.restartButton}
            type="button"
            onClick={() =>
              setDraftColumns([...defaultVisibleColumns])
            }
          >
            <span aria-hidden="true">↻</span>
            Restart
          </button>
        </div>

        <div className={styles.selectedColumns}>
          {draftColumns.length > 0 ? (
            draftColumns.map((columnId, index) => {
              const option = columnOptions.find(
                (item) => item.id === columnId,
              );

              return (
                <button
                  key={columnId}
                  className={styles.selectedChip}
                  type="button"
                  onClick={() => toggleColumn(columnId)}
                >
                  <span className={styles.orderBadge}>{index + 1}</span>
                  {option?.label}
                  <span aria-hidden="true">×</span>
                </button>
              );
            })
          ) : (
            <span className={styles.noSelection}>
              No optional metrics selected
            </span>
          )}
        </div>

        <div className={styles.options}>
          {groups.map((group) => (
            <div key={group} className={styles.optionRow}>
              <span className={styles.groupLabel}>{group}</span>
              <div className={styles.optionChips}>
                {columnOptions
                  .filter((option) => option.group === group)
                  .map((option) => {
                    const selected = draftColumns.includes(option.id);

                    return (
                      <button
                        key={option.id}
                        className={`${styles.optionChip} ${
                          selected ? styles.optionChipSelected : ''
                        }`}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleColumn(option.id)}
                      >
                        {option.label}
                        {selected && <span aria-hidden="true">×</span>}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        <footer className={styles.footer}>
          <button
            className={styles.cancelButton}
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={styles.applyButton}
            type="button"
            onClick={applyChanges}
          >
            Apply Changes
          </button>
        </footer>
      </section>
    </div>,
    document.body,
  );
}
