import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Phone, 
  MapPin, 
  User, 
  ShoppingBag, 
  Copy, 
  Check, 
  Clock,
  Printer,
  AlertCircle,
  MessageSquare,
  Mail
} from 'lucide-react';
import { CartItem, Order, Coupon, UserProfile } from '../types';
import { STORE_INFO } from '../data/menuData';
import { auth, saveOrderToFirestore } from '../lib/firebase';
import { sendWhatsAppOrderNotification, getWhatsAppOrderUrl } from '../lib/whatsapp';
import { sendOrderEmailNotifications } from '../lib/email';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  orderType: 'delivery' | 'takeaway';
  appliedCoupon: Coupon | null;
  onPlaceOrder: (newOrder: Order) => void;
  currentUser?: UserProfile | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  orderType,
  appliedCoupon,
  onPlaceOrder,
  currentUser,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('Shergarh, Punjab');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'jazzcash' | 'easypaisa'>('cod');
  const [trxId, setTrxId] = useState('');
  const [senderAccountPhone, setSenderAccountPhone] = useState('');
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (currentUser?.name || auth.currentUser?.displayName) {
        setCustomerName(currentUser?.name || auth.currentUser?.displayName || '');
      }
      if (currentUser?.phone) {
        setCustomerPhone(currentUser?.phone || '');
      }
      if (currentUser?.email || auth.currentUser?.email) {
        setCustomerEmail(currentUser?.email || auth.currentUser?.email || '');
      }
      setErrorMsg('');
      setSubmittedOrder(null);
      setTrxId('');
      setSenderAccountPhone('');
    }
  }, [isOpen, currentUser]);

  // Bill calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const discount = appliedCoupon
    ? appliedCoupon.discountPercent
      ? Math.round((subtotal * appliedCoupon.discountPercent) / 100)
      : appliedCoupon.fixedDiscount || 0
    : 0;
  const deliveryFee = orderType === 'delivery' ? (subtotal >= 800 ? 0 : 80) : 0;
  const totalAmount = Math.max(0, subtotal - discount + deliveryFee);

  const handleCopyAccount = (numToCopy: string) => {
    navigator.clipboard.writeText(numToCopy);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Please fill in your full name and phone number.');
      return;
    }

    if ((paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa') && !trxId.trim()) {
      setErrorMsg(`Please enter your ${paymentMethod === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'} Transaction ID (Trx ID) after sending payment.`);
      return;
    }

    const orderId = `PP-${Math.floor(100000 + Math.random() * 900000)}`;
    const effectiveEmail = customerEmail.trim() || currentUser?.email || auth.currentUser?.email || '';
    const effectiveUserId = currentUser?.id || auth.currentUser?.uid || 'guest';

    const cleanNotes = senderAccountPhone.trim() 
      ? `${notes ? notes + ' | ' : ''}Sender Account: ${senderAccountPhone.trim()}`
      : notes;

    const newOrder: Order = {
      orderId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: effectiveEmail,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : 'Takeaway Counter Pickup (Shergarh Branch)',
      items: [...cartItems],
      subtotal,
      discount,
      deliveryFee,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' 
        ? 'Pending COD' 
        : paymentMethod === 'jazzcash' 
          ? `Paid via JazzCash (Trx: ${trxId.trim()})` 
          : `Paid via EasyPaisa (Trx: ${trxId.trim()})`,
      paymentTxnId: trxId.trim() || undefined,
      orderStatus: 'Pending',
      orderType,
      notes: cleanNotes,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAtISO: new Date().toISOString(),
      estimatedTimeMinutes: 25,
      barcodeValue: orderId,
    };

    // Generate official wa.me link with full international format phone number
    const waUrl = getWhatsAppOrderUrl(newOrder, STORE_INFO.whatsapp);

    // Pre-open window on direct user action to satisfy browser popup policies
    const waWindow = window.open('about:blank', '_blank');

    setLoading(true);
    try {
      // 1. Save order to Cloud Firestore database
      await saveOrderToFirestore(newOrder, effectiveUserId);
      setSubmittedOrder(newOrder);
      onPlaceOrder(newOrder);

      // 2. Immediately after successful Firestore save, direct WhatsApp with pre-filled message
      if (waWindow && !waWindow.closed) {
        waWindow.location.href = waUrl;
      } else {
        window.location.href = waUrl;
      }

      // 3. Background API notifications (WhatsApp Cloud + Email)
      sendWhatsAppOrderNotification(newOrder).catch((err) => {
        console.warn('Background WhatsApp notification catch:', err);
      });

      sendOrderEmailNotifications(newOrder).catch((err) => {
        console.warn('Background Email notification catch:', err);
      });
    } catch (err: any) {
      console.warn('Order save notice during checkout:', err);
      setSubmittedOrder(newOrder);
      onPlaceOrder(newOrder);
      if (waWindow && !waWindow.closed) {
        waWindow.location.href = waUrl;
      } else {
        window.location.href = waUrl;
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-zinc-200 shadow-2xl relative"
        >
          {/* Header */}
          <div className="bg-zinc-950 text-white p-5 flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-red-600 text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg italic text-white">
                  Pizza Pro Quick Checkout
                </h3>
                <p className="text-xs text-zinc-400">
                  {orderType === 'delivery' ? 'Home Delivery in Shergarh' : 'Takeaway Pickup'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success State screen */}
          {submittedOrder ? (
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-black uppercase text-red-600 tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-200">
                  ORDER CONFIRMED!
                </span>
                <h2 className="text-3xl font-black text-zinc-950 mt-2">
                  Thank You, {submittedOrder.customerName}!
                </h2>
                <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
                  Your order has been sent to our kitchen. Est. Delivery Time: <span className="font-bold text-zinc-900">25–30 Mins</span>.
                </p>
              </div>

              {/* Order ID & Barcode Card */}
              <div className="p-5 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-300 max-w-md mx-auto text-left space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">
                      Order Barcode ID
                    </span>
                    <h4 className="text-xl font-black text-red-600">
                      {submittedOrder.orderId}
                    </h4>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-zinc-200 shadow-sm flex flex-col items-center">
                    <QrCode className="w-8 h-8 text-zinc-900" />
                    <span className="text-[9px] font-bold text-zinc-500 mt-0.5">SCAN ME</span>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 text-zinc-700 font-medium">
                  <div className="flex justify-between">
                    <span>Customer Phone:</span>
                    <span className="font-bold">{submittedOrder.customerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-bold uppercase text-red-600">
                      {submittedOrder.paymentMethod === 'cod' && 'Cash on Delivery'}
                      {submittedOrder.paymentMethod === 'jazzcash' && 'JazzCash Mobile Wallet'}
                      {submittedOrder.paymentMethod === 'easypaisa' && 'EasyPaisa Mobile Wallet'}
                      {submittedOrder.paymentMethod !== 'cod' && submittedOrder.paymentMethod !== 'jazzcash' && submittedOrder.paymentMethod !== 'easypaisa' && submittedOrder.paymentMethod}
                    </span>
                  </div>
                  {submittedOrder.paymentTxnId && (
                    <div className="flex justify-between font-mono font-semibold text-xs text-amber-700">
                      <span>Transaction ID:</span>
                      <span>{submittedOrder.paymentTxnId}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-zinc-950 pt-2 border-t border-zinc-200">
                    <span>Total Bill:</span>
                    <span className="text-red-600">Rs {submittedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-200 space-y-2">
                  <a
                    href={getWhatsAppOrderUrl(submittedOrder, STORE_INFO.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    <span>Open WhatsApp Chat Again</span>
                  </a>

                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-[11px] font-bold text-emerald-800">
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>WhatsApp Cloud API & Direct Redirect</span>
                    </div>
                    <span className="bg-emerald-600 text-white text-[9px] px-2 py-0.5 rounded-full font-black uppercase">
                      Sent ⚡
                    </span>
                  </div>

                  <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-[11px] font-bold text-blue-900">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Order Confirmation Email & Owner Alert</span>
                    </div>
                    <span className="bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded-full font-black uppercase">
                      Dispatched ✉️
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white px-5 py-3 rounded-2xl font-bold text-xs uppercase"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>

                <button
                  onClick={onClose}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase shadow-lg shadow-red-600/30"
                >
                  <span>CLOSE & TRACK LIVE</span>
                </button>
              </div>
            </div>
          ) : (
            /* Form state */
            <form onSubmit={handleSubmitOrder} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Personal Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>1. Customer Details</span>
                </h4>

                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-700 mb-1 block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Muhammad Ali"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-700 mb-1 block">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 03251229333"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-zinc-700 mb-1 block">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. customer@pizzapro.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                {orderType === 'delivery' && (
                  <div>
                    <label className="text-[11px] font-bold text-zinc-700 mb-1 block">
                      Delivery Address (Shergarh, Punjab) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Enter street address, nearby landmark in Shergarh..."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-red-600 resize-none"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-zinc-700 mb-1 block">
                    Special Instructions / Allergies (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Extra spicy, call upon arrival..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3 pt-2 border-t border-zinc-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  <span>2. Payment Option</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Cash on Delivery */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all relative ${
                      paymentMethod === 'cod'
                        ? 'border-red-600 bg-red-50/50 shadow-md ring-2 ring-red-600/20'
                        : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Banknote className="w-5 h-5 text-red-600" />
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700">
                        COD
                      </span>
                    </div>
                    <div>
                      <h5 className="font-extrabold text-xs text-zinc-900">Cash on Delivery</h5>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Pay cash upon delivery</p>
                    </div>
                  </button>

                  {/* JazzCash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('jazzcash')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all relative ${
                      paymentMethod === 'jazzcash'
                        ? 'border-red-600 bg-red-950/10 shadow-md ring-2 ring-red-600/30'
                        : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black tracking-tight text-red-600 bg-red-100 px-2 py-0.5 rounded-lg border border-red-200">
                        JazzCash
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-600 text-white">
                        Online
                      </span>
                    </div>
                    <div>
                      <h5 className="font-extrabold text-xs text-zinc-900">JazzCash Wallet</h5>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Instant mobile transfer</p>
                    </div>
                  </button>

                  {/* EasyPaisa */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('easypaisa')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all relative ${
                      paymentMethod === 'easypaisa'
                        ? 'border-emerald-600 bg-emerald-950/10 shadow-md ring-2 ring-emerald-600/30'
                        : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black tracking-tight text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200">
                        EasyPaisa
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                        Online
                      </span>
                    </div>
                    <div>
                      <h5 className="font-extrabold text-xs text-zinc-900">EasyPaisa Wallet</h5>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Instant mobile transfer</p>
                    </div>
                  </button>
                </div>

                {/* COD Info */}
                {paymentMethod === 'cod' && (
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs flex items-center gap-2.5 text-zinc-700 font-medium">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>No advance payment required. Pay <strong>Rs {totalAmount.toLocaleString()}</strong> in cash to our delivery rider upon arrival in Shergarh!</span>
                  </div>
                )}

                {/* JazzCash Dedicated Panel */}
                {paymentMethod === 'jazzcash' && (
                  <div className="p-4 bg-gradient-to-br from-red-50 to-amber-50/60 border border-red-200 rounded-2xl text-xs space-y-3.5 shadow-sm">
                    <div className="flex items-center justify-between pb-2.5 border-b border-red-200/80">
                      <div>
                        <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider block">
                          JazzCash Account Title
                        </span>
                        <span className="font-black text-zinc-900 text-sm">
                          {STORE_INFO.jazzcashName || STORE_INFO.paymentName}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider block">
                          JazzCash Number
                        </span>
                        <div className="flex items-center gap-1.5 font-mono font-black text-red-600 text-base">
                          <span>{STORE_INFO.jazzcashAccount || STORE_INFO.paymentAccount}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyAccount(STORE_INFO.jazzcashAccount || STORE_INFO.paymentAccount)}
                            className="p-1 hover:bg-red-200/60 rounded-lg text-red-900 transition-colors"
                            title="Copy Account Number"
                          >
                            {copiedAccount ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/80 p-3 rounded-xl border border-red-100 text-[11px] space-y-1 text-zinc-700 font-medium">
                      <p className="font-bold text-red-900">How to pay via JazzCash:</p>
                      <ol className="list-decimal list-inside space-y-0.5 text-zinc-600">
                        <li>Open your <strong>JazzCash App</strong> or dial <strong>*786#</strong></li>
                        <li>Send <strong>Rs {totalAmount.toLocaleString()}</strong> to account <strong>{STORE_INFO.jazzcashAccount || STORE_INFO.paymentAccount}</strong></li>
                        <li>Copy the 11/12-digit <strong>Transaction ID (Trx ID)</strong> from SMS and enter below:</li>
                      </ol>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-zinc-800 mb-1 block">
                          JazzCash Trx ID *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 01847392819"
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-red-300 rounded-xl focus:outline-none focus:border-red-600 font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-zinc-800 mb-1 block">
                          Sender JazzCash Number (Optional)
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g. 03001234567"
                          value={senderAccountPhone}
                          onChange={(e) => setSenderAccountPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-red-300 rounded-xl focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* EasyPaisa Dedicated Panel */}
                {paymentMethod === 'easypaisa' && (
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200 rounded-2xl text-xs space-y-3.5 shadow-sm">
                    <div className="flex items-center justify-between pb-2.5 border-b border-emerald-200/80">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                          EasyPaisa Account Title
                        </span>
                        <span className="font-black text-zinc-900 text-sm">
                          {STORE_INFO.easypaisaName || STORE_INFO.paymentName}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                          EasyPaisa Number
                        </span>
                        <div className="flex items-center gap-1.5 font-mono font-black text-emerald-700 text-base">
                          <span>{STORE_INFO.easypaisaAccount || STORE_INFO.paymentAccount}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyAccount(STORE_INFO.easypaisaAccount || STORE_INFO.paymentAccount)}
                            className="p-1 hover:bg-emerald-200/60 rounded-lg text-emerald-900 transition-colors"
                            title="Copy Account Number"
                          >
                            {copiedAccount ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/80 p-3 rounded-xl border border-emerald-100 text-[11px] space-y-1 text-zinc-700 font-medium">
                      <p className="font-bold text-emerald-900">How to pay via EasyPaisa:</p>
                      <ol className="list-decimal list-inside space-y-0.5 text-zinc-600">
                        <li>Open your <strong>EasyPaisa App</strong> or dial <strong>*786#</strong></li>
                        <li>Send <strong>Rs {totalAmount.toLocaleString()}</strong> to account <strong>{STORE_INFO.easypaisaAccount || STORE_INFO.paymentAccount}</strong></li>
                        <li>Copy the 11/12-digit <strong>Transaction ID (Trx ID)</strong> from SMS and enter below:</li>
                      </ol>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-zinc-800 mb-1 block">
                          EasyPaisa Trx ID *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 01847392819"
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-emerald-300 rounded-xl focus:outline-none focus:border-emerald-600 font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-zinc-800 mb-1 block">
                          Sender EasyPaisa Number (Optional)
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g. 03451234567"
                          value={senderAccountPhone}
                          onChange={(e) => setSenderAccountPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-emerald-300 rounded-xl focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="p-4 bg-zinc-950 text-white rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total Items ({cartItems.length}):</span>
                  <span>Rs {subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-amber-400 font-bold">
                    <span>Discount:</span>
                    <span>- Rs {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>Delivery Charge:</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `Rs ${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-black pt-2 border-t border-zinc-800 text-white">
                  <span>Final Amount Payable:</span>
                  <span className="text-red-500">Rs {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-700 text-white font-black text-sm uppercase rounded-2xl shadow-xl shadow-emerald-900/40 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>SAVING & OPENING WHATSAPP...</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5 fill-white" />
                    <span>PLACE ORDER ON WHATSAPP</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
