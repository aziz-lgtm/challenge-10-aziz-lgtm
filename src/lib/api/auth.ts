import apiClient from './axios';
import type { User, AuthTokens } from '@/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export async function login(payload: LoginPayload): Promise<{ token: string; user: User }> {
  const res = await apiClient.post<{ data: AuthTokens & { user: User }; message: string }>('/api/auth/login', payload);
  return res.data.data;
}

export async function register(payload: RegisterPayload): Promise<{ token: string; user: User }> {
  const res = await apiClient.post<{ data: AuthTokens & { user: User }; message: string }>('/api/auth/register', payload);
  return res.data.data;
}

export async function getProfile(): Promise<User> {
  const res = await apiClient.get<{ data: User }>('/api/auth/profile');
  return res.data.data;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const form = new FormData();
  if (payload.name) form.append('name', payload.name);
  if (payload.phone) form.append('phone', payload.phone);
  if (payload.address != null) form.append('address', payload.address);
  if (payload.latitude != null) form.append('latitude', String(payload.latitude));
  if (payload.longitude != null) form.append('longitude', String(payload.longitude));
  const res = await apiClient.put<{ data: User }>('/api/auth/profile', form);
  return res.data.data;
}
