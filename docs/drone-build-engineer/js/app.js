
import { EventBus, DataStore, GameState, DroneFactory } from "./engine.js";
import { UIManager } from "./ui.js";
import { DragDropController } from "./dragdrop.js";
import { CompatibilityEngine, SimulationEngine } from "./simulation.js";
import { DiagnosticsPanel } from "./diagnostics.js";
import { ScoringEngine } from "./scoring.js";
import { AnimationEngine, BackgroundGrid, SoundEngine, CelebrationEngine } from "./animation.js";
import { DeviceMatchEngine } from "./devicematch.js";
import { AnatomyExplorer } from "./anatomy.js";
import { racingSVG } from "./svg_racing.js";
import { cinematicSVG } from "./svg_cinematic.js";

class App {
  constructor() {
    this.bus = new EventBus();
    this.dataStore = new DataStore();
    this.state = new GameState(this.bus);
    this.ui = new UIManager(this.bus);
    this.drone = DroneFactory.create("Racing");
    this.activePaletteType = "Frame";
    this.buildLevel = 1;
    this.sound = new SoundEngine();
    this.sound.enabled = this.state.data.settings.sound !== false;
  }

  async init() {
    this.#applySettings();
    this.#initBackground();

    const [components, compatibility, lessons, scenarios, achievements, glossary, profiles, anatomy] = await Promise.all([
      this.dataStore.load("components", "data/components.json"),
      this.dataStore.load("compatibility", "data/compatibility.json"),
      this.dataStore.load("lessons", "data/lessons.json"),
      this.dataStore.load("scenarios", "data/scenarios.json"),
      this.dataStore.load("achievements", "data/achievements.json"),
      this.dataStore.load("glossary", "data/glossary.json"),
      this.dataStore.load("deviceProfiles", "data/device_profiles.json"),
      this.dataStore.load("anatomy", "data/anatomy.json")
    ]);
    this.deviceMatch = new DeviceMatchEngine(profiles.profiles);
    this.anatomyExplorer = new AnatomyExplorer(document.getElementById("anatomy-container"), anatomy);
    this.anatomyExplorer.render("Racing");

    this.components = components.components;
    this.compat = new CompatibilityEngine(compatibility.rules, compatibility.failureEffects);
    this.simulation = new SimulationEngine(this.compat, this.bus);
    this.diagnosticsPanel = new DiagnosticsPanel(document.getElementById("diagnostics-content"));
    this.diagnosticsPanel.clear();

    this.dnd = new DragDropController({ onDrop: (slotKey, payload) => this.#handleDrop(slotKey, payload) });
    this.svgLayer = document.getElementById("wire-layer");
    this.animEngine = new AnimationEngine(this.svgLayer);
    this.celebration = new CelebrationEngine(document.getElementById("celebration-overlay"));

    this.#buildPalette();
    this.#switchDeviceType("Racing");
    this.#bindBuildLevels();
    this.#updateLevelProgress();
    this.#renderLearn(lessons.lessons);
    this.#renderMissions(scenarios.missions);
    this.#renderAchievements(achievements.achievements);
    this.#renderGlossary(glossary.terms);
    this.#renderProgress();
    this.#renderDaily(scenarios.missions);

    this.#bindTopbar();
    this.#bindBuildToolbar();
    this.#bindStateEvents();
    this.#bindSettings();
    this.#bindFriendlyClickSounds();

    this.bus.on("nav:changed", ({ target }) => {
      if (target === "build-cinematic") this.#switchDeviceType("Cinematic");
      if (target === "build-racing") this.#switchDeviceType("Racing");
    });

    this.ui.toast("Welcome back, Chief Pilot!", "success");
  }

  #applySettings() {
    const s = this.state.data.settings;
    document.documentElement.setAttribute("data-theme", s.theme);
    document.body.classList.toggle("colorblind-mode", s.colorblind);
    document.body.classList.toggle("reduce-motion", s.reduceMotion);
    document.documentElement.style.setProperty("--font-scale", s.largeFont ? "1.2" : "1");
    document.getElementById("xp-value").textContent = `${this.state.data.xp} XP`;
    document.getElementById("rank-value").textContent = this.state.data.rank;
    const themeSel = document.getElementById("setting-theme"); if (themeSel) themeSel.value = s.theme;
    const cb = document.getElementById("setting-colorblind"); if (cb) cb.checked = s.colorblind;
    const lf = document.getElementById("setting-largefont"); if (lf) lf.checked = s.largeFont;
    const rm = document.getElementById("setting-reducemotion"); if (rm) rm.checked = s.reduceMotion;
    const soundBtn = document.getElementById("sound-toggle");
    if (soundBtn) {
      const on = s.sound !== false;
      soundBtn.textContent = on ? "🔊" : "🔇";
      soundBtn.title = on ? "Sound: On" : "Sound: Off";
      soundBtn.classList.toggle("muted", !on);
    }
  }

  #initBackground() { this.bg = new BackgroundGrid(document.getElementById("bg-canvas")); }

  #switchDeviceType(typeName) {
    this.drone = DroneFactory.create(typeName);
    const icon = typeName === "Cinematic" ? "🎥" : "🏁";
    document.getElementById("device-title").textContent = `${icon} New ${typeName} Drone`;

    const visContainer = document.getElementById("visual-drone-container");
    if (visContainer) {
      visContainer.innerHTML = typeName === "Racing" ? racingSVG : cinematicSVG;
      // Initialize base frame to active
      const frameLayer = document.getElementById("vis-Frame");
      if (frameLayer) frameLayer.classList.add("active");
    }

    this.#buildSlots();
    this.#updateLevelProgress();
    this.diagnosticsPanel.clear();
    this.animEngine.clearWires();
    if (!this.state.data.seenAnatomyHint) {
      this.ui.toast("New here? Check 'Real Drone Anatomy' first!", "info", 5000);
      this.state.data.seenAnatomyHint = true;
      this.state.persist();
    }
  }

