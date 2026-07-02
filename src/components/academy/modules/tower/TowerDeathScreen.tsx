import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDeathExecutive } from '@/assets/executives';

// ── Gothic Horror Palette ──
const BG = '#0a0a0a';
const GOLD = '#d4af37';
const BLOOD = '#ff0000';
const BLOOD_DARK = '#8b0000';
const BLOOD_DARKER = '#4a0000';

interface TowerDeathScreenProps {
  visible: boolean;
  floor: number;
  checkpoint: number;
  onRestart: () => void;
  correctAnswer: string;
  wasTimeout: boolean;
  deathCount: number;
}

function generateBloodParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (i / count) * 360 + (i * 37 % 30) - 15,
    distance: 60 + (i * 53 % 140),
    size: 3 + (i * 17 % 14),
    delay: 0.6 + (i * 7 % 400) / 1000,
    duration: 0.3 + (i * 13 % 400) / 1000,
  }));
}

function generateBloodDrops(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: -80 + (i * 43 % 160),
    endY: 80 + (i * 67 % 250),
    size: 2 + (i * 11 % 8),
    delay: 0.8 + (i * 31 % 600) / 1000,
    duration: 0.6 + (i * 19 % 800) / 1000,
  }));
}

function generateDrips(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: 10 + (i * 29 % 80),
    delay: 2.5 + (i * 17 % 2000) / 1000,
    height: 30 + (i * 41 % 60),
    duration: 1.5 + (i * 13 % 1000) / 1000,
  }));
}

/** Generate a blood-curdling scream using Web Audio API */
function playDeathScream() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const duration = 2.2;

    // Main scream — distorted sawtooth
    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(800, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + duration);

    const osc2 = ctx.createOscillator();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(600, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + duration * 0.8);

    // High-pitched shriek
    const osc3 = ctx.createOscillator();
    osc3.type = 'sawtooth';
    osc3.frequency.setValueAtTime(1800, ctx.currentTime);
    osc3.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + duration * 0.6);

    // Distortion
    const distortion = ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = (Math.PI + 80) * x / (Math.PI + 80 * Math.abs(x));
    }
    distortion.curve = curve;

    // Gain envelopes
    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0.35, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.2, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration * 0.8);

    const gain3 = ctx.createGain();
    gain3.gain.setValueAtTime(0.15, ctx.currentTime);
    gain3.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration * 0.6);

    // Noise burst for grit
    const bufferSize = ctx.sampleRate * duration;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    // Filter for body
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 2;

    // Master gain
    const master = ctx.createGain();
    master.gain.value = 0.7;

    // Connect
    osc1.connect(distortion);
    distortion.connect(gain1);
    gain1.connect(filter);

    osc2.connect(gain2);
    gain2.connect(filter);

    osc3.connect(gain3);
    gain3.connect(master);

    filter.connect(master);
    noise.connect(noiseGain);
    noiseGain.connect(master);
    master.connect(ctx.destination);

    // Play
    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc3.start(ctx.currentTime);
    noise.start(ctx.currentTime);

    osc1.stop(ctx.currentTime + duration);
    osc2.stop(ctx.currentTime + duration * 0.8);
    osc3.stop(ctx.currentTime + duration * 0.6);
    noise.stop(ctx.currentTime + duration);

    setTimeout(() => ctx.close(), (duration + 0.5) * 1000);
  } catch {
    // Audio API not available — silent fallback
  }
}

type Phase = 'blackout' | 'executioner' | 'strike' | 'aftermath' | 'gameover';

