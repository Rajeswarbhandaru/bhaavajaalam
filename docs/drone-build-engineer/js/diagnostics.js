
export class DiagnosticsPanel {
  constructor(containerEl) { this.container = containerEl; }
  render(installed, issues = []) {
    const totalWeight = Object.values(installed).reduce((s, c) => s + (c.weight || 0), 0);
    const totalThrust = Object.values(installed).reduce((s, c) => s + (c.thrust || 0), 0);
    const totalCost = Object.values(installed).reduce((s, c) => s + (c.cost || 0), 0);
    const twt = totalThrust && totalWeight ? (totalThrust / totalWeight).toFixed(1) : "—";

    const twPct = Math.min(100, (Number(twt) || 0) * 15);

    this.container.innerHTML = `
      ${this.#bar("Thrust-to-Weight", `${twt}:1`, twPct)}
      <div class="diag-row"><span>Total Weight</span><span>${totalWeight} g</span></div>
      <div class="diag-row"><span>Total Thrust</span><span>${totalThrust} g</span></div>
      <div class="diag-row"><span>Total Cost</span><span>₹${totalCost}</span></div>
      <div class="diag-row"><span>Compatibility</span><span>${issues.length === 0 ? "✅ OK" : `⚠️ ${issues.length} issue(s)`}</span></div>
      <div class="diag-log" id="diag-log">
        ${issues.length === 0 ? "> Pre-arm checks passed. Ready to fly."
          : issues.map((i) => `> ${i.message} (Hint: ${i.hint || "Check parts."})`).join("<br>")}
      </div>`;
  }
  #bar(label, valueLabel, pct) {
    const cls = pct > 70 ? "" : pct > 30 ? "warn" : "danger";
    return `
      <div class="diag-row"><span>${label}</span><span>${valueLabel}</span></div>
      <div class="diag-bar"><div class="diag-bar-fill ${cls}" style="width:${pct}%"></div></div>`;
  }
  clear() {
    this.container.innerHTML = `<p class="placeholder-text">Arm the drone to see live telemetry.</p>`;
  }
}
