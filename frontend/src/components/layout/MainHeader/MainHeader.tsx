import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { AccountMenu } from '@/components/auth/AccountMenu';
import { AuthModal } from '@/components/auth/AuthModal';
import { SearchModal } from '@/components/search';
import { useAuthStore } from '@/store/useAuthStore';
import { usePreferencesStore } from '@/store/usePreferencesStore';

import { primaryNavigation } from './navigation.data';
import styles from './MainHeader.module.css';

export function MainHeader() {
  const language = usePreferencesStore((state) => state.language);
  const isVietnamese = language === 'vi';
  const navigationTranslations: Record<string, string> = {
    Cryptocurrencies: 'Tiền mã hóa',
    DexScan: 'Quét DEX',
    Exchanges: 'Sàn giao dịch',
    Community: 'Cộng đồng',
    Products: 'Sản phẩm',
  };
  const [authModalOpen, setAuthModalOpen] =
    useState(false);
  const [accountMenuOpen, setAccountMenuOpen] =
    useState(false);
  const [searchModalOpen, setSearchModalOpen] =
    useState(false);

  const accountMenuRef =
    useRef<HTMLDivElement>(null);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (!accountMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(
          event.target as Node,
        )
      ) {
        setAccountMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handlePointerDown,
    );
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener(
        'mousedown',
        handlePointerDown,
      );
      window.removeEventListener(
        'keydown',
        handleEscape,
      );
    };
  }, [accountMenuOpen]);

  useEffect(() => {
    const handleSearchShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable;

      if (event.key === '/' && !isTyping) {
        event.preventDefault();
        setSearchModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleSearchShortcut);

    return () => {
      window.removeEventListener(
        'keydown',
        handleSearchShortcut,
      );
    };
  }, []);

  const handleLogout = () => {
    logout();
    setAccountMenuOpen(false);
  };

  const displayName =
    user?.email?.split('@')[0] ?? 'Account';

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <a
            className={styles.logo}
            href="/"
            aria-label="1CoinMarketCap homepage"
          >
            <span className={styles.logoMark}>1</span>
            <span>CoinMarketCap</span>
          </a>

          <nav
            className={styles.desktopNavigation}
            aria-label="Primary navigation"
          >
            <ul className={styles.navigationList}>
              {primaryNavigation.map((item) => (
                <li key={item.label}>
                  <a
                    className={styles.navigationLink}
                    href={item.href}
                  >
                    <span>
                      {isVietnamese
                        ? navigationTranslations[item.label] ?? item.label
                        : item.label}
                    </span>

                    {item.hasDropdown && (
                      <span
                        className={
                          styles.dropdownIndicator
                        }
                        aria-hidden="true"
                      >
                        ▾
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <a
              className={styles.utilityLink}
              href="#portfolio"
            >
              <svg
                className={styles.utilityIcon}
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path d="M8 1.5a6.5 6.5 0 1 0 6.5 6.5H8V1.5Z" />
                <path d="M9.5 1.7a5 5 0 0 1 4.8 4.8H9.5V1.7Z" />
              </svg>
              <span>{isVietnamese ? 'Danh mục' : 'Portfolio'}</span>
            </a>

            <a
              className={styles.utilityLink}
              href="#watchlist"
            >
              <svg
                className={styles.utilityIcon}
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path d="m8 1.4 2 4.05 4.47.65-3.24 3.15.77 4.45L8 11.6l-4 2.1.77-4.45L1.53 6.1 6 5.45 8 1.4Z" />
              </svg>
              <span>{isVietnamese ? 'Theo dõi' : 'Watchlist'}</span>
            </a>

            <button
              className={styles.searchButton}
              type="button"
              aria-label="Search cryptocurrencies"
              onClick={() => setSearchModalOpen(true)}
            >
              <span
                className={styles.searchIcon}
                aria-hidden="true"
              >
                ⌕
              </span>

              <span className={styles.searchText}>
                {isVietnamese ? 'Tìm kiếm' : 'Search'}
              </span>

              <kbd className={styles.shortcut}>/</kbd>
            </button>

            {!isAuthenticated ? (
              <button
                className={styles.loginButton}
                type="button"
                onClick={() =>
                  setAuthModalOpen(true)
                }
              >
                {isVietnamese ? 'Đăng nhập' : 'Log In'}
              </button>
            ) : (
              <div
                className={styles.account}
                ref={accountMenuRef}
              >
                <button
                  className={styles.accountButton}
                  type="button"
                  aria-expanded={accountMenuOpen}
                  aria-haspopup="menu"
                  onClick={() =>
                    setAccountMenuOpen(
                      (current) => !current,
                    )
                  }
                >
                  <span
                    className={styles.avatar}
                    aria-hidden="true"
                  >
                    {displayName
                      .charAt(0)
                      .toUpperCase()}
                  </span>

                  <span className={styles.accountName}>
                    {displayName}
                  </span>

                  <span
                    className={styles.accountChevron}
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                </button>

                {accountMenuOpen && (
                  <AccountMenu
                    email={user?.email ?? ''}
                    displayName={displayName}
                    onLogout={handleLogout}
                  />
                )}
              </div>
            )}

            <button
              className={styles.mobileSearchButton}
              type="button"
              aria-label="Search cryptocurrencies"
              onClick={() => setSearchModalOpen(true)}
            >
              ⌕
            </button>

            <button
              className={styles.menuButton}
              type="button"
              aria-label="Open navigation menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {searchModalOpen && (
        <SearchModal
          onClose={() => setSearchModalOpen(false)}
        />
      )}
    </>
  );
}
