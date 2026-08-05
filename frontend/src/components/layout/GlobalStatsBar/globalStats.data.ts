export type GlobalStatItem = {
  label: string;
  value: string;
  tone?: 'default' | 'positive' | 'negative';
};

export const globalStats: GlobalStatItem[] = [
  {
    label: 'Cryptos',
    value: '55.36M',
  },
  {
    label: 'Exchanges',
    value: '961',
  },
  {
    label: 'Market Cap',
    value: '$2.16T',
  },
  {
    label: '24h Vol',
    value: '$62.42B',
  },
  {
    label: 'Dominance',
    value: 'BTC: 58.4% ETH: 10.4%',
  },
  {
    label: 'ETH Gas',
    value: '0.06 Gwei',
  },
  {
    label: 'Fear & Greed',
    value: '34/100',
  },
];