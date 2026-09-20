import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Flame, 
  Sparkles, 
  Clock, 
  PhoneCall, 
  Star, 
  Truck, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  Utensils, 
  Gift, 
  Percent, 
  Tag 
} from 'lucide-react';
import { POSTER_BANNERS, STORE_INFO, BRAND_ASSETS } from '../data/menuData';

interface HeroSliderProps {
  onSelectCategory: (cat: string) => void;
  onOpenDeal: (dealId: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onSelectCategory, onOpenDeal }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHoveredPizza, setIsHoveredPizza] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Rotating Live Offers List for Marquee Bar
  const liveOffers = [
    { icon: Percent, text: '🔥 20% OFF HAPPY HOUR (12 PM - 6 PM) ON ALL PIZZAS!', tag: 'LIMITED TIME' },
    { icon: Gift, text: '🍕 BUY 1 LARGE PIZZA GET 1 FREE REGULAR PIZZA!', tag: 'HOT DEAL' },
    { icon: Truck, text: '🛵 FREE DOORSTEP DELIVERY ACROSS SHERGARH ON ORDERS > RS 1000', tag: 'FREE DELIVERY' },
    { icon: Zap, text: '⚡ 30-MINUTE HOT & CRISPY GUARANTEE OR YOUR MONEY BACK!', tag: '30 MINS' },
    { icon: Star, text: '🎁 EARN 10 LOYALTY POINTS ON EVERY RS 100 SPENT', tag: 'REWARDS' },
  ];

  // Auto-advance active banner deal
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % POSTER_BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Realistic Heat Smoke & Steam Particle Canvas Effect for Pizza Visual
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    interface SteamParticle {
      x: number;
      y: number;
      radius: number;
      opacity: number;
      vx: number;
      vy: number;
      growth: number;
    }

    interface EmberParticle {
      x: number;
      y: number;
      size: number;
      opacity: number;
      vx: number;
      vy: number;
      color: string;
    }

    const steamArray: SteamParticle[] = [];
    const emberArray: EmberParticle[] = [];

    const createSteam = () => {
      if (steamArray.length < 20) {
        steamArray.push({
          x: width / 2 + (Math.random() - 0.5) * 140,
          y: height / 2 + 60,
          radius: 18 + Math.random() * 20,
          opacity: 0.15 + Math.random() * 0.15,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -1.0 - Math.random() * 1.2,
          growth: 0.25 + Math.random() * 0.2,
        });
      }
    };

    const createEmber = () => {
      if (emberArray.length < 25) {
        emberArray.push({
          x: width / 2 + (Math.random() - 0.5) * 220,
          y: height / 2 + 50,
          size: 1.5 + Math.random() * 2.5,
          opacity: 0.5 + Math.random() * 0.4,
          vx: (Math.random() - 0.5) * 1.0,
          vy: -1.2 - Math.random() * 1.5,
          color: Math.random() > 0.5 ? '#dc2626' : '#f59e0b',
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Spawn steam particles continuously, faster when hovered
      if (Math.random() < (isHoveredPizza ? 0.7 : 0.35)) createSteam();
      if (Math.random() < (isHoveredPizza ? 0.8 : 0.4)) createEmber();

      // Render rising steam clouds
      for (let i = steamArray.length - 1; i >= 0; i--) {
        const p = steamArray[i];
        p.x += p.vx;
        p.y += p.vy;
        p.radius += p.growth;
        p.opacity -= 0.0025;

        if (p.opacity <= 0 || p.y < 0) {
          steamArray.splice(i, 1);
          continue;
        }

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, `rgba(239, 68, 68, ${p.opacity * 0.4})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${p.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render glowing embers
      for (let i = emberArray.length - 1; i >= 0; i--) {
        const e = emberArray[i];
        e.x += e.vx;
        e.y += e.vy;
        e.opacity -= 0.01;

        if (e.opacity <= 0 || e.y < 0) {
          emberArray.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = e.color;
        ctx.fillStyle = e.color;
        ctx.globalAlpha = e.opacity;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isHoveredPizza]);

  const currentBanner = POSTER_BANNERS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % POSTER_BANNERS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + POSTER_BANNERS.length) % POSTER_BANNERS.length);
  };

  const handleScrollToMenu = () => {
    const menuElem = document.getElementById('menu');
    if (menuElem) {
      menuElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="relative w-full bg-white text-zinc-900 overflow-hidden border-b border-red-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. PREMIUM ANIMATED LIVE OFFER BAR (Directly Below Header) */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white shadow-md border-y border-red-800/80 overflow-hidden relative z-20 py-2.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          
          {/* Live Indicator Pill */}
          <div className="shrink-0 flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-black uppercase tracking-wider text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>SPECIAL OFFERS</span>
          </div>

          {/* Smooth Scrolling Marquee Container */}
          <div className="flex-1 overflow-hidden relative mask-linear">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-12 text-xs font-extrabold tracking-wide uppercase">
              {liveOffers.concat(liveOffers).map((off, idx) => {
                const IconComp = off.icon;
                return (
                  <div key={idx} className="flex items-center gap-2.5 shrink-0 hover:text-amber-300 transition-colors cursor-pointer" onClick={handleScrollToMenu}>
                    <span className="px-2 py-0.5 rounded bg-white text-red-700 font-black text-[10px] shadow-xs">
                      {off.tag}
                    </span>
                    <IconComp className="w-4 h-4 text-amber-300" />
                    <span>{off.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Claim Deal Quick Action Button */}
          <button
            onClick={handleScrollToMenu}
            className="shrink-0 hidden sm:flex items-center gap-1.5 px-3.5 py-1 bg-white hover:bg-amber-300 text-red-700 hover:text-red-950 rounded-full font-black text-[11px] uppercase tracking-wider shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <span>ORDER NOW</span>
            <Zap className="w-3.5 h-3.5 text-red-600 fill-current" />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN SPLIT LAYOUT HERO SECTION */}
      {/* ------------------------------------------------------------- */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 z-10">
        
        {/* Soft Decorative Background Glow Shapes */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-red-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#dc2626_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* ========================================================= */}
          {/* LEFT SIDE: Animated Title, Real Logo, Tagline, CTAs */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 flex flex-col items-start gap-5 z-10 order-1">
            
            {/* Branch Header Pill */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                <Flame className="w-3.5 h-3.5 text-red-600" />
                <span>PIZZA PRO SHERGARH</span>
              </span>

              <span className="px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>4.9 / 5.0 Rated</span>
              </span>
            </div>

            {/* Original Uploaded Logo Card Showcase & Brand Title */}
            <div className="flex items-center gap-4 pt-1">
              {/* Real Uploaded Pizza Pro Logo Badge */}
              <div className="p-1.5 bg-white rounded-2xl shadow-xl border-2 border-red-600 shrink-0 ring-4 ring-red-50">
                <img
                  src={BRAND_ASSETS.logo}
                  alt="Pizza Pro Official Logo"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shadow-inner"
                />
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-red-600 block">
                  AUTHENTIC FAST FOOD & PIZZERIA
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black italic tracking-tight text-zinc-950 uppercase leading-none mt-0.5">
                  PIZZA <span className="text-red-600 drop-shadow-sm">PRO</span>
                </h1>
              </div>
            </div>

            {/* Tagline Badge: Fresh • Hot • Delivered Fast */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 text-white px-5 py-2.5 rounded-full shadow-lg shadow-red-600/25 border border-red-400/40"
            >
              <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
              <span className="text-xs sm:text-sm font-black uppercase tracking-[0.18em] font-sans">
                Fresh • Hot • Delivered Fast
              </span>
              <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
            </motion.div>

            {/* Short Description */}
            <p className="text-sm sm:text-base text-zinc-600 font-medium leading-relaxed max-w-xl">
              Shergarh’s premier pizzeria serving oven-fresh hand-tossed pizzas loaded with 100% real mozzarella cheese, crispy fillet burgers, juicy shawarmas, and crunchy hot wings — prepared fresh and delivered piping hot to your doorstep!
            </p>

            {/* Deal Spotlight Banner Info */}
            <div className="p-4 bg-red-50/80 border border-red-200 rounded-2xl w-full max-w-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-xs">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-zinc-950 uppercase">
                    {currentBanner.title}
                  </h4>
                  <p className="text-xs font-black text-red-600">
                    {currentBanner.highlightText}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-extrabold text-zinc-400 uppercase block">Only</span>
                <span className="text-lg font-black text-zinc-950 font-mono">
                  {currentBanner.priceTag}
                </span>
              </div>
            </div>

            {/* CTAs: Order Now & View Menu */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full">
              <button
                onClick={handleScrollToMenu}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-xl shadow-red-600/35 transition-all duration-300 hover:scale-105 active:scale-95 group"
              >
                <ShoppingBag className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
                <span>ORDER NOW</span>
              </button>

              <button
                onClick={handleScrollToMenu}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Utensils className="w-5 h-5 text-red-600" />
                <span>VIEW MENU</span>
              </button>

              <a
                href={`tel:${STORE_INFO.phones[0]}`}
                className="hidden xl:flex items-center gap-2 p-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-2xl font-bold text-xs uppercase transition-colors"
                title="Call Pizza Pro Shergarh"
              >
                <PhoneCall className="w-4 h-4 text-red-600" />
                <span>03251229333</span>
              </a>
            </div>

            {/* Proof Badges Bar Below CTAs */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-zinc-200/80 w-full max-w-xl text-center text-[11px] font-extrabold text-zinc-600">
              <div className="flex items-center justify-center gap-1.5 p-2 bg-zinc-50 rounded-xl border border-zinc-200">
                <Truck className="w-3.5 h-3.5 text-red-600" />
                <span>30-Min Delivery</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 p-2 bg-zinc-50 rounded-xl border border-zinc-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Fresh Dough</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 p-2 bg-zinc-50 rounded-xl border border-zinc-200">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Open Till 2 AM</span>
              </div>
            </div>

            {/* Carousel Switcher Dots & Next/Prev */}
            <div className="flex items-center justify-between w-full max-w-xl pt-2">
              <div className="flex items-center gap-2">
                {POSTER_BANNERS.map((b, idx) => (
                  <button
                    key={b.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      currentIndex === idx
                        ? 'w-8 bg-red-600'
                        : 'w-2.5 bg-zinc-300 hover:bg-zinc-400'
                    }`}
                    title={b.highlightText}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-full bg-zinc-100 text-zinc-700 hover:bg-red-600 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-full bg-zinc-100 text-zinc-700 hover:bg-red-600 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT SIDE: Realistic Looping Pizza Animation & Steam Canvas */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 relative flex items-center justify-center order-2">
            <div 
              className="relative w-full max-w-md md:max-w-lg aspect-square flex items-center justify-center"
              onMouseEnter={() => setIsHoveredPizza(true)}
              onMouseLeave={() => setIsHoveredPizza(false)}
            >
              {/* Heat Steam Particle Canvas Overlay */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none z-20"
              />

              {/* Glowing Outer Stage Ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-600/20 via-amber-400/20 to-red-500/10 blur-2xl animate-pulse-glow pointer-events-none" />

              {/* Rotating Pizza Crust Wheel Background Ring */}
              <div className="absolute w-[88%] h-[88%] rounded-full border-4 border-dashed border-red-300/80 animate-spin-slow pointer-events-none flex items-center justify-center">
                <div className="w-full h-full rounded-full border-8 border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.2)]" />
              </div>

              {/* Main Rotating Pizza Display Frame */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-[80%] h-[80%] rounded-full p-2.5 bg-white shadow-[0_20px_50px_rgba(220,38,38,0.2)] border-4 border-red-600 ring-8 ring-red-50/80 group overflow-hidden"
              >
                <img
                  src={currentBanner.image}
                  alt={`Pizza Pro Shergarh Hot & Fresh ${currentBanner.title} - ${currentBanner.highlightText}`}
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover rounded-full shadow-inner transform group-hover:scale-110 transition-transform duration-700"
                />

                {/* Sizzling Hot Badge Overlay on Hover */}
                {isHoveredPizza && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-black/30 backdrop-blur-[2px] rounded-full flex items-center justify-center"
                  >
                    <span className="px-4 py-2 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-full shadow-2xl border border-red-300 flex items-center gap-1.5 animate-bounce">
                      <Flame className="w-4 h-4 text-amber-300" />
                      <span>SIZZLING HOT & FRESH!</span>
                    </span>
                  </motion.div>
                )}
              </motion.div>

              {/* ----------------------------------------------------- */}
              {/* Floating 3D Ingredients (Basil, Pepperoni, Cheese Pull) */}
              {/* ----------------------------------------------------- */}
              {/* Top Left: Floating Basil Leaf */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-4 left-4 z-30 p-2.5 bg-white/90 backdrop-blur-md rounded-2xl border border-emerald-200 shadow-xl flex items-center gap-2"
              >
                <span className="text-xl">🍃</span>
                <div className="text-[10px]">
                  <strong className="block text-emerald-800 font-extrabold uppercase">Fresh Basil</strong>
                  <span className="text-zinc-500 font-bold">100% Organic</span>
                </div>
              </motion.div>

              {/* Top Right: Floating Pepperoni */}
              <motion.div
                animate={{ y: [0, 12, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute top-6 right-2 z-30 p-2.5 bg-white/90 backdrop-blur-md rounded-2xl border border-red-200 shadow-xl flex items-center gap-2"
              >
                <span className="text-xl">🍕</span>
                <div className="text-[10px]">
                  <strong className="block text-red-700 font-extrabold uppercase">Crispy Topping</strong>
                  <span className="text-zinc-500 font-bold">Spiced Meat</span>
                </div>
              </motion.div>

              {/* Bottom Left: Melted Cheese Pull Glass Badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-6 left-2 z-30 p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-amber-200 shadow-2xl flex items-center gap-2.5"
              >
                <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-zinc-950 uppercase">100% Mozzarella</h5>
                  <p className="text-[10px] text-zinc-500 font-bold">Gooey Cheese Pulls</p>
                </div>
              </motion.div>

              {/* Bottom Right: 30-Min Fast Delivery Badge */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                className="absolute bottom-4 right-4 z-30 p-3 bg-red-600 text-white rounded-2xl shadow-2xl shadow-red-600/40 flex items-center gap-2.5 border border-red-400"
              >
                <div className="p-1.5 bg-white text-red-600 rounded-xl">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-black uppercase">30-Min Delivery</h5>
                  <p className="text-[10px] text-red-100 font-bold">Shergarh Doorstep</p>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
