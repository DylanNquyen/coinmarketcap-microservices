import { create } from 'zustand';

import type { NetworkId } from '@/components/market-overview/NetworkFilter';

type NetworkFilterState = {
  activeNetwork: NetworkId;
  setActiveNetwork: (network: NetworkId) => void;
};

export const useNetworkFilterStore = create<NetworkFilterState>((set) => ({
  activeNetwork: 'all',
  setActiveNetwork: (activeNetwork) => set({ activeNetwork }),
}));
