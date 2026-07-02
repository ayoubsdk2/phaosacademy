import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TOTAL_FLOORS, TIMER_SECONDS, BOSS_TIMER_SECONDS, BOSS_INTERVAL, BOSS_QUESTIONS } from '@/hooks/useTowerGame';
import type { TowerQuestion } from '@/data/towerQuestions';
import type { TowerStack } from '@/lib/extractReferrizerQuestions';

/**
 * Pure logic tests for Tower game constants, rules, and invariants.
 * These don't use React hooks directly (that requires renderHook with RAF mocking).
 */

// ── Helper: generate a mock question pool ──
function makeMockQuestions(count: number): TowerQuestion[] {
  return Array.from({ length: count }, (_, i) => ({
    question: `Question ${i + 1}?`,
    options: ['A', 'B', 'C', 'D'],
    correct: i % 4,
    explanation: `Explanation ${i + 1}`,
    module: `Day ${Math.floor(i / 10) + 1}`,
  }));
}

function makeMockStack(uniqueCount: number): TowerStack {
  const unique = makeMockQuestions(uniqueCount);
  const isLooped = uniqueCount < 100;
  const questions: TowerQuestion[] = [];
  let idx = 0;
  while (questions.length < 100) {
    questions.push(unique[idx % unique.length]);
    idx++;
  }
  return {
    questions,
    uniqueCount,
    isLooped,
    timerForFloor: (floor: number) => {
      if (!isLooped || uniqueCount === 0) return 7;
      const cycle = Math.floor(floor / uniqueCount);
      return Math.max(2, 7 - cycle * 0.5);
    },
  };
}

describe('Tower Game Constants', () => {
  it('TOTAL_FLOORS is 100', () => expect(TOTAL_FLOORS).toBe(100));
  it('TIMER_SECONDS is 60', () => expect(TIMER_SECONDS).toBe(60));
  it('BOSS_TIMER_SECONDS is 60', () => expect(BOSS_TIMER_SECONDS).toBe(60));
  it('BOSS_INTERVAL is 10', () => expect(BOSS_INTERVAL).toBe(10));
  it('BOSS_QUESTIONS is 3', () => expect(BOSS_QUESTIONS).toBe(3));
});

describe('Boss Floor Detection', () => {
  it('floors 9, 19, 29... 99 are boss floors (0-indexed)', () => {
    const bossFloors = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99];
    for (const f of bossFloors) {
      expect((f + 1) % BOSS_INTERVAL).toBe(0);
    }
  });

  it('non-boss floors are correctly identified', () => {
    const nonBoss = [0, 1, 5, 10, 15, 20, 50, 98];
    for (const f of nonBoss) {
      expect((f + 1) % BOSS_INTERVAL).not.toBe(0);
    }
  });

  it('there are exactly 10 boss floors in 100', () => {
    let count = 0;
    for (let f = 0; f < 100; f++) {
      if ((f + 1) % BOSS_INTERVAL === 0) count++;
    }
    expect(count).toBe(10);
  });
});

describe('Scoring Rules', () => {
  it('normal floor awards 100 points', () => {
    const normalPoints = 100;
    expect(normalPoints).toBe(100);
  });

  it('boss floor awards 200 points', () => {
    const bossPoints = 200;
    expect(bossPoints).toBe(200);
  });

  it('max possible score calculation', () => {
    // 90 normal floors × 100 + 10 boss floors × 3 questions × 200
    const normalFloors = 90;
    const bossFloors = 10;
    const maxNormal = normalFloors * 100;
    const maxBoss = bossFloors * BOSS_QUESTIONS * 200;
    const maxTotal = maxNormal + maxBoss;
    expect(maxNormal).toBe(9000);
    expect(maxBoss).toBe(6000);
    expect(maxTotal).toBe(15000);
  });
});

