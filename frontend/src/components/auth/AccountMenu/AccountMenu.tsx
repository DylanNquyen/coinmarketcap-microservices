import styles from './AccountMenu.module.css';
import {
  usePreferencesStore,
  type AppTheme,
} from '@/store/usePreferencesStore';

type AccountMenuProps = {
  email: string;
  displayName: string;
  onLogout: () => void;
};

type MenuRowProps = {
  label: string;
  value?: string;
  accent?: boolean;
  onClick?: () => void;
};

function MenuRow({
  label,
  value,
  accent = false,
  onClick,
}: MenuRowProps) {
  const content = (
    <>
      <span>{label}</span>

      {value && (
        <span
          className={`${styles.rowValue} ${
            accent ? styles.accentValue : ''
          }`}
        >
          {value}
        </span>
      )}
    </>
  );

  return onClick ? (
    <button className={styles.menuRow} type="button" role="menuitem" onClick={onClick}>
      {content}
    </button>
  ) : (
    <div className={styles.menuRow} role="menuitem">{content}</div>
  );
}

export function AccountMenu({
  email,
  displayName,
  onLogout,
}: AccountMenuProps) {
  const avatarInitial =
    displayName.charAt(0).toUpperCase() || 'U';
  const language = usePreferencesStore((state) => state.language);
  const currency = usePreferencesStore((state) => state.currency);
  const theme = usePreferencesStore((state) => state.theme);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);
  const setCurrency = usePreferencesStore((state) => state.setCurrency);
  const setTheme = usePreferencesStore((state) => state.setTheme);
  const isVietnamese = language === 'vi';

  const themeOptions: Array<{ value: AppTheme; label: string }> = [
    { value: 'light', label: isVietnamese ? 'Sáng' : 'Light' },
    { value: 'dark', label: isVietnamese ? 'Tối' : 'Dark' },
    { value: 'system', label: isVietnamese ? 'Hệ thống' : 'System' },
  ];

  return (
    <div className={styles.menu} role="menu">
      <div className={styles.profileHeader}>
        <span className={styles.profileAvatar} aria-hidden="true">
          <span className={styles.avatarInitial}>
            {avatarInitial}
          </span>
          <span className={styles.avatarStatus} />
        </span>

        <div className={styles.profileCopy}>
          <strong className={styles.greeting}>
            Hi, {displayName}
          </strong>
          <span className={styles.email}>{email}</span>
        </div>

        <span
          className={`${styles.headerIcon} ${styles.diamondIcon}`}
          aria-label="Rewards"
          role="img"
        >
          ◆
        </span>
        <span
          className={styles.headerIcon}
          aria-label="Notifications"
          role="img"
        >
          ♧
        </span>
      </div>

      <div className={styles.divider} />

      <MenuRow label={isVietnamese ? 'Bảng điều khiển API' : 'API Dashboard'} />

      <div className={styles.divider} />

      <MenuRow
        label={isVietnamese ? 'Ngôn ngữ' : 'Language'}
        value={`${isVietnamese ? 'Tiếng Việt' : 'English'}  ›`}
        onClick={() => setLanguage(isVietnamese ? 'en' : 'vi')}
      />
      <MenuRow
        label={isVietnamese ? 'Tiền tệ' : 'Currency'}
        value={`${currency === 'USD' ? '$' : '₫'}  ${currency}  ›`}
        accent
        onClick={() => setCurrency(currency === 'USD' ? 'VND' : 'USD')}
      />

      <div className={styles.menuRow} role="menuitem">
        <span>{isVietnamese ? 'Giao diện' : 'Theme'}</span>
        <div
          className={styles.segmentedControl}
          aria-label={isVietnamese ? 'Chọn giao diện' : 'Choose theme'}
        >
          {themeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={theme === option.value ? styles.activeSegment : ''}
              aria-pressed={theme === option.value}
              onClick={() => setTheme(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.divider} />

      <MenuRow label="CMC AI Subscription" value="Free  ›" />

      <div className={styles.menuRow} role="menuitem">
        <span>CMC AI Assistant</span>
        <div
          className={styles.assistantToggle}
          aria-label="CMC AI Assistant preview"
        >
          <span className={styles.activeToggle}>Show</span>
          <span>Hide</span>
        </div>
      </div>

      <div className={styles.divider} />

      <MenuRow label={isVietnamese ? 'Trang cộng đồng của tôi' : 'My Community Page'} />
      <MenuRow label={isVietnamese ? 'Cài đặt' : 'Settings'} />

      <button
        className={`${styles.menuLink} ${styles.logoutButton}`}
        type="button"
        role="menuitem"
        onClick={onLogout}
      >
        {isVietnamese ? 'Đăng xuất' : 'Log out'}
      </button>

      <div className={styles.divider} />

      <div className={styles.footerActions}>
        <span className={styles.footerButton}>
          Get listed
          {/* <span aria-hidden="true">⌄</span> */}
        </span>
        <span className={styles.footerButton}>API</span>
      </div>
    </div>
  );
}
