// physics.js — core physics simulation formulas, data-driven (no hardcoded gameplay values)
export function gearRatio(chainringTeeth, cassetteTeeth) {
  return chainringTeeth / cassetteTeeth;
}

export function mechanicalAdvantage(crankArmLengthMm, wheelRadiusMm) {
  return crankArmLengthMm / wheelRadiusMm;
}

export function rollingResistanceForce(crr, normalForceN) {
  return crr * normalForceN;
}

export function brakingDistanceM(speedMS, frictionCoeff, gravity = 9.81) {
  if (frictionCoeff <= 0) return Infinity;
  return (speedMS * speedMS) / (2 * frictionCoeff * gravity);
}

export function gyroscopicAngularMomentum(momentOfInertia, angularVelocity) {
  return momentOfInertia * angularVelocity;
}

export function stabilityIndex(centerOfGravityHeightM) {
  return 1 / Math.max(centerOfGravityHeightM, 0.01);
}

export function powerOutputW(torqueNm, angularVelocityRadS) {
  return torqueNm * angularVelocityRadS;
}

export function climbForceN(massKg, gravity, slopePercent) {
  const angle = Math.atan(slopePercent / 100);
  return massKg * gravity * Math.sin(angle);
}

export function totalWeightKg(componentList) {
  return componentList.reduce((sum, c) => sum + (c.weightKg || 0), 0);
}

export function efficiencyScore(gearSystem, chainConditionFactor = 1) {
  return (gearSystem.efficiency || 5) * chainConditionFactor;
}

export function applyEnvironment(baseValue, multiplierKey, environment) {
  const mult = environment && environment.effects && environment.effects[multiplierKey];
  return mult ? baseValue * mult : baseValue;
}
