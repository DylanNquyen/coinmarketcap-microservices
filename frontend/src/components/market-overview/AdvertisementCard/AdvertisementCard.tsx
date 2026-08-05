import styles from './AdvertisementCard.module.css';

export function AdvertisementCard() {
  return (
    <aside className={styles.card} aria-label="Advertisement">
      <div className={styles.content}>
        <p className={styles.title}>
          Put your brand in front of
          <strong>300M+ monthly page views</strong>
        </p>

        <span className={styles.description}>
          Buy Buttons, Banners, Splash Screens & more
        </span>
      </div>

      <button className={styles.button} type="button">
        <span>Advertise on</span>
        <strong>CoinMarketCap</strong>
        <span aria-hidden="true">→</span>
      </button>

      <span className={styles.badge}>Ad</span>
    </aside>
  );
}