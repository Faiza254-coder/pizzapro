export type SizeOption = 'S' | 'M' | 'L' | 'XL';

export interface PriceWithSize {
  S?: number;
  M?: number;
  L?: number;
  XL?: number;
}

export type CategoryId = 
  | 'all'
  | 'regular-pizza'
  | 'special-pizza'
  | 'extra-large-pizza'
  | 'rolls-sandwiches'
  | 'burgers-shawarma'
  | 'fries-potatoes'
  | 'pasta-wings'
  | 'exclusive-deals';

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  price: number; // Base or starting price
  pricesWithSize?: PriceWithSize; // If S/M/L exists
  availableSizes?: SizeOption[];
  image: string;
  isBestSeller?: boolean;
  isSpecialOffer?: boolean;
  isNew?: boolean;
  spiceLevel?: 'Mild' | 'Medium' | 'Hot' | 'Extra Hot';
  rating?: number;
  reviewsCount?: number;
  tags?: string[];
}

export interface CartItem {
  cartItemId: string; // Unique string for specific size/customization
  menuItem: MenuItem;
  selectedSize?: SizeOption;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customNotes?: string;
  specialInstructions?: string;
  extraCheese?: boolean;
  extraDip?: boolean;
}

export interface PosterBanner {
  id: string;
  title: string;
  highlightText: string;
  subtitle: string;
  priceTag: string;
  badge: string;
  image: string;
  categoryLink: CategoryId;
  bgGradient: string;
  ctaText: string;
}

export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Preparing' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled' 
  | 'Received' 
  | 'Kitchen Prep' 
  | 'Oven Baking'
  | string;

export interface Order {
  orderId: string;
  barcodeValue?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  orderType: 'delivery' | 'takeaway';
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'cod' | 'jazzcash' | 'easypaisa' | 'jazzcash_easypaisa' | 'Cash on Delivery' | 'JazzCash' | 'EasyPaisa' | string;
  paymentStatus?: string;
  paymentTxnId?: string;
  orderStatus: OrderStatus;
  createdAt: string;
  createdAtISO?: string;
  estimatedTimeMinutes: number;
  notes?: string;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  fixedDiscount?: number;
  description: string;
  minSpend: number;
}

export interface UserProfile {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  isLoggedIn?: boolean;
  loyaltyPoints: number;
  memberTier?: 'Bronze' | 'Silver' | 'Gold' | 'VIP Pro';
  savedAddresses?: string[];
  wishlistIds?: string[];
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  dishName: string;
  verifiedOrder: boolean;
}
