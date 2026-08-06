import styles from './AdvertisementCard.module.css';
import { usePreferencesStore } from '@/store/usePreferencesStore';

export function AdvertisementCard() {
  const vi = usePreferencesStore((state) => state.language) === 'vi';
  return (
    <aside className={styles.card} aria-label="Advertisement">
      <div className={styles.content}>
        <p className={styles.title}>
          {vi ? 'Đưa thương hiệu của bạn tiếp cận' : 'Put your brand in front of'}
          <strong>
            {vi ? 'hơn 300 triệu lượt xem mỗi tháng' : '300M+ monthly page views'}
          </strong>
        </p>

        <span className={styles.description}>
          {vi ? 'Nút mua, banner, màn hình quảng cáo và nhiều hơn nữa' : 'Buy Buttons, Banners, Splash Screens & more'}
        </span>
      </div>

      <button className={styles.button} type="button">
        <span>{vi ? 'Quảng cáo trên' : 'Advertise on'}</span>
        <strong>CoinMarketCap</strong>
        <span aria-hidden="true">→</span>
      </button>

      <span className={styles.badge}>{vi ? 'QC' : 'Ad'}</span>
    </aside>
  );
}
