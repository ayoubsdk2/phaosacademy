import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Users, Trophy, Zap, Bell, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';
import AdminUserPanel from '@/components/admin/AdminUserPanel';

function formatTime(seconds: number): string {
  if (seconds <= 0) return '—';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

interface EmployeeRow {
  id: string;
  full_name: string;
  total_xp: number;
  level: number;
  completed_modules: number;
  coaching_earned: number;
  coaching_possible: number;
  coaching_pct: number;
  last_completed_day: number;
  last_completed_module_index: number;
  tower_best_floor: number;
  referriser_lives_used: number;
  referriser_time_seconds: number;
  total_modules: number;
  completion_pct: number;
}

export default function Manager() {
  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminTarget, setAdminTarget] = useState<{ id: string; name: string } | null>(null);
  const navigate = useNavigate();
  const { isSuperAdmin } = useAuth();

  const fetchData = async () => {
    const { data, error } = await (supabase as any).rpc('get_academy_manager_stats');
    if (error) {
      console.error('Manager stats load error:', error);
    } else {
      setEmployees((data || []) as EmployeeRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const channel = supabase
      .channel('manager-profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jae_user_profiles' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_progress' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jae_user_progress' }, () => fetchData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleNudge = async (name: string, employeeId: string) => {
    toast({ title: '📬 Nudge Sent!', description: `Encouraging email sent to ${name} to keep up their training!` });
    try {
      await supabase.functions.invoke('send-nudge-email', { body: { userId: employeeId, name } });
    } catch (err) {
      console.error('Nudge email error:', err);
    }
  };

  const levelTitle = (level: number) => level <= 3 ? 'Rookie' : level <= 6 ? 'Junior' : level <= 9 ? 'Pro' : 'Legend';

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <ArrowLeft size={20} className="text-muted-foreground" />
              </button>
              <div>
                <h1 className="text-xl font-extrabold text-foreground flex items-center gap-2">
                  <Users size={22} className="text-primary" /> Manager Dashboard
                </h1>
                <p className="text-xs text-muted-foreground">Monitor team progress across the Academy</p>
              </div>
            </div>
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold text-sm">
              {employees.length} Employee{employees.length !== 1 ? 's' : ''}
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Users, label: 'Active Learners', value: employees.length, color: 'text-primary' },
              { icon: Zap, label: 'Avg XP', value: employees.length > 0 ? Math.round(employees.reduce((a, e) => a + e.total_xp, 0) / employees.length) : 0, color: 'text-xp' },
              { icon: Trophy, label: 'Graduates', value: employees.filter(e => e.last_completed_day >= 10).length, color: 'text-success' },
            ].map((stat, i) => (
              <div key={i} className="card-surface p-5 flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-secondary ${stat.color}`}><stat.icon size={22} /></div>
                <div>
                  <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card-surface overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-bold text-foreground">Team Progress</h2>
            </div>
            {loading ? (
              <div className="p-10 text-center text-muted-foreground">Loading team data...</div>
            ) : employees.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground">No employees enrolled yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="text-left px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Employee</th>
                      <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Day</th>
                      <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">XP</th>
                      <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Level</th>
                      <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Modules</th>
                      <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Coaching</th>
                      <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">ReferRiser Results</th>
                      <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp, i) => {
                      const hasReferRiser = emp.tower_best_floor > 0;
                      const referRiserCompleted = emp.tower_best_floor >= 100;
                      return (
                        <motion.tr
                          key={emp.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-primary-hover flex items-center justify-center text-primary-foreground font-bold text-xs">
                                {emp.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'NH'}
                              </div>
                              <div>
                                <button
                                  onClick={() => navigate(`/?viewUser=${emp.id}&viewName=${encodeURIComponent(emp.full_name)}`)}
                                  className="font-semibold text-foreground text-sm hover:text-primary transition-colors text-left"
                                >
                                  {emp.full_name}
                                </button>
                                <p className="text-xs text-muted-foreground">{levelTitle(emp.level)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="text-center px-4 py-4 font-bold text-foreground">{emp.last_completed_day > 0 ? `Day ${emp.last_completed_day}` : 'Day 1'}</td>
                          <td className="text-center px-4 py-4 font-bold text-xp">{emp.total_xp.toLocaleString()}</td>
                          <td className="text-center px-4 py-4"><span className="bg-primary/10 text-primary px-2 py-1 rounded-lg text-xs font-bold">Lv.{emp.level}</span></td>
                          <td className="text-center px-4 py-4 text-sm text-foreground font-medium">{emp.completed_modules}</td>
                          <td className="text-center px-4 py-4">
                            {emp.coaching_earned > 0 ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className={`text-sm font-bold tabular-nums cursor-default ${
                                    emp.coaching_pct >= 80 ? 'text-success' : emp.coaching_pct >= 60 ? 'text-warning' : 'text-muted-foreground'
                                  }`}>{emp.coaching_pct}%</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="font-semibold tabular-nums">{emp.coaching_earned} / {emp.coaching_possible}</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="text-center px-4 py-4">
                            {hasReferRiser ? (() => {
                              if (!referRiserCompleted) {
                                return <span className="text-sm font-bold text-destructive">Failed</span>;
                              }
                              const pct = Math.max(0, 100 - emp.referriser_lives_used);
                              return (
                                <span className={`text-sm font-bold tabular-nums ${pct >= 98 ? 'text-success' : pct >= 95 ? 'text-warning' : 'text-muted-foreground'}`}>
                                  {pct}%
                                </span>
                              );
                            })() : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="text-center px-4 py-4">
                            <div className="inline-flex items-center gap-1.5">
                              <button onClick={() => handleNudge(emp.full_name, emp.id)} className="inline-flex items-center gap-1.5 bg-secondary hover:bg-secondary/80 text-foreground px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                                <Bell size={12} /> Nudge
                              </button>
                              {isSuperAdmin && (
                                <button onClick={() => setAdminTarget({ id: emp.id, name: emp.full_name })} className="inline-flex items-center gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                                  <Shield size={12} /> Admin
                                </button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
        {adminTarget && (
          <AdminUserPanel
            userId={adminTarget.id}
            fullName={adminTarget.name}
            onClose={() => setAdminTarget(null)}
            onChanged={fetchData}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
