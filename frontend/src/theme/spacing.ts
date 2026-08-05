export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '24px',
  6: '32px',
  7: '48px',
} as const;

export const layoutSpacing = {
  pageInline: spacing[4],
  sectionGap: spacing[5],
  cardPadding: spacing[4],
  tableCellInline: spacing[4],
  iconTextGap: spacing[2],
} as const;

export type Spacing = typeof spacing;