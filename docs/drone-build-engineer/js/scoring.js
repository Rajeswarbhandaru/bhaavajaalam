
export class ScoringEngine {
  static score(installed, issues = []) {
    const totalWeight = Object.values(installed).reduce((s, c) => s + (c.weight || 0), 0);
    const totalCost = Object.values(installed).reduce((s, c) => s + (c.cost || 0), 0);
    const totalThrust = Object.values(installed).reduce((s, c) => s + (c.thrust || 0), 0);

    const thrustWeight = totalThrust && totalWeight ? totalThrust / totalWeight : 0;
    const performance = Math.min(100, thrustWeight * 15);
    const costScore = Math.max(0, 100 - totalCost / 12);
    const reliability = Math.max(0, 100 - issues.length * 25);
    const innovation = installed["GPS"] || installed["ObstacleAvoidance"] ? 95 : installed["ActionCam"] ? 75 : 50;

    const breakdown = {
      Performance: Math.round(performance), Cost: Math.round(costScore),
      Reliability: Math.round(reliability), Innovation: Math.round(innovation)
    };
    const values = Object.values(breakdown);
    const total = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    const grade = total >= 85 ? "A" : total >= 70 ? "B" : total >= 55 ? "C" : total >= 40 ? "D" : "F";
    return { total, breakdown, grade };
  }
}
