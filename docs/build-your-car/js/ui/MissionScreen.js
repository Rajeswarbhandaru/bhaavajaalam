export function renderMission(mission) {
  document.getElementById('missionTitle').textContent = mission.title;
  document.getElementById('missionDescription').textContent = mission.description;
  document.getElementById('missionStatus').textContent = mission.status;
  document.getElementById('missionStats').innerHTML = '<div class="stat-chip"><strong>Budget</strong><p>' + mission.budget + '</p></div><div class="stat-chip"><strong>Required Parts</strong><p>' + mission.requiredParts.length + '</p></div><div class="stat-chip"><strong>Minimum Battery</strong><p>' + mission.targets.minBattery + '</p></div><div class="stat-chip"><strong>Minimum Brake Force</strong><p>' + mission.targets.minBrakeForce + '</p></div>';
}