/**
 * Gothic CSS keyframes for the Tower game.
 * Injected once into document <head>.
 */

const TOWER_KEYFRAMES = `
@keyframes tower-pulse-red {
  0%, 100% { box-shadow: inset 0 0 60px rgba(255,0,0,0.0); }
  50% { box-shadow: inset 0 0 140px rgba(255,0,0,0.55); }
}
@keyframes tower-shake {
  0%, 100% { transform: translateX(0); }
  10% { transform: translateX(-8px) rotate(-0.6deg); }
  20% { transform: translateX(7px) rotate(0.6deg); }
  30% { transform: translateX(-5px); }
  40% { transform: translateX(4px); }
  50% { transform: translateX(-2px); }
}
@keyframes tower-flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
@keyframes tower-stone-shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
`;

let injected = false;
export function injectTowerStyles() {
  if (injected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.textContent = TOWER_KEYFRAMES;
  document.head.appendChild(style);
  injected = true;
}
