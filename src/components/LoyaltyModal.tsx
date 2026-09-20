import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Award, Gift, CheckCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface LoyaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
}

export const LoyaltyModal: React.FC<LoyaltyModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenAuth,
}) => {
  if (!isOpen) return null;

  const tiers = [
    { points: 200, reward: 'FREE Cheesy Mayo Fries or Garlic Bread', unlocked: (currentUser?.loyaltyPoints || 0) >= 200 },
    { points: 500, reward: 'FREE Small Regular Flavour Pizza', unlocked: (currentUser?.loyaltyPoints || 0) >= 500 },
    { points: 800, reward: 'FREE Zinger Burger + Cold Drink', unlocked: (currentUser?.loyaltyPoints || 0) >= 800 },
    { points: 1200, reward: 'FREE Large Pizza + 10 Hot Wings Feast!', unlocked: (currentUser?.loyaltyPoints || 0) >= 1200 },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto text-white shadow-2xl relative"
        >
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-red-900 to-zinc-950 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-400 text-zinc-950 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base italic text-white">
                  Pizza Pro Loyalty Rewards
                </h3>
                <p className="text-xs text-amber-300">
                  Earn points on every single order!
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* User Points Card */}
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase block">
                  Your Current Balance
                </span>
                <span className="text-2xl font-black text-amber-400">
                  {currentUser ? `${currentUser.loyaltyPoints} Points` : '0 Points'}
                </span>
              </div>

              {!currentUser ? (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase rounded-xl"
                >
                  LOGIN TO EARN
                </button>
              ) : (
                <div className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800">
                  ✓ Active Member
                </div>
              )}
            </div>

            {/* Rules */}
            <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl text-xs text-zinc-300 space-y-1">
              <p className="font-bold text-amber-300">How to earn points?</p>
              <p>For every <strong className="text-white">Rs 100</strong> spent at Pizza Pro Shergarh, you earn <strong className="text-amber-400">10 Rewards Points</strong> automatically!</p>
            </div>

            {/* Tiers List */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-zinc-400">
                Reward Tiers
              </h4>
              {tiers.map((tier) => (
                <div
                  key={tier.points}
                  className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                    tier.unlocked
                      ? 'bg-amber-950/30 border-amber-500/50 text-white'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Gift className={`w-4 h-4 ${tier.unlocked ? 'text-amber-400' : 'text-zinc-600'}`} />
                    <div>
                      <h5 className="font-extrabold text-white">{tier.reward}</h5>
                      <span className="text-[10px] text-zinc-500 font-mono">{tier.points} Points Needed</span>
                    </div>
                  </div>

                  {tier.unlocked ? (
                    <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-700">
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-zinc-600">LOCKED</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
