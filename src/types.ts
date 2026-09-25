export type UserRole = 'buyer' | 'seller' | 'founder';

export type GhanaRegion = 'Greater Accra' | 'Ashanti (Kumasi)' | 'Western (Takoradi)' | 'Central (Cape Coast)' | 'Northern (Tamale)' | 'Eastern (Koforidua)' | 'Volta (Ho)';

export interface Product {
  id: string;
  title: string;
  sellerId: string;
  sellerName: string;
  sellerCity: string;
  category: 'Fashion' | 'Electronics' | 'Food & Agric' | 'Health & Beauty' | 'Gadgets & Computing' | 'Home & Living';
  price: number; // in GH₵
  originalPrice?: number;
  image: string;
  images?: string[];
  description: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  isSponsored?: boolean;
  allowNegotiation: boolean;
  minNegotiationPrice?: number;
  createdAt: string;
}

export type OrderStatus = 'placed' | 'escrow_locked' | 'preparing' | 'dispatched' | 'delivered' | 'cancelled';

export interface OrderItem {
  product: Product;
  quantity: number;
  negotiatedPrice?: number;
}

export interface Order {
  id: string;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  buyerRegion: GhanaRegion;
  sellerId: string;
  sellerName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  platformFee: number; // e.g. 5% Zorvaniq commission
  sellerNetProceeds: number; // 95%
  paymentMethod: 'mtn_momo' | 'telecel_cash' | 'airteltigo_cash' | 'card' | 'wallet';
  paymentPhone?: string;
  status: OrderStatus;
  placedAt: string;
  deliveryAgent?: {
    name: string;
    phone: string;
    vehicle: string;
    etaMinutes: number;
  };
  trackingUpdates: {
    status: OrderStatus;
    timestamp: string;
    message: string;
  }[];
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'buyer' | 'seller';
  text: string;
  timestamp: string;
  isOffer?: boolean;
  offerAmount?: number;
  offerStatus?: 'pending' | 'accepted' | 'declined';
  productId?: string;
}

export interface Conversation {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  productId: string;
  productTitle: string;
  productPrice: number;
  productImage: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: Message[];
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'sale_proceeds' | 'commission_fee' | 'data_bundle' | 'subscription';
  title: string;
  amount: number;
  balanceAfter: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  provider?: 'MTN MoMo' | 'Telecel Cash' | 'AirtelTigo' | 'Zorvaniq Escrow' | 'Card';
  reference: string;
}

export interface DataPackage {
  id: string;
  telco: 'MTN Ghana' | 'Telecel Ghana' | 'AirtelTigo' | 'Zorvaniq Zero-Data';
  title: string;
  volume: string;
  validity: string;
  price: number; // in GH₵
  zorvaniqMargin: number; // how much Isaac/Zorvaniq earns per bundle, e.g. 10%
  popular?: boolean;
  color: string;
  features: string[];
}

export interface SellerPlan {
  id: 'free' | 'business' | 'premium' | 'enterprise';
  name: string;
  priceMonthly: number;
  maxListings: number;
  commissionRate: number; // %
  analytics: boolean;
  prioritySupport: boolean;
  promotedListingCredits: number;
}
