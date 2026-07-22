import { EventBus } from './core/EventBus.js';
import { Store } from './core/Store.js';
import { PartFactory } from './factories/PartFactory.js';
import { MissionFactory } from './factories/MissionFactory.js';
import { CompatibilityEngine } from './rules/CompatibilityEngine.js';
import { ScoreEngine } from './rules/ScoreEngine.js';
import { VehicleSim } from './simulation/VehicleSim.js';
import { MentorSystem } from './systems/MentorSystem.js';
import { SoundManager } from './systems/SoundManager.js';
import { bindHomeActions } from './ui/HomeScreen.js';
import { renderParts } from './ui/BuildScreen.js';
import { renderMission } from './ui/MissionScreen.js';
import { renderDiagnostics } from './ui/DiagnosticsScreen.js';
import { renderTelemetry } from './ui/ResultsScreen.js';
import { LearningGuide } from './systems/LearningGuide.js';
import { renderLearningPanel } from './ui/LearningPanel.js';

const [partsData, missionsData, failureCatalog, learningPathData] = await Promise.all([
  fetch('./data/parts.json').then(r => r.json()),
  fetch('./data/missions.json').then(r => r.json()),
  fetch('./data/failures.json').then(r => r.json()),
  fetch('./data/learning-path.json').then(r => r.json())
]);

const missionIndex = new Map(missionsData.map(m => [m.id, m]));
const eventBus = new EventBus();
const store = new Store({
  mission: null,
  parts: partsData.map(item => new PartFactory().create(item)),
  installedIds: [],
  lastResult: null,
  simStep: 0,
  simHistory: [],
  trackDistance: 0,
  lastMotionSpeed: 0
});

const compatibilityEngine = new CompatibilityEngine();
const scoreEngine = new ScoreEngine();
const vehicleSim = new VehicleSim();
const mentorSystem = new MentorSystem();
const soundManager = new SoundManager();
const learningGuide = new LearningGuide(learningPathData, partsData);

let simTimer = null;
let trackTimer = null;
let roadTrackPx = 0;

let mission = new MissionFactory().create(missionsData[0]);
store.patch({ mission });
renderMission(mission);
renderMissionButtons();
refreshUI();
updateLevelBadge();
bindLevelSwitcher();
updateLevelSwitcherUI(store.getState().mission.level);
bindHeroNav();
updateHeroNav('assemblyPanel');

function getInstalledParts() {
  const state = store.getState();
  return state.parts.filter(part => state.installedIds.includes(part.id));
}

function renderMissionButtons() {
  const box = document.getElementById('missionButtons');
  box.innerHTML = '';
  missionsData.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'mission-pill' + (store.getState().mission.id === item.id ? ' active' : '');
    btn.textContent = item.title;
    btn.addEventListener('click', () => {
      soundManager.click();
      selectMission(item.id);
    });
    box.appendChild(btn);
  });
}

function updateLevelBadge() {
  const currentMission = store.getState().mission;
  const levelEl = document.getElementById('levelBadge');
  const featureEl = document.getElementById('featureBadge');
  if (levelEl) levelEl.textContent = 'Level ' + currentMission.level;
  if (featureEl) featureEl.textContent = currentMission.recommendedFeatures + '+ features';
}

function selectMission(id) {
  mission = new MissionFactory().create(missionIndex.get(id));
  store.patch({ mission, installedIds: [], lastResult: null, simStep: 0, simHistory: [], trackDistance: 0, lastMotionSpeed: 0 });
  renderMission(mission);
  renderMissionButtons();
  updateLevelBadge();
  resetTrack();
  refreshUI();
  updateLevelSwitcherUI(mission.level);
}

function bindLevelSwitcher() {
  document.querySelectorAll('[data-level-switch]').forEach(btn => {
    btn.addEventListener('click', () => {
      const level = Number(btn.dataset.levelSwitch);
      const match = missionsData.find(m => Number(m.level) === level);
      if (!match) return;

      soundManager.click();
      selectMission(match.id);
      updateLevelSwitcherUI(level);
    });
  });
}

document.getElementById('missionStartBtn')?.addEventListener('click', () => {
  soundManager.click();

  const level1Mission = missionsData.find(m => Number(m.level) === 1);
  if (level1Mission) {
    selectMission(level1Mission.id);
    updateLevelSwitcherUI(1);
  }

  jumpToSection('learningPanel');
});

