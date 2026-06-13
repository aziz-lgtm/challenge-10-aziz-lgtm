import type { RestaurantFilterParams, OrderStatus } from '@/types';

export const queryKeys = {
  restaurants: {
    all: ['restaurants'] as const,
    list: (params?: RestaurantFilterParams) => ['restaurants', 'list', params] as const,
    bestSeller: (params?: { page?: number; limit?: number }) => ['restaurants', 'best-seller', params] as const,
    recommended: ['restaurants', 'recommended'] as const,
    nearby: (params?: { location?: string; range?: number; limit?: number }) => ['restaurants', 'nearby', params] as const,
    detail: (id: number) => ['restaurants', 'detail', id] as const,
    search: (q: string, params?: { page?: number; limit?: number }) => ['restaurants', 'search', q, params] as const,
  },
  cart: {
    all: ['cart'] as const,
  },
  orders: {
    all: ['orders'] as const,
    list: (params?: { status?: OrderStatus; page?: number; limit?: number }) => ['orders', 'list', params] as const,
  },
  auth: {
    profile: ['auth', 'profile'] as const,
  },
} as const;
