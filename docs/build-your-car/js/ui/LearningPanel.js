function badge(text, tone = '') {
  return `<span class="learn-badge ${tone}">${text}</span>`;
}

export function renderLearningPanel(progress) {
  const root = document.getElementById('learningPanel');
  if (!root || !progress) return;

  const meter = `${progress.done}/${progress.total}`;

  const pills = progress.mode === 'minimum'
    ? progress.steps.map(step => `
        <div class="learn-step ${step.complete ? 'done' : ''}">
          <div class="learn-step-icon">${step.icon}</div>
          <div>
            <h4>${step.title}</h4>
            <p>${step.explanation}</p>
          </div>
          ${badge(step.complete ? 'Ready' : 'Needed', step.complete ? 'good' : 'warn')}
        </div>
      `).join('')
    : progress.groups.map(group => `
        <div class="learn-step ${group.complete ? 'done' : ''}">
          <div class="learn-step-icon">${group.icon}</div>
          <div>
            <h4>${group.title}</h4>
            <p>${group.explanation}</p>
          </div>
          ${badge(`${group.installedCount}/${group.total}`, group.complete ? 'good' : 'info')}
        </div>
      `).join('');

  const callout = `
    <div class="learn-callout ${progress.calloutTone || 'info'}">
      <strong>${progress.level === 1 ? '' : 'Level guide: '}</strong>${progress.calloutText}
    </div>
  `;

  const checks = progress.checks && progress.checks.length
    ? `<div class="learn-checks">${progress.checks.map(item => `<span>${item}</span>`).join('')}</div>`
    : '';

  root.innerHTML = `
    <div class="learn-panel card glass">
      <div class="section-head">
        <div>
          <p class="eyebrow">Learning Guide</p>
          <h3>${progress.title}</h3>
        </div>
        ${badge(`Progress ${meter}`, 'info')}
      </div>

      <p class="learn-intro">${progress.intro}</p>
      <div class="learn-progress"><span style="width:${progress.percent}%"></span></div>
      <p class="learn-summary">${progress.summary}</p>

      ${callout}
      ${checks}

      <div class="learn-grid">${pills}</div>
    </div>
  `;
}