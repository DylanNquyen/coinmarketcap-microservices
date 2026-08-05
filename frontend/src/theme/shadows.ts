export const shadows = {
  none: 'none',

  dropdown: [
    '0 4px 24px rgba(88, 102, 126, 0.08)',
    '0 1px 2px rgba(88, 102, 126, 0.12)',
  ].join(', '),

  card: '0 1px 2px rgba(88, 102, 126, 0.08)',

  focus: '0 0 0 3px rgba(97, 136, 255, 0.3)',
} as const;

export type Shadows = typeof shadows;