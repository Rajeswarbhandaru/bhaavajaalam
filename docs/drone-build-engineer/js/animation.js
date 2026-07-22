
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

export class BackgroundGrid {
  constructor(canvas) {
    this.canvas = canvas; this.ctx = canvas.getContext("2d");
    this.offset = 0; this.running = true;
    this.#resize();
    window.addEventListener("resize", () => this.#resize());
    this.#loop();
  }
  #resize() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; }
  #loop() {
    if (!this.running) return;
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(57, 255, 143, 0.05)";
    ctx.lineWidth = 1;
    this.offset = (this.offset + 0.5) % 40;
    for (let x = this.offset; x < canvas.width; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
    for (let y = this.offset; y < canvas.height; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
    requestAnimationFrame(() => this.#loop());
  }
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
  click() { const ctx = this.#context(); if (ctx) this.#tone(880, ctx.currentTime, .05, "sine", .02); }
  place() { const ctx = this.#context(); if (ctx) { this.#tone(720, ctx.currentTime, .08, "square", .02); this.#tone(960, ctx.currentTime + .07, .1, "square", .02); } }
  error() { const ctx = this.#context(); if (ctx) { this.#tone(150, ctx.currentTime, .14, "sawtooth", .03); this.#tone(110, ctx.currentTime + .12, .18, "sawtooth", .03); } }
  countdown() { const ctx = this.#context(); if (ctx) this.#tone(800, ctx.currentTime, .1, "square", .03); }
  arming() {
    const ctx = this.#context(); if (!ctx) return;
    this.#tone(600, ctx.currentTime, 0.1, "square", 0.02);
    this.#tone(800, ctx.currentTime + 0.15, 0.15, "square", 0.02);
    this.#noise(ctx.currentTime + 0.3, 1.0, 0.01);
  }
  takeoff() {
    const ctx = this.#context(); if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 1.2);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.2);
    gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.8);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 1.9);
  }
  celebrate() { const ctx = this.#context(); if (ctx) [523,659,784,1047].forEach((f,i) => this.#tone(f, ctx.currentTime + i*.1, .26, "triangle", .045)); }
}

export class CelebrationEngine {
  constructor(overlay) { this.overlay = overlay; }
  showCustom({ title, text, icon = "🚁", scoreLabel = "Great work!", level = 1 }) {
    if (!this.overlay) return;
    const pieces = ["✨","🏁","⚡","🌟","🟩","🔶","🎊","💫","🟢","🚁","✨","🏁"];
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

  showLaunch(deviceType, score, onComplete) {
    if (!this.overlay) return;
    const icon = deviceType === "Cinematic" ? "🎥" : "🏁";

    // Instead of just static celebration, we'll do an interactive mini-game
    this.overlay.innerHTML = `
      <div class="flight-simulator-card">
        <button class="celebration-close" aria-label="Close simulator">✕</button>

        <div class="simulator-header">
           <h2>Flight Test Simulator</h2>
           <span class="badge">Score: ${score}</span>
        </div>

        <div class="flight-area" id="flight-area">
           <!-- The Drone Sprite -->
           <div id="sim-drone" class="sim-drone">
              <div class="sim-drone-body">${icon}</div>
              <div class="sim-prop prop-tl"></div>
              <div class="sim-prop prop-tr"></div>
              <div class="sim-prop prop-bl"></div>
              <div class="sim-prop prop-br"></div>
           </div>
        </div>

        <div class="remote-controller">
          <div class="d-pad d-pad-left">
             <button class="remote-btn" id="btn-up">▲</button>
             <div class="d-pad-row">
               <button class="remote-btn" id="btn-left">◀</button>
               <button class="remote-btn" id="btn-right">▶</button>
             </div>
             <button class="remote-btn" id="btn-down">▼</button>
          </div>
          <div class="remote-center">
            <div class="remote-status">LINK OK</div>
            <button class="btn btn-primary" id="btn-end-flight">Finish Flight</button>
          </div>
        </div>
      </div>`;

    this.overlay.classList.add("active");

    const close = () => { 
      this.overlay.classList.remove("active"); 
      this.overlay.innerHTML = ""; 
      if (onComplete) onComplete();
    };

    this.overlay.querySelector(".celebration-close").addEventListener("click", close);
    this.overlay.querySelector("#btn-end-flight").addEventListener("click", close);

    // Mini physics engine for the drone
    const droneEl = document.getElementById("sim-drone");
    const areaEl = document.getElementById("flight-area");

    let x = 50; // percentage
    let y = 80; // percentage
    let vx = 0;
    let vy = 0;
    let keys = { up: false, down: false, left: false, right: false };

    // Bind buttons
    const bindBtn = (id, key) => {
      const btn = document.getElementById(id);
      btn.addEventListener("mousedown", () => keys[key] = true);
      btn.addEventListener("mouseup", () => keys[key] = false);
      btn.addEventListener("mouseleave", () => keys[key] = false);
      btn.addEventListener("touchstart", (e) => { e.preventDefault(); keys[key] = true; }, {passive: false});
      btn.addEventListener("touchend", (e) => { e.preventDefault(); keys[key] = false; }, {passive: false});
    };

    bindBtn("btn-up", "up");
    bindBtn("btn-down", "down");
    bindBtn("btn-left", "left");
    bindBtn("btn-right", "right");

    // Keyboard support
    const keyMap = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", s: "down", a: "left", d: "right" };
    const keydown = (e) => { if (keyMap[e.key]) keys[keyMap[e.key]] = true; };
    const keyup = (e) => { if (keyMap[e.key]) keys[keyMap[e.key]] = false; };
    document.addEventListener("keydown", keydown);
    document.addEventListener("keyup", keyup);

    let animFrame;
    const loop = () => {
      if (!document.getElementById("sim-drone")) {
         document.removeEventListener("keydown", keydown);
         document.removeEventListener("keyup", keyup);
         return; // exited
      }

      // Acceleration
      if (keys.up) vy -= 0.6;
      if (keys.down) vy += 0.6;
      if (keys.left) vx -= 0.6;
      if (keys.right) vx += 0.6;

      // Friction / Drag
      vx *= 0.92;
      vy *= 0.92;

      x += vx;
      y += vy;

      // Boundaries
      if (x < 5) { x = 5; vx = 0; }
      if (x > 95) { x = 95; vx = 0; }
      if (y < 5) { y = 5; vy = 0; }
      if (y > 90) { y = 90; vy = 0; }

      // Calculate tilt based on velocity
      const tiltX = vx * 2; // lean into turns

      droneEl.style.left = `${x}%`;
      droneEl.style.top = `${y}%`;
      droneEl.style.transform = `translate(-50%, -50%) rotate(${tiltX}deg)`;

      animFrame = requestAnimationFrame(loop);
    };

    loop();
  }
}