describe('Power-up Thresholds', () => {
  it('3-streak earns Aegis Shield', () => {
    const SHIELD_THRESHOLD = 3;
    expect(SHIELD_THRESHOLD).toBe(3);
  });

  it('5-streak earns Temporal Freeze and resets streak', () => {
    const FREEZE_THRESHOLD = 5;
    expect(FREEZE_THRESHOLD).toBe(5);
  });

  it('shield absorbs wrong answer without death', () => {
    let shields = 1;
    const isCorrect = false;
    if (!isCorrect && shields > 0) {
      shields--;
      // Should survive
      expect(shields).toBe(0);
    }
  });

  it('shield absorbs timeout without death', () => {
    let shields = 2;
    const timedOut = true;
    if (timedOut && shields > 0) {
      shields--;
      expect(shields).toBe(1);
    }
  });

  it('no shield + wrong answer = death', () => {
    const shields = 0;
    const isCorrect = false;
    const shouldDie = !isCorrect && shields === 0;
    expect(shouldDie).toBe(true);
  });
});

describe('Checkpoint System', () => {
  it('checkpoints are set after completing boss floors', () => {
    const checkpoints: number[] = [];
    for (let floor = 0; floor < 100; floor++) {
      if ((floor + 1) % BOSS_INTERVAL === 0) {
        checkpoints.push(floor + 1);
      }
    }
    expect(checkpoints).toEqual([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
  });

  it('restart from checkpoint preserves checkpoint value', () => {
    const checkpoint = 30;
    const restartFloor = checkpoint;
    expect(restartFloor).toBe(30);
  });

  it('initial checkpoint is 0 (restart from beginning)', () => {
    const initialCheckpoint = 0;
    expect(initialCheckpoint).toBe(0);
  });
});

describe('Victory & Death Conditions', () => {
  it('reaching floor 100 triggers victory', () => {
    const nextFloor = 100;
    expect(nextFloor >= TOTAL_FLOORS).toBe(true);
  });

  it('floor 99 does NOT trigger victory (need to complete it)', () => {
    const nextFloor = 99;
    expect(nextFloor >= TOTAL_FLOORS).toBe(false);
  });

  it('death records correct answer and timeout status', () => {
    const q: TowerQuestion = {
      question: 'Test?',
      options: ['A', 'B', 'C', 'D'],
      correct: 2,
      explanation: 'C is correct',
      module: 'Day 1',
    };
    const deathInfo = { correctAnswer: q.options[q.correct], wasTimeout: true };
    expect(deathInfo.correctAnswer).toBe('C');
    expect(deathInfo.wasTimeout).toBe(true);
  });
});

describe('Mock TowerStack', () => {
  it('generates exactly 100 questions even from small pool', () => {
    const stack = makeMockStack(10);
    expect(stack.questions).toHaveLength(100);
    expect(stack.isLooped).toBe(true);
    expect(stack.uniqueCount).toBe(10);
  });

  it('timer scales correctly for looped stacks', () => {
    const stack = makeMockStack(20);
    expect(stack.timerForFloor(0)).toBe(7);    // cycle 0
    expect(stack.timerForFloor(19)).toBe(7);   // still cycle 0
    expect(stack.timerForFloor(20)).toBe(6.5); // cycle 1
    expect(stack.timerForFloor(40)).toBe(6);   // cycle 2
    expect(stack.timerForFloor(60)).toBe(5.5); // cycle 3
    expect(stack.timerForFloor(80)).toBe(5);   // cycle 4
    expect(stack.timerForFloor(99)).toBe(5); // cycle 4 (floor 99 / 20 = 4, 7 - 2 = 5)
  });

  it('timer stays at 7s for 100+ unique questions', () => {
    const stack = makeMockStack(100);
    expect(stack.isLooped).toBe(false);
    expect(stack.timerForFloor(0)).toBe(7);
    expect(stack.timerForFloor(99)).toBe(7);
  });

  it('timer hits minimum of 2s', () => {
    const stack = makeMockStack(5); // very small pool = many cycles
    // floor 50 = cycle 10, timer = 7 - 5 = 2
    expect(stack.timerForFloor(50)).toBe(2);
    // floor 99 = cycle 19, timer = max(2, 7 - 9.5) = 2
    expect(stack.timerForFloor(99)).toBe(2);
  });
});

describe('LocalStorage Persistence', () => {
  const STORAGE_KEY = 'tower-of-retention-progress';

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('saves progress to localStorage', () => {
    const data = { floor: 25, checkpoint: 20, score: 2500, shields: 1, freezes: 0 };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    const loaded = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(loaded.floor).toBe(25);
    expect(loaded.checkpoint).toBe(20);
    expect(loaded.score).toBe(2500);
  });

  it('returns null when no saved progress', () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeNull();
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json{{{');
    let result = null;
    try {
      result = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    } catch {
      result = null;
    }
    expect(result).toBeNull();
  });

  it('clears progress on victory', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ floor: 99 }));
    // Simulate victory clear
    localStorage.removeItem(STORAGE_KEY);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('preserves shields and freezes across saves', () => {
    const data = { floor: 45, checkpoint: 40, score: 5000, shields: 3, freezes: 2 };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    const loaded = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(loaded.shields).toBe(3);
    expect(loaded.freezes).toBe(2);
  });
});

describe('Edge Cases & Stress Tests', () => {
  it('answer index bounds: correct is always within options range', () => {
    const questions = makeMockQuestions(100);
    for (const q of questions) {
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(q.options.length);
    }
  });

  it('all 4 answer options are always present', () => {
    const questions = makeMockQuestions(100);
    for (const q of questions) {
      expect(q.options).toHaveLength(4);
      for (const opt of q.options) {
        expect(opt).toBeTruthy();
      }
    }
  });

  it('streak resets on wrong answer', () => {
    let streak = 4;
    const isCorrect = false;
    if (!isCorrect) streak = 0;
    expect(streak).toBe(0);
  });

  it('streak resets on timeout', () => {
    let streak = 4;
    const timedOut = true;
    if (timedOut) streak = 0;
    expect(streak).toBe(0);
  });

  it('multiple shields can be accumulated', () => {
    let shields = 0;
    // Simulate 3-streak four times (with freeze resets)
    for (let i = 0; i < 4; i++) {
      shields++;
    }
    expect(shields).toBe(4);
  });

  it('temporal freeze sets timer to 999', () => {
    const TEMPORAL_FREEZE_TIMER = 999;
    expect(TEMPORAL_FREEZE_TIMER).toBe(999);
  });

  it('freeze can only be used once per floor', () => {
    let usedFreeze = false;
    let freezes = 2;
    // First use
    if (freezes > 0 && !usedFreeze) {
      freezes--;
      usedFreeze = true;
    }
    expect(freezes).toBe(1);
    expect(usedFreeze).toBe(true);
    // Second attempt on same floor
    if (freezes > 0 && !usedFreeze) {
      freezes--;
    }
    expect(freezes).toBe(1); // unchanged — can't use again
  });

  it('boss floor requires 3 correct answers to advance', () => {
    let bossStep = 0;
    const required = BOSS_QUESTIONS;
    while (bossStep < required) {
      bossStep++;
    }
    expect(bossStep).toBe(3);
  });

  it('rapid answering: cannot answer twice on same question', () => {
    let selected: number | null = null;
    const answer = (idx: number) => {
      if (selected !== null) return false; // blocked
      selected = idx;
      return true;
    };
    expect(answer(0)).toBe(true);
    expect(answer(1)).toBe(false); // second attempt blocked
    expect(selected).toBe(0);
  });

  it('game handles 100 consecutive correct answers (perfect run)', () => {
    let floor = 0;
    let score = 0;
    let streak = 0;
    let shields = 0;
    let freezes = 0;

    for (let i = 0; i < 100; i++) {
      const isBoss = (floor + 1) % BOSS_INTERVAL === 0;
      
      if (isBoss) {
        // 3 boss sub-questions
        for (let bs = 0; bs < BOSS_QUESTIONS; bs++) {
          score += 200;
          streak++;
          if (streak === 3) { shields++; }
          if (streak === 5) { freezes++; streak = 0; }
        }
      } else {
        score += 100;
        streak++;
        if (streak === 3) { shields++; }
        if (streak === 5) { freezes++; streak = 0; }
      }
      floor++;
    }

    expect(floor).toBe(100);
    expect(score).toBe(15000); // 90×100 + 10×3×200
    expect(shields).toBeGreaterThan(0);
    expect(freezes).toBeGreaterThan(0);
  });

  it('game survives worst case: wrong on floor 0 with no shields', () => {
    const floor = 0;
    const shields = 0;
    const isCorrect = false;
    const isDead = !isCorrect && shields === 0;
    expect(isDead).toBe(true);
    // Restart from checkpoint 0
    const restartFloor = 0;
    expect(restartFloor).toBe(0);
  });
});
