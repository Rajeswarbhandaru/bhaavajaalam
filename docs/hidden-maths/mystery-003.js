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
  // THERMOSTAT SIMULATION
  // ============================================
  let roomTemp = 30.0;
  let setPoint = 24;
  let deadBand = 1.0;
  let isRunning = false;
  let cycleCount = 0;
  let simInterval = null;
  let acOn = false;

  const roomTempEl = document.getElementById('roomTemp');
  const acStateEl = document.getElementById('acState');
  const setPointSlider = document.getElementById('setPointSlider');
  const deadBandSlider = document.getElementById('deadBandSlider');
  const setPointDisplay = document.getElementById('setPointDisplay');
  const deadBandDisplay = document.getElementById('deadBandDisplay');
  const tempFill = document.getElementById('tempFill');
  const targetLine = document.getElementById('targetLine');
  const tempBand = document.getElementById('tempBand');
  const readoutTemp = document.getElementById('readoutTemp');
  const readoutStatus = document.getElementById('readoutStatus');
  const readoutCycles = document.getElementById('readoutCycles');
  const btnStartSim = document.getElementById('btnStartSim');
  const btnStopSim = document.getElementById('btnStopSim');
  const btnResetSim = document.getElementById('btnResetSim');

  function updateThermostatVisual() {
    const minTemp = 20;
    const maxTemp = 28;
    const range = maxTemp - minTemp;

    const fillPct = ((roomTemp - minTemp) / range) * 100;
    tempFill.style.width = Math.max(0, Math.min(100, fillPct)) + '%';

    const targetPct = ((setPoint - minTemp) / range) * 100;
    targetLine.style.left = Math.max(0, Math.min(100, targetPct)) + '%';

    const bandPct = ((deadBand / range) * 100);
    const bandLeft = Math.max(0, Math.min(100, targetPct - bandPct));
    const bandWidth = Math.min(100 - bandLeft, bandPct * 2);
    tempBand.style.left = bandLeft + '%';
    tempBand.style.width = Math.max(0, bandWidth) + '%';
  }

  function updateDisplays() {
    roomTempEl.textContent = roomTemp.toFixed(1);
    setPointDisplay.textContent = setPoint + '°C';
    deadBandDisplay.textContent = '±' + deadBand + '°C';
    readoutTemp.textContent = roomTemp.toFixed(1) + '°C';
    readoutCycles.textContent = cycleCount;
    readoutStatus.textContent = acOn ? 'Cooling' : 'Idle';
    acStateEl.textContent = acOn ? 'AC: ON' : 'AC: OFF';
    acStateEl.className = 'ac-state ' + (acOn ? '' : 'off');
    updateThermostatVisual();
  }

  function stepSimulation() {
    const naturalHeat = 0.05; // room warms up naturally
    const coolingPower = 0.15; // AC cooling rate

    if (acOn) {
      roomTemp -= coolingPower;
      if (roomTemp <= setPoint - deadBand) {
        acOn = false;
        cycleCount++;
      }
    } else {
      roomTemp += naturalHeat;
      if (roomTemp >= setPoint + deadBand) {
        acOn = true;
        cycleCount++;
      }
    }

    // Clamp to realistic bounds
    roomTemp = Math.max(18, Math.min(35, roomTemp));
    updateDisplays();
  }

  setPointSlider.addEventListener('input', () => {
    setPoint = parseInt(setPointSlider.value);
    updateDisplays();
  });

  deadBandSlider.addEventListener('input', () => {
    deadBand = parseFloat(deadBandSlider.value);
    updateDisplays();
  });

  btnStartSim.addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;
    btnStartSim.disabled = true;
    btnStopSim.disabled = false;
    simInterval = setInterval(stepSimulation, 300);
  });

  btnStopSim.addEventListener('click', () => {
    isRunning = false;
    clearInterval(simInterval);
    btnStartSim.disabled = false;
    btnStopSim.disabled = true;
  });

  btnResetSim.addEventListener('click', () => {
    isRunning = false;
    clearInterval(simInterval);
    roomTemp = 30.0;
    cycleCount = 0;
    acOn = false;
    btnStartSim.disabled = false;
    btnStopSim.disabled = true;
    updateDisplays();
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
    { id: 'quizQ2', feedback: 'feedbackQ2', correct: 1 },
    { id: 'quizQ3', feedback: 'feedbackQ3', correct: 1 }
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
    const colors = ['var(--accent-cyan)', 'var(--accent-gold)', 'var(--accent-lime)', 'var(--accent-pink)', 'var(--accent-violet)'];
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
    updateDisplays();
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