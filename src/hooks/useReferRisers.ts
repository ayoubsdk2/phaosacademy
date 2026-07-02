/**
 * useReferRisers — State management for "ReferRisers! Rise To The Top!"
 * 
 * 100 questions, 10 levels of 10, 10 lives, 10s timer, 24hr lockout.
 */
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { TowerQuestion } from '@/data/towerQuestions';
import type { TowerStack } from '@/lib/extractReferrizerQuestions';

// ── Constants ──
export const TOTAL_QUESTIONS = 100;
export const QUESTIONS_PER_LEVEL = 10;
export const TOTAL_LEVELS = 10;
export const TIMER_SECONDS = 20;
export const STARTING_LIVES = 10;
export const LOCKOUT_HOURS = 0; // No lockout — just restart

export interface LevelInfo {
  level: number;
  name: string;
  quote: string;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, name: 'Googly Eyed Review 👀', quote: "Great job! It's not like teaching a bird how to swim!" },
  { level: 2, name: "Rank-enstein's Lab", quote: 'The system works if you do.' },
  { level: 3, name: 'Funnel-ly Enough', quote: 'Focus on the outcome, not the obstacle.' },
  { level: 4, name: 'Scale-y Business', quote: 'Complexity is the enemy of execution.' },
  { level: 5, name: 'Set-it-and-Forget-it', quote: "You're not selling; you're solving." },
  { level: 6, name: 'Leaky-Bucket Brigade', quote: "If you don't scale, you fail." },
  { level: 7, name: 'We Rank HIGHER!', quote: 'Be obsessed with the results of your clients.' },
  { level: 8, name: 'Referrizing Still', quote: 'Winners find a way; losers find an excuse.' },
  { level: 9, name: "ROI-nd the World", quote: 'Every interaction is an opportunity for a referral.' },
  { level: 10, name: 'Auto Pilot Pirate Ship', quote: "Work smart, move fast, and don't stop." },
];

export type GamePhase = 'intro' | 'playing' | 'correct' | 'levelUp' | 'lifeLost' | 'gameOver' | 'victory';

export interface ReferRisersState {
  phase: GamePhase;
  questionIndex: number; // 0-99
  lives: number;
  score: number;
  selected: number | null;
  remaining: number;
  deathInfo: { correctAnswer: string; wasTimeout: boolean };
  currentLevel: LevelInfo;
  levelJustCompleted: LevelInfo | null;
  totalLivesUsed: number;
  elapsedSeconds: number;
}

