export class VehicleSim {
  run({ mission, installedParts, compatibilityEngine, scoreEngine, step = 0, history = [] }) {
    const evaluation = compatibilityEngine.evaluate({ mission, installedParts });
    const sim = this.simulateFrame({ mission, installedParts, metrics: evaluation.metrics, step, history, failures: evaluation.failures });
    const scores = scoreEngine.calculate({ mission, metrics: evaluation.metrics, failures: evaluation.failures, sim });
    return { ...evaluation, sim, scores, canDrive: evaluation.failures.filter(f => f.id !== 'budget_exceeded').length === 0 };
  }

  simulateFrame({ mission, installedParts, metrics, step, history, failures }) {
    const engine = installedParts.find(p => p.category === 'powertrain');
    const radiator = installedParts.find(p => p.category === 'cooling');
    const battery = installedParts.find(p => p.category === 'electrical');
    const brakes = installedParts.find(p => p.category === 'brakes');
    const weight = 780 + installedParts.reduce((sum, p) => sum + (p.massKg || 0), 0);
    const power = engine ? 100 + Math.round(engine.cost / 20) : 0;
    const cooling = radiator ? radiator.coolingKw : 0;
    const heatLoad = metrics.totalHeatLoad;
    const heatMargin = cooling - heatLoad;
    const batteryReserve = Math.max(0, (battery?.batteryCharge || 0) - step * 4);
    const brakeMargin = (brakes?.brakeForce || 0) - Math.round(weight / 20);
    const speed = engine ? Math.max(0, Math.min(120, Math.round((power / 2) + step * 6 - Math.max(0, heatLoad - cooling)))) : 0;
    const temperature = 70 + Math.max(0, step * 4 + (heatLoad - cooling) * 2);
    const stall = !engine || batteryReserve < 10 || temperature > 118;
    const driveability = Math.max(0, Math.min(100, 45 + (engine ? 20 : -25) + Math.max(-20, heatMargin) + Math.min(20, brakeMargin / 2)));
    return { step, speed, temperature, batteryReserve, brakeMargin, heatMargin, weight, stall, terrain: mission?.id?.includes('hill') ? 'hill' : 'city', roadGrip: mission?.id?.includes('hill') ? 0.86 : 0.92 };
  }
}