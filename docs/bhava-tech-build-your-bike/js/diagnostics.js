// diagnostics.js — workshop diagnostic tool simulations & failure detection
export const FAILURE_MODES = {
  chain_slip: { name: "Chain Slip", causes: ["worn chain", "bent derailleur hanger", "poor cable tension"], fixHint: "Check gear cable tension and chain wear." },
  broken_chain: { name: "Broken Chain", causes: ["excessive force", "rusted links", "improper sizing"], fixHint: "Replace chain, ensure correct speed rating." },
  bent_rim: { name: "Bent Rim", causes: ["impact damage", "overloading"], fixHint: "True the wheel or replace rim." },
  flat_tyre: { name: "Flat Tyre", causes: ["puncture", "low pressure", "sharp debris"], fixHint: "Patch tube or inflate to correct PSI." },
  loose_spokes: { name: "Loose Spokes", causes: ["vibration over time", "poor initial tensioning"], fixHint: "Use a spoke wrench to true the wheel." },
  brake_failure: { name: "Brake Failure", causes: ["worn pads", "air in hydraulic line", "cable stretch"], fixHint: "Bleed hydraulic line or adjust cable tension." },
  rotor_rub: { name: "Rotor Rub", causes: ["bent rotor", "misaligned caliper"], fixHint: "Realign caliper or true rotor." },
  gear_skipping: { name: "Gear Skipping", causes: ["worn cassette", "cable stretch"], fixHint: "Index gears and check cassette wear." },
  cable_snap: { name: "Cable Snap", causes: ["corrosion", "fraying", "old age"], fixHint: "Replace cable and housing." },
  pedal_creak: { name: "Pedal Creak", causes: ["dry threads", "loose bottom bracket"], fixHint: "Grease threads and tighten bottom bracket." },
  bearing_failure: { name: "Bearing Failure", causes: ["lack of lubrication", "water ingress"], fixHint: "Replace bearings and reseal." },
  wheel_wobble: { name: "Wheel Wobble", causes: ["untrue wheel", "bent axle"], fixHint: "True wheel with spoke wrench." },
  frame_crack: { name: "Frame Crack", causes: ["fatigue", "material defect", "overload"], fixHint: "Retire frame or professional weld repair (steel only)." },
  rust: { name: "Rust", causes: ["moisture exposure", "no corrosion protection"], fixHint: "Sand, treat, and repaint affected area." },
  overweight_bicycle: { name: "Overweight Bicycle", causes: ["heavy component choices"], fixHint: "Swap to lighter materials like aluminium or carbon." },
  poor_balance: { name: "Poor Balance", causes: ["high center of gravity", "uneven load"], fixHint: "Lower load height, redistribute weight." },
  handlebar_misalignment: { name: "Handlebar Misalignment", causes: ["loose stem bolts"], fixHint: "Align handlebar with front wheel and torque bolts." },
  chain_drop: { name: "Chain Drop", causes: ["worn chainring", "poor derailleur limit screws"], fixHint: "Adjust derailleur limit screws." }
};

export const DIAGNOSTIC_TOOLS = [
  "Torque Meter","Wheel Alignment Gauge","Chain Wear Checker","Brake Alignment",
  "Tyre Pressure Gauge","Gear Indexing Tool","Bearing Friction Tester","Weight Distribution Scale",
  "Stress Analysis Scanner","Efficiency Meter","Power Transfer Analyzer","Energy Loss Tracker",
  "Rolling Resistance Meter","Suspension Analyzer","Ride Stability Sensor","Heat Map Overlay","Force Visualizer"
];

export function diagnose(symptomId) {
  return FAILURE_MODES[symptomId] || null;
}

export function runToolScan(toolName, bikeState) {
  switch (toolName) {
    case "Tyre Pressure Gauge":
      return { tool: toolName, reading: bikeState.tyrePressurePsi ?? "unknown", status: (bikeState.tyrePressurePsi ?? 40) < 25 ? "LOW" : "OK" };
    case "Chain Wear Checker":
      return { tool: toolName, reading: bikeState.chainWearPercent ?? 0, status: (bikeState.chainWearPercent ?? 0) > 50 ? "REPLACE" : "OK" };
    case "Wheel Alignment Gauge":
      return { tool: toolName, reading: bikeState.wheelTrueness ?? 100, status: (bikeState.wheelTrueness ?? 100) < 80 ? "UNTRUE" : "OK" };
    default:
      return { tool: toolName, reading: "n/a", status: "OK" };
  }
}