document.getElementById('simulateBtn')?.addEventListener('click', () => {
  soundManager.click();
  jumpToSection('testTrackPanel');
});

function updateLevelSwitcherUI(activeLevel) {
  document.querySelectorAll('[data-level-switch]').forEach(btn => {
    btn.classList.toggle('active', Number(btn.dataset.levelSwitch) === Number(activeLevel));
  });
}

function computeSimFrame() {
  const state = store.getState();
  return vehicleSim.run({
    mission: state.mission,
    installedParts: getInstalledParts(),
    compatibilityEngine,
    scoreEngine,
    step: state.simStep,
    history: state.simHistory
  });
}

function renderKidFriendlyDiagnostics(result, failureCatalog) {
  const faultList = document.getElementById('faultList');
  const mentorPrompt = document.getElementById('mentorPrompt');
  if (!faultList || !mentorPrompt) return;

  const failures = result?.failures || [];
  faultList.innerHTML = '';

  if (!failures.length) {
    faultList.innerHTML = `
      <li class="fault-item good">
        <strong>Healthy Car</strong>
        <span>Your car has no major problems right now.</span>
        <em>Great job. Try testing another level or adding smarter features.</em>
      </li>
    `;
    mentorPrompt.textContent = 'Great job. Your car is working well. Try adding smart upgrades or test a harder level.';
    return;
  }

  const friendlyMessages = failures.map(failure => {
    const key = String(
      failure.code ||
      failure.id ||
      failure.type ||
      failure.title ||
      ''
    ).toLowerCase();

    const rawText = String(
      failure.message ||
      failure.label ||
      failure.name ||
      ''
    ).toLowerCase();

    const data = failure.data || failure.details || {};

    if (
      key.includes('missing') ||
      rawText.includes('missing')
    ) {
      return {
        title: 'Important Parts Missing',
        text: 'Your car is still missing some important parts.',
        hint: 'Open the Learning Guide and install the basic systems first.'
      };
    }

    if (
      key.includes('battery') ||
      rawText.includes('battery')
    ) {
      return {
        title: 'Battery Problem',
        text: 'The battery power is too low or too weak.',
        hint: 'Try adding a better battery or removing parts that use too much power.'
      };
    }

    if (
      key.includes('brake') ||
      rawText.includes('brake')
    ) {
      return {
        title: 'Brake Safety Problem',
        text: 'The car may not stop safely yet.',
        hint: 'Try installing stronger brakes or brake safety parts.'
      };
    }

    if (
      key.includes('heat') ||
      key.includes('cool') ||
      key.includes('radiator') ||
      rawText.includes('heat') ||
      rawText.includes('cool')
    ) {
      return {
        title: 'Cooling Problem',
        text: 'The car may get too hot while running.',
        hint: 'Try adding better cooling parts such as a radiator upgrade.'
      };
    }

    if (
      key.includes('engine') ||
      rawText.includes('engine')
    ) {
      return {
        title: 'Engine Problem',
        text: 'The engine setup is not strong enough yet.',
        hint: 'Check whether the engine and power parts are installed properly.'
      };
    }

    if (
      key.includes('fuel') ||
      rawText.includes('fuel')
    ) {
      return {
        title: 'Fuel Problem',
        text: 'The car may not have enough fuel support.',
        hint: 'Check the fuel tank and energy parts.'
      };
    }

    return {
      title: 'System Warning',
      text: 'One part of the car still needs attention.',
      hint: 'Try changing the installed parts and run the scan again.'
    };
  });

  friendlyMessages.forEach(item => {
    const li = document.createElement('li');
    li.className = 'fault-item';
    li.innerHTML = `
      <strong>${item.title}</strong>
      <span>${item.text}</span>
      <em>${item.hint}</em>
    `;
    faultList.appendChild(li);
  });

  const firstHint = friendlyMessages[0]?.hint || 'Try improving one system at a time.';
  mentorPrompt.textContent = 'Car Doctor says: ' + firstHint;
}

