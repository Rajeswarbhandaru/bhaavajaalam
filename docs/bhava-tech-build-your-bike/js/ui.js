// ui.js — renders all screens; pure DOM manipulation, no frameworks
import { audioBus } from "./audio.js";
import { spawnParticles } from "./animation.js";
import { DragDropManager } from "./dragdrop.js";

const PART_ICONS = {
  frame:"\ud83e\udea8", fork:"\ud83d\udd29", headset:"\u2699\ufe0f", stem:"\ud83d\udd27", handlebar:"\ud83c\udfae",
  grips:"\u270b", front_wheel:"\u2b55", rear_wheel:"\u2b55", crankset:"\u2699\ufe0f", pedals:"\ud83e\uddb6",
  chain:"\ud83d\udd17", chainring:"\u2699\ufe0f", cassette:"\ud83c\udf9b\ufe0f", rear_derailleur:"\ud83c\udf9b\ufe0f",
  front_derailleur:"\ud83c\udf9b\ufe0f", gear_shifter:"\ud83c\udf9b\ufe0f", gear_cable:"\ud83e\udea2", seat:"\ud83e\ude91",
  seatpost:"\ud83d\udccf", brake_lever_front:"\ud83d\udd34", brake_lever_rear:"\ud83d\udd34", brake_front:"\ud83d\uded1",
  brake_rear:"\ud83d\uded1", brake_disc_front:"\ud83d\udcbf", brake_disc_rear:"\ud83d\udcbf", motor:"\u26a1",
  battery:"\ud83d\udd0b", controller:"\ud83c\udf9b\ufe0f", display:"\ud83d\udcf1", torque_sensor:"\ud83d\udce1",
  kickstand:"\ud83e\uddb5", mudguards:"\u2602\ufe0f", bottle_cage:"\ud83e\uddc3", bell:"\ud83d\udd14", lights:"\ud83d\udca1",
  reflectors:"\ud83d\udd06", dynamo:"\u26a1", carrier:"\ud83d\udce6", smart_display:"\ud83d\udcf1", solar_panel:"\u2600\ufe0f",
  bottom_bracket:"\u2699\ufe0f", fork_suspension:"\ud83c\udf00", rear_suspension:"\ud83c\udf00", dropper_post:"\ud83d\udccf",
  gps_tracker:"\ud83d\udccd", cadence_sensor:"\ud83d\udce1", power_meter:"\ud83d\udcca", aero_wheels:"\ud83c\udf00",
  tyre_wide:"\ud83c\udfaf", handlebar_drop:"\ud83c\udfae", handlebar_bmx:"\ud83c\udfae", grips_tape:"\u270b",
  front_wheel_700c:"\u2b55", rear_wheel_700c:"\u2b55", front_wheel_20:"\u2b55", rear_wheel_20:"\u2b55",
  brake_rim_or_disc:"\ud83d\uded1", brake_rear_optional:"\ud83d\uded1", pegs:"\ud83e\udea2", gyro_cable:"\ud83e\udea2"
};

function iconFor(slot) { return PART_ICONS[slot] || "\ud83d\udd27"; }

const MENTOR_QUESTIONS = {
  chain: "Why do you think the chain needs to connect the crankset to the rear wheel?",
  brake_front: "What happens to your stopping distance if this part is missing?",
  fork_suspension: "How might this part change your ride over bumpy trails?",
  motor: "What do you think powers this part, and where does that power come from?",
  cassette: "Why might a bike need more than one gear size?"
};

export class UIManager {
  constructor(engine, root) {
    this.engine = engine;
    this.root = root;
    this.dragDrop = new DragDropManager((info) => this._handleDrop(info));
    this._wireGlobalControls();
  }

  _wireGlobalControls() {
    const toggle = document.getElementById("theme-toggle");
    toggle.addEventListener("click", () => this.toggleTheme());
    toggle.addEventListener("keydown", (e) => { if (e.key === "Enter") this.toggleTheme(); });
  }

  toggleTheme() {
    const html = document.documentElement;
    const next = html.dataset.theme === "dark" ? "light" : "dark";
    html.dataset.theme = next;
    this.engine.state.theme = next;
    this.engine.persist();
    audioBus.click();
  }

