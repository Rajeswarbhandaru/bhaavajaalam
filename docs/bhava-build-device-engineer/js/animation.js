
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

export class BackgroundMotherboard {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.nodes = [];
    this.running = true;
    this.#resize();
    window.addEventListener("resize", () => this.#resize());
    this.#initNodes();
    this.#loop();
  }
  #resize() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; }
  #initNodes() {
    const count = Math.floor((window.innerWidth * window.innerHeight) / 26000);
    this.nodes = Array.from({ length: count }, () => ({
      x: Math.random() * this.canvas.width, y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3
    }));
  }
  #loop() {
    if (!this.running) return;
    const { ctx, canvas, nodes } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(110,231,255,0.12)";
    ctx.fillStyle = "rgba(139,92,246,0.5)";
    nodes.forEach((n) => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.globalAlpha = 1 - dist / 140;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    nodes.forEach((n) => { ctx.beginPath(); ctx.arc(n.x, n.y, 2, 0, Math.PI * 2); ctx.fill(); });
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
  click() { const ctx = this.#context(); if (ctx) this.#tone(480, ctx.currentTime, .06, "sine", .022); }
  place() { const ctx = this.#context(); if (ctx) { this.#tone(520, ctx.currentTime, .08, "triangle", .035); this.#tone(760, ctx.currentTime + .07, .11, "triangle", .03); } }
  error() { const ctx = this.#context(); if (ctx) { this.#tone(180, ctx.currentTime, .14, "sawtooth", .025); this.#tone(145, ctx.currentTime + .12, .18, "sawtooth", .02); } }
  boot() { const ctx = this.#context(); if (ctx) [240,320,420,560].forEach((f,i) => this.#tone(f, ctx.currentTime + i*.12, .12, "sine", .03)); }
  celebrate() { const ctx = this.#context(); if (ctx) [523,659,784,1047].forEach((f,i) => this.#tone(f, ctx.currentTime + i*.1, .26, "triangle", .045)); }
}

export class CelebrationEngine {
  constructor(overlay) { this.overlay = overlay; }
  showCustom({ title, text, icon = "🎉", scoreLabel = "Great work!", level = 1 }) {
    if (!this.overlay) return;
    const pieces = ["✨","🎉","⚡","🌟","💜","🔷","🎊","💫","🟡","🚀","✨","🎉"];
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

  show(deviceType, score, level) {
    if (!this.overlay) return;
    const icon = deviceType === "Laptop" ? "💻" : "📱";
    const title = deviceType === "Laptop" ? "Laptop Online!" : "Phone Online!";
    const pieces = ["✨","🎉","⚡","🌟","💜","🔷","🎊","💫","🟡","🚀","✨","🎉"];
    this.overlay.innerHTML = `
      <div class="celebration-card">
        <button class="celebration-close" aria-label="Close celebration">✕</button>
        <div class="confetti-field">${pieces.map((p,i) => `<span style="--i:${i};--x:${(i*37)%96}%">${p}</span>`).join("")}</div>
        <div class="built-device ${deviceType.toLowerCase()}"><span>${icon}</span><i class="device-scan"></i></div>
        <p class="celebration-kicker">BUILD COMPLETE</p>
        <h2>${title}</h2>
        <p>Your Level ${level} build passed the boot test.</p>
        <div class="celebration-score">⚡ ${score} Engineering Score</div>
        <button class="btn btn-primary celebration-done">Keep Building</button>
      </div>`;
    this.overlay.classList.add("active");
    const close = () => { this.overlay.classList.remove("active"); this.overlay.innerHTML = ""; };
    this.overlay.querySelector(".celebration-close").addEventListener("click", close);
    this.overlay.querySelector(".celebration-done").addEventListener("click", close);
  }
}
