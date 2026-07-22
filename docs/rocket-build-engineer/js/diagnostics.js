
export class DiagnosticsPanel {
  constructor(containerEl) { this.container = containerEl; }
  render(installed, issues = []) {
    const totalWeight = Object.values(installed).reduce((s, c) => s + (c.weight || 0), 0);
    const totalThrust = Object.values(installed).reduce((s, c) => s + (c.thrust || 0), 0);
    const totalCost = Object.values(installed).reduce((s, c) => s + (c.cost || 0), 0);
    const twt = totalThrust && totalWeight ? (totalThrust / (totalWeight * 9.8)).toFixed(1) : "—";
    const fins = installed["FinSet"];
    const recovery = installed["Recovery"];
    const twPct = Math.min(100, (Number(twt) || 0) * 20);
    const stabPct = fins ? Math.min(100, (fins.stability || 0) * 11) : 0;

    this.container.innerHTML = `
      ${this.#bar("Thrust-to-Weight", `${twt}:1`, twPct)}
      ${this.#bar("Stability", `${fins ? fins.stability : "—"}`, stabPct)}
      <div class="diag-row"><span>Total Weight</span><span>${totalWeight.toFixed(1)} kg</span></div>
      <div class="diag-row"><span>Total Thrust</span><span>${totalThrust} N</span></div>
      <div class="diag-row"><span>Recovery</span><span>${recovery ? recovery.name : "—"}</span></div>
      <div class="diag-row"><span>Total Cost</span><span>₹${totalCost}</span></div>
      <div class="diag-row"><span>Compatibility</span><span>${issues.length === 0 ? "✅ OK" : `⚠️ ${issues.length} issue(s)`}</span></div>
      <div class="diag-log" id="diag-log">
        ${issues.length === 0 ? "> All systems nominal. Ready for launch."
          : issues.map((i) => `> ${i.message} (Hint: ${i.hint || "Investigate related components."})`).join("<br>")}
      </div>`;
  }
  #bar(label, valueLabel, pct) {
    const cls = pct > 85 ? "" : pct > 40 ? "warn" : "danger";
    return `
      <div class="diag-row"><span>${label}</span><span>${valueLabel}</span></div>
      <div class="diag-bar"><div class="diag-bar-fill ${cls}" style="width:${pct}%"></div></div>`;
  }
  clear() {
    this.container.innerHTML = `<p class="placeholder-text">Launch the rocket to see live diagnostics.</p>`;
  }
}
