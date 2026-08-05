export const radius = {
  none: '0',
  small: '4px',
  medium: '8px',
  large: '12px',
  card: '8px',
  button: '8px',
  input: '8px',
  pill: '999px',
  circle: '50%',
} as const;

export type Radius = typeof radius;