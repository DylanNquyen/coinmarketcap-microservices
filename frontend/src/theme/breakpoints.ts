export const breakpointValues = {
  mobileSmall: 430,
  mobile: 640,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  wide: 1400,
  ultraWide: 1920,
} as const;

const toMediaQuery = (width: number): string => `(min-width: ${width}px)`;

const toMaxMediaQuery = (width: number): string =>
  `(max-width: ${width - 0.02}px)`;

export const breakpoints = {
  up: {
    mobileSmall: toMediaQuery(breakpointValues.mobileSmall),
    mobile: toMediaQuery(breakpointValues.mobile),
    tablet: toMediaQuery(breakpointValues.tablet),
    laptop: toMediaQuery(breakpointValues.laptop),
    desktop: toMediaQuery(breakpointValues.desktop),
    wide: toMediaQuery(breakpointValues.wide),
    ultraWide: toMediaQuery(breakpointValues.ultraWide),
  },

  down: {
    mobileSmall: toMaxMediaQuery(breakpointValues.mobileSmall),
    mobile: toMaxMediaQuery(breakpointValues.mobile),
    tablet: toMaxMediaQuery(breakpointValues.tablet),
    laptop: toMaxMediaQuery(breakpointValues.laptop),
    desktop: toMaxMediaQuery(breakpointValues.desktop),
    wide: toMaxMediaQuery(breakpointValues.wide),
    ultraWide: toMaxMediaQuery(breakpointValues.ultraWide),
  },
} as const;

export type Breakpoints = typeof breakpoints;