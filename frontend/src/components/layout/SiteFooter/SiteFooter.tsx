import type { FormEvent } from 'react';

import { PageContainer } from '@/components/layout/PageContainer';
import { usePreferencesStore } from '@/store/usePreferencesStore';

import { footerGroups } from './footer.data';
import styles from './SiteFooter.module.css';

export function SiteFooter() {
  const language = usePreferencesStore((state) => state.language);
  const currency = usePreferencesStore((state) => state.currency);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);
  const setCurrency = usePreferencesStore((state) => state.setCurrency);
  const vi = language === 'vi';
  const translations: Record<string, string> = {
    Products: 'Sản phẩm', Advertise: 'Quảng cáo', 'Top Stories': 'Tin nổi bật',
    Portfolio: 'Danh mục', Watchlist: 'Theo dõi', Company: 'Công ty',
    'About us': 'Về chúng tôi', 'Terms of use': 'Điều khoản sử dụng',
    'Privacy Policy': 'Chính sách riêng tư', 'Cookie preferences': 'Tùy chọn cookie',
    Careers: 'Tuyển dụng', Support: 'Hỗ trợ', 'Get listed': 'Đăng ký niêm yết',
    'Request Form': 'Biểu mẫu yêu cầu', 'Contact Support': 'Liên hệ hỗ trợ',
    Glossary: 'Thuật ngữ', Socials: 'Mạng xã hội', Community: 'Cộng đồng',
  };
  const translate = (text: string) => (vi ? translations[text] ?? text : text);
  const handleNewsletterSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <footer className={styles.footer}>
      <section className={styles.newsletter}>
        <PageContainer className={styles.newsletterInner}>
          <div className={styles.newsletterContent}>
            <h2 className={styles.newsletterTitle}>
              {vi
                ? 'Luôn cập nhật thị trường crypto, mọi lúc mọi nơi.'
                : 'Stay on top of crypto. All the time, any time.'}
            </h2>

            <p className={styles.newsletterDescription}>
              {vi
                ? 'Nhận tin tức crypto, nghiên cứu thị trường, cập nhật sản phẩm và các sự kiện hệ sinh thái mới nhất.'
                : 'Receive the latest crypto news, market research, product updates and important ecosystem events.'}
            </p>

            <form
              className={styles.newsletterForm}
              onSubmit={handleNewsletterSubmit}
            >
              <label
                className={styles.srOnly}
                htmlFor="footer-newsletter-email"
              >
                {vi ? 'Địa chỉ email' : 'Email address'}
              </label>

              <input
                id="footer-newsletter-email"
                className={styles.newsletterInput}
                type="email"
                autoComplete="email"
                placeholder={vi ? 'Nhập địa chỉ email' : 'Enter your e-mail address'}
                required
              />

              <button
                className={styles.newsletterButton}
                type="submit"
              >
                {vi ? 'Đăng ký' : 'Submit'}
              </button>
            </form>
          </div>

          <div
            className={styles.newsletterVisual}
            aria-hidden="true"
          >
            <span className={styles.visualBar} />
            <span className={styles.visualBar} />
            <span className={styles.visualBar} />
            <span className={styles.visualCoin}>₿</span>
          </div>
        </PageContainer>
      </section>

      <PageContainer className={styles.footerInner}>
        <div className={styles.brandColumn}>
          <a
            className={styles.brand}
            href="#top"
            aria-label="1CoinMarketCap homepage"
          >
            <span className={styles.brandMark}>1</span>
            <span>CoinMarketCap</span>
          </a>

          <div className={styles.preferences}>
            <button
              type="button"
              className={styles.preferenceButton}
              onClick={() => setLanguage(vi ? 'en' : 'vi')}
            >
              {vi ? 'Tiếng Việt' : 'English'}
            </button>

            <button
              type="button"
              className={styles.preferenceButton}
              onClick={() => setCurrency(currency === 'USD' ? 'VND' : 'USD')}
            >
              {currency}
            </button>
          </div>
        </div>

        <div className={styles.linkGrid}>
          {footerGroups.map((group) => (
            <section key={group.title} className={styles.linkGroup}>
              <h3 className={styles.groupTitle}>{translate(group.title)}</h3>

              <ul className={styles.linkList}>
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a className={styles.link} href={link.href}>
                      <span>{translate(link.label)}</span>

                      {link.badge && (
                        <span className={styles.badge}>
                          {vi && link.badge === "We're hiring!"
                            ? 'Đang tuyển dụng!'
                            : link.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className={styles.bottomRow}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} 1CoinMarketCap.{' '}
            {vi ? 'Đã đăng ký bản quyền.' : 'All rights reserved.'}
          </p>

          <div className={styles.storeBadges}>
            <span className={styles.storeBadge}>
              {vi ? 'Tải trên App Store' : 'Download on the App Store'}
            </span>

            <span className={styles.storeBadge}>
              {vi ? 'Tải trên Google Play' : 'Get it on Google Play'}
            </span>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}