  _confetti(container) {
    const colors = ["#4fd1c5","#f6ad55","#f56565","#48bb78","#ecc94b"];
    for (let i = 0; i < 30; i++) {
      const el = document.createElement("div");
      el.className = "confetti-piece";
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = "0px";
      el.style.background = colors[i % colors.length];
      el.style.animationDelay = `${Math.random() * 0.4}s`;
      container.appendChild(el);
      setTimeout(() => el.remove(), 1800);
    }
  }

  renderHome() {
    const tpl = document.getElementById("tpl-home-screen").content.cloneNode(true);
    this.root.innerHTML = "";
    this.root.appendChild(tpl);
    const bg = document.getElementById("workshop-bg");
    for (let i = 0; i < 3; i++) {
      const beam = document.createElement("div");
      beam.className = "sunbeam";
      beam.style.left = `${i * 30}%`;
      beam.style.animationDelay = `${i * 3}s`;
      bg.appendChild(beam);
    }
    for (let i = 0; i < 4; i++) {
      const wind = document.createElement("div");
      wind.className = "wind-streak";
      wind.style.top = `${20 + i * 18}%`;
      wind.style.width = "120px";
      wind.style.animationDelay = `${i * 1.2}s`;
      bg.appendChild(wind);
    }
    this.root.querySelectorAll("[data-action]").forEach((btn, i) => {
      btn.classList.add("bounce-in");
      btn.style.animationDelay = `${i * 0.04}s`;
      btn.addEventListener("click", () => {
        audioBus.click();
        this._route(btn.dataset.action, btn.dataset.bike);
      });
    });
  }

  _route(action, bikeId) {
    const handlers = {
      build: () => this.renderLevelSelect(bikeId),
      anatomy: () => this.renderAnatomy(),
      lessons: () => this.renderLessons(),
      lab: () => this.renderLab(),
      repair: () => this.renderRepair(),
      challenges: () => this.renderMissionsScreen("challenges"),
      invent: () => this.renderInvent(),
      achievements: () => this.renderAchievements(),
      glossary: () => this.renderGlossary(),
      garage: () => this.renderGarage(),
      missions: () => this.renderMissionsScreen("daily"),
      continue: () => this.renderGarage()
    };
    (handlers[action] || (() => {}))();
  }

  _backButton(label = "\u2190 Back to Workshop", action = () => this.renderHome()) {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.style.marginBottom = "1rem";
    btn.addEventListener("click", () => { audioBus.click(); action(); });
    return btn;
  }

