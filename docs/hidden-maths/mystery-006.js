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
      background: ${isGlow ? 'rgba(255, 200, 87, 0.6)' : 'rgba(255, 255, 255, 0.15)'};
      ${isGlow ? 'box-shadow: 0 0 6px rgba(255, 200, 87, 0.4);' : ''}
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
  // LAUNCH SIMULATION
  // ============================================
  const canvas = document.getElementById('launchCanvas');
  const ctx = canvas.getContext('2d');
  const angleSlider = document.getElementById('angleSlider');
  const powerSlider = document.getElementById('powerSlider');
  const angleDisplay = document.getElementById('angleDisplay');
  const powerDisplay = document.getElementById('powerDisplay');
  const angleLine = document.getElementById('angleLine');
  const simAngle = document.getElementById('simAngle');
  const simPower = document.getElementById('simPower');
  const simRange = document.getElementById('simRange');
  const simHeight = document.getElementById('simHeight');
  const simTime = document.getElementById('simTime');
  const btnLaunch = document.getElementById('btnLaunch');
  const btnResetLaunch = document.getElementById('btnResetLaunch');

  const W = 480;
  const H = 320;
  const G = 9.8;
  const SCALE = 2; // metres per pixel

  let animating = false;
  let rocketPos = null;

  function toRad(deg) {
    return deg * Math.PI / 180;
  }

  function calculateTrajectory() {
    const angle = parseInt(angleSlider.value, 10);
    const v0 = parseInt(powerSlider.value, 10);
    const theta = toRad(angle);

    const vx = v0 * Math.cos(theta);
    const vy = v0 * Math.sin(theta);
    const tFlight = (2 * vy) / G;
    const range = vx * tFlight;
    const maxH = (vy * vy) / (2 * G);

    return { angle, v0, vx, vy, tFlight, range, maxH };
  }

  function updateReadouts() {
    const t = calculateTrajectory();
    simAngle.textContent = t.angle + '°';
    simPower.textContent = t.v0 + ' m/s';
    simRange.textContent = Math.round(t.range) + ' m';
    simHeight.textContent = Math.round(t.maxH) + ' m';
    simTime.textContent = t.tFlight.toFixed(1) + ' s';

    angleDisplay.textContent = t.angle + '°';
    powerDisplay.textContent = t.v0 + ' m/s';

    // Angle visual rotation
    angleLine.style.transform = `rotate(-${t.angle}deg)`;

    // Redraw static preview
    drawPreview(t);
  }

  function drawPreview(t) {
    ctx.clearRect(0, 0, W, H);

    // Sky
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, W, H);

    // Ground
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(0, H - 20, W, 20);

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < W; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H - 20); ctx.stroke();
    }
    for (let i = 0; i < H - 20; i += 40) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke();
    }

    // Draw parabola path
    ctx.strokeStyle = 'rgba(255, 200, 87, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const tFrac = (t.tFlight * i) / 100;
      const x = t.vx * tFrac;
      const y = t.vy * tFrac - 0.5 * G * tFrac * tFrac;
      const px = x / SCALE;
      const py = (H - 20) - (y / SCALE);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw rocket at start
    drawRocket(0, 0, t.angle);
  }

  function drawRocket(x, y, angle) {
    const px = x / SCALE;
    const py = (H - 20) - (y / SCALE);

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(-toRad(angle));

    // Body
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-3, -12, 6, 24);

    // Nose
    ctx.fillStyle = '#ffc857';
    ctx.beginPath();
    ctx.moveTo(-3, -12);
    ctx.lineTo(0, -18);
    ctx.lineTo(3, -12);
    ctx.fill();

    // Fins
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(-6, 8, 4, 6);
    ctx.fillRect(2, 8, 4, 6);

    // Flame if animating
    if (animating) {
      ctx.fillStyle = '#ff5cab';
      ctx.beginPath();
      ctx.moveTo(-3, 12);
      ctx.lineTo(0, 12 + Math.random() * 10 + 8);
      ctx.lineTo(3, 12);
      ctx.fill();
    }

    ctx.restore();
  }

  function animateLaunch() {
    const t = calculateTrajectory();
    let startTime = null;
    animating = true;

    function frame(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;

      if (elapsed >= t.tFlight) {
        animating = false;
        drawPreview(t);
        return;
      }

      const x = t.vx * elapsed;
      const y = t.vy * elapsed - 0.5 * G * elapsed * elapsed;

      ctx.clearRect(0, 0, W, H);
      drawPreview(t);
      drawRocket(x, y, t.angle);

      // Draw trail dot
      ctx.fillStyle = 'rgba(255, 200, 87, 0.8)';
      ctx.beginPath();
      ctx.arc(x / SCALE, (H - 20) - (y / SCALE), 2, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  angleSlider.addEventListener('input', updateReadouts);
  powerSlider.addEventListener('input', updateReadouts);
  btnLaunch.addEventListener('click', animateLaunch);
  btnResetLaunch.addEventListener('click', updateReadouts);

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
    { id: 'quizQ1', feedback: 'feedbackQ1', correct: 1 },
    { id: 'quizQ2', feedback: 'feedbackQ2', correct: 1 },
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
    const colors = ['var(--accent-gold)', 'var(--accent-pink)', 'var(--accent-lime)', 'var(--accent-cyan)', 'var(--accent-violet)'];
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
    updateReadouts();
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