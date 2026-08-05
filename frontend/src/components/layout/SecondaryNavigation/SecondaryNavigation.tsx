import { secondaryNavigationItems } from './secondaryNavigation.data';
import styles from './SecondaryNavigation.module.css';

export function SecondaryNavigation() {
  return (
    <nav
      className={styles.navigation}
      aria-label="Secondary cryptocurrency navigation"
    >
      <div className={styles.scroller}>
        <ul className={styles.list}>
          {secondaryNavigationItems.map((item) => (
            <li key={item.label} className={styles.item}>
              <a
                className={[
                  styles.link,
                  item.active ? styles.active : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                href={item.href}
                aria-current={item.active ? 'page' : undefined}
              >
                <span>{item.label}</span>

                {item.hasDropdown && (
                  <span className={styles.dropdownIcon} aria-hidden="true">
                    ▾
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}