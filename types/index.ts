// ===================== PRODUCT =====================
export type Category = 'tom' | 'ca' | 'muc' | 'cua' | 'premium';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  description: string;
  shortDescription: string;
  images: string[];
  videoUrl?: string | null;
  price: number; // pricePerKg in VND
  salePrice?: number | null;
  percentOff?: number | null;
  inventoryKg: number;
  soldCount: number;
  bestSeller: boolean;
  isBaoRe?: boolean;
  isNew?: boolean;
  origin: string;
  preservation: string;
  specification: string;
  rating: number;
  reviewCount: number;
  relatedProducts?: string[]; // product ids
  createdAt: string;
}

export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductFilters {
  page?: number;
  pageSize?: number;
  q?: string;
  category?: Category | 'all';
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'discount';
}

// ===================== USER =====================
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
}

// ===================== CART =====================
export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  slug: string;
  weight: number; // kg
  pricePerKg: number;
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
}

// ===================== ORDER =====================
export type OrderStatus = 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderStatusEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  weight: number;
  pricePerKg: number;
  totalPrice: number;
}

export interface ShippingInfo {
  name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  note?: string;
}

export type PaymentMethod = 'cod' | 'transfer';

export interface Order {
  id: string;
  orderId: string; // HAI-2026-XXXXX
  userId?: string;
  items: OrderItem[];
  shipping: ShippingInfo;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  statusTimeline: OrderStatusEntry[];
  createdAt: string;
}

export interface CreateOrderPayload {
  items: CartItem[];
  shipping: ShippingInfo;
  paymentMethod: PaymentMethod;
}

// ===================== REVIEW =====================
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// ===================== ADMIN =====================
export interface DashboardKPI {
  totalRevenue: number;
  totalOrders: number;
  aov: number; // average order value
  conversionRate: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface SalesByCategoryData {
  category: string;
  revenue: number;
  orders: number;
}

// ===================== API =====================
export interface ApiError {
  message: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
