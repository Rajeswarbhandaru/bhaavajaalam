export function renderTelemetry({ metrics, scores, installedCount, requiredCount, sim }) {
  document.getElementById('buildReadiness').textContent = installedCount + ' / ' + requiredCount + ' installed';
  const budgetRatio = Math.min(100, Math.round(metrics.totalCost / 52));
  const coolingRatio = Math.max(0, Math.min(100, 50 + (metrics.totalCooling - metrics.totalHeatLoad) * 4));
  const batteryRatio = Math.max(0, Math.min(100, metrics.totalBattery));
  const brakeRatio = Math.max(0, Math.min(100, metrics.totalBrakeForce));
  const setBar = (id, value, label) => {
    document.getElementById(id).style.width = value + '%';
    document.getElementById(label).textContent = value + '%';
  };
  setBar('budgetBar', budgetRatio, 'budgetText');
  setBar('coolingBar', coolingRatio, 'coolingText');
  setBar('batteryBar', batteryRatio, 'batteryText');
  setBar('brakeBar', brakeRatio, 'brakeText');
  document.getElementById('telemetryPanel').innerHTML = '<div class="telemetry-line"><strong>Total Cost:</strong> ' + metrics.totalCost + '</div><div class="telemetry-line"><strong>Heat Load / Cooling:</strong> ' + metrics.totalHeatLoad + ' / ' + metrics.totalCooling + '</div><div class="telemetry-line"><strong>Battery Reserve:</strong> ' + metrics.totalBattery + '</div><div class="telemetry-line"><strong>Brake Force:</strong> ' + metrics.totalBrakeForce + '</div><div class="telemetry-line"><strong>Speed:</strong> ' + (sim?.speed || 0) + ' km/h</div><div class="telemetry-line"><strong>Engine Temp:</strong> ' + (sim?.temperature || 0) + '°C</div><div class="telemetry-line"><strong>Overall Engineering Score:</strong> ' + scores.overall + '</div>';
  updateTrack(sim);
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
  const leftPos = 6 + Math.min(70, (sim?.speed || 0) / 120 * 70);
  car.style.left = leftPos + '%';
  if (sim?.stall) {
    car.classList.remove('running');
    car.classList.add('stalled');
    note.textContent = 'Engine stalled. Check battery and cooling.';
  } else if ((sim?.speed || 0) > 0) {
    car.classList.add('running');
    car.classList.remove('stalled');
    note.textContent = 'Vehicle running.';
  } else {
    car.classList.remove('running', 'stalled');
    note.textContent = 'Vehicle idle.';
  }
}