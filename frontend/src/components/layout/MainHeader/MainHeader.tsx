import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { AuthModal } from '@/components/auth-modal/AuthModal';
import { useAuthStore } from '@/store/useAuthStore';

import { primaryNavigation } from './navigation.data';
import styles from './MainHeader.module.css';

export function MainHeader() {
  const [authModalOpen, setAuthModalOpen] =
    useState(false);
  const [accountMenuOpen, setAccountMenuOpen] =
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
                    <span>{item.label}</span>

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
              Portfolio
            </a>

            <a
              className={styles.utilityLink}
              href="#watchlist"
            >
              Watchlist
            </a>

            <button
              className={styles.searchButton}
              type="button"
              aria-label="Search cryptocurrencies"
            >
              <span
                className={styles.searchIcon}
                aria-hidden="true"
              >
                ⌕
              </span>

              <span className={styles.searchText}>
                Search
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
                Log In
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
                  <div
                    className={styles.accountMenu}
                    role="menu"
                  >
                    <div className={styles.accountInfo}>
                      <span
                        className={styles.accountEmail}
                      >
                        {user?.email}
                      </span>
                    </div>

                    <a
                      className={styles.accountMenuItem}
                      href="#portfolio"
                      role="menuitem"
                      onClick={() =>
                        setAccountMenuOpen(false)
                      }
                    >
                      Portfolio
                    </a>

                    <a
                      className={styles.accountMenuItem}
                      href="#watchlist"
                      role="menuitem"
                      onClick={() =>
                        setAccountMenuOpen(false)
                      }
                    >
                      Watchlist
                    </a>

                    <div
                      className={styles.accountMenuDivider}
                    />

                    <button
                      className={`${styles.accountMenuItem} ${styles.logoutButton}`}
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              className={styles.mobileSearchButton}
              type="button"
              aria-label="Search cryptocurrencies"
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
    </>
  );
}