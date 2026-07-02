import { Zap, Menu, LogOut, Users, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ViewMode } from '@/hooks/useSupabaseProgress';
import type { CompanyBrand } from '@/data/academyData';

interface AcademyNavbarProps {
  view: ViewMode;
  setView: (v: ViewMode) => void;
  xp: number;
  level: number;
  onMenuClick: () => void;
  activeBrand?: CompanyBrand;
  userName?: string;
  isManager?: boolean;
  onSignOut?: () => void;
  viewingStudent?: string;
  onClearStudentView?: ()        => void;
  onReplayTour?: () => void;
}

const brandNames: Record<CompanyBrand, string> = {
  referrizer: 'Referrizer',
  wrh: 'We Rank Higher',
  tc: 'True Conversions',
  group: 'Referrizer',
};

const brandDotColor: Record<CompanyBrand, string> = {
  referrizer: 'bg-brand-referrizer',
  wrh: 'bg-brand-wrh',
  tc: 'bg-brand-tc',
  group: 'bg-brand-referrizer',
};

export function AcademyNavbar({ view, setView, xp, level, onMenuClick, activeBrand = 'group', userName, isManager, onSignOut, viewingStudent, onClearStudentView, onReplayTour }: AcademyNavbarProps) {
  const levelTitle = level <= 3 ? 'Rookie' : level <= 6 ? 'Junior' : level <= 9 ? 'Pro' : 'Legend';
  const navigate = useNavigate();
  const initials = userName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'NH';

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="p-2 rounded-lg hover:bg-secondary transition-colors lg:hidden">
          <Menu size={20} className="text-muted-foreground" />
        </button>
        <div className="flex items-center gap-1 bg-secondary rounded-full p-1">
          <button
            onClick={() => setView('dashboard')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${view === 'dashboard' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => { if (onClearStudentView) onClearStudentView(); setView('module'); }}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${view === 'module' && !viewingStudent ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Learning Path
          </button>
          {viewingStudent && (
            <button
              onClick={() => setView('module')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${view === 'module' && viewingStudent ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {viewingStudent.split(' ')[0]} Learning Path
            </button>
          )}
        </div>

        {view === 'module' && (
          <div className="hidden md:flex items-center gap-2 ml-3 px-3 py-1 bg-secondary rounded-full">
            <div className={`w-2 h-2 rounded-full ${brandDotColor[activeBrand]}`} />
            <span className="text-xs font-semibold text-muted-foreground">{brandNames[activeBrand]}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-5">
        {onReplayTour && (
          <button
            onClick={onReplayTour}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
            title="Replay the welcome tour"
            aria-label="Replay the welcome tour"
          >
            <HelpCircle size={16} />
          </button>
        )}
        {isManager && (
          <button
            onClick={() => navigate('/manager')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors bg-secondary px-3 py-1.5 rounded-lg"
          >
            <Users size={14} /> Manager
          </button>
        )}
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total XP</span>
          <div className="flex items-center gap-1.5">
            <Zap size={14} className="text-xp fill-xp" />
            <span className="font-bold tabular-nums text-foreground">{xp.toLocaleString()}</span>
          </div>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-foreground leading-none">{userName || 'New Hire'}</p>
            <p className="text-xs text-primary font-semibold">Level {level} {levelTitle}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary-hover flex items-center justify-center text-primary-foreground font-bold text-sm border-2 border-card shadow-sm">
            {initials}
          </div>
          {onSignOut && (
            <button onClick={onSignOut} className="p-2 rounded-lg hover:bg-secondary transition-colors" title="Sign Out">
              <LogOut size={16} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
