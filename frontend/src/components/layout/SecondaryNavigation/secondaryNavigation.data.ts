export type SecondaryNavigationItem = {
  label: string;
  href: string;
  active?: boolean;
  hasDropdown?: boolean;
};

export const secondaryNavigationItems: SecondaryNavigationItem[] = [
  {
    label: 'Top',
    href: '#top',
    active: true,
  },
  {
    label: 'Trending',
    href: '#trending',
  },
  {
    label: 'Watchlist',
    href: '#watchlist',
  },
  {
    label: 'Stocks',
    href: '#stocks',
  },
  {
    label: 'Prediction Markets',
    href: '#prediction-markets',
  },
  {
    label: 'Most Visited',
    href: '#most-visited',
  },
  {
    label: 'New',
    href: '#new',
  },
  {
    label: 'Gainers',
    href: '#gainers',
  },
  {
    label: 'More',
    href: '#more',
    hasDropdown: true,
  },
];