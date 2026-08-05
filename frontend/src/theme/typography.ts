export const fontFamily = {
  primary:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  monospace:
    '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const typography = {
  body: {
    fontSize: '15px',
    fontWeight: fontWeight.regular,
    lineHeight: '22.5px',
  },

  navigation: {
    fontSize: '15px',
    fontWeight: fontWeight.regular,
    lineHeight: '22.5px',
  },

  activeTab: {
    fontSize: '20px',
    fontWeight: fontWeight.semibold,
    lineHeight: '30px',
  },

  coinName: {
    fontSize: '14px',
    fontWeight: fontWeight.semibold,
    lineHeight: '24px',
  },

  button: {
    fontSize: '12px',
    fontWeight: fontWeight.semibold,
    lineHeight: '18px',
  },

  small: {
    fontSize: '12px',
    fontWeight: fontWeight.regular,
    lineHeight: '18px',
  },

  caption: {
    fontSize: '11px',
    fontWeight: fontWeight.regular,
    lineHeight: '16px',
  },
} as const;

export type Typography = typeof typography;