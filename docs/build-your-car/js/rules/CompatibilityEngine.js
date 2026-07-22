export class CompatibilityEngine {
  evaluate({ mission, installedParts }) {
    const failures = [];
    const installedIds = new Set(installedParts.map(p => p.id));
    const totalCost = installedParts.reduce((sum, p) => sum + p.cost, 0);
    const totalHeatLoad = installedParts.reduce((sum, p) => sum + (p.heatLoadKw || 0), 0);
    const totalCooling = installedParts.reduce((sum, p) => sum + (p.coolingKw || 0), 0);
    const totalBattery = installedParts.reduce((sum, p) => sum + (p.batteryCharge || 0), 0);
    const totalBrakeForce = installedParts.reduce((sum, p) => sum + (p.brakeForce || 0), 0);

    const missing = mission.requiredParts.filter(id => !installedIds.has(id));
    if (missing.length) failures.push({ id: 'missing_required_part', details: missing });
    if (totalHeatLoad > totalCooling) failures.push({ id: 'engine_overheating', details: { totalHeatLoad, totalCooling } });
    if (totalBattery < mission.targets.minBattery) failures.push({ id: 'battery_weak', details: { totalBattery } });
    if (totalBrakeForce < mission.targets.minBrakeForce) failures.push({ id: 'brakes_undersized', details: { totalBrakeForce } });
    if (totalCost > mission.budget) failures.push({ id: 'budget_exceeded', details: { totalCost, budget: mission.budget } });

    return { failures, metrics: { totalCost, totalHeatLoad, totalCooling, totalBattery, totalBrakeForce } };
  }
}