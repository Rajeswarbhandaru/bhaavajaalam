
export class AnimationEngine {
  constructor(svgLayer) { this.svg = svgLayer; }
  drawWire(fromEl, toEl, colorVar = "--accent-1") {
    if (!fromEl || !toEl || !this.svg) return;
    const boardRect = this.svg.getBoundingClientRect();
    const a = fromEl.getBoundingClientRect();
    const b = toEl.getBoundingClientRect();
    const x1 = a.left + a.width / 2 - boardRect.left;
    const y1 = a.top + a.height / 2 - boardRect.top;
    const x2 = b.left + b.width / 2 - boardRect.left;
    const y2 = b.top + b.height / 2 - boardRect.top;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const midX = (x1 + x2) / 2;
    const d = `M ${x1},${y1} Q ${midX},${(y1 + y2) / 2} ${x2},${y2}`;
    path.setAttribute("d", d);
    path.setAttribute("class", "wire-path");
    path.setAttribute("stroke", `var(${colorVar})`);
    path.setAttribute("stroke-width", "2");
    path.setAttribute("fill", "none");
    path.setAttribute("opacity", "0.75");
    this.svg.appendChild(path);
    return path;
  }
  clearWires() { if (this.svg) this.svg.innerHTML = ""; }
  spawnParticles(targetEl, count = 8, colorVar = "--accent-1") {
    const rect = targetEl.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.left = `${rect.left + rect.width / 2 + (Math.random() * 30 - 15)}px`;
      p.style.top = `${rect.top + rect.height / 2}px`;
      p.style.position = "fixed";
      p.style.background = `var(${colorVar})`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1400);
    }
  }
}

