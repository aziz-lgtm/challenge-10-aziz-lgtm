import apiClient from './axios';
import type { Order, OrderStatus } from '@/types';

export interface CheckoutPayload {
  restaurants: Array<{
    restaurantId: number;
    items: Array<{ menuId: number; quantity: number }>;
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

export interface MyOrdersResponse {
  orders: Order[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export async function getMyOrders(params?: { status?: OrderStatus; page?: number; limit?: number }): Promise<MyOrdersResponse> {
  const res = await apiClient.get<{ data: MyOrdersResponse }>('/api/order/my-order', { params });
  return res.data.data;
}
