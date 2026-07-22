
export class ScoringEngine {
  static score(installed, issues = []) {
    const totalPower = Object.values(installed).reduce((s, c) => s + (c.power || 0), 0);
    const totalHeat = Object.values(installed).reduce((s, c) => s + (c.heat || 0), 0);
    const totalCost = Object.values(installed).reduce((s, c) => s + (c.cost || 0), 0);
    const cpu = installed["CPU"];
    const battery = installed["Battery"];
    const cam = installed["Camera"];

    const performance = cpu ? Math.min(100, cpu.clock * cpu.cores * 6) : 0;
    const batteryScore = battery ? Math.min(100, (battery.capacity / 6000) * 100) : 0;
    const heatScore = Math.max(0, 100 - totalHeat * 1.2);
    const weightScore = Math.max(0, 100 - Object.keys(installed).length * 2);
    const costScore = Math.max(0, 100 - totalCost / 6);
    const repairability = Math.max(0, 100 - Object.keys(installed).length * 1.5);
    const reliability = Math.max(0, 100 - issues.length * 20);
    const environmental = Math.max(0, 100 - totalPower * 1.5);
    const innovation = cam?.aiChip ? 80 : 50;
    const satisfaction = issues.length === 0 ? 90 : Math.max(10, 90 - issues.length * 25);

    const breakdown = {
      Performance: Math.round(performance), Battery: Math.round(batteryScore),
      Heat: Math.round(heatScore), Weight: Math.round(weightScore),
      Cost: Math.round(costScore), Repairability: Math.round(repairability),
      Reliability: Math.round(reliability), "Environmental Impact": Math.round(environmental),
      Innovation: Math.round(innovation), "Customer Satisfaction": Math.round(satisfaction)
    };
    const values = Object.values(breakdown);
    const total = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    const grade = total >= 85 ? "A" : total >= 70 ? "B" : total >= 55 ? "C" : total >= 40 ? "D" : "F";
    return { total, breakdown, grade };
  }

  static evaluateMission(mission, installed, totalCost) {
    const req = mission.requirements;
    const details = [];
    let met = true;
    const battery = installed["Battery"];
    const cpu = installed["CPU"];
    const display = installed["Display"];
    const cam = installed["Camera"];
    const sensorCount = Object.values(installed).filter((c) => c.type === "Sensor").length;

    if (req.minBattery && (!battery || battery.capacity < req.minBattery)) { met = false; details.push(`Needs battery ≥ ${req.minBattery}mAh.`); }
    if (req.minClock && (!cpu || cpu.clock < req.minClock)) { met = false; details.push(`Needs CPU clock ≥ ${req.minClock}GHz.`); }
    if (req.minRefresh && (!display || display.refresh < req.minRefresh)) { met = false; details.push(`Needs display refresh ≥ ${req.minRefresh}Hz.`); }
    if (req.minCameraMp && (!cam || cam.mp < req.minCameraMp)) { met = false; details.push(`Needs camera ≥ ${req.minCameraMp}MP.`); }
    if (req.aiChipNeeded && !cam?.aiChip) { met = false; details.push("Needs an AI-capable camera chip."); }
    if (req.sensorCount && sensorCount < req.sensorCount) { met = false; details.push(`Needs at least ${req.sensorCount} sensors.`); }
    if (req.gpsNeeded && !installed["GPS"]) { met = false; details.push("Needs a GPS module."); }
    if (req.coolingNeeded && !installed["Cooling"]) { met = false; details.push("Needs a cooling solution."); }

    const budgetOk = totalCost <= mission.budget;
    if (!budgetOk) details.push(`Over budget: ₹${totalCost} / ₹${mission.budget}.`);
    return { met: met && budgetOk, budgetOk, details };
  }
}
