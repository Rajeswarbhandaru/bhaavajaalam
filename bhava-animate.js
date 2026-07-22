/* ╔══════════════════════════════════════════════════════════════════════╗
   ║  bhava-animate.js  — Bhāva Tech  ✨ Motion & Delight Engine         ║
   ║  Add ONE line before </body>:                                        ║
   ║    <script src="bhava-animate.js" defer></script>                   ║
   ╚══════════════════════════════════════════════════════════════════════╝ */

(function () {
  'use strict';

  const ease = 'cubic-bezier(0.16,1,0.3,1)';
  const isMobile = window.matchMedia('(hover:none)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ══════════════════════════════════════════════════════
     1. CURSOR SPARKLE TRAIL
     Colourful star-shaped particles follow the cursor.
     Designed to delight children — they LOVE following
     sparkles with the mouse!
     ══════════════════════════════════════════════════════ */
  if (!isMobile && !reducedMotion) {
    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.id  = 'bt-cursor-dot';
    ring.id = 'bt-cursor-ring';
    document.body.append(dot, ring);

    const SPARK_COLORS = [
      '#c4b5fd','#67e8f9','#fde68a','#6ee7b7',
      '#fb923c','#f472b6','#fff','#a78bfa'
    ];
    const SPARK_SHAPES = ['★','✦','◆','●','✸','⬟'];
    let mx = -200, my = -200, rx = -200, ry = -200;
    let lastSpark = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';

      const now = Date.now();
      if (now - lastSpark < 45) return;        // throttle — one spark every 45ms
      lastSpark = now;

      const s = document.createElement('span');
      s.className = 'bt-sparkle';
      const color = SPARK_COLORS[Math.random() * SPARK_COLORS.length | 0];
      const shape = SPARK_SHAPES[Math.random() * SPARK_SHAPES.length | 0];
      const size  = 8 + Math.random() * 14;
      const dx    = (Math.random() - 0.5) * 60 + 'px';
      const dy    = (Math.random() * -70 - 10) + 'px';

      Object.assign(s.style, {
        left: mx + 'px', top: my + 'px',
        width: size + 'px', height: size + 'px',
        fontSize: size * 0.9 + 'px',
        lineHeight: size + 'px',
        color, textAlign: 'center',
        '--sx': dx, '--sy': dy,
        background: 'transparent',
        width: 'auto', height: 'auto',
      });
      s.textContent = shape;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 700);
    });

    // Ring lags behind cursor for spring feel
    (function animRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    })();
  }

  /* ══════════════════════════════════════════════════════
     2. FLOATING BRAIN EMOJIS in Hero
     Emojis like 🧠 💡 ⭐ float upward from the bottom
     of the hero section — gives it a playful, alive feel.
     ══════════════════════════════════════════════════════ */
  if (!reducedMotion) {
    const EMOJIS = ['🧠','💡','⭐','🎯','🔬','✨','🌟','💫','🎮','📚','🏆','🌈'];
    const hero = document.querySelector('.z1, #hero, .hero-section');
    if (hero) {
      hero.style.position = 'relative';
      hero.style.overflow = 'hidden';

      EMOJIS.forEach((em, i) => {
        const el = document.createElement('span');
        el.className = 'bt-float-emoji';
        el.textContent = em;
        Object.assign(el.style, {
          left: (5 + Math.random() * 90) + '%',
          bottom: (-20 + Math.random() * 20) + 'px',
          '--dur': (7 + Math.random() * 6) + 's',
          '--delay': (i * 0.9) + 's',
          fontSize: (1 + Math.random() * 1.2) + 'rem',
        });
        hero.appendChild(el);
      });
    }
  }

  /* ══════════════════════════════════════════════════════
     3. TYPEWRITER EFFECT on hero subtitle / z1-tag
     The hero badge "Bhāva Tech — Rewiring How Children
     Learn" types in letter by letter, drawing attention.
     ══════════════════════════════════════════════════════ */
  if (!reducedMotion) {
    const targets = document.querySelectorAll('.z1-tag, .bt-type');
    targets.forEach(el => {
      const text = el.textContent.trim();
      el.textContent = '';
      el.classList.add('bt-typewriter');
      let i = 0;
      const type = () => {
        if (i <= text.length) {
          el.textContent = text.slice(0, i);
          i++;
          setTimeout(type, 42);
        } else {
          el.classList.remove('bt-typewriter'); // remove cursor when done
        }
      };
      // Start after 0.8s so the page has loaded visually
      setTimeout(type, 800);
    });
  }

  /* ══════════════════════════════════════════════════════
     4. 3D CARD TILT
     Cards rotate slightly toward where the mouse points.
     This is the single most "wow" effect on landing pages.
     Applied to: method cards, bgt-cards, testi-cards,
     stat cards, gain cards, collab cards.
     ══════════════════════════════════════════════════════ */
  if (!isMobile && !reducedMotion) {
    const TILT_SEL = [
      '.method-card', '.bgt-card', '.bgt-flip',
      '.testi-card', '.stat-card', '.gain-card',
      '.g-card', '[class*="collab-card"]',
      '.flow-node', '.ba-panel'
    ].join(',');

    document.querySelectorAll(TILT_SEL).forEach(card => {
      card.classList.add('bt-tilt');
      // Inject shine layer
      const shine = document.createElement('div');
      shine.className = 'bt-tilt-shine';
      card.style.position = 'relative';
      card.appendChild(shine);

      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const cx = e.clientX - r.left;
        const cy = e.clientY - r.top;
        const px = cx / r.width;   // 0–1
        const py = cy / r.height;
        const rotX = (py - 0.5) * -14;   // max ±7deg
        const rotY = (px - 0.5) *  14;
        card.style.transform =
          `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04)`;
        shine.style.setProperty('--mx', (px * 100) + '%');
        shine.style.setProperty('--my', (py * 100) + '%');
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform =
          'perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     5. RIPPLE EFFECT on Buttons
     A circular ripple expands from where you click —
     the same satisfying effect as Google's Material Design.
     Children love tactile feedback like this.
     ══════════════════════════════════════════════════════ */
  // Skip entirely on mobile/touch — ripple DOM work on the same tap that
  // should trigger navigation was delaying/eating taps on nav buttons.
  if (!isMobile && !reducedMotion) {
    document.querySelectorAll('a[href], .btn, button').forEach(btn => {
      // Never attach to the fixed nav bar (Back/Home/Report) — those must
      // always respond instantly, on every device.
      if (btn.closest('.bgnav, #bhava-game-nav, [class*="game-nav"]')) return;
      btn.classList.add('bt-ripple-host');
      btn.addEventListener('click', e => {
        const r   = btn.getBoundingClientRect();
        const rip = document.createElement('span');
        rip.className = 'bt-ripple';
        const size = Math.max(r.width, r.height);
        Object.assign(rip.style, {
          width: size + 'px', height: size + 'px',
          left: (e.clientX - r.left - size / 2) + 'px',
          top:  (e.clientY - r.top  - size / 2) + 'px',
        });
        btn.appendChild(rip);
        setTimeout(() => rip.remove(), 700);
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     6. CONFETTI BURST on primary CTA click
     When a child or parent clicks "Begin Your Mind
     Evaluation" — colourful confetti explodes outward!
     Makes the action feel rewarding and special.
     ══════════════════════════════════════════════════════ */
  const CONF_COLORS = [
    '#c4b5fd','#67e8f9','#fde68a','#6ee7b7',
    '#fb923c','#f472b6','#a78bfa','#fff'
  ];

  function fireConfetti(cx, cy, count = 60) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'bt-confetti';
      const angle = Math.random() * 360;
      const dist  = 80 + Math.random() * 180;
      const rad   = angle * Math.PI / 180;
      Object.assign(el.style, {
        left: cx + 'px', top: cy + 'px',
        background: CONF_COLORS[i % CONF_COLORS.length],
        '--cf-x': Math.cos(rad) * dist + 'px',
        '--cf-y': (Math.sin(rad) * dist + 120) + 'px',
        '--cf-r': (Math.random() * 720 - 360) + 'deg',
        '--cf-dur': (0.9 + Math.random() * 0.6) + 's',
        '--cf-delay': (Math.random() * 0.2) + 's',
        width: (6 + Math.random() * 7) + 'px',
        height: (6 + Math.random() * 7) + 'px',
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        opacity: 1,
      });
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1800);
    }
  }

  // Attach to all CTA / primary buttons
  document.querySelectorAll('a[href*="take-test"], a[href*="evaluation"], a[href*="enroll"], a[href*="Enroll"], .btn-primary, a[href*="Book"], a[href*="book"]').forEach(btn => {
    btn.addEventListener('click', e => {
      const r = btn.getBoundingClientRect();
      fireConfetti(r.left + r.width / 2, r.top + r.height / 2, 55);
    });
  });

  /* ══════════════════════════════════════════════════════
     7. STAGGERED SECTION CARD REVEALS
     When a grid of cards scrolls into view, each card
     animates in one after another (stagger). This is
     exactly what Shortwave does with its feature sections.
     ══════════════════════════════════════════════════════ */
  if (!reducedMotion) {
    const GRID_SEL = [
      '.bgt-grid', '.method-grid', '.testimonials-grid',
      '.gain-section > div', '#gain-section > div > div',
      '.collab-grid', '.z2'
    ].join(',');

    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const children = Array.from(entry.target.children);
        children.forEach((child, i) => {
          child.classList.add('bt-reveal');
          setTimeout(() => child.classList.add('bt-in'), i * 80);
        });
        revealObs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll(GRID_SEL).forEach(el => revealObs.observe(el));

    // Gain cards specifically
    const gainObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const cards = entry.target.querySelectorAll('.gain-card');
        cards.forEach((c, i) => {
          setTimeout(() => c.classList.add('bt-in'), i * 90);
        });
        gainObs.unobserve(entry.target);
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('#gain-section, .gain-section, [id*="gain"]')
      .forEach(el => gainObs.observe(el));
  }

  /* ══════════════════════════════════════════════════════
     8. FLOW PIPELINE: Sequential Node Lighting
     When the "Bhāva → Buddhi → Behaviour → Growth"
     section scrolls into view, each node lights up
     one after another like a sequence being activated.
     ══════════════════════════════════════════════════════ */
  if (!reducedMotion) {
    const flowObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const nodes = entry.target.querySelectorAll('.flow-node');
        nodes.forEach((node, i) => {
          setTimeout(() => node.classList.add('bt-lit'), i * 350);
        });
        flowObs.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    document.querySelectorAll('.z6, .flow-row').forEach(el => flowObs.observe(el));
  }

  /* ══════════════════════════════════════════════════════
     9. STAT COUNTER — Smooth Eased Animation + Flash
     Numbers count up with a smooth deceleration curve
     then "flash" at the end to celebrate. Much more
     dramatic than a simple linear increment.
     ══════════════════════════════════════════════════════ */
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animateCount(el, target, suffix, duration) {
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const val = Math.round(easeOutExpo(progress) * target);
      el.textContent = val.toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString() + suffix;
        el.classList.add('bt-done', 'bt-glow-pulse');
        setTimeout(() => el.classList.remove('bt-done'), 600);
      }
    }
    requestAnimationFrame(step);
  }

  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // data-target counters (Zone 2 stat cards)
      entry.target.querySelectorAll('[data-target]').forEach(el => {
        const target = parseInt(el.dataset.target) || 0;
        const suffix = el.dataset.suffix || '';
        animateCount(el, target, suffix, 1800);
      });
      // Legacy stat IDs from script.js
      [
        { id: 'stat-students', target: 500, suffix: '+' },
        { id: 'stat-sessions', target: 1200, suffix: '+' },
        { id: 'stat-courses',  target: 12,   suffix: '' },
        { id: 'stat-research', target: 5,    suffix: '+' }
      ].forEach(s => {
        const el = document.getElementById(s.id);
        if (el && el.textContent === '0' || el?.textContent === '') {
          animateCount(el, s.target, s.suffix, 2000);
        }
      });
      counterObs.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('#stats, .z2, [id*="stats"]')
    .forEach(el => counterObs.observe(el));

  /* ══════════════════════════════════════════════════════
     10. MAGNETIC BUTTON EFFECT
     CTA buttons gently attract toward the cursor when
     the mouse is nearby. Feels almost alive.
     Specifically on desktop only (no touch devices).
     ══════════════════════════════════════════════════════ */
  if (!isMobile && !reducedMotion) {
    const MAG_SEL = 'a[href*="take-test"], a[href*="enroll"], a[href*="Enroll"], a[href*="Book"], .btn-primary, a[href*="evaluation"], a[href*="Register"]';
    document.querySelectorAll(MAG_SEL).forEach(btn => {
      const wrapper = document.createElement('div');
      wrapper.className = 'bt-magnetic';
      btn.parentNode.insertBefore(wrapper, btn);
      wrapper.appendChild(btn);

      wrapper.addEventListener('mousemove', e => {
        const r  = wrapper.getBoundingClientRect();
        const cx = r.left + r.width  / 2;
        const cy = r.top  + r.height / 2;
        const dx = (e.clientX - cx) * 0.28;
        const dy = (e.clientY - cy) * 0.28;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });

      wrapper.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0,0)';
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     11. SCROLL-DRIVEN BOUNCING ARROW (hero)
     Adds a subtle "scroll down" chevron at the bottom of
     the hero — guides first-time visitors to scroll.
     ══════════════════════════════════════════════════════ */
  const hero = document.querySelector('.z1, #hero');
  if (hero) {
    const hint = document.createElement('div');
    hint.className = 'bt-scroll-hint';
    hint.innerHTML = '<span></span><span></span><span></span>';
    hint.setAttribute('aria-hidden', 'true');
    hero.style.position = 'relative';
    hero.appendChild(hint);
    // Hide after user starts scrolling
    window.addEventListener('scroll', () => {
      if (window.scrollY > 120) hint.style.opacity = '0';
      else hint.style.opacity = '0.5';
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════
     12. ACHIEVEMENT POP NOTIFICATIONS
     When a user taps a method card (in brain gym section),
     a small toast notification pops up at bottom-right.
     Children love the "unlocked!" feeling.
     ══════════════════════════════════════════════════════ */
  const ACHIEVEMENTS = {
    mc1: { icon: '🧩', text: 'Analytical Thinking — Unlocked!' },
    mc2: { icon: '🎯', text: 'Deep Focus — Unlocked!' },
    mc3: { icon: '⚖️', text: 'Judgment Skills — Unlocked!' },
    mc4: { icon: '🌈', text: 'Creative Thinking — Unlocked!' },
    mc5: { icon: '🗣️', text: 'Verbal Intelligence — Unlocked!' },
    mc6: { icon: '💚', text: 'Inner Awareness — Unlocked!' },
  };

  let achieveEl = null;
  let achieveTimer = null;

  function showAchievement(icon, text) {
    if (!achieveEl) {
      achieveEl = document.createElement('div');
      achieveEl.className = 'bt-achievement';
      achieveEl.innerHTML =
        '<span class="bt-achievement-icon"></span><span class="bt-achievement-text"></span>';
      document.body.appendChild(achieveEl);
    }
    achieveEl.querySelector('.bt-achievement-icon').textContent = icon;
    achieveEl.querySelector('.bt-achievement-text').textContent = text;
    clearTimeout(achieveTimer);
    achieveEl.classList.add('show');
    achieveTimer = setTimeout(() => achieveEl.classList.remove('show'), 2800);
  }

  document.querySelectorAll('.method-card').forEach((card, i) => {
    const key = 'mc' + (i + 1);
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const a = ACHIEVEMENTS[key];
      if (a) showAchievement(a.icon, a.text);
    });
  });

  /* ══════════════════════════════════════════════════════
     13. SHIMMER HIGHLIGHT on key phrases
     Wrap certain headings with .bt-highlight and they
     get an animated shimmer underline.
     Auto-targets h2 and h3 inside zone headers.
     ══════════════════════════════════════════════════════ */
  document.querySelectorAll('.bgt-h h2, .g-header h2, .zone-label').forEach(el => {
    el.classList.add('bt-highlight');
  });

  /* ══════════════════════════════════════════════════════
     14. WAVE DIVIDERS between major sections
     Inserts a subtle wavy SVG line between certain big
     sections to break the monotony of straight edges.
     ══════════════════════════════════════════════════════ */
  function insertWave(afterSelector, waveColor) {
    const target = document.querySelector(afterSelector);
    if (!target) return;
    const wave = document.createElement('div');
    wave.className = 'bt-wave-divider';
    wave.setAttribute('aria-hidden', 'true');
    wave.innerHTML = `
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" height="40">
        <path d="M0,20 C240,40 480,0 720,20 C960,40 1200,0 1440,20 L1440,40 L0,40 Z"
              fill="${waveColor}" opacity="0.5"/>
      </svg>`;
    target.insertAdjacentElement('afterend', wave);
  }

  insertWave('.z2',            'rgba(167,139,250,0.06)');
  insertWave('.z6',            'rgba(6,182,212,0.05)');
  insertWave('#gain-section',  'rgba(251,191,36,0.05)');

  /* ══════════════════════════════════════════════════════
     15. GAME CARD SHINE SWEEP on hover
     A highlight sweep moves across game cards like a
     holographic trading card effect. Children go crazy
     for this effect!
     ══════════════════════════════════════════════════════ */
  document.querySelectorAll('.g-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width)  * 100;
      const py = ((e.clientY - r.top)  / r.height) * 100;
      card.style.setProperty('--hx', px + '%');
      card.style.setProperty('--hy', py + '%');
      card.style.background =
        card.style.background.includes('radial-gradient') ? card.style.background :
        `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.18) 0%, transparent 55%), ${card.style.background || ''}`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  /* ══════════════════════════════════════════════════════
     16. COUNTER for Section Visits
     Shows a small floating "X children explored this"
     count that increments on page load — adds social
     proof feel in real time.
     ══════════════════════════════════════════════════════ */
  const heroSection = document.querySelector('.z1, #hero');
  if (heroSection && !isMobile) {
    const badge = document.createElement('div');
    badge.setAttribute('aria-hidden', 'true');
    Object.assign(badge.style, {
      position: 'absolute',
      top: '20px', right: '20px',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(167,139,250,0.28)',
      borderRadius: '30px',
      padding: '5px 14px',
      fontSize: '0.75rem',
      color: '#94a3b8',
      fontWeight: '600',
      letterSpacing: '0.03em',
      zIndex: '3',
      backdropFilter: 'blur(8px)',
    });
    let count = 247 + Math.floor(Math.random() * 30);
    badge.textContent = '🧠 ' + count + ' exploring today';
    heroSection.appendChild(badge);
  }

  /* ══════════════════════════════════════════════════════
     17. KEYBOARD FOCUS SPARKLE
     When navigating by keyboard (Tab key), a sparkle
     burst fires around the focused element — makes the
     site feel alive even for keyboard users.
     ══════════════════════════════════════════════════════ */
  document.addEventListener('focusin', e => {
    // Skip on mobile — focusin fires on touch taps too (not just keyboard
    // Tab), so this was spawning 6 DOM elements synchronously on every
    // single nav button tap, stalling the actual navigation.
    if (reducedMotion || isMobile) return;
    const el = e.target;
    if (!['A','BUTTON','INPUT','SELECT','TEXTAREA'].includes(el.tagName)) return;
    const r = el.getBoundingClientRect();
    for (let i = 0; i < 6; i++) {
      const s = document.createElement('span');
      s.className = 'bt-sparkle';
      const cx = r.left + r.width / 2;
      const cy = r.top  + r.height / 2;
      const dx = (Math.random() - 0.5) * 50 + 'px';
      const dy = (Math.random() * -50 - 5) + 'px';
      Object.assign(s.style, {
        left: cx + 'px', top: cy + 'px',
        color: '#c4b5fd',
        fontSize: '12px',
        '--sx': dx, '--sy': dy,
      });
      s.textContent = '✦';
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 700);
    }
  });

  /* ══════════════════════════════════════════════════════
     18. SCROLL PROGRESS — Section Label
     As the user scrolls, shows which section they're in
     as a tiny pill at the top of the scroll bar.
     ══════════════════════════════════════════════════════ */
  const SECTIONS = [
    { id: 'hero',         label: '🏠 Home' },
    { id: 'bhava-unified',label: '🧠 About' },
    { id: 'brain-gym',    label: '💪 Brain Gym' },
    { id: 'games',        label: '🎮 Games' },
    { id: 'gain-section', label: '⭐ Benefits' },
    { id: 'pricing',      label: '💰 Pricing' },
    { id: 'collaborate',  label: '🤝 Collaborate' },
    { id: 'faq',          label: '❓ FAQ' },
    { id: 'contact',      label: '📞 Contact' },
  ];

  const secLabel = document.createElement('div');
  Object.assign(secLabel.style, {
    position: 'fixed',
    top: '6px',
    right: '16px',
    background: 'rgba(10,10,26,0.85)',
    border: '1px solid rgba(167,139,250,0.3)',
    borderRadius: '20px',
    padding: '3px 12px',
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#c4b5fd',
    zIndex: '9995',
    backdropFilter: 'blur(10px)',
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
    letterSpacing: '0.03em',
  });
  secLabel.textContent = '🏠 Home';
  document.body.appendChild(secLabel);

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + window.innerHeight / 3;
    let current = SECTIONS[0].label;
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el && el.offsetTop <= scrollY) current = s.label;
    });
    if (secLabel.textContent !== current) {
      secLabel.style.opacity = '0';
      setTimeout(() => {
        secLabel.textContent = current;
        secLabel.style.opacity = '1';
      }, 150);
    }
  }, { passive: true });

})(); // END IIFE