function refreshUI() {
  const state = store.getState();
  const installedIds = new Set(state.installedIds);

  renderParts(state.parts, installedIds, (partId) => togglePart(partId));

  const result = state.lastResult || computeSimFrame();

  renderTelemetry({
    metrics: result.metrics,
    scores: result.scores,
    installedCount: state.installedIds.length,
    requiredCount: state.mission.requiredParts.length,
    sim: {
      ...result.sim,
      trackDistance: state.trackDistance,
      missionId: state.mission.id
    }
  });
 renderKidFriendlyDiagnostics(result, failureCatalog);

  document.getElementById('missionStatus').textContent =
    result.failures.length ? (result.canDrive ? 'Needs Tuning' : 'Not Ready') : 'Ready';

  document.getElementById('levelBadge').textContent = 'Level ' + state.mission.level;
  document.getElementById('featureBadge').textContent = state.mission.recommendedFeatures + '+ features';

  updateCarReplica(state.installedIds);
  updateTrackCarInstallState(state.installedIds);

  updateCarReplica(state.installedIds);
  updateLevelFeatures(state.installedIds);
  updateTrackCarInstallState(state.installedIds);

const learningProgress = learningGuide.getProgress(state.mission.level, state.installedIds);
renderLearningPanel(learningProgress);
}

function updateCarReplica(installedIds) {
  const set = new Set(installedIds);
  const layers = {
    layerChassis: true,
    layerEngine: set.has('engine_i4_basic'),
    layerGearbox: set.has('gearbox_manual_5'),
    layerBattery: set.has('battery_12v_basic'),
    layerRadiator: set.has('radiator_small'),
    layerFuelTank: set.has('fuel_tank_40l'),
    layerWheels: set.has('wheel_15_standard') || set.has('alloy_wheels') || set.has('offroad_tires'),
    layerBrakes: set.has('brake_set_city') || set.has('sport_brakes') || set.has('abs_module'),
    layerSteering: set.has('steering_rack_basic'),
    layerSuspension: set.has('suspension_soft_city') || set.has('offroad_suspension'),
    layerHeadlights: set.has('headlights_basic') || set.has('roof_lights')
  };

  Object.entries(layers).forEach(([id, visible]) => {
    const el = document.getElementById(id);
    if (el) el.style.opacity = visible ? '1' : '0';
  });

  const labels = {
    labelEngine: 'layerEngine',
    labelBattery: 'layerBattery',
    labelRadiator: 'layerRadiator',
    labelWheels: 'layerWheels',
    labelBrakes: 'layerBrakes',
    labelFuelTank: 'layerFuelTank',
    labelSteering: 'layerSteering',
    labelSuspension: 'layerSuspension',
    labelHeadlights: 'layerHeadlights'
  };

  Object.entries(labels).forEach(([labelId, layerId]) => {
    const label = document.getElementById(labelId);
    const layer = document.getElementById(layerId);
    if (label && layer) label.classList.toggle('show', layer.style.opacity === '1');
  });

  applyLevelCarLook();
}

function updateLevelFeatures(installedIds) {
  const set = new Set(installedIds);
  const currentMission = store.getState().mission;
  const car = document.getElementById('trackCar');
  if (!car) return;

  car.classList.remove('level-1', 'level-2', 'level-3');
  car.classList.add(`level-${currentMission.level}`);

  const roofRailsOn = set.has('roof_rack');
  const rearCameraOn = set.has('rear_camera') || set.has('trail_camera');
  const sensorsOn = set.has('parking_sensors');
  const acOn = set.has('air_conditioning_basic') || set.has('dual_climate_ac');
  const familyOn = set.has('child_lock_system') || set.has('seatbelt_basic') || set.has('airbag_system');

  document.querySelectorAll('.roof-rail').forEach(el => {
    el.classList.toggle('show', roofRailsOn && currentMission.level >= 2);
  });

  document.querySelectorAll('.rear-camera-lens').forEach(el => {
    el.classList.toggle('show', rearCameraOn && currentMission.level >= 2);
  });

  document.querySelectorAll('.sensor-dot').forEach(el => {
    el.classList.toggle('show', sensorsOn && currentMission.level >= 2);
  });

  document.querySelectorAll('.ac-strip').forEach(el => {
    el.classList.toggle('show', acOn && currentMission.level >= 2);
  });

  document.querySelectorAll('.family-badge').forEach(el => {
    el.classList.toggle('show', familyOn && currentMission.level >= 2);
  });
}

