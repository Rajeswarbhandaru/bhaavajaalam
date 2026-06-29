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
      background: ${isGlow ? 'rgba(92, 255, 133, 0.6)' : 'rgba(255, 255, 255, 0.15)'};
      ${isGlow ? 'box-shadow: 0 0 6px rgba(92, 255, 133, 0.4);' : ''}
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
  // GEAR EXPERIMENT
  // ============================================
  let frontTeeth = 42;
  let rearTeeth = 14;

  const frontButtons = document.querySelectorAll('#frontGearButtons .gear-btn');
  const rearButtons = document.querySelectorAll('#rearGearButtons .gear-btn');
  const expFrontGear = document.getElementById('expFrontGear');
  const expRearGear = document.getElementById('expRearGear');
  const expRatio = document.getElementById('expRatio');
  const expFeeling = document.getElementById('expFeeling');
  const expTurns = document.getElementById('expTurns');
  const btnPedal = document.getElementById('btnPedal');
  const btnResetExp = document.getElementById('btnResetExp');

  function updateGearDisplay() {
    const ratio = (frontTeeth / rearTeeth).toFixed(1);
    const ratioNum = parseFloat(ratio);
    expRatio.textContent = ratio;
    expTurns.textContent = ratio;

    let feeling = 'Medium';
    if (ratioNum > 3.5) feeling = 'Very Hard';
    else if (ratioNum > 2.5) feeling = 'Hard';
    else if (ratioNum < 1.5) feeling = 'Very Easy';
    else if (ratioNum < 2.0) feeling = 'Easy';
    expFeeling.textContent = feeling;

    // Visual size based on tooth count
    const frontSize = 50 + frontTeeth * 0.8;
    const rearSize = 30 + rearTeeth * 0.8;
    expFrontGear.style.width = frontSize + 'px';
    expFrontGear.style.height = frontSize + 'px';
    expRearGear.style.width = rearSize + 'px';
    expRearGear.style.height = rearSize + 'px';

    // Animation speed based on ratio
    const baseSpeed = 3;
    expFrontGear.style.animation = 'none';
    expRearGear.style.animation = 'none';
    expFrontGear.offsetHeight; // trigger reflow
    expRearGear.offsetHeight;
    expFrontGear.style.animation = 'gearSpin ' + baseSpeed + 's linear infinite';
    expRearGear.style.animation = 'gearSpin ' + (baseSpeed / ratioNum) + 's linear infinite';
  }

  frontButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      frontButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      frontTeeth = parseInt(btn.dataset.teeth);
      updateGearDisplay();
    });
  });

  rearButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      rearButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      rearTeeth = parseInt(btn.dataset.teeth);
      updateGearDisplay();
    });
  });

  btnPedal.addEventListener('click', () => {
    const ratio = frontTeeth / rearTeeth;
    expFrontGear.style.animation = 'none';
    expRearGear.style.animation = 'none';
    expFrontGear.offsetHeight;
    expRearGear.offsetHeight;

    expFrontGear.style.animation = 'gearSpin 1s linear';
    expRearGear.style.animation = 'gearSpin ' + (1 / ratio) + 's linear';

    setTimeout(() => {
      updateGearDisplay();
    }, 1000);
  });

  btnResetExp.addEventListener('click', () => {
    frontTeeth = 42;
    rearTeeth = 14;
    frontButtons.forEach(b => b.classList.remove('active'));
    rearButtons.forEach(b => b.classList.remove('active'));
    document.querySelector('[data-teeth="42"]').classList.add('active');
    document.querySelectorAll('#rearGearButtons [data-teeth="14"]').forEach(b => b.classList.add('active'));
    updateGearDisplay();
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
    const colors = ['var(--accent-lime)', 'var(--accent-cyan)', 'var(--accent-gold)', 'var(--accent-pink)', 'var(--accent-violet)'];
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
    updateGearDisplay();
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