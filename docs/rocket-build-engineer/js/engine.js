
export class EventBus {
  constructor() { this.listeners = {}; }
  on(event, cb) { (this.listeners[event] ||= []).push(cb); }
  emit(event, payload) { (this.listeners[event] || []).forEach((cb) => cb(payload)); }
}

export class DataStore {
  constructor() { this.cache = {}; }
  async load(key, url) {
    if (this.cache[key]) return this.cache[key];
    const res = await fetch(url);
    const json = await res.json();
    this.cache[key] = json;
    return json;
  }
}

import { StorageManager } from "./storage.js";

export class GameState {
  constructor(bus) {
    this.bus = bus;
    this.data = StorageManager.load();
  }
  persist() { StorageManager.save(this.data); this.bus.emit("state:changed", this.data); }
  addXP(amount) {
    this.data.xp += amount;
    const ranks = [[0,"Trainee"],[150,"Apprentice"],[400,"Technician"],[800,"Engineer"],[1500,"Rocket Scientist"],[2600,"Flight Director"]];
    this.data.rank = ranks.filter((r) => this.data.xp >= r[0]).pop()[1];
    this.persist();
  }
  recordDeviceBuilt() { this.data.devicesBuilt += 1; this.persist(); }
  unlockAchievement(id) {
    if (!this.data.achievementsUnlocked.includes(id)) { this.data.achievementsUnlocked.push(id); this.persist(); }
  }
}

const SLOT_SCHEMAS = {
  Sounding: [
    { slot: "NoseCone", required: true }, { slot: "BodyTube", required: true },
    { slot: "FinSet", required: true }, { slot: "Motor", required: true },
    { slot: "Propellant", required: true }, { slot: "Igniter", required: true },
    { slot: "Battery", required: true }, { slot: "Avionics", required: true },
    { slot: "Recovery", required: true }, { slot: "LaunchLug", required: true },
    { slot: "SecondaryRecovery", required: false }, { slot: "PayloadBay", required: false },
    { slot: "Telemetry", required: false }, { slot: "CameraPod", required: false },
    { slot: "TrackingBeacon", required: false }
  ],
  Orbital: [
    { slot: "NoseCone", required: true }, { slot: "Stage1Engine", required: true },
    { slot: "Stage1Fuel", required: true }, { slot: "Stage1Oxidizer", required: true },
    { slot: "Stage2Engine", required: true }, { slot: "Stage2Fuel", required: true },
    { slot: "Stage2Oxidizer", required: true }, { slot: "FinSet", required: true },
    { slot: "Avionics", required: true }, { slot: "Battery", required: true },
    { slot: "GuidanceSystem", required: true }, { slot: "HeatShield", required: true },
    { slot: "PayloadBay", required: false }, { slot: "RCS", required: false },
    { slot: "Telemetry", required: false }, { slot: "CameraPod", required: false },
    { slot: "SolarPanel", required: false }, { slot: "TrackingBeacon", required: false }
  ]
};

export class Rocket {
  constructor(typeName) {
    this.typeName = typeName;
    this.slotSchema = SLOT_SCHEMAS[typeName];
    this.installed = {};
  }
  install(slotKey, component) { this.installed[slotKey] = component; }
  reset() { this.installed = {}; }
  isComplete() { return this.slotSchema.filter((s) => s.required).every((s) => this.installed[s.slot]); }
}

export class RocketFactory {
  static create(typeName) { return new Rocket(typeName); }
}
