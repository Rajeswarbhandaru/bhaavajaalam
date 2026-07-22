
export class ScoringEngine {
  static score(installed, issues = []) {
    const totalWeight = Object.values(installed).reduce((s, c) => s + (c.weight || 0), 0);
    const totalCost = Object.values(installed).reduce((s, c) => s + (c.cost || 0), 0);
    const totalThrust = Object.values(installed).reduce((s, c) => s + (c.thrust || 0), 0);
    const fins = installed["FinSet"];
    const recovery = installed["Recovery"];

    const thrustWeight = totalThrust && totalWeight ? totalThrust / (totalWeight * 9.8) : 0;
    const performance = Math.min(100, thrustWeight * 20);
    const stabilityScore = fins ? Math.min(100, (fins.stability || 0) * 11) : 0;
    const recoveryScore = recovery ? Math.min(100, 100 - Math.max(0, totalWeight - (recovery.maxWeight || totalWeight)) * 4) : 0;
    const costScore = Math.max(0, 100 - totalCost / 20);
    const reliability = Math.max(0, 100 - issues.length * 22);
    const weightEfficiency = Math.max(0, 100 - totalWeight * 0.6);
    const innovation = installed["GuidanceSystem"] ? 85 : installed["Telemetry"] ? 65 : 45;
    const safety = issues.length === 0 ? 95 : Math.max(10, 95 - issues.length * 25);

    const breakdown = {
      Performance: Math.round(performance), Stability: Math.round(stabilityScore),
      Recovery: Math.round(recoveryScore), Cost: Math.round(costScore),
      Reliability: Math.round(reliability), "Weight Efficiency": Math.round(weightEfficiency),
      Innovation: Math.round(innovation), Safety: Math.round(safety)
    };
    const values = Object.values(breakdown);
    const total = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    const grade = total >= 85 ? "A" : total >= 70 ? "B" : total >= 55 ? "C" : total >= 40 ? "D" : "F";
    return { total, breakdown, grade };
  }
}
