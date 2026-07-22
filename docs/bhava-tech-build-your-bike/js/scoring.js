// scoring.js — factory-pattern scoring engine, fully data-driven
const CRITERIA = ["performance","weight","comfort","safety","durability","cost","repairability","efficiency","environmentalImpact","innovation","customerSatisfaction"];

export class ScoringEngine {
  constructor(weights = {}) {
    this.weights = Object.fromEntries(CRITERIA.map(c => [c, weights[c] ?? 1]));
  }

  scoreBuild(metrics) {
    const breakdown = {};
    let weightedSum = 0;
    let weightTotal = 0;
    for (const c of CRITERIA) {
      const raw = metrics[c] ?? 5; // default neutral 0-10
      const w = this.weights[c];
      breakdown[c] = { raw, weight: w, contribution: raw * w };
      weightedSum += raw * w;
      weightTotal += w;
    }
    const engineeringScore = Math.round((weightedSum / weightTotal) * 10) / 10;
    return { breakdown, engineeringScore, explanation: this._explain(breakdown) };
  }

  _explain(breakdown) {
    return Object.entries(breakdown).map(([k, v]) =>
      `${k}: ${v.raw}/10 (weight x${v.weight}) contributed ${v.contribution.toFixed(1)} points`
    );
  }
}

export function customerSatisfaction(build, customerNeeds) {
  let matched = 0;
  for (const need of customerNeeds) {
    if (build.tags && build.tags.includes(need)) matched++;
  }
  return customerNeeds.length ? Math.round((matched / customerNeeds.length) * 10) : 10;
}
