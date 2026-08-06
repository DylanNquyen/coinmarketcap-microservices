// import { create } from 'zustand';
// import axios from 'axios';
// import { io, Socket } from 'socket.io-client';

// // Định nghĩa kiểu dữ liệu cho Coin dựa trên dữ liệu thật từ Backend
// export interface Coin {
//   id: string;
//   rank: number;
//   name: string;
//   symbol: string;
//   image: string;
//   price: number;
//   priceChange1h: number;
//   priceChange24h: number;
//   priceChange7d: number;
//   marketCap: number;
//   volume24h: number;
//   circulatingSupply: number;
//   sparkline7d: number[];
//   isUp?: boolean; // Cờ nhận biết tăng/giảm để đổi màu xanh/đỏ
// }

// interface CryptoState {
//   coins: Coin[];
//   loading: boolean;
//   socket: Socket | null;
//   fetchCoins: () => Promise<void>;
//   connectSocket: () => void;
//   disconnectSocket: () => void;
// }

// // ⚠️ QUAN TRỌNG: Gọi API qua Kong Gateway Port 8000
// const GATEWAY_URL = 'http://localhost:8000';
// const BACKEND_WS_URL = 'http://localhost:3001'; // WebSocket kết nối thẳng tới backend

// export const useCryptoStore = create<CryptoState>((set, get) => ({
//   coins: [],
//   loading: false,
//   socket: null,

//   // 1. Gọi REST API lấy dữ liệu qua Kong Gateway
//   fetchCoins: async () => {
//     set({ loading: true });
//     try {
//       const response = await axios.get(`${GATEWAY_URL}/api/crypto`);
//       set({ coins: response.data, loading: false });
//     } catch (error) {
//       console.error('Lỗi fetch coins qua Gateway:', error);
//       set({ loading: false });
//     }
//   },

//   // 2. Kết nối WebSocket để nhận biến động giá Realtime
//   connectSocket: () => {
//     if (get().socket) return; // Tránh tạo lại socket trùng lặp

//     const socket = io(BACKEND_WS_URL);

//     socket.on('connect', () => {
//       console.log('⚡ Frontend đã kết nối Realtime WebSocket!');
//     });

//     // Lắng nghe event 'price_updates' do CryptoGateway ở backend bắn xuống
//     socket.on('price_updates', (updatedCoins: Coin[]) => {
//       set({ coins: updatedCoins });
//     });

//     set({ socket });
//   },

//   disconnectSocket: () => {
//     const socket = get().socket;
//     if (socket) {
//       socket.disconnect();
//       set({ socket: null });
//     }
//   },
// }));

import axios from 'axios';
import { io, type Socket } from 'socket.io-client';
import { create } from 'zustand';

import {
  addToWatchlistApi,
  fetchWatchlistApi,
  removeFromWatchlistApi,
} from '@/api/watchlistApi';

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
  sparkline7d: number[];
  networks?: string[];
  isUp?: boolean;
}

interface CryptoState {
  coins: Coin[];
  loading: boolean;
  socket: Socket | null;
  initialized: boolean;

  watchlistCoinIds: Set<string>;
  watchlistLoading: boolean;
  pendingWatchlistCoinIds: Set<string>;
  watchlistError: string | null;

  initialize: () => Promise<void>;
  fetchCoins: () => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;

  fetchWatchlist: () => Promise<void>;
  toggleWatchlist: (coinId: string) => Promise<void>;
  clearWatchlistState: () => void;
}

const GATEWAY_URL =
  import.meta.env.VITE_API_URL ??
  'http://localhost:8000';

const BACKEND_WS_URL =
  import.meta.env.VITE_WS_URL ??
  'http://localhost:3001';

function getWatchlistErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return 'Không thể cập nhật Watchlist.';
  }

  const status = error.response?.status;

  if (!error.response) {
    return 'Không thể kết nối tới API Gateway.';
  }

  if (status === 401) {
    return 'Bạn cần đăng nhập để sử dụng Watchlist.';
  }

  if (status === 409) {
    return 'Coin đã tồn tại trong Watchlist.';
  }

  if (status === 404) {
    return 'Coin không tồn tại trong Watchlist.';
  }

  const message = error.response.data?.message;

  return typeof message === 'string'
    ? message
    : 'Không thể cập nhật Watchlist.';
}

