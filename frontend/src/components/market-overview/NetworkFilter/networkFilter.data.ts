export const networkItems = [
  { id: 'all', name: 'All Networks', color: '#3861fb' },
  { id: 'bsc', name: 'BSC', color: '#f3ba2f' },
  { id: 'solana', name: 'Solana', color: '#14f195' },
  { id: 'base', name: 'Base', color: '#0052ff' },
  { id: 'ethereum', name: 'Ethereum', color: '#ffffff' },
  { id: 'arbitrum', name: 'Arbitrum', color: '#28a0f0' },
  { id: 'avalanche', name: 'Avalanche', color: '#e84142' },
  { id: 'polygon', name: 'Polygon', color: '#8247e5' },
  { id: 'optimism', name: 'Optimism', color: '#ff0420' },
  { id: 'sui', name: 'Sui', color: '#4da2ff' },
] as const;

export type NetworkItem = (typeof networkItems)[number];

export type NetworkId = NetworkItem['id'];