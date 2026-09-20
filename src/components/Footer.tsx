import React, { useState } from 'react';
import { Phone, MapPin, Mail, Clock, Send, Heart, Flame } from 'lucide-react';
import { STORE_INFO } from '../data/menuData';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-zinc-950 text-white border-t border-zinc-900 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center font-black italic text-white text-lg">
                PP
              </div>
              <span className="text-xl font-black italic tracking-tight text-white">
                PIZZA <span className="text-red-600">PRO</span>
              </span>
            </div>

            <p className="text-xs text-zinc-400 font-medium leading-relaxed">
              {STORE_INFO.slogan}
            </p>

            <div className="pt-2 text-xs text-zinc-400 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>{STORE_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>{STORE_INFO.timings}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-black text-xs uppercase tracking-widest text-red-500">
              Quick Menu Links
            </h4>
            <ul className="text-xs text-zinc-400 space-y-2 font-medium">
              <li><a href="#menu" className="hover:text-white transition-colors">Regular & Special Pizzas</a></li>
              <li><a href="#menu" className="hover:text-white transition-colors">Fillet & Zinger Burgers</a></li>
              <li><a href="#deals" className="hover:text-white transition-colors">Exclusive Combo Deals</a></li>
              <li><a href="#packaging" className="hover:text-white transition-colors">Insulated Box Design</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Google Maps Location</a></li>
            </ul>
          </div>

          {/* Phone Numbers & Payments */}
          <div className="space-y-3">
            <h4 className="font-black text-xs uppercase tracking-widest text-red-500">
              Order Hotline
            </h4>
            <div className="space-y-1.5 text-xs text-zinc-300 font-bold">
              {STORE_INFO.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone}`}
                  className="block p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-red-600 transition-colors font-mono text-red-400"
                >
                  <Phone className="w-3.5 h-3.5 inline mr-2 text-amber-500" />
                  {phone}
                </a>
              ))}
            </div>

            <div className="pt-2 text-[10px] text-zinc-400 font-semibold">
              <span>Accepted Payments: Cash on Delivery, JazzCash & EasyPaisa (03222229333)</span>
            </div>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-3">
            <h4 className="font-black text-xs uppercase tracking-widest text-red-500">
              Join Pizza Pro Club
            </h4>
            <p className="text-xs text-zinc-400">
              Subscribe to get exclusive discount coupons and Friday deal alerts!
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-400 text-xs font-bold">
                ✓ Subscribed! You will receive deal alerts.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>SUBSCRIBE</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-medium gap-2">
          <p>© {new Date().getFullYear()} Pizza Pro Shergarh. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Made with</span>
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <span>for Shergarh Fast-Food Lovers</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
