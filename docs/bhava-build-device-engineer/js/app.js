
import { EventBus, DataStore, GameState, DeviceFactory } from "./engine.js";
import { UIManager } from "./ui.js";
import { DragDropController } from "./dragdrop.js";
import { CompatibilityEngine, SimulationEngine } from "./simulation.js";
import { DiagnosticsPanel } from "./diagnostics.js";
import { ScoringEngine } from "./scoring.js";
import { AnimationEngine, BackgroundMotherboard, SoundEngine, CelebrationEngine } from "./animation.js";
import { DeviceMatchEngine } from "./devicematch.js";
import { AnatomyExplorer } from "./anatomy.js";

class App {
  constructor() {
    this.bus = new EventBus();
    this.dataStore = new DataStore();
    this.state = new GameState(this.bus);
    this.ui = new UIManager(this.bus);
    this.device = DeviceFactory.create("Mobile");
    this.activePaletteType = "Motherboard";
    this.buildLevel = 1;
    this.sound = new SoundEngine();
    this.sound.enabled = this.state.data.settings.sound !== false;
  }

  async init() {
    this.#applySettings();
    this.#initBackground();

    const [components, compatibility, lessons, scenarios, achievements, glossary, deviceProfiles, anatomy] = await Promise.all([
      this.dataStore.load("components", "data/components.json"),
      this.dataStore.load("compatibility", "data/compatibility.json"),
      this.dataStore.load("lessons", "data/lessons.json"),
      this.dataStore.load("scenarios", "data/scenarios.json"),
      this.dataStore.load("achievements", "data/achievements.json"),
      this.dataStore.load("glossary", "data/glossary.json"),
      this.dataStore.load("deviceProfiles", "data/device_profiles.json"),
      this.dataStore.load("anatomy", "data/anatomy.json")
    ]);
    this.deviceMatch = new DeviceMatchEngine(deviceProfiles.profiles);
    this.anatomyExplorer = new AnatomyExplorer(document.getElementById("anatomy-container"), anatomy);
    this.anatomyExplorer.render("Mobile");

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
    this.#renderLab();
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
      if (target === "build-laptop") this.#switchDeviceType("Laptop");
      if (target === "build-mobile") this.#switchDeviceType("Mobile");
    });

    this.ui.toast("Welcome back, Engineer!", "success");
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
    this.bg = new BackgroundMotherboard(canvas);
  }

  #switchDeviceType(typeName) {
    this.device = DeviceFactory.create(typeName);
    const icon = typeName === "Laptop" ? "💻" : "📱";
    document.getElementById("device-title").textContent = `${icon} New ${typeName} Build`;
    document.getElementById("board-area").classList.toggle("laptop-mode", typeName === "Laptop");
    this.#buildSlots();
    this.#updateLevelProgress();
    this.diagnosticsPanel.clear();
    this.animEngine.clearWires();
    if (!this.state.data.seenAnatomyHint) {
      this.ui.toast("New here? Check \"Real Device Anatomy\" first to see where these parts really go!", "info", 5000);
      this.state.data.seenAnatomyHint = true;
      this.state.persist();
    }
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
    const slots = this.device.slotSchema;
    const installed = this.device.installed;
    const required = slots.filter((slot) => slot.required);
    const installedRequired = required.filter((slot) => installed[slot.slot]);
    const installedAll = slots.filter((slot) => installed[slot.slot]);
    const missingRequired = required.filter((slot) => !installed[slot.slot]).map((slot) => slot.slot);
    const missingAll = slots.filter((slot) => !installed[slot.slot]).map((slot) => slot.slot);
    // Compatibility is deliberately evaluated only in Level 3.
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

  #showLevelCelebration(level, deviceName, scoreLabel) {
    const messages = {
      1: { title: "Basic Device Built!", text: `You built a working basic ${deviceName} from its essential core parts.`, icon: deviceName === "laptop" ? "💻" : "📱" },
      2: { title: "Feature Master!", text: `Amazing! Your ${deviceName} has every available feature installed.`, icon: "🚀" },
      3: { title: "Smart Engineer!", text: `Perfect match! Your ${deviceName} parts work together with zero compatibility issues.`, icon: "🏆" }
    };
    const m = messages[level];
    this.sound.celebrate();
    this.celebration.showCustom({ title: m.title, text: m.text, icon: m.icon, scoreLabel, level });
  }

  #checkBuildLevel() {
    const status = this.#getLevelStatus();
    const deviceName = this.device.typeName.toLowerCase();
    if (this.buildLevel === 1) {
      if (status.missingRequired.length === 0) {
        this.state.addXP(25);
        this.#showLevelCelebration(1, deviceName, `+25 XP · ${status.required.length} core parts`);
      } else {
        this.sound.error();
        this.ui.toast(`L1 needs ${status.missingRequired.length} more core part(s): ${status.missingRequired.join(", ")}.`, "error", 6000);
      }
      return;
    }
    if (this.buildLevel === 2) {
      if (status.missingAll.length === 0) {
        this.state.addXP(45);
        this.#showLevelCelebration(2, deviceName, `+45 XP · ${status.slots.length} features`);
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
      this.#showLevelCelebration(3, deviceName, "+70 XP · Zero compatibility issues");
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
    this.device.slotSchema.forEach((slotDef) => {
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
    this.device.install(slotKey, component);
    const slotEl = document.querySelector(`.slot[data-slot="${slotKey}"]`);
    this.ui.fillSlot(slotEl, component);
    this.ui.toast(`${component.name} installed.`, "success");
    this.sound.place();
    this.animEngine.spawnParticles(slotEl, 12, "--accent-5");
    this.#drawAllWires();
    this.#updateLevelProgress();
  }

  #drawAllWires() {
    this.animEngine.clearWires();
    const mbSlot = document.querySelector('.slot[data-slot="Motherboard"]');
    if (!mbSlot || !mbSlot.classList.contains("filled")) return;
    document.querySelectorAll(".slot.filled").forEach((slotEl) => {
      if (slotEl !== mbSlot) this.animEngine.drawWire(mbSlot, slotEl);
    });
  }

  #bindFriendlyClickSounds() {
    // Browsers require a real user gesture before audio; unlock it at the first tap/click.
    document.addEventListener("pointerdown", () => this.sound.unlock(), { once: true });
    // A gentle confirmation sound for taps across the app; component placement and errors keep their special sounds.
    document.addEventListener("click", (event) => {
      const target = event.target.closest("button, .palette-tab, .legend-chip, .home-card");
      if (!target || target.closest("#celebration-overlay")) return;
      if (target.closest(".palette-item") || target.id === "btn-power" || target.id === "btn-check-level") return;
      this.sound.click();
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
      const cur = this.state.data.settings.theme;
      this.state.data.settings.theme = cur === "dark" ? "light" : "dark";
      this.state.persist();
      this.#applySettings();
    });
    document.getElementById("a11y-toggle").addEventListener("click", () => this.ui.navigate("settings"));
    const mentorBtn = document.getElementById("ai-mentor-toggle");
    const mentor = document.getElementById("ai-mentor");
    if (mentorBtn && mentor) {
      const messages = document.getElementById("ai-mentor-messages");
      if (messages && !messages.innerHTML) {
        messages.innerHTML = `<p>Hi! I'm your build mentor. Tap any component slot to get a quick tip, or ask me for help if your device fails to boot.</p>`;
      }
      mentorBtn.addEventListener("click", () => mentor.classList.toggle("open"));
    }
  }

  #bindSettings() {
    document.getElementById("setting-theme").addEventListener("change", (e) => {
      this.state.data.settings.theme = e.target.value;
      this.state.persist(); this.#applySettings();
    });
    document.getElementById("setting-colorblind").addEventListener("change", (e) => {
      this.state.data.settings.colorblind = e.target.checked;
      this.state.persist(); this.#applySettings();
    });
    document.getElementById("setting-largefont").addEventListener("change", (e) => {
      this.state.data.settings.largeFont = e.target.checked;
      this.state.persist(); this.#applySettings();
    });
    document.getElementById("setting-reducemotion").addEventListener("change", (e) => {
      this.state.data.settings.reduceMotion = e.target.checked;
      this.state.persist(); this.#applySettings();
    });
    document.getElementById("btn-clear-progress").addEventListener("click", () => {
      this.state.clearAll();
      this.#applySettings();
      this.#renderProgress();
      this.ui.toast("Progress cleared.", "info");
    });
  }

  #bindBuildToolbar() {
    document.getElementById("btn-back-home").addEventListener("click", () => { this.sound.click(); this.ui.navigate("home"); });
    document.getElementById("btn-check-level").addEventListener("click", () => { this.sound.click(); this.#checkBuildLevel(); });
    document.getElementById("btn-reset").addEventListener("click", () => {
      this.device.reset();
      this.#buildSlots();
      this.diagnosticsPanel.clear();
      this.animEngine.clearWires();
    });
    document.getElementById("btn-power").addEventListener("click", async () => {
      await this.sound.unlock();
      if (!this.device.isComplete()) {
        this.ui.toast("Some required slots are still empty.", "error");
        return;
      }
      this.ui.toast("Booting device...", "info");
      this.sound.boot();
      document.getElementById("board-area").classList.add("booting");
      // Levels 1 and 2 celebrate building and features. Compatibility testing belongs to Level 3 only.
      const result = this.buildLevel === 3
        ? await this.simulation.runBootSequence(this.device)
        : { success: true, issues: [] };
      document.getElementById("board-area").classList.remove("booting");

      const issues = this.buildLevel === 3 ? this.compat.evaluate(this.device.installed) : [];
      this.diagnosticsPanel.render(this.device.installed, issues);

      if (result.success) {
        const scoreResult = ScoringEngine.score(this.device.installed, issues);
        const totalCost = Object.values(this.device.installed).reduce((s, c) => s + (c.cost || 0), 0);
        this.ui.toast(`Boot successful! Engineering Score: ${scoreResult.total} (${scoreResult.grade})`, "success", 4000);
        this.state.recordDeviceBuilt();
        this.state.addXP(80);
        this.state.unlockAchievement("first_boot");
        if (issues.length === 0) this.state.unlockAchievement("heat_manager");
        this.#renderProgress();
        this.sound.celebrate();
        this.celebration.show(this.device.typeName, scoreResult.total, this.buildLevel);

        const matchHTML = this.deviceMatch.buildReportHTML(this.device.installed, totalCost);
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
    this.bus.on("xp:changed", ({ xp, rank }) => {
      document.getElementById("xp-value").textContent = `${xp} XP`;
      document.getElementById("rank-value").textContent = rank;
    });
    this.bus.on("achievement:unlocked", ({ id }) => {
      this.ui.toast(`Achievement unlocked: ${id.replace(/_/g, " ")}`, "success", 4000);
      this.#renderAchievementsIfLoaded();
    });
  }

  #renderAchievementsIfLoaded() {
    this.dataStore.load("achievements", "data/achievements.json").then((d) => this.#renderAchievements(d.achievements));
  }

  #renderLearn(lessons) {
    const listEl = document.getElementById("learn-list");
    const contentEl = document.getElementById("learn-content");
    listEl.innerHTML = lessons.map((l) => `<button data-id="${l.id}">${l.title}</button>`).join("");

    const showLesson = (lesson) => {
      contentEl.innerHTML = `
        <h2>${lesson.title}</h2>
        <p>${lesson.content}</p>
        <div class="lesson-animation-slot spin-slow" aria-label="${lesson.animation}">⚙️</div>
        <p><strong>Predict:</strong> ${lesson.prediction}</p>
        <div class="quiz-block">
          ${lesson.quiz.map((q, qi) => `
            <p>${q.q}</p>
            ${q.options.map((opt, oi) => `<button class="btn quiz-opt" data-qi="${qi}" data-oi="${oi}" data-answer="${q.answer}">${opt}</button>`).join(" ")}
          `).join("")}
        </div>`;
      contentEl.querySelectorAll(".quiz-opt").forEach((btn) => {
        btn.addEventListener("click", () => {
          const correct = Number(btn.dataset.oi) === Number(btn.dataset.answer);
          this.ui.toast(correct ? "Correct!" : "Not quite — think about cause and effect.", correct ? "success" : "error");
          if (correct) this.state.completeLesson(lesson.id);
        });
      });
    };

    listEl.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        listEl.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        showLesson(lessons.find((l) => l.id === btn.dataset.id));
      });
    });
  }

  #renderLab() {
    const listEl = document.getElementById("lab-list");
    const contentEl = document.getElementById("lab-content");
    const types = [...new Set(this.components.map((c) => c.type))];
    listEl.innerHTML = types.map((t) => `<button data-type="${t}">${t} Lab</button>`).join("");

    const showLab = (type) => {
      const examples = this.components.filter((c) => c.type === type);
      contentEl.innerHTML = `
        <h2>${type} Lab</h2>
        <p>Explore how different ${type} choices affect performance, heat, and cost.</p>
        <table class="lab-table">
          <thead><tr><th>Name</th><th>Power</th><th>Heat</th><th>Cost</th></tr></thead>
          <tbody>${examples.map((e) => `<tr><td>${e.name}</td><td>${e.power}W</td><td>${e.heat}</td><td>₹${e.cost}</td></tr>`).join("")}</tbody>
        </table>`;
    };

    listEl.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        listEl.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        showLab(btn.dataset.type);
      });
    });
  }

  #renderMissions(missions) {
    const grid = document.getElementById("mission-grid");
    grid.innerHTML = missions.map((m) => `
      <div class="mission-card">
        <h3>${m.title}</h3>
        <p>${m.description}</p>
        <p><span class="badge">Budget ₹${m.budget}</span></p>
        <button class="btn btn-primary" data-mission="${m.id}">Start Mission</button>
      </div>`).join("");
    grid.querySelectorAll("button[data-mission]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.ui.navigate("build-mobile");
        this.ui.toast(`Mission started: ${btn.closest(".mission-card").querySelector("h3").textContent}`, "info");
      });
    });
  }

  #renderAchievements(list) {
    const grid = document.getElementById("achievement-grid");
    const unlocked = this.state.data.achievementsUnlocked;
    grid.innerHTML = list.map((a) => `
      <div class="achievement-card ${unlocked.includes(a.id) ? "" : "locked"}">
        <h3>${a.title}</h3><p>${a.description}</p><span class="badge">${a.xp} XP</span>
      </div>`).join("");
  }

  #renderGlossary(terms) {
    const grid = document.getElementById("glossary-grid");
    const searchInput = document.getElementById("glossary-search");
    const render = (filter = "") => {
      grid.innerHTML = terms.filter((t) => t.term.toLowerCase().includes(filter.toLowerCase()))
        .map((t) => `<div class="glossary-card"><h3>${t.term}</h3><p>${t.definition}</p></div>`).join("");
    };
    render();
    searchInput.addEventListener("input", (e) => render(e.target.value));
  }

  #renderProgress() {
    const grid = document.getElementById("progress-grid");
    const d = this.state.data;
    grid.innerHTML = `
      <div class="progress-card"><h3>Devices Built</h3><p>${d.devicesBuilt}</p></div>
      <div class="progress-card"><h3>Failures Fixed</h3><p>${d.failuresFixed}</p></div>
      <div class="progress-card"><h3>Lessons Completed</h3><p>${d.lessonsCompleted.length}</p></div>
      <div class="progress-card"><h3>Achievements</h3><p>${d.achievementsUnlocked.length}</p></div>
      <div class="progress-card"><h3>Engineer Rank</h3><p>${d.rank}</p></div>
      <div class="progress-card"><h3>Total XP</h3><p>${d.xp}</p></div>`;
  }

  #renderDaily(missions) {
    const grid = document.getElementById("daily-grid");
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
