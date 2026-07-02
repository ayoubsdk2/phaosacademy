import { motion } from 'framer-motion';
import type { UserProfile } from '@/hooks/useAuth';

const LETTER_BODY = `I want to personally congratulate you on making it here, because we only hire the best.

You aren't just joining a software company today — you are joining an ecosystem designed to completely dominate the local business market. We don't just solve one problem; we solve the entire growth equation.

Through Referrizer, we bring customers through the door and build our clients' reputations. Through We Rank Higher, we ensure they own the top spot on Google. And through True Conversions, we turn their cold traffic into raving fans.

These next two weeks are going to be intense. You're going to learn how all three of these engines work together to create an unstoppable marketing loop.

Pay close attention, push yourself, and don't be afraid to break things in the sandbox. The future of our clients' businesses relies on what you learn in this academy.

Let's build something great together.`;

export function WelcomeLetter({ profile }: { profile?: UserProfile | null }) {
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
        <p className="text-white/40 text-sm mb-3">Warmly,</p>
        <p
          className="text-white text-3xl mb-1"
          style={{ fontFamily: "'Dancing Script', 'Segoe Script', 'Comic Sans MS', cursive" }}
        >
          Andre Cvijovic
        </p>
        <p className="text-white/50 text-xs font-medium tracking-wide">
          Andre Cvijovic · CEO, Referrizer
        </p>
      </div>
    </motion.div>
  );
}
