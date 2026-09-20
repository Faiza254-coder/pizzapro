import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Minus, 
  ShoppingBag, 
  Heart, 
  MessageCircle, 
  Flame, 
  Star, 
  Sparkles,
  Percent,
  Check
} from 'lucide-react';
import { MenuItem, SizeOption, CartItem } from '../types';
import { STORE_INFO } from '../data/menuData';

interface MenuGridProps {
  items: MenuItem[];
  wishlistIds: string[];
  onToggleWishlist: (itemId: string) => void;
  onAddToCart: (cartItem: CartItem) => void;
  onSelectItem: (item: MenuItem) => void;
  selectedCategoryName?: string;
}

export const MenuGrid: React.FC<MenuGridProps> = ({
  items,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onSelectItem,
  selectedCategoryName,
}) => {
  return (
    <section id="menu" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              {selectedCategoryName || 'OUR DELICIOUS SELECTION'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight mt-2">
              Pizza Pro Signature Menu
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-zinc-500 max-w-md">
            Handcrafted with 100% fresh ingredients, real mozzarella cheese & authentic recipes.
          </p>
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="text-center py-16 bg-zinc-50 rounded-3xl border border-zinc-200">
            <p className="text-zinc-500 font-bold text-base">
              No items found matching your search.
            </p>
            <span className="text-xs text-zinc-400 mt-1 block">
              Try searching for "Pizza", "Zinger", "Deal", or "Burger"
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                isWishlisted={wishlistIds.includes(item.id)}
                onToggleWishlist={() => onToggleWishlist(item.id)}
                onAddToCart={onAddToCart}
                onSelectItem={() => onSelectItem(item)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

interface FoodCardProps {
  item: MenuItem;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToCart: (cartItem: CartItem) => void;
  onSelectItem: () => void;
}

const FoodCard: React.FC<FoodCardProps> = ({
  item,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onSelectItem,
}) => {
  const [selectedSize, setSelectedSize] = useState<SizeOption>(
    item.availableSizes && item.availableSizes.length > 0 ? item.availableSizes[0] : 'S'
  );
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Calculate price according to size
  const currentUnitPrice =
    item.pricesWithSize && item.pricesWithSize[selectedSize]
      ? item.pricesWithSize[selectedSize]!
      : item.price;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cartItem: CartItem = {
      cartItemId: `${item.id}-${selectedSize}`,
      menuItem: item,
      selectedSize: item.availableSizes ? selectedSize : undefined,
      quantity,
      unitPrice: currentUnitPrice,
      totalPrice: currentUnitPrice * quantity,
    };
    onAddToCart(cartItem);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1200);
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const sizeText = item.availableSizes ? ` (Size: ${selectedSize})` : '';
    const text = `Hi Pizza Pro Shergarh! 🍕 I would like to order:\n- *${item.name}*${sizeText} x ${quantity}\n- Total Price: Rs ${currentUnitPrice * quantity}\n- Phone: ${STORE_INFO.phones[0]}`;
    window.open(
      `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={onSelectItem}
      className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer relative"
    >
      <div>
        {/* Card Header & Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
          <img
            src={item.image}
            alt={`Pizza Pro Shergarh ${item.name} - ${item.description || 'Fresh Food Delivery'}`}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {item.isBestSeller && (
              <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                <Flame className="w-3 h-3 text-amber-300" />
                <span>BESTSELLER</span>
              </span>
            )}
            {item.category.includes('pizza') && (
              <span className="bg-amber-500 text-zinc-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                <Percent className="w-3 h-3" />
                <span>20% OFF 12-6PM</span>
              </span>
            )}
            {item.isNew && (
              <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>NEW</span>
              </span>
            )}
          </div>

          {/* Wishlist Heart */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist();
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
              isWishlisted
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-black/40 text-white hover:bg-black/70'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Rating */}
          {item.rating && (
            <div className="absolute bottom-2.5 left-3 bg-black/70 backdrop-blur-md text-amber-400 text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{item.rating}</span>
              <span className="text-zinc-400 font-medium">({item.reviewsCount})</span>
            </div>
          )}
        </div>

        {/* Details Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-extrabold text-base text-zinc-900 group-hover:text-red-600 transition-colors line-clamp-1">
              {item.name}
            </h3>
            {item.spiceLevel && (
              <span className="text-[10px] font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 shrink-0">
                {item.spiceLevel}
              </span>
            )}
          </div>

          <p className="text-xs text-zinc-500 mt-1 line-clamp-2 min-h-[32px]">
            {item.description}
          </p>

          {/* Sizes Options (if available) */}
          {item.availableSizes && item.availableSizes.length > 0 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="mt-3 flex items-center gap-1.5 bg-zinc-50 p-1.5 rounded-xl border border-zinc-200"
            >
              <span className="text-[10px] font-bold text-zinc-400 px-1 uppercase">
                Size:
              </span>
              <div className="flex items-center gap-1 flex-1">
                {item.availableSizes.map((size) => {
                  const sizePrice = item.pricesWithSize?.[size] || item.price;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex-1 py-1 rounded-lg text-xs font-black transition-all ${
                        selectedSize === size
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-white text-zinc-700 hover:bg-zinc-200'
                      }`}
                    >
                      {size}
                      <span className="block text-[9px] font-medium opacity-80">
                        {sizePrice}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-4 pt-0 border-t border-zinc-100 mt-2">
        <div className="flex items-center justify-between mb-3 pt-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">
              Price
            </span>
            <span className="text-lg font-black text-zinc-950">
              Rs {currentUnitPrice.toLocaleString()}
            </span>
          </div>

          {/* Quantity Selector */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center border border-zinc-200 rounded-full overflow-hidden bg-zinc-50"
          >
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-2 py-1 hover:bg-zinc-200 text-zinc-700 font-bold"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 text-xs font-black text-zinc-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-2 py-1 hover:bg-zinc-200 text-zinc-700 font-bold"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleAdd}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-extrabold text-xs transition-all duration-300 shadow-sm ${
              addedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-950 hover:bg-zinc-800 text-white'
            }`}
          >
            {addedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>ADDED!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>ADD TO CART</span>
              </>
            )}
          </button>

          <button
            onClick={handleWhatsAppOrder}
            className="flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors"
            title="Order directly via WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WHATSAPP</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
