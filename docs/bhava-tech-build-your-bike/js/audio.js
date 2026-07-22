// audio.js — sound effect manager using Web Audio API (no external assets required at build time)
class AudioBus {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }
  _ensureCtx() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  click() { this._tone(880, 0.05, 0.03); }
  success() { this._tone(660, 0.12, 0.05); this._tone(990, 0.12, 0.05, 0.08); }
  fail() { this._tone(180, 0.2, 0.06); }
  spark() { this._noise(0.08); }
  toggleMute() { this.enabled = !this.enabled; return this.enabled; }
  _tone(freq, dur, vol, delay = 0) {
    if (!this.enabled) return;
    this._ensureCtx();
    const t0 = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur);
  }
  _noise(dur) {
    if (!this.enabled) return;
    this._ensureCtx();
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(this.ctx.destination);
    src.start();
  }
}
export const audioBus = new AudioBus();
