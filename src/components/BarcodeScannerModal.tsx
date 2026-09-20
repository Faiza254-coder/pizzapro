import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  QrCode, 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Flame, 
  Truck, 
  ChefHat, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { Order } from '../types';
import { STORE_INFO } from '../data/menuData';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentOrders: Order[];
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  recentOrders,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [scannedOrder, setScannedOrder] = useState<Order | null>(
    recentOrders.length > 0 ? recentOrders[0] : null
  );
  const [isScanning, setIsScanning] = useState(false);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (recentOrders.length > 0) {
        setScannedOrder(recentOrders[0]);
      } else {
        // Create demo tracked order
        setScannedOrder({
          orderId: 'PP-582910',
          customerName: 'Muhammad Ali',
          customerPhone: '03251229333',
          deliveryAddress: 'Main Petroleum Hujra Road, Shergarh',
          items: [],
          subtotal: 1350,
          discount: 270,
          deliveryFee: 0,
          totalAmount: 1080,
          paymentMethod: 'cod',
          paymentStatus: 'Pending COD',
          orderStatus: 'Oven Baking',
          orderType: 'delivery',
          createdAt: '12:45 PM',
          estimatedTimeMinutes: 18,
          barcodeValue: 'PP-582910',
        });
      }
    }, 1500);
  };

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const found = recentOrders.find(
      (o) => o.orderId.toLowerCase() === searchInput.trim().toLowerCase()
    );

    if (found) {
      setScannedOrder(found);
    } else {
      alert(`No order found matching ID: ${searchInput}`);
    }
  };

  if (!isOpen) return null;

  const statuses = ['Received', 'Kitchen Prep', 'Oven Baking', 'Out for Delivery', 'Delivered'];
  const currentStatusIndex = scannedOrder
    ? statuses.indexOf(scannedOrder.orderStatus) !== -1
      ? statuses.indexOf(scannedOrder.orderStatus)
      : 2
    : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-xl w-full text-white shadow-2xl overflow-hidden relative"
        >
          {/* Header */}
          <div className="p-5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-600 text-white rounded-xl">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base italic text-white">
                  Barcode Scanner & Order Tracker
                </h3>
                <p className="text-xs text-zinc-400">
                  Scan receipt barcode or enter order ID
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Camera Laser Scanner Simulation Viewport */}
            <div className="relative aspect-video w-full rounded-2xl bg-zinc-950 border-2 border-red-600/50 overflow-hidden flex flex-col items-center justify-center shadow-inner">
              {/* Scan Laser Line */}
              <motion.div
                animate={{ y: [-100, 100, -100] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_#ef4444] z-20"
              />

              {/* Viewfinder Target */}
              <div className="w-48 h-32 border-2 border-dashed border-red-500/80 rounded-2xl flex flex-col items-center justify-center p-4 bg-red-950/20 backdrop-blur-xs relative z-10">
                <QrCode className="w-12 h-12 text-red-500 mb-2 animate-pulse" />
                <span className="text-[10px] font-black uppercase text-zinc-300">
                  {isScanning ? 'SCANNING BARCODE...' : 'ALIGN BARCODE HERE'}
                </span>
              </div>

              <button
                onClick={handleSimulateScan}
                disabled={isScanning}
                className="mt-4 px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase rounded-xl z-20 transition-all shadow-md"
              >
                {isScanning ? 'PROCESSING...' : 'TAP TO SCAN RECEIPT'}
              </button>
            </div>

            {/* Manual ID Input */}
            <form onSubmit={handleSearchOrder} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter Order Barcode ID (e.g. PP-582910)"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 uppercase font-mono"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase rounded-xl border border-zinc-700"
              >
                TRACK
              </button>
            </form>

            {/* Tracked Order Details & Live Status Progress */}
            {scannedOrder && (
              <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">
                      Tracking Order ID
                    </span>
                    <h4 className="text-xl font-black text-red-500 font-mono">
                      {scannedOrder.orderId}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase block">
                      Est. Time Remaining
                    </span>
                    <div className="flex items-center gap-1 font-black text-amber-400 text-sm">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>{scannedOrder.estimatedTimeMinutes} Mins</span>
                    </div>
                  </div>
                </div>

                {/* Progress Timeline Stepper */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase">
                    Live Kitchen Status
                  </span>
                  <div className="relative flex items-center justify-between pt-2">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-zinc-800 -translate-y-1/2 z-0" />
                    <div
                      className="absolute top-1/2 left-0 h-1 bg-red-600 -translate-y-1/2 z-0 transition-all duration-500"
                      style={{
                        width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%`,
                      }}
                    />

                    {statuses.map((st, idx) => {
                      const isDone = idx <= currentStatusIndex;
                      return (
                        <div key={st} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isDone
                                ? 'bg-red-600 text-white shadow-lg shadow-red-600/40'
                                : 'bg-zinc-800 text-zinc-500'
                            }`}
                          >
                            {idx + 1}
                          </div>
                          <span
                            className={`text-[9px] font-extrabold mt-1 uppercase ${
                              isDone ? 'text-white' : 'text-zinc-600'
                            }`}
                          >
                            {st}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Google Maps Route Preview Box */}
                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <div>
                      <h5 className="font-bold text-white text-[11px]">
                        Shergarh Branch Kitchen
                      </h5>
                      <p className="text-[10px] text-zinc-400">
                        {scannedOrder.deliveryAddress}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`tel:${STORE_INFO.phones[0]}`}
                    className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors flex items-center gap-1 font-bold text-[10px]"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Driver</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