export class BackgroundStars {
  constructor(canvas) {
    this.canvas = canvas; this.ctx = canvas.getContext("2d");
    this.stars = []; this.running = true;
    this.#resize();
    window.addEventListener("resize", () => this.#resize());
    this.#initStars(); this.#loop();
  }
  #resize() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; }
  #initStars() {
    const count = Math.floor((window.innerWidth * window.innerHeight) / 6000);
    this.stars = Array.from({ length: count }, () => ({
      x: Math.random() * this.canvas.width, y: Math.random() * this.canvas.height,
      r: Math.random() * 1.6 + 0.3, tw: Math.random() * Math.PI * 2, speed: Math.random() * 0.02 + 0.01
    }));
  }
  #loop() {
    if (!this.running) return;
    const { ctx, canvas, stars } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((s) => {
      s.tw += s.speed;
      const alpha = 0.4 + Math.sin(s.tw) * 0.4;
      ctx.fillStyle = `rgba(160,210,255,${Math.max(0.05, alpha)})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    });
    requestAnimationFrame(() => this.#loop());
  }
  stop() { this.running = false; }
}

export class SoundEngine {
  constructor() { this.ctx = null; this.enabled = true; }
  async unlock() {
    const ctx = this.#context();
    if (ctx && ctx.state === "suspended") await ctx.resume();
    return Boolean(ctx);
  }
  #context() {
    if (!this.enabled) return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) this.ctx = new AudioCtx();
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }
  #tone(freq, start, duration, type = "sine", volume = 0.04) {
    const ctx = this.#context();
    if (!ctx) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type; oscillator.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain); gain.connect(ctx.destination);
    oscillator.start(start); oscillator.stop(start + duration + 0.03);
  }
  #noise(start, duration, volume = 0.05) {
    const ctx = this.#context();
    if (!ctx) return;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const src = ctx.createBufferSource(); src.buffer = buffer;
    const gain = ctx.createGain(); gain.gain.setValueAtTime(volume, start);
    src.connect(gain); gain.connect(ctx.destination);
    src.start(start);
  }
  click() { const ctx = this.#context(); if (ctx) this.#tone(480, ctx.currentTime, .06, "sine", .022); }
  place() { const ctx = this.#context(); if (ctx) { this.#tone(520, ctx.currentTime, .08, "triangle", .035); this.#tone(760, ctx.currentTime + .07, .11, "triangle", .03); } }
  error() { const ctx = this.#context(); if (ctx) { this.#tone(180, ctx.currentTime, .14, "sawtooth", .025); this.#tone(145, ctx.currentTime + .12, .18, "sawtooth", .02); } }
  countdown() { const ctx = this.#context(); if (ctx) this.#tone(700, ctx.currentTime, .1, "square", .03); }
  ignition() {
    const ctx = this.#context(); if (!ctx) return;
    this.#noise(ctx.currentTime, 1.3, .09);
    [80,110,150].forEach((f,i) => this.#tone(f, ctx.currentTime + i*.05, 1.1, "sawtooth", .035));
  }
  liftoff() {
    const ctx = this.#context(); if (!ctx) return;
    this.#noise(ctx.currentTime, 1.6, .07);
    [200,280,360,460].forEach((f,i) => this.#tone(f, ctx.currentTime + i*.1, .3, "sine", .03));
  }
  celebrate() { const ctx = this.#context(); if (ctx) [523,659,784,1047].forEach((f,i) => this.#tone(f, ctx.currentTime + i*.1, .26, "triangle", .045)); }
}

export class CelebrationEngine {
  constructor(overlay) { this.overlay = overlay; }
  showCustom({ title, text, icon = "🚀", scoreLabel = "Great work!", level = 1 }) {
    if (!this.overlay) return;
    const pieces = ["✨","🎉","🔥","🌟","💫","🟡","🎊","⭐","🚀","✨","🎉","🔥"];
    this.overlay.innerHTML = `
      <div class="celebration-card level-${level}">
        <button class="celebration-close" aria-label="Close celebration">✕</button>
        <div class="confetti-field">${pieces.map((p,i) => `<span style="--i:${i};--x:${(i*37)%96}%">${p}</span>`).join("")}</div>
        <div class="built-device badge-device"><span>${icon}</span><i class="device-scan"></i></div>
        <p class="celebration-kicker">LEVEL ${level} COMPLETE</p>
        <h2>${title}</h2>
        <p>${text}</p>
        <div class="celebration-score">${scoreLabel}</div>
        <button class="btn btn-primary celebration-done">Awesome!</button>
      </div>`;
    this.overlay.classList.add("active");
    const close = () => { this.overlay.classList.remove("active"); this.overlay.innerHTML = ""; };
    this.overlay.querySelector(".celebration-close").addEventListener("click", close);
    this.overlay.querySelector(".celebration-done").addEventListener("click", close);
  }
  showLaunch(rocketType, score) {
    if (!this.overlay) return;
    const pieces = ["✨","🎉","🔥","🌟","💫","🟡","🎊","⭐","🚀","✨","🎉","🔥"];
    this.overlay.innerHTML = `
      <div class="celebration-card launch-card">
        <button class="celebration-close" aria-label="Close celebration">✕</button>
        <div class="confetti-field">${pieces.map((p,i) => `<span style="--i:${i};--x:${(i*37)%96}%">${p}</span>`).join("")}</div>
        <div class="launch-pad">
          <div class="rocket-flying"><div class="flame"></div><span>🚀</span></div>
          <div class="smoke-cloud"></div>
        </div>
        <p class="celebration-kicker">LAUNCH SUCCESSFUL</p>
        <h2>${rocketType === "Orbital" ? "Orbit Reached!" : "We Have Liftoff!"}</h2>
        <p>Your rocket flew perfectly and completed its mission.</p>
        <div class="celebration-score">⚡ ${score} Engineering Score</div>
        <button class="btn btn-primary celebration-done">Build Again</button>
      </div>`;
    this.overlay.classList.add("active");
    const close = () => { this.overlay.classList.remove("active"); this.overlay.innerHTML = ""; };
    this.overlay.querySelector(".celebration-close").addEventListener("click", close);
    this.overlay.querySelector(".celebration-done").addEventListener("click", close);
  }
}
