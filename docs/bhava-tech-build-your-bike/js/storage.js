// storage.js — LocalStorage persistence layer (no globals, ES module)
const KEY = "bhavatech_bike_save_v1";

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : defaultState();
  } catch (e) {
    console.warn("Save corrupted, resetting.", e);
    return defaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function defaultState() {
  return {
    theme: "dark",
    xp: 0,
    rank: "Apprentice",
    lessonsCompleted: [],
    repairsCompleted: 0,
    buildsCompleted: 0,
    achievements: [],
    garage: [],
    dailyMissionsDone: [],
    lastPlayedISO: null,
    settings: { highContrast: false, colorblindMode: false, largeFonts: false }
  };
}
