
export class AnatomyExplorer {
  constructor(container, anatomyData) {
    this.container = container;
    this.anatomyData = anatomyData;
    this.activeDevice = "Sounding";
    this.activePartIndex = null;
  }

  render(deviceType = this.activeDevice) {
    this.activeDevice = deviceType;
    const profile = this.anatomyData[deviceType];
    this.container.innerHTML = `
      <div class="anatomy-toolbar">
        <button class="btn ${deviceType === "Sounding" ? "btn-primary" : ""}" data-device="Sounding">🚀 Sounding</button>
        <button class="btn ${deviceType === "Orbital" ? "btn-primary" : ""}" data-device="Orbital">🛰️ Orbital</button>
        <span class="anatomy-hint">Tap a glowing marker or a part name. These are typical rocket layouts; real designs vary.</span>
      </div>
      <section class="anatomy-minimum" aria-label="Essential parts explanation">
        <div class="minimum-icon">${deviceType === "Sounding" ? "🚀" : "🛰️"}</div>
        <div>
          <p class="minimum-eyebrow">LEVEL 1 · ESSENTIAL BUILD</p>
          <h3>What is the minimum needed to build a ${deviceType === "Sounding" ? "sounding rocket" : "orbital rocket"}?</h3>
          <p>${deviceType === "Sounding"
            ? "A basic hobby rocket needs a nose cone, body tube, fins, a motor, propellant, an igniter, a battery, a flight computer, a recovery parachute, and a launch lug. Cameras, telemetry, and payload bays add extra features later."
            : "A basic orbital rocket needs a nose cone, two engine stages with their own fuel and oxidizer tanks, fins, avionics, a battery, a guidance system, and a heat shield. Payload bays, RCS thrusters, and solar panels add extra features later."}</p>
        </div>
      </section>
      <div class="anatomy-stage ${profile.silhouette}-stage ${deviceType === "Orbital" ? "orbital-stage" : ""}">
        <div class="anatomy-silhouette ${profile.silhouette}">
          <img class="anatomy-illustration" src="assets/anatomy/${profile.silhouette}-exploded.svg" alt="${profile.label} illustration" draggable="false" />
          ${profile.parts.map((p, i) => `
            <button class="anatomy-hotspot" style="left:${p.x}%;top:${p.y}%;"
              data-index="${i}" title="${p.label}">
              <span class="hotspot-pulse"></span><span class="hotspot-label">${p.label}</span>
            </button>
          `).join("")}
        </div>
        <div class="anatomy-detail" id="anatomy-detail">
          <p class="placeholder-text">Select a glowing point on the rocket to see what part lives there in a real design.</p>
        </div>
      </div>
      <div class="anatomy-legend">
        <h3>All parts in this ${deviceType.toLowerCase()} rocket</h3>
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
