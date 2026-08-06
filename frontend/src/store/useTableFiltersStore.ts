import { create } from 'zustand';

export type TableFilters = {
  visibleLimit: number;
  marketCapMin: number | null;
  marketCapMax: number | null;
  priceChange24hMin: number | null;
  priceChange24hMax: number | null;
  volume24hMin: number | null;
  volume24hMax: number | null;
};

export const defaultTableFilters: TableFilters = {
  visibleLimit: 100,
  marketCapMin: null,
  marketCapMax: null,
  priceChange24hMin: null,
  priceChange24hMax: null,
  volume24hMin: null,
  volume24hMax: null,
};

type TableFiltersState = {
  filters: TableFilters;
  setFilters: (filters: TableFilters) => void;
  resetFilters: () => void;
};

export const useTableFiltersStore = create<TableFiltersState>(
  (set) => ({
    filters: defaultTableFilters,
    setFilters: (filters) => set({ filters }),
    resetFilters: () => set({ filters: defaultTableFilters }),
  }),
);
