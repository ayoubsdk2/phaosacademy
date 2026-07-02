import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { TowerQuestion } from '@/data/towerQuestions';
import type { TowerStack } from '@/lib/extractReferrizerQuestions';
export type { TowerQuestion } from '@/data/towerQuestions';

// ── Constants ──
export const TOTAL_FLOORS = 100;
export const TIMER_SECONDS = 60;
export const BOSS_TIMER_SECONDS = 60;
export const BOSS_INTERVAL = 10;
export const BOSS_QUESTIONS = 3; // 3 questions per boss floor

export type GamePhase = 'intro' | 'playing' | 'correct' | 'shielded' | 'death' | 'victory';

export interface TowerGameState {
  phase: GamePhase;
  floor: number;
  score: number;
  streak: number;
  shields: number;
  freezes: number;
  checkpoint: number;
  selected: number | null;
  frozen: boolean;
  usedFreeze: boolean;
  remaining: number;
  powerupMsg: string;
  deathInfo: { correctAnswer: string; wasTimeout: boolean };
  floorTimer: number;
  /** Boss floor sub-question index (0-2) */
  bossStep: number;
  /** Whether next question has infinite time (Temporal Freeze) */
  temporalFreeze: boolean;
}

export interface TowerGameActions {
  start: () => void;
  answer: (idx: number) => void;
  useFreeze: () => void;
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

const STORAGE_KEY = 'tower-of-retention-progress';

interface SavedProgress {
  floor: number;
  checkpoint: number;
  score: number;
  shields: number;
  freezes: number;
}

function loadProgress(): SavedProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedProgress;
  } catch { return null; }
}

function saveProgress(data: SavedProgress) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

function clearProgress() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

