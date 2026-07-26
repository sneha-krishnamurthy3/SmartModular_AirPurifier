export type UserRole = 'super_admin' | 'admin' | 'manager' | 'staff' | 'customer';

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  photoURL?: string;
  phone?: string;
  addresses: Address[];
  wishlist: string[]; // product IDs
  totalSpent?: number;
  ordersCount?: number;
  createdAt?: string;
  isBlocked?: boolean;
}

export interface Specification {
  label: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  colorHex?: string;
}

export interface ProductModule {
  id: string;
  name: string;
  description: string;
  price: number;
  iconName?: string;
  isIncluded?: boolean;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  coverImage: string;
  images: string[];
  category: 'purifier' | 'filter' | 'power_module' | 'aqi_sensor' | 'accessory';
  stock: number;
  isFeatured: boolean;
  isPublished: boolean;
  rating: number;
  reviewsCount: number;
  description: string;
  specs: Specification[];
  features: string[];
  coverageArea: string;
  filtrationType: string;
  dimensions: string;
  weight: string;
  warranty: string;
  includedItems: string[];
  variants?: ProductVariant[];
  videos?: string[];
  documents?: { name: string; url: string }[];
  sku: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  expiryDate: string;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
}

export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Packed' 
  | 'Shipped' 
  | 'Out For Delivery' 
  | 'Delivered' 
  | 'Cancelled';

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'Razorpay' | 'UPI' | 'Card' | 'NetBanking' | 'Simulated';
  paymentId: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  status: OrderStatus;
  timeline: OrderTimeline[];
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  courierName?: string;
}

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  avatarUrl?: string;
  location: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Modules & Specs' | 'Shipping & Order' | 'Sustainability' | 'Warranty';
}

export interface CMSData {
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroBannerTag: string;
  announcementText: string;
  announcementLink: string;
  announcementActive: boolean;
  carbonSavedKg: number;
  plasticReducedKg: number;
  purifiersSold: number;
  recyclabilityRate: number;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  aboutUsText: string;
  privacyPolicy: string;
  shippingPolicy: string;
  refundPolicy: string;
  termsAndConditions: string;
}
