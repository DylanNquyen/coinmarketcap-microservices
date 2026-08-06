import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ColumnSettingsModal } from '@/components/coin-table/ColumnSettingsModal';
import { FilterModal } from '@/components/coin-table/FilterModal';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { useNetworkFilterStore } from '@/store/useNetworkFilterStore';

import {
  featuredNetworkItems,
  networkItems,
  type NetworkId,
  type NetworkItem,
} from './networkFilter.data';
import styles from './NetworkFilter.module.css';

type NetworkIconProps = {
  network: NetworkItem;
};

function NetworkIcon({ network }: NetworkIconProps) {
  return (
    <span
      className={styles.networkIcon}
      style={{ backgroundColor: network.color }}
      aria-hidden="true"
    >
      {network.icon}
    </span>
  );
}

export function NetworkFilter() {
  const language = usePreferencesStore((state) => state.language);
  const vi = language === 'vi';
  const activeId = useNetworkFilterStore((state) => state.activeNetwork);
  const setActiveNetwork = useNetworkFilterStore(
    (state) => state.setActiveNetwork,
  );
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [columnsModalOpen, setColumnsModalOpen] =
    useState(false);
  const [filtersModalOpen, setFiltersModalOpen] =
    useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredNetworks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return networkItems;
    }

    return networkItems.filter((network) =>
      network.name.toLowerCase().includes(normalizedQuery),
    );
  }, [searchQuery]);

  useEffect(() => {
    if (!moreOpen) {
      return;
    }

    searchInputRef.current?.focus();

    const handlePointerDown = (event: MouseEvent) => {
      if (
        moreRef.current &&
        !moreRef.current.contains(event.target as Node)
      ) {
        setMoreOpen(false);
        setSearchQuery('');
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMoreOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener(
        'mousedown',
        handlePointerDown,
      );
      window.removeEventListener('keydown', handleEscape);
    };
  }, [moreOpen]);

  const handleNetworkChange = (networkId: NetworkId) => {
    setActiveNetwork(networkId);
    setMoreOpen(false);
    setSearchQuery('');
  };

  return (
    <nav
      className={styles.container}
      aria-label="Network selection filter"
    >
      <div className={styles.toolbar}>
        <div className={styles.scroller}>
          <ul className={styles.list}>
            {featuredNetworkItems.map((network) => {
              const isActive = activeId === network.id;

              return (
                <li key={network.id} className={styles.item}>
                  <button
                    type="button"
                    className={`${styles.pill} ${
                      isActive ? styles.active : ''
                    }`}
                    aria-pressed={isActive}
                    onClick={() =>
                      handleNetworkChange(network.id)
                    }
                  >
                    <NetworkIcon network={network} />
                    <span>
                      {vi && network.id === 'all' ? 'Tất cả mạng' : network.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.more} ref={moreRef}>
          <button
            type="button"
            className={`${styles.moreButton} ${
              moreOpen ? styles.moreButtonOpen : ''
            }`}
            aria-haspopup="menu"
            aria-expanded={moreOpen}
            aria-label="Show more networks"
            onClick={() => {
              setMoreOpen((current) => !current);
              setSearchQuery('');
            }}
          >
            <span>{vi ? 'Thêm' : 'More'}</span>
            <span
              className={`${styles.arrow} ${
                moreOpen ? styles.arrowOpen : ''
              }`}
              aria-hidden="true"
            >
              {'\u25BE'}
            </span>
          </button>

          {moreOpen && (
            <div className={styles.dropdown} role="menu">
              <label className={styles.searchBox}>
                <svg
                  className={styles.searchIcon}
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <circle cx="7" cy="7" r="4.5" />
                  <path d="m10.5 10.5 3 3" />
                </svg>
                <input
                  ref={searchInputRef}
                  className={styles.searchInput}
                  type="search"
                  value={searchQuery}
                  placeholder={vi ? 'Tìm kiếm' : 'Search'}
                  aria-label="Search networks"
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                />
              </label>

              <div className={styles.dropdownList}>
                {filteredNetworks.length > 0 ? (
                  filteredNetworks.map((network) => {
                    const isActive = activeId === network.id;

                    return (
                      <button
                        key={network.id}
                        className={`${styles.dropdownItem} ${
                          isActive
                            ? styles.dropdownItemActive
                            : ''
                        }`}
                        type="button"
                        role="menuitemradio"
                        aria-checked={isActive}
                        onClick={() =>
                          handleNetworkChange(network.id)
                        }
                      >
                        <NetworkIcon network={network} />
                        <span>{network.name}</span>
                        {isActive && (
                          <svg
                            className={styles.checkIcon}
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                          >
                            <path d="m3 8.5 3 3 7-7" />
                          </svg>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <p className={styles.emptyState}>
                    {vi ? 'Không tìm thấy mạng' : 'No networks found'}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div
          className={styles.filterActions}
          aria-label="Additional market filters"
        >
          <button
            className={styles.filterLink}
            type="button"
            aria-disabled="true"
          >
            <svg
              className={styles.filterIcon}
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M2 3.25h12L9.4 8.4v3.7l-2.8 1.4V8.4L2 3.25Z" />
            </svg>
            <span>{vi ? 'Vốn hóa' : 'Market Cap'}</span>
            <span className={styles.actionChevron} aria-hidden="true">
              {'\u203A'}
            </span>
          </button>

          <button
            className={styles.filterLink}
            type="button"
            aria-disabled="true"
          >
            <svg
              className={styles.filterIcon}
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M2 3.25h12L9.4 8.4v3.7l-2.8 1.4V8.4L2 3.25Z" />
            </svg>
            <span>{vi ? 'Khối lượng (24 giờ)' : 'Volume (24h)'}</span>
          </button>

          <button
            className={styles.actionButton}
            type="button"
            onClick={() => setFiltersModalOpen(true)}
          >
            <svg
              className={styles.filterIcon}
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M2 3.25h12L9.4 8.4v3.7l-2.8 1.4V8.4L2 3.25Z" />
            </svg>
            <span>{vi ? 'Bộ lọc' : 'Filters'}</span>
          </button>

          <button
            className={styles.actionButton}
            type="button"
            onClick={() => setColumnsModalOpen(true)}
          >
            <svg
              className={styles.columnsIcon}
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <rect x="2.25" y="2.75" width="11.5" height="10.5" rx="1" />
              <path d="M6 3v10M10 3v10" />
            </svg>
            <span>{vi ? 'Cột' : 'Columns'}</span>
          </button>
        </div>
      </div>

      {columnsModalOpen && (
        <ColumnSettingsModal
          onClose={() => setColumnsModalOpen(false)}
        />
      )}

      {filtersModalOpen && (
        <FilterModal
          onClose={() => setFiltersModalOpen(false)}
        />
      )}
    </nav>
  );
}