export function useTowerGame(towerStack?: TowerStack, fallbackQuestions?: TowerQuestion[]) {
  const pool = useMemo(() => {
    if (towerStack) return towerStack.questions;
    if (fallbackQuestions && fallbackQuestions.length >= TOTAL_FLOORS) {
      return shuffleArray(fallbackQuestions).slice(0, TOTAL_FLOORS);
    }
    return [];
  }, [towerStack, fallbackQuestions]);

  // Timer resolver — boss floors get 3s, temporal freeze = 999s
  const getTimerForFloor = useCallback((floor: number, isTempFreeze = false): number => {
    if (isTempFreeze) return 999; // effectively infinite
    const isBoss = (floor + 1) % BOSS_INTERVAL === 0;
    if (isBoss) return BOSS_TIMER_SECONDS;
    if (towerStack) return towerStack.timerForFloor(floor);
    return TIMER_SECONDS;
  }, [towerStack]);

  // ── Load saved progress ──
  const saved = useMemo(() => loadProgress(), []);

  // ── Core state ──
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [floor, setFloor] = useState(saved?.floor ?? 0);
  const [score, setScore] = useState(saved?.score ?? 0);
  const [streak, setStreak] = useState(0);
  const [shields, setShields] = useState(saved?.shields ?? 0);
  const [freezes, setFreezes] = useState(saved?.freezes ?? 0);
  const [checkpoint, setCheckpoint] = useState(saved?.checkpoint ?? 0);
  const [selected, setSelected] = useState<number | null>(null);
  const [frozen, setFrozen] = useState(false);
  const [usedFreeze, setUsedFreeze] = useState(false);
  const [powerupMsg, setPowerupMsg] = useState('');
  const [deathInfo, setDeathInfo] = useState({ correctAnswer: '', wasTimeout: false });
  const [bossStep, setBossStep] = useState(0);
  const [temporalFreeze, setTemporalFreeze] = useState(false);

  // ── Precision timer via requestAnimationFrame ──
  const initialTimer = getTimerForFloor(saved?.floor ?? 0);
  const [remaining, setRemaining] = useState(initialTimer);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const remainingRef = useRef(initialTimer);
  const phaseRef = useRef<GamePhase>('intro');
  const frozenRef = useRef(false);
  const deadFiredRef = useRef(false);

  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { frozenRef.current = frozen; }, [frozen]);

  const currentQ = pool[floor] || pool[0];
  const isBossFloor = (floor + 1) % BOSS_INTERVAL === 0;
  const floorTimer = getTimerForFloor(floor, temporalFreeze);

  // ── RAF loop ──
  const tick = useCallback((now: number) => {
    if (phaseRef.current !== 'playing' || frozenRef.current) {
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
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (phase === 'playing') {
      lastTickRef.current = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [phase, floor, bossStep, tick]);

  const resetTimer = useCallback((forFloor?: number, isTempFreeze = false) => {
    const t = getTimerForFloor(forFloor ?? floor, isTempFreeze);
    remainingRef.current = t;
    setRemaining(t);
    deadFiredRef.current = false;
  }, [floor, getTimerForFloor]);

  // Reset timer when floor or bossStep changes
  useEffect(() => {
    resetTimer(floor, temporalFreeze);
  }, [floor, bossStep, resetTimer, temporalFreeze]);

  // ── Timeout handler ──
  useEffect(() => {
    if (remaining > 0 || phase !== 'playing' || !deadFiredRef.current) return;
    // Temporal freeze = effectively infinite, should never timeout
    if (temporalFreeze) return;

    if (shields > 0) {
      setShields(s => s - 1);
      setStreak(0);
      setPowerupMsg('🛡️ AEGIS SAVED YOU FROM THE CLOCK!');
      setPhase('shielded');
      setTimeout(() => {
        setSelected(null);
        resetTimer(floor, false);
        setPhase('playing');
      }, 1200);
    } else {
      setDeathInfo({ correctAnswer: currentQ.options[currentQ.correct], wasTimeout: true });
      setPhase('death');
      setStreak(0);
    }
  }, [remaining, phase]);

  useEffect(() => {
    if (!powerupMsg) return;
    const t = setTimeout(() => setPowerupMsg(''), 2500);
    return () => clearTimeout(t);
  }, [powerupMsg]);

  // ── Persist to localStorage on checkpoint changes ──
  useEffect(() => {
    if (phase === 'playing' || phase === 'correct' || phase === 'shielded') {
      saveProgress({ floor, checkpoint, score, shields, freezes });
    }
  }, [floor, checkpoint, score, shields, freezes, phase]);

  // ── Actions ──
  const advanceFloor = useCallback(() => {
    const nextFloor = floor + 1;
    if (nextFloor >= TOTAL_FLOORS) {
      clearProgress();
      setPhase('victory');
      return;
    }
    // Set checkpoint AFTER completing a boss floor
    if ((floor + 1) % BOSS_INTERVAL === 0) {
      setCheckpoint(floor + 1);
    }
    setFloor(nextFloor);
    setSelected(null);
    setFrozen(false);
    setUsedFreeze(false);
    setBossStep(0);
    // Clear temporal freeze after use
    if (temporalFreeze) setTemporalFreeze(false);
    setPhase('playing');
  }, [floor, temporalFreeze]);

  // Boss floor: advance to next sub-question within the same floor
  const advanceBossStep = useCallback(() => {
    setBossStep(s => s + 1);
    setSelected(null);
    // Timer resets automatically via bossStep useEffect
    setPhase('playing');
  }, []);

  const answer = useCallback((idx: number) => {
    if (phase !== 'playing' || selected !== null) return;
    setSelected(idx);

    const correct = idx === currentQ.correct;

    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const points = isBossFloor ? 200 : 100;
      setScore(s => s + points);

      // Power-up thresholds
      if (newStreak === 3) {
        setShields(s => s + 1);
        setPowerupMsg('🛡️ AEGIS SHIELD FORGED!');
      }
      if (newStreak === 5) {
        setFreezes(s => s + 1);
        setPowerupMsg('⏳ TEMPORAL FREEZE EARNED!');
        setStreak(0);
      }

      setPhase('correct');

      // Boss floor: if not all 3 sub-questions done, advance sub-step
      if (isBossFloor && bossStep < BOSS_QUESTIONS - 1) {
        setTimeout(advanceBossStep, 600);
      } else {
        setTimeout(advanceFloor, isBossFloor ? 1200 : 600);
      }
    } else {
      if (shields > 0) {
        setShields(s => s - 1);
        setStreak(0);
        setPowerupMsg('🛡️ AEGIS ABSORBED THE HIT!');
        setPhase('shielded');
        setTimeout(() => {
          setSelected(null);
          resetTimer(floor, false);
          setPhase('playing');
        }, 1200);
      } else {
        setDeathInfo({ correctAnswer: currentQ.options[currentQ.correct], wasTimeout: false });
        setPhase('death');
        setStreak(0);
      }
    }
  }, [phase, selected, currentQ, streak, shields, isBossFloor, bossStep, advanceFloor, advanceBossStep, floor, resetTimer]);

  const useFreeze = useCallback(() => {
    if (freezes > 0 && !usedFreeze && phase === 'playing') {
      setFreezes(f => f - 1);
      setTemporalFreeze(true);
      setUsedFreeze(true);
      // Immediately reset timer to infinite for this question
      const t = 999;
      remainingRef.current = t;
      setRemaining(t);
      deadFiredRef.current = false;
    }
  }, [freezes, usedFreeze, phase]);

  const restart = useCallback(() => {
    setFloor(checkpoint);
    setSelected(null);
    setFrozen(false);
    setUsedFreeze(false);
    setBossStep(0);
    setTemporalFreeze(false);
    resetTimer(checkpoint, false);
    setPhase('playing');
  }, [checkpoint, resetTimer]);

  const start = useCallback(() => {
    // If resuming from saved progress, start from saved floor
    const startFloor = saved?.floor ?? 0;
    if (startFloor > 0) {
      resetTimer(startFloor, false);
    } else {
      resetTimer(0, false);
    }
    setPhase('playing');
  }, [resetTimer, saved]);

  const state: TowerGameState = {
    phase, floor, score, streak, shields, freezes, checkpoint,
    selected, frozen, usedFreeze, remaining, powerupMsg, deathInfo,
    floorTimer, bossStep, temporalFreeze,
  };

  const actions: TowerGameActions = { start, answer, useFreeze, restart };

  return { state, actions, currentQ, isBossFloor, pool };
}