function updateTrackCarInstallState(installedIds) {
  const set = new Set(installedIds);
  const car = document.getElementById('trackCar');
  if (!car) return;

  const mission = store.getState().mission;

  car.classList.remove('level-1', 'level-2', 'level-3');
  car.classList.add(`level-${mission.level}`);

  const flags = {
    'has-headlights': set.has('headlights_basic') || set.has('roof_lights'),
    'has-suspension': set.has('suspension_soft_city') || set.has('offroad_suspension'),
    'has-brakes': set.has('brake_set_city') || set.has('sport_brakes') || set.has('abs_module'),
    'has-camera': set.has('rear_camera') || set.has('trail_camera'),
    'has-sensors': set.has('parking_sensors'),
    'has-ac': set.has('air_conditioning_basic') || set.has('dual_climate_ac'),
    'has-family': set.has('seatbelt_basic') || set.has('child_lock_system') || set.has('airbag_system'),
    'has-roof': set.has('roof_rack'),
    'has-offroad': set.has('offroad_tires') || set.has('offroad_suspension'),
    'has-sport': set.has('turbocharger') || set.has('sport_exhaust'),
    'has-alloy': set.has('alloy_wheels'),
    'has-cargo': set.has('cargo_box') || set.has('roof_tent'),
    'has-bullbar': set.has('bull_bar'),
    'has-adventure-lights': set.has('roof_lights') || set.has('camp_lights')
  };

  Object.entries(flags).forEach(([cls, active]) => {
    car.classList.toggle(cls, active);
  });
}

function updateHeroNav(activeId) {
  document.querySelectorAll('[data-nav-target]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.navTarget === activeId);
  });
}

function jumpToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (!el) return;

  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  el.classList.remove('section-pulse');
  requestAnimationFrame(() => {
    el.classList.add('section-pulse');
  });

  updateHeroNav(sectionId);
}

function bindHeroNav() {
  document.querySelectorAll('[data-nav-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof soundManager !== 'undefined' && soundManager.click) {
        soundManager.click();
      }
      jumpToSection(btn.dataset.navTarget);
    });
  });
}

function applyLevelCarLook() {
  const currentMission = store.getState().mission;
  const shell = document.getElementById('trackCar');
  if (!shell) return;

  shell.classList.remove('level-1', 'level-2', 'level-3');
  shell.classList.add(`level-${currentMission.level}`);
}

function resetTrack() {
  const car = document.getElementById('trackCar');
  const road = document.getElementById('trackRoad');
  const boundary = document.getElementById('trackBoundary');

  if (car) {
    car.classList.remove('running', 'stalled', 'was-running');
    car.style.left = '10%';
  }

  if (road) road.style.transform = 'translateX(0px)';
  if (boundary) boundary.style.transform = 'translateX(0px)';

  roadTrackPx = 0;
  document.getElementById('trackNote').textContent = 'Press Start Test to begin.';
}

function advanceTrack(speed) {
  const road = document.getElementById('trackRoad');
  const car = document.getElementById('trackCar');
  const note = document.getElementById('trackNote');

  const step = Math.max(0, speed) * 0.22;
  roadTrackPx += step;

  if (road) {
    road.style.transform = `translateX(${-Math.floor(roadTrackPx)}px)`;
  }

  if (car) {
    car.style.left = '18%';
  }

  if (note && speed > 0) {
    note.textContent = 'Vehicle running on extended track.';
  }
}

function stopTrackMotion() {
  if (trackTimer) {
    clearInterval(trackTimer);
    trackTimer = null;
  }
}

function updateTrack(sim) {
  const car = document.getElementById('trackCar');
  const note = document.getElementById('trackNote');
  if (!car || !note) return;

  const speedPct = Math.min(100, Math.max(0, sim?.speed || 0));
  const tempPct = Math.min(100, Math.max(0, sim?.temperature || 0));
  const battPct = Math.min(100, Math.max(0, sim?.batteryReserve || 0));
  const brakePct = Math.min(100, Math.max(0, (sim?.brakeMargin || 0) + 50));
  const q = (sel) => document.querySelector(sel);

  if (q('#gSpeed .gauge-fill span')) q('#gSpeed .gauge-fill span').style.width = speedPct + '%';
  if (q('#gSpeed strong')) q('#gSpeed strong').textContent = (sim?.speed || 0) + ' km/h';

  if (q('#gTemp .gauge-fill span')) q('#gTemp .gauge-fill span').style.width = tempPct + '%';
  if (q('#gTemp strong')) q('#gTemp strong').textContent = (sim?.temperature || 0) + '°C';

  if (q('#gBatt .gauge-fill span')) q('#gBatt .gauge-fill span').style.width = battPct + '%';
  if (q('#gBatt strong')) q('#gBatt strong').textContent = (sim?.batteryReserve || 0) + '%';

  if (q('#gBrake .gauge-fill span')) q('#gBrake .gauge-fill span').style.width = brakePct + '%';
  if (q('#gBrake strong')) q('#gBrake strong').textContent = (sim?.brakeMargin || 0) + ' margin';

  if (sim?.stall) {
    car.classList.remove('running');
    car.classList.add('stalled');
    note.textContent = 'Engine stalled. Check battery and cooling.';
    soundManager.stall();
    stopTrackMotion();
    return;
  }

  if ((sim?.speed || 0) > 0) {
    car.classList.add('running');
    car.classList.remove('stalled');
    note.textContent = 'Vehicle running toward checkpoint.';
    if (!car.classList.contains('was-running')) {
      soundManager.startEngine();
      car.classList.add('was-running');
    }
    advanceTrack(sim.speed);
  } else {
    car.classList.remove('running', 'stalled', 'was-running');
    note.textContent = 'Vehicle idle.';
    stopTrackMotion();
  }
}

