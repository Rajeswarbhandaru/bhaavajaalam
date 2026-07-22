// achievements.js — unlocking logic driven by /data/achievements.json
export class AchievementManager {
  constructor(definitions, state, onUnlock) {
    this.definitions = definitions;
    this.state = state;
    this.onUnlock = onUnlock;
  }

  check(eventName, payload = {}) {
    const newlyUnlocked = [];
    for (const a of this.definitions) {
      if (this.state.achievements.includes(a.id)) continue;
      if (this._matches(a.id, eventName, payload)) {
        this.state.achievements.push(a.id);
        this.state.xp += a.xp;
        newlyUnlocked.push(a);
      }
    }
    if (newlyUnlocked.length && this.onUnlock) newlyUnlocked.forEach(a => this.onUnlock(a));
    return newlyUnlocked;
  }

  _matches(id, eventName, payload) {
    switch (id) {
      case "first_build": return eventName === "build_complete" && this.state.buildsCompleted === 1;
      case "master_mechanic": return eventName === "repair_complete" && this.state.repairsCompleted >= 20;
      case "gear_guru": return eventName === "build_complete" && payload.usedAllGearSystems;
      case "eco_engineer": return eventName === "build_complete" && payload.frameMaterial === "bamboo";
      case "speed_demon": return eventName === "physics_lab_score" && payload.score > 90;
      case "inventor": return eventName === "invent_submit";
      case "perfect_compatibility": return eventName === "build_complete" && payload.compatibilityErrors === 0;
      default: return false;
    }
  }

  rankFor(xp) {
    const ranks = this.definitions.ranks || ["Apprentice","Engineer","Designer","Master Mechanic","Inventor"];
    const thresholds = [0, 100, 300, 700, 1500];
    let idx = 0;
    thresholds.forEach((t, i) => { if (xp >= t) idx = i; });
    return ranks[idx];
  }
}
