export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  avatar?: string;
}

export interface AuthTokens {
  token: string;
}

// Restaurant
export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address: string;
  location: string;
  category: string;
  rating: number;
  priceMin: number;
  priceMax: number;
  image?: string;
  distance?: number;
  reviewCount?: number;
}

export interface Menu {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
}

export interface Review {
  id: string;
  userId: string;
  restaurantId: string;
  transactionId?: string;
  star: number;
  comment: string;
  user?: Pick<User, 'id' | 'name' | 'avatar'>;
  createdAt: string;
}

export interface RestaurantDetail extends Restaurant {
  menus: Menu[];
  reviews: Review[];
}

// Cart
export interface CartItem {
  id: string;
  menuId: string;
  restaurantId: string;
  quantity: number;
  menu: Menu;
}

export interface CartGroup {
  restaurant: Restaurant;
  items: CartItem[];
}

// Order
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface OrderItem {
  menuId: string;
  quantity: number;
  menu: Menu;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  deliveryAddress: string;
  phone?: string;
  paymentMethod?: string;
  notes?: string;
  totalPrice: number;
  createdAt: string;
  restaurants: Array<{
    restaurant: Restaurant;
    items: OrderItem[];
  }>;
}

// Filter params
export interface RestaurantFilterParams {
  location?: string;
  range?: number;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  category?: string;
  page?: number;
  limit?: number;
  q?: string;
}
