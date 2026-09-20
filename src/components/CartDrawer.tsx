import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MessageCircle, 
  ArrowRight, 
  Tag, 
  Percent, 
  Truck, 
  Store,
  Sparkles
} from 'lucide-react';
import { CartItem, Coupon } from '../types';
import { STORE_INFO, DEFAULT_COUPONS } from '../data/menuData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
  orderType: 'delivery' | 'takeaway';
  setOrderType: (type: 'delivery' | 'takeaway') => void;
  appliedCoupon: Coupon | null;
  setAppliedCoupon: (coupon: Coupon | null) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  orderType,
  setOrderType,
  appliedCoupon,
  setAppliedCoupon,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  // Subtotal calculation
  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  // Automatic 20% discount on pizzas if happy hour or coupon applied
  const couponDiscount = appliedCoupon
    ? appliedCoupon.discountPercent
      ? Math.round((subtotal * appliedCoupon.discountPercent) / 100)
      : appliedCoupon.fixedDiscount || 0
    : 0;

  const deliveryFee = orderType === 'delivery' ? (subtotal >= 800 ? 0 : 80) : 0;
  const finalTotal = Math.max(0, subtotal - couponDiscount + deliveryFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const found = DEFAULT_COUPONS.find(
      (c) => c.code.toLowerCase() === couponInput.trim().toLowerCase()
    );

    if (!found) {
      setCouponError('Invalid coupon code. Try "PIZZAPRO10" or "SHERGARH20"');
      return;
    }

    if (subtotal < found.minSpend) {
      setCouponError(`Minimum spend for ${found.code} is Rs ${found.minSpend}`);
      return;
    }

    setAppliedCoupon(found);
    setCouponInput('');
  };

  const handleWhatsAppInstantOrder = () => {
    if (cartItems.length === 0) return;

    let itemsText = cartItems
      .map(
        (ci) =>
          `• ${ci.menuItem.name}${ci.selectedSize ? ` (${ci.selectedSize})` : ''} x ${ci.quantity} = Rs ${ci.totalPrice}`
      )
      .join('\n');

    const message = `*NEW PIZZA PRO ORDER (Shergarh)* 🍕\n\n*Order Type:* ${orderType.toUpperCase()}\n\n*Items Ordered:*\n${itemsText}\n\n*Subtotal:* Rs ${subtotal}\n*Discount:* Rs ${couponDiscount}\n*Delivery Fee:* Rs ${deliveryFee}\n*TOTAL PAYABLE:* *Rs ${finalTotal}*\n\nPlease confirm my order! Phone: ${STORE_INFO.phones[0]}`;

    window.open(
      `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen sm:max-w-md bg-white shadow-2xl flex flex-col justify-between"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-zinc-200 bg-zinc-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-600 text-white">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base italic text-white">
                    Your Order Cart
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    {cartItems.length} item(s) selected
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Delivery vs Takeaway Switcher */}
            <div className="p-4 bg-zinc-50 border-b border-zinc-200">
              <div className="grid grid-cols-2 gap-2 bg-zinc-200 p-1 rounded-2xl">
                <button
                  onClick={() => setOrderType('delivery')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black transition-all ${
                    orderType === 'delivery'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-zinc-700 hover:bg-zinc-300'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>HOME DELIVERY</span>
                </button>

                <button
                  onClick={() => setOrderType('takeaway')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black transition-all ${
                    orderType === 'takeaway'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-zinc-700 hover:bg-zinc-300'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>TAKEAWAY</span>
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-3">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-zinc-900 text-base">
                    Your Cart is Empty
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                    Explore our pizzas, burgers, and deals to add delicious meals to your cart!
                  </p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-center gap-3 p-3 bg-zinc-50 rounded-2xl border border-zinc-200 hover:border-zinc-300 transition-all"
                  >
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80';
                      }}
                      className="w-14 h-14 object-cover rounded-xl shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs text-zinc-900 truncate">
                          {item.menuItem.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.cartItemId)}
                          className="text-zinc-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.selectedSize && (
                        <span className="text-[10px] font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 inline-block mt-0.5">
                          Size: {item.selectedSize}
                        </span>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-black text-xs text-zinc-950">
                          Rs {item.totalPrice.toLocaleString()}
                        </span>

                        <div className="flex items-center border border-zinc-300 rounded-lg bg-white overflow-hidden">
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                            className="px-2 py-0.5 text-zinc-600 hover:bg-zinc-100 font-bold text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-black text-zinc-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                            className="px-2 py-0.5 text-zinc-600 hover:bg-zinc-100 font-bold text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Coupon & Total Summary Footer */}
            {cartItems.length > 0 && (
              <div className="p-5 bg-zinc-900 text-white border-t border-zinc-800 space-y-4">
                {/* Coupon Code Input Form */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Coupon (e.g. PIZZAPRO10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 uppercase font-mono"
                    />
                    <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase rounded-xl transition-colors"
                  >
                    APPLY
                  </button>
                </form>

                {couponError && (
                  <p className="text-[11px] text-red-400 font-semibold">{couponError}</p>
                )}

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-xs bg-amber-500/20 border border-amber-500/40 p-2.5 rounded-xl text-amber-300 font-bold">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Coupon Applied: {appliedCoupon.code}</span>
                    </div>
                    <button
                      onClick={() => setAppliedCoupon(null)}
                      className="text-zinc-400 hover:text-white text-[10px] underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Bill Breakdown */}
                <div className="space-y-1.5 text-xs text-zinc-300 pt-1 border-t border-zinc-800 font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rs {subtotal.toLocaleString()}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-amber-400 font-bold">
                      <span>Discount</span>
                      <span>- Rs {couponDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Fee ({orderType === 'delivery' ? 'Shergarh' : 'Pickup'})</span>
                    <span>{deliveryFee === 0 ? 'FREE' : `Rs ${deliveryFee}`}</span>
                  </div>

                  <div className="flex justify-between text-base font-black text-white pt-2 border-t border-zinc-800">
                    <span>Total Amount</span>
                    <span className="text-red-500">Rs {finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout & WhatsApp Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onProceedToCheckout();
                    }}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-red-900/40 transition-all hover:scale-[1.02]"
                  >
                    <span>CHECKOUT</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleWhatsAppInstantOrder}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WHATSAPP</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
