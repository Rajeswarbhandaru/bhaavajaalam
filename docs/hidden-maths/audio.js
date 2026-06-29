const AudioEngine = (function () {
  'use strict';

  let ctx = null;
  let masterGain = null;
  let isMuted = false;
  let isReady = false;
  const VOL = 0.32;

  function init() {
    if (isReady) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
      masterGain = ctx.createGain();
      masterGain.gain.value = VOL;
      masterGain.connect(ctx.destination);
      isReady = true;
    } catch (e) {}
  }

  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  function ready() {
    init();
    resume();
  }

  function tone(freq, type, duration, vol, attack, decay, slideTo, delay) {
    if (!ctx || isMuted) return;
    delay = delay || 0;
    attack = attack || 0.008;
    decay = decay || duration * 0.7;
    var t = ctx.currentTime + delay;
    var osc = ctx.createOscillator();
    var g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + duration);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.001, t + attack + decay);
    osc.connect(g);
    g.connect(masterGain);
    osc.start(t);
    osc.stop(t + attack + decay + 0.05);
    setTimeout(function () { osc.disconnect(); g.disconnect(); }, (attack + decay + delay + 0.15) * 1000);
  }

  // --- Unique sound per action ---

  function next() {
    ready();
    tone(380, 'sine', 0.12, 0.45, 0.006, 0.10, 600, 0);
    tone(600, 'sine', 0.16, 0.35, 0.006, 0.13, null, 0.09);
  }

  function back() {
    ready();
    tone(420, 'sine', 0.14, 0.38, 0.006, 0.12, 240, 0);
  }

  function begin() {
    ready();
    tone(330, 'sine', 0.14, 0.38, 0.008, 0.12, 520, 0);
    tone(520, 'sine', 0.18, 0.38, 0.008, 0.15, null, 0.10);
    tone(880, 'sine', 0.28, 0.35, 0.008, 0.22, null, 0.20);
  }

  function select() {
    ready();
    tone(950, 'square', 0.04, 0.18, 0.002, 0.03, null, 0);
    tone(1250, 'sine',  0.05, 0.25, 0.002, 0.04, null, 0.02);
  }

  function correct() {
    ready();
    tone(523.25, 'sine', 0.18, 0.42, 0.005, 0.15, null, 0);
    tone(659.25, 'sine', 0.18, 0.42, 0.005, 0.15, null, 0.07);
    tone(783.99, 'sine', 0.24, 0.42, 0.005, 0.20, null, 0.14);
    tone(1046.50,'sine', 0.32, 0.38, 0.008, 0.26, null, 0.22);
  }

  function incorrect() {
    ready();
    tone(180, 'sawtooth', 0.22, 0.22, 0.008, 0.19, 95, 0);
    tone(186, 'sawtooth', 0.22, 0.18, 0.008, 0.19, 98, 0);
  }

  function hover() {
    if (!ctx || isMuted) return;
    tone(1600, 'sine', 0.03, 0.07, 0.002, 0.025, null, 0);
  }

  function tick() {
    ready();
    tone(680, 'triangle', 0.03, 0.18, 0.002, 0.025, null, 0);
  }

  function confirm() {
    ready();
    tone(860,  'sine', 0.08, 0.36, 0.005, 0.07, null, 0);
    tone(1080, 'sine', 0.10, 0.28, 0.005, 0.08, null, 0.06);
  }

  function celebrate() {
    ready();
    var seq = [523.25, 659.25, 783.99, 1046.50];
    for (var i = 0; i < seq.length; i++) {
      tone(seq[i], 'sine', 0.38, 0.38, 0.008, 0.32, null, i * 0.13);
    }
    setTimeout(function () {
      tone(659.25,  'sine', 0.48, 0.28, 0.008, 0.40, null, 0);
      tone(783.99,  'sine', 0.48, 0.28, 0.008, 0.40, null, 0);
      tone(1046.50, 'sine', 0.56, 0.26, 0.008, 0.48, null, 0.08);
    }, 500);
  }

  function toggleMute() {
    isMuted = !isMuted;
    if (masterGain) {
      masterGain.gain.setTargetAtTime(isMuted ? 0 : VOL, ctx.currentTime, 0.1);
    }
    return isMuted;
  }

  return {
    next: next,
    back: back,
    begin: begin,
    select: select,
    correct: correct,
    incorrect: incorrect,
    hover: hover,
    tick: tick,
    confirm: confirm,
    celebrate: celebrate,
    toggleMute: toggleMute,
    ready: ready
  };
})();