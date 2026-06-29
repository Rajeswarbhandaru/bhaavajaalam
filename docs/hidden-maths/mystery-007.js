(function() {
  'use strict';

  const steps = [
    'step-curiosity', 'step-observation', 'step-experiment',
    'step-prediction', 'step-discovery', 'step-explanation',
    'step-applications', 'step-challenge', 'step-celebration'
  ];

  const mathSymbols = ['∑', 'π', '√', '∞', '∫', 'Δ', 'θ', 'λ', '≈', '≠', '±', '÷', '×', '²', '³', '∂', '∇', '∴', '∵', '∠', '⊥', '∥', '∪', '∩', '⊂', '∈', '∀', '∃', '∅', 'ℵ'];
  let currentStep = 0;
  let quizScore = 0;
  let quizAnswered = 0;

  const progressFill = document.getElementById('progressFill');
  const progressLabel = document.getElementById('progressLabel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const floatingSymbolsContainer = document.getElementById('floatingSymbols');
  const particleContainer = document.getElementById('particleContainer');
  const quizScoreEl = document.getElementById('quizScore');
  const scoreValue = document.getElementById('scoreValue');

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function spawnFloatingSymbol() {
    const symbol = document.createElement('span');
    symbol.className = 'floating-symbol';
    symbol.textContent = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
    symbol.style.left = randomBetween(0, 100) + '%';
    symbol.style.fontSize = randomBetween(0.9, 2.2) + 'rem';
    symbol.style.animationDuration = randomBetween(15, 35) + 's';
    symbol.style.animationDelay = randomBetween(0, 5) + 's';
    symbol.style.opacity = randomBetween(0.08, 0.22);
    floatingSymbolsContainer.appendChild(symbol);
    const duration = parseFloat(symbol.style.animationDuration) + parseFloat(symbol.style.animationDelay);
    setTimeout(() => { if (symbol.parentNode) symbol.remove(); }, duration * 1000);
  }

  function initFloatingSymbols() {
    const count = window.innerWidth < 768 ? 6 : 12;
    for (let i = 0; i < count; i++) {
      const symbol = document.createElement('span');
      symbol.className = 'floating-symbol';
      symbol.textContent = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
      symbol.style.left = randomBetween(0, 100) + '%';
      symbol.style.fontSize = randomBetween(0.9, 2.2) + 'rem';
      symbol.style.animationDuration = randomBetween(15, 35) + 's';
      symbol.style.animationDelay = randomBetween(-20, 0) + 's';
      symbol.style.opacity = randomBetween(0.08, 0.22);
      floatingSymbolsContainer.appendChild(symbol);
    }
    setInterval(spawnFloatingSymbol, 4000);
  }

  function createParticle() {
    const particle = document.createElement('div');
    const size = randomBetween(2, 5);
    const isGlow = Math.random() > 0.7;
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${isGlow ? 'rgba(0, 217, 255, 0.6)' : 'rgba(255, 255, 255, 0.15)'};
      ${isGlow ? 'box-shadow: 0 0 6px rgba(0, 217, 255, 0.4);' : ''}
      left: ${randomBetween(0, 100)}%;
      top: ${randomBetween(0, 100)}%;
      pointer-events: none;
      animation: particleFloat ${randomBetween(20, 40)}s ease-in-out infinite;
      animation-delay: ${randomBetween(-20, 0)}s;
    `;
    particleContainer.appendChild(particle);
  }

  function initParticles() {
    const count = window.innerWidth < 768 ? 20 : 40;
    for (let i = 0; i < count; i++) createParticle();
  }

  function updateProgress() {
    const pct = ((currentStep + 1) / steps.length) * 100;
    progressFill.style.width = pct + '%';
    progressLabel.textContent = 'Step ' + (currentStep + 1) + ' of ' + steps.length;
    prevBtn.style.display = currentStep === 0 ? 'none' : 'inline-flex';
    nextBtn.textContent = currentStep === steps.length - 1 ? 'Finish' : 'Next';
  }

  function showStep(index) {
    document.querySelectorAll('.mystery-step').forEach((el, i) => {
      el.classList.remove('active');
      if (i === index) {
        el.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
    updateProgress();
 }

  function nextStep() {
    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  }

  // ============================================
  // DROP SIMULATION
  // ============================================
  const canvas = document.getElementById('dropCanvas');
  const ctx = canvas.getContext('2d');
  const colorSlider = document.getElementById('colorSlider');
  const colorDisplay = document.getElementById('colorDisplay');
  const nDisplay = document.getElementById('nDisplay');
  const readoutIncident = document.getElementById('readoutIncident');
  const readoutExit = document.getElementById('readoutExit');
  const readoutDev = document.getElementById('readoutDev');
  const btnTrace = document.getElementById('btnTrace');
  const btnResetDrop = document.getElementById('btnResetDrop');
  const swatches = [0, 1, 2, 3].map(i => document.getElementById('swatch' + i));

  const W = 400;
  const H = 300;
  const DROP_CX = 200;
  const DROP_CY = 150;
  const DROP_R = 70;

  const colors = [
    { name: 'Red', n: 1.331, rgb: '#ff5c5c', exit: 42, incident: 59.4 },
    { name: 'Green', n: 1.336, rgb: '#5cff85', exit: 41.5, incident: 59.1 },
    { name: 'Blue', n: 1.340, rgb: '#5cabff', exit: 41.0, incident: 58.8 },
    { name: 'Violet', n: 1.344, rgb: '#d95cff', exit: 40.5, incident: 58.5 }
  ];

  function drawDrop() {
    const cIdx = parseInt(colorSlider.value, 10);
    const c = colors[cIdx];

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, W, H);

    // Draw drop
    ctx.beginPath();
    ctx.arc(DROP_CX, DROP_CY, DROP_R, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 217, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw light path
    const incidentAngle = c.incident; // approximate for visual
    const toRad = d => d * Math.PI / 180;
    const refracted = Math.asin(Math.sin(toRad(incidentAngle)) / c.n) * 180 / Math.PI;

    // Entry point
    const entryAngle = toRad(incidentAngle - 90);
    const ex = DROP_CX + DROP_R * Math.cos(entryAngle);
    const ey = DROP_CY + DROP_R * Math.sin(entryAngle);

    // Inside drop, hit back
    const refractedRad = toRad(refracted - 90);
    const innerDist = 2 * DROP_R * Math.cos(toRad(refracted));
    const bx = ex + innerDist * Math.cos(refractedRad);
    const by = ey + innerDist * Math.sin(refractedRad);

    // Exit point
    const exitAngle = entryAngle + Math.PI;
    const xx = DROP_CX + DROP_R * Math.cos(exitAngle);
    const xy = DROP_CY + DROP_R * Math.sin(exitAngle);

    // Draw incoming ray
    ctx.strokeStyle = 'rgba(255, 200, 87, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, ey);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    // Draw inside ray
    ctx.strokeStyle = c.rgb;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(bx, by);
    ctx.stroke();

    // Draw reflected ray
    ctx.strokeStyle = c.rgb;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(xx, xy);
    ctx.stroke();

    // Draw outgoing ray
    ctx.strokeStyle = c.rgb;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(xx, xy);
    ctx.lineTo(W, xy);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('In', 30, ey - 8);
    ctx.fillText('Out', W - 30, xy - 8);
    ctx.fillText('Bend', DROP_CX, DROP_CY - 80);

    // Angle arc
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(DROP_CX, DROP_CY, 40, Math.PI / 2, Math.PI / 2 + toRad(c.exit));
    ctx.stroke();
  }

  function updateDrop() {
    const cIdx = parseInt(colorSlider.value, 10);
    const c = colors[cIdx];

    colorDisplay.textContent = c.name;
    nDisplay.textContent = c.n.toFixed(3);
    readoutIncident.textContent = c.incident.toFixed(1) + '°';
    readoutExit.textContent = c.exit + '°';
    readoutDev.textContent = (180 - c.exit) + '°';

    swatches.forEach((s, i) => {
      s.classList.toggle('active', i === cIdx);
    });

    drawDrop();
  }

  colorSlider.addEventListener('input', updateDrop);
  btnTrace.addEventListener('click', drawDrop);
  btnResetDrop.addEventListener('click', () => {
    colorSlider.value = 0;
    updateDrop();
  });

  // ============================================
  // PREDICTION
  // ============================================
  const gaugeSlider = document.getElementById('gaugeSlider');
  const gaugeValue = document.getElementById('gaugeValue');

  function updateGauge() {
    gaugeValue.textContent = gaugeSlider.value;
  }

  gaugeSlider.addEventListener('input', function() {
    AudioEngine.tick();
    updateGauge();
  });

  // ============================================
  // QUIZ
  // ============================================
  const quizQuestions = [
    { id: 'quizQ1', feedback: 'feedbackQ1', correct: 2 },
    { id: 'quizQ2', feedback: 'feedbackQ2', correct: 2 },
    { id: 'quizQ3', feedback: 'feedbackQ3', correct: 2 }
  ];

  function initQuiz() {
    quizQuestions.forEach((q, idx) => {
      const container = document.getElementById(q.id);
      const options = container.querySelectorAll('.quiz-option');
      const feedback = document.getElementById(q.feedback);

      options.forEach((opt, optIdx) => {
        opt.addEventListener('click', () => {
          if (opt.classList.contains('disabled')) return;
          const isCorrect = optIdx === q.correct;
          options.forEach(o => o.classList.add('disabled'));
          opt.classList.add(isCorrect ? 'correct' : 'incorrect');
          AudioEngine.correct();
          feedback.className = 'quiz-feedback ' + (isCorrect ? 'correct' : 'incorrect');
          if (!isCorrect) {
            AudioEngine.incorrect();
            options[q.correct].classList.add('correct');
          }
          feedback.textContent = isCorrect ? 'Correct! Well done.' : 'Not quite. The answer is highlighted.';
          feedback.className = 'quiz-feedback ' + (isCorrect ? 'correct' : 'incorrect');
          quizAnswered++;
          if (quizAnswered >= quizQuestions.length) {
            showScore();
          } else {
            setTimeout(() => nextQuizQuestion(idx), 1200);
          }
        });
      });
    });
  }

  function nextQuizQuestion(currentIdx) {
    const current = document.getElementById(quizQuestions[currentIdx].id);
    current.classList.remove('active');
    if (currentIdx + 1 < quizQuestions.length) {
      document.getElementById(quizQuestions[currentIdx + 1].id).classList.add('active');
    }
  }

  function showScore() {
    quizScoreEl.style.display = 'inline-flex';
    scoreValue.textContent = quizScore + '/' + quizQuestions.length;
  }

  // ============================================
  // CELEBRATION
  // ============================================
  const celebrationVisual = document.getElementById('celebrationVisual');

  function initCelebration() {
    AudioEngine.celebrate();
    const colors = ['var(--accent-cyan)', 'var(--accent-pink)', 'var(--accent-lime)', 'var(--accent-gold)', 'var(--accent-violet)'];
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.className = 'celebration-particle';
      p.style.left = randomBetween(0, 100) + '%';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.width = randomBetween(6, 12) + 'px';
      p.style.height = p.style.width;
      p.style.animationDelay = randomBetween(0, 2) + 's';
      p.style.animationDuration = randomBetween(2, 4) + 's';
      celebrationVisual.appendChild(p);
   }
  }

  // ============================================
  // BUTTON LISTENERS
  // ============================================
  nextBtn.addEventListener('click', function() {
    var lbl = nextBtn.textContent.trim().toLowerCase();
    if (lbl === 'begin') { AudioEngine.begin(); }
    else if (lbl === 'finish') { AudioEngine.celebrate(); }
    else { AudioEngine.next(); }
    nextStep();
  });
  nextBtn.addEventListener('mouseenter', AudioEngine.hover);
  prevBtn.addEventListener('click', function() {
    AudioEngine.back();
    prevStep();
  });
  prevBtn.addEventListener('mouseenter', AudioEngine.hover);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'Enter') nextStep();
    if (e.key === 'ArrowLeft') prevStep();
  });

  // ============================================
  // INIT
  // ============================================
  function init() {
    initFloatingSymbols();
    initParticles();
    updateDrop();
    initQuiz();
    initCelebration();
    updateProgress();
 }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();