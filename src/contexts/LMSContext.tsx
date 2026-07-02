/**
 * LMS Context — provides academy-crawled questions to the Tower game.
 *
 * Accepts `academyData` (the full Week[] curriculum) and `completedDayIds`
 * to dynamically extract questions via extractReferrizerQuestions().
 *
 * The Tower game has NO database of its own — it pulls everything from
 * the user's training history.
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { Week } from '@/data/academyData';
import { ACADEMY_DATA } from '@/data/academyData';
import type { TowerQuestion } from '@/data/towerQuestions';
import { extractReferrizerQuestions, type TowerStack } from '@/lib/extractReferrizerQuestions';

interface LMSContextValue {
  /** The 100-question tower stack extracted from academy data */
  towerStack: TowerStack;
  /** How many training days the user has completed */
  completedDays: number;
  /** User's display name (for leaderboard / HUD) */
  userName: string;
  /** Raw previously asked questions (for backward compat) */
  previouslyAskedQuestions: TowerQuestion[];
}

const LMSContext = createContext<LMSContextValue | null>(null);

export function useLMSContext(): LMSContextValue {
  const ctx = useContext(LMSContext);
  if (!ctx) {
    throw new Error('useLMSContext must be used within an <LMSProvider>');
  }
  return ctx;
}

interface LMSProviderProps {
  children: ReactNode;
  /** The full academy curriculum. Defaults to ACADEMY_DATA for dev/mock. */
  academyData?: Week[];
  /** Which day IDs the user has completed (e.g. [1,2,3,4,5]) */
  completedDayIds?: number[];
  /** Override the user name */
  userName?: string;
}

/**
 * Wraps the Tower game and runs extractReferrizerQuestions() to build
 * the question pool from the user's completed training days.
 *
 * Default: simulates 10 completed days for dev/preview.
 */
export function LMSProvider({
  children,
  academyData = ACADEMY_DATA,
  completedDayIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  userName = 'Trainee',
}: LMSProviderProps) {
  const value = useMemo<LMSContextValue>(() => {
    const towerStack = extractReferrizerQuestions(academyData, completedDayIds);

    return {
      towerStack,
      completedDays: completedDayIds.length,
      userName,
      previouslyAskedQuestions: towerStack.questions,
    };
  }, [academyData, completedDayIds, userName]);

  return <LMSContext.Provider value={value}>{children}</LMSContext.Provider>;
}
