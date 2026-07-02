/**
 * Web Audio API synthesized sounds for ReferRisers.
 * Heavenly / angelic theme.
 */

let bgMusicCtx: AudioContext | null = null;
let bgMusicGain: GainNode | null = null;
let bgOscillators: OscillatorNode[] = [];

// ── Correct answer: divine chime ──
export function playCorrectChime() {
  try {
    const ctx = new AudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.08 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.6);
    });
    setTimeout(() => ctx.close(), 1500);
  } catch {}
}

// ── Wrong answer: cartoonish falling whistle ──
export function playFallingWhistle() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.2);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
    // Comedic boing at end
    const boing = ctx.createOscillator();
    boing.type = 'triangle';
    boing.frequency.setValueAtTime(150, ctx.currentTime + 1.0);
    boing.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 1.15);
    boing.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 1.4);
    const boingGain = ctx.createGain();
    boingGain.gain.setValueAtTime(0.2, ctx.currentTime + 1.0);
    boingGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
    boing.connect(boingGain);
    boingGain.connect(ctx.destination);
    boing.start(ctx.currentTime + 1.0);
    boing.stop(ctx.currentTime + 1.4);
    setTimeout(() => ctx.close(), 2000);
  } catch {}
}

// ── Angel save: triumphant choir "hallelujah" ──
export function playHallelujah() {
  try {
    const ctx = new AudioContext();
    // Choir-like pad: layered sine waves at harmonics
    const chords = [
      [261.63, 329.63, 392.00, 523.25], // C major
      [293.66, 369.99, 440.00, 587.33], // D major  
      [329.63, 415.30, 493.88, 659.25], // E major
      [349.23, 440.00, 523.25, 698.46], // F major
    ];
    chords.forEach((chord, ci) => {
      chord.forEach(freq => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const gain = ctx.createGain();
        const start = ci * 0.4;
        gain.gain.setValueAtTime(0, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + start + 0.15);
        gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + start + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + 0.8);
      });
    });
    setTimeout(() => ctx.close(), 3000);
  } catch {}
}

// ── Level up fanfare ──
export function playLevelUpFanfare() {
  try {
    const ctx = new AudioContext();
    const melody = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.5);
    });
    // Sustained chord
    [523.25, 659.25, 783.99, 1046.50].forEach(freq => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime + 0.7);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.9);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2.0);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + 0.7);
      osc.stop(ctx.currentTime + 3.0);
    });
    setTimeout(() => ctx.close(), 4000);
  } catch {}
}

// ── Game over: somber tone ──
export function playGameOver() {
  try {
    const ctx = new AudioContext();
    const notes = [392.00, 349.23, 293.66, 261.63]; // G4 → F4 → D4 → C4 descending
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.5);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.5 + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.5 + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.5);
      osc.stop(ctx.currentTime + i * 0.5 + 1.2);
    });
    setTimeout(() => ctx.close(), 4000);
  } catch {}
}

// ── Victory: epic fanfare ──
export function playVictoryFanfare() {
  try {
    const ctx = new AudioContext();
    // Triumphant ascending arpeggios
    const melody = [
      523.25, 659.25, 783.99, 1046.50,
      587.33, 739.99, 880.00, 1174.66,
      659.25, 830.61, 987.77, 1318.51,
    ];
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.8);
    });
    // Big final chord
    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach(freq => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime + 1.3);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 1.5);
      gain.gain.linearRampToValueAtTime(0.10, ctx.currentTime + 3.5);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 5.0);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + 1.3);
      osc.stop(ctx.currentTime + 5.0);
    });
    setTimeout(() => ctx.close(), 6000);
  } catch {}
}

// ── Orchestral layer for Level 10 boss fight ──
let orchestralCtx: AudioContext | null = null;
let orchestralGain: GainNode | null = null;
let orchestralIntervalId: any = null;

