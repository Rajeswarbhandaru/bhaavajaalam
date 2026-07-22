
export class CompatibilityEngine {
  constructor(rules, failureEffects) { this.rules = rules; this.failureEffects = failureEffects; }
  evaluate(installed) {
    const issues = [];
    const esc = installed["ESC"];
    const batt = installed["Battery"];
    const frame = installed["Frame"];
    const props = installed["Propellers"];
    const fc = installed["FC"];
    const gps = installed["GPS"];
    const obs = installed["ObstacleAvoidance"];

    if (esc && batt && batt.cells > esc.maxCells) issues.push(this.#issue("voltageLimit"));
    if (frame && props && props.size > frame.maxProp) issues.push(this.#issue("propClearance"));
    if (fc && fc.processing === "F4" && (gps || obs)) issues.push(this.#issue("gpsNeedsF7"));

    const twt = this.#thrustToWeight(installed);
    if (twt !== null) {
      if (twt < 2.0) {
        issues.push({ ruleId: "thrustWeight", failure: "cant_liftoff",
          message: `Thrust-to-weight ratio is only ${twt.toFixed(1)}:1 (needs at least 2.0:1 to fly safely).`,
          hint: this.failureEffects.cant_liftoff.hint });
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
    return thrust / weight;
  }
}

export class SimulationEngine {
  constructor(compatibilityEngine, bus) { this.compat = compatibilityEngine; this.bus = bus; }
  async runLaunchSequence(drone) {
    const stages = ["arming","spool_up","liftoff","hover_test","acro_maneuvers"];
    const issues = this.compat.evaluate(drone.installed);
    const criticalIssue = issues[0] || null;

    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      this.bus.emit("sim:stage", { stage, index: i, total: stages.length });
      await new Promise((r) => setTimeout(r, 400));
      if (criticalIssue && this.#stageTriggersFailure(stage, criticalIssue.failure)) {
        this.bus.emit("sim:failure", criticalIssue);
        return { success: false, issue: criticalIssue, issues };
      }
    }
    this.bus.emit("sim:success", { drone });
    return { success: true, issues: [] };
  }
  #stageTriggersFailure(stage, failure) {
    const map = {
      arming: ["cpu_overload"],
      spool_up: ["esc_burnout", "prop_strike"],
      liftoff: ["cant_liftoff"]
    };
    return (map[stage] || []).includes(failure);
  }
}
