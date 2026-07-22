export function renderParts(parts, installedIds, onToggle) {
  const grid = document.getElementById('partsGrid');
  grid.innerHTML = '';
  parts.forEach(part => {
    const article = document.createElement('article');
    article.className = 'part-card ' + (installedIds.has(part.id) ? 'installed' : '');
    article.innerHTML = '<div><p class="eyebrow">' + part.category + '</p><h4>' + part.name + '</h4></div><div class="part-meta"><span>Cost ' + part.cost + '</span><span>' + part.massKg + ' kg</span></div><div class="part-meta"><span>Reliability ' + part.reliability + '</span><span>' + (part.required ? 'Required' : 'Optional') + '</span></div><button>' + (installedIds.has(part.id) ? 'Remove' : 'Install') + '</button>';
    article.querySelector('button').addEventListener('click', () => onToggle(part.id));
    grid.appendChild(article);
  });
}