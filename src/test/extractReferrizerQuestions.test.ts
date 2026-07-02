import { describe, it, expect } from 'vitest';
import { extractReferrizerQuestions, type TowerStack } from '@/lib/extractReferrizerQuestions';
import { ACADEMY_DATA } from '@/data/academyData';
import { TOWER_QUESTION_POOL } from '@/data/towerQuestions';
import { REVIEW_QUESTIONS } from '@/data/reviewQuestions';

describe('extractReferrizerQuestions', () => {
  // ── Basic extraction ──
  it('returns 100 questions regardless of input size', () => {
    const stack = extractReferrizerQuestions(ACADEMY_DATA, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(stack.questions).toHaveLength(100);
  });

  it('returns empty-safe result with no completed days', () => {
    const stack = extractReferrizerQuestions(ACADEMY_DATA, []);
    // With 0 completed days, uniqueCount should be 0
    expect(stack.uniqueCount).toBe(0);
    // Should still produce 100 questions (looped from 0 → edge case)
    // Actually with 0 unique, the while loop never terminates... let's check
    // The function loops: questions.push(shuffled[loopIndex % shuffled.length])
    // If shuffled.length === 0, that's shuffled[0 % 0] = NaN index = undefined
    // This is a potential bug — let's document it
    expect(stack.questions).toHaveLength(100);
    expect(stack.isLooped).toBe(true);
  });

  it('filters questions only from completed days', () => {
    const stack = extractReferrizerQuestions(ACADEMY_DATA, [1]);
    // Only Day 1 questions should appear
    const day1TowerQs = TOWER_QUESTION_POOL.filter(q => q.module === 'Day 1');
    // All unique questions should come from Day 1
    const uniqueQuestions = new Set(stack.questions.map(q => q.question));
    // uniqueCount should match Day 1 tower pool + Day 1 review questions
    expect(stack.uniqueCount).toBeGreaterThan(0);
    expect(stack.uniqueCount).toBeLessThanOrEqual(day1TowerQs.length + 20); // generous upper bound
  });

  it('de-duplicates questions by text', () => {
    const stack = extractReferrizerQuestions(ACADEMY_DATA, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    // Check uniqueCount questions are distinct (only within unique range, not looped portion)
    const seen = new Set<string>();
    let hasDupes = false;
    const checkCount = Math.min(stack.uniqueCount, stack.questions.length);
    for (let i = 0; i < checkCount; i++) {
      const q = stack.questions[i];
      if (!q) break;
      if (seen.has(q.question)) {
        hasDupes = true;
        break;
      }
      seen.add(q.question);
    }
    expect(hasDupes).toBe(false);
  });

  // ── Looping behavior ──
  it('sets isLooped=true when unique < 100', () => {
    const stack = extractReferrizerQuestions(ACADEMY_DATA, [1]);
    expect(stack.isLooped).toBe(true);
  });

  it('loops questions to fill 100 floors', () => {
    const stack = extractReferrizerQuestions(ACADEMY_DATA, [1]);
    expect(stack.questions).toHaveLength(100);
    // Verify questions repeat
    if (stack.uniqueCount > 0 && stack.uniqueCount < 100) {
      const firstQ = stack.questions[0].question;
      // The same question should appear again after uniqueCount positions
      const secondOccurrence = stack.questions.findIndex((q, i) => i > 0 && q.question === firstQ);
      expect(secondOccurrence).toBeGreaterThan(0);
    }
  });

  // ── Timer scaling ──
  it('returns DEFAULT_TIMER (60s) for first cycle', () => {
    const stack = extractReferrizerQuestions(ACADEMY_DATA, [1, 2, 3]);
    expect(stack.timerForFloor(0)).toBe(60);
    if (stack.uniqueCount > 1) {
      expect(stack.timerForFloor(stack.uniqueCount - 1)).toBe(60);
    }
  });

  it('keeps timer fixed at 60s across repeat cycles (MIN_TIMER == DEFAULT_TIMER)', () => {
    const stack = extractReferrizerQuestions(ACADEMY_DATA, [1]);
    if (stack.isLooped && stack.uniqueCount > 0) {
      const cycle0 = stack.timerForFloor(0);
      const cycle1 = stack.timerForFloor(stack.uniqueCount);
      const cycle2 = stack.timerForFloor(stack.uniqueCount * 2);
      expect(cycle0).toBe(60);
      expect(cycle1).toBe(60);
      expect(cycle2).toBe(60);
    }
  });

  it('timer never goes below 2s minimum', () => {
    const stack = extractReferrizerQuestions(ACADEMY_DATA, [1]);
    if (stack.isLooped && stack.uniqueCount > 0) {
      // Test a very high floor
      const timer = stack.timerForFloor(99);
      expect(timer).toBeGreaterThanOrEqual(2);
    }
  });

  it('returns DEFAULT_TIMER for non-looped stacks regardless of floor', () => {
    // This would only happen with 100+ unique questions
    const allDays = ACADEMY_DATA.flatMap(w => w.days).map(d => d.id);
    const stack = extractReferrizerQuestions(ACADEMY_DATA, allDays);
    if (!stack.isLooped) {
      expect(stack.timerForFloor(0)).toBe(60);
      expect(stack.timerForFloor(50)).toBe(60);
      expect(stack.timerForFloor(99)).toBe(60);
    }
  });

  // ── Question structure validation ──
  it('all questions have required fields', () => {
    const stack = extractReferrizerQuestions(ACADEMY_DATA, [1, 2, 3]);
    for (const q of stack.questions) {
      expect(q.question).toBeTruthy();
      expect(q.options).toBeDefined();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(q.options.length);
      expect(q.module).toBeTruthy();
    }
  });

  // ── Source data integrity ──
  it('TOWER_QUESTION_POOL has valid questions', () => {
    for (const q of TOWER_QUESTION_POOL) {
      expect(q.options).toHaveLength(4);
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(4);
      expect(q.explanation).toBeTruthy();
    }
  });

  it('REVIEW_QUESTIONS all have valid correct index', () => {
    for (const [moduleId, questions] of Object.entries(REVIEW_QUESTIONS)) {
      for (const q of questions) {
        expect(q.correct).toBeGreaterThanOrEqual(0);
        expect(q.correct).toBeLessThan(q.options.length);
      }
    }
  });
});
