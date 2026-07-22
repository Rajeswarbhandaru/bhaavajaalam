export class ScoreEngine {
  calculate({ mission, metrics, failures, sim }) {
    const functionality = failures.some(f => ['missing_required_part', 'battery_weak', 'engine_overheating'].includes(f.id)) ? 35 : Math.min(100, 70 + Math.round((sim?.speed || 0) / 2) - (sim?.stall ? 25 : 0));
    const safety = failures.some(f => f.id === 'brakes_undersized') ? 40 : Math.max(35, 88 - Math.max(0, 20 - (sim?.brakeMargin || 0)));
    const cost = Math.max(20, Math.round(100 - Math.max(0, metrics.totalCost - mission.budget) / Math.max(1, mission.budget) * 100));
    const reliability = Math.max(25, 94 - failures.length * 12 - (sim?.stall ? 15 : 0));
    const efficiency = Math.max(20, Math.min(100, 78 + Math.max(-25, (sim?.heatMargin || 0)) - Math.max(0, (sim?.weight || 0) - 1000) / 50));
    const overall = Math.round((functionality + safety + cost + reliability + efficiency) / 5);
    return { functionality, safety, cost, reliability, efficiency, overall };
  }
}