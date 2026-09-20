import React, { useState, useEffect, useRef } from 'react';
import { Users, Sparkles, Flame, Heart, Maximize2, X, ShieldCheck, Award, Upload, Camera, RotateCcw } from 'lucide-react';
import { BRAND_ASSETS } from '../data/menuData';

export const SquadSection: React.FC = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const savedPhoto = localStorage.getItem('pizza_pro_custom_squad_photo');
    if (savedPhoto) {
      setCustomPhoto(savedPhoto);
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCustomPhoto(result);
          localStorage.setItem('pizza_pro_custom_squad_photo', result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetPhoto = () => {
    setCustomPhoto(null);
    localStorage.removeItem('pizza_pro_custom_squad_photo');
  };

  const squadImg = customPhoto || BRAND_ASSETS.squadPhoto || '/squad.jpg';

  const teamBadges = [
    {
      icon: Flame,
      title: 'Master Pizza Chefs',
      desc: 'Crafting authentic hand-tossed dough & rich secret sauce daily.',
    },
    {
      icon: Award,
      title: 'Stone Deck Oven Experts',
      desc: 'Baking at 400°C for the perfect golden crisp & melted cheese.',
    },
    {
      icon: Sparkles,
      title: 'Express Delivery Crew',
      desc: 'Delivering piping hot pizza across Shergarh in 25–35 mins.',
    },
    {
      icon: Heart,
      title: 'Dedicated Customer Care',
      desc: 'Serving our community with warm hospitality & top quality.',
    },
  ];

  return (
    <section id="squad" className="py-12 bg-zinc-50 border-b border-zinc-200 overflow-hidden relative">
      {/* Hidden File Input for Custom Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Decorative Background Accents */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3.5">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-600 bg-red-100/80 px-4 py-1.5 rounded-full border border-red-200/80 shadow-xs">
            <Users className="w-4 h-4 text-red-600 animate-pulse" />
            <span>OUR PASSIONATE TEAM</span>
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight italic">
            Pizza Pro <span className="text-red-600">Squad</span>
          </h2>

          {/* Requested Short Caption */}
          <p className="text-base sm:text-lg font-bold text-zinc-800 bg-white/90 backdrop-blur-xs py-3.5 px-6 rounded-2xl border border-zinc-200/80 shadow-xs inline-block max-w-2xl leading-relaxed">
            “Meet the Pizza Pro Squad — The Team Behind Your Favorite Pizza! 🍕🔥”
          </p>
        </div>

        {/* Main Team Photo Card Showcase */}
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border-4 border-zinc-950 shadow-2xl bg-zinc-950 group transition-all duration-500">
            {/* Natural & Clear Original Worker Photo */}
            <div className="relative aspect-16/10 sm:aspect-16/9 overflow-hidden bg-zinc-950 flex items-center justify-center">
              <img
                src={squadImg}
                alt="Pizza Pro Squad Team Photo"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';
                }}
                className="w-full h-full object-contain sm:object-cover object-center transition-transform duration-700 cursor-pointer"
                onClick={() => setLightboxOpen(true)}
              />

              {/* Top Controls Bar */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-zinc-950/80 hover:bg-red-600 text-white px-3.5 py-2 rounded-xl backdrop-blur-md border border-white/20 transition-all duration-300 shadow-xl flex items-center gap-2 text-xs font-black cursor-pointer hover:scale-105"
                  title="Upload your exact original squad photo from your phone/computer"
                >
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>Upload Photo</span>
                </button>

                {customPhoto && (
                  <button
                    onClick={handleResetPhoto}
                    className="bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white p-2 rounded-xl backdrop-blur-md border border-white/10 transition-all duration-300 shadow-xl cursor-pointer"
                    title="Reset to default photo"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => setLightboxOpen(true)}
                  className="bg-zinc-950/80 hover:bg-red-600 text-white p-2 sm:px-3 sm:py-2 rounded-xl backdrop-blur-md border border-white/20 transition-all duration-300 shadow-xl flex items-center gap-2 text-xs font-black cursor-pointer hover:scale-105"
                  title="View Full Resolution Photo"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Zoom</span>
                </button>
              </div>

              {/* Bottom Badge Caption Overlay */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
                <div className="bg-zinc-950/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl border border-red-500/40 shadow-xl flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <span className="text-sm sm:text-base font-black tracking-wide">
                    Pizza Pro Squad 😎
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-2 bg-red-600 text-white px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-lg">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Shergarh Local Team</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick upload tip info box */}
          <div className="mt-3 flex items-center justify-between px-2 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5 font-medium">
              <Camera className="w-3.5 h-3.5 text-red-600" />
              Original, unedited staff photograph
            </span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-red-600 hover:underline font-bold cursor-pointer"
            >
              Click here to upload/replace squad image
            </button>
          </div>

          {/* Team Core Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {teamBadges.map((badge, idx) => {
              const IconComp = badge.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200/90 shadow-xs hover:border-red-500/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-extrabold text-zinc-950 leading-tight">
                      {badge.title}
                    </h3>
                  </div>
                  <p className="text-xs font-medium text-zinc-600 leading-relaxed">
                    {badge.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Modal for High Resolution Zoom */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center justify-center">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-12 right-0 sm:top-2 sm:right-2 z-10 p-3 rounded-full bg-zinc-800 hover:bg-red-600 text-white transition-colors shadow-2xl cursor-pointer"
              aria-label="Close photo modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="rounded-3xl overflow-hidden border-2 border-red-500/50 shadow-2xl max-h-[82vh] bg-black">
              <img
                src={squadImg}
                alt="Pizza Pro Squad Full Resolution"
                referrerPolicy="no-referrer"
                className="max-h-[80vh] w-auto max-w-full object-contain rounded-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <p className="text-white text-center mt-4 font-bold text-sm bg-zinc-900/80 px-6 py-2 rounded-full border border-zinc-700">
              Meet the Pizza Pro Squad — The Team Behind Your Favorite Pizza! 🍕🔥
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

