export const colors = {
  background: {
    primary: '#0D1421',
    secondary: '#171924',
    elevated: '#222531',
    card: '#292D3F',
    hover: '#323546',
  },

  text: {
    primary: '#FFFFFF',
    secondary: '#A1A7BB',
    muted: '#858CA2',
    disabled: '#646B80',
  },

  border: {
    primary: '#222531',
    secondary: '#323546',
    interactive: '#40424E',
  },

  brand: {
    primary: '#6188FF',
    primaryHover: '#3861FB',
    primaryAlpha: 'rgba(97, 136, 255, 0.12)',
  },

  status: {
    positive: '#16C784',
    positiveAlpha: 'rgba(22, 199, 132, 0.12)',
    negative: '#EA3943',
    negativeAlpha: 'rgba(234, 57, 67, 0.12)',
    warning: '#F5B97F',
  },

  common: {
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },
} as const;

export type Colors = typeof colors;