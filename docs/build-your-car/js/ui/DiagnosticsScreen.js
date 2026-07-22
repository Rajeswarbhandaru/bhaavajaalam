export function renderDiagnostics({ result, failureCatalog, mentorPrompt }) {
  const faultList = document.getElementById('faultList');
  faultList.innerHTML = '';
  if (!result.failures.length) {
    const li = document.createElement('li');
    li.textContent = result.canDrive ? 'No active faults. The vehicle is stable.' : 'Vehicle not ready yet.';
    faultList.appendChild(li);
  } else {
    result.failures.forEach(failure => {
      const info = failureCatalog.find(item => item.id === failure.id);
      const li = document.createElement('li');
      li.innerHTML = '<strong>' + (info?.title || failure.id) + '</strong><br><span>' + JSON.stringify(failure.details) + '</span>';
      faultList.appendChild(li);
    });
  }
  document.getElementById('mentorPrompt').textContent = mentorPrompt;
}