
export class CompatibilityEngine {
  constructor(rules, failureEffects) {
    this.rules = rules;
    this.failureEffects = failureEffects;
  }
  evaluate(installed) {
    const issues = [];
    const mb = installed["Motherboard"];
    const cpu = installed["CPU"];
    const ram = installed["RAM"];
    const storage = installed["Storage"];
    const firmware = installed["Firmware"];
    const os = installed["OS"];
    const battery = installed["Battery"];

    if (cpu && mb && !cpu.compatible.includes(mb.id)) issues.push(this.#issue("cpuSocket"));
    if (ram && mb && !ram.compatible.includes(mb.id)) issues.push(this.#issue("ramGen"));
    if (storage && mb && !storage.compatible.includes(mb.id)) issues.push(this.#issue("storageInterface"));
    if (firmware && mb && !(firmware.compatible || []).includes(mb.id)) issues.push(this.#issue("firmwareMatch"));
    if (os && ram && os.minRam > ram.size) issues.push(this.#issue("osRam"));

    const powerBudget = this.#powerCheck(installed);
    if (powerBudget) issues.push(powerBudget);
    const heatBudget = this.#heatCheck(installed);
    if (heatBudget) issues.push(heatBudget);
    if (battery && installed["PowerIC"] && battery.voltage < 3.5) issues.push(this.#issue("batteryVoltage"));

    return issues;
  }
  #issue(ruleId) {
    const rule = this.rules.find((r) => r.id === ruleId);
    return { ruleId, failure: rule.failure, message: rule.message, hint: this.failureEffects[rule.failure]?.hint };
  }
  #powerCheck(installed) {
    const totalPower = Object.values(installed).reduce((sum, c) => sum + (c.power || 0), 0);
    const battery = installed["Battery"];
    const chargingIC = installed["ChargingIC"];
    if (!battery) return null;
    const supply = (chargingIC?.wattage || 10) * 2;
    if (totalPower > supply) {
      return { ruleId: "powerBudget", failure: "power_drain",
        message: `Total power draw (${totalPower}W) exceeds supply capacity (${supply}W).`,
        hint: "Reduce high-power components or add a faster charging IC." };
    }
    return null;
  }
  #heatCheck(installed) {
    const totalHeat = Object.values(installed).reduce((sum, c) => sum + (c.heat || 0), 0);
    if (totalHeat > 60) {
      return { ruleId: "heatBudget", failure: "overheating",
        message: `Total heat output (${totalHeat}) exceeds safe threshold (60).`,
        hint: "Add better cooling or choose lower-heat components." };
    }
    return null;
  }
}

export class SimulationEngine {
  constructor(compatibilityEngine, bus) {
    this.compat = compatibilityEngine;
    this.bus = bus;
  }
  async runBootSequence(device) {
    const stages = ["power_on","battery_output","voltage_regulation","cpu_init",
      "ram_check","storage_detect","firmware_load","os_boot","app_load","home_screen"];
    const issues = this.compat.evaluate(device.installed);
    const criticalIssue = issues[0] || null;

    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      this.bus.emit("sim:stage", { stage, index: i, total: stages.length });
      await new Promise((r) => setTimeout(r, 260));
      if (criticalIssue && this.#stageTriggersFailure(stage, criticalIssue.failure)) {
        this.bus.emit("sim:failure", criticalIssue);
        return { success: false, issue: criticalIssue, issues };
      }
    }
    this.bus.emit("sim:success", { device });
    return { success: true, issues: [] };
  }
  #stageTriggersFailure(stage, failure) {
    const stageMap = {
      cpu_init: ["boot_loop"], ram_check: ["boot_loop", "slow_performance"],
      storage_detect: ["no_display"], firmware_load: ["blue_screen"],
      os_boot: ["slow_performance"], power_on: ["power_drain"],
      voltage_regulation: ["battery_swelling", "overheating"]
    };
    return (stageMap[stage] || []).includes(failure);
  }
}
