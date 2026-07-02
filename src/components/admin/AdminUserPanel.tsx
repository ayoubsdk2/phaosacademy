import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, RotateCcw, Save, Edit3, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ACADEMY_DATA } from '@/data/academyData';

interface Props {
  userId: string;
  fullName: string;
  onClose: () => void;
  onChanged: () => void;
}

interface ProgressRow {
  module_id: string;
  day_id: number;
  score: number | null;
  status: string;
}

const ALL_MODULES = ACADEMY_DATA.flatMap(w => w.days.flatMap(d => d.modules.map(m => ({ ...m, day_id: d.id, dayTitle: d.title }))));
const SCORABLE_TYPES = new Set(['quiz', 'coach-chat', 'review']);

export default function AdminUserPanel({ userId, fullName, onClose, onChanged }: Props) {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<Record<string, ProgressRow>>({});
  const [profile, setProfile] = useState<{ total_xp: number; level: number } | null>(null);
  const [editXp, setEditXp] = useState<string>('');
  const [editLevel, setEditLevel] = useState<string>('');
  const [editing, setEditing] = useState<string | null>(null);
  const [editCorrect, setEditCorrect] = useState('');
  const [editTotal, setEditTotal] = useState('');

  const load = async () => {
    setLoading(true);
    const { data: jae } = await supabase.from('jae_cohort_members').select('user_id').eq('user_id', userId).maybeSingle();
    const isJae = !!jae;
    const [progRes, mainProf, jaeProf] = await Promise.all([
      supabase.from(isJae ? 'jae_user_progress' : 'user_progress').select('module_id, day_id, score, status').eq('user_id', userId),
      supabase.from('profiles').select('total_xp, level').eq('id', userId).maybeSingle(),
      supabase.from('jae_user_profiles').select('total_xp, level').eq('user_id', userId).maybeSingle(),
    ]);
    const map: Record<string, ProgressRow> = {};
    (progRes.data || []).forEach((r: any) => { map[r.module_id] = r; });
    setProgress(map);
    const p = isJae ? (jaeProf.data || mainProf.data) : mainProf.data;
    setProfile(p as any);
    setEditXp(String(p?.total_xp ?? 0));
    setEditLevel(String(p?.level ?? 1));
    setLoading(false);
  };

  useEffect(() => { load(); }, [userId]);

  const callAction = async (action: string, payload?: any) => {
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-actions', {
        body: { action, targetUserId: userId, payload },
      });
      if (error || (data as any)?.error) throw new Error((data as any)?.error || error?.message);
      return data;
    } catch (e: any) {
      toast({ title: 'Action failed', description: e.message, variant: 'destructive' });
      throw e;
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`PERMANENTLY DELETE ${fullName}'s account and ALL data? This cannot be undone.`)) return;
    if (!confirm(`Final confirmation: type-equivalent — really delete ${fullName}?`)) return;
    try {
      await callAction('delete_user');
      toast({ title: 'User deleted', description: `${fullName} removed.` });
      onChanged();
      onClose();
    } catch {}
  };

  const handleReset = async () => {
    if (!confirm(`Reset ALL progress for ${fullName}? Their account stays, but XP, scores, badges, and completion are wiped.`)) return;
    try {
      await callAction('reset_progress');
      toast({ title: 'Progress reset', description: `${fullName} starts fresh.` });
      await load();
      onChanged();
    } catch {}
  };

  const saveXp = async () => {
    const xp = parseInt(editXp, 10);
    const lvl = parseInt(editLevel, 10);
    if (isNaN(xp) || xp < 0) return toast({ title: 'Invalid XP', variant: 'destructive' });
    try {
      await callAction('set_xp', { totalXp: xp, level: isNaN(lvl) ? undefined : lvl });
      toast({ title: 'XP/Level updated' });
      await load();
      onChanged();
    } catch {}
  };

  const saveScore = async (moduleId: string, dayId: number) => {
    const c = parseInt(editCorrect, 10);
    const t = parseInt(editTotal, 10);
    if (isNaN(c) || isNaN(t) || t <= 0 || c < 0 || c > t) {
      return toast({ title: 'Invalid score', description: 'Use 0 ≤ correct ≤ total, total > 0', variant: 'destructive' });
    }
    try {
      await callAction('set_score', { moduleId, dayId, correct: c, total: t });
      toast({ title: 'Score saved', description: `${c}/${t}` });
      setEditing(null);
      await load();
      onChanged();
    } catch {}
  };

  const clearScore = async (moduleId: string) => {
    if (!confirm('Remove this score / module completion?')) return;
    try {
      await callAction('delete_module_score', { moduleId });
      toast({ title: 'Score cleared' });
      await load();
      onChanged();
    } catch {}
  };

  const scorableModules = useMemo(() => ALL_MODULES.filter(m => SCORABLE_TYPES.has(m.type)), []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card rounded-2xl border border-border w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                <Award size={18} className="text-primary" /> Super-Admin: {fullName}
              </h2>
              <p className="text-xs text-muted-foreground">Edit grades, XP, reset progress, or delete account.</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary"><X size={18} /></button>
          </div>

          <div className="overflow-y-auto p-6 space-y-6">
            {loading ? (
              <div className="text-center text-muted-foreground py-10">Loading...</div>
            ) : (
              <>
                {/* XP / Level / Account actions */}
                <section className="space-y-3">
                  <h3 className="font-bold text-foreground text-sm">Profile</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
                    <label className="text-xs text-muted-foreground col-span-1">
                      <span className="block mb-1 font-semibold">Total XP</span>
                      <input className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm" value={editXp} onChange={e => setEditXp(e.target.value)} />
                    </label>
                    <label className="text-xs text-muted-foreground col-span-1">
                      <span className="block mb-1 font-semibold">Level</span>
                      <input className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm" value={editLevel} onChange={e => setEditLevel(e.target.value)} />
                    </label>
                    <button disabled={busy} onClick={saveXp} className="col-span-2 sm:col-span-2 inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary-hover px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
                      <Save size={14} /> Save XP / Level
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button disabled={busy} onClick={handleReset} className="inline-flex items-center gap-1.5 bg-warning/10 text-warning hover:bg-warning/20 px-3 py-2 rounded-lg text-xs font-semibold disabled:opacity-50">
                      <RotateCcw size={12} /> Reset All Progress
                    </button>
                    <button disabled={busy} onClick={handleDelete} className="inline-flex items-center gap-1.5 bg-destructive/10 text-destructive hover:bg-destructive/20 px-3 py-2 rounded-lg text-xs font-semibold disabled:opacity-50">
                      <Trash2 size={12} /> Delete User
                    </button>
                  </div>
                </section>

                {/* Module scores */}
                <section className="space-y-2">
                  <h3 className="font-bold text-foreground text-sm">Module Scores (coaching, quizzes, exams)</h3>
                  <div className="border border-border rounded-xl divide-y divide-border">
                    {scorableModules.map(m => {
                      const row = progress[m.id];
                      const correct = row?.score ? Math.floor(row.score / 1000) : null;
                      const total = row?.score ? row.score % 1000 : null;
                      const isEditing = editing === m.id;
                      return (
                        <div key={m.id} className="px-3 py-2 flex items-center gap-3 text-sm">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground truncate">{m.title}</p>
                            <p className="text-xs text-muted-foreground">Day {m.day_id} · {m.type}</p>
                          </div>
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <input type="number" placeholder="correct" value={editCorrect} onChange={e => setEditCorrect(e.target.value)} className="w-16 px-2 py-1 rounded bg-secondary border border-border text-xs" />
                              <span className="text-muted-foreground">/</span>
                              <input type="number" placeholder="total" value={editTotal} onChange={e => setEditTotal(e.target.value)} className="w-16 px-2 py-1 rounded bg-secondary border border-border text-xs" />
                              <button disabled={busy} onClick={() => saveScore(m.id, m.day_id)} className="p-1.5 bg-primary text-primary-foreground rounded disabled:opacity-50"><Save size={12} /></button>
                              <button onClick={() => setEditing(null)} className="p-1.5 hover:bg-secondary rounded"><X size={12} /></button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold tabular-nums text-foreground min-w-[60px] text-right">
                                {row?.status === 'completed' && correct != null ? `${correct}/${total}` : row ? row.status : '—'}
                              </span>
                              <button onClick={() => { setEditing(m.id); setEditCorrect(String(correct ?? '')); setEditTotal(String(total ?? '10')); }} className="p-1.5 hover:bg-secondary rounded text-muted-foreground"><Edit3 size={12} /></button>
                              {row && (
                                <button onClick={() => clearScore(m.id)} className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded text-muted-foreground"><Trash2 size={12} /></button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
