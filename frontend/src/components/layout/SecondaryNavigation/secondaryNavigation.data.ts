export type SecondaryNavigationItem = {
  label: string;
  href: string;
};

export interface MoreNavigationItem {
  label: string;
  href: string;
  icon?: string;
}

export const secondaryNavigationItems: SecondaryNavigationItem[] = [
  {
    label: 'Top',
    href: '#top',
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
];

export const moreNavigationItems: MoreNavigationItem[] = [
  { label: 'Rehypo', href: '#rehypo', icon: '\u267B' },
  { label: 'Binance Alpha', href: '#binance-alpha', icon: '\u{1F525}' },
  { label: 'bStocks', href: '#bstocks', icon: '\u{1F525}' },
  { label: 'Memes', href: '#memes', icon: '\u{1F525}' },
  { label: 'SOL', href: '#sol', icon: '\u{1F525}' },
  { label: 'BNB', href: '#bnb', icon: '\u{1F525}' },
  { label: 'X Layer', href: '#x-layer', icon: '\u{1F525}' },
  { label: 'AI', href: '#ai', icon: '\u{1F525}' },
  {
    label: 'RWA Protocols',
    href: '#rwa-protocols',
    icon: '\u{1F525}',
  },
  { label: 'Gaming', href: '#gaming', icon: '\u{1F525}' },
  { label: 'DePIN', href: '#depin', icon: '\u{1F525}' },
  { label: 'More Categories', href: '#more-categories' },
  { label: 'Token unlocks', href: '#token-unlocks' },
  { label: "NFT's", href: '#nfts' },
  { label: 'Yield', href: '#yield' },
];