function togglePart(partId) {
  const state = store.getState();
  const wasInstalled = state.installedIds.includes(partId);

  const installedIds = wasInstalled
    ? state.installedIds.filter(id => id !== partId)
    : [...state.installedIds, partId];

  if (!wasInstalled) soundManager.install();
  else soundManager.remove();

  store.patch({ installedIds, lastResult: null });
  eventBus.emit('part:toggled', { partId, installedIds });
  refreshUI();
}

function tickSimulation() {
  const state = store.getState();
  const current = computeSimFrame();
  const nextStep = state.simStep + 1;
  const nextHistory = [...state.simHistory, current.sim].slice(-20);

  store.patch({
    lastResult: current,
    simStep: nextStep,
    simHistory: nextHistory,
    lastMotionSpeed: current.sim?.speed || 0
  });

  eventBus.emit('simulation:tick', current);
  refreshUI();
  updateTrack(current.sim);
}

function runSimulation() {
  soundManager.startEngine();

  if (simTimer) clearInterval(simTimer);
  if (trackTimer) clearInterval(trackTimer);

  resetTrack();

  store.patch({
    simStep: 0,
    simHistory: [],
    lastMotionSpeed: 0
  });

  const result = computeSimFrame();
  if (result.failures.length > 0) soundManager.warning();
  else soundManager.success();

  tickSimulation();

  simTimer = setInterval(() => {
    const state = store.getState();

    if (state.simStep >= 20 || state.lastResult?.scores?.overall >= 90) {
      clearInterval(simTimer);
      simTimer = null;
      if (trackTimer) {
        clearInterval(trackTimer);
        trackTimer = null;
      }
      if (state.lastResult?.scores?.overall >= 90) soundManager.success();

      const note = document.getElementById('trackNote');
      if (note && !state.lastResult?.sim?.stall) {
        note.textContent = 'Test complete. Press Run Test to start again.';
      }
      return;
    }

    tickSimulation();
  }, 650);

  trackTimer = setInterval(() => {
    const state = store.getState();
    if ((state.lastMotionSpeed || 0) > 0) {
      advanceTrack(state.lastMotionSpeed);
    }
  }, 180);
}

function initSound() {
  soundManager.ensure();
  document.querySelectorAll('button').forEach(b => {
    b.addEventListener('mouseenter', () => soundManager.click());
  });
}

bindHomeActions({
  onStart: () => {
    soundManager.click();
    runSimulation();
  }
});

document.getElementById('simulateBtn')?.addEventListener('click', () => {
  soundManager.click();
  runSimulation();
});

document.getElementById('startTestBtn')?.addEventListener('click', () => {
  soundManager.click();
  runSimulation();
});

document.getElementById('diagnoseBtn')?.addEventListener('click', () => {
  soundManager.click();
  const state = store.getState();
  const result = state.lastResult || computeSimFrame();
  renderKidFriendlyDiagnostics(result, failureCatalog);
  jumpToSection('diagnosticsPanel');
});

document.getElementById('quickStartBtn')?.addEventListener('dblclick', () => {
  const required = store.getState().mission.requiredParts;
  store.patch({ installedIds: [...required], lastResult: null });
  soundManager.success();
  refreshUI();
});

document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
  soundManager.click();
  const root = document.documentElement;
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
});

document.addEventListener('click', initSound, { once: true });