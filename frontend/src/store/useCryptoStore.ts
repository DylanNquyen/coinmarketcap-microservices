import { create } from 'zustand';
import axios from 'axios';

// Định nghĩa kiểu dữ liệu cho Coin dựa trên dữ liệu thật từ Backend
export interface Coin {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  image: string;
  price: number;
  priceChange1h: number;
  priceChange24h: number;
  priceChange7d: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
}

interface CryptoState {
  coins: Coin[];
  loading: boolean;
  fetchCoins: () => Promise<void>;
}

export const useCryptoStore = create<CryptoState>((set) => ({
  coins: [],
  loading: false,
  fetchCoins: async () => {
    set({ loading: true });
    try {
      // Gọi tới endpoint NestJS đã chạy trong hình image_cfce19.png
      const response = await axios.get('http://localhost:3001/api/crypto');
      set({ coins: response.data, loading: false });
    } catch (error) {
      console.error('Lỗi khi fetch dữ liệu từ Backend:', error);
      set({ loading: false });
    }
  },
}));