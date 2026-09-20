import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Package, ShieldCheck, Flame, Sparkles, CheckCircle, Phone, MapPin, Eye } from 'lucide-react';
import { STORE_INFO, BRAND_ASSETS } from '../data/menuData';

export const PackagingSection: React.FC = () => {
  const [showBox3DModal, setShowBox3DModal] = useState(false);

  return (
    <section id="packaging" className="py-12 bg-zinc-950 text-white relative overflow-hidden">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-5">
            <span className="px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              <span>PIZZA PRO SIGNATURE BOX</span>
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-tight leading-none text-white">
              Insulated Freshness <br />
              <span className="text-red-600">In Every Box</span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 font-medium leading-relaxed">
              We deliver our hot pizzas and burgers in our custom-designed, food-grade Pizza Pro box. Engineered with steam release micro-vents to keep your crust crispy, cheese gooey, and temperature piping hot all the way to your doorstep in Shergarh.
            </p>

            {/* Key Packaging Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-white uppercase">100% Food Safe Cardboard</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Non-toxic, eco-friendly food grade coating.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start gap-3">
                <Flame className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-white uppercase">Thermal Heat Lock</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Maintains oven heat up to 45 minutes.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-white uppercase">Anti-Soggy Vents</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Micro-perforations release excess steam.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-white uppercase">Tamper-Evident Seal</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Guaranteed untouched from oven to table.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => setShowBox3DModal(true)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-red-900/40 transition-all hover:scale-105"
              >
                <Eye className="w-4 h-4" />
                <span>EXPLORE 3D BOX DESIGN</span>
              </button>
            </div>
          </div>

          {/* Right Custom Box Visual Preview */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full max-w-md bg-red-600 p-1.5 rounded-3xl shadow-[0_0_60px_rgba(220,38,38,0.4)] border-2 border-red-500/50 group">
              <div className="bg-zinc-950 p-6 rounded-[22px] border border-red-950 flex flex-col items-center text-center space-y-4">
                {/* Simulated Red & Black Box Lid Design matching uploaded image_1 */}
                <div className="w-full bg-red-600 text-white p-6 rounded-2xl border-4 border-black relative overflow-hidden shadow-inner">
                  {/* Three Bold White Stripes */}
                  <div className="flex justify-center gap-2 my-2">
                    <div className="w-3 h-12 bg-white rounded-full" />
                    <div className="w-3 h-12 bg-white rounded-full" />
                    <div className="w-3 h-12 bg-white rounded-full" />
                  </div>

                  <h3 className="text-3xl font-black italic tracking-tighter text-white drop-shadow-md uppercase">
                    PIZZA PRO
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-100 bg-black/60 px-3 py-1 rounded-full w-max mx-auto mt-1">
                    SHERGARH'S FINEST CHOICE
                  </p>

                  <p className="text-[10px] font-bold text-white/90 mt-3">
                    www.pizzapro.pk
                  </p>
                </div>

                {/* Box Details Strip */}
                <div className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-left text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-zinc-300 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>{STORE_INFO.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300 font-bold">
                    <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{STORE_INFO.phones.join(' / ')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider">
                  <span>TAKE AWAY</span>
                  <span className="text-amber-400">FRESHLY BAKED DAILY</span>
                  <span>DELIVERY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Box Modal */}
      {showBox3DModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 text-white relative shadow-2xl"
          >
            <button
              onClick={() => setShowBox3DModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white text-sm font-bold bg-zinc-800 p-2 rounded-full"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 text-red-500 font-black text-xs uppercase mb-2">
              <Package className="w-4 h-4" />
              <span>Pizza Pro Official Box Artwork</span>
            </div>

            <h3 className="text-xl font-black italic text-white mb-4">
              Shergarh Packaging Blueprint
            </h3>

            <div className="bg-red-600 text-white p-6 rounded-2xl border-4 border-black text-center space-y-3">
              <div className="text-2xl font-black italic tracking-tight">
                PIZZA PRO
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-200">
                Main Petroleum Hujra Road, Shergarh, Punjab
              </p>
              <div className="py-2 border-y border-red-500 flex justify-center gap-6 text-xs font-black">
                <span>0325-1229333</span>
                <span>0311-4449783</span>
              </div>
              <p className="text-xs font-extrabold tracking-wider">
                FRESHLY BAKED DAILY • TAKE AWAY • HOME DELIVERY
              </p>
            </div>

            <p className="text-xs text-zinc-400 mt-4 leading-relaxed">
              Every order from Pizza Pro is sealed inside this high-temperature protective box. We guarantee piping hot pizza delivered to your door in Shergarh!
            </p>

            <button
              onClick={() => setShowBox3DModal(false)}
              className="mt-6 w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl transition-colors"
            >
              CLOSE PREVIEW
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
};
