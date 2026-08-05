import type { FormEvent } from 'react';

import { PageContainer } from '@/components/layout/PageContainer';

import { footerGroups } from './footer.data';
import styles from './SiteFooter.module.css';

export function SiteFooter() {
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
              Stay on top of crypto. All the time, any time.
            </h2>

            <p className={styles.newsletterDescription}>
              Receive the latest crypto news, market research,
              product updates and important ecosystem events.
            </p>

            <form
              className={styles.newsletterForm}
              onSubmit={handleNewsletterSubmit}
            >
              <label
                className={styles.srOnly}
                htmlFor="footer-newsletter-email"
              >
                Email address
              </label>

              <input
                id="footer-newsletter-email"
                className={styles.newsletterInput}
                type="email"
                autoComplete="email"
                placeholder="Enter your e-mail address"
                required
              />

              <button
                className={styles.newsletterButton}
                type="submit"
              >
                Submit
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
            <button type="button" className={styles.preferenceButton}>
              Language
            </button>

            <button type="button" className={styles.preferenceButton}>
              USD
            </button>
          </div>
        </div>

        <div className={styles.linkGrid}>
          {footerGroups.map((group) => (
            <section key={group.title} className={styles.linkGroup}>
              <h3 className={styles.groupTitle}>{group.title}</h3>

              <ul className={styles.linkList}>
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a className={styles.link} href={link.href}>
                      <span>{link.label}</span>

                      {link.badge && (
                        <span className={styles.badge}>
                          {link.badge}
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
            © {new Date().getFullYear()} 1CoinMarketCap. All rights
            reserved.
          </p>

          <div className={styles.storeBadges}>
            <span className={styles.storeBadge}>
              Download on the App Store
            </span>

            <span className={styles.storeBadge}>
              Get it on Google Play
            </span>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}