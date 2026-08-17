import {
  type FormEvent,
  useEffect,
  useState,
} from 'react';

import { useAuthStore } from '@/store/useAuthStore';

import styles from './AuthModal.module.css';

type AuthMode = 'login' | 'register';

type AuthModalProps = {
  initialMode?: AuthMode;
  onClose: () => void;
};

const MIN_PASSWORD_LENGTH = 6;

export function AuthModal({
  initialMode = 'login',
  onClose,
}: AuthModalProps) {
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const storeError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');
  const [validationError, setValidationError] =
    useState<string | null>(null);
  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setPassword('');
    setConfirmPassword('');
    setValidationError(null);
    setSuccessMessage(null);
    clearError();
  };

  const validateForm = (): string | null => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      return 'Vui lòng nhập email.';
    }

    if (!normalizedEmail.includes('@')) {
      return 'Email không hợp lệ.';
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return `Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`;
    }

    if (
      mode === 'register' &&
      password !== confirmPassword
    ) {
      return 'Mật khẩu xác nhận không khớp.';
    }

    return null;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const error = validateForm();

    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    setSuccessMessage(null);
    clearError();

    const credentials = {
      email: email.trim().toLowerCase(),
      password,
    };

    if (mode === 'login') {
      const success = await login(credentials);

      if (success) {
        onClose();
      }

      return;
    }

    const success = await register(credentials);

    if (success) {
      setSuccessMessage(
        'Đăng ký thành công. Bạn có thể đăng nhập ngay.',
      );

      setPassword('');
      setConfirmPassword('');
      setMode('login');
    }
  };

  const displayedError =
    validationError ?? storeError;

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Đóng cửa sổ xác thực"
        >
          ×
        </button>

        <div className={styles.brand}>
          <span className={styles.logoMark}>1</span>
          <span>CoinMarketCap</span>
        </div>

        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            className={`${styles.tabButton} ${
              mode === 'login' ? styles.activeTab : ''
            }`}
            onClick={() => switchMode('login')}
          >
            Log In
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={mode === 'register'}
            className={`${styles.tabButton} ${
              mode === 'register' ? styles.activeTab : ''
            }`}
            onClick={() => switchMode('register')}
          >
            Sign Up
          </button>
        </div>

        <h2 id="auth-modal-title" className={styles.title}>
          {mode === 'login'
            ? 'Welcome back'
            : 'Create your account'}
        </h2>

        <p className={styles.description}>
          {mode === 'login'
            ? 'Log in to manage your portfolio and watchlist.'
            : 'Create an account to save coins to your watchlist.'}
        </p>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
          noValidate
        >
          <label className={styles.field}>
            <span className={styles.label}>Email</span>

            <input
              className={styles.input}
              type="email"
              value={email}
              autoComplete="email"
              placeholder="you@example.com"
              disabled={loading}
              onChange={(event) => {
                setEmail(event.target.value);
                setValidationError(null);
              }}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Password</span>

            <input
              className={styles.input}
              type="password"
              value={password}
              autoComplete={
                mode === 'login'
                  ? 'current-password'
                  : 'new-password'
              }
              placeholder="At least 6 characters"
              disabled={loading}
              onChange={(event) => {
                setPassword(event.target.value);
                setValidationError(null);
              }}
            />
          </label>

          {mode === 'register' && (
            <label className={styles.field}>
              <span className={styles.label}>
                Confirm password
              </span>

              <input
                className={styles.input}
                type="password"
                value={confirmPassword}
                autoComplete="new-password"
                placeholder="Enter password again"
                disabled={loading}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setValidationError(null);
                }}
              />
            </label>
          )}

          {displayedError && (
            <div className={styles.errorMessage} role="alert">
              {displayedError}
            </div>
          )}

          {successMessage && (
            <div
              className={styles.successMessage}
              role="status"
            >
              {successMessage}
            </div>
          )}

          <button
            className={styles.submitButton}
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Processing...'
              : mode === 'login'
                ? 'Log In'
                : 'Create Account'}
          </button>
        </form>

        <p className={styles.switchText}>
          {mode === 'login'
            ? 'New to CoinMarketCap?'
            : 'Already have an account?'}

          <button
            type="button"
            className={styles.switchButton}
            onClick={() =>
              switchMode(
                mode === 'login' ? 'register' : 'login',
              )
            }
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </section>
    </div>
  );
}
