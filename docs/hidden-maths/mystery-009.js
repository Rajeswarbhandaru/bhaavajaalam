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
  // FAN CANVAS SIMULATION
  // ============================================
  const canvas = document.getElementById('fanCanvas');
  const ctx = canvas.getContext('2d');
  const bladeSlider = document.getElementById('bladeSlider');
  const radiusSlider = document.getElementById('radiusSlider');
  const bladeDisplay = document.getElementById('bladeDisplay');
  const radiusDisplay = document.getElementById('radiusDisplay');
  const readoutAngle = document.getElementById('readoutAngle');
  const readoutArc = document.getElementById('readoutArc');
  const readoutArea = document.getElementById('readoutArea');
  const bladeDots = document.getElementById('bladeDots');
  const btnSpin = document.getElementById('btnSpin');
  const btnStop = document.getElementById('btnStop');

  const W = 400;
  const H = 400;
  const CX = 200;
  const CY = 200;

  let isSpinning = false;
  let rotation = 0;

  function drawFan() {
    const blades = parseInt(bladeSlider.value, 10);
    const radius = parseInt(radiusSlider.value, 10);
    const sectorAngle = 360 / blades;
    const toRad = d => d * Math.PI / 180;
    const rPx = radius * 4; // scale cm to pixels

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < W; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke();
    }
    for (let i = 0; i < H; i += 40) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke();
    }

    // Draw circle
    ctx.beginPath();
    ctx.arc(CX, CY, rPx, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 217, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw hub
    ctx.beginPath();
    ctx.arc(CX, CY, 20, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.stroke();

    // Draw sector lines
    for (let i = 0; i < blades; i++) {
      const angle = (i * sectorAngle + rotation) * Math.PI / 180;
      ctx.beginPath();
      ctx.moveTo(CX, CY);
      ctx.lineTo(CX + rPx * Math.cos(angle), CY + rPx * Math.sin(angle));
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw blades
    for (let i = 0; i < blades; i++) {
      const baseAngle = (i * sectorAngle + rotation) * Math.PI / 180;
      const bladeWidth = (sectorAngle * 0.6) * Math.PI / 180;
      const midAngle = baseAngle + (sectorAngle * 0.2 * Math.PI / 180);

      ctx.beginPath();
      ctx.moveTo(CX, CY);
      ctx.arc(CX, CY, rPx, midAngle - bladeWidth / 2, midAngle + bladeWidth / 2);
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 217, 255, 0.2)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw arc marks
    ctx.strokeStyle = 'rgba(255, 200, 87, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(CX, CY, rPx + 10, 0, Math.PI * 2);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(blades + ' blades', CX, CY);

    // Update readouts
    const arcLength = (2 * Math.PI * radius * (sectorAngle / 360)).toFixed(1);
    const sectorArea = (Math.PI * radius * radius * (sectorAngle / 360)).toFixed(0);

    readoutAngle.textContent = sectorAngle.toFixed(1) + '°';
    readoutArc.textContent = arcLength + ' cm';
    readoutArea.textContent = sectorArea + ' cm²';

    // Update dots
    if (bladeDots) {
      const dots = bladeDots.querySelectorAll('.b-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i < blades);
      });
    }
  }

  function animateFan() {
    if (!isSpinning) return;
    rotation += 2;
    drawFan();
    requestAnimationFrame(animateFan);
  }

  bladeSlider.addEventListener('input', () => {
    bladeDisplay.textContent = bladeSlider.value;
    drawFan();
  });

  radiusSlider.addEventListener('input', () => {
    radiusDisplay.textContent = radiusSlider.value + ' cm';
    drawFan();
  });

  btnSpin.addEventListener('click', () => {
    if (isSpinning) return;
    isSpinning = true;
    animateFan();
  });

  btnStop.addEventListener('click', () => {
    isSpinning = false;
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
    const colors = ['var(--accent-cyan)', 'var(--accent-lime)', 'var(--accent-gold)', 'var(--accent-pink)', 'var(--accent-violet)'];
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
    drawFan();
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