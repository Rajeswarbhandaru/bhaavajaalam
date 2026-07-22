export function bindHomeActions({ onStart }) {
  document.getElementById('quickStartBtn')?.addEventListener('click', onStart);
  document.getElementById('missionStartBtn')?.addEventListener('click', onStart);
}