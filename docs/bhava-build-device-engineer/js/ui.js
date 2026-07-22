
export class UIManager {
  constructor(bus) {
    this.bus = bus;
    this.screens = document.querySelectorAll(".screen");
    this.modalOverlay = document.getElementById("modal-overlay");
    this.modalBox = document.getElementById("modal-box");
    this.toastContainer = document.getElementById("toast-container");
    this.#bindGlobalNav();
    this.#bindModalClose();
  }
  #bindGlobalNav() {
    document.querySelectorAll("[data-nav]").forEach((el) => {
      el.addEventListener("click", () => this.navigate(el.dataset.nav));
    });
  }
  #bindModalClose() {
    this.modalOverlay.addEventListener("click", (e) => { if (e.target === this.modalOverlay) this.closeModal(); });
  }
  navigate(target) {
    const map = {
      "home": "screen-home", "build-mobile": "screen-build", "build-laptop": "screen-build",
      "how-it-works": "screen-learn", "laboratory": "screen-lab", "challenges": "screen-challenges",
      "achievements": "screen-achievements", "settings": "screen-settings", "progress": "screen-progress",
      "glossary": "screen-glossary", "daily": "screen-daily", "continue": "screen-build",
      "anatomy": "screen-anatomy"
    };
    const screenId = map[target] || "screen-home";
    this.screens.forEach((s) => s.classList.remove("active"));
    document.getElementById(screenId).classList.add("active");
    this.bus.emit("nav:changed", { target, screenId });
  }
  toast(message, type = "info", duration = 3200) {
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.textContent = message;
    this.toastContainer.appendChild(el);
    setTimeout(() => el.remove(), duration);
  }
  openModal(html) { this.modalBox.innerHTML = html; this.modalOverlay.classList.add("active"); }
  closeModal() { this.modalOverlay.classList.remove("active"); this.modalBox.innerHTML = ""; }

  renderPaletteTabs(container, types, activeType, onSelect) {
    container.innerHTML = types.map((t) =>
      `<button class="palette-tab ${t === activeType ? "active" : ""}" data-type="${t}">${t}</button>`
    ).join("");
    container.querySelectorAll(".palette-tab").forEach((btn) => {
      btn.addEventListener("click", () => onSelect(btn.dataset.type));
    });
  }
  renderPaletteItem(component) {
    const el = document.createElement("div");
    el.className = "palette-item";
    el.innerHTML = `
      <div><strong>${component.name}</strong>
      <small>Power ${component.power}W · Heat ${component.heat} · ₹${component.cost}</small></div>
      <span>➕</span>`;
    return el;
  }
  renderSlot(slotDef) {
    const el = document.createElement("div");
    el.className = "slot";
    el.dataset.slot = slotDef.slot;
    el.innerHTML = `<span class="slot-label">${slotDef.slot}${slotDef.required ? " *" : ""}</span><span class="slot-empty-text">Drop here</span>`;
    return el;
  }
  fillSlot(slotEl, component) {
    slotEl.classList.add("filled");
    slotEl.classList.remove("error");
    slotEl.innerHTML = `
      <span class="slot-label">${slotEl.dataset.slot}</span>
      <button class="slot-remove" title="Remove">✕</button>
      <strong>${component.name}</strong>
      <small>₹${component.cost} · ${component.power}W</small>`;
  }
  markSlotError(slotEl) { slotEl.classList.add("error"); }
  emptySlot(slotEl) {
    slotEl.classList.remove("filled", "error");
    slotEl.innerHTML = `<span class="slot-label">${slotEl.dataset.slot}</span><span class="slot-empty-text">Drop here</span>`;
  }
  renderStatChip(label, value, level = "ok") {
    const el = document.createElement("div");
    el.className = `stat-chip ${level !== "ok" ? level : ""}`;
    el.innerHTML = `<span class="label">${label}</span><span class="val">${value}</span>`;
    return el;
  }
}
