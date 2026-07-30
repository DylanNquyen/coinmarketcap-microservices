import { create } from 'zustand';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

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
  isUp?: boolean; // Cờ nhận biết tăng/giảm để đổi màu xanh/đỏ
}

interface CryptoState {
  coins: Coin[];
  loading: boolean;
  socket: Socket | null;
  fetchCoins: () => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

// ⚠️ QUAN TRỌNG: Gọi API qua Kong Gateway Port 8000
const GATEWAY_URL = 'http://localhost:8000';
const BACKEND_WS_URL = 'http://localhost:3001'; // WebSocket kết nối thẳng tới backend

export const useCryptoStore = create<CryptoState>((set, get) => ({
  coins: [],
  loading: false,
  socket: null,

  // 1. Gọi REST API lấy dữ liệu qua Kong Gateway
  fetchCoins: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${GATEWAY_URL}/api/crypto`);
      set({ coins: response.data, loading: false });
    } catch (error) {
      console.error('Lỗi fetch coins qua Gateway:', error);
      set({ loading: false });
    }
  },

  // 2. Kết nối WebSocket để nhận biến động giá Realtime
  connectSocket: () => {
    if (get().socket) return; // Tránh tạo lại socket trùng lặp

    const socket = io(BACKEND_WS_URL);

    socket.on('connect', () => {
      console.log('⚡ Frontend đã kết nối Realtime WebSocket!');
    });

    // Lắng nghe event 'price_updates' do CryptoGateway ở backend bắn xuống
    socket.on('price_updates', (updatedCoins: Coin[]) => {
      set({ coins: updatedCoins });
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));