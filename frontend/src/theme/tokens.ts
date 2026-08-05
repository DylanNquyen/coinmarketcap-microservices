import { breakpoints, breakpointValues } from './breakpoints';
import { colors } from './colors';
import { radius } from './radius';
import { shadows } from './shadows';
import { layoutSpacing, spacing } from './spacing';
import {
  fontFamily,
  fontWeight,
  typography,
} from './typography';

export const tokens = {
  colors,
  spacing,
  layoutSpacing,
  typography,
  fontFamily,
  fontWeight,
  radius,
  shadows,
  breakpoints,
  breakpointValues,

  layout: {
    pageWidth: '100%',
    pageMaxWidth: '1920px',
    pagePaddingInline: spacing[4],

    headerHeight: '48px',
    secondaryNavigationHeight: '57px',

    logoWidth: '168px',
    logoHeight: '29px',

    iconSize: '24px',
    toolbarButtonHeight: '32px',
  },

  transition: {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '400ms ease',
  },

  zIndex: {
    base: 0,
    sticky: 100,
    header: 200,
    dropdown: 300,
    drawer: 400,
    modal: 500,
    tooltip: 600,
  },
} as const;

export type ThemeTokens = typeof tokens;