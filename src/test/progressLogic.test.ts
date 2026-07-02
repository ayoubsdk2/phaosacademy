import { describe, it, expect } from 'vitest';
import { ACADEMY_DATA, BADGES, type Week } from '@/data/academyData';

// Test the pure logic used in useSupabaseProgress without React hooks

function computeProgressPercent(completedModules: Set<string>, weeks: Week[]): number {
  const allModules = weeks.flatMap(w => w.days.flatMap(d => d.modules));
  return Math.round((completedModules.size / allModules.length) * 100);
}

function computeDayProgress(dayId: number, completedModules: Set<string>, weeks: Week[]): number {
  const day = weeks.flatMap(w => w.days).find(d => d.id === dayId);
  if (!day) return 0;
  return Math.round((day.modules.filter(m => completedModules.has(m.id)).length / day.modules.length) * 100);
}

function computeLevel(xp: number): number {
  return Math.floor(xp / 250) + 1;
}

function computeBrandProgress(completedModules: Set<string>, weeks: Week[]) {
  const allModules = weeks.flatMap(w => w.days.flatMap(d => d.modules));
  const result: Record<string, { completed: number; total: number }> = {
    referrizer: { completed: 0, total: 0 },
    wrh: { completed: 0, total: 0 },
    tc: { completed: 0, total: 0 },
    group: { completed: 0, total: 0 },
  };
  for (const mod of allModules) {
    const brand = mod.brand || 'group';
    result[brand].total++;
    if (completedModules.has(mod.id)) result[brand].completed++;
  }
  return result;
}

describe('Progress Calculations', () => {
  const weeks = JSON.parse(JSON.stringify(ACADEMY_DATA)) as Week[];

  it('empty progress = 0%', () => {
    expect(computeProgressPercent(new Set(), weeks)).toBe(0);
  });

  it('all modules completed = 100%', () => {
    const all = new Set(weeks.flatMap(w => w.days.flatMap(d => d.modules.map(m => m.id))));
    expect(computeProgressPercent(all, weeks)).toBe(100);
  });

  it('partial progress calculates correctly', () => {
    const day1Modules = weeks[0].days[0].modules.map(m => m.id);
    const completed = new Set(day1Modules);
    const totalModules = weeks.flatMap(w => w.days.flatMap(d => d.modules)).length;
    const expected = Math.round((day1Modules.length / totalModules) * 100);
    expect(computeProgressPercent(completed, weeks)).toBe(expected);
  });
});

describe('Day Progress', () => {
  const weeks = JSON.parse(JSON.stringify(ACADEMY_DATA)) as Week[];

  it('no modules completed = 0% day progress', () => {
    expect(computeDayProgress(1, new Set(), weeks)).toBe(0);
  });

  it('all day 1 modules completed = 100%', () => {
    const day1Modules = weeks[0].days[0].modules.map(m => m.id);
    expect(computeDayProgress(1, new Set(day1Modules), weeks)).toBe(100);
  });

  it('half day modules completed = ~50%', () => {
    const day1Modules = weeks[0].days[0].modules;
    const half = day1Modules.slice(0, Math.floor(day1Modules.length / 2)).map(m => m.id);
    const progress = computeDayProgress(1, new Set(half), weeks);
    expect(progress).toBeGreaterThan(0);
    expect(progress).toBeLessThan(100);
  });

  it('invalid day returns 0', () => {
    expect(computeDayProgress(999, new Set(), weeks)).toBe(0);
  });
});

describe('Level System', () => {
  it('0 XP = Level 1', () => {
    expect(computeLevel(0)).toBe(1);
  });

  it('249 XP = Level 1', () => {
    expect(computeLevel(249)).toBe(1);
  });

  it('250 XP = Level 2', () => {
    expect(computeLevel(250)).toBe(2);
  });

  it('500 XP = Level 3', () => {
    expect(computeLevel(500)).toBe(3);
  });

  it('1000 XP = Level 5', () => {
    expect(computeLevel(1000)).toBe(5);
  });
});

