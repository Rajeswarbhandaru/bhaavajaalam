
import { StorageManager } from "./storage.js";

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

export class GameState {
  constructor(bus) {
    this.bus = bus;
    this.data = StorageManager.load();
  }
  persist() { StorageManager.save(this.data); this.bus.emit("state:changed", this.data); }
  addXP(amount) {
    this.data.xp += amount;
    const ranks = [[0,"Trainee"],[150,"Apprentice"],[400,"Technician"],[800,"Engineer"],[1500,"Chief Pilot"],[2600,"Flight Director"]];
    this.data.rank = ranks.filter((r) => this.data.xp >= r[0]).pop()[1];
    this.persist();
  }
  recordDeviceBuilt() { this.data.devicesBuilt += 1; this.persist(); }
  unlockAchievement(id) {
    if (!this.data.achievementsUnlocked.includes(id)) { this.data.achievementsUnlocked.push(id); this.persist(); }
  }
}

const SLOT_SCHEMAS = {
  Racing: [
    { slot: "Frame", required: true }, { slot: "FC", required: true },
    { slot: "ESC", required: true }, { slot: "Motors", required: true },
    { slot: "Propellers", required: true }, { slot: "Battery", required: true },
    { slot: "Receiver", required: true }, { slot: "VTX", required: false },
    { slot: "ActionCam", required: false }, { slot: "LEDStrip", required: false }
  ],
  Cinematic: [
    { slot: "Frame", required: true }, { slot: "FC", required: true },
    { slot: "ESC", required: true }, { slot: "Motors", required: true },
    { slot: "Propellers", required: true }, { slot: "Battery", required: true },
    { slot: "Receiver", required: true }, { slot: "VideoDownlink", required: true },
    { slot: "GimbalCamera", required: true }, { slot: "GPS", required: false },
    { slot: "ObstacleAvoidance", required: false }
  ]
};

export class Drone {
  constructor(typeName) {
    this.typeName = typeName;
    this.slotSchema = SLOT_SCHEMAS[typeName];
    this.installed = {};
  }
  install(slotKey, component) { this.installed[slotKey] = component; }
  reset() { this.installed = {}; }
  isComplete() { return this.slotSchema.filter((s) => s.required).every((s) => this.installed[s.slot]); }
}

export class DroneFactory {
  static create(typeName) { return new Drone(typeName); }
}
