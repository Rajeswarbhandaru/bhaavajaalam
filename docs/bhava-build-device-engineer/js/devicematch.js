
// devicematch.js - Matches a built device to a real-world phone archetype
// and generates a plain-language "what can this phone actually do" report.

export class DeviceMatchEngine {
  constructor(profiles) {
    this.profiles = profiles;
  }

  /** Finds the closest real-world device profile based on total cost. */
  matchProfile(totalCost) {
    const match = this.profiles.find(
      (p) => totalCost >= p.priceRange[0] && totalCost <= p.priceRange[1]
    );
    return match || this.profiles[this.profiles.length - 1];
  }

  /** Builds a human-readable list of real functions this build can perform,
   *  derived directly from the components the child actually installed. */
  buildFunctionReport(installed) {
    const functions = [];

    const cpu = installed["CPU"];
    const ram = installed["RAM"];
    const display = installed["Display"];
    const cam = installed["Camera"];
    const fcam = installed["FrontCamera"];
    const battery = installed["Battery"];
    const chargingIC = installed["ChargingIC"];
    const wifi = installed["WiFi"];
    const bt = installed["Bluetooth"];
    const gps = installed["GPS"];
    const sensors = Object.entries(installed)
      .filter(([k, v]) => v.type === "Sensor")
      .map(([, v]) => v.sensorType);
    const speaker = installed["Speaker"];
    const mic = installed["Microphone"];
    const cooling = installed["Cooling"];
    const storage = installed["Storage"];

    // Calling & messaging
    if (mic && speaker) {
      functions.push({ icon: "📞", label: "Voice calls & messaging", detail: "Microphone + speaker allow clear calls and voice notes." });
    }

    // Gaming
    if (cpu && display) {
      const canGameWell = cpu.clock >= 2.5 && display.refresh >= 90 && cooling;
      const canGameBasic = cpu.clock >= 1.8;
      if (canGameWell) {
        functions.push({ icon: "🎮", label: "Smooth high-end gaming", detail: `${cpu.clock}GHz CPU + ${display.refresh}Hz display + cooling handles demanding games without lag.` });
      } else if (canGameBasic) {
        functions.push({ icon: "🕹️", label: "Casual gaming only", detail: "CPU can run light games, but may lag in graphics-heavy titles without more cooling or a faster chip." });
      } else {
        functions.push({ icon: "⚠️", label: "Gaming not recommended", detail: "This CPU is too slow for most modern games — expect stutter and slowdowns." });
      }
    }

    // Photography
    if (cam) {
      if (cam.mp >= 100 && cam.aiChip) {
        functions.push({ icon: "📸", label: "Professional-quality photos", detail: `${cam.mp}MP AI camera captures sharp detail and enhances photos automatically.` });
      } else if (cam.mp >= 12) {
        functions.push({ icon: "📷", label: "Good everyday photos", detail: `${cam.mp}MP camera is solid for daily photos and social media.` });
      } else {
        functions.push({ icon: "🖼️", label: "Basic photos only", detail: "Low resolution camera — photos may look blurry when zoomed or printed large." });
      }
    }
    if (fcam) {
      functions.push({ icon: "🤳", label: "Selfies & video calls", detail: `${fcam.mp}MP front camera supports video calls and selfies.` });
    }

    // Battery life estimate (very simplified educational model)
    if (battery) {
      const totalPower = Object.values(installed).reduce((s, c) => s + (c.power || 0), 0) || 1;
      const hours = Math.round((battery.capacity / 1000) / (totalPower / 10) * 2);
      functions.push({ icon: "🔋", label: `Approx. ${Math.max(1, hours)} hours of active use`, detail: `${battery.capacity}mAh battery vs. total power draw of ${totalPower.toFixed(1)}W.` });
    }
    if (chargingIC) {
      const fast = chargingIC.wattage >= 33;
      functions.push({ icon: "⚡", label: fast ? "Fast charging supported" : "Standard charging speed", detail: `${chargingIC.wattage}W charging IC installed.` });
    }

    // Internet & connectivity
    if (wifi) functions.push({ icon: "📶", label: "WiFi internet access", detail: `Connects to home/school WiFi networks (${wifi.standard}).` });
    if (bt) functions.push({ icon: "🎧", label: "Wireless headphones & accessories", detail: "Bluetooth allows pairing with earbuds, smartwatches, and speakers." });
    if (gps) functions.push({ icon: "🗺️", label: "Maps & navigation", detail: "GPS module enables location tracking and turn-by-turn navigation." });

    // Sensors
    if (sensors.includes("fingerprint")) functions.push({ icon: "🔒", label: "Fingerprint unlock", detail: "Unlock the phone securely with a fingerprint instead of a password." });
    if (sensors.includes("accelerometer") && sensors.includes("gyroscope")) {
      functions.push({ icon: "🎯", label: "Motion gaming & auto-rotate", detail: "Tilt-based games and automatic screen rotation are supported." });
    }
    if (sensors.includes("barometer")) functions.push({ icon: "⛰️", label: "Altitude tracking", detail: "Useful for hikers to estimate elevation." });
    if (sensors.includes("nfc")) functions.push({ icon: "💳", label: "Tap-to-pay", detail: "NFC allows contactless payments and quick device pairing." });
    if (sensors.includes("ambientlight")) functions.push({ icon: "🌗", label: "Auto brightness", detail: "Screen brightness adjusts automatically to your surroundings." });
    if (sensors.includes("proximity")) functions.push({ icon: "☎️", label: "Screen-off during calls", detail: "Prevents accidental touches near your ear while calling." });

    // Storage / multitasking
    if (storage) {
      functions.push({ icon: "🗂️", label: `${storage.size}GB storage`, detail: storage.size >= 128 ? "Plenty of room for apps, photos and games." : "May fill up quickly with photos, videos, and large apps." });
    }
    if (ram) {
      functions.push({ icon: "🧠", label: `${ram.size}GB multitasking`, detail: ram.size >= 8 ? "Can smoothly switch between many apps at once." : "May slow down when many apps are open together." });
    }

    return functions;
  }

  buildReportHTML(installed, totalCost) {
    const profile = this.matchProfile(totalCost);
    const functions = this.buildFunctionReport(installed);
    return `
      <h2>${profile.icon} Your build is like a "${profile.name}"</h2>
      <p>${profile.tagline}</p>
      <p><em>${profile.realExamples}</em></p>
      <p><strong>Ideal for:</strong> ${profile.idealFor}</p>
      <h3>What your phone can actually do</h3>
      <div class="function-grid">
        ${functions.map((f) => `
          <div class="function-card">
            <span class="fc-icon">${f.icon}</span>
            <strong>${f.label}</strong>
            <p>${f.detail}</p>
          </div>
        `).join("")}
      </div>
    `;
  }
}
