import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, Volume2, VolumeX, Play, Pause, Loader2 } from 'lucide-react';
import type { CompanyBrand, ExecutiveVoice } from '@/data/academyData';
import { VOICE_CONFIG, BRAND_CONFIG } from '@/data/academyData';
import { supabase } from '@/integrations/supabase/client';
import { useElevenLabsTTS } from '@/hooks/useElevenLabsTTS';

const brandGradients: Record<CompanyBrand, string> = {
  referrizer: 'from-blue-900 via-blue-800 to-slate-900',
  wrh: 'from-green-900 via-emerald-800 to-slate-900',
  tc: 'from-orange-900 via-amber-800 to-slate-900',
  group: 'from-slate-900 via-blue-900 to-slate-900',
};

const voiceRingColors: Record<ExecutiveVoice, string> = {
  visionary: 'border-voice-visionary shadow-voice-visionary/30',
  closer: 'border-voice-closer shadow-voice-closer/30',
  strategist: 'border-voice-strategist shadow-voice-strategist/30',
};

const voiceAvatarBg: Record<ExecutiveVoice, string> = {
  visionary: 'bg-gradient-to-br from-violet-500 to-blue-600',
  closer: 'bg-gradient-to-br from-blue-500 to-cyan-600',
  strategist: 'bg-gradient-to-br from-emerald-500 to-teal-600',
};

