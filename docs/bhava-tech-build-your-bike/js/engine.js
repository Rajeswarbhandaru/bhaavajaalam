// engine.js — core game engine orchestrating data loading, state, and modules (Factory + Observer patterns)
import { loadState, saveState } from "./storage.js";
import { CompatibilityEngine } from "./compatibility.js";
import { ScoringEngine } from "./scoring.js";
import { AchievementManager } from "./achievements.js";
import { MissionManager } from "./missions.js";
import * as physics from "./physics.js";
import { audioBus } from "./audio.js";

class EventBus {
  constructor() { this.listeners = {}; }
  on(evt, fn) { (this.listeners[evt] ||= []).push(fn); return () => this.off(evt, fn); }
  off(evt, fn) { this.listeners[evt] = (this.listeners[evt] || []).filter(f => f !== fn); }
  emit(evt, payload) { (this.listeners[evt] || []).forEach(fn => fn(payload)); }
}

const DATA_FILES = [
  "components","compatibility","materials","lessons","glossary",
  "missions","scenarios","achievements","bike_types","physics_rules","bike_anatomy"
];

export class GameEngine {
  constructor() {
    this.bus = new EventBus();
    this.state = loadState();
    this.data = {};
    this.compatibilityEngine = null;
    this.scoringEngine = new ScoringEngine();
    this.achievementManager = null;
    this.missionManager = null;
    this.currentBuild = null;
  }

  async init() {
    await this._loadAllData();
    this.compatibilityEngine = new CompatibilityEngine(this.data.compatibility.rules);
    this.achievementManager = new AchievementManager(
      this.data.achievements.achievements,
      this.state,
      (a) => { this.bus.emit("achievement_unlocked", a); audioBus.success(); }
    );
    this.achievementManager.rankThresholdsMeta = this.data.achievements.ranks;
    this.missionManager = new MissionManager(this.data.missions, this.state);
    this.bus.emit("engine_ready", { state: this.state });
    return this;
  }

  async _loadAllData() {
    const results = await Promise.all(
      DATA_FILES.map(f => fetch(`data/${f}.json`).then(r => r.json()).catch(() => ({})))
    );
    DATA_FILES.forEach((f, i) => { this.data[f] = results[i]; });
  }

  getBikeType(id) {
    return this.data.bike_types[id] || null;
  }

  getComponentsForSlot(slot) {
    return this.data.components[slot] || [];
  }

  startBuild(bikeTypeId, levelId = "1") {
    const type = this.getBikeType(bikeTypeId);
    if (!type) return null;
    const levelDef = type.levels?.[levelId] || type.levels?.["1"];
    this.currentBuild = {
      bikeTypeId, type, levelId, levelDef,
      installed: {}, tags: [], totalCost: 0
    };
    return this.currentBuild;
  }

  getRequiredSlots() {
    return this.currentBuild?.levelDef?.requiredSlots || [];
  }

  getOptionalSlots() {
    return this.currentBuild?.levelDef?.optionalSlots || [];
  }

  installPart(slot, part) {
    if (!this.currentBuild) return { ok: false, reason: "No active build" };
    const previousPart = this.currentBuild.installed[slot];
    if (previousPart) this.currentBuild.totalCost -= previousPart.cost || 0;
    this.currentBuild.installed[slot] = part;
    this.currentBuild.totalCost += part.cost || 0;
    const context = this._buildCompatContext();
    const validation = this.compatibilityEngine.validate(context);
    const errors = validation.filter(v => !v.passed);
    this.bus.emit("part_installed", { slot, part, errors });
    return { ok: errors.length === 0, errors };
  }

  removePart(slot) {
    if (!this.currentBuild) return;
    const part = this.currentBuild.installed[slot];
    if (part) {
      this.currentBuild.totalCost -= part.cost || 0;
      delete this.currentBuild.installed[slot];
    }
  }

  _buildCompatContext() {
    return { ...this.currentBuild.installed };
  }

  buildProgress() {
    const required = this.getRequiredSlots();
    const filled = required.filter(s => this.currentBuild.installed[s]);
    return { filled: filled.length, total: required.length, percent: required.length ? Math.round((filled.length / required.length) * 100) : 0 };
  }

  completeBuild() {
    if (!this.currentBuild) return null;
    const context = this._buildCompatContext();
    const validation = this.compatibilityEngine.validate(context);
    const errors = validation.filter(v => !v.passed).length;
    const weight = physics.totalWeightKg(Object.values(this.currentBuild.installed));
    const metrics = {
      performance: Math.max(1, 10 - errors),
      weight: Math.max(1, 10 - Math.round(weight / 2)),
      comfort: 6, safety: errors === 0 ? 9 : 4, durability: 7,
      cost: Math.max(1, 10 - Math.round(this.currentBuild.totalCost / 100)),
      repairability: 6, efficiency: 6, environmentalImpact: 5,
      innovation: this.currentBuild.levelId === "3" ? 8 : 5,
      customerSatisfaction: 7
    };
    const scoreResult = this.scoringEngine.scoreBuild(metrics);
    this.state.buildsCompleted += 1;
    this.state.garage.push({ ...this.currentBuild, scoreResult, dateISO: new Date().toISOString() });
    this.achievementManager.check("build_complete", {
      compatibilityErrors: errors,
      frameMaterial: this.currentBuild.installed.frame?.material
    });
    saveState(this.state);
    this.bus.emit("build_complete", { scoreResult, errors });
    return { scoreResult, errors };
  }

  persist() { saveState(this.state); }
}
