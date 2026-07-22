// animation.js — canvas-based mechanical animation system (rAF loop, observer pattern)
export class AnimationSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.entities = [];
    this.running = false;
    this._lastT = 0;
    this._resize();
    window.addEventListener("resize", () => this._resize());
  }

  _resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * devicePixelRatio;
    this.canvas.height = rect.height * devicePixelRatio;
  }

  addEntity(entity) { this.entities.push(entity); }
  clear() { this.entities = []; }

  start() {
    if (this.running) return;
    this.running = true;
    const loop = (t) => {
      if (!this.running) return;
      const dt = Math.min((t - this._lastT) / 1000, 0.05) || 0;
      this._lastT = t;
      this._tick(dt);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  stop() { this.running = false; }

  _tick(dt) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const e of this.entities) {
      if (e.update) e.update(dt);
      if (e.draw) e.draw(ctx);
    }
  }
}

export function makeGear(x, y, radius, teeth, colorVar = "#4fd1c5") {
  let angle = 0;
  return {
    update(dt) { angle += dt * (Math.PI / 2); },
    draw(ctx) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.strokeStyle = colorVar;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < teeth; i++) {
        const a = (i / teeth) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * radius, Math.sin(a) * radius);
        ctx.lineTo(Math.cos(a) * (radius + 8), Math.sin(a) * (radius + 8));
        ctx.stroke();
      }
      ctx.restore();
    }
  };
}

export function spawnParticles(container, type, x, y, count = 8) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = type === "spark" ? "particle-spark" : "particle-dust";
    el.style.left = `${x + (Math.random() * 20 - 10)}px`;
    el.style.top = `${y + (Math.random() * 20 - 10)}px`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }
}
