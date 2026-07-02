/**
 * extractReferrizerQuestions()
 *
 * Crawls through the full Referrizer Academy curriculum and collects every
 * question the user has encountered across their completed training days.
 *
 * Sources:
 *   1. TOWER_QUESTION_POOL (main quiz bank, keyed by "Day N")
 *   2. REVIEW_QUESTIONS (inline review checks, keyed by module ID like "3-1-review")
 *
 * De-duplicates by question text, shuffles into a 100-floor Tower Stack.
 * If unique questions < 100, loops them with a faster Doom Clock on repeats.
 */

import type { Week, Day } from '@/data/academyData';
import { TOWER_QUESTION_POOL, type TowerQuestion } from '@/data/towerQuestions';
import { REVIEW_QUESTIONS } from '@/data/reviewQuestions';

export interface TowerStack {
  /** The 100 questions for the tower (may include loops) */
  questions: TowerQuestion[];
  /** Number of unique questions found */
  uniqueCount: number;
  /** Whether questions had to be looped to reach 100 */
  isLooped: boolean;
  /** Per-floor timer override: looped questions get a shorter clock */
  timerForFloor: (floor: number) => number;
}

const DEFAULT_TIMER = 60;
const MIN_TIMER = 60; // fixed 60s per question, no shrinking on repeat cycles

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Main extraction function.
 *
 * @param academyData - The full Week[] curriculum structure
 * @param completedDayIds - Array of day IDs the user has completed (e.g. [1,2,3,4,5])
 */
export function extractReferrizerQuestions(
  academyData: Week[],
  completedDayIds: number[],
): TowerStack {
  const seen = new Set<string>();
  const unique: TowerQuestion[] = [];

  const completedSet = new Set(completedDayIds);

  // Collect all completed day objects and their module IDs
  const completedDays: Day[] = [];
  for (const week of academyData) {
    for (const day of week.days) {
      if (completedSet.has(day.id)) {
        completedDays.push(day);
      }
    }
  }

  const completedModuleIds = new Set<string>();
  const completedDayLabels = new Set<string>();
  for (const day of completedDays) {
    completedDayLabels.add(`Day ${day.id}`);
    for (const mod of day.modules) {
      completedModuleIds.add(mod.id);
    }
  }

  // Source 1: Main tower question pool (filtered by completed days)
  for (const q of TOWER_QUESTION_POOL) {
    if (completedDayLabels.has(q.module) && !seen.has(q.question)) {
      seen.add(q.question);
      unique.push(q);
    }
  }

  // Source 2: Review questions (filtered by completed module IDs)
  for (const [moduleId, questions] of Object.entries(REVIEW_QUESTIONS)) {
    if (!completedModuleIds.has(moduleId)) continue;
    for (const rq of questions) {
      if (!seen.has(rq.question)) {
        seen.add(rq.question);
        unique.push({
          question: rq.question,
          options: rq.options,
          correct: rq.correct,
          explanation: rq.explanation,
          module: moduleId,
        });
      }
    }
  }

  const uniqueCount = unique.length;
  const isLooped = uniqueCount < 100;

  // Shuffle the unique set
  const shuffled = shuffleArray(unique);

  // Build 100-floor stack, looping if needed
  const questions: TowerQuestion[] = [];
  let loopIndex = 0;
  while (questions.length < 100) {
    // Each full pass through gets reshuffled for variety
    if (loopIndex > 0 && loopIndex % uniqueCount === 0) {
      // Don't reshuffle the source — just continue cycling
    }
    questions.push(shuffled[loopIndex % shuffled.length]);
    loopIndex++;
  }

  // Timer function: first pass = 5s, each repeat cycle loses 0.5s (min 2s)
  const timerForFloor = (floor: number): number => {
    if (!isLooped || uniqueCount === 0) return DEFAULT_TIMER;
    const cycleIndex = Math.floor(floor / uniqueCount); // 0 = first pass, 1 = second, etc.
    return Math.max(MIN_TIMER, DEFAULT_TIMER - cycleIndex * 0.5);
  };

  return { questions, uniqueCount, isLooped, timerForFloor };
}
