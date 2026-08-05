import { httpClient } from './httpClient';

import type {
  AuthCredentials,
  LoginResponse,
  RegisterResponse,
} from '@/api/auth';

export async function loginApi(
  credentials: AuthCredentials,
): Promise<LoginResponse> {
  const response = await httpClient.post<LoginResponse>(
    '/api/auth/login',
    credentials,
  );

  return response.data;
}

export async function registerApi(
  credentials: AuthCredentials,
): Promise<RegisterResponse> {
  const response = await httpClient.post<RegisterResponse>(
    '/api/auth/register',
    credentials,
  );

  return response.data;
}