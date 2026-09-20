import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Volume2, VolumeX, Sparkles, Flame, Clock } from 'lucide-react';
import { BRAND_ASSETS } from '../data/menuData';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 8-second progress timer (8000ms)
  useEffect(() => {
    const totalMs = 8000;
    const intervalMs = 50;
    const increment = (intervalMs / totalMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onFinish();
          }, 300);
          return 100;
        }
        return next;
      });
    }, intervalMs);

    const countdown = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(countdown);
    };
  }, [onFinish]);

  // Realistic Canvas Smoke & Particle Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Smoke particles
    interface SmokeParticle {
      x: number;
      y: number;
      radius: number;
      opacity: number;
      vx: number;
      vy: number;
      growth: number;
      color: string;
    }

    // Floating embers
    interface SparkParticle {
      x: number;
      y: number;
      size: number;
      opacity: number;
      vx: number;
      vy: number;
      color: string;
    }

    const smokeArray: SmokeParticle[] = [];
    const sparkArray: SparkParticle[] = [];

    const createSmoke = () => {
      if (smokeArray.length < 25) {
        smokeArray.push({
          x: width / 2 + (Math.random() - 0.5) * 160,
          y: height / 2 + 100 + Math.random() * 40,
          radius: 30 + Math.random() * 25,
          opacity: 0.12 + Math.random() * 0.15,
          vx: (Math.random() - 0.5) * 0.6,
          vy: -1.2 - Math.random() * 1.5,
          growth: 0.35 + Math.random() * 0.3,
          color: Math.random() > 0.4 ? 'rgba(239, 68, 68, ' : 'rgba(255, 255, 255, ',
        });
      }
    };

    const createSpark = () => {
      if (sparkArray.length < 35) {
        sparkArray.push({
          x: width / 2 + (Math.random() - 0.5) * 280,
          y: height / 2 + 80 + Math.random() * 60,
          size: 1.5 + Math.random() * 3,
          opacity: 0.6 + Math.random() * 0.4,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -1.5 - Math.random() * 2,
          color: Math.random() > 0.5 ? '#f59e0b' : '#ef4444',
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Spawn new particles
      if (Math.random() < 0.4) createSmoke();
      if (Math.random() < 0.6) createSpark();

      // Render smoke clouds
      for (let i = smokeArray.length - 1; i >= 0; i--) {
        const p = smokeArray[i];
        p.x += p.vx;
        p.y += p.vy;
        p.radius += p.growth;
        p.opacity -= 0.0018;

        if (p.opacity <= 0 || p.y < 0) {
          smokeArray.splice(i, 1);
          continue;
        }

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, `${p.color}${p.opacity})`);
        gradient.addColorStop(0.6, `${p.color}${p.opacity * 0.4})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render glowing sparks/embers
      for (let i = sparkArray.length - 1; i >= 0; i--) {
        const s = sparkArray[i];
        s.x += s.vx + Math.sin(s.y * 0.05) * 0.5;
        s.y += s.vy;
        s.opacity -= 0.008;

        if (s.opacity <= 0 || s.y < 0) {
          sparkArray.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = s.color;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.opacity;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-slate-50 text-zinc-900 overflow-hidden select-none p-6"
      >
        {/* Luxury Background Glow & Radial Lights */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-red-50/40 to-slate-100 pointer-events-none" />

        {/* Ambient Red & Gold Spotlight Circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-amber-400/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Background Smoke & Spark Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />

        {/* Top Navigation Bar: Audio Toggle & Skip Button */}
        <div className="w-full max-w-5xl flex items-center justify-between relative z-20 pt-2">
          {/* Countdown badge */}
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-red-100 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-red-600 animate-spin-slow" />
            <span className="text-xs font-black text-zinc-800 font-mono">
              0{timeLeft}s
            </span>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              • Pizza Pro Intro
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2.5 rounded-full bg-white/90 border border-zinc-200 text-zinc-600 hover:text-red-600 hover:border-red-300 transition-colors shadow-xs"
              title="Toggle Audio Sizzle"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-red-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-zinc-400" />
              )}
            </button>

            <button
              onClick={onFinish}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-lg shadow-red-600/30 hover:scale-105 active:scale-95"
            >
              <span>SKIP INTRO</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Centerpiece Container */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center px-4">
          {/* Slow Pizza Rotation Wheel Background Graphic */}
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              className="absolute w-72 h-72 sm:w-88 sm:h-88 md:w-[420px] md:h-[420px] rounded-full border-2 border-dashed border-red-300/60 pointer-events-none flex items-center justify-center opacity-80"
            >
              {/* Pizza crust texture ring & toppings ticks */}
              <div className="w-full h-full rounded-full border-8 border-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.15)] flex items-center justify-center relative">
                {/* 8 Pizza Slices radial divider ticks */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <div
                    key={deg}
                    style={{ transform: `rotate(${deg}deg)` }}
                    className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500/30 via-transparent to-red-500/30"
                  />
                ))}
              </div>
            </motion.div>

            {/* Glowing Light Ring Halo */}
            <motion.div
              animate={{
                scale: [1, 1.06, 1],
                opacity: [0.6, 0.85, 0.6],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-60 h-60 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-red-500/20 via-amber-400/20 to-red-600/20 blur-2xl pointer-events-none"
            />

            {/* Main Centered Original Logo Image */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{
                scale: [0.95, 1.02, 0.98, 1],
                opacity: 1,
                y: [0, -8, 0],
              }}
              transition={{
                scale: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.8 },
                y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="relative z-10 p-2 sm:p-3 rounded-full bg-white shadow-[0_20px_60px_rgba(220,38,38,0.25)] border-4 border-red-600/90 ring-8 ring-red-100 flex items-center justify-center group"
            >
              <img
                src={BRAND_ASSETS.logo}
                alt="Pizza Pro Official Logo"
                referrerPolicy="no-referrer"
                className="w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 object-cover rounded-full shadow-inner transform group-hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          </div>

          {/* Bold Full-Size Text Below Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 sm:mt-8 space-y-2 max-w-xl"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black italic tracking-tight text-zinc-950 uppercase drop-shadow-xs">
              PIZZA <span className="text-red-600">PRO</span>
            </h1>

            {/* Tagline: Fresh • Hot • Delivered Fast */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 text-white px-5 sm:px-7 py-2 rounded-full shadow-md shadow-red-500/25 border border-red-400/40"
            >
              <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] font-sans">
                Fresh • Hot • Delivered Fast
              </span>
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Luxury 8-Second Progress Bar */}
        <div className="w-full max-w-md relative z-20 flex flex-col items-center gap-2.5 mb-2">
          <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-red-200 p-0.5 shadow-sm">
            <motion.div
              className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-red-500 rounded-full shadow-md shadow-red-500/50"
              style={{ width: `${Math.min(100, progress)}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          <div className="flex items-center justify-between w-full text-[11px] font-black text-zinc-500 tracking-wider uppercase">
            <span className="flex items-center gap-1.5 text-zinc-700">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span>
                {progress < 30
                  ? 'Kneading Fresh Dough...'
                  : progress < 60
                  ? 'Baking Pure Mozzarella Pizza...'
                  : progress < 90
                  ? 'Packaging Hot & Crispy...'
                  : 'Welcome to Pizza Pro Shergarh!'}
              </span>
            </span>
            <span className="font-mono font-extrabold text-red-600">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
