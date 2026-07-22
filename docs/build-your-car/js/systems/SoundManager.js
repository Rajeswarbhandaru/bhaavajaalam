export class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();
    this.initialized = true;
  }

  ensure() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  _playTone({ type = 'sine', freq = 440, duration = 0.12, vol = 0.08, fade = true, sweep = 0 }) {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (sweep) o.frequency.exponentialRampToValueAtTime(freq + sweep, t + duration);
    g.gain.setValueAtTime(vol, t);
    if (fade) g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    o.connect(g).connect(this.ctx.destination);
    o.start(t);
    o.stop(t + duration);
  }

  click() { this._playTone({ type: 'sine', freq: 880, duration: 0.08, vol: 0.06 }); }
  install() { this._playTone({ type: 'triangle', freq: 520, duration: 0.18, vol: 0.07, sweep: 120 }); }
  remove() { this._playTone({ type: 'triangle', freq: 640, duration: 0.14, vol: 0.06, sweep: -180 }); }
  warning() { this._playTone({ type: 'sawtooth', freq: 320, duration: 0.22, vol: 0.05 }); }
  success() {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    [523, 659, 784, 1047].forEach((f, i) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(f, t + i * 0.08);
      g.gain.setValueAtTime(0.07, t + i * 0.08);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.2);
      o.connect(g).connect(this.ctx.destination);
      o.start(t + i * 0.08);
      o.stop(t + i * 0.08 + 0.2);
    });
  }
  stall() {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(180, t);
    o.frequency.exponentialRampToValueAtTime(80, t + 0.35);
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    o.connect(g).connect(this.ctx.destination);
    o.start(t);
    o.stop(t + 0.35);
  }
  startEngine() {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(90, t);
    o.frequency.exponentialRampToValueAtTime(140, t + 0.4);
    g.gain.setValueAtTime(0.06, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    o.connect(g).connect(this.ctx.destination);
    o.start(t);
    o.stop(t + 0.5);
  }
}