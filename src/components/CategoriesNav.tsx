import React from 'react';
import { CategoryId } from '../types';
import { 
  Pizza, 
  Flame, 
  Sandwich, 
  UtensilsCrossed, 
  Sparkles, 
  Crown, 
  ChefHat, 
  Zap,
  Grid
} from 'lucide-react';

interface CategoriesNavProps {
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  categoryCounts: Record<CategoryId, number>;
}

export const CATEGORY_LIST: { id: CategoryId; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    id: 'all',
    label: 'All Items',
    icon: <Grid className="w-4 h-4" />,
    desc: 'Complete Pizza Pro Menu',
  },
  {
    id: 'regular-pizza',
    label: 'Regular Pizza',
    icon: <Pizza className="w-4 h-4" />,
    desc: 'S: 450 | M: 900 | L: 1350',
  },
  {
    id: 'special-pizza',
    label: 'Special Pizza',
    icon: <Crown className="w-4 h-4 text-amber-500" />,
    desc: 'Malai Boti, Crown Crust, Stuffer',
  },
  {
    id: 'extra-large-pizza',
    label: 'Extra Large XL',
    icon: <Sparkles className="w-4 h-4 text-red-500" />,
    desc: '16 Inch Party Pizzas',
  },
  {
    id: 'rolls-sandwiches',
    label: 'Rolls & Cheese Stick',
    icon: <Sandwich className="w-4 h-4" />,
    desc: 'Tortilla, Spin Roll, Cheese Stick',
  },
  {
    id: 'burgers-shawarma',
    label: 'Burgers & Shawarma',
    icon: <Flame className="w-4 h-4 text-amber-500" />,
    desc: 'Fillet Burger, Zinger, Tower',
  },
  {
    id: 'fries-potatoes',
    label: 'Fried Potatoes',
    icon: <UtensilsCrossed className="w-4 h-4" />,
    desc: 'Cheesy Mayo & BBQ Fries',
  },
  {
    id: 'pasta-wings',
    label: 'Pasta & Wings',
    icon: <ChefHat className="w-4 h-4" />,
    desc: 'Oven Baked Pasta & Hot Wings',
  },
  {
    id: 'exclusive-deals',
    label: 'Exclusive Deals',
    icon: <Zap className="w-4 h-4 text-red-500" />,
    desc: 'Deals 1-4, Family & Crazy Deal',
  },
];

export const CategoriesNav: React.FC<CategoriesNavProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  return (
    <section id="categories" className="py-8 bg-zinc-50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-red-600">
              EXPLORE OUR MENU
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              Food Categories
            </h2>
          </div>
          <span className="text-xs font-bold text-zinc-500 bg-white px-3 py-1 rounded-full border border-zinc-200">
            Freshly Prepared Daily
          </span>
        </div>

        {/* Horizontal Category Tab Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 scrollbar-none select-none">
          {CATEGORY_LIST.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl font-bold text-xs whitespace-nowrap transition-all duration-300 border ${
                  isSelected
                    ? 'bg-zinc-950 text-white border-zinc-950 shadow-lg shadow-zinc-900/20 scale-105'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-red-500 hover:text-red-600'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl ${
                    isSelected ? 'bg-red-600 text-white' : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {cat.icon}
                </div>

                <div className="flex flex-col items-start">
                  <span className="font-extrabold tracking-wide">{cat.label}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {cat.desc}
                  </span>
                </div>

                {count > 0 && (
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isSelected
                        ? 'bg-red-600 text-white'
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
