import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Download, 
  Sparkles, 
  BookOpen, 
  Flame, 
  PhoneCall, 
  RotateCw, 
  CheckCircle2, 
  ShoppingBag,
  X
} from 'lucide-react';
import { BRAND_ASSETS, STORE_INFO } from '../data/menuData';

export const MenuCardSection: React.FC = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);

  const menuCardSrc = BRAND_ASSETS.menuCardImage;

  const handleOpenLightbox = () => {
    setZoomLevel(1);
    setRotation(0);
    setLightboxOpen(true);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.3, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.3, 0.7));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <section id="menucard" className="py-14 bg-white border-b border-red-100 relative overflow-hidden">
      {/* Decorative Red Dots & Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(#dc2626_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-700 bg-red-50 border border-red-200 px-4 py-1.5 rounded-full shadow-xs">
            <BookOpen className="w-3.5 h-3.5 text-red-600" />
            <span>OFFICIAL PIZZA PRO MENU CARD</span>
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight italic uppercase">
            Menu <span className="text-red-600 drop-shadow-xs">Card</span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-600 font-medium leading-relaxed">
            Browse our official printable menu card featuring all regular & special pizza flavours, deals 1 to 4, family deals, roll, burgers, pasta, and happy hour offers!
          </p>

          {/* Prominent Bold Red "View Menu Card" Button */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={handleOpenLightbox}
              className="px-8 py-4 bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-red-600/30 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2.5 border-2 border-red-400"
            >
              <Maximize2 className="w-5 h-5 text-amber-300 animate-pulse" />
              <span>VIEW MENU CARD</span>
            </button>
          </div>
        </div>

        {/* Menu Card Showcase Container */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-zinc-950 rounded-3xl p-3 sm:p-5 border-4 border-red-600 shadow-2xl overflow-hidden group">
            
            {/* Top Bar Label */}
            <div className="flex items-center justify-between bg-red-600 text-white px-4 py-2.5 rounded-2xl mb-3 font-extrabold text-xs uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-300" />
                <span>PIZZA PRO SHERGARH • OFFICIAL FLYER</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-amber-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">High Resolution</span>
              </div>
            </div>

            {/* Interactive Image Frame */}
            <div 
              className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center cursor-pointer group/img min-h-[480px] sm:min-h-[600px]"
              onClick={handleOpenLightbox}
            >
              <img
                src={menuCardSrc}
                alt="Pizza Pro Official Menu Card"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80';
                }}
                className="w-full h-auto max-h-[780px] object-contain rounded-xl transition-transform duration-500 group-hover/img:scale-102"
              />

              {/* Hover Overlay with Click to Zoom Prompt */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 text-white p-4">
                <div className="p-4 bg-red-600 text-white rounded-full shadow-2xl animate-bounce">
                  <ZoomIn className="w-8 h-8" />
                </div>
                <span className="font-black text-sm uppercase tracking-wider bg-zinc-950/80 px-4 py-2 rounded-full border border-white/20">
                  Click to Open High-Res Fullscreen View
                </span>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3.5 bg-zinc-900 rounded-2xl border border-zinc-800 text-white text-xs">
              <div className="flex items-center gap-3">
                <a
                  href={`tel:${STORE_INFO.phones[0]}`}
                  className="flex items-center gap-1.5 font-bold text-amber-400 hover:text-amber-300"
                >
                  <PhoneCall className="w-4 h-4 text-red-500" />
                  <span>Call: {STORE_INFO.phones[0]}</span>
                </a>
                <span className="text-zinc-700">|</span>
                <span className="text-zinc-400 font-medium">Delivery: Free Home Delivery</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenLightbox}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-xl transition-colors flex items-center gap-1.5 text-xs uppercase"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Full Screen</span>
                </button>

                <a
                  href={menuCardSrc}
                  download="Pizza_Pro_Shergarh_Menu_Card.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-xl transition-colors flex items-center gap-1 text-xs"
                  title="Download Menu Card Image"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Save</span>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* FULLSCREEN LIGHTBOX MODAL WITH ZOOM & ROTATION CONTROLS */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col items-center justify-between p-3 sm:p-6 overflow-hidden">
          
          {/* Lightbox Controls Top Header */}
          <div className="w-full max-w-5xl flex items-center justify-between bg-zinc-900/90 border border-zinc-800 p-3 sm:p-4 rounded-2xl text-white z-20">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-red-600 rounded-xl">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white uppercase tracking-tight">
                  Pizza Pro Menu Card
                </h3>
                <span className="text-[10px] text-zinc-400 font-medium block">
                  Zoom: {Math.round(zoomLevel * 100)}%
                </span>
              </div>
            </div>

            {/* Toolbar Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomIn}
                className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-amber-400 rounded-xl transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                onClick={handleZoomOut}
                className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-amber-400 rounded-xl transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <button
                onClick={handleRotate}
                className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-amber-400 rounded-xl transition-colors"
                title="Rotate"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <a
                href={menuCardSrc}
                download="Pizza_Pro_Shergarh_Menu_Card.jpg"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download</span>
              </a>

              <button
                onClick={() => setLightboxOpen(false)}
                className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors ml-2 font-black"
                title="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Image Container */}
          <div className="flex-1 w-full flex items-center justify-center p-2 sm:p-4 overflow-auto">
            <div className="transition-transform duration-300 ease-out flex items-center justify-center max-h-full">
              <img
                src={menuCardSrc}
                alt="Pizza Pro Menu Card Full View"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80';
                }}
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  transition: 'transform 0.25s ease-out'
                }}
                className="max-h-[82vh] max-w-[95vw] w-auto h-auto object-contain rounded-2xl shadow-2xl border border-zinc-800"
              />
            </div>
          </div>

          {/* Bottom Footer Tip */}
          <div className="w-full max-w-2xl text-center py-2 px-4 bg-zinc-900/80 rounded-xl border border-zinc-800 text-xs text-zinc-400 z-20">
            <span>Tip: Use the zoom controls above or pinch to inspect items & prices up close!</span>
          </div>

        </div>
      )}

    </section>
  );
};
