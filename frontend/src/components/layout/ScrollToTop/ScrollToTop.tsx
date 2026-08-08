import { useEffect, useState } from 'react';

import styles from './ScrollToTop.module.css';

const VISIBILITY_THRESHOLD = 400;

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > VISIBILITY_THRESHOLD);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <button
      className={`${styles.button} ${isVisible ? styles.visible : ''}`}
      type="button"
      aria-label="Lên đầu trang"
      title="Lên đầu trang"
      tabIndex={isVisible ? 0 : -1}
      onClick={scrollToTop}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
      >
        <path
          d="m6 15 6-6 6 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
