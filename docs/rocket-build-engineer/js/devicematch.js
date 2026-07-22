
export class DeviceMatchEngine {
  constructor(profiles) { this.profiles = profiles; }
  match(totalCost) {
    return this.profiles.find((p) => totalCost >= p.priceRange[0] && totalCost <= p.priceRange[1]) || this.profiles[this.profiles.length - 1];
  }
  buildReportHTML(installed, totalCost) {
    const profile = this.match(totalCost);
    const partList = Object.values(installed).map((c) => `<li>${c.name} <span>₹${c.cost}</span></li>`).join("");
    return `
      <div class="match-report">
        <h3>Closest Real Rocket Class</h3>
        <div class="match-card">
          <strong>${profile.name}</strong>
          <p>${profile.desc}</p>
          <span class="badge">Price range: ₹${profile.priceRange[0]} – ₹${profile.priceRange[1] === 999999 ? "∞" : profile.priceRange[1]}</span>
        </div>
        <h4>Parts List</h4>
        <ul class="parts-list">${partList}</ul>
      </div>`;
  }
}
