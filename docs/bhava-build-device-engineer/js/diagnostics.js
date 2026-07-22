
export class DiagnosticsPanel {
  constructor(containerEl) { this.container = containerEl; }
  render(installed, issues = []) {
    const totalPower = Object.values(installed).reduce((s, c) => s + (c.power || 0), 0);
    const totalHeat = Object.values(installed).reduce((s, c) => s + (c.heat || 0), 0);
    const totalCost = Object.values(installed).reduce((s, c) => s + (c.cost || 0), 0);
    const battery = installed["Battery"];
    const ram = installed["RAM"];
    const storage = installed["Storage"];
    const powerPct = Math.min(100, Math.round((totalPower / 60) * 100));
    const heatPct = Math.min(100, Math.round((totalHeat / 60) * 100));

    this.container.innerHTML = `
      ${this.#bar("Power Draw", `${totalPower}W`, powerPct)}
      ${this.#bar("Temperature", `${totalHeat}°`, heatPct)}
      <div class="diag-row"><span>RAM Usage</span><span>${ram ? ram.size + " GB" : "—"}</span></div>
      <div class="diag-row"><span>Storage</span><span>${storage ? storage.size + " GB" : "—"}</span></div>
      <div class="diag-row"><span>Battery Capacity</span><span>${battery ? battery.capacity + " mAh" : "—"}</span></div>
      <div class="diag-row"><span>Total Cost</span><span>₹${totalCost}</span></div>
      <div class="diag-row"><span>Compatibility</span><span>${issues.length === 0 ? "✅ OK" : `⚠️ ${issues.length} issue(s)`}</span></div>
      <div class="diag-log" id="diag-log">
        ${issues.length === 0 ? "> All systems nominal."
          : issues.map((i) => `> ${i.message} (Hint: ${i.hint || "Investigate related components."})`).join("<br>")}
      </div>`;
  }
  #bar(label, valueLabel, pct) {
    const cls = pct > 85 ? "danger" : pct > 60 ? "warn" : "";
    return `
      <div class="diag-row"><span>${label}</span><span>${valueLabel}</span></div>
      <div class="diag-bar"><div class="diag-bar-fill ${cls}" style="width:${pct}%"></div></div>`;
  }
  clear() {
    this.container.innerHTML = `<p class="placeholder-text">Power on the device to see live diagnostics.</p>`;
  }
}