export function TowerDeathScreen({ visible, floor, checkpoint, onRestart, correctAnswer, wasTimeout, deathCount }: TowerDeathScreenProps) {
  const [phase, setPhase] = useState<Phase>('blackout');
  const screamPlayedRef = useRef(false);
  const { photo: execPhoto, name: execName } = getDeathExecutive(deathCount);
  const bloodParticles = useMemo(() => generateBloodParticles(50), []);
  const bloodDrops = useMemo(() => generateBloodDrops(25), []);
  const textDrips = useMemo(() => generateDrips(12), []);

  useEffect(() => {
    if (!visible) { setPhase('blackout'); screamPlayedRef.current = false; return; }
    const t1 = setTimeout(() => setPhase('executioner'), 500);
    const t2 = setTimeout(() => setPhase('strike'), 1600);
    const t3 = setTimeout(() => setPhase('aftermath'), 2400);
    const t4 = setTimeout(() => setPhase('gameover'), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [visible]);

  // Play scream when strike happens
  useEffect(() => {
    if (phase === 'strike' && !screamPlayedRef.current) {
      screamPlayedRef.current = true;
      playDeathScream();
    }
  }, [phase]);

  const pastStrike = phase === 'strike' || phase === 'aftermath' || phase === 'gameover';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] overflow-hidden"
          style={{ background: BG }}
        >
          {/* ═══ PHASE 1: PITCH BLACK SUSPENSE ═══ */}
          <AnimatePresence>
            {phase === 'blackout' && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 z-50"
                style={{ background: '#000' }}
              />
            )}
          </AnimatePresence>

          {/* Dark radial BG */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase !== 'blackout' ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
            style={{ background: `radial-gradient(ellipse at 50% 35%, ${BLOOD_DARKER} 0%, ${BG} 50%, #000 100%)` }}
          />

          {/* Blood pulse vignette */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={phase !== 'blackout' ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ boxShadow: `inset 0 0 100px ${BLOOD}50, inset 0 0 200px ${BLOOD_DARK}30` }}
          />

          {/* ═══ EXECUTIONER FIGURE ═══ */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.7 }}
              animate={phase !== 'blackout' ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute flex flex-col items-center"
              style={{ top: '8%' }}
            >
              {/* Hood */}
              <div className="relative">
                <div className="w-20 h-24 rounded-t-full" style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #000 100%)', boxShadow: '0 0 40px rgba(0,0,0,0.9)' }} />
                {/* Glowing red eyes */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={phase !== 'blackout' ? { opacity: [0, 1, 0.5, 1] } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="absolute top-9 left-4 flex gap-4"
                >
                  <div className="w-3 h-1.5 rounded-full" style={{ background: BLOOD, boxShadow: `0 0 8px ${BLOOD}, 0 0 20px ${BLOOD}` }} />
                  <div className="w-3 h-1.5 rounded-full" style={{ background: BLOOD, boxShadow: `0 0 8px ${BLOOD}, 0 0 20px ${BLOOD}` }} />
                </motion.div>
              </div>
              {/* Cloak */}
              <div className="w-28 h-36 -mt-1" style={{
                background: 'linear-gradient(180deg, #0a0a0a 0%, #000 100%)',
                clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
              }} />
            </motion.div>

            {/* ═══ GREAT BLADE ═══ */}
            <motion.div
              className="absolute"
              style={{ top: '14%', left: '50%', transformOrigin: 'top right' }}
              initial={{ rotate: -65, x: 35, opacity: 0 }}
              animate={
                phase === 'executioner' ? { rotate: -65, x: 35, opacity: 1 } :
                pastStrike ? { rotate: 45, x: -25, opacity: 1 } : {}
              }
              transition={phase === 'strike' ? { duration: 0.2, ease: [0.22, 1, 0.36, 1] } : { duration: 0.5 }}
            >
              <div className="relative">
                <div className="w-3.5 h-32" style={{
                  background: 'linear-gradient(180deg, #9ca3af, #d1d5db, #9ca3af)',
                  boxShadow: `2px 0 10px rgba(200,200,200,0.2), -1px 0 6px rgba(0,0,0,0.7)`,
                  borderRadius: '1px 1px 3px 3px',
                }} />
                <div className="absolute top-0 right-0 w-[1px] h-32" style={{ background: 'linear-gradient(180deg, transparent, #fff, transparent)' }} />
                {pastStrike && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="absolute bottom-0 left-0 w-full h-16"
                    style={{ background: `linear-gradient(0deg, ${BLOOD}90, transparent)`, transformOrigin: 'bottom' }}
                  />
                )}
                <div className="w-6 h-10 -ml-1 rounded-b" style={{ background: 'linear-gradient(180deg, #292524, #1c1917)' }} />
              </div>
            </motion.div>

            {/* ═══ ANDRE — THE VICTIM ═══ */}
            <div className="absolute" style={{ top: '34%' }}>
              {/* Head — Andre's face, happy → sad on strike */}
              <motion.div
                initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
                animate={pastStrike ? {
                  y: [0, -15, 25, 100, 220, 300],
                  x: [0, 8, 25, 40, 55, 60],
                  rotate: [0, -20, 40, 80, 110, 130],
                  opacity: [1, 1, 1, 0.9, 0.6, 0],
                } : {}}
                transition={{ duration: 2, ease: 'easeIn', times: [0, 0.08, 0.25, 0.5, 0.75, 1] }}
                className="relative z-10"
              >
                <div className="relative w-16 h-16 rounded-full mx-auto overflow-hidden"
                  style={{
                    boxShadow: pastStrike 
                      ? `0 0 20px ${BLOOD}80, 0 0 40px ${BLOOD}40` 
                      : '0 0 15px rgba(0,0,0,0.6)',
                    border: `2px solid ${pastStrike ? BLOOD : '#52525b'}`,
                  }}
                >
                  <img 
                    src={execPhoto} 
                    alt={execName}
                    className="w-full h-full object-cover object-top"
                    style={{ 
                      filter: pastStrike ? 'saturate(0.3) brightness(0.6)' : 'none',
                    }}
                  />
                  {/* Sad overlay on death */}
                  <AnimatePresence>
                    {pastStrike && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ 
                          background: 'rgba(139,0,0,0.45)',
                        }}
                      >
                        <span className="text-3xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }}>😵</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* Happy indicator before strike */}
                  {!pastStrike && (
                    <motion.div
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute bottom-0 right-0 text-lg"
                    >
                      😰
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Neck stump */}
              <AnimatePresence>
                {pastStrike && (
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ duration: 0.15, delay: 0.2 }}
                    className="w-8 h-4 mx-auto rounded-t -mt-2"
                    style={{ background: BLOOD_DARK, transformOrigin: 'bottom' }}
                  />
                )}
              </AnimatePresence>

              {/* ═══ BLOOD SPRAY ═══ */}
              {pastStrike && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  {/* Central arterial gush */}
                  <motion.div
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: [0, 1, 0.8, 0.3], opacity: [0, 1, 0.9, 0.2] }}
                    transition={{ duration: 1.5, delay: 0.15 }}
                    className="w-5 h-24 mx-auto -mt-2 rounded-t"
                    style={{
                      background: `linear-gradient(180deg, ${BLOOD}, ${BLOOD_DARK}, transparent)`,
                      transformOrigin: 'bottom',
                      filter: 'blur(1px)',
                    }}
                  />
                  {/* Radial spray particles */}
                  {bloodParticles.map(p => {
                    const rad = (p.angle * Math.PI) / 180;
                    const tx = Math.cos(rad) * p.distance;
                    const ty = Math.sin(rad) * p.distance * 0.5 - 50;
                    return (
                      <motion.div
                        key={p.id}
                        initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                        animate={{ x: tx, y: ty, opacity: [0, 0.95, 0.8, 0], scale: [0, 1.8, 1.2, 0.3] }}
                        transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
                        className="absolute rounded-full"
                        style={{
                          width: p.size,
                          height: p.size,
                          background: p.id % 4 === 0 ? BLOOD : p.id % 4 === 1 ? '#cc0000' : p.id % 4 === 2 ? BLOOD_DARK : '#660000',
                          boxShadow: `0 0 ${p.size + 2}px ${BLOOD}80`,
                        }}
                      />
                    );
                  })}
                  {/* Gravity drips */}
                  {bloodDrops.map(d => (
                    <motion.div
                      key={`d-${d.id}`}
                      initial={{ x: d.x, y: 0, opacity: 0, scaleY: 0.5 }}
                      animate={{ y: d.endY, opacity: [0, 0.95, 0.85, 0], scaleY: [0.5, 2.5, 3.5, 1] }}
                      transition={{ duration: d.duration, delay: d.delay, ease: 'easeIn' }}
                      className="absolute rounded-full"
                      style={{ width: d.size, height: d.size * 2.5, background: BLOOD, filter: 'blur(0.5px)' }}
                    />
                  ))}
                </div>
              )}

              {/* ═══ HUMAN BODY — Suited figure ═══ */}
              <motion.div
                initial={{ y: 0, rotate: 0, opacity: 1 }}
                animate={phase === 'aftermath' || phase === 'gameover' ? { y: 25, rotate: -10, opacity: 0.3 } : {}}
                transition={{ duration: 1.8, ease: 'easeIn' }}
                className="relative flex flex-col items-center"
              >
                {/* Torso — black t-shirt like Andre's photo */}
                <div className="relative" style={{
                  width: 72, height: 80,
                  background: 'linear-gradient(180deg, #1a1a1a 0%, #111 50%, #0a0a0a 100%)',
                  clipPath: 'polygon(25% 0%, 75% 0%, 90% 100%, 10% 100%)',
                  boxShadow: 'inset 0 2px 8px rgba(80,80,80,0.1)',
                  borderRadius: '4px 4px 0 0',
                }}>
                  {/* Collar / necklace detail */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-[2px] rounded-full" style={{ background: '#333' }} />
                  <motion.div
                    className="absolute top-3 left-1/2 -translate-x-1/2"
                    animate={!pastStrike ? { y: [0, 0.5, 0] } : {}}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <div className="flex gap-[1px]">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full" style={{ background: '#444' }} />
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Arms */}
                <div className="absolute top-2 -left-4 flex justify-between" style={{ width: 96 }}>
                  {/* Left arm */}
                  <motion.div
                    animate={!pastStrike ? { rotate: [0, -3, 0] } : { rotate: -15, y: 10 }}
                    transition={!pastStrike ? { duration: 2, repeat: Infinity } : { duration: 1.5 }}
                    style={{ transformOrigin: 'top right' }}
                  >
                    <div className="w-5 h-20 rounded-b-lg" style={{
                      background: 'linear-gradient(180deg, #1a1a1a, #111)',
                    }} />
                    {/* Hand — skin tone */}
                    <div className="w-4 h-5 mx-auto rounded-b" style={{ background: '#d4a574' }} />
                  </motion.div>
                  {/* Right arm */}
                  <motion.div
                    animate={!pastStrike ? { rotate: [0, 3, 0] } : { rotate: 15, y: 10 }}
                    transition={!pastStrike ? { duration: 2, repeat: Infinity, delay: 0.5 } : { duration: 1.5 }}
                    style={{ transformOrigin: 'top left' }}
                  >
                    <div className="w-5 h-20 rounded-b-lg" style={{
                      background: 'linear-gradient(180deg, #1a1a1a, #111)',
                    }} />
                    <div className="w-4 h-5 mx-auto rounded-b" style={{ background: '#d4a574' }} />
                  </motion.div>
                </div>

                {/* Legs */}
                <div className="flex gap-3 -mt-1">
                  <motion.div
                    animate={pastStrike ? { rotate: -8 } : {}}
                    transition={{ duration: 1 }}
                    className="w-7 h-20 rounded-b-lg"
                    style={{ background: 'linear-gradient(180deg, #1c1c1c, #111)' }}
                  >
                    {/* Shoe */}
                    <div className="w-8 h-4 rounded-b rounded-r-lg -ml-0.5 mt-auto" style={{ background: '#222', marginTop: 56 }} />
                  </motion.div>
                  <motion.div
                    animate={pastStrike ? { rotate: 8 } : {}}
                    transition={{ duration: 1 }}
                    className="w-7 h-20 rounded-b-lg"
                    style={{ background: 'linear-gradient(180deg, #1c1c1c, #111)' }}
                  >
                    <div className="w-8 h-4 rounded-b rounded-l-lg -mr-0.5 mt-auto" style={{ background: '#222', marginTop: 56 }} />
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Blood pool */}
            <motion.div
              initial={{ scaleX: 0, scaleY: 0, opacity: 0 }}
              animate={phase === 'aftermath' || phase === 'gameover' ? { scaleX: 1, scaleY: 1, opacity: 0.8 } : {}}
              transition={{ duration: 2.5, delay: 0.3 }}
              className="absolute"
              style={{
                bottom: '14%', width: 240, height: 40, borderRadius: '50%',
                background: `radial-gradient(ellipse, ${BLOOD_DARK} 0%, ${BLOOD_DARKER} 40%, transparent 70%)`,
                filter: 'blur(6px)',
              }}
            />
          </div>

          {/* ═══ GAME OVER OVERLAY ═══ */}
          <AnimatePresence>
            {phase === 'gameover' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex items-center justify-center z-30"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.65 }}
                  transition={{ duration: 1.2 }}
                  className="absolute inset-0"
                  style={{ background: '#000' }}
                />

                <div className="relative z-10 text-center px-6 max-w-lg">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="w-56 h-[1px] mx-auto mb-3"
                    style={{ background: `linear-gradient(90deg, transparent, ${BLOOD}, transparent)` }}
                  />

                  {/* GAME OVER — dripping gothic text */}
                  <div className="relative inline-block">
                    <motion.h1
                      initial={{ opacity: 0, y: 30, scale: 0.7 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 60, damping: 8, delay: 0.2 }}
                      className="text-5xl sm:text-7xl md:text-8xl font-black tracking-[0.3em]"
                      style={{
                        color: BLOOD,
                        textShadow: `0 0 30px ${BLOOD}90, 0 0 60px ${BLOOD}50, 0 0 100px ${BLOOD}30, 0 6px 30px rgba(0,0,0,0.9)`,
                        fontFamily: 'Georgia, "Times New Roman", serif',
                      }}
                    >
                      GAME OVER
                    </motion.h1>

                    {textDrips.map(d => (
                      <motion.div
                        key={`td-${d.id}`}
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: [0, 0.8, 0.6, 0.3] }}
                        transition={{ duration: d.duration, delay: d.delay }}
                        className="absolute rounded-b-full"
                        style={{
                          left: `${d.left}%`,
                          top: '100%',
                          width: 2,
                          height: d.height,
                          background: `linear-gradient(180deg, ${BLOOD}, ${BLOOD_DARK}, transparent)`,
                          transformOrigin: 'top',
                        }}
                      />
                    ))}
                  </div>

                  <motion.div
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-40 -z-10 rounded-full"
                    style={{ background: `radial-gradient(ellipse, ${BLOOD}18 0%, transparent 70%)` }}
                  />

                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="w-56 h-[1px] mx-auto mt-4 mb-5"
                    style={{ background: `linear-gradient(90deg, transparent, ${BLOOD}80, transparent)` }}
                  />

                  {/* Andre-specific death flavor */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-sm tracking-[0.2em] uppercase mb-1"
                    style={{ color: '#57534e', fontFamily: 'Georgia, serif' }}
                  >
                    {wasTimeout ? '⏳ The Doom Clock consumed Andre' : '⚔️ Andre has been executed'}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-xs tracking-widest uppercase mb-5"
                    style={{ color: `${BLOOD}90` }}
                  >
                    Fell on Floor {floor} of 100
                  </motion.p>

                  {/* Correct answer */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="mb-6 p-4 rounded-xl max-w-sm mx-auto"
                    style={{
                      background: 'rgba(10,10,10,0.7)',
                      border: `1px solid ${BLOOD_DARK}40`,
                      boxShadow: `inset 0 0 20px ${BLOOD_DARKER}30`,
                    }}
                  >
                    <p className="text-[10px] uppercase tracking-[0.2em] mb-1.5" style={{ color: '#44403c' }}>
                      The correct answer was
                    </p>
                    <p className="text-sm font-bold leading-snug" style={{ color: GOLD }}>
                      {correctAnswer}
                    </p>
                  </motion.div>

                  {/* Restart button */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, type: 'spring', stiffness: 100 }}
                    whileHover={{ scale: 1.06, boxShadow: `0 0 40px ${BLOOD}60, 0 0 80px ${BLOOD}25` }}
                    whileTap={{ scale: 0.94 }}
                    onClick={onRestart}
                    className="px-10 py-4 rounded-xl font-black text-sm tracking-[0.15em] uppercase transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${BLOOD_DARKER}, ${BLOOD_DARK}, ${BLOOD_DARKER})`,
                      border: `1px solid ${BLOOD}35`,
                      color: '#fca5a5',
                      boxShadow: `0 0 20px ${BLOOD}25, inset 0 1px 0 rgba(252,165,165,0.08)`,
                    }}
                  >
                    ⚔️ Restart from Floor {checkpoint + 1}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
