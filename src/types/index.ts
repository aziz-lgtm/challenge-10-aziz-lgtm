export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Auth
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  avatar?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface AuthTokens {
  token: string;
}

// Restaurant
export interface Restaurant {
  id: number;
  name: string;
  star: number;
  place: string;
  logo: string;
  images: string[];
  category: string;
  reviewCount?: number;
  menuCount?: number;
  priceRange: { min: number; max: number };
  distance?: number;
}

export interface Menu {
  id: number;
  restaurantId?: number;
  foodName: string;
  price: number;
  image?: string;
  type?: string;
}

export interface Review {
  id: number;
  userId?: number;
  restaurantId?: number;
  transactionId?: string;
  star: number;
  comment: string;
  user?: { id: number; name: string; avatar?: string | null };
  createdAt: string;
}

export interface RestaurantDetail extends Restaurant {
  averageRating?: number;
  coordinates?: { lat: number; long: number };
  totalMenus?: number;
  totalReviews?: number;
  menus: Menu[];
  reviews: Review[];
}

// Cart
export interface CartItem {
  id: number;
  menuId: number;
  restaurantId: number;
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
  menuId: number;
  quantity: number;
  menu: Menu;
}

export interface Order {
  id: number;
  userId: number;
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
