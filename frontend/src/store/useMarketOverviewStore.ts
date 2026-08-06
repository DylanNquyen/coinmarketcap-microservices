import { create } from 'zustand';

import {
  fetchMarketOverviewApi,
  type MarketOverviewData,
} from '@/api/marketOverviewApi';

interface MarketOverviewState {
  data: MarketOverviewData | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  fetchMarketOverview: () => Promise<void>;
}

export const useMarketOverviewStore =
  create<MarketOverviewState>((set, get) => ({
    data: null,
    loading: false,
    initialized: false,
    error: null,

    fetchMarketOverview: async () => {
      if (get().loading) {
        return;
      }

      set({ loading: true, error: null });

      try {
        const data = await fetchMarketOverviewApi();

        set({
          data,
          loading: false,
          initialized: true,
        });
      } catch (error) {
        console.error('Unable to fetch market overview:', error);
        set({
          loading: false,
          error: 'Unable to load live market overview data.',
        });
      }
    },
  }));
