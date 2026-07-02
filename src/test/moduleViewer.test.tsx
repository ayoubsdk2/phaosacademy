import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModuleViewer } from '@/components/academy/ModuleViewer';
import { ACADEMY_DATA, type Day } from '@/data/academyData';

// framer-motion is globally mocked in src/test/setup.ts (Proxy-based passthrough).

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

// Mock supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      getUser: () => Promise.resolve({ data: { user: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null }) }) }),
      insert: () => Promise.resolve({ error: null }),
      upsert: () => Promise.resolve({ error: null }),
    }),
    channel: () => ({ on: () => ({ subscribe: () => ({}) }), subscribe: () => ({}) }),
    removeChannel: () => {},
    functions: { invoke: () => Promise.resolve({ data: null, error: null }) },
  },
}));

// Mock react-markdown
vi.mock('react-markdown', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

// Mock streamChat
vi.mock('@/lib/streamChat', () => ({
  streamChat: vi.fn(),
}));

const day1: Day = JSON.parse(JSON.stringify(ACADEMY_DATA[0].days[0]));

describe('ModuleViewer', () => {
  const defaultProps = {
    day: day1,
    moduleIndex: 0,
    module: day1.modules[0],
    completedModules: new Set<string>(),
    dayProgress: 0,
    onComplete: vi.fn(),
    onNext: vi.fn(),
    onPrev: vi.fn(),
    reviewScores: {},
    onReviewScore: vi.fn(),
    userEmail: 'test@example.com',
  };

  it('renders module title', () => {
    render(<ModuleViewer {...defaultProps} />);
    const titles = screen.getAllByText(day1.modules[0].title);
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });

  it('renders day title and subtitle', () => {
    render(<ModuleViewer {...defaultProps} />);
    expect(screen.getByText(/Day 1/)).toBeInTheDocument();
  });

  it('renders module counter', () => {
    render(<ModuleViewer {...defaultProps} />);
    expect(screen.getByText(`Module 1 of ${day1.modules.length}`)).toBeInTheDocument();
  });

  it('renders daily briefing for first module', () => {
    render(<ModuleViewer {...defaultProps} />);
    expect(screen.getByText(/Welcome to Referrizer!/)).toBeInTheDocument();
  });

  it('does not render briefing for non-first module', () => {
    render(<ModuleViewer {...defaultProps} moduleIndex={1} module={day1.modules[1]} />);
    expect(screen.queryByText('📋 Daily Briefing')).not.toBeInTheDocument();
  });

  it('Previous button disabled on first module', () => {
    render(<ModuleViewer {...defaultProps} />);
    const prevBtn = screen.getByText('Previous');
    expect(prevBtn.closest('button')).toBeDisabled();
  });

  it('shows Complete & Continue for non-completed module', () => {
    render(<ModuleViewer {...defaultProps} moduleIndex={1} module={day1.modules[1]} />);
    expect(screen.getByText('Complete & Continue')).toBeInTheDocument();
  });

  it('shows Continue for completed module', () => {
    const completed = new Set([day1.modules[1].id]);
    render(<ModuleViewer {...defaultProps} moduleIndex={1} module={day1.modules[1]} completedModules={completed} />);
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it('clicking Complete & Continue calls onComplete', () => {
    const onComplete = vi.fn();
    render(<ModuleViewer {...defaultProps} moduleIndex={1} module={day1.modules[1]} onComplete={onComplete} />);
    fireEvent.click(screen.getByText('Complete & Continue'));
    expect(onComplete).toHaveBeenCalledWith(day1.modules[1].id);
  });

  it('renders description when provided', () => {
    render(<ModuleViewer {...defaultProps} />);
    if (day1.modules[0].description) {
      const descs = screen.getAllByText(day1.modules[0].description);
      expect(descs.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('does not show nav footer for quiz modules', () => {
    const quizModule = day1.modules.find(m => m.type === 'quiz')!;
    const quizIndex = day1.modules.indexOf(quizModule);
    render(<ModuleViewer {...defaultProps} moduleIndex={quizIndex} module={quizModule} />);
    expect(screen.queryByText('Complete & Continue')).not.toBeInTheDocument();
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
  });

  it('shows brand badge for non-group modules', () => {
    const refModule = day1.modules.find(m => m.brand === 'referrizer');
    if (refModule) {
      const idx = day1.modules.indexOf(refModule);
      render(<ModuleViewer {...defaultProps} moduleIndex={idx} module={refModule} />);
      const refs = screen.getAllByText('Referrizer');
      expect(refs.length).toBeGreaterThanOrEqual(1);
    }
  });
});

describe('ModuleViewer - All Module Types Render', () => {
  const allDays = ACADEMY_DATA.flatMap(w => w.days);
  const moduleTypes = ['video', 'reading', 'audio', 'flipcards', 'review'] as const;
  
  moduleTypes.forEach(type => {
    it(`renders ${type} module type without crashing`, () => {
      const day = allDays.find(d => d.modules.some(m => m.type === type));
      if (!day) return; // module type not present in current curriculum
      const mod = day.modules.find(m => m.type === type)!;
      const idx = day.modules.indexOf(mod);
      
      expect(() => {
        render(<ModuleViewer 
          day={JSON.parse(JSON.stringify(day))} 
          moduleIndex={idx} 
          module={JSON.parse(JSON.stringify(mod))} 
          completedModules={new Set()} 
          dayProgress={0}
          onComplete={vi.fn()}
          onNext={vi.fn()}
          onPrev={vi.fn()}
          reviewScores={{}}
          onReviewScore={vi.fn()}
          userEmail="test@example.com"
        />);
      }).not.toThrow();
    });
  });
});
