import { create } from 'zustand';

export type AppLanguage = 'en' | 'vi';
export type AppCurrency = 'USD' | 'VND';
export type AppTheme = 'light' | 'dark' | 'system';

type PreferencesState = {
  language: AppLanguage;
  currency: AppCurrency;
  theme: AppTheme;
  setLanguage: (language: AppLanguage) => void;
  setCurrency: (currency: AppCurrency) => void;
  setTheme: (theme: AppTheme) => void;
  initialize: () => () => void;
};

const STORAGE_KEY = 'cmc-preferences';

type StoredPreferences = Pick<
  PreferencesState,
  'language' | 'currency' | 'theme'
>;

function readPreferences(): StoredPreferences {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');

    return {
      language: value.language === 'vi' ? 'vi' : 'en',
      currency: value.currency === 'VND' ? 'VND' : 'USD',
      theme: ['light', 'dark', 'system'].includes(value.theme)
        ? value.theme
        : 'dark',
    };
  } catch {
    return { language: 'en', currency: 'USD', theme: 'dark' };
  }
}

function persistPreferences(preferences: StoredPreferences): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}

function resolveTheme(theme: AppTheme): Exclude<AppTheme, 'system'> {
  if (theme !== 'system') {
    return theme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyTheme(theme: AppTheme): void {
  document.documentElement.dataset.theme = resolveTheme(theme);
  document.documentElement.style.colorScheme = resolveTheme(theme);
}

const initialPreferences = readPreferences();

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  ...initialPreferences,

  setLanguage: (language) => {
    set({ language });
    persistPreferences({ ...get(), language });
  },

  setCurrency: (currency) => {
    set({ currency });
    persistPreferences({ ...get(), currency });
  },

  setTheme: (theme) => {
    set({ theme });
    applyTheme(theme);
    persistPreferences({ ...get(), theme });
  },

  initialize: () => {
    applyTheme(get().theme);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (get().theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  },
}));

export const USD_TO_VND_RATE = 26_000;
