import { useState, useRef, useEffect, useCallback } from 'react';
import { PlayCircle, Pause, Volume2, VolumeX, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { CompanyBrand } from '@/data/academyData';
import { BRAND_CONFIG } from '@/data/academyData';
import { useElevenLabsTTS } from '@/hooks/useElevenLabsTTS';
import closeSlide1 from '@/assets/close-deepdive/slide-1.webp';
import closeSlide2 from '@/assets/close-deepdive/slide-2.png';
import closeSlide3 from '@/assets/close-deepdive/slide-3.png';
import closeSlide4 from '@/assets/close-deepdive/slide-4.png';
import closeSlide5 from '@/assets/close-deepdive/slide-5.png';
import closeSlide6 from '@/assets/close-deepdive/slide-6.png';
import closeSlide7 from '@/assets/close-deepdive/slide-7.png';
import closeSlide8 from '@/assets/close-deepdive/slide-8.png';
import closeSlide9 from '@/assets/close-deepdive/slide-9.png';
import closeSlide10 from '@/assets/close-deepdive/slide-10.png';

const VIDEO_SLIDE_IMAGES: Record<string, string[]> = {
  '3-7': [closeSlide1, closeSlide2, closeSlide3, closeSlide4, closeSlide5, closeSlide6, closeSlide7, closeSlide8, closeSlide9, closeSlide10],
};

const brandOverlayColors: Record<CompanyBrand, string> = {
  referrizer: 'from-blue-900/80',
  wrh: 'from-green-900/80',
  tc: 'from-orange-900/80',
  group: 'from-slate-900/80',
};

const brandBarColors: Record<CompanyBrand, string> = {
  referrizer: 'bg-brand-referrizer',
  wrh: 'bg-brand-wrh',
  tc: 'bg-brand-tc',
  group: 'bg-primary',
};

const VIDEO_CONTENT: Record<string, string[]> = {
  '1-3': [
    "Referrizer is software that helps local businesses get more customers and keep the ones they already have. Think of it as a single tool that replaces a dozen different apps a business owner would otherwise need.",
    "Getting New Customers: Referrizer gives businesses simple tools to collect contact information from people who visit their website, walk into their store, or hear about them from a friend. Every person who shows interest becomes a contact the business can follow up with.",
    "Building a Great Reputation: When someone visits a business a few times, Referrizer automatically sends them a friendly message asking how their experience was. Happy customers are guided to leave a public review on Google, which helps other people trust the business.",
    "Keeping Customers Coming Back: Referrizer runs reward programs, similar to a coffee punch card, but digital. Customers earn points for each visit and get special offers on their birthday or if they haven't visited in a while, giving them a reason to return.",
    "Automatic Communication: Instead of manually sending emails or texts, Referrizer sends the right message to the right person at the right time, a welcome message for new customers, a reminder for those who haven't visited, or a seasonal promotion, all without the business owner lifting a finger.",
  ],
  '1-4': [
    "We Rank Higher helps local businesses show up when people search for them on Google. If you've ever searched for 'best pizza near me' and clicked one of the top results, that's exactly what We Rank Higher does for its clients.",
    "Finding the Right Words: When people search online, they type specific phrases. We Rank Higher figures out exactly what potential customers are searching for, like 'emergency plumber in Dallas', and makes sure the client's website uses those same words naturally.",
    "Making Websites Easy for Google to Understand: Google sends tiny robots to read every website. We Rank Higher organizes each page, the titles, descriptions, headings, and images, so Google's robots can clearly understand what the business offers and who it serves.",
    "Keeping Websites Fast and Secure: A slow or broken website turns visitors away and Google notices. We Rank Higher makes sure every site loads quickly on phones and computers, stays protected from hackers, and is always online when customers need it.",
    "Creating Helpful Content: We Rank Higher writes articles and pages that answer the real questions customers are asking, like 'How much does teeth whitening cost?' By providing genuinely useful answers, the business earns Google's trust and appears higher in search results.",
  ],
  '1-5': [
    "True Conversions runs paid advertising for local businesses, the sponsored posts you see on Facebook, Instagram, and Google. While Referrizer keeps existing customers and We Rank Higher earns free search traffic, True Conversions pays to put the business in front of new people right now.",
    "Online Ads That Reach the Right People: Instead of showing an ad to everyone, True Conversions targets only the people most likely to become customers, for example, women aged 25 to 45 within 10 miles of a fitness studio who have shown interest in health and wellness.",
    "Pages Built to Get a Response: When someone clicks an ad, they land on a special page designed to do one thing, get that person to take action, like booking a free trial or requesting a quote. These pages are simple, clear, and focused so visitors don't get distracted.",
    "Understanding What's Working: True Conversions tracks exactly what happens after someone sees an ad, did they click it, fill out the form, or leave? By watching real visitor behavior, the team knows which ads and pages are working and which need to be improved.",
    "Following Up Automatically: When someone fills out a form, they instantly receive a confirmation message, followed by a series of helpful emails over the next few days. This keeps the business top of mind until the person is ready to book an appointment or make a purchase.",
  ],
  '2-3': [
    "Reputation is everything for local businesses. 93% of consumers read online reviews before visiting a business. Referrizer's reputation management system automates the entire process.",
    "5-Star Review Boosting: After a customer's visit, an automated SMS/email asks for feedback and encourages happy customers to leave a 5-star review on Google. The goal is to boost positive reviews, not block or filter negative ones.",
    "Google Review Dashboard: Track your Google reviews in one place. Get instant alerts for new reviews and respond within hours to maintain engagement.",
    "Response Templates: Pre-built response templates for reviews. Personalize them quickly while maintaining brand voice consistency.",
    "Results: Clients using Referrizer's reputation system see an average increase from 3.8 to 4.6 stars within 90 days. More 5-star reviews = more trust = more customers.",
  ],
  '3-3': [
    "WordPress is the backbone of We Rank Higher web development. We build fast, secure, SEO-optimized websites that serve as the foundation for all digital marketing efforts.",
    "Development Standards: Mobile-first responsive design, structured data markup, optimized images, lazy loading, minified CSS/JS, and CDN integration. Every site scores 90+ on Google PageSpeed.",
    "Maintenance SOPs: Weekly plugin updates, daily backups, security scans, uptime monitoring, and performance audits. Clients never worry about their site going down or getting hacked.",
    "SEO Integration: Every WordPress site is built with SEO baked in, clean URL structure, XML sitemaps, robots.txt optimization, canonical tags, and schema markup for local business, FAQ, and review snippets.",
    "Quality Checklist: Before any site goes live, it passes a 47-point quality checklist covering design, functionality, SEO, speed, security, accessibility, and cross-browser compatibility.",
  ],
  '4-3': [
    "Funnels are the secret weapon of True Conversions. We don't just drive traffic, we build complete sales pathways that turn strangers into paying customers.",
    "Landing Page Framework: Hero with clear value proposition, social proof, benefits section, urgency trigger, and simple lead capture form. This structure converts at 15-25%.",
    "Lead Magnets: Free trials, consultations, ebooks, discount codes, the right lead magnet for the right audience. A gym offering 'Free 7-Day Trial' converts 3x better than 'Learn More.'",
    "Automated Follow-Up: The moment a lead submits a form, they enter a 5-touch sequence: instant confirmation, value-add email, social proof email, urgency email, and final call email.",
    "Conversion Tracking: Meta Pixel, Google Tag Manager, and server-side tracking capture every conversion event. We know exactly which ad, audience, and creative drove each sale.",
  ],
  '3-7': [
    "Welcome to this Close CRM deep dive, where I'll show you how to run your entire outbound and inbound sales motion from one place. By the end of this session, you'll know how to navigate the Close interface with confidence, build Smart Views that auto-prioritize your pipeline, make and log calls directly from Close, automate follow-up with Workflows, and pull reports that actually drive better decisions. Let's jump straight into the product.",
    "Core Navigation: When you first log into Close, you land in a clean, action-oriented interface designed to keep reps focused on doing, not clicking around. On the left-hand side, you'll see your primary navigation, Inbox and Activity to see what's happening right now, Leads and Opportunities for your core CRM records, Tasks, Smart Views, and Workflows for your daily execution, and Reporting for performance and pipeline insights. Each section is built to be searchable and filterable, so you can get from 'I need this segment' to 'I'm acting on it' in seconds.",
    "Leads, Opportunities, and Pipeline: A Lead in Close is the company or account-level record that aggregates all your contacts, emails, calls, notes, and activities in one place. When you click into a lead, the activity timeline shows every touch, emails, calls, SMS, meetings, notes, and custom activities, so your reps never have to dig through separate tools. Opportunities represent potential deals tied to those leads, and you can manage them in a Kanban-style Pipeline view, dragging deals across stages like New, Qualified, Proposal, and Closed for a real-time view without spreadsheet exports.",
    "Search and Smart Views, the Execution Engine: At the top, a powerful search bar lets you filter by anything, lead status, last communication, owner, geography, custom fields, and more. A Smart View is a saved, dynamic list that automatically updates as your data changes. Think 'New Inbound in the last 24 hours', 'Hot trials expiring this week', or 'Opportunities in Proposal stage with no call in 7 days'. These become your daily queues, so reps never have to wonder who to talk to next, Close surfaces the list automatically.",
    "Calling and Power Dialing: Close includes built-in calling, so you can dial directly from the browser or desktop app. Anywhere you see a phone number, you can click to call. For higher-volume teams, the Power Dialer automatically works through a Smart View, moving reps from one call to the next without manual dialing. Close can record the conversation and log it automatically against the lead, including duration, outcome, and notes. Managers can listen, whisper, or barge in to coach in real time.",
    "AI Notetaking and Call Transcripts: For teams that live on calls and demos, Close offers AI-powered call transcription through Call Assistant and Notetaker. Call Assistant records and summarizes calls made through Close, while Notetaker joins external meetings on Zoom, Google Meet, or Microsoft Teams, generating transcripts, summaries, and key action items. Those notes are logged directly on the lead or opportunity, so you retain the full context of every conversation without manual data entry.",
    "Workflows, Automating Follow-Up: Workflows automate your follow-up across emails, calls, and tasks so nothing slips through the cracks. Define a series of steps, for example, Day 1 send an intro email, Day 3 create a call task if no reply, Day 7 send a follow-up email, Day 10 notify the owner or move the lead to a different status. Enroll leads from a Smart View or manually, and each step can be triggered by time delays or conditions. This turns your best manual process into a repeatable system.",
    "Tasks and Daily Execution: On a day-to-day basis, reps live in their Smart Views, Tasks, and Workflows. Tasks consolidate everything you owe the market today, calls to make, emails to send, follow-ups to complete. A typical rhythm looks like this, start the day in a Smart View of high-priority leads, use the built-in dialer or email sequences to move through the list, and let Workflows and tasks ensure you never forget a follow-up.",
    "Reporting and Analytics: Close provides configurable reports for activity, pipeline, and performance. Track calls, emails, and meetings by rep or team, conversion rates between pipeline stages, and revenue forecasts and closed-won performance. Because reports tie directly into your Smart Views and filters, you can slice data by territory, lead source, or industry to understand which parts of your go-to-market are performing and where to optimize. Fast, actionable insights instead of static spreadsheets.",
    "Putting It All Together: Use Leads and Opportunities to capture every interaction in one unified timeline. Build Smart Views to generate dynamic, prioritized lists of who to contact next. Execute directly from those lists using the built-in dialer, email, and SMS. Add Workflows to automate follow-up and keep leads from slipping through the cracks. Layer on AI call notes and Notetaker for automatic transcripts. Track everything in Reporting so you can coach, iterate, and improve. Close becomes the operating system for your sales team, from first touch to closed-won revenue.",
  ],
  '10-5': [
    "Congratulations, you've completed Referrizer Academy! You are now officially a Referrizer Legend.",
    "Over the past two weeks, you've mastered the entire Referrizer ecosystem: lead generation, reputation management, loyalty programs, marketing automation, SEO, web development, paid advertising, funnel design, and conversion optimization.",
    "You've learned how Referrizer, We Rank Higher, and True Conversions work together as the Ultimate Marketing Loop, attracting, ranking, and retaining customers for local businesses.",
    "You've practiced with AI roleplays, completed sandbox simulations, passed graduation exams, and been interviewed by the CEO. You're ready to deliver real results for real clients.",
    "Welcome to the team. Go make an impact.",
  ],
};

const BRAND_FALLBACK: Record<CompanyBrand, string[]> = {
  referrizer: VIDEO_CONTENT['1-3'],
  wrh: VIDEO_CONTENT['1-4'],
  tc: VIDEO_CONTENT['1-5'],
  group: VIDEO_CONTENT['1-3'],
};

function getVoiceForModule(moduleId?: string): 'visionary' | 'closer' | 'strategist' {
  if (!moduleId) return 'strategist';
  const dayId = parseInt(moduleId.split('-')[0]);
  if ([1, 5, 10].includes(dayId)) return 'visionary';
  if ([2, 7, 9].includes(dayId)) return 'closer';
  return 'strategist';
}

export function VideoPlayer({ title, brand = 'group', description, moduleId, onFinished }: { title: string; brand?: CompanyBrand; description?: string; moduleId?: string; onFinished?: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const slides = (moduleId && VIDEO_CONTENT[moduleId]) || BRAND_FALLBACK[brand] || VIDEO_CONTENT['1-3'];
  const slideImages = (moduleId && VIDEO_SLIDE_IMAGES[moduleId]) || null;
  const currentImage = slideImages?.[currentSlide] ?? null;
  const currentText = slides[currentSlide] || '';
  const totalSlides = slides.length;

  const voiceType = getVoiceForModule(moduleId);

  // Refs to avoid stale closures in onEnd callback
  const onFinishedRef = useRef(onFinished);
  onFinishedRef.current = onFinished;
  const slideRef = useRef(currentSlide);
  slideRef.current = currentSlide;
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const slidesRef = useRef(slides);
  slidesRef.current = slides;
  const speakNextRef = useRef<(index: number) => void>(() => {});

  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAdvanceTimeout = useCallback(() => {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
  }, []);

  const tts = useElevenLabsTTS({
    voice: voiceType,
    brand,
    onEnd: () => {
      const nextSlide = slideRef.current + 1;
      if (nextSlide < slidesRef.current.length && isPlayingRef.current) {
        clearAdvanceTimeout();
        advanceTimeoutRef.current = setTimeout(() => {
          speakNextRef.current(nextSlide);
        }, 500);
      } else {
        clearAdvanceTimeout();
        setIsPlaying(false);
        onFinishedRef.current?.();
      }
    },
  });

  // Update the ref after tts is created
  speakNextRef.current = (index: number) => {
    clearAdvanceTimeout();
    tts.stop();
    setCurrentSlide(index);
    slideRef.current = index;
    if (!muted) {
      tts.speak(slidesRef.current[index]);
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      clearAdvanceTimeout();
      setIsPlaying(false);
      tts.stop();
    } else {
      clearAdvanceTimeout();
      setIsPlaying(true);
      setHasStarted(true);

      const startFrom = currentSlide === totalSlides - 1 ? 0 : currentSlide;
      setCurrentSlide(startFrom);
      slideRef.current = startFrom;

      if (!muted) {
        tts.speak(slides[startFrom]);
        // Preload all remaining slides in parallel so they're cached before playback reaches them
        const rest = slides.filter((_, i) => i !== startFrom);
        if (rest.length) tts.preload(rest);
      }
    }
  };

  const goToSlide = (index: number) => {
    if (index < 0 || index >= totalSlides) return;
    clearAdvanceTimeout();
    tts.stop();
    setCurrentSlide(index);
    slideRef.current = index;
    if (isPlaying && !muted) {
      tts.speak(slides[index]);
    }
  };

  const toggleMute = () => {
    setMuted(prev => {
      tts.setMuted(!prev);
      if (!prev) {
        clearAdvanceTimeout();
        tts.stop();
      }
      return !prev;
    });
  };

  useEffect(() => {
    return () => {
      clearAdvanceTimeout();
      tts.stop();
    };
  }, [clearAdvanceTimeout, tts.stop]);

  const overallProgress = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <div className="bg-foreground rounded-2xl overflow-hidden card-surface">
      <div className={`relative aspect-video flex items-center justify-center ${currentImage && hasStarted ? 'bg-black p-0' : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8'}`}>
        {currentImage && hasStarted && (
          <img src={currentImage} alt={`Slide ${currentSlide + 1}`} className="absolute inset-0 w-full h-full object-contain" />
        )}
        {(!currentImage || !hasStarted) && (
          <div className={`absolute inset-0 bg-gradient-to-t ${brandOverlayColors[brand]} to-transparent opacity-50`} />
        )}

        {!hasStarted ? (
          <button onClick={togglePlayback} className="relative z-10 group" disabled={tts.loading}>
            {tts.loading ? (
              <Loader2 size={80} className="text-white/80 animate-spin" />
            ) : (
              <PlayCircle size={80} className="text-white/80 group-hover:text-white group-hover:scale-110 transition-all" />
            )}
          </button>
        ) : currentImage ? null : (
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <p className="text-white text-base sm:text-lg leading-relaxed font-medium">
              {currentText}
            </p>
          </div>
        )}

        {hasStarted && (
          <>
            <div className="absolute top-4 right-4 z-10 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white/70 text-xs font-semibold">Slide {currentSlide + 1}/{totalSlides}</span>
            </div>
            <button
              onClick={() => goToSlide(currentSlide - 1)}
              disabled={currentSlide === 0}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white/60 hover:text-white flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => goToSlide(currentSlide + 1)}
              disabled={currentSlide === totalSlides - 1}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white/60 hover:text-white flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      <div className="bg-slate-900 px-5 py-3 flex items-center gap-4">
        <button onClick={togglePlayback} className="text-white/80 hover:text-white transition-colors" disabled={tts.loading}>
          {tts.loading ? <Loader2 size={20} className="animate-spin" /> : isPlaying ? <Pause size={20} /> : <PlayCircle size={20} />}
        </button>

        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer">
          <div
            className={`h-full ${brandBarColors[brand]} rounded-full transition-all duration-300`}
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        <span className="text-xs text-white/40 tabular-nums shrink-0">Slide {currentSlide + 1} of {totalSlides}</span>

        <button onClick={toggleMute} className="text-white/60 hover:text-white transition-colors">
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      <div className="bg-slate-950 px-5 py-3 flex items-center gap-2">
        <p className="text-white/50 text-sm font-medium">Video Lesson</p>
        {brand !== 'group' && (
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-semibold text-white/60">{BRAND_CONFIG[brand].name}</span>
        )}
        <span className="text-white/30 mx-1">•</span>
        <p className="text-white/80 text-sm font-bold truncate">{title}</p>
      </div>

      {tts.error && (
        <div className="bg-red-900/20 px-5 py-2">
          <p className="text-red-400 text-xs">{tts.error}</p>
        </div>
      )}
    </div>
  );
}
