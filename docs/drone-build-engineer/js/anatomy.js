export class AnatomyExplorer {
  constructor(container, anatomyData) {
    this.container = container;
    this.anatomyData = anatomyData;
    this.activeDevice = "Racing";
    this.activePartIndex = null;
  }

  render(deviceType = this.activeDevice) {
    this.activeDevice = deviceType;
    const profile = this.anatomyData[deviceType];
    this.container.innerHTML = `
      <div class="anatomy-toolbar">
        <button class="btn ${deviceType === "Racing" ? "btn-primary" : ""}" data-device="Racing">🏁 Racing</button>
        <button class="btn ${deviceType === "Cinematic" ? "btn-primary" : ""}" data-device="Cinematic">🎥 Cinematic</button>
        <span class="anatomy-hint">Tap a glowing marker. These are typical drone layouts; builds vary.</span>
      </div>
      <section class="anatomy-minimum" aria-label="Essential parts explanation">
        <div class="minimum-icon">${deviceType === "Racing" ? "🏁" : "🎥"}</div>
        <div>
          <p class="minimum-eyebrow">LEVEL 1 · ESSENTIAL BUILD</p>
          <h3>What is the minimum needed to build a ${deviceType === "Racing" ? "racing drone" : "cinematic drone"}?</h3>
          <p>${deviceType === "Racing"
            ? "A basic racing drone needs a frame, flight controller (FC), electronic speed controller (ESC), motors, propellers, battery, and receiver. VTX, Action Cams, and LEDs add FPV and recording features later."
            : "A cinematic drone needs a frame, FC, ESC, motors, propellers, battery, receiver, video downlink, and a gimbal camera. GPS and obstacle avoidance add safety and smart features later."}</p>
        </div>
      </section>
      
      <!-- Added 'anatomy-3d-stage' class here for the hover boundaries -->
      <div class="anatomy-stage ${profile.silhouette}-stage ${deviceType === "Cinematic" ? "cinematic-stage" : ""} anatomy-3d-stage">
        
        <!-- Added 'drone-silhouette-3d' ID so the JavaScript can grab it for rotation -->
        <div class="anatomy-silhouette ${profile.silhouette}" id="drone-silhouette-3d">
          <img class="anatomy-illustration" src="assets/anatomy/${profile.silhouette}-exploded.svg" alt="${profile.label} illustration" draggable="false" />
          
          ${profile.parts.map((p, i) => `
            <button class="anatomy-hotspot" style="left:${p.x}%;top:${p.y}%;"
              data-index="${i}" title="${p.label}">
              <span class="hotspot-pulse"></span>
              
              <!-- Wrapped the label for better CSS contrast and centering -->
              <div class="hotspot-label-wrapper">
                <span class="hotspot-label">${p.label}</span>
              </div>

            </button>
          `).join("")}
        </div>
        
        <div class="anatomy-detail" id="anatomy-detail">
          <p class="placeholder-text">Select a glowing point on the drone to see what part lives there.</p>
        </div>
      </div>
      
      <div class="anatomy-legend">
        <h3>All parts in this ${deviceType.toLowerCase()} drone</h3>
        <div class="anatomy-legend-grid">
          ${profile.parts.map((p, i) => `<button class="legend-chip" data-index="${i}">${p.label}</button>`).join("")}
        </div>
      </div>
    `;
    this.#bindEvents(profile);
  }

  #bindEvents(profile) {
    // 1. Device Toggles
    this.container.querySelectorAll("[data-device]").forEach((btn) => {
      btn.addEventListener("click", () => this.render(btn.dataset.device));
    });

    // 2. Part Selection & Info Panel Update
    const showPart = (index) => {
      this.activePartIndex = index;
      const part = profile.parts[index];
      
      this.container.querySelectorAll(".anatomy-hotspot").forEach((h) =>
        h.classList.toggle("active", Number(h.dataset.index) === index)
      );
      
      document.getElementById("anatomy-detail").innerHTML = `
        <div class="detail-card-animate">
            <h3>${part.label}</h3>
            <p><strong>Where it really is:</strong> ${part.realLocation}</p>
            <p><strong>What it does:</strong> ${part.why}</p>
            <span class="badge">Matches "${part.type}" in Build Mode</span>
        </div>
      `;
    };

    this.container.querySelectorAll(".anatomy-hotspot, .legend-chip").forEach((el) => {
      el.addEventListener("click", () => showPart(Number(el.dataset.index)));
    });

    // 3. 3D Hover Tilt Effect Logic
    const stage = this.container.querySelector('.anatomy-3d-stage');
    const silhouette = this.container.querySelector('#drone-silhouette-3d');

    if (stage && silhouette) {
      stage.addEventListener('mousemove', (e) => {
        // Calculate the mouse position relative to the center of the drone stage
        const rect = stage.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // The divisor (35) dictates the intensity of the tilt. Lower = wilder tilt.
        const xAxis = (centerX - e.clientX) / 35;
        const yAxis = (centerY - e.clientY) / 35;
        
        silhouette.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
      });

      // Reset the drone back to flat when the mouse leaves the box
      stage.addEventListener('mouseleave', () => {
        silhouette.style.transform = `rotateY(0deg) rotateX(0deg)`;
      });
    }
  }
}