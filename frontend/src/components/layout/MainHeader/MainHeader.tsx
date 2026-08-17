import {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  BellOutlined,
  CloseOutlined,
  DownOutlined,
  FacebookFilled,
  InstagramOutlined,
  LinkedinFilled,
  PieChartFilled,
  RedditOutlined,
  RobotOutlined,
  SendOutlined,
  SettingOutlined,
  StarFilled,
  TwitterOutlined,
  QrcodeOutlined,
} from '@ant-design/icons';
import { QRCode } from 'antd';

import { AccountMenu } from '@/components/auth/AccountMenu';
import { AuthModal } from '@/components/auth/AuthModal';
import { SearchModal } from '@/components/search';
import { useAuthStore } from '@/store/useAuthStore';
import { usePreferencesStore } from '@/store/usePreferencesStore';

import { primaryNavigation } from './navigation.data';
import styles from './MainHeader.module.css';

type AuthMode = 'login' | 'register';

export function MainHeader() {
  const language = usePreferencesStore((state) => state.language);
  const isVietnamese = language === 'vi';
  const navigationTranslations: Record<string, string> = {
    Cryptocurrencies: 'Tiền mã hóa',
    Dashboards: 'Bảng điều khiển',
    DexScan: 'Quét DEX',
    Exchanges: 'Sàn giao dịch',
    Community: 'Cộng đồng',
    API: 'API',
    Products: 'Sản phẩm',
  };
  const [authModalOpen, setAuthModalOpen] =
    useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
  const [openPreferenceMenu, setOpenPreferenceMenu] = useState<'language' | 'currency' | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] =
    useState(false);
  const [searchModalOpen, setSearchModalOpen] =
    useState(false);
  const [qrMenuOpen, setQrMenuOpen] = useState(false);

  const accountMenuRef =
    useRef<HTMLDivElement>(null);
  const qrMenuRef = useRef<HTMLDivElement>(null);
  const preferenceMenuRef = useRef<HTMLDivElement>(null);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );
  const logout = useAuthStore((state) => state.logout);
  const currency = usePreferencesStore((state) => state.currency);
  const theme = usePreferencesStore((state) => state.theme);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);
  const setCurrency = usePreferencesStore((state) => state.setCurrency);
  const setTheme = usePreferencesStore((state) => state.setTheme);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!openPreferenceMenu) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!preferenceMenuRef.current?.contains(event.target as Node)) {
        setOpenPreferenceMenu(null);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [openPreferenceMenu]);

  useEffect(() => {
    if (!accountMenuOpen && !qrMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        qrMenuOpen &&
        qrMenuRef.current &&
        !qrMenuRef.current.contains(event.target as Node)
      ) {
        setQrMenuOpen(false);
      }

      if (
        accountMenuOpen &&
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
        setQrMenuOpen(false);
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
  }, [accountMenuOpen, qrMenuOpen]);

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
    setMobileMenuOpen(false);
  };

  const openAuthModal = (mode: AuthMode) => {
    setAuthMode(mode);
    setMobileMenuOpen(false);
    setAuthModalOpen(true);
  };

  const displayName =
    user?.email?.split('@')[0] ?? 'Account';

  const mobileLabels = isVietnamese
    ? {
        watchlist: 'Danh sách theo dõi',
        portfolio: 'Danh mục đầu tư',
        diamonds: 'Kim cương của tôi',
        ai: 'CMC AI',
        notifications: 'Thông báo',
        settings: 'Cài đặt',
        logout: 'Đăng xuất',
        register: 'Tạo tài khoản',
        login: 'Đăng nhập',
      }
    : {
        watchlist: 'Watchlist',
        portfolio: 'Portfolio',
        diamonds: 'My Diamonds',
        ai: 'CMC AI',
        notifications: 'Notifications',
        settings: 'Settings',
        logout: 'Log out',
        register: 'Create an account',
        login: 'Log in',
      };

  const mobileSubmenus: Record<string, string[]> = {
    Cryptocurrencies: isVietnamese
      ? ['Xếp hạng', 'Danh mục', 'Lịch sử']
      : ['Ranking', 'Categories', 'Historical data'],
    Dashboards: isVietnamese
      ? ['Tổng quan thị trường', 'Xu hướng']
      : ['Market overview', 'Trending'],
    DexScan: isVietnamese
      ? ['Cặp giao dịch mới', 'Token xu hướng']
      : ['New pairs', 'Trending tokens'],
    Exchanges: isVietnamese
      ? ['Sàn giao dịch Spot', 'Sàn phái sinh']
      : ['Spot exchanges', 'Derivatives'],
    Community: isVietnamese
      ? ['Bảng tin', 'Bài viết']
      : ['Feeds', 'Articles'],
    API: isVietnamese
      ? ['Gói API', 'Tài liệu API']
      : ['API plans', 'API documentation'],
    Products: isVietnamese
      ? ['Bộ chuyển đổi', 'Lịch sự kiện']
      : ['Converter', 'Events calendar'],
    'CMC AI': isVietnamese
      ? ['Trợ lý AI', 'Phân tích thị trường']
      : ['AI assistant', 'Market analysis'],
    Settings: isVietnamese
      ? ['Tài khoản', 'Tùy chọn hiển thị']
      : ['Account', 'Display preferences'],
  };

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

            <div className={styles.qrMenu} ref={qrMenuRef}>
              <button
                className={styles.qrButton}
                type="button"
                aria-label={
                  isVietnamese
                    ? 'Tải ứng dụng CoinMarketCap'
                    : 'Download CoinMarketCap app'
                }
                aria-expanded={qrMenuOpen}
                aria-haspopup="dialog"
                onClick={() => {
                  setQrMenuOpen((current) => !current);
                  setAccountMenuOpen(false);
                }}
              >
                <QrcodeOutlined aria-hidden="true" />
              </button>

              {qrMenuOpen && (
                <div className={styles.qrPopover} role="dialog">
                  <div className={styles.qrCodeFrame}>
                    <QRCode
                      value="https://coinmarketcap.com/mobile/"
                      type="svg"
                      size={156}
                      bordered={false}
                      color="#171924"
                      bgColor="#ffffff"
                    />
                    <span className={styles.qrLogo} aria-hidden="true">
                      〽
                    </span>
                  </div>
                  <p className={styles.qrCaption}>
                    {isVietnamese ? (
                      <>Quét để tải ứng dụng<br />CoinMarketCap</>
                    ) : (
                      <>Scan to Download<br />CoinMarketCap App</>
                    )}
                  </p>
                </div>
              )}
            </div>

            {!isAuthenticated ? (
              <button
                className={styles.loginButton}
                type="button"
                onClick={() => openAuthModal('login')}
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
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileMenuOpen((current) => !current)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div id="mobile-navigation" className={styles.mobileMenu} role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <div className={styles.mobileMenuHeader}>
            <a className={styles.logo} href="/" onClick={() => setMobileMenuOpen(false)}>
              <span className={styles.logoMark}>1</span><span>CoinMarketCap</span>
            </a>
            <button className={styles.closeButton} type="button" aria-label="Close navigation menu" onClick={() => setMobileMenuOpen(false)}><CloseOutlined /></button>
          </div>

          <nav aria-label="Mobile navigation">
            <ul className={styles.mobileNavigationList}>
              {primaryNavigation.map((item) => (
                <li key={item.label}>
                  <button
                    className={styles.mobileNavButton}
                    type="button"
                    aria-expanded={expandedMobileItem === item.label}
                    onClick={() => setExpandedMobileItem((current) => current === item.label ? null : item.label)}
                  >
                    <span>{isVietnamese ? navigationTranslations[item.label] ?? item.label : item.label}</span>
                    <DownOutlined className={styles.mobileChevron} aria-hidden="true" />
                  </button>
                  {expandedMobileItem === item.label && (
                    <ul className={styles.mobileSubmenu}>
                      {mobileSubmenus[item.label].map((label) => <li key={label}><a href={item.href} onClick={() => setMobileMenuOpen(false)}>{label}</a></li>)}
                    </ul>
                  )}
                </li>
              ))}
              <li><a href="#watchlist" onClick={() => setMobileMenuOpen(false)}><span className={styles.mobileItemLabel}><StarFilled /><span>{mobileLabels.watchlist}</span></span></a></li>
              <li><a href="#portfolio" onClick={() => setMobileMenuOpen(false)}><span className={styles.mobileItemLabel}><PieChartFilled /><span>{mobileLabels.portfolio}</span></span></a></li>
              <li><a href="#diamonds" onClick={() => setMobileMenuOpen(false)}><span className={styles.mobileItemLabel}><svg className={styles.diamondIcon} viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8 8 3h8l4 5-8 13L4 8Zm1.8 0h12.4L15.3 4.5H8.7L5.8 8Zm1.1 1.5 5.1 8.2 5.1-8.2H6.9Z" /></svg><span>{mobileLabels.diamonds}</span></span></a></li>
              <li>
                <button className={styles.mobileNavButton} type="button" aria-expanded={expandedMobileItem === 'CMC AI'} onClick={() => setExpandedMobileItem((current) => current === 'CMC AI' ? null : 'CMC AI')}>
                  <span className={styles.mobileItemLabel}><RobotOutlined /><span>{mobileLabels.ai}</span></span><DownOutlined className={styles.mobileChevron} />
                </button>
                {expandedMobileItem === 'CMC AI' && <ul className={styles.mobileSubmenu}>{mobileSubmenus['CMC AI'].map((label) => <li key={label}><a href="#cmc-ai" onClick={() => setMobileMenuOpen(false)}>{label}</a></li>)}</ul>}
              </li>
              <li><a href="#notifications" onClick={() => setMobileMenuOpen(false)}><span className={styles.mobileItemLabel}><BellOutlined /><span>{mobileLabels.notifications}</span></span></a></li>
              <li>
                <button className={styles.mobileNavButton} type="button" aria-expanded={expandedMobileItem === 'Settings'} onClick={() => setExpandedMobileItem((current) => current === 'Settings' ? null : 'Settings')}>
                  <span className={styles.mobileItemLabel}>{isAuthenticated ? <span className={styles.mobileAvatar}>{displayName.charAt(0).toUpperCase()}</span> : <SettingOutlined />}<span>{mobileLabels.settings}</span></span><DownOutlined className={styles.mobileChevron} />
                </button>
                {expandedMobileItem === 'Settings' && <ul className={styles.mobileSubmenu}>{mobileSubmenus.Settings.map((label) => <li key={label}><a href="#settings" onClick={() => setMobileMenuOpen(false)}>{label}</a></li>)}</ul>}
              </li>
            </ul>
          </nav>

          <div className={styles.mobileMenuActions}>
            {isAuthenticated ? <button type="button" onClick={handleLogout}>{mobileLabels.logout}</button> : <><button className={styles.primaryMobileAction} type="button" onClick={() => openAuthModal('register')}>{mobileLabels.register}</button><button className={styles.primaryMobileAction} type="button" onClick={() => openAuthModal('login')}>{mobileLabels.login}</button></>}
          </div>

          <div className={styles.preferenceRow} ref={preferenceMenuRef}>
            <div className={styles.preferenceDropdown}>
              <button type="button" aria-haspopup="listbox" aria-expanded={openPreferenceMenu === 'language'} onClick={() => setOpenPreferenceMenu((current) => current === 'language' ? null : 'language')}>
                <span>{language === 'vi' ? 'Tiếng Việt' : 'English'}</span><DownOutlined />
              </button>
              {openPreferenceMenu === 'language' && <div className={styles.preferenceMenu} role="listbox" aria-label="Language">
                <button className={language === 'en' ? styles.selectedPreference : ''} role="option" aria-selected={language === 'en'} type="button" onClick={() => { setLanguage('en'); setOpenPreferenceMenu(null); }}>English</button>
                <button className={language === 'vi' ? styles.selectedPreference : ''} role="option" aria-selected={language === 'vi'} type="button" onClick={() => { setLanguage('vi'); setOpenPreferenceMenu(null); }}>Tiếng Việt</button>
              </div>}
            </div>
            <div className={styles.preferenceDropdown}>
              <button type="button" aria-haspopup="listbox" aria-expanded={openPreferenceMenu === 'currency'} onClick={() => setOpenPreferenceMenu((current) => current === 'currency' ? null : 'currency')}>
                <span>{currency}</span><DownOutlined />
              </button>
              {openPreferenceMenu === 'currency' && <div className={styles.preferenceMenu} role="listbox" aria-label="Currency">
                <button className={currency === 'USD' ? styles.selectedPreference : ''} role="option" aria-selected={currency === 'USD'} type="button" onClick={() => { setCurrency('USD'); setOpenPreferenceMenu(null); }}>USD</button>
                <button className={currency === 'VND' ? styles.selectedPreference : ''} role="option" aria-selected={currency === 'VND'} type="button" onClick={() => { setCurrency('VND'); setOpenPreferenceMenu(null); }}>VND</button>
              </div>}
            </div>
          </div>

          <div className={styles.themeSelector}>
            {(['light', 'dark', 'system'] as const).map((option) => {
              const themeLabels = isVietnamese
                ? { light: 'Sáng', dark: 'Tối', system: 'Hệ thống' }
                : { light: 'Light', dark: 'Dark', system: 'System' };

              return <button className={theme === option ? styles.activeTheme : ''} type="button" key={option} onClick={() => setTheme(option)}>{themeLabels[option]}</button>;
            })}
          </div>

          <div className={styles.mobileLegal}>
            <p><a href="#disclaimer">{isVietnamese ? 'Miễn trừ trách nhiệm' : 'Disclaimer'}</a> · <a href="#request">{isVietnamese ? 'Biểu mẫu yêu cầu' : 'Request Form'}</a> · <a href="#terms">{isVietnamese ? 'Điều khoản sử dụng' : 'Terms of Use'}</a></p>
            <p><a href="#privacy">{isVietnamese ? 'Chính sách riêng tư' : 'Privacy Policy'}</a> · <a href="#about">{isVietnamese ? 'Giới thiệu' : 'About'}</a></p>
            <div className={styles.mobileSocials} aria-label="Social media">
              <a href="#twitter" aria-label="X"><TwitterOutlined /></a><a href="#facebook" aria-label="Facebook"><FacebookFilled /></a><a href="#telegram" aria-label="Telegram"><SendOutlined /></a><a href="#linkedin" aria-label="LinkedIn"><LinkedinFilled /></a><a href="#instagram" aria-label="Instagram"><InstagramOutlined /></a><a href="#reddit" aria-label="Reddit"><RedditOutlined /></a>
            </div>
          </div>
        </div>
      )}

      {authModalOpen && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setAuthModalOpen(false)}
        />
      )}

      {searchModalOpen && (
        <SearchModal
          onClose={() => setSearchModalOpen(false)}
        />
      )}
    </>
  );
}
