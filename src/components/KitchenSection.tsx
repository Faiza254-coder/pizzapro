import React, { useState } from 'react';
import { ShieldCheck, Flame, Sparkles, Utensils, ZoomIn, CheckCircle2 } from 'lucide-react';
import { BRAND_ASSETS } from '../data/menuData';

export const KitchenSection: React.FC = () => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const images = BRAND_ASSETS.kitchenImages;
  const currentImage = images[activeImageIndex] || images[0];

  return (
    <section id="kitchen" className="py-12 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-3.5 py-1 rounded-full border border-red-200">
            <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
            <span>HYGIENIC & PROFESSIONAL KITCHEN</span>
          </span>

          <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
            Inside Our Clean, Hygienic & Professional Kitchen
          </h2>

          <p className="text-sm text-zinc-600 leading-relaxed font-medium">
            Take a look behind the scenes at <strong className="text-zinc-950">Pizza Pro Shergarh</strong>. Our commercial kitchen features medical-grade stainless steel prep stations, authentic fire stone deck ovens, and a dedicated team adhering to the highest standards of cleanliness and food safety.
          </p>
        </div>

        {/* Gallery & Highlights Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: Interactive Gallery Viewer */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Featured Image Display */}
            <div className="relative rounded-3xl overflow-hidden border-4 border-zinc-950 shadow-2xl bg-zinc-900 group aspect-16/10">
              <img
                src={currentImage.url}
                alt={currentImage.caption}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Tag & Caption Overlay */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-red-600 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-full shadow-lg border border-red-400">
                  {currentImage.tag}
                </span>
              </div>

              {/* Zoom Button */}
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute top-4 right-4 z-10 p-2.5 bg-zinc-950/80 hover:bg-red-600 text-white rounded-full backdrop-blur-md border border-zinc-700 transition-colors shadow-lg"
                title="View Fullscreen Photo"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 z-10 p-4 bg-zinc-950/90 backdrop-blur-md rounded-2xl border border-zinc-800 text-white flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-extrabold text-sm text-amber-400">
                    {currentImage.caption}
                  </h4>
                  <p className="text-xs text-zinc-300 mt-0.5">
                    100% Clean • Sanitized Equipment • Professional Uniformed Staff
                  </p>
                </div>
                <div className="shrink-0 p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Certified Clean</span>
                </div>
              </div>
            </div>

            {/* Thumbnail Selector Row */}
            <div className="grid grid-cols-3 gap-3">
              {images.map((img, idx) => {
                const isActive = activeImageIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative rounded-2xl overflow-hidden aspect-16/10 border-2 transition-all group ${
                      isActive
                        ? 'border-red-600 ring-4 ring-red-100 scale-[1.02] shadow-md'
                        : 'border-zinc-200 opacity-70 hover:opacity-100 hover:border-zinc-400'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.caption}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80';
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    <span className="absolute bottom-1 left-1 right-1 text-[10px] font-extrabold text-white bg-black/70 px-1.5 py-0.5 rounded text-center truncate">
                      {img.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Key Standards & Features Grid */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
              Our Food Hygiene & Quality Commitment
            </h3>
            
            <p className="text-xs text-zinc-600 leading-relaxed font-medium">
              We believe great taste starts with uncompromised cleanliness. Every meal served at Pizza Pro is prepared with freshly prepped ingredients inside a spotless environment.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-start gap-3">
                <div className="p-2 bg-red-600 text-white rounded-xl shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-zinc-900 uppercase">100% Sanitized</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Stainless-steel prep tables cleaned and disinfected continuously.</p>
                </div>
              </div>

              <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-start gap-3">
                <div className="p-2 bg-amber-500 text-white rounded-xl shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-zinc-900 uppercase">Fire Stone Deck Oven</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">High-temperature ovens for perfectly baked, crisp crusts.</p>
                </div>
              </div>

              <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-start gap-3">
                <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-zinc-900 uppercase">Gloved Staff</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">All team members wear hygiene caps, gloves, and official uniforms.</p>
                </div>
              </div>

              <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-start gap-3">
                <div className="p-2 bg-zinc-950 text-white rounded-xl shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-zinc-900 uppercase">Fresh Prep Daily</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Daily hand-kneaded dough and 100% pure mozzarella cheese.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-2xl border border-red-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">
                  SHERGARH BRANCH LOCATION
                </span>
                <p className="text-xs font-extrabold text-zinc-950 mt-0.5">
                  Main Petroleum Hujra Road, Shergarh
                </p>
              </div>
              <a
                href="#contact"
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors"
              >
                Visit Us
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Lightbox Fullscreen Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-red-500 font-extrabold text-sm uppercase flex items-center gap-1"
            >
              ✕ Close
            </button>
            <img
              src={currentImage.url}
              alt={currentImage.caption}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] w-auto object-contain rounded-2xl border-2 border-zinc-800 shadow-2xl"
            />
            <div className="mt-4 text-center">
              <h4 className="text-white font-black text-lg text-amber-400">
                {currentImage.caption}
              </h4>
              <p className="text-zinc-400 text-xs mt-1">
                Pizza Pro Shergarh Clean Kitchen Gallery
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
