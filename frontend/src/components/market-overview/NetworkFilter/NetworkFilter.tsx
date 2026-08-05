import { useState } from 'react';

import {
  networkItems,
  type NetworkId,
} from './networkFilter.data';
import styles from './NetworkFilter.module.css';

export function NetworkFilter() {
  const [activeId, setActiveId] = useState<NetworkId>('all');

  const handleNetworkChange = (networkId: NetworkId) => {
    setActiveId(networkId);
  };

  return (
    <nav
      className={styles.container}
      aria-label="Network selection filter"
    >
      <div className={styles.scroller}>
        <ul className={styles.list}>
          {networkItems.map((network) => {
            const isActive = activeId === network.id;

            return (
              <li key={network.id} className={styles.item}>
                <button
                  type="button"
                  className={[
                    styles.pill,
                    isActive ? styles.active : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-pressed={isActive}
                  onClick={() => handleNetworkChange(network.id)}
                >
                  <span
                    className={styles.dot}
                    style={{ backgroundColor: network.color }}
                    aria-hidden="true"
                  />

                  <span>{network.name}</span>
                </button>
              </li>
            );
          })}

          <li className={styles.item}>
            <button
              type="button"
              className={styles.moreButton}
              aria-haspopup="menu"
              aria-expanded={false}
              aria-label="Show more networks"
            >
              <span>More</span>

              <span className={styles.arrow} aria-hidden="true">
                ▾
              </span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}