
import { StorageManager } from "./storage.js";

export class EventBus {
  #listeners = new Map();
  on(event, handler) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
    this.#listeners.get(event).add(handler);
    return () => this.off(event, handler);
  }
  off(event, handler) { this.#listeners.get(event)?.delete(handler); }
  emit(event, payload) {
    this.#listeners.get(event)?.forEach((fn) => {
      try { fn(payload); } catch (e) { console.error(`EventBus error in "${event}"`, e); }
    });
  }
}

export class DataStore {
  #cache = new Map();
  async load(name, path) {
    if (this.#cache.has(name)) return this.#cache.get(name);
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load data file: ${path}`);
    const json = await res.json();
    this.#cache.set(name, json);
    return json;
  }
  get(name) { return this.#cache.get(name); }
}

export class GameState {
  constructor(bus) {
    this.bus = bus;
    this.data = StorageManager.load();
  }
  addXP(amount) {
    this.data.xp += amount;
    this.#recalculateRank();
    this.persist();
    this.bus.emit("xp:changed", { xp: this.data.xp, rank: this.data.rank });
  }
  #recalculateRank() {
    const xp = this.data.xp;
    let rank = "Trainee";
    if (xp >= 1500) rank = "Inventor";
    else if (xp >= 800) rank = "Scientist";
    else if (xp >= 300) rank = "Engineer";
    else if (xp >= 100) rank = "Apprentice";
    this.data.rank = rank;
  }
  unlockAchievement(id) {
    if (!this.data.achievementsUnlocked.includes(id)) {
      this.data.achievementsUnlocked.push(id);
      this.persist();
      this.bus.emit("achievement:unlocked", { id });
    }
  }
  completeLesson(id) {
    if (!this.data.lessonsCompleted.includes(id)) {
      this.data.lessonsCompleted.push(id);
      this.addXP(20);
    }
  }
  completeMission(id) {
    if (!this.data.missionsCompleted.includes(id)) this.data.missionsCompleted.push(id);
  }
  recordDeviceBuilt() { this.data.devicesBuilt += 1; this.persist(); }
  recordFailureFixed() { this.data.failuresFixed += 1; this.persist(); }
  persist() { StorageManager.save(this.data); }
  clearAll() {
    StorageManager.clear();
    this.data = StorageManager.load();
    this.bus.emit("state:reset", {});
  }
}

export class Device {
  constructor(typeName, slotSchema) {
    this.typeName = typeName;
    this.slotSchema = slotSchema;
    this.installed = {};
  }
  install(slotKey, component) { this.installed[slotKey] = component; }
  remove(slotKey) { delete this.installed[slotKey]; }
  isComplete() {
    return this.slotSchema.filter((s) => s.required).every((s) => this.installed[s.slot]);
  }
  getComponents() { return Object.values(this.installed); }
  reset() { this.installed = {}; }
}

export class DeviceFactory {
  static create(typeName) {
    const schemas = {
      Mobile: [
        { slot: "Motherboard", required: true }, { slot: "CPU", required: true },
        { slot: "RAM", required: true }, { slot: "Storage", required: true },
        { slot: "Battery", required: true }, { slot: "ChargingIC", required: true },
        { slot: "PowerIC", required: true }, { slot: "Display", required: true },
        { slot: "Camera", required: false }, { slot: "FrontCamera", required: false },
        { slot: "Speaker", required: false }, { slot: "Microphone", required: false },
        { slot: "Cooling", required: false }, { slot: "WiFi", required: false },
        { slot: "Bluetooth", required: false }, { slot: "GPS", required: false },
        { slot: "Sensor", required: false }, { slot: "Buttons", required: false },
        { slot: "SIM", required: true }, { slot: "VibrationMotor", required: false },
        { slot: "Drivers", required: false },
        { slot: "OS", required: true }, { slot: "Firmware", required: true }
      ],
      Laptop: [
        { slot: "Motherboard", required: true }, { slot: "CPU", required: true },
        { slot: "GPU", required: false }, { slot: "RAM", required: true },
        { slot: "Storage", required: true }, { slot: "Battery", required: true },
        { slot: "ChargingIC", required: true }, { slot: "PowerIC", required: true },
        { slot: "Display", required: true }, { slot: "Keyboard", required: true },
        { slot: "Cooling", required: true }, { slot: "WiFi", required: false },
        { slot: "Bluetooth", required: false }, { slot: "Speaker", required: false },
        { slot: "Microphone", required: false }, { slot: "FrontCamera", required: false },
        { slot: "Drivers", required: false }, { slot: "OS", required: true },
        { slot: "Firmware", required: true }
      ]
    };
    return new Device(typeName, schemas[typeName] || schemas.Mobile);
  }
}
