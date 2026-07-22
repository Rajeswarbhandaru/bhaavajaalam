
export class CompatibilityEngine {
  constructor(rules, failureEffects) { this.rules = rules; this.failureEffects = failureEffects; }
  evaluate(installed) {
    const issues = [];
    const motor = installed["Motor"];
    const propellant = installed["Propellant"];
    const avionics = installed["Avionics"];
    const battery = installed["Battery"];
    const guidance = installed["GuidanceSystem"];
    const fuel1 = installed["Stage1Fuel"];
    const ox1 = installed["Stage1Oxidizer"];
    const recovery = installed["Recovery"];

    if (motor && propellant && motor.fuelType !== propellant.fuelType) issues.push(this.#issue("fuelMatch"));
    if (fuel1 && ox1 && fuel1.pairsWith && !ox1.name.includes("LOX")) issues.push(this.#issue("oxidizerPair"));
    if (avionics && battery && (battery.voltage || 0) < (avionics.minVoltage || 0)) issues.push(this.#issue("avionicsPower"));
    if (guidance && (!avionics || !avionics.name.includes("Dual-Deploy"))) issues.push(this.#issue("guidanceNeedsAvionics"));

    const twt = this.#thrustToWeight(installed);
    if (twt !== null && twt < 3) {
      issues.push({ ruleId: "thrustWeight", failure: "thrust_low",
        message: `Thrust-to-weight ratio is only ${twt.toFixed(1)}:1 (needs at least 3:1 to lift off safely).`,
        hint: this.failureEffects.thrust_low.hint });
    }
    const stability = this.#stability(installed);
    if (stability !== null && stability < 4) {
      issues.push({ ruleId: "stability", failure: "unstable_flight",
        message: `Stability score is only ${stability} (needs at least 4 to fly straight).`,
        hint: this.failureEffects.unstable_flight.hint });
    }
    if (recovery) {
      const totalWeight = this.#totalWeight(installed);
      if (recovery.maxWeight && totalWeight > recovery.maxWeight) {
        issues.push({ ruleId: "recoveryWeight", failure: "recovery_overweight",
          message: `Rocket weighs ${totalWeight.toFixed(1)} but the parachute only supports ${recovery.maxWeight}.`,
          hint: this.failureEffects.recovery_overweight.hint });
      }
    }
    return issues;
  }
  #issue(ruleId) {
    const rule = this.rules.find((r) => r.id === ruleId);
    return { ruleId, failure: rule.failure, message: rule.message, hint: this.failureEffects[rule.failure]?.hint };
  }
  #totalWeight(installed) { return Object.values(installed).reduce((s, c) => s + (c.weight || 0), 0); }
  #totalThrust(installed) { return Object.values(installed).reduce((s, c) => s + (c.thrust || 0), 0); }
  #thrustToWeight(installed) {
    const thrust = this.#totalThrust(installed);
    const weight = this.#totalWeight(installed);
    if (!thrust || !weight) return null;
    return thrust / (weight * 9.8);
  }
  #stability(installed) {
    const fins = installed["FinSet"];
    const nose = installed["NoseCone"];
    if (!fins) return null;
    let score = fins.stability || 0;
    if (nose && nose.drag <= 2) score += 1;
    return score;
  }
}

export class SimulationEngine {
  constructor(compatibilityEngine, bus) { this.compat = compatibilityEngine; this.bus = bus; }
  async runLaunchSequence(rocket) {
    const stages = ["ignition","liftoff","max_q","stage_separation","apogee","recovery_deploy","touchdown"];
    const relevantStages = rocket.typeName === "Sounding"
      ? ["ignition","liftoff","apogee","recovery_deploy","touchdown"]
      : stages;
    const issues = this.compat.evaluate(rocket.installed);
    const criticalIssue = issues[0] || null;

    for (let i = 0; i < relevantStages.length; i++) {
      const stage = relevantStages[i];
      this.bus.emit("sim:stage", { stage, index: i, total: relevantStages.length });
      await new Promise((r) => setTimeout(r, 300));
      if (criticalIssue && this.#stageTriggersFailure(stage, criticalIssue.failure)) {
        this.bus.emit("sim:failure", criticalIssue);
        return { success: false, issue: criticalIssue, issues };
      }
    }
    this.bus.emit("sim:success", { rocket });
    return { success: true, issues: [] };
  }
  #stageTriggersFailure(stage, failure) {
    const map = {
      ignition: ["ignition_fail","computer_crash"],
      liftoff: ["thrust_low","engine_stall"],
      max_q: ["unstable_flight"],
      stage_separation: ["guidance_confused"],
      apogee: ["unstable_flight"],
      recovery_deploy: ["recovery_overweight"]
    };
    return (map[stage] || []).includes(failure);
  }
}
