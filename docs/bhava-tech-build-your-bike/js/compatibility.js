// compatibility.js — rule-based compatibility engine driven entirely by JSON rules
export class CompatibilityEngine {
  constructor(rules) {
    this.rules = rules; // array of {id, description, check}
    this.evaluators = this._buildEvaluators();
  }

  _buildEvaluators() {
    const evaluators = {};
    evaluators.wheel_axle_match = (ctx) => ctx.wheel && ctx.frame && ctx.wheel.axleType === ctx.frame.dropoutType;
    evaluators.hub_width_match = (ctx) => ctx.wheel && ctx.frame && ctx.wheel.hubWidthMm === ctx.frame.rearSpacingMm;
    evaluators.brake_mount_match = (ctx) => ctx.brake && ctx.frame && ctx.brake.mountType === ctx.frame.brakeMountType;
    evaluators.rotor_size_match = (ctx) => !ctx.rotor || !ctx.caliper || ctx.rotor.diameterMm === ctx.caliper.supportedRotorMm;
    evaluators.bottom_bracket_match = (ctx) => !ctx.bottomBracket || !ctx.frame || ctx.bottomBracket.standard === ctx.frame.bbStandard;
    evaluators.headtube_match = (ctx) => !ctx.headset || !ctx.frame || ctx.headset.standard === ctx.frame.headTubeStandard;
    evaluators.fork_travel_frame = (ctx) => !ctx.fork || !ctx.frame || ctx.fork.travelMm <= (ctx.frame.maxForkTravelMm ?? Infinity);
    evaluators.cassette_speed_shifter = (ctx) => !ctx.cassette || !ctx.shifter || ctx.cassette.speeds === ctx.shifter.speeds;
    evaluators.chain_width_cassette = (ctx) => !ctx.chain || !ctx.cassette || ctx.chain.speedRating === ctx.cassette.speeds;
    evaluators.cable_type_lever = (ctx) => !ctx.lever || !ctx.caliper || ctx.lever.cableType === ctx.caliper.cableType;
    evaluators.battery_voltage_controller = (ctx) => !ctx.battery || !ctx.controller || ctx.battery.voltage === ctx.controller.voltage;
    evaluators.motor_wattage_controller = (ctx) => !ctx.motor || !ctx.controller || ctx.motor.wattage <= ctx.controller.maxWattage;
    evaluators.controller_sensor_support = (ctx) => !ctx.controller || !ctx.sensor || (ctx.controller.supportedSensors || []).includes(ctx.sensor.type);
    evaluators.seatpost_diameter = (ctx) => !ctx.seatpost || !ctx.frame || ctx.seatpost.diameterMm === ctx.frame.seatTubeDiameterMm;
    return evaluators;
  }

  validate(context) {
    const results = [];
    for (const rule of this.rules) {
      const fn = this.evaluators[rule.id];
      if (!fn) continue;
      let ok = true;
      try { ok = fn(context); } catch (e) { ok = true; }
      results.push({ id: rule.id, description: rule.description, passed: !!ok });
    }
    return results;
  }

  hasErrors(context) {
    return this.validate(context).some(r => !r.passed);
  }
}
