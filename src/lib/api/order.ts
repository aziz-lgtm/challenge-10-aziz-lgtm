import apiClient from './axios';
import type { Order, OrderStatus } from '@/types';

export interface CheckoutPayload {
  restaurants: Array<{
    restaurantId: string;
    items: Array<{ menuId: string; quantity: number }>;
  }>;
  deliveryAddress: string;
  phone?: string;
  paymentMethod?: string;
  notes?: string;
}

export async function checkout(payload: CheckoutPayload): Promise<Order> {
  const res = await apiClient.post<{ data: Order }>('/api/order/checkout', payload);
  return res.data.data;
}

export async function getMyOrders(params?: { status?: OrderStatus; page?: number; limit?: number }): Promise<{ data: Order[]; total: number; page: number; totalPages: number }> {
  const res = await apiClient.get('/api/order/my-order', { params });
  return res.data;
}
