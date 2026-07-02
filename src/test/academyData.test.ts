import { describe, it, expect } from 'vitest';
import { ACADEMY_DATA, BADGES, QUIZ_DATA, BRAND_CONFIG, VOICE_CONFIG, type Week, type Day, type Module } from '@/data/academyData';

describe('Academy Data Integrity', () => {
  const allDays = ACADEMY_DATA.flatMap(w => w.days);
  const allModules = allDays.flatMap(d => d.modules);

  it('has exactly 2 weeks', () => {
    expect(ACADEMY_DATA).toHaveLength(2);
  });

  it('has exactly 10 days', () => {
    expect(allDays).toHaveLength(10);
  });

  it('days have sequential IDs from 1 to 10', () => {
    const ids = allDays.map(d => d.id);
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('every day has at least one module', () => {
    allDays.forEach(day => {
      expect(day.modules.length).toBeGreaterThan(0);
    });
  });

  it('every module has a unique ID', () => {
    const ids = allModules.map(m => m.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('every module has required fields', () => {
    allModules.forEach(mod => {
      expect(mod.id).toBeTruthy();
      expect(mod.title).toBeTruthy();
      expect(mod.type).toBeTruthy();
      expect(mod.duration).toBeTruthy();
      expect(mod.xp).toBeGreaterThan(0);
    });
  });

  it('module types are all valid', () => {
    const validTypes = ['video', 'reading', 'audio', 'flipcards', 'quiz', 'roleplay', 'avatar', 'sandbox', 'chatbot', 'letter', 'letter-daniel', 'letter-andre', 'review', 'coach-chat', 'tower-game'];
    allModules.forEach(mod => {
      expect(validTypes).toContain(mod.type);
    });
  });

  it('every day has a valid brand', () => {
    const validBrands = ['referrizer', 'wrh', 'tc', 'group'];
    allDays.forEach(day => {
      expect(validBrands).toContain(day.brand);
    });
  });

  it('every day has a valid voice', () => {
    const validVoices = ['visionary', 'closer', 'strategist'];
    allDays.forEach(day => {
      expect(validVoices).toContain(day.voice);
    });
  });

  it('graduation days include Day 3, 4, 5, and 10', () => {
    const gradDays = allDays.filter(d => d.isGraduation);
    expect(gradDays.map(d => d.id)).toEqual([3, 4, 5, 10]);
  });

  it('Week 1 has days 1-5, Week 2 has days 6-10', () => {
    expect(ACADEMY_DATA[0].days.map(d => d.id)).toEqual([1, 2, 3, 4, 5]);
    expect(ACADEMY_DATA[1].days.map(d => d.id)).toEqual([6, 7, 8, 9, 10]);
  });
});

describe('Quiz Data', () => {
  it('every quiz module has corresponding quiz data', () => {
    const allModules = ACADEMY_DATA.flatMap(w => w.days.flatMap(d => d.modules));
    const quizModules = allModules.filter(m => m.type === 'quiz');
    quizModules.forEach(mod => {
      expect(QUIZ_DATA[mod.id]).toBeDefined();
      expect(QUIZ_DATA[mod.id].length).toBeGreaterThan(0);
    });
  });

  it('every quiz question has 4 options', () => {
    Object.values(QUIZ_DATA).forEach(questions => {
      questions.forEach(q => {
        expect(q.options).toHaveLength(4);
      });
    });
  });

  it('every quiz question has a valid correct answer index', () => {
    Object.values(QUIZ_DATA).forEach(questions => {
      questions.forEach(q => {
        expect(q.correct).toBeGreaterThanOrEqual(0);
        expect(q.correct).toBeLessThan(q.options.length);
      });
    });
  });

  it('every quiz question has an explanation', () => {
    Object.values(QUIZ_DATA).forEach(questions => {
      questions.forEach(q => {
        expect(q.explanation).toBeTruthy();
      });
    });
  });
});

describe('Badges', () => {
  it('has exactly 10 badges', () => {
    expect(BADGES).toHaveLength(10);
  });

  it('every badge has unique ID', () => {
    const ids = BADGES.map(b => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all badges start as not earned', () => {
    BADGES.forEach(b => {
      expect(b.earned).toBe(false);
    });
  });

  it('every badge has name, icon, and requirement', () => {
    BADGES.forEach(b => {
      expect(b.name).toBeTruthy();
      expect(b.icon).toBeTruthy();
      expect(b.requirement).toBeTruthy();
    });
  });
});

describe('Brand Config', () => {
  it('has all 4 brands configured', () => {
    expect(Object.keys(BRAND_CONFIG)).toEqual(['referrizer', 'wrh', 'tc', 'group']);
  });

  it('every brand has name, tagline, color, logo', () => {
    Object.values(BRAND_CONFIG).forEach(config => {
      expect(config.name).toBeTruthy();
      expect(config.tagline).toBeTruthy();
      expect(config.color).toBeTruthy();
      expect(config.logo).toBeTruthy();
    });
  });
});

describe('Voice Config', () => {
  it('has all 3 voices configured', () => {
    expect(Object.keys(VOICE_CONFIG)).toEqual(['visionary', 'closer', 'strategist']);
  });

  it('every voice has name, role, style', () => {
    Object.values(VOICE_CONFIG).forEach(config => {
      expect(config.name).toBeTruthy();
      expect(config.role).toBeTruthy();
      expect(config.style).toBeTruthy();
    });
  });
});

describe('XP Distribution', () => {
  it('total XP across all modules is calculable', () => {
    const allModules = ACADEMY_DATA.flatMap(w => w.days.flatMap(d => d.modules));
    const totalXP = allModules.reduce((sum, m) => sum + m.xp, 0);
    expect(totalXP).toBeGreaterThan(0);
  });

  it('every module XP is between 25 and 500', () => {
    const allModules = ACADEMY_DATA.flatMap(w => w.days.flatMap(d => d.modules));
    allModules.forEach(mod => {
      expect(mod.xp).toBeGreaterThanOrEqual(25);
      expect(mod.xp).toBeLessThanOrEqual(500);
    });
  });
});