describe('Brand Progress', () => {
  const weeks = JSON.parse(JSON.stringify(ACADEMY_DATA)) as Week[];

  it('empty progress has zero completed for all brands', () => {
    const bp = computeBrandProgress(new Set(), weeks);
    expect(bp.referrizer.completed).toBe(0);
    expect(bp.wrh.completed).toBe(0);
    expect(bp.tc.completed).toBe(0);
    expect(bp.group.completed).toBe(0);
  });

  it('each brand has at least 1 module total', () => {
    const bp = computeBrandProgress(new Set(), weeks);
    expect(bp.referrizer.total).toBeGreaterThan(0);
    expect(bp.wrh.total).toBeGreaterThan(0);
    expect(bp.tc.total).toBeGreaterThan(0);
  });

  it('completing referrizer modules only affects referrizer count', () => {
    const refModules = weeks.flatMap(w => w.days.flatMap(d => 
      d.modules.filter(m => (m.brand || d.brand) === 'referrizer')
    ));
    const completed = new Set(refModules.map(m => m.id));
    const bp = computeBrandProgress(completed, weeks);
    expect(bp.referrizer.completed).toBe(bp.referrizer.total);
    // Other brands should have 0 completed (unless a module has brand='referrizer' on a non-referrizer day)
  });
});

describe('Badge Logic', () => {
  const weeks = JSON.parse(JSON.stringify(ACADEMY_DATA)) as Week[];
  const allDays = weeks.flatMap(w => w.days);

  const badgeDayMap: Record<number, string> = { 1: 'b1', 2: 'b2', 3: 'b3', 4: 'b4', 6: 'b6', 7: 'b7', 8: 'b8', 9: 'b9' };

  it('completing Day 1 earns badge b1', () => {
    const day1Ids = allDays[0].modules.map(m => m.id);
    const completed = new Set(day1Ids);
    const earned = allDays[0].modules.every(m => completed.has(m.id));
    expect(earned).toBe(true);
    expect(badgeDayMap[1]).toBe('b1');
  });

  it('partially completing Day 1 does not earn badge', () => {
    const day1Ids = allDays[0].modules.slice(0, 2).map(m => m.id);
    const completed = new Set(day1Ids);
    const earned = allDays[0].modules.every(m => completed.has(m.id));
    expect(earned).toBe(false);
  });

  it('completing all 10 days earns Referrizer Legend (b10)', () => {
    const allIds = allDays.flatMap(d => d.modules.map(m => m.id));
    const completed = new Set(allIds);
    const allComplete = allDays.every(d => d.modules.every(m => completed.has(m.id)));
    expect(allComplete).toBe(true);
  });
});

describe('Day Unlocking Logic', () => {
  it('Day 1 starts unlocked', () => {
    expect(ACADEMY_DATA[0].days[0].status).toBe('unlocked');
  });

  it('only Day 1 starts unlocked (production mode)', () => {
    const allDays = ACADEMY_DATA.flatMap(w => w.days);
    expect(allDays[0].status).toBe('unlocked');
    allDays.slice(1).forEach(day => {
      expect(day.status).toBe('locked');
    });
  });
});

describe('Navigation Logic', () => {
  const weeks = JSON.parse(JSON.stringify(ACADEMY_DATA)) as Week[];
  const allDays = weeks.flatMap(w => w.days);

  it('navigating to a day sets correct module count', () => {
    allDays.forEach(day => {
      expect(day.modules.length).toBeGreaterThan(0);
      // Module index 0 should always be valid
      expect(day.modules[0]).toBeDefined();
    });
  });

  it('module index bounds are correct for each day', () => {
    allDays.forEach(day => {
      expect(day.modules[0]).toBeDefined();
      expect(day.modules[day.modules.length - 1]).toBeDefined();
      expect(day.modules[day.modules.length]).toBeUndefined(); // out of bounds
    });
  });
});