  // ---------------- BIKE ANATOMY ----------------
  renderAnatomy() {
    this.root.innerHTML = "";
    this.root.appendChild(this._backButton());
    const anatomy = this.engine.data.bike_anatomy || {};
    const wrap = document.createElement("section");
    wrap.className = "glass-panel fade-in";
    wrap.style.padding = "1.4rem";
    wrap.innerHTML = `
      <h2>\ud83e\udea8 ${anatomy.intro?.title || "Bike Anatomy"}</h2>
      <p style="color:var(--text-1)">${anatomy.intro?.subtitle || ""}</p>
      <div class="anatomy-hero">
        <div>
          <h3>Minimum Parts to Move \u2705</h3>
          <div id="min-parts-list"></div>
        </div>
        <div>
          <h3>Maximum Features Possible \u2728</h3>
          <div id="max-parts-list"></div>
        </div>
      </div>
      <h3 style="margin-top:1.5rem">Bike Systems</h3>
      <div id="systems-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:.8rem;"></div>
      <h3 style="margin-top:1.5rem">Three Building Levels</h3>
      <div id="levels-preview" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.8rem;"></div>
    `;
    this.root.appendChild(wrap);

    const minList = wrap.querySelector("#min-parts-list");
    (anatomy.intro?.minParts || []).forEach((p, i) => {
      const row = document.createElement("div");
      row.className = "lesson-card glass-panel slide-in-left";
      row.style.animationDelay = `${i * 0.05}s`;
      row.innerHTML = `<strong>${iconFor(p.slot)} ${p.slot.replace(/_/g," ")}</strong><p style="font-size:.82rem;color:var(--text-1)">${p.why}</p>`;
      minList.appendChild(row);
    });

    const maxList = wrap.querySelector("#max-parts-list");
    (anatomy.intro?.maxFeatures || []).forEach((p, i) => {
      const row = document.createElement("div");
      row.className = "lesson-card glass-panel slide-in-right";
      row.style.animationDelay = `${i * 0.05}s`;
      row.innerHTML = `<strong>${iconFor(p.slot)} ${p.slot.replace(/_/g," ")}</strong><p style="font-size:.82rem;color:var(--text-1)">${p.why}</p>`;
      maxList.appendChild(row);
    });

    const sysGrid = wrap.querySelector("#systems-grid");
    (anatomy.systems || []).forEach((sys, i) => {
      const card = document.createElement("div");
      card.className = "system-card glass-panel fade-in";
      card.style.animationDelay = `${i * 0.06}s`;
      card.innerHTML = `<div class="system-icon">${sys.icon}</div><strong>${sys.name}</strong>
        <p style="font-size:.82rem;color:var(--text-1)">${sys.explanation}</p>
        <div class="parts-inline-list">${sys.parts.map(p => `<span>${p.replace(/_/g," ")}</span>`).join("")}</div>`;
      sysGrid.appendChild(card);
    });

    const levelsGrid = wrap.querySelector("#levels-preview");
    Object.entries(anatomy.levels || {}).forEach(([lvl, def]) => {
      const card = document.createElement("div");
      card.className = "level-card glass-panel level-card";
      card.innerHTML = `<span class="level-badge level-badge-${lvl}">Level ${lvl}</span>
        <h4>${def.title.replace(/^Level \d+ . /,"")}</h4>
        <p style="font-size:.82rem;color:var(--text-1)">${def.description}</p>
        <p style="font-size:.8rem;font-weight:600">\ud83c\udfaf ${def.goal}</p>`;
      levelsGrid.appendChild(card);
    });
  }

