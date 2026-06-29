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

  const btnBowl = document.getElementById('btnBowl');
  const btnHit = document.getElementById('btnHit');
  const btnResetExp = document.getElementById('btnResetExp');
  const expBall = document.getElementById('expBall');
  const expTime = document.getElementById('expTime');
  const expSpeed = document.getElementById('expSpeed');
  const expInstruction = document.getElementById('expInstruction');
  const expHistory = document.getElementById('expHistory');

  let expStartTime = 0;
  let expTimerId = null;
  let expRunning = false;
  const PITCH_DISTANCE = 20;

  function startExpBall() {
    expBall.style.transition = 'left 1.5s linear';
    expBall.style.left = 'calc(100% - 1.5rem)';
  }

  function resetExpBall() {
    expBall.style.transition = 'none';
    expBall.style.left = '1rem';
  }

  function recordExperiment(timeMs) {
    const timeS = (timeMs / 1000).toFixed(2);
    const speed = (PITCH_DISTANCE / (timeMs / 1000)).toFixed(1);
    expTime.textContent = timeS + ' s';
    expSpeed.textContent = speed + ' m/s';
    const entry = document.createElement('div');
    entry.className = 'exp-history-entry';
    entry.innerHTML = `<span class="entry-time">${timeS}s</span><span class="entry-speed">${speed} m/s</span>`;
    expHistory.insertBefore(entry, expHistory.firstChild);
    if (expHistory.children.length > 5) {
      expHistory.removeChild(expHistory.lastChild);
    }
  }

  btnBowl.addEventListener('click', () => {
    if (expRunning) return;
    expRunning = true;
    expStartTime = performance.now();
    btnBowl.disabled = true;
    btnHit.disabled = false;
    expInstruction.textContent = 'Press Ball Reaches Batsman when the ball arrives';
    expInstruction.style.color = 'var(--accent-gold)';
    resetExpBall();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => startExpBall());
    });
    expTimerId = setTimeout(() => {
      if (expRunning) {
        const endTime = performance.now();
        const elapsed = endTime - expStartTime;
        expRunning = false;
        btnBowl.disabled = false;
        btnHit.disabled = true;
        recordExperiment(elapsed);
        expInstruction.textContent = 'Too late! Try again. Press Bowl to restart.';
        expInstruction.style.color = 'var(--accent-pink)';
      }
    }, 2500);
  });

  btnHit.addEventListener('click', () => {
    if (!expRunning) return;
    expRunning = false;
    clearTimeout(expTimerId);
    const endTime = performance.now();
    const elapsed = endTime - expStartTime;
    btnBowl.disabled = false;
    btnHit.disabled = true;
    recordExperiment(elapsed);
    expInstruction.textContent = 'Great! Press Bowl to try again.';
    expInstruction.style.color = 'var(--accent-lime)';
  });

  btnResetExp.addEventListener('click', () => {
    expRunning = false;
    clearTimeout(expTimerId);
    resetExpBall();
    expTime.textContent = '--.-- s';
    expSpeed.textContent = '-- m/s';
    btnBowl.disabled = false;
    btnHit.disabled = true;
    expInstruction.textContent = 'Press Bowl to start';
    expInstruction.style.color = 'var(--text-muted)';
    expHistory.innerHTML = '';
  });

  const gaugeSlider = document.getElementById('gaugeSlider');
  const gaugeValue = document.getElementById('gaugeValue');
  const gaugeVisual = document.getElementById('gaugeVisual');
  const gaugeBall = gaugeVisual.querySelector('.gauge-ball');

  function updateGauge() {
    const val = parseInt(gaugeSlider.value, 10);
    gaugeValue.textContent = val;
    const pct = ((val - 60) / (200 - 60)) * 100;
    gaugeBall.style.left = Math.max(5, Math.min(95, pct)) + '%';
  }

  gaugeSlider.addEventListener('input', function() {
    AudioEngine.tick();
    updateGauge();
  });

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

  const celebrationVisual = document.getElementById('celebrationVisual');

  function initCelebration() {
    AudioEngine.celebrate();
    const colors = ['var(--accent-cyan)', 'var(--accent-violet)', 'var(--accent-pink)', 'var(--accent-gold)', 'var(--accent-lime)'];
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

  function init() {
    initFloatingSymbols();
    initParticles();
    initQuiz();
    updateProgress();
 }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();