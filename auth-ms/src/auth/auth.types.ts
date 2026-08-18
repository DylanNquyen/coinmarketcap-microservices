export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthTokenPayload {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
}
