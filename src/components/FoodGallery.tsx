import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image, Maximize2, X, Sparkles, Heart } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  caption: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Hot & Cheesy Crown Crust Pizza',
    category: 'Pizzas',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    caption: 'Freshly pulled crown crust pizza with double mozzarella cheese layer.',
  },
  {
    id: 'gal-2',
    title: 'Pizza Pro Fillet Burger',
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
    caption: 'First time in Shergarh! Extra crispy double-dipped chicken fillet burger.',
  },
  {
    id: 'gal-3',
    title: 'Golden Zinger Burger & Fries',
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    caption: 'Crispy zinger burger served hot with 100g salted french fries.',
  },
  {
    id: 'gal-4',
    title: 'Malai Boti Special Pizza',
    category: 'Pizzas',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    caption: 'Creamy chicken Malai Boti boti topped with garlic swirl and oregano.',
  },
  {
    id: 'gal-5',
    title: 'Tortilla Wrap & Dip Sauce',
    category: 'Sides & Wraps',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
    caption: 'Soft tortilla wrap served with FREE Pizza Pro special dip sauce.',
  },
  {
    id: 'gal-6',
    title: 'Loaded Cheesy Mayo Fries',
    category: 'Fries',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
    caption: 'Golden skin-on french fries smothered in garlic mayo and cheese sauce.',
  },
];

export const FoodGallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeLightbox, setActiveLightbox] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Pizzas', 'Burgers', 'Sides & Wraps', 'Fries'];

  const filteredItems = activeFilter === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  return (
    <section id="gallery" className="py-12 bg-zinc-50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200 inline-flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5" />
              <span>DELICIOUS SHOWCASE</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight mt-2">
              Food Photo Gallery
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeFilter === cat
                    ? 'bg-zinc-950 text-white shadow-md'
                    : 'bg-white text-zinc-600 hover:bg-zinc-200 border border-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActiveLightbox(item)}
              className="group relative aspect-4/3 rounded-3xl overflow-hidden border border-zinc-200 bg-zinc-900 shadow-sm hover:shadow-xl cursor-pointer"
            >
              <img
                src={item.image}
                alt={`Pizza Pro Shergarh ${item.title} - ${item.caption}`}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-black uppercase text-amber-400 bg-black/60 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                  {item.category}
                </span>
                <h4 className="text-lg font-black text-white mt-1 group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-zinc-300 line-clamp-1 mt-0.5">
                  {item.caption}
                </p>
              </div>

              <div className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeLightbox && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative text-white"
            >
              <button
                onClick={() => setActiveLightbox(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-video w-full bg-black">
                <img
                  src={activeLightbox.image}
                  alt={activeLightbox.title}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6">
                <span className="text-xs font-black uppercase text-amber-400">
                  {activeLightbox.category}
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {activeLightbox.title}
                </h3>
                <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
                  {activeLightbox.caption}
                </p>

                <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-semibold">
                  <span>Pizza Pro Shergarh Original Recipe</span>
                  <span className="text-red-500 font-bold">Open 12 PM - 2 AM</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
