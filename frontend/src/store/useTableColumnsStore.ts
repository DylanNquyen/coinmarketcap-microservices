import { create } from 'zustand';

export type OptionalCoinColumn =
  | 'priceChange1h'
  | 'priceChange24h'
  | 'priceChange7d'
  | 'marketCap'
  | 'volume24h'
  | 'circulatingSupply'
  | 'sparkline7d';

export const defaultVisibleColumns: OptionalCoinColumn[] = [
  'priceChange1h',
  'priceChange24h',
  'priceChange7d',
  'marketCap',
  'volume24h',
  'circulatingSupply',
  'sparkline7d',
];

type TableColumnsState = {
  visibleColumns: OptionalCoinColumn[];
  setVisibleColumns: (columns: OptionalCoinColumn[]) => void;
  resetColumns: () => void;
};

export const useTableColumnsStore = create<TableColumnsState>(
  (set) => ({
    visibleColumns: defaultVisibleColumns,
    setVisibleColumns: (columns) =>
      set({ visibleColumns: columns }),
    resetColumns: () =>
      set({ visibleColumns: defaultVisibleColumns }),
  }),
);
