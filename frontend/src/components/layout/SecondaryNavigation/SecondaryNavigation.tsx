import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  moreNavigationItems,
  secondaryNavigationItems,
} from './secondaryNavigation.data';
import styles from './SecondaryNavigation.module.css';
import { usePreferencesStore } from '@/store/usePreferencesStore';

function getActiveHash() {
  const hash = window.location.hash;
  const knownHashes = [
    ...secondaryNavigationItems,
    ...moreNavigationItems,
  ].map((item) => item.href);

  return knownHashes.includes(hash) ? hash : '#top';
}

export function SecondaryNavigation() {
  const language = usePreferencesStore((state) => state.language);
  const vi = language === 'vi';
  const translations: Record<string, string> = {
    Top: 'Hàng đầu', Trending: 'Xu hướng', Watchlist: 'Theo dõi',
    Stocks: 'Cổ phiếu', 'Prediction Markets': 'Thị trường dự đoán',
    'Most Visited': 'Xem nhiều nhất', New: 'Mới', Gainers: 'Tăng giá',
    'More Categories': 'Thêm danh mục', 'Token unlocks': 'Mở khóa token',
    Gaming: 'Trò chơi', Yield: 'Lợi suất',
  };
  const translate = (label: string) => (vi ? translations[label] ?? label : label);
  const [currentHash, setCurrentHash] =
    useState(getActiveHash);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(getActiveHash());
      setMoreOpen(false);
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener(
        'hashchange',
        handleHashChange,
      );
    };
  }, []);

  useEffect(() => {
    if (!moreOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setMoreOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMoreOpen(false);
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

  const moreItemActive = moreNavigationItems.some(
    (item) => item.href === currentHash,
  );

  return (
    <nav
      className={styles.navigation}
      aria-label="Secondary cryptocurrency navigation"
    >
      <div className={styles.navigationInner}>
        <div className={styles.scroller}>
          <ul className={styles.list}>
            {secondaryNavigationItems.map((item) => {
              const isActive = currentHash === item.href;

              return (
                <li key={item.label} className={styles.item}>
                  <a
                    className={`${styles.link} ${
                      isActive ? styles.active : ''
                    }`}
                    href={item.href}
                    aria-current={
                      isActive ? 'page' : undefined
                    }
                  >
                    {translate(item.label)}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.more} ref={moreMenuRef}>
          <button
            className={`${styles.link} ${styles.moreButton} ${
              moreItemActive ? styles.active : ''
            }`}
            type="button"
            aria-expanded={moreOpen}
            aria-haspopup="menu"
            onClick={() =>
              setMoreOpen((current) => !current)
            }
          >
            <span>{vi ? 'Thêm' : 'More'}</span>
            <span
              className={`${styles.dropdownIcon} ${
                moreOpen ? styles.dropdownIconOpen : ''
              }`}
              aria-hidden="true"
            >
              {'\u25BE'}
            </span>
          </button>

          {moreOpen && (
            <div className={styles.moreMenu} role="menu">
              {moreNavigationItems.map((item) => (
                <a
                  key={item.label}
                  className={`${styles.moreMenuItem} ${
                    currentHash === item.href
                      ? styles.moreMenuItemActive
                      : ''
                  }`}
                  href={item.href}
                  role="menuitem"
                  aria-current={
                    currentHash === item.href
                      ? 'page'
                      : undefined
                  }
                >
                  {item.icon && (
                    <span
                      className={styles.moreMenuIcon}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                  )}
                  <span>{translate(item.label)}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