export const useCryptoStore = create<CryptoState>(
  (set, get) => ({
    coins: [],
    loading: false,
    socket: null,
    initialized: false,
    watchlistCoinIds: new Set<string>(),
    watchlistLoading: false,
    pendingWatchlistCoinIds: new Set<string>(),
    watchlistError: null,

    initialize: async () => {
  if (get().initialized) {
    return;
  }

  // Đánh dấu trước để tránh nhiều component gọi khởi tạo cùng lúc.
  set({ initialized: true });

  try {
    await get().fetchCoins();
    get().connectSocket();
  } catch (error) {
    // Cho phép thử khởi tạo lại nếu lần đầu thất bại ngoài dự kiến.
    set({ initialized: false });

    console.error(
      'Không thể khởi tạo Crypto Store:',
      error,
    );
  }
},

    fetchCoins: async () => {
      set({ loading: true });

      try {
        const response = await axios.get<Coin[]>(
          `${GATEWAY_URL}/api/crypto`,
        );

        set({
          coins: response.data,
          loading: false,
        });
      } catch (error) {
        console.error(
          'Lỗi fetch coins qua Gateway:',
          error,
        );

        set({ loading: false });
      }
    },

    connectSocket: () => {
      if (get().socket) {
        return;
      }

      const socket = io(BACKEND_WS_URL);

      socket.on('connect', () => {
        console.log(
          '⚡ Frontend đã kết nối Realtime WebSocket!',
        );
      });

      socket.on(
        'price_updates',
        (updatedCoins: Coin[]) => {
          set({ coins: updatedCoins });
        },
      );

      set({ socket });
    },

    disconnectSocket: () => {
      const socket = get().socket;

      if (!socket) {
        return;
      }

      socket.disconnect();
      set({ socket: null });
    },

    fetchWatchlist: async () => {
      set({
        watchlistLoading: true,
        watchlistError: null,
      });

      try {
        const items = await fetchWatchlistApi();

        set({
          watchlistCoinIds: new Set(
            items.map((item) => item.coinId),
          ),
          watchlistLoading: false,
        });
      } catch (error) {
        set({
          watchlistCoinIds: new Set<string>(),
          watchlistLoading: false,
          watchlistError:
            getWatchlistErrorMessage(error),
        });
      }
    },

    toggleWatchlist: async (coinId) => {
      const normalizedCoinId = coinId
        .trim()
        .toLowerCase();

      const currentPending =
        get().pendingWatchlistCoinIds;

      if (currentPending.has(normalizedCoinId)) {
        return;
      }

      const wasInWatchlist =
        get().watchlistCoinIds.has(normalizedCoinId);

      const optimisticWatchlist = new Set(
        get().watchlistCoinIds,
      );

      if (wasInWatchlist) {
        optimisticWatchlist.delete(normalizedCoinId);
      } else {
        optimisticWatchlist.add(normalizedCoinId);
      }

      const nextPending = new Set(currentPending);
      nextPending.add(normalizedCoinId);

      set({
        watchlistCoinIds: optimisticWatchlist,
        pendingWatchlistCoinIds: nextPending,
        watchlistError: null,
      });

      try {
        if (wasInWatchlist) {
          await removeFromWatchlistApi(
            normalizedCoinId,
          );
        } else {
          await addToWatchlistApi(
            normalizedCoinId,
          );
        }
      } catch (error) {
        const rollbackWatchlist = new Set(
          get().watchlistCoinIds,
        );

        if (wasInWatchlist) {
          rollbackWatchlist.add(normalizedCoinId);
        } else {
          rollbackWatchlist.delete(
            normalizedCoinId,
          );
        }

        set({
          watchlistCoinIds: rollbackWatchlist,
          watchlistError:
            getWatchlistErrorMessage(error),
        });
      } finally {
        const remainingPending = new Set(
          get().pendingWatchlistCoinIds,
        );

        remainingPending.delete(normalizedCoinId);

        set({
          pendingWatchlistCoinIds:
            remainingPending,
        });
      }
    },

    clearWatchlistState: () => {
      set({
        watchlistCoinIds: new Set<string>(),
        pendingWatchlistCoinIds:
          new Set<string>(),
        watchlistLoading: false,
        watchlistError: null,
      });
    },
  }),
);
