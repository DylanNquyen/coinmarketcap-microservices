export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  sub?: number;
  id?: number;
  email: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface RegisterResponse {
  id?: number;
  email: string;
  message?: string;
}