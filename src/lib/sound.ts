'use client';

/**
 * Effets sonores ultra-légers via Web Audio API (0 fichier MP3 à télécharger).
 * Désactivable en 1 clic par l'élève.
 */

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(
  freq: number,
  durationSec: number,
  type: OscillatorType = 'sine',
  gainPeak = 0.08,
  delaySec = 0
) {
  const ctx = getCtx();
  if (!ctx) return;

  const now = ctx.currentTime + delaySec;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + durationSec + 0.02);
}

export function playCorrectSound(enabled: boolean) {
  if (!enabled) return;
  playTone(587.33, 0.12, 'triangle', 0.08, 0); // D5
  playTone(880, 0.18, 'triangle', 0.09, 0.08); // A5
}

export function playWrongSound(enabled: boolean) {
  if (!enabled) return;
  playTone(220, 0.16, 'sawtooth', 0.05, 0);
  playTone(175, 0.2, 'sawtooth', 0.05, 0.09);
}

export function playVictorySound(enabled: boolean) {
  if (!enabled) return;
  playTone(523.25, 0.14, 'triangle', 0.08, 0); // C5
  playTone(659.25, 0.14, 'triangle', 0.08, 0.1); // E5
  playTone(783.99, 0.16, 'triangle', 0.09, 0.2); // G5
  playTone(1046.5, 0.28, 'triangle', 0.1, 0.32); // C6
}
