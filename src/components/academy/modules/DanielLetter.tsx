import { motion } from 'framer-motion';
import type { UserProfile } from '@/hooks/useAuth';

const LETTER_BODY = `I'm going to be real with you — most marketing platforms fail local businesses. They solve one problem and leave the owner juggling five different tools that don't talk to each other.

That's exactly why Referrizer exists. We built everything into one system: lead capture, reputation management, loyalty programs, automated campaigns, and referral programs — all connected, all automated, all driving revenue.

But here's the real secret: it's not just about the software. When you combine Referrizer with We Rank Higher's ability to get businesses found on Google, and True Conversions' paid advertising expertise, you create something no competitor can match. An ecosystem.

Today you're going to master every feature of the Referrizer platform. By the end of this day, you'll know it better than ninety percent of the people who've been using it for years.

"Repetition is the mother of learning, the father of action, which makes it the architect of accomplishment." — Zig Ziglar. One goal of this training style is repetition. Aimed to stain the brain, and fuel your subconscious with as much value and competency as possible.

Let's get to work.`;

export function DanielLetter({ profile }: { profile?: UserProfile | null }) {
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
            <p className="text-white font-bold text-sm tracking-wide">Referrizer</p>
            <p className="text-white/30 text-[10px] uppercase tracking-widest">Office of the VP of Sales</p>
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
        <p className="text-white/40 text-sm mb-3">Let's close some deals,</p>
        <p
          className="text-white text-3xl mb-1"
          style={{ fontFamily: "'Dancing Script', 'Segoe Script', 'Comic Sans MS', cursive" }}
        >
          Daniel Lindros
        </p>
        <p className="text-white/50 text-xs font-medium tracking-wide">
          Daniel Lindros · VP of Sales, Referrizer
        </p>
      </div>
    </motion.div>
  );
}
