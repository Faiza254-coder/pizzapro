import React from 'react';
import { MessageCircle } from 'lucide-react';
import { STORE_INFO } from '../data/menuData';
import { formatPhoneNumberForWhatsApp } from '../lib/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const handleWhatsApp = () => {
    const text = `Hi Pizza Pro Shergarh! 🍕 I want to place an order or ask a question.`;
    const cleanNumber = formatPhoneNumberForWhatsApp(STORE_INFO.whatsapp);
    window.open(
      `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
      <button
        onClick={handleWhatsApp}
        className="p-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl shadow-emerald-900/40 flex items-center justify-center transition-transform hover:scale-110 group"
        title="Order via WhatsApp (03251229333)"
      >
        <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
};
