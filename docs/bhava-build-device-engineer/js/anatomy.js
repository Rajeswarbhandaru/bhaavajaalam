
// anatomy.js — Interactive "Real Device Anatomy" explorer.
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
    this.container.innerHTML = `
      <div class="anatomy-toolbar">
        <button class="btn ${deviceType === "Mobile" ? "btn-primary" : ""}" data-device="Mobile">📱 Phone</button>
        <button class="btn ${deviceType === "Laptop" ? "btn-primary" : ""}" data-device="Laptop">💻 Laptop</button>
        <span class="anatomy-hint">Tap a glowing marker or a part name. These are typical modern layouts; models vary.</span>
      </div>
      <section class="anatomy-minimum" aria-label="Essential parts explanation">
        <div class="minimum-icon">${deviceType === "Mobile" ? "📱" : "💻"}</div>
        <div>
          <p class="minimum-eyebrow">LEVEL 1 · ESSENTIAL BUILD</p>
          <h3>What is the minimum needed to build a ${deviceType.toLowerCase()}?</h3>
          <p>${deviceType === "Mobile"
            ? "A basic phone needs a motherboard, CPU, RAM, storage, battery, charging and power-management chips, display, SIM slot, firmware, and an operating system. Cameras, GPS, Wi‑Fi, speakers, and sensors add extra features later."
            : "A basic laptop needs a motherboard, CPU, RAM, storage, battery, charging and power-management chips, display, keyboard/trackpad, cooling, firmware, and an operating system. A GPU, webcam, Wi‑Fi, speakers, and Bluetooth add extra features later."}</p>
        </div>
      </section>
      <div class="anatomy-stage ${profile.silhouette}-stage ${deviceType === "Laptop" ? "laptop-stage" : ""}">
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