  // ---------------- LEVEL SELECT ----------------
  renderLevelSelect(bikeTypeId) {
    const type = this.engine.getBikeType(bikeTypeId);
    if (!type) { this.renderHome(); return; }
    this.root.innerHTML = "";
    this.root.appendChild(this._backButton());
    const wrap = document.createElement("section");
    wrap.className = "glass-panel fade-in";
    wrap.style.padding = "1.4rem";
    wrap.innerHTML = `<h2>${type.name} \u2014 Choose Your Level</h2>`;
    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fit,minmax(260px,1fr))";
    grid.style.gap = "1rem";
    Object.entries(type.levels).forEach(([lvl, def], i) => {
      const card = document.createElement("div");
      card.className = "level-card glass-panel bounce-in";
      card.style.animationDelay = `${i * 0.1}s`;
      card.innerHTML = `<span class="level-badge level-badge-${lvl}">Level ${lvl}</span>
        <h3>${def.label.replace(/^Level \d+ . /,"")}</h3>
        <p style="font-size:.85rem;color:var(--text-1)">${def.description}</p>
        <p style="font-size:.8rem">Required parts: <strong>${def.requiredSlots.length}</strong>${def.optionalSlots.length ? ` + ${def.optionalSlots.length} optional features` : ""}</p>
        <button data-lvl="${lvl}">Start Level ${lvl}</button>`;
      card.querySelector("button").addEventListener("click", () => {
        audioBus.click();
        this.renderBuild(bikeTypeId, lvl);
      });
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    this.root.appendChild(wrap);
  }

  // ---------------- BUILD MODE ----------------
  renderBuild(bikeTypeId, levelId = "1") {
    const build = this.engine.startBuild(bikeTypeId, levelId);
    if (!build) { this.renderHome(); return; }
    const tpl = document.getElementById("tpl-build-screen").content.cloneNode(true);
    this.root.innerHTML = "";
    this.root.appendChild(this._backButton("\u2190 Back to Levels", () => this.renderLevelSelect(bikeTypeId)));
    this.root.appendChild(tpl);

    const tray = document.getElementById("parts-tray");
    tray.innerHTML = `<h3>${build.type.name}</h3><span class="badge level-badge-${levelId}" style="display:inline-block;margin-bottom:.6rem">${build.levelDef.label}</span>
      <p style="font-size:.82rem;color:var(--text-1)">Drag a part onto the matching slot on the right \u2192</p>`;

    build.levelDef.requiredSlots.forEach(slot => {
      const card = document.createElement("div");
      card.className = "part-card fade-in";
      const part = { id: `${slot}_generic`, name: slot.replace(/_/g," "), cost: 20, weightKg: 1, isLearningPart: true };
      card.innerHTML = `<span class="part-icon">${iconFor(slot)}</span><span class="part-name">${slot.replace(/_/g," ")}</span>`;
      this.dragDrop.makeDraggable(card, part.id, part, slot);
      tray.appendChild(card);
    });

    if (build.levelDef.optionalSlots?.length) {
      const optHeader = document.createElement("h4");
      optHeader.textContent = "Optional Features";
      optHeader.style.marginTop = "1rem";
      tray.appendChild(optHeader);
      build.levelDef.optionalSlots.forEach(slot => {
        const card = document.createElement("div");
        card.className = "part-card fade-in";
        card.style.borderColor = "var(--accent-2)";
        const part = { id: `${slot}_generic`, name: slot.replace(/_/g," "), cost: 15, weightKg: 0.4, isLearningPart: true };
        card.innerHTML = `<span class="part-icon">${iconFor(slot)}</span><span class="part-name">${slot.replace(/_/g," ")} \u2728</span>`;
        this.dragDrop.makeDraggable(card, part.id, part, slot);
        tray.appendChild(card);
      });
    }

    const canvasWrap = document.getElementById("bike-canvas-wrap");
    canvasWrap.innerHTML = "";
    const dropArea = document.createElement("div");
    dropArea.id = "slot-drop-area";
    dropArea.style.padding = "1rem";
    dropArea.style.height = "100%";
    dropArea.style.overflowY = "auto";
    dropArea.innerHTML = `<h4 style="color:var(--text-1)">Assembly Slots (${build.levelDef.requiredSlots.length} required)</h4>`;
    build.levelDef.requiredSlots.concat(build.levelDef.optionalSlots || []).forEach(slot => {
      const zone = document.createElement("div");
      zone.className = "dropzone";
      zone.innerHTML = `<span class="slot-label">${iconFor(slot)} ${slot.replace(/_/g," ")}</span><span class="slot-status">\u2014</span>`;
      this.dragDrop.makeDropZone(zone, slot);
      dropArea.appendChild(zone);
    });
    canvasWrap.appendChild(dropArea);

    const progressWrap = document.createElement("div");
    progressWrap.id = "build-progress";
    progressWrap.style.padding = ".6rem 1rem";
    canvasWrap.insertBefore(progressWrap, dropArea);

    const inspector = document.getElementById("inspector-panel");
    inspector.innerHTML = `<h3>\ud83e\udd16 AI Engineering Mentor</h3>
      <div id="mentor-feed"><div class="mentor-bubble">Drag parts onto the slots. I'll ask you questions as you go!</div></div>
      <button id="complete-build-btn" style="margin-top:1rem">Complete Build</button>`;
    inspector.querySelector("#complete-build-btn").addEventListener("click", () => this._finishBuild(bikeTypeId));

    this._updateProgress();
  }

  _updateProgress() {
    const prog = this.engine.buildProgress();
    const wrap = document.getElementById("build-progress");
    if (!wrap) return;
    wrap.innerHTML = `<div style="display:flex;justify-content:space-between;font-size:.82rem;color:var(--text-1)">
      <span>Progress: ${prog.filled}/${prog.total} parts</span><span>${prog.percent}%</span></div>
      <div class="score-bar"><span style="width:${prog.percent}%"></span></div>`;
  }

  _handleDrop({ part, fromSlot, targetSlot, dropZoneEl }) {
    // DragDropManager sends the source slot as `fromSlot`; use it for the fit check.
    const slot = fromSlot;
    if (slot !== targetSlot) {
      dropZoneEl?.classList.add("slot-error");
      setTimeout(() => dropZoneEl?.classList.remove("slot-error"), 400);
      audioBus.fail();
      this._mentorSay(`You picked up “${slot.replace(/_/g," ")}” but released it in the “${targetSlot.replace(/_/g," ")}” slot. Drag it to the slot with the same name.`);
      return;
    }
    const res = this.engine.installPart(slot, part);
    const statusEl = dropZoneEl.querySelector(".slot-status");
    // The Build Levels use learning placeholders, not detailed real-world standards.
    // Correct slot placement is a success; detailed compatibility belongs in Component Lab.
    if (res.ok || part.isLearningPart) {
      dropZoneEl.classList.remove("slot-error");
      dropZoneEl.classList.add("slot-filled");
      statusEl.textContent = "\u2705 Installed";
      audioBus.success();
      const rect = dropZoneEl.getBoundingClientRect();
      spawnParticles(document.getElementById("bike-canvas-wrap"), "spark", rect.width / 2, rect.height / 2, 6);
      const question = MENTOR_QUESTIONS[slot];
      this._mentorSay(question || `Excellent! You installed the ${slot.replace(/_/g," ")} in the correct location.`);
    } else {
      dropZoneEl.classList.add("slot-error");
      statusEl.textContent = "\u26a0\ufe0f Check fit";
      audioBus.fail();
      this._mentorSay(`\u26a0\ufe0f ${res.errors[0]?.description || "These detailed component standards do not fit."} Try a compatible part.`);
    }
    this._updateProgress();
  }

  _mentorSay(text) {
    const feed = document.getElementById("mentor-feed");
    if (!feed) return;
    const bubble = document.createElement("div");
    bubble.className = "mentor-bubble bounce-in";
    bubble.textContent = text;
    feed.prepend(bubble);
    while (feed.children.length > 4) feed.removeChild(feed.lastChild);
  }

  _finishBuild(bikeTypeId) {
    const result = this.engine.completeBuild();
    if (!result) return;
    const build = this.engine.currentBuild;
    const usedParts = Object.keys(build.installed);
    const canvasWrap = document.getElementById("bike-canvas-wrap");
    const inspector = document.getElementById("inspector-panel");

    // Replace the assembly board with a confident, celebratory completed-bike reveal.
    canvasWrap.innerHTML = `
      <section class="bike-reveal" aria-label="Completed bicycle">
        <div class="reveal-title">\ud83c\udf89 You built a bicycle!</div>
        <p>Your ${build.type.name} is ready to ride.</p>
        <div class="bike-stage">
          <span class="sparkle s1">\u2728</span><span class="sparkle s2">\u2726</span><span class="sparkle s3">\u2728</span>
          <svg class="completed-bike-svg" viewBox="0 0 760 390" role="img" aria-label="Animated bicycle assembled from selected components">
            <defs><linearGradient id="bikePaint" x1="0" x2="1"><stop stop-color="#4fd1c5"/><stop offset="1" stop-color="#5b8def"/></linearGradient></defs>
            <path class="ground-line" d="M70 325 H700"/>
            <g class="wheel wheel-rear"><circle cx="210" cy="260" r="92"/><circle class="hub" cx="210" cy="260" r="7"/><g class="spokes">${Array.from({length:12},(_,i)=>`<line x1="210" y1="260" x2="${210+88*Math.cos(i*Math.PI/6)}" y2="${260+88*Math.sin(i*Math.PI/6)}"/>`).join('')}</g></g>
            <g class="wheel wheel-front"><circle cx="570" cy="260" r="92"/><circle class="hub" cx="570" cy="260" r="7"/><g class="spokes">${Array.from({length:12},(_,i)=>`<line x1="570" y1="260" x2="${570+88*Math.cos(i*Math.PI/6)}" y2="${260+88*Math.sin(i*Math.PI/6)}"/>`).join('')}</g></g>
            <g class="frame-animated"><path d="M210 260 L330 112 L430 260 Z M330 112 L510 115 L430 260 M430 260 L570 260"/><path d="M510 115 L550 260 M505 115 L475 77 M465 75 L540 75"/></g>
            <path class="seat-post" d="M330 112 L312 65"/><path class="seat" d="M275 60 Q312 43 350 61 Q315 75 275 60"/>
            <g class="chainring"><circle cx="430" cy="260" r="27"/><circle cx="430" cy="260" r="5"/></g><path class="chain-animated" d="M430 260 H210"/>
            <path class="crank" d="M430 260 L455 292 M430 260 L405 228"/><path class="pedal" d="M447 296 H470 M395 224 H416"/>
            <path class="handlebar" d="M475 77 L465 35 M430 35 H500"/>
          </svg>
        </div>
        <h4>Components you used (${usedParts.length})</h4>
        <div class="used-parts">${usedParts.map(slot => `<span>${iconFor(slot)} ${slot.replace(/_/g," ")}</span>`).join("")}</div>
        <p class="confidence-message">Every part has a job. Together, they make your bike move. Great engineering! \ud83d\udc4f</p>
      </section>`;

    inspector.innerHTML = `<h3>\ud83c\udfc6 Engineering Score: ${result.scoreResult.engineeringScore}/10</h3>
      <div class="score-bar"><span style="width:${result.scoreResult.engineeringScore * 10}%"></span></div>
      <div class="mentor-bubble">You completed the build. Look at your bike, then try another level to discover more features!</div>
      <button id="rebuild-btn" style="margin-top:1rem">Build Another Bike</button>
      <button id="back-home2">Back to Workshop</button>`;
    inspector.querySelector("#back-home2").addEventListener("click", () => this.renderHome());
    inspector.querySelector("#rebuild-btn").addEventListener("click", () => this.renderLevelSelect(bikeTypeId));
    this._confetti(canvasWrap);
    audioBus.success();
  }

  // ---------------- LESSONS ----------------
  renderLessons() {
    this.root.innerHTML = "";
    this.root.appendChild(this._backButton());
    const wrap = document.createElement("section");
    wrap.className = "glass-panel fade-in";
    wrap.style.padding = "1.2rem";
    wrap.innerHTML = "<h2>How Bicycles Work</h2>";
    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fill,minmax(220px,1fr))";
    grid.style.gap = ".6rem";
    (this.engine.data.lessons.topics || []).forEach((t, i) => {
      const card = document.createElement("div");
      card.className = "lesson-card glass-panel fade-in";
      card.style.animationDelay = `${(i % 12) * 0.03}s`;
      card.innerHTML = `<strong>${iconFor(t.id)} ${t.title}</strong><br><span class="badge">${t.category}</span>
        <p style="font-size:.85rem;color:var(--text-1)">Prediction question: what happens if this part is removed?</p>`;
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    this.root.appendChild(wrap);
  }

  // ---------------- COMPONENT LAB ----------------
  renderLab() {
    this.root.innerHTML = "";
    this.root.appendChild(this._backButton());
    const wrap = document.createElement("section");
    wrap.className = "glass-panel fade-in";
    wrap.style.padding = "1.2rem";
    wrap.innerHTML = "<h2>Component Laboratory</h2>";
    const tabs = document.createElement("div");
    tabs.className = "tabs";
    const labs = ["frame", "gear_system", "wheel", "brake", "suspension"];
    const content = document.createElement("div");
    labs.forEach((labKey, i) => {
      const btn = document.createElement("button");
      btn.textContent = labKey.replace(/_/g," ").toUpperCase();
      if (i === 0) btn.classList.add("active");
      btn.addEventListener("click", () => {
        tabs.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this._renderLabContent(content, labKey);
      });
      tabs.appendChild(btn);
    });
    wrap.appendChild(tabs);
    wrap.appendChild(content);
    this._renderLabContent(content, labs[0]);
    this.root.appendChild(wrap);
  }

  _renderLabContent(container, labKey) {
    const items = this.engine.data.components[labKey] || [];
    container.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.6rem">
      ${items.map((it,i) => `<div class="lesson-card glass-panel fade-in" style="animation-delay:${i*0.05}s">
        <strong>${it.name}</strong>
        ${Object.entries(it).filter(([k])=>k!=="id"&&k!=="name").map(([k,v])=>`<div style="font-size:.8rem;color:var(--text-1)">${k}: ${v}</div>`).join("")}
      </div>`).join("")}
    </div>`;
  }

  // ---------------- REPAIR ----------------
  renderRepair() {
    this.root.innerHTML = "";
    this.root.appendChild(this._backButton());
    const wrap = document.createElement("section");
    wrap.className = "glass-panel fade-in";
    wrap.style.padding = "1.2rem";
    wrap.innerHTML = "<h2>Repair Workshop</h2><p>Diagnose the symptom, then choose a fix.</p>";
    const list = document.createElement("div");
    import("./diagnostics.js").then(({ FAILURE_MODES }) => {
      Object.entries(FAILURE_MODES).forEach(([id, f], i) => {
        const card = document.createElement("div");
        card.className = "mission-card glass-panel fade-in";
        card.style.animationDelay = `${i * 0.03}s`;
        card.innerHTML = `<strong>${f.name}</strong>
          <p style="font-size:.85rem">Possible causes: ${f.causes.join(", ")}</p>
          <button data-fix="${id}">Repair It</button>`;
        card.querySelector("button").addEventListener("click", () => {
          this.engine.state.repairsCompleted += 1;
          this.engine.achievementManager.check("repair_complete");
          this.engine.persist();
          audioBus.success();
          card.classList.add("wobble-anim");
          card.querySelector("button").textContent = "\u2705 Repaired: " + f.fixHint;
        });
        list.appendChild(card);
      });
      wrap.appendChild(list);
    });
    this.root.appendChild(wrap);
  }

  // ---------------- MISSIONS ----------------
  renderMissionsScreen(mode) {
    this.root.innerHTML = "";
    this.root.appendChild(this._backButton());
    const wrap = document.createElement("section");
    wrap.className = "glass-panel fade-in";
    wrap.style.padding = "1.2rem";
    const missions = this.engine.data.missions || {};
    if (mode === "daily") {
      wrap.innerHTML = "<h2>Daily Missions</h2>";
      this.engine.missionManager.getTodaysDaily().forEach(m => {
        const card = document.createElement("div");
        card.className = "mission-card glass-panel fade-in";
        card.innerHTML = `<strong>${m.title}</strong> <span class="badge">+${m.xp} XP</span>
          <br><button data-id="${m.id}">Mark Complete</button>`;
        card.querySelector("button").addEventListener("click", () => {
          this.engine.missionManager.completeDaily(m.id);
          this.engine.persist();
          audioBus.success();
          card.remove();
        });
        wrap.appendChild(card);
      });
    } else {
      wrap.innerHTML = "<h2>Customer Challenges</h2>";
      (missions.customers || []).forEach((c, i) => {
        const card = document.createElement("div");
        card.className = "mission-card glass-panel fade-in";
        card.style.animationDelay = `${i * 0.04}s`;
        card.innerHTML = `<strong>${c.name}</strong> \u2014 Budget: $${c.budget}<br>
          <span style="font-size:.85rem;color:var(--text-1)">Needs: ${c.needs.join(", ")}</span><br>
          <span style="font-size:.8rem">Terrain: ${c.terrain} | Weather: ${c.weather} | Time: ${c.timeLimitMin}min</span><br>
          <button data-c="${c.id}">Take Challenge</button>`;
        card.querySelector("button").addEventListener("click", () => this.renderLevelSelect("geared"));
        wrap.appendChild(card);
      });
    }
    this.root.appendChild(wrap);
  }

  // ---------------- INVENT ----------------
  renderInvent() {
    this.root.innerHTML = "";
    this.root.appendChild(this._backButton());
    const ideas = ["Flying Bike","Solar Bike","Moon Bike","Mars Bike","Underwater Bike","Snow Bike","Foldable Bike","Smart AI Bike","Medical Emergency Bike","Disaster Relief Bike"];
    const wrap = document.createElement("section");
    wrap.className = "glass-panel fade-in";
    wrap.style.padding = "1.2rem";
    wrap.innerHTML = `<h2>Invent Mode \u2014 Level 3 Territory \ud83d\ude80</h2><p>Sketch your idea and describe how it would work. There are no wrong answers here \u2014 creativity is rewarded!</p>
      <div class="tabs">${ideas.map(i=>`<button data-idea="${i}">${i}</button>`).join("")}</div>
      <textarea id="invent-text" rows="6" style="width:100%;border-radius:.8rem;padding:.8rem;background:var(--glass);color:var(--text-0);border:1px solid var(--glass-border)" placeholder="Describe your invention..."></textarea>
      <br><button id="submit-invention">Submit Invention</button>`;
    wrap.querySelectorAll("[data-idea]").forEach(b => b.addEventListener("click", () => {
      document.getElementById("invent-text").value = `My ${b.dataset.idea}: `;
      b.classList.add("wobble-anim");
    }));
    wrap.querySelector("#submit-invention").addEventListener("click", () => {
      this.engine.achievementManager.check("invent_submit");
      this.engine.persist();
      audioBus.success();
      this._confetti(wrap);
      wrap.querySelector("#submit-invention").textContent = "\u2705 Submitted! Great engineering thinking.";
    });
    this.root.appendChild(wrap);
  }

  // ---------------- ACHIEVEMENTS ----------------
  renderAchievements() {
    this.root.innerHTML = "";
    this.root.appendChild(this._backButton());
    const wrap = document.createElement("section");
    wrap.className = "glass-panel fade-in";
    wrap.style.padding = "1.2rem";
    const rank = this.engine.achievementManager.rankFor(this.engine.state.xp);
    wrap.innerHTML = `<h2>Achievements</h2><p>XP: ${this.engine.state.xp} | Rank: ${rank}</p>`;
    (this.engine.data.achievements.achievements || []).forEach((a, i) => {
      const unlocked = this.engine.state.achievements.includes(a.id);
      const card = document.createElement("div");
      card.className = "achv-card glass-panel fade-in";
      card.style.animationDelay = `${i * 0.04}s`;
      card.style.opacity = unlocked ? 1 : 0.5;
      card.innerHTML = `<strong>${unlocked ? "\ud83c\udfc6" : "\ud83d\udd12"} ${a.title}</strong><p style="font-size:.85rem">${a.description}</p><span class="badge">+${a.xp} XP</span>`;
      wrap.appendChild(card);
    });
    this.root.appendChild(wrap);
  }

  // ---------------- GLOSSARY ----------------
  renderGlossary() {
    this.root.innerHTML = "";
    this.root.appendChild(this._backButton());
    const wrap = document.createElement("section");
    wrap.className = "glass-panel fade-in";
    wrap.style.padding = "1.2rem";
    wrap.innerHTML = "<h2>Glossary</h2>";
    (this.engine.data.glossary.terms || []).forEach((t, i) => {
      const card = document.createElement("div");
      card.className = "lesson-card glass-panel fade-in";
      card.style.animationDelay = `${i * 0.03}s`;
      card.innerHTML = `<strong>${t.term}</strong><p style="font-size:.85rem">${t.definition}</p>`;
      wrap.appendChild(card);
    });
    this.root.appendChild(wrap);
  }

  // ---------------- GARAGE ----------------
  renderGarage() {
    this.root.innerHTML = "";
    this.root.appendChild(this._backButton());
    const wrap = document.createElement("section");
    wrap.className = "glass-panel fade-in";
    wrap.style.padding = "1.2rem";
    wrap.innerHTML = `<h2>Garage</h2><p>Builds completed: ${this.engine.state.buildsCompleted}</p>`;
    this.engine.state.garage.forEach((b, i) => {
      const card = document.createElement("div");
      card.className = "lesson-card glass-panel fade-in";
      card.style.animationDelay = `${i * 0.04}s`;
      card.innerHTML = `<strong>Build #${i+1}: ${b.type.name} (${b.levelDef?.label || ""})</strong><br>Score: ${b.scoreResult.engineeringScore}/10`;
      wrap.appendChild(card);
    });
    this.root.appendChild(wrap);
  }
}