const SEEDED_SCRIPTS: Record<string, string> = {
  '1-1': `Welcome to the team. I'm Andre Cvijovic, CEO of Referrizer. I want to personally congratulate you on making it here, because we only hire the best.

You aren't just joining a software company today; you are joining an ecosystem designed to completely dominate the local business market. We don't just solve one problem—we solve the entire growth equation.

Through Referrizer, we bring them through the door and build their reputation. Through We Rank Higher, we ensure they own the top spot on Google. And through True Conversions, we turn their cold traffic into raving fans.

This next two weeks is going to be intense. You're going to learn how all three of these engines work together to create an unstoppable marketing loop.

Pay close attention, push yourself, and don't be afraid to break things in the sandbox. The future of our clients' businesses relies on what you learn in this academy.

Let's build something great together. Click continue to begin your first mission.`,
  '2-1': `Daniel Lindros here, VP of Sales. Let me tell you why Referrizer wins — and why every other marketing platform falls short.

Most marketing tools solve one problem. Email marketing. Or reviews. Or loyalty. And the business owner ends up juggling five different platforms that don't talk to each other.

Referrizer is different. We built everything into one system. Lead capture, reputation management, loyalty programs, automated campaigns, referral programs — all connected, all automated, all driving revenue.

But here's the real secret: it's not just about the software. It's about the ecosystem. When you combine Referrizer with We Rank Higher's SEO power and True Conversions' paid advertising expertise, you create something no competitor can match.

Today you're going to master every feature of the Referrizer platform. By the end of this day, you'll know it better than 90% of the people who've been using it for years.`,
  '3-1': `Today we're talking about the foundation of organic growth — Search Engine Optimization.

I know SEO can sound technical and intimidating, but at its core, it's simple: we make sure that when someone searches for a service in their area, our client shows up first.

Think about it from the consumer's perspective. When you need a plumber, what do you do? You Google "plumber near me." The business that shows up first gets the call. That's what We Rank Higher delivers.

We do this through three pillars: technical SEO (making sure Google can find and understand the site), content strategy (creating pages that match what people search for), and local SEO (dominating Google Maps and local pack results).

Today you'll learn all three pillars in depth. By the end, you'll be able to audit any website and identify exactly what needs to be fixed to climb the rankings.`,
  '4-1': `Welcome to True Conversions. This is where we turn advertising spend into measurable revenue.

The biggest mistake businesses make with paid advertising is treating it like a lottery. They throw money at Facebook or Google, hope for the best, and wonder why it didn't work.

True Conversions takes a completely different approach. Every dollar is tracked. Every campaign is measured. Every result is optimized.

Our framework is simple: attract the right audience with targeted ads, capture their information with high-converting landing pages, and nurture them into paying customers with automated follow-up sequences.

The magic is in the data. Conversion tracking shows us what's working. A/B tests prove which variations win. We don't guess — we know.

Today you'll master the entire True Conversions workflow from ad creation to conversion tracking.`,
  '6-1': `Let's talk about how Referrizer operates internally — because great products are only as good as the teams behind them.

We run three companies as one synchronized machine. That requires discipline, clear communication, and standardized processes.

Our communication stack is built on Slack for real-time messaging, Jira for project management, and our CRM for client relationships. Every team member knows exactly which channels to use, when to escalate, and how to hand off work between companies.

Today you'll learn the protocols that keep everything running smoothly. Response time expectations, escalation paths, inter-company handoff procedures — these aren't bureaucracy. They're the operating system that lets us move fast without breaking things.`,
  '7-1': `Daniel Lindros here, VP of Sales. Today, we're talking about the psychology of the close and the reality of the SMB owner.

Listen to me carefully: our clients are exhausted. They are running gyms, plumbing companies, salons. They are getting pitched by marketers twenty times a day who promise the moon and deliver nothing.

When you get them on the phone, their default answer is 'no' because 'no' keeps them safe. Your job is not to sell features; your job is to sell a new reality.

If they say 'I don't have the budget,' what they are really saying is 'I don't trust that you will make me money.'

Today, we are going to dive into the 'Referrizer Voice.' You are going to learn how to actively listen, how to lean into the friction, and how to use data from We Rank Higher and True Conversions to prove that we are an investment, not an expense.

Below this video is the AI Roleplay Simulator. I want you to jump in there and try to close our toughest AI persona. Don't back down. Show me what you've got.`,
  '8-1': `Troubleshooting is where good employees become great ones.

Anyone can follow a playbook when things go right. But when a client calls in frustrated because their campaign isn't performing, or their website is down, or their reviews aren't showing up — that's when you prove your value.

Our troubleshooting framework has three steps: Diagnose, Communicate, Resolve.

First, diagnose. Don't guess. Check the data. Look at the dashboard. Reproduce the issue. Most problems have simple explanations — a campaign that was paused, a DNS record that wasn't updated, a tracking pixel that wasn't installed.

Second, communicate. Tell the client what you found, what you're doing about it, and when they can expect it fixed. Nothing destroys trust faster than silence.

Third, resolve. Fix it, verify it's fixed, and document what happened so it doesn't happen again.

Today you'll practice this framework across all three platforms.`,
  '9-1': `Welcome to Sandbox Day. This is where theory meets practice.

Your mission today is to set up a complete client — FitZone Gym — across all three companies. Referrizer for retention and referrals. We Rank Higher for organic search. True Conversions for paid acquisition.

This isn't a test with right or wrong answers. This is a simulation. I want you to think like a consultant. What does this gym need? How do you prioritize? What launches first?

Take your time with each phase. Add notes about your decisions. When you're done, you'll present your launch plan as if you were presenting to me.

Show me what you've learned these past two weeks. Let's go.`,
};

