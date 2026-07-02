import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Mail, CheckCircle2, X } from 'lucide-react';

export default function Auth() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showUnverifiedResend, setShowUnverifiedResend] = useState(false);
  const [resending, setResending] = useState(false);

  const neverShowWelcomeAgain = () => {
    localStorage.setItem('rz_skip_welcome_modal', '1');
    setShowWelcomeModal(false);
  };

  const resendVerification = async () => {
    if (!email) {
      toast({ title: 'Enter your email first', variant: 'destructive' });
      return;
    }
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    setResending(false);
    if (error) {
      toast({ title: "Couldn't resend", description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Verification email sent', description: 'Check your inbox (and spam folder).' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowUnverifiedResend(false);

    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Check your email', description: 'We sent you a password reset link.' });
      }
      setLoading(false);
      return;
    }

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
        // Show resend button when login fails due to unverified email
        if (/confirm|verif|not.*confirmed/i.test(error.message)) {
          setShowUnverifiedResend(true);
        }
      }
    } else {
      if (!fullName.trim()) {
        toast({ title: 'Name required', description: 'Please enter your full name.', variant: 'destructive' });
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast({ title: 'Sign up failed', description: error.message, variant: 'destructive' });
      } else {
        const skip = typeof window !== 'undefined' && localStorage.getItem('rz_skip_welcome_modal') === '1';
        if (!skip) setShowWelcomeModal(true);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(215,28%,12%)] via-[hsl(217,30%,16%)] to-[hsl(220,25%,10%)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
            <span className="text-primary-foreground font-extrabold text-2xl">R</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Referrizer Academy</h1>
        </div>

        {/* Form */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          {mode !== 'forgot' && (
            <div className="flex bg-white/5 rounded-xl p-1 mb-6">
              <button
                onClick={() => { setMode('login'); setShowUnverifiedResend(false); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-primary ${mode === 'login' ? 'bg-primary text-white shadow-sm' : 'text-white/50 hover:text-white/70'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode('signup'); setShowUnverifiedResend(false); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-primary ${mode === 'signup' ? 'bg-primary text-white shadow-sm' : 'text-white/50 hover:text-white/70'}`}
              >
                Sign Up
              </button>
            </div>
          )}

          {mode === 'forgot' && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white mb-1">Reset Password</h2>
              <p className="text-white/40 text-sm">Enter your email and we'll send you a reset link.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="auth-fullname" className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Full Name</label>
                <input
                  id="auth-fullname"
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:ring-2 focus:ring-primary outline-none text-sm"
                  placeholder="Andre Cvijovic"
                />
              </div>
            )}
            <div>
              <label htmlFor="auth-email" className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Email</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:ring-2 focus:ring-primary outline-none text-sm"
                placeholder="you@referrizer.com"
              />
            </div>
            {mode !== 'forgot' && (
              <div>
                <label htmlFor="auth-password" className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Password</label>
                <input
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:ring-2 focus:ring-primary outline-none text-sm"
                  placeholder="••••••••"
                />
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/30 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              {loading ? 'Please wait...' : mode === 'forgot' ? 'Send Reset Link' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {showUnverifiedResend && mode === 'login' && (
            <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
              <p className="font-semibold mb-2">Your email isn't verified yet.</p>
              <button
                onClick={resendVerification}
                disabled={resending}
                className="text-amber-100 underline underline-offset-2 hover:text-white disabled:opacity-50"
              >
                {resending ? 'Sending…' : 'Resend verification email'}
              </button>
            </div>
          )}

          {mode === 'login' && (
            <button
              onClick={() => setMode('forgot')}
              className="w-full text-center text-white/40 hover:text-white/60 text-xs mt-4 transition-colors"
            >
              Forgot your password?
            </button>
          )}

          {mode === 'forgot' && (
            <button
              onClick={() => setMode('login')}
              className="w-full text-center text-white/40 hover:text-white/60 text-xs mt-4 transition-colors"
            >
              ← Back to Sign In
            </button>
          )}
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          © {new Date().getFullYear()} Referrizer. All rights reserved.
        </p>
      </motion.div>

      {/* Post-signup welcome modal */}
      <AnimatePresence>
        {showWelcomeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-title"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-gradient-to-br from-[hsl(217,30%,16%)] to-[hsl(220,25%,10%)] border border-white/10 rounded-2xl p-8 shadow-2xl"
            >
              <button
                onClick={() => setShowWelcomeModal(false)}
                aria-label="Close welcome dialog"
                className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                <X size={18} />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto mb-5">
                <Mail size={26} className="text-primary" />
              </div>

              <h2 id="welcome-title" className="text-xl font-extrabold text-white text-center mb-2">
                Check your inbox
              </h2>
              <p className="text-sm text-white/60 text-center mb-6 leading-relaxed">
                We sent a verification link to <span className="text-white/90 font-semibold">{email}</span>. Click it to activate your account, then sign in.
              </p>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">What's next</p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                    <span>10-day sales academy across Referrizer, We Rank Higher, and True Conversions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                    <span>Live coaching, quizzes, and the ReferRiser final exam</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                    <span>Day 1 takes about 25 minutes — start whenever you're ready</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={resendVerification}
                  disabled={resending}
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/30 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {resending ? 'Sending…' : 'Resend verification email'}
                </button>
                <button
                  onClick={() => { setShowWelcomeModal(false); setMode('login'); }}
                  className="w-full bg-white/5 hover:bg-white/10 text-white/80 py-3 rounded-xl font-semibold text-sm transition-all border border-white/10 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  I'll check my inbox
                </button>
                <button
                  onClick={neverShowWelcomeAgain}
                  className="w-full text-white/45 hover:text-white/75 py-2 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                >
                  Never see this again
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
