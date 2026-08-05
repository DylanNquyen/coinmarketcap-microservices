import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';

import {
  loginApi,
  registerApi,
} from '@/api/authApi';

import type {
  AuthCredentials,
  AuthUser,
} from '@/api/auth';

const ACCESS_TOKEN_KEY = 'accessToken';
const AUTH_USER_KEY = 'authUser';

interface JwtPayload {
  sub?: number;
  id?: number;
  email?: string;
  exp?: number;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;

  loading: boolean;
  error: string | null;

  isAuthenticated: boolean;

  login: (
    credentials: AuthCredentials,
  ) => Promise<boolean>;

  register: (
    credentials: AuthCredentials,
  ) => Promise<boolean>;

  logout: () => void;
  clearError: () => void;
}

function parseStoredUser(): AuthUser | null {
  const storedUser = localStorage.getItem(AUTH_USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

function decodeUser(
  accessToken: string,
  fallbackEmail: string,
): AuthUser {
  const payload = jwtDecode<JwtPayload>(accessToken);

  return {
    sub: payload.sub,
    id: payload.id,
    email: payload.email ?? fallbackEmail,
  };
}

function getErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return 'Đã xảy ra lỗi không xác định.';
  }

  if (!error.response) {
    return 'Không thể kết nối tới API Gateway.';
  }

  const responseMessage = error.response.data?.message;

  if (Array.isArray(responseMessage)) {
    return responseMessage.join(', ');
  }

  if (typeof responseMessage === 'string') {
    return responseMessage;
  }

  switch (error.response.status) {
    case 400:
      return 'Dữ liệu đăng nhập không hợp lệ.';
    case 401:
      return 'Email hoặc mật khẩu không chính xác.';
    case 409:
      return 'Email đã được đăng ký.';
    case 500:
      return 'Máy chủ đang gặp sự cố.';
    default:
      return `Yêu cầu thất bại với mã HTTP ${error.response.status}.`;
  }
}

const storedToken =
  localStorage.getItem(ACCESS_TOKEN_KEY);

const storedUser = parseStoredUser();

export const useAuthStore = create<AuthState>(
  (set) => ({
    accessToken: storedToken,
    user: storedUser,

    loading: false,
    error: null,

    isAuthenticated: Boolean(
      storedToken && storedUser,
    ),

    login: async (credentials) => {
      set({
        loading: true,
        error: null,
      });

      try {
        const response = await loginApi(credentials);

        if (!response.accessToken) {
          throw new Error(
            'Backend không trả về accessToken.',
          );
        }

        const user = decodeUser(
          response.accessToken,
          credentials.email,
        );

        localStorage.setItem(
          ACCESS_TOKEN_KEY,
          response.accessToken,
        );

        localStorage.setItem(
          AUTH_USER_KEY,
          JSON.stringify(user),
        );

        set({
          accessToken: response.accessToken,
          user,
          loading: false,
          error: null,
          isAuthenticated: true,
        });

        return true;
      } catch (error) {
        set({
          accessToken: null,
          user: null,
          loading: false,
          error: getErrorMessage(error),
          isAuthenticated: false,
        });

        return false;
      }
    },

    register: async (credentials) => {
      set({
        loading: true,
        error: null,
      });

      try {
        await registerApi(credentials);

        set({
          loading: false,
          error: null,
        });

        return true;
      } catch (error) {
        set({
          loading: false,
          error: getErrorMessage(error),
        });

        return false;
      }
    },

    logout: () => {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);

      set({
        accessToken: null,
        user: null,
        error: null,
        isAuthenticated: false,
      });
    },

    clearError: () => {
      set({ error: null });
    },
  }),
);