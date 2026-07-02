import { motion } from 'framer-motion';
import type { UserProfile } from '@/hooks/useAuth';

const LETTER_BODY = `I started Referrizer because I watched local business owners get left behind. Big brands had access to enterprise marketing tools, loyalty programs, and data-driven campaigns. The local pizza shop, the neighborhood gym, the family dentist — they had nothing. Just a hope that word of mouth would be enough.

It wasn't enough. And it isn't enough today. That's why we exist.

Referrizer was built on a simple belief: every local business deserves the same growth engine that Fortune 500 companies take for granted. Not a watered-down version. The real thing — automated, intelligent, and relentless.

But we didn't stop there. We Rank Higher ensures our clients own the top of Google so customers find them first. True Conversions turns paid traffic into real revenue. Together, these three companies form an ecosystem that no single competitor can replicate.

That ecosystem is what makes us different. We don't sell marketing services. We sell Revenue as a Service. Measurable, trackable, provable growth for every business we touch.

Our culture is built on three principles. First, we are obsessed with results — not activity, not busywork, results. If a client isn't growing, we haven't done our job. Second, we move fast. Speed is a feature. The faster we deliver value, the more trust we earn. Third, we are radically transparent — with our clients, with each other, and with ourselves. No vanity metrics. No excuses.

You are joining this company at an extraordinary moment. We are scaling across new verticals, launching AI-powered tools, and building partnerships that will reshape how local businesses grow. The opportunity in front of you is massive — but only if you commit fully.

Learn everything in this academy. Ask questions. Challenge assumptions. Push yourself harder than you think is necessary. The people who thrive here are the ones who refuse to be average.

I'm personally invested in your success. Let's build something legendary together.`;

export function AndreCultureLetter({ profile }: { profile?: UserProfile | null }) {
  const firstName = profile?.full_name?.split(' ')[0] || 'Team Member';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl overflow-hidden"
    >
      {/* Letterhead */}
      <div className="px-8 pt-10 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-referrizer/20 flex items-center justify-center">
            <span className="text-brand-referrizer font-black text-lg">R</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm tracking-wide">Referrizer Group</p>
            <p className="text-white/30 text-[10px] uppercase tracking-widest">Office of the CEO</p>
          </div>
        </div>
      </div>

      {/* Letter body */}
      <div className="px-8 py-8 space-y-6">
        <p className="text-white/80 text-[15px] leading-relaxed">
          Dear <span className="text-white font-semibold">{firstName}</span>,
        </p>

        {LETTER_BODY.split('\n\n').map((paragraph, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
            className="text-white/70 text-[15px] leading-[1.8]"
          >
            {paragraph}
          </motion.p>
        ))}
      </div>

      {/* Signature */}
      <div className="px-8 pb-10 pt-2">
        <p className="text-white/40 text-sm mb-3">With conviction,</p>
        <p
          className="text-white text-3xl mb-1"
          style={{ fontFamily: "'Dancing Script', 'Segoe Script', 'Comic Sans MS', cursive" }}
        >
          Andre Cvijovic
        </p>
        <p className="text-white/50 text-xs font-medium tracking-wide">
          Andre Cvijovic · CEO, Referrizer Group
        </p>
      </div>
    </motion.div>
  );
}