  #bindFriendlyClickSounds() {
    document.addEventListener("pointerdown", () => this.sound.unlock(), { once: true });
    document.addEventListener("click", (event) => {
      const target = event.target.closest("button, .palette-tab, .legend-chip, .home-card");
      if (!target || target.closest("#celebration-overlay") || target.closest(".palette-item") || target.id === "btn-power" || target.id === "btn-check-level") return;
      this.sound.click();
    });
  }

  #bindBuildLevels() {
    const panel = document.getElementById("build-levels");
    if (!panel) return;
    panel.querySelectorAll(".build-level").forEach((button) => {
      button.addEventListener("click", () => {
        this.buildLevel = Number(button.dataset.level);
        this.sound.click();
        panel.querySelectorAll(".build-level").forEach((item) => item.classList.toggle("active", item === button));
        this.#updateLevelProgress();
        this.ui.toast(`Level ${this.buildLevel} selected.`, "info");
      });
    });
  }

  #getLevelStatus() {
    const slots = this.drone.slotSchema;
    const installed = this.drone.installed;
    const required = slots.filter((slot) => slot.required);
    const installedRequired = required.filter((slot) => installed[slot.slot]);
    const installedAll = slots.filter((slot) => installed[slot.slot]);
    const missingRequired = required.filter((slot) => !installed[slot.slot]).map((slot) => slot.slot);
    const missingAll = slots.filter((slot) => !installed[slot.slot]).map((slot) => slot.slot);
    const issues = this.buildLevel === 3 ? this.compat.evaluate(installed) : [];
    return { slots, required, installedRequired, installedAll, missingRequired, missingAll, issues };
  }

  #updateLevelProgress() {
    const progress = document.getElementById("level-progress");
    if (!progress) return;
    const status = this.#getLevelStatus();
    if (this.buildLevel === 1) progress.textContent = `L1 progress: ${status.installedRequired.length} / ${status.required.length} core parts`;
    else if (this.buildLevel === 2) progress.textContent = `L2 progress: ${status.installedAll.length} / ${status.slots.length} available parts`;
    else progress.textContent = `L3 status: ${status.installedRequired.length} / ${status.required.length} core · ${status.issues.length} issue(s)`;
  }

  #checkBuildLevel() {
    const status = this.#getLevelStatus();
    const name = this.drone.typeName.toLowerCase();
    if (this.buildLevel === 1) {
      if (status.missingRequired.length === 0) { this.state.addXP(25); this.sound.celebrate(); this.celebration.showCustom({ title: "Basic Drone Built!", text: `Launch-ready ${name} drone from core parts.`, scoreLabel: `+25 XP` }); }
      else { this.sound.error(); this.ui.toast(`Missing: ${status.missingRequired.join(", ")}`, "error"); }
    } else if (this.buildLevel === 2) {
      if (status.missingAll.length === 0) { this.state.addXP(45); this.sound.celebrate(); this.celebration.showCustom({ title: "Feature Master!", text: `Every feature installed.`, scoreLabel: `+45 XP` }); }
      else { this.sound.click(); this.ui.toast(`Missing: ${status.missingAll.join(", ")}`, "info"); }
    } else {
      if (status.missingRequired.length > 0) { this.sound.error(); this.ui.toast(`Missing core parts.`, "error"); }
      else if (status.issues.length > 0) { this.sound.error(); this.ui.toast(`Incompatible: ${status.issues[0].message}`, "error"); }
      else { this.state.addXP(70); this.sound.celebrate(); this.celebration.showCustom({ title: "Smart Engineer!", text: `Zero compatibility issues.`, scoreLabel: "+70 XP" }); }
    }
  }

  #buildPalette() {
    const types = [...new Set(this.components.map((c) => c.type))];
    const tabs = document.getElementById("palette-tabs");
    const list = document.getElementById("palette-list");
    const renderList = (type) => {
      list.innerHTML = "";
      this.components.filter((c) => c.type === type).forEach((comp) => {
        const el = this.ui.renderPaletteItem(comp);
        this.dnd.makeDraggable(el, comp);
        list.appendChild(el);
      });
    };
    const selectType = (type) => {
      this.activePaletteType = type;
      this.ui.renderPaletteTabs(tabs, types, type, selectType);
      renderList(type);
    };
    this.ui.renderPaletteTabs(tabs, types, this.activePaletteType, selectType);
    renderList(this.activePaletteType);
  }

  #buildSlots() {
    const container = document.getElementById("slot-container");
    container.innerHTML = "";
    this.drone.slotSchema.forEach((slotDef) => {
      const slotEl = this.ui.renderSlot(slotDef);
      this.dnd.makeDropTarget(slotEl, slotDef.slot);
      container.appendChild(slotEl);
    });
  }

  #handleDrop(slotKey, component) {
    if (component.type !== slotKey) { this.sound.error(); this.ui.toast(`Wrong slot for ${component.name}.`, "error"); return; }
    this.drone.install(slotKey, component);
    const slotEl = document.querySelector(`.slot[data-slot="${slotKey}"]`);
    this.ui.fillSlot(slotEl, component);
    this.ui.toast(`${component.name} installed.`, "success");
    this.sound.place();
    this.animEngine.spawnParticles(slotEl, 12, "--accent-5");

    // Animate the part onto the visual drone SVG
    const visLayer = document.getElementById(`vis-${slotKey}`);
    if (visLayer) {
      visLayer.classList.remove("animate-in");
      void visLayer.offsetWidth; // Trigger reflow
      visLayer.classList.add("active", "animate-in");
    }

    this.#drawAllWires();
    this.#updateLevelProgress();
    this.#bindRemoveButtons();
  }

  #bindRemoveButtons() {
    document.querySelectorAll(".slot-remove").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const slotEl = btn.closest(".slot");
        const slotKey = slotEl.dataset.slot;
        delete this.drone.installed[slotKey];
        const slotDef = this.drone.slotSchema.find((s) => s.slot === slotKey);
        const fresh = this.ui.renderSlot(slotDef);
        slotEl.replaceWith(fresh);
        this.dnd.makeDropTarget(fresh, slotKey);
        this.sound.click();

        // Remove from visual drone SVG
        const visLayer = document.getElementById(`vis-${slotKey}`);
        if (visLayer && slotKey !== "Frame") {
          visLayer.classList.remove("active", "animate-in");
        }

        this.#drawAllWires();
        this.#updateLevelProgress();
      };
    });
  }

  #drawAllWires() {
    this.animEngine.clearWires();
    const anchorSlot = document.querySelector(`.slot[data-slot="FC"]`);
    if (!anchorSlot || !anchorSlot.classList.contains("filled")) return;
    document.querySelectorAll(".slot.filled").forEach((slotEl) => {
      if (slotEl !== anchorSlot) this.animEngine.drawWire(anchorSlot, slotEl);
    });
  }

  #bindTopbar() {
    document.getElementById("sound-toggle").addEventListener("click", async () => {
      const next = this.state.data.settings.sound === false;
      this.state.data.settings.sound = next;
      this.sound.enabled = next;
      this.state.persist(); this.#applySettings();
      if (next) { await this.sound.unlock(); this.sound.celebrate(); }
    });
    document.getElementById("theme-toggle").addEventListener("click", () => {
      this.state.data.settings.theme = this.state.data.settings.theme === "dark" ? "light" : "dark";
      this.state.persist(); this.#applySettings();
    });
    document.querySelectorAll(".nav-link, [data-nav], .home-card").forEach((el) => {
      el.addEventListener("click", () => this.ui.navigate(el.dataset.target || el.dataset.nav));
    });
  }

  #bindBuildToolbar() {
    document.getElementById("btn-check-level").addEventListener("click", () => { this.sound.click(); this.#checkBuildLevel(); });
    document.getElementById("btn-reset").addEventListener("click", () => {
      this.drone.reset(); this.#buildSlots(); this.#updateLevelProgress();
      this.diagnosticsPanel.clear(); this.animEngine.clearWires();
    });
    document.getElementById("btn-power").addEventListener("click", async () => {
      await this.sound.unlock();
      if (!this.drone.isComplete()) { this.ui.toast("Missing required parts.", "error"); return; }
      this.ui.toast("Arming drone...", "info");
      this.sound.arming();
      document.getElementById("board-area").classList.add("booting");

      const result = this.buildLevel === 3 ? await this.simulation.runLaunchSequence(this.drone) : { success: true, issues: [] };
      document.getElementById("board-area").classList.remove("booting");

      const issues = this.buildLevel === 3 ? this.compat.evaluate(this.drone.installed) : [];
      this.diagnosticsPanel.render(this.drone.installed, issues);

      if (result.success) {
        const scoreResult = ScoringEngine.score(this.drone.installed, issues);
        const totalCost = Object.values(this.drone.installed).reduce((s, c) => s + (c.cost || 0), 0);
        this.ui.toast(`Flight successful! Score: ${scoreResult.total}`, "success", 4000);
        this.state.recordDeviceBuilt(); this.state.addXP(80);
        this.state.unlockAchievement("first_launch");
        if (issues.length === 0) this.state.unlockAchievement("stable_flyer");
        this.#renderProgress();
        this.sound.takeoff();
        this.celebration.showLaunch(this.drone.typeName, scoreResult.total, () => {
          // Callback when they finish flying
          const matchHTML = this.deviceMatch.buildReportHTML(this.drone.installed, totalCost);
          this.ui.openModal(`
          <button class="btn modal-close-btn" id="modal-close-x">✕</button>
          <div class="score-summary">
            <span class="badge">Score: ${scoreResult.total} (${scoreResult.grade})</span>
            <span class="badge">Cost: ₹${totalCost}</span>
          </div>
          ${matchHTML}
        `);
          document.getElementById("modal-close-x").addEventListener("click", () => this.ui.closeModal());
        });
      } else {
        this.sound.error();
        this.ui.toast(`Failure: ${result.issue.message}`, "error", 5500);
        this.state.addXP(15);
      }
    });
    document.getElementById("btn-explode").addEventListener("click", () => {
      document.getElementById("slot-container").classList.toggle("exploded");
    });
  }

  #bindStateEvents() {
    this.bus.on("state:changed", (data) => {
      document.getElementById("xp-value").textContent = `${data.xp} XP`;
      document.getElementById("rank-value").textContent = data.rank;
      this.#renderProgress();
    });
  }

  #bindSettings() {
    ["theme","colorblind","largefont","reducemotion"].forEach(k => {
      const el = document.getElementById(`setting-${k}`);
      if (el) el.addEventListener("change", () => {
        this.state.data.settings[k==="largefont"?"largeFont":k==="reducemotion"?"reduceMotion":k] = el.type === "checkbox" ? el.checked : el.value;
        this.state.persist(); this.#applySettings();
      });
    });
  }

  #renderLearn(lessons) { document.getElementById("learn-grid").innerHTML = lessons.map(l => `<div class="lesson-card"><h3>${l.title}</h3><p>${l.body}</p></div>`).join(""); }
  #renderMissions(missions) { document.getElementById("missions-grid").innerHTML = missions.map(m => `<div class="mission-card"><h3>${m.title}</h3><p>${m.description}</p><span class="badge">Budget: ₹${m.budget}</span></div>`).join(""); }
  #renderAchievements(list) {
    const unlocked = this.state.data.achievementsUnlocked;
    document.getElementById("achievements-grid").innerHTML = list.map(a => `<div class="achievement-card ${unlocked.includes(a.id) ? "unlocked" : "locked"}"><span class="achievement-icon">${a.icon}</span><strong>${a.name}</strong><p>${a.description}</p></div>`).join("");
  }
  #renderGlossary(terms) { document.getElementById("glossary-grid").innerHTML = terms.map(t => `<div class="glossary-card"><strong>${t.term}</strong><p>${t.definition}</p></div>`).join(""); }
  #renderProgress() {
    const d = this.state.data;
    document.getElementById("progress-grid").innerHTML = `<div class="progress-card"><h3>Flights</h3><p>${d.devicesBuilt}</p></div><div class="progress-card"><h3>Achievements</h3><p>${d.achievementsUnlocked.length}</p></div><div class="progress-card"><h3>Rank</h3><p>${d.rank}</p></div>`;
  }
  #renderDaily(missions) {
    const pick = missions[new Date().getDate() % missions.length];
    document.getElementById("daily-grid").innerHTML = `<div class="daily-card"><h3>Today's Mission</h3><p>${pick.title} — ${pick.description}</p><span class="badge">${new Date().toDateString()}</span></div>`;
  }
}
const app = new App(); app.init();
