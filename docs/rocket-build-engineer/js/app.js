
import { EventBus, DataStore, GameState, RocketFactory } from "./engine.js";
import { UIManager } from "./ui.js";
import { DragDropController } from "./dragdrop.js";
import { CompatibilityEngine, SimulationEngine } from "./simulation.js";
import { DiagnosticsPanel } from "./diagnostics.js";
import { ScoringEngine } from "./scoring.js";
import { AnimationEngine, BackgroundStars, SoundEngine, CelebrationEngine } from "./animation.js";
import { DeviceMatchEngine } from "./devicematch.js";
import { AnatomyExplorer } from "./anatomy.js";

class App {
  constructor() {
    this.bus = new EventBus();
    this.dataStore = new DataStore();
    this.state = new GameState(this.bus);
    this.ui = new UIManager(this.bus);
    this.rocket = RocketFactory.create("Sounding");
    this.activePaletteType = "NoseCone";
    this.buildLevel = 1;
    this.sound = new SoundEngine();
    this.sound.enabled = this.state.data.settings.sound !== false;
  }

  async init() {
    this.#applySettings();
    this.#initBackground();

    const [components, compatibility, lessons, scenarios, achievements, glossary, rocketProfiles, anatomy] = await Promise.all([
      this.dataStore.load("components", "data/components.json"),
      this.dataStore.load("compatibility", "data/compatibility.json"),
      this.dataStore.load("lessons", "data/lessons.json"),
      this.dataStore.load("scenarios", "data/scenarios.json"),
      this.dataStore.load("achievements", "data/achievements.json"),
      this.dataStore.load("glossary", "data/glossary.json"),
      this.dataStore.load("deviceProfiles", "data/device_profiles.json"),
      this.dataStore.load("anatomy", "data/anatomy.json")
    ]);
    this.rocketMatch = new DeviceMatchEngine(rocketProfiles.profiles);
    this.anatomyExplorer = new AnatomyExplorer(document.getElementById("anatomy-container"), anatomy);
    this.anatomyExplorer.render("Sounding");

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
    this.#buildSlots();
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
      if (target === "build-orbital") this.#switchRocketType("Orbital");
      if (target === "build-sounding") this.#switchRocketType("Sounding");
    });

    this.ui.toast("Welcome back, Rocket Engineer!", "success");
  }

  #applySettings() {
    const s = this.state.data.settings;
    document.documentElement.setAttribute("data-theme", s.theme);
    document.body.classList.toggle("colorblind-mode", s.colorblind);
    document.body.classList.toggle("reduce-motion", s.reduceMotion);
    document.documentElement.style.setProperty("--font-scale", s.largeFont ? "1.2" : "1");
    document.getElementById("xp-value").textContent = `${this.state.data.xp} XP`;
    document.getElementById("rank-value").textContent = this.state.data.rank;
    const themeSel = document.getElementById("setting-theme");
    if (themeSel) themeSel.value = s.theme;
    const cb = document.getElementById("setting-colorblind"); if (cb) cb.checked = s.colorblind;
    const lf = document.getElementById("setting-largefont"); if (lf) lf.checked = s.largeFont;
    const rm = document.getElementById("setting-reducemotion"); if (rm) rm.checked = s.reduceMotion;
    const soundBtn = document.getElementById("sound-toggle");
    if (soundBtn) {
      const on = s.sound !== false;
      soundBtn.textContent = on ? "🔊" : "🔇";
      soundBtn.title = on ? "Sound: On" : "Sound: Off";
      soundBtn.setAttribute("aria-label", on ? "Turn sound off" : "Turn sound on");
      soundBtn.classList.toggle("muted", !on);
    }
  }

  #initBackground() {
    const canvas = document.getElementById("bg-canvas");
    this.bg = new BackgroundStars(canvas);
  }

  #switchRocketType(typeName) {
    this.rocket = RocketFactory.create(typeName);
    const icon = typeName === "Orbital" ? "🛰️" : "🚀";
    document.getElementById("device-title").textContent = `${icon} New ${typeName} Rocket`;
    document.getElementById("board-area").classList.toggle("orbital-mode", typeName === "Orbital");
    this.#buildSlots();
    this.#updateLevelProgress();
    this.diagnosticsPanel.clear();
    this.animEngine.clearWires();
    if (!this.state.data.seenAnatomyHint) {
      this.ui.toast("New here? Check \"Real Rocket Anatomy\" first to see where these parts really go!", "info", 5000);
      this.state.data.seenAnatomyHint = true;
      this.state.persist();
    }
  }

  #bindFriendlyClickSounds() {
    document.addEventListener("pointerdown", () => this.sound.unlock(), { once: true });
    document.addEventListener("click", (event) => {
      const target = event.target.closest("button, .palette-tab, .legend-chip, .home-card");
      if (!target || target.closest("#celebration-overlay")) return;
      if (target.closest(".palette-item") || target.id === "btn-power" || target.id === "btn-check-level") return;
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
        const names = { 1: "Essential Build", 2: "Feature Builder", 3: "Smart Engineer" };
        this.ui.toast(`${names[this.buildLevel]} selected.`, "info");
      });
    });
  }

  #getLevelStatus() {
    const slots = this.rocket.slotSchema;
    const installed = this.rocket.installed;
    const required = slots.filter((slot) => slot.required);
    const installedRequired = required.filter((slot) => installed[slot.slot]);
    const installedAll = slots.filter((slot) => installed[slot.slot]);
    const missingRequired = required.filter((slot) => !installed[slot.slot]).map((slot) => slot.slot);
    const missingAll = slots.filter((slot) => !installed[slot.slot]).map((slot) => slot.slot);
    const issues = this.buildLevel === 3 && this.compat ? this.compat.evaluate(installed) : [];
    return { slots, required, installedRequired, installedAll, missingRequired, missingAll, issues };
  }

  #updateLevelProgress() {
    const progress = document.getElementById("level-progress");
    if (!progress) return;
    const status = this.#getLevelStatus();
    if (this.buildLevel === 1) {
      progress.textContent = `L1 progress: ${status.installedRequired.length} / ${status.required.length} core parts`;
    } else if (this.buildLevel === 2) {
      progress.textContent = `L2 progress: ${status.installedAll.length} / ${status.slots.length} available parts`;
    } else {
      const coreText = `${status.installedRequired.length} / ${status.required.length} core`;
      progress.textContent = `L3 status: ${coreText} · ${status.issues.length} compatibility issue${status.issues.length === 1 ? "" : "s"}`;
    }
  }

  #showLevelCelebration(level, rocketName, scoreLabel) {
    const messages = {
      1: { title: "Basic Rocket Built!", text: `You built a launch-ready ${rocketName} rocket from its essential core parts.`, icon: rocketName === "orbital" ? "🛰️" : "🚀" },
      2: { title: "Feature Master!", text: `Amazing! Your ${rocketName} rocket has every available feature installed.`, icon: "⭐" },
      3: { title: "Smart Engineer!", text: `Perfect match! Your ${rocketName} rocket parts work together with zero compatibility issues.`, icon: "🏆" }
    };
    const m = messages[level];
    this.sound.celebrate();
    this.celebration.showCustom({ title: m.title, text: m.text, icon: m.icon, scoreLabel, level });
  }

  #checkBuildLevel() {
    const status = this.#getLevelStatus();
    const rocketName = this.rocket.typeName.toLowerCase();
    if (this.buildLevel === 1) {
      if (status.missingRequired.length === 0) {
        this.state.addXP(25);
        this.#showLevelCelebration(1, rocketName, `+25 XP · ${status.required.length} core parts`);
      } else {
        this.sound.error();
        this.ui.toast(`L1 needs ${status.missingRequired.length} more core part(s): ${status.missingRequired.join(", ")}.`, "error", 6000);
      }
      return;
    }
    if (this.buildLevel === 2) {
      if (status.missingAll.length === 0) {
        this.state.addXP(45);
        this.#showLevelCelebration(2, rocketName, `+45 XP · ${status.slots.length} features`);
      } else {
        this.sound.click();
        this.ui.toast(`L2 progress: ${status.installedAll.length}/${status.slots.length}. Add: ${status.missingAll.join(", ")}.`, "info", 6500);
      }
      return;
    }
    if (status.missingRequired.length > 0) {
      this.sound.error();
      this.ui.toast(`L3 first needs core parts: ${status.missingRequired.join(", ")}.`, "error", 6000);
    } else if (status.issues.length > 0) {
      this.sound.error();
      this.ui.toast(`L3 not compatible yet: ${status.issues[0].message} ${status.issues[0].hint || ""}`, "error", 6500);
    } else {
      this.state.addXP(70);
      this.#showLevelCelebration(3, rocketName, "+70 XP · Zero compatibility issues");
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
    this.rocket.slotSchema.forEach((slotDef) => {
      const slotEl = this.ui.renderSlot(slotDef);
      this.dnd.makeDropTarget(slotEl, slotDef.slot);
      container.appendChild(slotEl);
    });
  }

  #handleDrop(slotKey, component) {
    if (component.type !== slotKey) {
      this.sound.error();
      this.ui.toast(`${component.name} does not belong in the ${slotKey} slot.`, "error");
      return;
    }
    this.rocket.install(slotKey, component);
    const slotEl = document.querySelector(`.slot[data-slot="${slotKey}"]`);
    this.ui.fillSlot(slotEl, component);
    this.ui.toast(`${component.name} installed.`, "success");
    this.sound.place();
    this.animEngine.spawnParticles(slotEl, 12, "--accent-5");
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
        delete this.rocket.installed[slotKey];
        const slotDef = this.rocket.slotSchema.find((s) => s.slot === slotKey);
        const fresh = this.ui.renderSlot(slotDef);
        slotEl.replaceWith(fresh);
        this.dnd.makeDropTarget(fresh, slotKey);
        this.sound.click();
        this.#drawAllWires();
        this.#updateLevelProgress();
      };
    });
  }

  #drawAllWires() {
    this.animEngine.clearWires();
    const anchorType = this.rocket.typeName === "Orbital" ? "Stage1Engine" : "Motor";
    const anchorSlot = document.querySelector(`.slot[data-slot="${anchorType}"]`);
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
      this.state.persist();
      this.#applySettings();
      if (next) { await this.sound.unlock(); this.sound.celebrate(); this.ui.toast("Sound is on!", "success"); }
      else this.ui.toast("Sound is off.", "info");
    });
    document.getElementById("theme-toggle").addEventListener("click", () => {
      const s = this.state.data.settings;
      s.theme = s.theme === "dark" ? "light" : "dark";
      this.state.persist();
      this.#applySettings();
    });
    document.getElementById("a11y-toggle").addEventListener("click", () => this.ui.navigate("settings"));
    document.querySelectorAll(".nav-link, [data-nav]").forEach((el) => {
      el.addEventListener("click", () => this.ui.navigate(el.dataset.target || el.dataset.nav));
    });
    document.querySelectorAll(".home-card").forEach((el) => {
      el.addEventListener("click", () => this.ui.navigate(el.dataset.target));
    });
  }

  #bindBuildToolbar() {
    document.getElementById("btn-back-home").addEventListener("click", () => { this.sound.click(); this.ui.navigate("home"); });
    document.getElementById("btn-check-level").addEventListener("click", () => { this.sound.click(); this.#checkBuildLevel(); });
    document.getElementById("btn-reset").addEventListener("click", () => {
      this.rocket.reset();
      this.#buildSlots();
      this.#updateLevelProgress();
      this.diagnosticsPanel.clear();
      this.animEngine.clearWires();
    });
    document.getElementById("btn-power").addEventListener("click", async () => {
      await this.sound.unlock();
      if (!this.rocket.isComplete()) {
        this.ui.toast("Some required slots are still empty.", "error");
        return;
      }
      this.ui.toast("Starting countdown...", "info");
      this.sound.countdown();
      document.getElementById("board-area").classList.add("booting");
      const result = this.buildLevel === 3
        ? await this.simulation.runLaunchSequence(this.rocket)
        : { success: true, issues: [] };
      document.getElementById("board-area").classList.remove("booting");

      const issues = this.buildLevel === 3 ? this.compat.evaluate(this.rocket.installed) : [];
      this.diagnosticsPanel.render(this.rocket.installed, issues);

      if (result.success) {
        const scoreResult = ScoringEngine.score(this.rocket.installed, issues);
        const totalCost = Object.values(this.rocket.installed).reduce((s, c) => s + (c.cost || 0), 0);
        this.ui.toast(`Launch successful! Engineering Score: ${scoreResult.total} (${scoreResult.grade})`, "success", 4000);
        this.state.recordDeviceBuilt();
        this.state.addXP(80);
        this.state.unlockAchievement("first_launch");
        if (issues.length === 0) this.state.unlockAchievement("stable_flyer");
        this.#renderProgress();
        this.sound.ignition();
        setTimeout(() => this.sound.liftoff(), 400);
        this.celebration.showLaunch(this.rocket.typeName, scoreResult.total);

        const matchHTML = this.rocketMatch.buildReportHTML(this.rocket.installed, totalCost);
        this.ui.openModal(`
          <button class="btn modal-close-btn" id="modal-close-x">✕</button>
          <div class="score-summary">
            <span class="badge">Engineering Score: ${scoreResult.total} (${scoreResult.grade})</span>
            <span class="badge">Total Cost: ₹${totalCost}</span>
          </div>
          ${matchHTML}
        `);
        document.getElementById("modal-close-x").addEventListener("click", () => this.ui.closeModal());
      } else {
        this.sound.error();
        this.ui.toast(`Failure detected: ${result.issue.message}`, "error", 5500);
        this.state.addXP(15);
      }
    });
    document.getElementById("btn-explode").addEventListener("click", () => {
      document.getElementById("slot-container").classList.toggle("exploded");
      this.ui.toast("Explode view toggled — inspect each component's position.", "info");
    });
    document.getElementById("btn-mission").addEventListener("click", () => this.ui.navigate("challenges"));
  }

  #bindStateEvents() {
    this.bus.on("state:changed", (data) => {
      document.getElementById("xp-value").textContent = `${data.xp} XP`;
      document.getElementById("rank-value").textContent = data.rank;
      this.#renderProgress();
    });
  }

  #bindSettings() {
    const themeSel = document.getElementById("setting-theme");
    if (themeSel) themeSel.addEventListener("change", () => {
      this.state.data.settings.theme = themeSel.value; this.state.persist(); this.#applySettings();
    });
    const cb = document.getElementById("setting-colorblind");
    if (cb) cb.addEventListener("change", () => { this.state.data.settings.colorblind = cb.checked; this.state.persist(); this.#applySettings(); });
    const lf = document.getElementById("setting-largefont");
    if (lf) lf.addEventListener("change", () => { this.state.data.settings.largeFont = lf.checked; this.state.persist(); this.#applySettings(); });
    const rm = document.getElementById("setting-reducemotion");
    if (rm) rm.addEventListener("change", () => { this.state.data.settings.reduceMotion = rm.checked; this.state.persist(); this.#applySettings(); });
  }

  #renderLearn(lessons) {
    const grid = document.getElementById("learn-grid");
    if (!grid) return;
    grid.innerHTML = lessons.map((l) => `
      <div class="lesson-card">
        <h3>${l.title}</h3>
        <p>${l.body}</p>
      </div>`).join("");
  }

  #renderMissions(missions) {
    const grid = document.getElementById("missions-grid");
    if (!grid) return;
    grid.innerHTML = missions.map((m) => `
      <div class="mission-card">
        <h3>${m.title}</h3>
        <p>${m.description}</p>
        <span class="badge">Budget: ₹${m.budget}</span>
      </div>`).join("");
  }

  #renderAchievements(list) {
    const grid = document.getElementById("achievements-grid");
    if (!grid) return;
    const unlocked = this.state.data.achievementsUnlocked;
    grid.innerHTML = list.map((a) => `
      <div class="achievement-card ${unlocked.includes(a.id) ? "unlocked" : "locked"}">
        <span class="achievement-icon">${a.icon}</span>
        <strong>${a.name}</strong>
        <p>${a.description}</p>
      </div>`).join("");
  }

  #renderGlossary(terms) {
    const grid = document.getElementById("glossary-grid");
    if (!grid) return;
    grid.innerHTML = terms.map((t) => `
      <div class="glossary-card">
        <strong>${t.term}</strong>
        <p>${t.definition}</p>
      </div>`).join("");
  }

  #renderProgress() {
    const grid = document.getElementById("progress-grid");
    if (!grid) return;
    const d = this.state.data;
    grid.innerHTML = `
      <div class="progress-card"><h3>Rockets Launched</h3><p>${d.devicesBuilt}</p></div>
      <div class="progress-card"><h3>Lessons Completed</h3><p>${d.lessonsCompleted.length}</p></div>
      <div class="progress-card"><h3>Achievements</h3><p>${d.achievementsUnlocked.length}</p></div>
      <div class="progress-card"><h3>Engineer Rank</h3><p>${d.rank}</p></div>
      <div class="progress-card"><h3>Total XP</h3><p>${d.xp}</p></div>`;
  }

  #renderDaily(missions) {
    const grid = document.getElementById("daily-grid");
    if (!grid) return;
    const today = new Date().toDateString();
    const pick = missions[new Date().getDate() % missions.length];
    grid.innerHTML = `
      <div class="daily-card">
        <h3>Today's Mission</h3>
        <p>${pick.title} — ${pick.description}</p>
        <span class="badge">${today}</span>
      </div>`;
  }
}

const app = new App();
app.init();
