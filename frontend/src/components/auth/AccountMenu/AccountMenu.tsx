import styles from './AccountMenu.module.css';

type AccountMenuProps = {
  email: string;
  displayName: string;
  onLogout: () => void;
};

type MenuRowProps = {
  label: string;
  value?: string;
  accent?: boolean;
};

function MenuRow({
  label,
  value,
  accent = false,
}: MenuRowProps) {
  return (
    <div className={styles.menuRow} role="menuitem">
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
    </div>
  );
}

export function AccountMenu({
  email,
  displayName,
  onLogout,
}: AccountMenuProps) {
  const avatarInitial =
    displayName.charAt(0).toUpperCase() || 'U';

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

      <MenuRow label="API Dashboard" />

      <div className={styles.divider} />

      <MenuRow label="Language" value="English  ›" />
      <MenuRow label="Currency" value="$  USD  ›" accent />

      <div className={styles.menuRow} role="menuitem">
        <span>Theme</span>
        <div
          className={styles.segmentedControl}
          aria-label="Theme preview"
        >
          <span>Light</span>
          <span className={styles.activeSegment}>Dark</span>
          <span>System</span>
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

      <MenuRow label="My Community Page" />
      <MenuRow label="Settings" />

      <button
        className={`${styles.menuLink} ${styles.logoutButton}`}
        type="button"
        role="menuitem"
        onClick={onLogout}
      >
        Log out
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
