import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Copy, 
  Check, 
  Send, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Banknote, 
  ArrowRight,
  Info,
  QrCode
} from 'lucide-react';
import { STORE_INFO } from '../data/menuData';

export const PaymentMethodsSection: React.FC = () => {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [showPayNowModal, setShowPayNowModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'easypaisa' | 'jazzcash'>('easypaisa');

  const paymentNumber = STORE_INFO.paymentAccount || '03222229333';
  const accountTitle = STORE_INFO.paymentName || 'Pizza Pro Official';

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  const handleOpenWhatsAppPayment = (method: string) => {
    const text = encodeURIComponent(
      `Hi Pizza Pro! 👋 I want to pay via ${method} for my order.\nPayment Account: ${paymentNumber} (${accountTitle})\nPlease confirm once you receive the payment screenshot.`
    );
    window.open(`https://wa.me/92${paymentNumber.substring(1)}?text=${text}`, '_blank');
  };

  return (
    <section id="payment" className="py-14 bg-zinc-950 text-white relative overflow-hidden border-t-2 border-red-600">
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>100% SECURE & INSTANT PAYMENTS</span>
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight italic">
            Payment <span className="text-red-500">Methods</span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 font-medium leading-relaxed">
            Send payments directly to our verified business account via <strong className="text-emerald-400">EasyPaisa</strong> or <strong className="text-red-400">JazzCash</strong> for rapid order processing and instant doorstep delivery.
          </p>
        </div>

        {/* Payment Account Highlight Bar */}
        <div className="max-w-4xl mx-auto mb-10 p-5 sm:p-6 bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-850 rounded-3xl border border-zinc-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-amber-500 p-0.5 shadow-lg shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <Smartphone className="w-7 h-7" />
              </div>
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
                OFFICIAL PAYMENT NUMBER (EASYPAISA & JAZZCASH)
              </span>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
                  {paymentNumber}
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[11px] font-extrabold rounded-md border border-emerald-500/30">
                  Verified
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium mt-0.5">
                Account Title: <strong className="text-amber-400 font-bold">{accountTitle}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Quick Copy Button */}
            <button
              onClick={() => handleCopy(paymentNumber)}
              className="flex-1 md:flex-initial px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl border border-zinc-700 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              {copiedNumber === paymentNumber ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span>COPY NUMBER</span>
                </>
              )}
            </button>

            {/* Prominent Pay Now CTA Button */}
            <button
              onClick={() => setShowPayNowModal(true)}
              className="flex-1 md:flex-initial px-6 py-3 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-red-600/30 transition-all transform hover:scale-105 flex items-center justify-center gap-2 border border-red-400"
            >
              <Zap className="w-4 h-4 text-amber-200 fill-amber-200 animate-pulse" />
              <span>PAY NOW</span>
            </button>
          </div>
        </div>

        {/* Cards Grid: EasyPaisa vs JazzCash */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* EASYPAISA CARD */}
          <div className="relative group bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/40 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/30 hover:border-emerald-500 shadow-2xl transition-all duration-300">
            <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/40 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>Instant Transfer</span>
            </div>

            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-zinc-950 font-black text-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                ep
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">EasyPaisa</h3>
                <p className="text-xs text-emerald-400 font-bold">Mobile Account / QR Transfer</p>
              </div>
            </div>

            {/* Account Details Box */}
            <div className="bg-zinc-950/80 rounded-2xl p-4 border border-zinc-800 space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Account Number:</span>
                <span className="font-mono font-bold text-white text-sm">{paymentNumber}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Account Title:</span>
                <span className="font-extrabold text-amber-400">{accountTitle}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Transfer Fee:</span>
                <span className="text-emerald-400 font-bold">0% (FREE)</span>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-2.5 mb-6 text-xs text-zinc-300">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                <span>Open your <strong>EasyPaisa App</strong> & tap <strong>Send Money</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                <span>Enter receiver number: <strong className="text-white font-mono">{paymentNumber}</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                <span>Send payment receipt screenshot on WhatsApp to confirm your order.</span>
              </div>
            </div>

            {/* Pay with EasyPaisa CTA */}
            <button
              onClick={() => {
                setSelectedMethod('easypaisa');
                handleOpenWhatsAppPayment('EasyPaisa');
              }}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Pay via EasyPaisa ({paymentNumber})</span>
            </button>
          </div>

          {/* JAZZCASH CARD */}
          <div className="relative group bg-gradient-to-br from-zinc-900 via-zinc-900 to-red-950/40 rounded-3xl p-6 sm:p-8 border-2 border-red-500/30 hover:border-red-500 shadow-2xl transition-all duration-300">
            <div className="absolute top-4 right-4 px-3 py-1 bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-500/40 flex items-center gap-1">
              <Zap className="w-3 h-3 text-red-400" />
              <span>Instant Transfer</span>
            </div>

            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-amber-500 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-red-600/30">
                jc
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">JazzCash</h3>
                <p className="text-xs text-red-400 font-bold">Mobile Account / Till Payment</p>
              </div>
            </div>

            {/* Account Details Box */}
            <div className="bg-zinc-950/80 rounded-2xl p-4 border border-zinc-800 space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Account Number:</span>
                <span className="font-mono font-bold text-white text-sm">{paymentNumber}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Account Title:</span>
                <span className="font-extrabold text-amber-400">{accountTitle}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Transfer Fee:</span>
                <span className="text-emerald-400 font-bold">0% (FREE)</span>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-2.5 mb-6 text-xs text-zinc-300">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                <span>Open <strong>JazzCash App</strong> or dial <strong>*786#</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                <span>Select <strong>Send Money</strong> to JazzCash number: <strong className="text-white font-mono">{paymentNumber}</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                <span>Share transaction ID or screenshot on WhatsApp.</span>
              </div>
            </div>

            {/* Pay with JazzCash CTA */}
            <button
              onClick={() => {
                setSelectedMethod('jazzcash');
                handleOpenWhatsAppPayment('JazzCash');
              }}
              className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Pay via JazzCash ({paymentNumber})</span>
            </button>
          </div>

        </div>

        {/* Additional Payment Options Note: Cash on Delivery */}
        <div className="mt-12 text-center max-w-2xl mx-auto p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Banknote className="w-4 h-4 text-amber-400" />
            <span>Prefer Cash? <strong className="text-white">Cash on Delivery (COD)</strong> is also available at checkout!</span>
          </div>
          <span className="hidden sm:inline text-zinc-600">•</span>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Safe & Verified Transactions</span>
          </div>
        </div>

      </div>

      {/* Pay Now Interactive Modal */}
      {showPayNowModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-zinc-900 border-2 border-red-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-r from-red-600 to-amber-500 rounded-2xl text-white shadow-md">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black italic tracking-tight">Direct Payment Guide</h3>
                  <p className="text-xs text-zinc-400">Pizza Pro Official Payment Desk</p>
                </div>
              </div>
              <button
                onClick={() => setShowPayNowModal(false)}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-full transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Account Info Highlight */}
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
              <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                Select Payment Account
              </div>
              <div className="p-3 bg-zinc-900 rounded-xl border border-amber-500/40 flex items-center justify-between">
                <div>
                  <div className="text-xs text-amber-400 font-extrabold">{accountTitle}</div>
                  <div className="text-2xl font-black font-mono text-white tracking-tight">{paymentNumber}</div>
                  <div className="text-[11px] text-zinc-400">Supported: EasyPaisa & JazzCash</div>
                </div>
                <button
                  onClick={() => handleCopy(paymentNumber)}
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  {copiedNumber === paymentNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedNumber === paymentNumber ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Quick Method Buttons */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-300">
                Choose your wallet app:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleOpenWhatsAppPayment('EasyPaisa')}
                  className="p-3.5 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/50 rounded-2xl text-left transition-all group"
                >
                  <div className="text-emerald-400 font-black text-sm group-hover:scale-105 transition-transform">EasyPaisa</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Send receipt to WhatsApp</div>
                </button>

                <button
                  onClick={() => handleOpenWhatsAppPayment('JazzCash')}
                  className="p-3.5 bg-red-950/60 hover:bg-red-900/80 border border-red-500/50 rounded-2xl text-left transition-all group"
                >
                  <div className="text-red-400 font-black text-sm group-hover:scale-105 transition-transform">JazzCash</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Send receipt to WhatsApp</div>
                </button>
              </div>
            </div>

            {/* Note */}
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>After sending money to <strong>03222229333</strong>, please share your payment receipt or TRX ID on WhatsApp for instant order confirmation.</span>
            </div>

            {/* Close */}
            <button
              onClick={() => setShowPayNowModal(false)}
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-colors"
            >
              Done / Close
            </button>

          </div>
        </div>
      )}

    </section>
  );
};
