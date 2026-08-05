export type NavigationItem = {
  label: string;
  href: string;
  hasDropdown?: boolean;
};

export const primaryNavigation: NavigationItem[] = [
  {
    label: 'Cryptocurrencies',
    href: '#cryptocurrencies',
  },
  {
    label: 'Dashboards',
    href: '#dashboards',
  },
  {
    label: 'DexScan',
    href: '#dexscan',
  },
  {
    label: 'Exchanges',
    href: '#exchanges',
  },
  {
    label: 'Community',
    href: '#community',
  },
  {
    label: 'API',
    href: '#api',
  },
  {
    label: 'Products',
    href: '#products',}
];