export function AvatarPlayer({ title, voice, brand = 'group', description, moduleId, onFinished }: { title: string; voice: ExecutiveVoice; brand?: CompanyBrand; description?: string; moduleId?: string; onFinished?: () => void }) {
  const [scriptText, setScriptText] = useState<string>('');
  const [hasStarted, setHasStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const voiceInfo = VOICE_CONFIG[voice];

  const tts = useElevenLabsTTS({
    voice,
    brand,
    onEnd: () => {
      cleanupTimers();
      onFinished?.();
    },
  });

  useEffect(() => {
    if (moduleId && SEEDED_SCRIPTS[moduleId]) {
      setScriptText(SEEDED_SCRIPTS[moduleId]);
      return;
    }
    if (moduleId) {
      supabase
        .from('executive_scripts')
        .select('script_text')
        .eq('module_id', moduleId)
        .single()
        .then(({ data }) => {
          if (data) setScriptText((data as any).script_text);
          else setScriptText(`Welcome. This is ${voiceInfo.name}, ${voiceInfo.role}. Today we'll cover: ${title}. ${description || ''}`);
        });
    }
  }, [moduleId, voiceInfo.name, voiceInfo.role, title, description]);

  // ~14 chars/sec at normal speed
  const totalDuration = Math.max(Math.ceil(scriptText.length / 14), 30);

  const cleanupTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const startPlayback = useCallback((fromStart = false) => {
    if (!scriptText) return;
    if (fromStart) {
      setElapsed(0);
    }
    setHasStarted(true);
    tts.speak(scriptText.replace(/\n/g, ' '));

    timerRef.current = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
  }, [scriptText, tts]);

  const togglePlayback = () => {
    if (tts.playing) {
      tts.pause();
      cleanupTimers();
    } else {
      if (hasStarted && !tts.playing) {
        tts.resume();
        timerRef.current = setInterval(() => {
          setElapsed(prev => prev + 1);
        }, 1000);
      } else {
        startPlayback(true);
      }
    }
  };

  const toggleMute = () => {
    setMuted(prev => {
      tts.setMuted(!prev);
      return !prev;
    });
  };

  useEffect(() => {
    return () => {
      cleanupTimers();
      tts.stop();
    };
  }, [cleanupTimers, tts.stop]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const progress = totalDuration > 0 ? Math.min((elapsed / totalDuration) * 100, 100) : 0;
  const isActive = tts.playing || tts.loading;

  return (
    <div className={`bg-gradient-to-br ${brandGradients[brand]} rounded-2xl overflow-hidden`}>
      <div className="flex flex-col items-center py-10 px-6">
        <div className="relative mb-6">
          <motion.div
            animate={isActive ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`w-28 h-28 rounded-full ${voiceAvatarBg[voice]} flex items-center justify-center border-4 ${voiceRingColors[voice]} shadow-xl`}
          >
            <User size={48} className="text-white/90" />
          </motion.div>
          {isActive && (
            <motion.div
              className={`absolute inset-0 rounded-full border-2 ${voiceRingColors[voice]}`}
              animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          )}
        </div>

        <h3 className="text-white font-bold text-xl mb-0.5">{voiceInfo.name}</h3>
        <p className="text-white/50 text-sm font-medium mb-1">{voiceInfo.role}</p>
        <p className="text-white/30 text-xs italic mb-6 text-center max-w-md">"{voiceInfo.style}"</p>

        <h2 className="text-white text-lg font-bold text-center mb-2">{title}</h2>
        {description && (
          <p className="text-white/50 text-sm text-center max-w-lg mb-6">{description}</p>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={togglePlayback}
            disabled={!scriptText || tts.loading}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-bold text-sm transition-all border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {tts.loading ? (
              <><Loader2 size={16} className="animate-spin" /> Generating Audio...</>
            ) : tts.playing ? (
              <><Pause size={16} /> Pause</>
            ) : (
              <><Play size={16} /> {hasStarted ? 'Resume' : 'Play Presentation'}</>
            )}
          </button>
          <button
            onClick={toggleMute}
            className="flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/10 text-white/60 rounded-full transition-all border border-white/10"
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>

        {tts.error && (
          <p className="text-red-400/80 text-xs mt-3">{tts.error}</p>
        )}

        <div className="w-full max-w-md mt-6 flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/40 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-white/30 tabular-nums">{formatTime(elapsed)} / ~{formatTime(totalDuration)}</span>
        </div>
      </div>

      <div className="bg-black/20 p-6 border-t border-white/5">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
            Executive Script
          </p>
          {isActive && <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />}
        </div>
        <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto scrollbar-thin">
          {scriptText
            ? `"${scriptText}"`
            : 'Loading script...'
          }
        </p>
        {!isActive && !hasStarted && scriptText && (
          <p className="text-white/20 text-xs mt-3 italic">Press Play to hear the presentation with professional AI voice</p>
        )}
      </div>
    </div>
  );
}
