import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle2, Award, Star, Zap, Rocket, GraduationCap, LayoutDashboard, Lock, Shield, Target, Settings, Gamepad2 } from 'lucide-react';
import type { Badge, CompanyBrand } from '@/data/academyData';
import { BRAND_CONFIG } from '@/data/academyData';
import { Leaderboard } from './Leaderboard';
import { CelebrationOverlay } from './CelebrationOverlay';

interface DashboardViewProps {
  progressPercent: number;
  completedCount: number;
  totalModules: number;
  badges: Badge[];
  onContinue: () => void;
  brandProgress: Record<CompanyBrand, { completed: number; total: number }>;
  userName?: string;
}

const badgeIcons: Record<string, any> = {
  check: CheckCircle2, award: Award, star: Star, zap: Zap, rocket: Rocket,
  trophy: GraduationCap, shield: Shield, target: Target, settings: Settings, gamepad: Gamepad2,
};

const brandColors: Record<CompanyBrand, string> = {
  referrizer: 'bg-brand-referrizer',
  wrh: 'bg-brand-wrh',
  tc: 'bg-brand-tc',
  group: 'bg-brand-referrizer',
};

export function DashboardView({ progressPercent, completedCount, totalModules, badges, onContinue, brandProgress, userName }: DashboardViewProps) {
  const circumference = 2 * Math.PI * 58;
  const offset = circumference - (circumference * progressPercent) / 100;
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationDismissed, setCelebrationDismissed] = useState(false);

  useEffect(() => {
    if (progressPercent >= 100 && !celebrationDismissed) {
      const timer = setTimeout(() => setShowCelebration(true), 800);
      return () => clearTimeout(timer);
    }
  }, [progressPercent, celebrationDismissed]);

  return (
    <>
      <CelebrationOverlay show={showCelebration} onClose={() => { setShowCelebration(false); setCelebrationDismissed(true); }} />
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto"
    >
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-1">
          {userName ? `Welcome back, ${userName.split(' ')[0]}!` : 'Welcome to Referrizer Academy!'}
        </h1>
        <p className="text-muted-foreground text-base">
          Master all three companies in 10 days. Let's build something great.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 card-surface p-8 flex items-center gap-8">
          <div className="relative w-32 h-32 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="58" stroke="hsl(var(--border))" strokeWidth="8" fill="transparent" />
              <circle cx="64" cy="64" r="58" stroke="hsl(var(--primary))" strokeWidth="8" fill="transparent"
                strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-2xl font-black text-foreground">{progressPercent}%</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">Overall Progress</h2>
            <p className="text-muted-foreground text-sm mb-5">{completedCount} of {totalModules} modules completed.</p>
            <button onClick={onContinue} className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20 active:scale-95">
              Continue Learning
            </button>
          </div>
        </div>

        <div className="card-surface p-6">
          <h2 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Company Mastery</h2>
          <div className="space-y-4">
            {(['referrizer', 'wrh', 'tc'] as CompanyBrand[]).map(brand => {
              const bp = brandProgress[brand] || { completed: 0, total: 0 };
              const pct = bp.total > 0 ? Math.round((bp.completed / bp.total) * 100) : 0;
              return (
                <div key={brand}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${brandColors[brand]}`} />
                      <span className="text-xs font-bold text-foreground">{BRAND_CONFIG[brand].name}</span>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      className={`h-full rounded-full ${brandColors[brand]}`} transition={{ duration: 0.8 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leaderboard — directly below, no extra spacer */}
      <Leaderboard />

      {/* Trophy Case */}
      <section className="mb-10">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-5 flex items-center gap-2">
          <Trophy size={14} className="text-xp" /> Trophy Case
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {badges.map(badge => {
            const Icon = badgeIcons[badge.icon] || Star;
            return (
              <div key={badge.id} className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                badge.earned ? 'border-primary/30 bg-primary/5' : 'border-border bg-secondary/50 opacity-40'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  badge.earned ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon size={20} />
                </div>
                <span className="text-[11px] font-bold text-foreground text-center leading-tight">{badge.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Start Cards */}
      <section>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-5">The Three Companies</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {([
            { brand: 'referrizer' as CompanyBrand, icon: LayoutDashboard, desc: 'Lead generation, reputation management, loyalty programs, and marketing automation.' },
            { brand: 'wrh' as CompanyBrand, icon: Star, desc: 'SEO strategy, web development, WordPress maintenance, and website health monitoring.' },
            { brand: 'tc' as CompanyBrand, icon: Zap, desc: 'Meta & Google ads, funnel design, landing pages, and conversion optimization.' },
          ]).map((item, i) => (
            <div key={i} className="group card-surface-hover p-6 cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 ${brandColors[item.brand]} text-white rounded-xl`}><item.icon size={22} /></div>
              </div>
              <h4 className="font-bold text-foreground mb-1">{BRAND_CONFIG[item.brand].name}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              <p className="text-[10px] text-muted-foreground/60 mt-2 italic">{BRAND_CONFIG[item.brand].tagline}</p>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
    </>
  );
}
