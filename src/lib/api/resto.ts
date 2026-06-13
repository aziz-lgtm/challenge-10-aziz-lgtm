import apiClient from './axios';
import type { Restaurant, RestaurantDetail, RestaurantFilterParams } from '@/types';

export interface RestaurantListResponse {
  restaurants: Restaurant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getRestaurants(params?: RestaurantFilterParams): Promise<RestaurantListResponse> {
  const res = await apiClient.get<{ data: RestaurantListResponse }>('/api/resto', { params });
  return res.data.data;
}

export async function getRestaurantById(id: number, params?: { limitMenu?: number; limitReview?: number }): Promise<RestaurantDetail> {
  const res = await apiClient.get<{ data: RestaurantDetail }>(`/api/resto/${id}`, { params });
  return res.data.data;
}

export async function searchRestaurants(q: string, params?: { page?: number; limit?: number }): Promise<RestaurantListResponse> {
  const res = await apiClient.get<{ data: RestaurantListResponse }>('/api/resto/search', { params: { q, ...params } });
  return res.data.data;
}

export async function getBestSellerRestaurants(params?: { page?: number; limit?: number }): Promise<RestaurantListResponse> {
  const res = await apiClient.get<{ data: RestaurantListResponse }>('/api/resto/best-seller', { params });
  return res.data.data;
}

export async function getRecommendedRestaurants(): Promise<Restaurant[]> {
  const res = await apiClient.get<{ data: Restaurant[] }>('/api/resto/recommended');
  return res.data.data;
}

// Per the API spec, /nearby only accepts `range` and `limit`; it derives the
// user's position from their stored profile location (not from query coords).
export async function getNearbyRestaurants(params?: { range?: number; limit?: number }): Promise<Restaurant[]> {
  const res = await apiClient.get<{ data: Restaurant[] }>('/api/resto/nearby', { params });
  return res.data.data;
}
