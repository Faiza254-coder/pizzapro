import React from 'react';
import { motion } from 'motion/react';
import { Zap, Sparkles, ShoppingBag, Flame, CheckCircle2 } from 'lucide-react';
import { MenuItem, CartItem } from '../types';

interface DealsSectionProps {
  dealItems: MenuItem[];
  onAddToCart: (cartItem: CartItem) => void;
}

export const DealsSection: React.FC<DealsSectionProps> = ({ dealItems, onAddToCart }) => {
  return (
    <section id="deals" className="py-12 bg-gradient-to-b from-zinc-900 to-zinc-950 text-white relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 border-b border-zinc-800 pb-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800/50 flex items-center gap-1.5 w-max mb-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>SUPER VALUE COMBO OFFERS</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black italic tracking-tight text-white">
              Pizza Pro Exclusive Deals
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-zinc-400 max-w-md">
            Save big on our most famous combinations! Perfect for individuals, couples, and family feasts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dealItems.map((deal) => (
            <motion.div
              key={deal.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="bg-zinc-900/90 rounded-3xl border border-red-600/30 overflow-hidden shadow-xl hover:shadow-red-900/30 transition-all flex flex-col justify-between group relative"
            >
              {/* Image & Price Header */}
              <div>
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={deal.image}
                    alt={`Pizza Pro Shergarh ${deal.name} - ${deal.description}`}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                  <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>POPULAR DEAL</span>
                  </span>

                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <h3 className="text-xl font-black text-white italic tracking-tight drop-shadow-md">
                      {deal.name}
                    </h3>
                    <div className="bg-amber-400 text-zinc-950 px-3 py-1 rounded-xl font-black text-lg shadow-lg">
                      Rs {deal.price}
                    </div>
                  </div>
                </div>

                {/* Deal Items Breakdown */}
                <div className="p-5">
                  <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                    {deal.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-zinc-800 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />
                      <span>Freshly prepared on order</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>Includes complimentary cold drink / dips</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => {
                    onAddToCart({
                      cartItemId: `${deal.id}-deal`,
                      menuItem: deal,
                      quantity: 1,
                      unitPrice: deal.price,
                      totalPrice: deal.price,
                    });
                  }}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-900/40 transition-all duration-300 hover:scale-[1.02]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD DEAL TO CART</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