function startOrchestralLayer() {
  stopOrchestralLayer();
  try {
    orchestralCtx = new AudioContext();
    orchestralGain = orchestralCtx.createGain();
    orchestralGain.gain.value = 0.24;
    orchestralGain.connect(orchestralCtx.destination);

    // Epic brass-like chord progression cycling
    const chordProgression = [
      [261.63, 329.63, 392.00, 523.25],  // C major
      [293.66, 369.99, 440.00, 587.33],  // D major
      [349.23, 440.00, 523.25, 698.46],  // F major
      [392.00, 493.88, 587.33, 783.99],  // G major
      [329.63, 415.30, 493.88, 659.25],  // E major
      [261.63, 329.63, 392.00, 523.25],  // C major resolve
    ];
    let chordIdx = 0;

    const playChord = () => {
      if (!orchestralCtx || orchestralCtx.state === 'closed') return;
      const chord = chordProgression[chordIdx % chordProgression.length];
      chord.forEach(freq => {
        // Brass-like layered oscillators
        ['sawtooth', 'square'].forEach((type, ti) => {
          const osc = orchestralCtx!.createOscillator();
          osc.type = type as OscillatorType;
          osc.frequency.value = freq * (ti === 1 ? 2 : 1); // second layer octave up
          const g = orchestralCtx!.createGain();
          g.gain.setValueAtTime(0, orchestralCtx!.currentTime);
          g.gain.linearRampToValueAtTime(ti === 0 ? 0.04 : 0.015, orchestralCtx!.currentTime + 0.1);
          g.gain.linearRampToValueAtTime(ti === 0 ? 0.03 : 0.01, orchestralCtx!.currentTime + 0.8);
          g.gain.exponentialRampToValueAtTime(0.001, orchestralCtx!.currentTime + 1.2);
          osc.connect(g);
          g.connect(orchestralGain!);
          osc.start();
          osc.stop(orchestralCtx!.currentTime + 1.2);
        });
      });
      // Timpani-like low hit
      const timpani = orchestralCtx!.createOscillator();
      timpani.type = 'sine';
      timpani.frequency.setValueAtTime(80, orchestralCtx!.currentTime);
      timpani.frequency.exponentialRampToValueAtTime(40, orchestralCtx!.currentTime + 0.5);
      const tg = orchestralCtx!.createGain();
      tg.gain.setValueAtTime(0.08, orchestralCtx!.currentTime);
      tg.gain.exponentialRampToValueAtTime(0.001, orchestralCtx!.currentTime + 0.5);
      timpani.connect(tg);
      tg.connect(orchestralGain!);
      timpani.start();
      timpani.stop(orchestralCtx!.currentTime + 0.5);

      chordIdx++;
    };

    playChord();
    orchestralIntervalId = setInterval(playChord, 1400);
  } catch {}
}

function stopOrchestralLayer() {
  try {
    if (orchestralIntervalId) clearInterval(orchestralIntervalId);
    orchestralIntervalId = null;
    if (orchestralCtx) {
      orchestralCtx.close();
      orchestralCtx = null;
      orchestralGain = null;
    }
  } catch {}
}

// ── Background music: heavenly harp + synth (start/stop/scale tempo) ──
export function startBackgroundMusic(level: number = 1) {
  stopBackgroundMusic();
  try {
    bgMusicCtx = new AudioContext();
    bgMusicGain = bgMusicCtx.createGain();
    bgMusicGain.gain.value = 0.16;
    bgMusicGain.connect(bgMusicCtx.destination);

    // Create a gentle arpeggio pattern
    const baseFreqs = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63];
    const tempo = 0.3 - (level - 1) * 0.018; // gets faster per level
    const interval = Math.max(0.1, tempo);

    let noteIdx = 0;
    const playNote = () => {
      if (!bgMusicCtx || bgMusicCtx.state === 'closed') return;
      const freq = baseFreqs[noteIdx % baseFreqs.length];
      const osc = bgMusicCtx.createOscillator();
      osc.type = level >= 8 ? 'sawtooth' : 'sine';
      osc.frequency.value = freq * (level >= 5 ? 1.5 : 1);
      const g = bgMusicCtx.createGain();
      g.gain.setValueAtTime(0, bgMusicCtx.currentTime);
      g.gain.linearRampToValueAtTime(0.24 + level * 0.02, bgMusicCtx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, bgMusicCtx.currentTime + interval * 0.8);
      osc.connect(g);
      g.connect(bgMusicGain!);
      osc.start();
      osc.stop(bgMusicCtx.currentTime + interval * 0.8);
      bgOscillators.push(osc);
      noteIdx++;
    };

    const id = setInterval(playNote, interval * 1000);
    (bgMusicCtx as any)._intervalId = id;

    // Level 10: layer epic orchestral score on top
    if (level >= 10) {
      startOrchestralLayer();
    } else {
      stopOrchestralLayer();
    }
  } catch {}
}

export function stopBackgroundMusic() {
  try {
    stopOrchestralLayer();
    if (bgMusicCtx) {
      clearInterval((bgMusicCtx as any)._intervalId);
      bgOscillators.forEach(o => { try { o.stop(); } catch {} });
      bgOscillators = [];
      bgMusicCtx.close();
      bgMusicCtx = null;
      bgMusicGain = null;
    }
  } catch {}
}

export function updateMusicLevel(level: number) {
  startBackgroundMusic(level);
}
