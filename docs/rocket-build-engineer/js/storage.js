
const STORAGE_KEY = "rocket_build_engineer_v1";

const defaultState = {
  xp: 0,
  rank: "Trainee",
  devicesBuilt: 0,
  lessonsCompleted: [],
  achievementsUnlocked: [],
  missionsCompleted: [],
  settings: { theme: "dark", colorblind: false, largeFont: false, reduceMotion: false, sound: true },
  seenAnatomyHint: false,
  lastBuild: null
};

export class StorageManager {
  static load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(defaultState);
      const parsed = JSON.parse(raw);
      const merged = { ...structuredClone(defaultState), ...parsed };
      merged.settings = { ...structuredClone(defaultState.settings), ...(parsed.settings || {}) };
      return merged;
    } catch (e) {
      console.warn("StorageManager: failed to load, using defaults", e);
      return structuredClone(defaultState);
    }
  }
  static save(state) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (e) { console.warn("StorageManager: failed to save", e); }
  }
  static clear() { localStorage.removeItem(STORAGE_KEY); }
}
