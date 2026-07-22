// anatomy-2.js — Interactive "Real Device Anatomy" explorer.
// Shows where each component physically sits inside a real phone/laptop,
// as hotspots on a device silhouette, BEFORE the child tackles compatibility rules.

export class AnatomyExplorer {
  constructor(container, anatomyData) {
    this.container = container;
    this.anatomyData = anatomyData;
    this.activeDevice = "Mobile";
    this.activePartIndex = null;
  }

  render(deviceType = this.activeDevice) {
    this.activeDevice = deviceType;
    const profile = this.anatomyData[deviceType];
    const isMobile = deviceType === "Mobile";

    this.container.innerHTML = `
      <style>
        .anatomy-toolbar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .anatomy-hint {
          color: rgba(226, 232, 240, 0.72);
          font-size: 0.85rem;
        }
        .anatomy-minimum {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          padding: 16px;
          border-radius: 18px;
          background: linear-gradient(180deg, rgba(19, 25, 40, 0.9), rgba(10, 15, 28, 0.9));
          border: 1px solid rgba(148, 163, 184, 0.14);
          margin-bottom: 18px;
        }
        .minimum-icon { font-size: 1.8rem; line-height: 1; }
        .minimum-eyebrow {
          margin: 0 0 4px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.6px;
          color: #7dd3fc;
        }
        .anatomy-minimum h3 { margin: 0 0 6px; font-size: 1.05rem; color: #f8fbff; }
        .anatomy-minimum p { margin: 0; color: rgba(226, 232, 240, 0.82); line-height: 1.5; font-size: 0.92rem; }

        .anatomy-layout {
          display: grid;
          grid-template-columns: minmax(300px, 1fr) minmax(280px, 0.95fr);
          gap: 20px;
          align-items: start;
        }

        .anatomy-stage {
          position: relative;
          min-height: 560px;
          border-radius: 22px;
          background:
            radial-gradient(circle at 50% 15%, rgba(56, 189, 248, 0.12), transparent 28%),
            linear-gradient(180deg, rgba(15, 23, 42, 0.72), rgba(2, 6, 23, 0.36));
          border: 1px solid rgba(148, 163, 184, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px 10px;
        }

        .anatomy-silhouette {
          position: relative;
          z-index: 1;
          filter: drop-shadow(0 22px 28px rgba(0, 0, 0, 0.4));
          pointer-events: none;
        }

        .phone-silhouette {
          width: 240px;
          height: 470px;
          border-radius: 38px;
          background: linear-gradient(145deg, #2a2f3d, #0f1421);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 10px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -10px 30px rgba(0,0,0,0.35);
        }
        .phone-silhouette::before {
          content: "";
          position: absolute;
          top: 20px; left: 50%;
          transform: translateX(-50%);
          width: 92px; height: 22px;
          border-radius: 999px;
          background: #0c1120;
          z-index: 3;
        }
        .phone-screen-inner {
          position: relative;
          width: 100%; height: 100%;
          border-radius: 30px;
          overflow: hidden;
          background:
            radial-gradient(circle at 30% 20%, rgba(56,189,248,0.18), transparent 26%),
            radial-gradient(circle at 75% 10%, rgba(168,85,247,0.16), transparent 24%),
            linear-gradient(160deg, #1d2437, #101728 60%, #0a0f1c);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .device-label-tag {
          position: absolute;
          left: 16px; bottom: 16px;
          padding: 7px 11px;
          border-radius: 999px;
          background: rgba(8, 15, 30, 0.66);
          border: 1px solid rgba(148, 163, 184, 0.12);
          color: #eef6ff;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .laptop-silhouette {
          width: min(100%, 420px);
        }
        .laptop-lid {
          width: 100%;
          height: 280px;
          border-radius: 24px 24px 18px 18px;
          padding: 14px;
          background: linear-gradient(145deg, #2a3142, #111827);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .laptop-screen-inner {
          position: relative;
          width: 100%; height: 100%;
          border-radius: 16px;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 30%, rgba(34, 211, 238, 0.13), transparent 30%),
            linear-gradient(180deg, #1b2335, #0b1020);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .laptop-base {
          position: relative;
          width: 100%;
          height: 78px;
          margin-top: -2px;
          border-radius: 0 0 26px 26px;
          background: linear-gradient(180deg, #1a2230, #0c1220);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .laptop-keyboard {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 4px;
          padding: 14px 16px 8px;
        }
        .laptop-key {
          height: 8px;
          border-radius: 3px;
          background: linear-gradient(180deg, rgba(226,232,240,0.25), rgba(148,163,184,0.14));
          border: 1px solid rgba(255,255,255,0.04);
        }
        .laptop-trackpad {
          width: 92px; height: 22px;
          margin: 4px auto 0;
          border-radius: 12px;
          background: linear-gradient(180deg, rgba(148,163,184,0.18), rgba(255,255,255,0.06));
          border: 1px solid rgba(255,255,255,0.05);
        }

        .anatomy-hotspot {
          position: absolute;
          width: 38px; height: 38px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          cursor: pointer;
          padding: 0;
          transform: translate(-50%, -50%);
          z-index: 20;
          pointer-events: auto;
        }
        .hotspot-pulse {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          border: 2px solid rgba(125, 211, 252, 0.7);
          animation: anatomyPulse 1.8s ease-in-out infinite;
        }
        .anatomy-hotspot::after {
          content: "";
          position: absolute;
          inset: 7px;
          border-radius: 999px;
          background: radial-gradient(circle at 35% 35%, #f8fbff, #22d3ee 28%, #0891b2 74%);
          box-shadow: 0 0 0 6px rgba(34, 211, 238, 0.16), 0 0 18px rgba(34, 211, 238, 0.5);
        }
        .anatomy-hotspot.active::after {
          background: radial-gradient(circle at 35% 35%, #fff8cc, #f59e0b 28%, #d97706 74%);
          box-shadow: 0 0 0 8px rgba(245, 158, 11, 0.18), 0 0 22px rgba(245, 158, 11, 0.65);
        }
        .anatomy-hotspot.active .hotspot-pulse { border-color: rgba(245, 158, 11, 0.9); }
        .hotspot-label {
          position: absolute;
          left: 50%; top: 100%;
          transform: translate(-50%, 10px);
          white-space: nowrap;
          font-size: 0.72rem;
          color: rgba(226, 232, 240, 0.92);
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
          pointer-events: none;
        }
        @keyframes anatomyPulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.18); opacity: 0.35; }
        }

        .anatomy-detail {
          padding: 18px;
          border-radius: 20px;
          background: linear-gradient(180deg, rgba(19, 25, 40, 0.95), rgba(10, 15, 28, 0.95));
          border: 1px solid rgba(148, 163, 184, 0.14);
          min-height: 200px;
        }
        .anatomy-detail h3 { margin: 0 0 8px; color: #f8fbff; }
        .anatomy-detail p { margin: 0 0 10px; color: rgba(226,232,240,0.85); line-height: 1.5; }
        .anatomy-detail .badge {
          display: inline-block;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(34, 211, 238, 0.14);
          border: 1px solid rgba(34, 211, 238, 0.3);
          color: #dff8ff;
          font-size: 0.8rem;
          font-weight: 700;
        }
        .placeholder-text { color: rgba(226,232,240,0.7); }

        .anatomy-legend { margin-top: 18px; }
        .anatomy-legend h3 { margin: 0 0 10px; color: #f8fbff; font-size: 1rem; }
        .anatomy-legend-grid { display: flex; flex-wrap: wrap; gap: 10px; }
        .legend-chip {
          appearance: none;
          border: 1px solid rgba(148, 163, 184, 0.16);
          background: rgba(15, 23, 42, 0.72);
          color: #e2e8f0;
          padding: 10px 12px;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
        }
        .legend-chip.active {
          border-color: rgba(34, 211, 238, 0.48);
          background: rgba(34, 211, 238, 0.12);
          color: #f8fbff;
        }

        @media (max-width: 900px) {
          .anatomy-layout { grid-template-columns: 1fr; }
        }
      </style>

      <div class="anatomy-toolbar">
        <button class="btn ${deviceType === "Mobile" ? "btn-primary" : ""}" data-device="Mobile">📱 Phone</button>
        <button class="btn ${deviceType === "Laptop" ? "btn-primary" : ""}" data-device="Laptop">💻 Laptop</button>
        <span class="anatomy-hint">Tap a glowing marker or a part name. These are typical modern layouts; models vary.</span>
      </div>

      <section class="anatomy-minimum" aria-label="Essential parts explanation">
        <div class="minimum-icon">${isMobile ? "📱" : "💻"}</div>
        <div>
          <p class="minimum-eyebrow">LEVEL 1 · ESSENTIAL BUILD</p>
          <h3>What is the minimum needed to build a ${deviceType.toLowerCase()}?</h3>
          <p>${isMobile
            ? "A basic phone needs a motherboard, CPU, RAM, storage, battery, charging and power-management chips, display, SIM slot, firmware, and an operating system. Cameras, GPS, Wi‑Fi, speakers, and sensors add extra features later."
            : "A basic laptop needs a motherboard, CPU, RAM, storage, battery, charging and power-management chips, display, keyboard/trackpad, cooling, firmware, and an operating system. A GPU, webcam, Wi‑Fi, speakers, and Bluetooth add extra features later."}</p>
        </div>
      </section>

      <div class="anatomy-layout">
        <div class="anatomy-stage">
          <div class="anatomy-silhouette ${profile.silhouette}-silhouette">
            ${
              isMobile
                ? `
                  <div class="phone-screen-inner">
                    <div class="device-label-tag">${profile.label || "Smartphone"}</div>
                  </div>
                `
                : `
                  <div class="laptop-lid">
                    <div class="laptop-screen-inner">
                      <div class="device-label-tag">${profile.label || "Laptop"}</div>
                    </div>
                  </div>
                  <div class="laptop-base">
                    <div class="laptop-keyboard">
                      ${Array.from({ length: 30 }).map(() => `<span class="laptop-key"></span>`).join("")}
                    </div>
                    <div class="laptop-trackpad"></div>
                  </div>
                `
            }
            ${profile.parts.map((p, i) => `
              <button class="anatomy-hotspot" style="left:${p.x}%;top:${p.y}%;"
                data-index="${i}" title="${p.label}">
                <span class="hotspot-pulse"></span><span class="hotspot-label">${p.label}</span>
              </button>
            `).join("")}
          </div>
        </div>

        <div class="anatomy-detail" id="anatomy-detail">
          <p class="placeholder-text">Select a glowing point on the ${deviceType.toLowerCase()} to see what part lives there in a real device.</p>
        </div>
      </div>

      <div class="anatomy-legend">
        <h3>All parts in this ${deviceType.toLowerCase()}</h3>
        <div class="anatomy-legend-grid">
          ${profile.parts.map((p, i) => `<button class="legend-chip" data-index="${i}">${p.label}</button>`).join("")}
        </div>
      </div>
    `;
    this.#bindEvents(profile);
  }

  #bindEvents(profile) {
    this.container.querySelectorAll("[data-device]").forEach((btn) => {
      btn.addEventListener("click", () => this.render(btn.dataset.device));
    });
    const showPart = (index) => {
      this.activePartIndex = index;
      const part = profile.parts[index];
      this.container.querySelectorAll(".anatomy-hotspot").forEach((h) =>
        h.classList.toggle("active", Number(h.dataset.index) === index)
      );
      this.container.querySelectorAll(".legend-chip").forEach((c) =>
        c.classList.toggle("active", Number(c.dataset.index) === index)
      );
      document.getElementById("anatomy-detail").innerHTML = `
        <h3>${part.label}</h3>
        <p><strong>Where it really is:</strong> ${part.realLocation}</p>
        <p><strong>What it does:</strong> ${part.why}</p>
        <span class="badge">Matches "${part.type}" in Build Mode</span>
      `;
    };
    this.container.querySelectorAll(".anatomy-hotspot, .legend-chip").forEach((el) => {
      el.addEventListener("click", () => showPart(Number(el.dataset.index)));
    });
  }
}