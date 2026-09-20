import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Star, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MessageCircle, 
  Flame, 
  Sparkles, 
  Check, 
  Heart
} from 'lucide-react';
import { MenuItem, SizeOption, CartItem } from '../types';
import { STORE_INFO } from '../data/menuData';

interface ItemDetailsModalProps {
  item: MenuItem | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  item,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}) => {
  if (!item) return null;

  const [selectedSize, setSelectedSize] = useState<SizeOption>(
    item.availableSizes && item.availableSizes.length > 0 ? item.availableSizes[0] : 'S'
  );
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  const unitPrice =
    item.pricesWithSize && item.pricesWithSize[selectedSize]
      ? item.pricesWithSize[selectedSize]!
      : item.price;

  const handleAdd = () => {
    const cartItem: CartItem = {
      cartItemId: `${item.id}-${selectedSize}-${Date.now()}`,
      menuItem: item,
      selectedSize: item.availableSizes ? selectedSize : undefined,
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity,
      specialInstructions,
    };
    onAddToCart(cartItem);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 800);
  };

  const handleWhatsAppOrder = () => {
    const sizeText = item.availableSizes ? ` (Size: ${selectedSize})` : '';
    const text = `Hi Pizza Pro Shergarh! 🍕 I want to order:\n- *${item.name}*${sizeText} x ${quantity}\n- Special Note: ${specialInstructions || 'None'}\n- Total: Rs ${unitPrice * quantity}`;
    window.open(
      `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-zinc-200"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image Banner */}
          <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80';
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            <button
              onClick={() => onToggleWishlist(item.id)}
              className={`absolute top-4 left-4 p-2.5 rounded-full backdrop-blur-md transition-colors ${
                isWishlisted
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-black/50 text-white hover:bg-black'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
              <div>
                {item.isBestSeller && (
                  <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 mb-1">
                    <Flame className="w-3 h-3 text-amber-300" />
                    <span>BESTSELLER</span>
                  </span>
                )}
                <h2 className="text-2xl font-black italic tracking-tight text-white">
                  {item.name}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-zinc-300 block uppercase">
                  Unit Price
                </span>
                <span className="text-xl font-black text-amber-400 font-mono">
                  Rs {unitPrice}
                </span>
              </div>
            </div>
          </div>

          {/* Details & Controls */}
          <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
            <p className="text-xs text-zinc-600 leading-relaxed font-medium">
              {item.description}
            </p>

            {/* Size Options */}
            {item.availableSizes && item.availableSizes.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-zinc-800">
                  Select Size:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {item.availableSizes.map((size) => {
                    const price = item.pricesWithSize?.[size] || item.price;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          selectedSize === size
                            ? 'bg-red-600 text-white border-red-600 shadow-md font-black'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:bg-zinc-100 font-bold'
                        }`}
                      >
                        <span className="text-sm block uppercase">{size} Size</span>
                        <span className="text-xs font-mono opacity-90">Rs {price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">
                Cooking Instructions / Customization (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Extra mayo, crispier crust, no onions..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-red-600"
              />
            </div>

            {/* Quantity Counter */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
              <span className="text-xs font-black text-zinc-800 uppercase">
                Select Quantity:
              </span>
              <div className="flex items-center border border-zinc-300 rounded-xl bg-zinc-50 overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-zinc-700 hover:bg-zinc-200 font-bold"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 text-sm font-black text-zinc-950 font-mono">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 text-zinc-700 hover:bg-zinc-200 font-bold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-5 bg-zinc-950 text-white border-t border-zinc-900 grid grid-cols-2 gap-3">
            <button
              onClick={handleAdd}
              className={`py-3 px-4 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all ${
                addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/40'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>ADDED TO CART!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO CART (Rs {unitPrice * quantity})</span>
                </>
              )}
            </button>

            <button
              onClick={handleWhatsAppOrder}
              className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WHATSAPP ORDER</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
