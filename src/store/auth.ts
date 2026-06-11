'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  setAuth: (token: string) => void;
  clearAuth: () => void;
}

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setAuth: (token) => {
        setCookie('auth-token', token);
        set({ token });
      },
      clearAuth: () => {
        deleteCookie('auth-token');
        set({ token: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