export interface ReferRisersActions {
  start: () => void;
  answer: (idx: number) => void;
  continueAfterLevelUp: () => void;
  continueAfterLifeLost: () => void;
  restart: () => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Lockout persistence ──
const LOCKOUT_KEY = 'referrisers-lockout';
const PROGRESS_KEY = 'referrisers-progress';

export function getLockoutEnd(): number | null {
  try {
    const raw = localStorage.getItem(LOCKOUT_KEY);
    if (!raw) return null;
    const end = parseInt(raw, 10);
    if (Date.now() < end) return end;
    localStorage.removeItem(LOCKOUT_KEY);
    return null;
  } catch { return null; }
}

function setLockout() {
  // No lockout — player simply restarts
}

function clearLockout() {
  try { localStorage.removeItem(LOCKOUT_KEY); } catch {}
}

function getLevelForQuestion(qIdx: number): LevelInfo {
  const lvl = Math.min(Math.floor(qIdx / QUESTIONS_PER_LEVEL), TOTAL_LEVELS - 1);
  return LEVELS[lvl];
}

export function useReferRisers(towerStack?: TowerStack, fallbackQuestions?: TowerQuestion[]) {
  const pool = useMemo(() => {
    if (towerStack) return towerStack.questions;
    if (fallbackQuestions && fallbackQuestions.length >= TOTAL_QUESTIONS) {
      return shuffleArray(fallbackQuestions).slice(0, TOTAL_QUESTIONS);
    }
    return [];
  }, [towerStack, fallbackQuestions]);

  // ── Core state ──
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(TIMER_SECONDS);
  const [deathInfo, setDeathInfo] = useState({ correctAnswer: '', wasTimeout: false });
  const [levelJustCompleted, setLevelJustCompleted] = useState<LevelInfo | null>(null);
  const [totalLivesUsed, setTotalLivesUsed] = useState(0);
  const startTimeRef = useRef<number>(0);

  // ── RAF timer ──
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef(0);
  const remainingRef = useRef(TIMER_SECONDS);
  const phaseRef = useRef<GamePhase>('intro');
  const deadFiredRef = useRef(false);

  useEffect(() => { phaseRef.current = phase; }, [phase]);

  const currentQ = pool[questionIndex] || pool[0];
  const currentLevel = getLevelForQuestion(questionIndex);

  // ── RAF loop ──
  const tick = useCallback((now: number) => {
    if (phaseRef.current !== 'playing') {
      lastTickRef.current = now;
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    const dt = (now - lastTickRef.current) / 1000;
    lastTickRef.current = now;
    const next = Math.max(0, remainingRef.current - dt);
    remainingRef.current = next;
    setRemaining(next);
    if (next <= 0 && !deadFiredRef.current) {
      deadFiredRef.current = true;
      return; // timeout effect handles it
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (phase === 'playing') {
      lastTickRef.current = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [phase, questionIndex, tick]);

  const resetTimer = useCallback(() => {
    remainingRef.current = TIMER_SECONDS;
    setRemaining(TIMER_SECONDS);
    deadFiredRef.current = false;
  }, []);

  // Reset timer when question changes
  useEffect(() => { resetTimer(); }, [questionIndex, resetTimer]);

  // ── Timeout handler ──
  useEffect(() => {
    if (remaining > 0 || phase !== 'playing' || !deadFiredRef.current) return;
    handleWrongAnswer(true);
  }, [remaining, phase]);

  const handleWrongAnswer = useCallback((wasTimeout: boolean) => {
    const newLives = lives - 1;
    setLives(newLives);
    setTotalLivesUsed(prev => prev + 1);
    setDeathInfo({ correctAnswer: currentQ.options[currentQ.correct], wasTimeout });

    if (newLives <= 0) {
      setPhase('gameOver');
    } else {
      // Advance past the wrong question so the player doesn't repeat it
      const nextIdx = questionIndex + 1;
      if (nextIdx >= TOTAL_QUESTIONS) {
        clearLockout();
        try { localStorage.removeItem(PROGRESS_KEY); } catch {}
        setPhase('victory');
        return;
      }
      setQuestionIndex(nextIdx);
      setSelected(null);
      setPhase('lifeLost');
    }
  }, [lives, currentQ, questionIndex]);

  // ── Actions ──
  const advanceQuestion = useCallback(() => {
    const nextIdx = questionIndex + 1;
    if (nextIdx >= TOTAL_QUESTIONS) {
      clearLockout();
      try { localStorage.removeItem(PROGRESS_KEY); } catch {}
      setPhase('victory');
      return;
    }

    // Check if we just crossed a level boundary
    const currentLvl = Math.floor(questionIndex / QUESTIONS_PER_LEVEL);
    const nextLvl = Math.floor(nextIdx / QUESTIONS_PER_LEVEL);

    if (nextLvl > currentLvl && nextLvl < TOTAL_LEVELS) {
      setLevelJustCompleted(LEVELS[currentLvl]);
      setQuestionIndex(nextIdx);
      setSelected(null);
      setPhase('levelUp');
    } else {
      setQuestionIndex(nextIdx);
      setSelected(null);
      setPhase('playing');
    }
  }, [questionIndex]);

  const answer = useCallback((idx: number) => {
    if (phase !== 'playing' || selected !== null) return;
    setSelected(idx);

    const correct = idx === currentQ.correct;
    if (correct) {
      setScore(s => s + 100);
      setPhase('correct');
      setTimeout(advanceQuestion, 800);
    } else {
      handleWrongAnswer(false);
    }
  }, [phase, selected, currentQ, advanceQuestion, handleWrongAnswer]);

  const continueAfterLevelUp = useCallback(() => {
    setLevelJustCompleted(null);
    setPhase('playing');
  }, []);

  const continueAfterLifeLost = useCallback(() => {
    // Check if the advanced question crossed a level boundary
    const prevLvl = Math.floor((questionIndex - 1) / QUESTIONS_PER_LEVEL);
    const currLvl = Math.floor(questionIndex / QUESTIONS_PER_LEVEL);
    if (currLvl > prevLvl && currLvl < TOTAL_LEVELS && questionIndex > 0) {
      setLevelJustCompleted(LEVELS[prevLvl]);
      setPhase('levelUp');
    } else {
      setSelected(null);
      resetTimer();
      setPhase('playing');
    }
  }, [resetTimer, questionIndex]);

  const restart = useCallback(() => {
    setQuestionIndex(0);
    setLives(STARTING_LIVES);
    setScore(0);
    setSelected(null);
    setLevelJustCompleted(null);
    setTotalLivesUsed(0);
    startTimeRef.current = Date.now();
    resetTimer();
    setPhase('playing');
  }, [resetTimer]);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    setTotalLivesUsed(0);
    resetTimer();
    setPhase('playing');
  }, [resetTimer]);

  const elapsedSeconds = startTimeRef.current > 0 ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0;

  const state: ReferRisersState = {
    phase, questionIndex, lives, score, selected, remaining,
    deathInfo, currentLevel, levelJustCompleted, totalLivesUsed, elapsedSeconds,
  };

  const actions: ReferRisersActions = { start, answer, continueAfterLevelUp, continueAfterLifeLost, restart };

  return { state, actions, currentQ, pool };
}
