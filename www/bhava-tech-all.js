// ╔══════════════════════════════════════════════════════════════╗
// ║          bhava-tech-all.js — Bhāva Tech                     ║
// ║  SINGLE FILE = script.js + script-2.js + session-tracker.js ║
// ║  Add ONE line before </body> in every HTML page:            ║
// ║  <script src="bhava-tech-all.js"></script>                  ║
// ╚══════════════════════════════════════════════════════════════╝

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 1 — UI: Nav, Scroll, Animations, Stats Counter, FAQ
// (formerly script.js)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/* Bhava Tech — script.js CLEAN BUILD */
document.addEventListener('DOMContentLoaded', function() {

  /* 1. MOBILE NAV */
  var hamburger = document.querySelector('.hamburger');
  var navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  /* 2. SMOOTH SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var navH = (document.querySelector('nav') ? document.querySelector('nav').offsetHeight : 70) + 10;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
      }
    });
  });

  /* 3. STICKY NAV + SCROLL PROGRESS */
  var nav      = document.querySelector('nav');
  var progress = document.getElementById('scroll-progress');
  window.addEventListener('scroll', function() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
    if (progress) {
      var pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
      progress.style.width = pct + '%';
    }
  });

  /* 4. SCROLL ANIMATION */
  var aObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('in-view'); aObs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.section-animate').forEach(function(el) { aObs.observe(el); });

  /* 5. STATS COUNTER */
  var stats = [
    { id: 'stat-students', target: 500,  suffix: '+' },
    { id: 'stat-sessions', target: 1200, suffix: '+' },
    { id: 'stat-courses',  target: 12,   suffix: ''  },
    { id: 'stat-research', target: 5,    suffix: '+' }
  ];
  function animCount(el, target, suffix) {
    var v = 0, step = target / 125;
    var t = setInterval(function() {
      v += step;
      if (v >= target) { v = target; clearInterval(t); }
      el.textContent = Math.floor(v) + suffix;
    }, 16);
  }
  var sObs = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
      stats.forEach(function(s) {
        var el = document.getElementById(s.id);
        if (el) animCount(el, s.target, s.suffix);
      });
      sObs.disconnect();
    }
  }, { threshold: 0.4 });
  var statsEl = document.getElementById('stats');
  if (statsEl) sObs.observe(statsEl);

  /* 6. FAQ ACCORDION */
  var faqs = [
    {
      q: 'What is a Quotient and what does it measure?',
      a: 'A Quotient is a standardised score that measures a specific dimension of human intelligence. Just like a temperature reading tells you how hot something is, a quotient tells you how developed a particular mental ability is relative to others in the same age group. The score is compared against a standard scale with 100 as the average.'
    },
    {
      q: 'How many Quotients are there and what are they?',
      a: 'There are three primary quotients assessed at Bhava Tech. IQ (Intelligence Quotient) measures logical reasoning, memory, problem-solving, and processing speed. EQ (Emotional Quotient) measures self-awareness, empathy, emotional regulation, and social skills. SQ (Spiritual/Social Quotient) measures inner clarity, sense of purpose, and values alignment. Together they give a complete picture of cognitive and personal development.'
    },
    {
      q: 'Is IQ the only measure of intelligence?',
      a: 'No. IQ measures only logical and analytical thinking. Research over 30 years shows that EQ is an equally powerful predictor of success in life, relationships, and career. SQ adds the dimension of inner wisdom and purposeful living. A high IQ with low EQ can still lead to poor decisions. That is why Bhava Tech assesses all three together.'
    },
    {
      q: 'Why is it important to know a child\'s cognitive profile early?',
      a: 'Early assessment helps parents and teachers understand how a child thinks, feels, and processes the world before small gaps become big problems. It answers key questions such as: why does my child struggle to focus, or why does the child lose interest quickly? With this knowledge, the right support and teaching method can be provided at the right age when the brain is most adaptable.'
    },
    {
      q: 'What are the benefits of IQ testing for children?',
      a: 'IQ testing identifies specific cognitive strengths and weaknesses such as verbal ability, memory, spatial reasoning, and processing speed. Benefits include understanding how the child learns best, identifying gifted abilities that need nurturing, detecting learning difficulties early, and designing personalised study strategies that work for that child\'s brain.'
    },
    {
      q: 'What are the benefits of EQ assessment?',
      a: 'EQ assessment reveals how a child or adult manages emotions, handles stress, relates to others, and responds to failure. High EQ is linked to better academic performance, stronger friendships, mental health resilience, and leadership ability. Knowing your EQ score helps you work on specific emotional skills such as calming anger, expressing feelings clearly, and developing empathy.'
    },
    {
      q: 'What are the benefits of SQ (Spiritual/Social Quotient) assessment?',
      a: 'SQ measures a person\'s sense of inner purpose, values clarity, and ability to think beyond immediate desires. High SQ is associated with better life decisions, inner peace, meaningful relationships, and ethical behaviour. For children, SQ development builds character and integrity - qualities no textbook can teach but every parent wants their child to have.'
    },
    {
      q: 'What is Brain Gym and how does it improve cognitive ability?',
      a: 'Brain Gym at Bhava Tech is a structured set of cognitive exercises designed to strengthen specific mental functions - just like physical gym exercises strengthen muscles. It includes memory training, attention exercises, pattern recognition tasks, and problem-solving games. Regular sessions build neural pathways, improve working memory, sharpen focus, and increase mental stamina. Results are typically noticeable within 4 to 6 weeks.'
    },
    {
      q: 'What methods and techniques does Bhava Tech use?',
      a: 'We use evidence-based techniques including: Cognitive Load Training - progressively harder tasks that expand mental capacity. Attention Training - sustained focus exercises to reduce distraction. Spaced Repetition - memory strengthening through timed recall. Mindfulness Meditation - to reduce stress and enhance concentration. Gamified Learning - making brain training enjoyable and motivating for children.'
    },
    {
      q: 'What happens inside the Meditational and Mindfulness Lab?',
      a: 'Our lab is a specially designed quiet space with calibrated sound and adjustable lighting that helps the brain enter focused or relaxed states. Sessions include guided breathing exercises, body scan meditations, and silent awareness practices. The lab is available for children experiencing stress, adults with attention difficulties, and anyone seeking mental clarity. Pre and post-session checks track real improvement.'
    },
    {
      q: 'What is the age range for tests?',
      a: 'Tests are available for five age groups: 4 to 7, 8 to 11, 11 to 15, 16 to 20 years, and Adults (21+). Each test is specially designed and calibrated for that specific age group with age-appropriate questions, scoring, and interpretation.'
    },
    {
      q: 'How long does one assessment take?',
      a: 'A single test (IQ, EQ, or SQ) takes approximately 45 to 60 minutes. The Combo package (all three tests) takes 90 minutes with a brief counselling discussion. Offline sessions at our Visakhapatnam office are available by appointment, and online tests are available 24 hours a day.'
    },
    {
      q: 'Will I receive a detailed report?',
      a: 'Yes. Every test includes a detailed report with your score, what it means for your age group, your strongest and weakest areas, and specific actionable suggestions for improvement. For children, the report also includes guidance for parents and teachers on how to best support the child\'s development.'
    },
    {
      q: 'How do I book an appointment?',
      a: 'You can book in three ways: Use the Book Now button on this page. WhatsApp us at +91 9573057516. Walk in to 48-6-38, 2nd Floor, Ramatalkies Road, Visakhapatnam 530016. For online tests, select your test and age group in the Tests section, pay via UPI, and your Google Form link opens immediately.'
    },
    {
      q: 'Can schools and institutions partner with Bhava Tech?',
      a: 'Yes. We offer bulk assessment packages for schools, coaching centres, and organisations. We also conduct Brain Gym workshops and mindfulness sessions on-campus. Contact us at bhaavatech@gmail.com or call +91 9573057516 for institutional pricing and scheduling.'
    }
  ];

  var faqList = document.getElementById('faq-list');
  if (faqList) {
    faqs.forEach(function(item, i) {
      var div = document.createElement('div');
      div.className = 'faq-item';
      div.innerHTML =
        '<button class="faq-q" aria-expanded="false">' +
          '<span>' + item.q + '</span><span class="faq-icon">+</span>' +
        '</button>' +
        '<div class="faq-a" hidden><p>' + item.a + '</p></div>';
      faqList.appendChild(div);
      var btn = div.querySelector('.faq-q');
      var ans = div.querySelector('.faq-a');
      var ico = div.querySelector('.faq-icon');
      btn.addEventListener('click', function() {
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        faqList.querySelectorAll('.faq-q').forEach(function(b) {
          b.setAttribute('aria-expanded', 'false');
          b.nextElementSibling.hidden = true;
          b.querySelector('.faq-icon').textContent = '+';
        });
        if (!isOpen) {
          btn.setAttribute('aria-expanded', 'true');
          ans.hidden = false;
          ico.textContent = '-';
        }
      });
    });
  }

  /* 7. TESTIMONIALS */
  var testis = [
    { name: 'Sunita Reddy',     role: 'Parent of Arjun (Age 9)',  stars: 5, quote: 'After the IQ and EQ assessment, we understood exactly where Arjun needed help. The Brain Gym improved his focus at school dramatically within two months.' },
    { name: 'Narasimha Rao',    role: 'Parent of Divya (Age 12)', stars: 5, quote: 'The team at Bhava Tech is exceptional. The SQ test revealed intelligence areas we never thought to nurture. Highly recommended for every parent.' },
    { name: 'Kavitha Sharma',   role: 'Student (Age 17)',         stars: 5, quote: 'The online test was smooth and the report was incredibly detailed. I understood my strengths and now I study much more effectively.' },
    { name: 'Dr. Padma Venkat', role: 'School Principal, Vizag',  stars: 5, quote: 'We partnered with Bhava Tech for 60 students. The reports were professional and the Brain Gym sessions kept children genuinely engaged.' }
  ];
  var slider = document.getElementById('testi-slider');
  var dots   = document.getElementById('testi-dots');
  var cur    = 0;

  function stars(n) { var s = ''; for (var i = 0; i < n; i++) s += '\u2605'; return s; }

  function renderTesti(i) {
    var t = testis[i];
    if (!slider) return;
    slider.innerHTML =
      '<div class="testi-card in-view">' +
        '<div class="testi-stars">' + stars(t.stars) + '</div>' +
        '<p class="testi-quote">"' + t.quote + '"</p>' +
        '<div class="testi-author"><strong>' + t.name + '</strong><span>' + t.role + '</span></div>' +
      '</div>';
  }

  function updateTesti() {
    renderTesti(cur);
    if (dots) {
      dots.querySelectorAll('.tdot').forEach(function(d, i) { d.classList.toggle('on', i === cur); });
    }
  }

  if (slider) {
    renderTesti(0);
    if (dots) {
      testis.forEach(function(_, i) {
        var d = document.createElement('span');
        d.className = 'tdot' + (i === 0 ? ' on' : '');
        d.addEventListener('click', function() { cur = i; updateTesti(); });
        dots.appendChild(d);
      });
    }
    var prevBtn = document.getElementById('testi-prev');
    var nextBtn = document.getElementById('testi-next');
    if (prevBtn) prevBtn.addEventListener('click', function() { cur = (cur - 1 + testis.length) % testis.length; updateTesti(); });
    if (nextBtn) nextBtn.addEventListener('click', function() { cur = (cur + 1) % testis.length; updateTesti(); });
    setInterval(function() { cur = (cur + 1) % testis.length; updateTesti(); }, 5000);
  }

  /* 8. WHATSAPP */
  var waBtn = document.getElementById('wa-btn');
  if (waBtn) waBtn.addEventListener('click', function() {
    window.open('https://wa.me/919573057516?text=Hello%20Bhava%20Tech!%20I%20want%20to%20know%20more.', '_blank');
  });

  /* 9. BACK TO TOP */
  var topBtn = document.getElementById('top-btn');
  if (topBtn) {
    window.addEventListener('scroll', function() { topBtn.classList.toggle('show', window.scrollY > 400); });
    topBtn.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* 10. NAV SPY */
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', function() {
    var active = '';
    var navH = document.querySelector('nav') ? document.querySelector('nav').offsetHeight : 70;
    sections.forEach(function(s) { if (window.scrollY >= s.offsetTop - navH - 20) active = s.id; });
    navAnchors.forEach(function(a) { a.classList.toggle('active', a.getAttribute('href') === '#' + active); });
  });

  /* 11. CONTACT FORM */
  var CONTACT_URL = 'https://script.google.com/macros/s/YOUR_CONTACT_SCRIPT_URL/exec';
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = contactForm.querySelector('button[type="submit"]');
      var st  = document.getElementById('contact-status');
      btn.disabled = true; btn.textContent = 'Sending...';
      fetch(CONTACT_URL, { method: 'POST', body: new FormData(contactForm) })
        .then(function(r) { if (!r.ok) throw new Error(); if (st) { st.textContent = 'Thank you! We will contact you shortly.'; st.className = 'status-msg ok'; } contactForm.reset(); })
        .catch(function() { if (st) { st.textContent = 'Failed. Please WhatsApp +91 9573057516 directly.'; st.className = 'status-msg err'; } })
        .finally(function() { btn.disabled = false; btn.textContent = 'Send Message'; });
    });
  }

  /* 12. BRAIN GYM FORM */
  var BG_URL = 'https://script.google.com/macros/s/YOUR_BRAINGYM_SCRIPT_URL/exec';
  var bgForm = document.getElementById('braingym-form');
  if (bgForm) {
    bgForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = bgForm.querySelector('button[type="submit"]');
      var st  = document.getElementById('braingym-status');
      btn.disabled = true; btn.textContent = 'Booking...';
      fetch(BG_URL, { method: 'POST', body: new FormData(bgForm) })
        .then(function(r) { if (!r.ok) throw new Error(); if (st) { st.textContent = 'Booking received! We will WhatsApp you to confirm.'; st.className = 'status-msg ok'; } bgForm.reset(); })
        .catch(function() { if (st) { st.textContent = 'Failed. Please WhatsApp +91 9573057516 directly.'; st.className = 'status-msg err'; } })
        .finally(function() { btn.disabled = false; btn.textContent = 'Book My Session'; });
    });
  }

  /* 13. NEWSLETTER */
  var NL_URL = 'https://script.google.com/macros/s/YOUR_NEWSLETTER_SCRIPT_URL/exec';
  var nlForm = document.getElementById('nl-form');
  if (nlForm) {
    nlForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = nlForm.querySelector('button');
      var st  = document.getElementById('nl-status');
      btn.disabled = true; btn.textContent = 'Subscribing...';
      fetch(NL_URL, { method: 'POST', body: new FormData(nlForm) })
        .then(function(r) { if (!r.ok) throw new Error(); if (st) { st.textContent = 'Subscribed! You will receive Bhava Tech updates.'; st.className = 'status-msg ok'; } nlForm.reset(); })
        .catch(function() { if (st) { st.textContent = 'Please try again.'; st.className = 'status-msg err'; } })
        .finally(function() { btn.disabled = false; btn.textContent = 'Subscribe'; });
    });
  }

  /* 14. MEDITATION MODAL */
  var medBtn   = document.getElementById('medlab-btn');
  var medModal = document.getElementById('medlab-modal');
  if (medBtn && medModal) {
    medBtn.addEventListener('click', function() { medModal.classList.add('open'); document.body.style.overflow = 'hidden'; });
    medModal.addEventListener('click', function(e) {
      if (e.target === medModal || e.target.classList.contains('modal-close')) {
        medModal.classList.remove('open'); document.body.style.overflow = '';
      }
    });
  }

  /* 15. FOOTER YEAR */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

/* ── AGE-BTN CLICK HANDLER ── */
(function() {

  /* Map each test card to its Google Form URL
     Replace the # placeholders with your actual Google Form links */
  var FORM_URLS = {
    'iq':    'https://forms.gle/9dueXWU9KGcmmcRU6',
    'eq':    'https://forms.gle/9dueXWU9KGcmmcRU6',
    'sq':    'https://forms.gle/9dueXWU9KGcmmcRU6',
    'combo': 'https://forms.gle/9dueXWU9KGcmmcRU6'
  };

  var UPI_ID  = '9618365156@axisb';   /* ← replace with your actual UPI ID */
  var UPI_NAME = 'Bhava Tech';

  /* Build modal HTML and inject once */
  var modalHTML =
    '<div id="age-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;align-items:center;justify-content:center;">' +
      '<div style="background:#fff;border-radius:16px;padding:32px 28px;max-width:420px;width:90%;position:relative;text-align:center;">' +
        '<button id="age-modal-close" style="position:absolute;top:12px;right:16px;font-size:1.4rem;background:none;border:none;cursor:pointer;color:#888;">&times;</button>' +
        '<div id="age-modal-body"></div>' +
      '</div>' +
    '</div>';
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  var modal     = document.getElementById('age-modal');
  var modalBody = document.getElementById('age-modal-body');
  var closeBtn  = document.getElementById('age-modal-close');

  function openModal(testName, testKey, ageLabel, price) {
    var upiLink = 'upi://pay?pa=' + UPI_ID + '&pn=' + encodeURIComponent(UPI_NAME) +
                  '&am=' + price + '&cu=INR&tn=' + encodeURIComponent(testName + ' ' + ageLabel);

    modalBody.innerHTML =
      '<div style="font-size:2rem;margin-bottom:8px;">💳</div>' +
      '<h3 style="color:var(--primary,#1a2040);font-size:1.15rem;margin-bottom:4px;">' + testName + '</h3>' +
      '<p style="color:#666;font-size:.9rem;margin-bottom:18px;">' + ageLabel + '</p>' +
      '<div style="background:#f0f7ff;border-radius:10px;padding:16px;margin-bottom:20px;">' +
        '<p style="font-size:.85rem;color:#555;margin-bottom:6px;">Pay via UPI</p>' +
        '<p style="font-size:1.5rem;font-weight:700;color:var(--primary,#1a2040);">&#8377;' + price + '</p>' +
        '<p style="font-size:.82rem;color:#777;margin-top:6px;">UPI ID: <strong>' + UPI_ID + '</strong></p>' +
      '</div>' +
      '<a href="' + upiLink + '" style="display:block;background:linear-gradient(135deg,#0a1960,#1a0040);color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:600;font-size:.95rem;margin-bottom:12px;">Pay &#8377;' + price + ' via UPI App</a>' +
      '<p style="font-size:.8rem;color:#888;margin-bottom:14px;">After payment, click below to take the test</p>' +
      '<a href="' + (FORM_URLS[testKey] || '#') + '" target="_blank" style="display:block;border:2px solid var(--accent,#00b4d8);color:var(--accent,#00b4d8);padding:11px 20px;border-radius:10px;text-decoration:none;font-weight:600;font-size:.9rem;margin-bottom:14px;">Open Test Form &#8594;</a>' +
      '<p style="font-size:.78rem;color:#aaa;">Paid but need help? WhatsApp <strong>+91 9573057516</strong></p>';

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function(e) { if (e.target === modal) closeModal(); });

  /* Attach click to every .age-btn */
  document.querySelectorAll('.age-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      /* Get test name from parent card heading */
      var card     = btn.closest('.test-card');
      var heading  = card ? card.querySelector('h3') : null;
      var testName = heading ? heading.textContent.trim() : 'Assessment';

      /* Derive key from name */
      var lower   = testName.toLowerCase();
      var testKey = lower.indexOf('combo') > -1 ? 'combo' :
                    lower.indexOf('iq')    > -1 ? 'iq'    :
                    lower.indexOf('eq')    > -1 ? 'eq'    :
                    lower.indexOf('sq')    > -1 ? 'sq'    : 'iq';

      /* Get age label and price from button text */
      var ageLabel = btn.querySelector('.aage') ? btn.querySelector('.aage').textContent.trim() : btn.textContent.split('\n')[0].trim();
      var priceEl  = btn.querySelector('.aprice');
      var price    = priceEl ? priceEl.textContent.replace(/[^\d]/g, '') : '0';

      openModal(testName, testKey, ageLabel, price);
    });
  });

})();
});


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 2 — Tests, Services, Booking, Payment
// (formerly script-2.js)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.addEventListener('DOMContentLoaded', () => {

  // =============================================
  //  BHĀVA TECH — script-2.js
  //  Tests · Services · Booking · Payment
  // =============================================

  // ─── A. TEST DATA ─────────────────────────────────────────────────
  // 👉 Replace all Google Form URLs with your actual links
  const TESTS = {
    iq: {
      label:'IQ Test', icon:'🧠', tc:'#00b4d8',
      desc:'Intelligence Quotient — Logical reasoning, memory, spatial thinking, and processing speed.',
      groups:[
        { label:'Age 4–7',    price:149, form:'https://forms.gle/YOUR_IQ_4_7_LINK'   },
        { label:'Age 8–11',   price:199, form:'https://forms.gle/YOUR_IQ_8_11_LINK'  },
        { label:'Age 11–15',  price:249, form:'https://forms.gle/YOUR_IQ_11_15_LINK' },
        { label:'Age 16–20',  price:299, form:'https://forms.gle/YOUR_IQ_16_20_LINK' },
        { label:'Adults 21+', price:349, form:'https://forms.gle/YOUR_IQ_ADULT_LINK' },
      ]
    },
    eq: {
      label:'EQ Test', icon:'❤️', tc:'#e63946',
      desc:'Emotional Quotient — Self-awareness, empathy, emotional regulation, and social intelligence.',
      groups:[
        { label:'Age 4–7',    price:149, form:'https://forms.gle/YOUR_EQ_4_7_LINK'   },
        { label:'Age 8–11',   price:199, form:'https://forms.gle/YOUR_EQ_8_11_LINK'  },
        { label:'Age 11–15',  price:249, form:'https://forms.gle/YOUR_EQ_11_15_LINK' },
        { label:'Age 16–20',  price:299, form:'https://forms.gle/YOUR_EQ_16_20_LINK' },
        { label:'Adults 21+', price:349, form:'https://forms.gle/YOUR_EQ_ADULT_LINK' },
      ]
    },
    sq: {
      label:'SQ Test', icon:'🌸', tc:'#7b2d8b',
      desc:'Spiritual Quotient — Inner wisdom, values clarity, purpose, and transcendental awareness.',
      groups:[
        { label:'Age 4–7',    price:149, form:'https://forms.gle/YOUR_SQ_4_7_LINK'   },
        { label:'Age 8–11',   price:199, form:'https://forms.gle/YOUR_SQ_8_11_LINK'  },
        { label:'Age 11–15',  price:249, form:'https://forms.gle/YOUR_SQ_11_15_LINK' },
        { label:'Age 16–20',  price:299, form:'https://forms.gle/YOUR_SQ_16_20_LINK' },
        { label:'Adults 21+', price:349, form:'https://forms.gle/YOUR_SQ_ADULT_LINK' },
      ]
    },
    combo: {
      label:'IQ + EQ + SQ Combo', icon:'🎯', tc:'#2a9d8f',
      desc:'Full cognitive profile — all three tests at a special discount with a comprehensive combined report.',
      groups:[
        { label:'Age 4–7',    price:349, form:'https://forms.gle/YOUR_COMBO_4_7_LINK'   },
        { label:'Age 8–11',   price:449, form:'https://forms.gle/YOUR_COMBO_8_11_LINK'  },
        { label:'Age 11–15',  price:549, form:'https://forms.gle/YOUR_COMBO_11_15_LINK' },
        { label:'Age 16–20',  price:649, form:'https://forms.gle/YOUR_COMBO_16_20_LINK' },
        { label:'Adults 21+', price:749, form:'https://forms.gle/YOUR_COMBO_ADULT_LINK' },
      ]
    }
  };

  // 👉 Replace with your real UPI ID
  const UPI = {
    id:   'bhaavatech@upi',
    name: 'Bhāva Tech',
    note: 'Pay via GPay / PhonePe / Paytm to the UPI ID above, then click "I Have Paid".'
  };

  // 👉 Replace with your booking Google Apps Script URL
  const BOOKING_URL = 'https://script.google.com/macros/s/YOUR_BOOKING_SCRIPT_URL/exec';

  // ─── B. RENDER TEST CARDS ─────────────────────────────────────────
  const tc = document.getElementById('tests-container');
  if (tc) {
    Object.entries(TESTS).forEach(([key, test]) => {
      const card = document.createElement('div');
      card.className = 'test-card section-animate';
      card.style.setProperty('--tc', test.tc);
      card.innerHTML = `
        <div class="test-card-hd">
          <span class="ticon">${test.icon}</span>
          <h3>${test.label}</h3>
        </div>
        <p class="test-desc">${test.desc}</p>
        <div class="age-btns">
          ${test.groups.map((g,i) => `
            <button class="age-btn"
              data-test="${key}" data-gi="${i}"
              data-label="${test.label}" data-age="${g.label}"
              data-price="${g.price}" data-form="${g.form}">
              ${g.label}<span class="aprice">₹${g.price}</span>
            </button>`).join('')}
        </div>`;
      tc.appendChild(card);
      document.querySelector('.section-animate:last-child') && (() => {})();
    });

    // Attach click to all age buttons
    tc.addEventListener('click', e => {
      const btn = e.target.closest('.age-btn');
      if (btn) openModal(btn.dataset);
    });
  }

  // ─── C. RENDER SERVICES GRID ──────────────────────────────────────
  const SERVICES = [
    { icon:'🧠', title:'Brain Gym for Children',         desc:'Structured cognitive workout for ages 6–15. Memory games, attention training, and mindfulness in a fun, gamified format.',        link:'#braingym', color:'#00b4d8' },
    { icon:'📊', title:'IQ Assessment',                   desc:'Standardised Intelligence Quotient tests for 5 age groups. Covers logical reasoning, spatial thinking, and verbal ability.',     link:'#tests',    color:'#2196f3' },
    { icon:'❤️', title:'EQ Assessment',                   desc:'Emotional Quotient evaluation measuring empathy, self-regulation, and social intelligence for lifelong success.',                 link:'#tests',    color:'#e63946' },
    { icon:'🌸', title:'SQ Assessment',                   desc:'Spiritual Quotient testing to understand inner wisdom, values clarity, and purposeful living — unique in Vizag.',               link:'#tests',    color:'#7b2d8b' },
    { icon:'🧘', title:'Meditational & Mindfulness Lab',  desc:'Specially designed sound and light meditation lab for deep relaxation, focus enhancement, and mental wellness.',                 link:'#medlab',   color:'#2a9d8f' },
    { icon:'🔤', title:'Linguistic Projects & Tools',     desc:'AI-powered tools for Sanskrit NLP, grammar correction (Sulekhikā), and multilingual cognitive research.',                       link:'#research', color:'#f4a261' },
    { icon:'🔬', title:'Cognitive Research',               desc:'Applied research on cognition, language, and consciousness drawing from modern neuroscience and ancient Indian thought.',        link:'#research', color:'#457b9d' },
    { icon:'📚', title:'Enhancement Courses',              desc:'Short courses to improve attention, memory, emotional intelligence, and critical thinking for students and professionals.',      link:'#courses',  color:'#e9c46a' },
  ];
  const sg = document.getElementById('services-grid');
  if (sg) {
    SERVICES.forEach(s => {
      const div = document.createElement('div');
      div.className = 'service-card section-animate';
      div.style.setProperty('--card-color', s.color);
      div.innerHTML = `<div class="sicon">${s.icon}</div><h3>${s.title}</h3><p>${s.desc}</p><a href="${s.link}">Learn More →</a>`;
      sg.appendChild(div);
    });
  }

  // ─── D. RENDER PRICING TABLE ──────────────────────────────────────
  const pb = document.getElementById('pricing-body');
  if (pb) {
    const rows = {
      'IQ':             [149,199,249,299,349],
      'EQ':             [149,199,249,299,349],
      'SQ':             [149,199,249,299,349],
      'Combo (IQ+EQ+SQ)':[349,449,549,649,749],
    };
    Object.entries(rows).forEach(([test,vals]) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td><strong>${test}</strong></td>` + vals.map(v=>`<td>₹${v}</td>`).join('');
      pb.appendChild(tr);
    });
  }
  
/* TESTS SECTION */
function toggleTest(cardId) {
  var card = document.getElementById(cardId);
  var allCards = document.querySelectorAll('.test-card');
  allCards.forEach(function(c) {
    if (c.id !== cardId) {
      c.classList.remove('open');
    }
  });
  card.classList.toggle('open');
    document.getElementById('pm-age').textContent    = data.age   || '';
    document.getElementById('pm-amount').textContent = '₹' + (data.price || '');
    document.getElementById('pm-upi').textContent    = UPI.id;
    document.getElementById('pm-note').textContent   = UPI.note;
    m.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    document.getElementById('pay-modal')?.classList.remove('open');
    document.body.style.overflow = '';
    activeBooking = {};
  }

  function resetSteps() {
    document.getElementById('pay-s1').hidden = false;
    document.getElementById('pay-s2').hidden = true;
    document.getElementById('pay-s3').hidden = true;
    document.getElementById('booking-form')?.reset();
  }

  // Close modal handlers
  document.addEventListener('click', e => {
    if (e.target.id==='pay-modal' || e.target.closest('#pay-modal .modal-close')) { closeModal(); resetSteps(); }
    if (e.target.id==='medlab-modal' || e.target.closest('#medlab-modal .modal-close')) {
      document.getElementById('medlab-modal').classList.remove('open');
      document.body.style.overflow = '';
    }
  });
  document.addEventListener('keydown', e => { if(e.key==='Escape'){ closeModal(); resetSteps(); } });

  // Copy UPI ID
  document.getElementById('copy-upi')?.addEventListener('click', () => {
    navigator.clipboard.writeText(UPI.id).then(() => {
      const btn = document.getElementById('copy-upi');
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent='Copy', 2000);
    });
  });

  // Step 1 → Step 2
  document.getElementById('paid-btn')?.addEventListener('click', () => {
    document.getElementById('pay-s1').hidden = true;
    document.getElementById('pay-s2').hidden = false;
  });

  // Step 2 — Booking Form Submit
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = bookingForm.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Verifying…';
      const fd = new FormData(bookingForm);
      fd.append('test',      activeBooking.label || '');
      fd.append('age_group', activeBooking.age   || '');
      fd.append('amount',    activeBooking.price || '');
      fd.append('timestamp', new Date().toISOString());
      fetch(BOOKING_URL, { method:'POST', body:fd })
        .finally(() => { btn.disabled=false; btn.textContent='Confirm & Open Test →'; showStep3(); });
    });
  }

  function showStep3() {
    document.getElementById('pay-s2').hidden = true;
    document.getElementById('pay-s3').hidden = false;
    document.getElementById('open-form-btn')?.addEventListener('click', () => {
      if (activeBooking.form) window.open(activeBooking.form, '_blank');
      closeModal(); resetSteps();
    }, { once: true });
  }

});


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 3 — Session Tracker + Subscription Popup
// (formerly session-tracker.js)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ═══════════════════════════════════════════════════════
// SESSION TRACKER — Bhāva Tech
// Tracks cumulative time, shows subscription popup after 15 min
// ═══════════════════════════════════════════════════════
(function () {
  const FREE_MINUTES  = 15;
  const FREE_SECONDS  = FREE_MINUTES * 60;
  const STORAGE_KEY   = "bv_time";
  const UNLOCK_KEY    = "bv_unlocked";
  const EMAIL_KEY     = "bv_email";
  const TICK_INTERVAL = 10;
  const EXEMPT_PAGES  = ["take-test.html"];
  const VALID_CODES   = [
    "BVMONTH1","BVMONTH2","BVMONTH3","BVMONTH4","BVMONTH5",
    "BVQTR01","BVQTR02","BVQTR03","BVQTR04","BVQTR05",
    "BVYEAR1","BVYEAR2","BVYEAR3","BVYEAR4","BVYEAR5"
  ];

  const page = window.location.pathname.split("/").pop();
  if (EXEMPT_PAGES.some(p => page.includes(p))) return;
  if (localStorage.getItem(UNLOCK_KEY) === "1") return;

  let elapsed = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
  let popupShown = false;

  const ticker = setInterval(() => {
    elapsed += TICK_INTERVAL;
    localStorage.setItem(STORAGE_KEY, elapsed);
    if (!popupShown && elapsed >= FREE_SECONDS) {
      popupShown = true;
      clearInterval(ticker);
      showPopup();
    }
  }, TICK_INTERVAL * 1000);

  function showPopup() {
    const savedEmail = localStorage.getItem(EMAIL_KEY) || "";
    const el = document.createElement("div");
    el.id = "bv-popup";
    el.innerHTML = `
      <style>
        #bv-popup{position:fixed;inset:0;z-index:999999;background:rgba(5,13,26,.94);backdrop-filter:blur(12px);overflow-y:auto;font-family:'Plus Jakarta Sans',sans-serif;}
        .bv-box{max-width:520px;margin:36px auto;padding:16px;}
        .bv-card{background:linear-gradient(135deg,#0d1f35,#112240);border:1.5px solid #1e3a5f;border-radius:18px;padding:28px 22px;position:relative;overflow:hidden;}
        .bv-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#00d4ff,#7c3aed);}
        .bv-title{font-size:1.3rem;font-weight:900;color:#e2f0ff;margin-bottom:6px;font-family:'Orbitron','Plus Jakarta Sans',sans-serif;}
        .bv-sub{font-size:.86rem;color:#7a9cc8;line-height:1.6;margin-bottom:20px;}
        .bv-plans{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:18px;}
        .bv-plan{background:rgba(255,255,255,.04);border:1.5px solid #1e3a5f;border-radius:12px;padding:14px 8px;text-align:center;}
        .bv-plan.popular{background:rgba(99,102,241,.12);border-color:#6366f1;position:relative;}
        .bv-plan.best{background:rgba(245,158,11,.07);border-color:rgba(245,158,11,.4);position:relative;}
        .bv-pill{position:absolute;top:-10px;left:50%;transform:translateX(-50%);font-size:.58rem;font-weight:800;padding:2px 10px;border-radius:20px;white-space:nowrap;color:#fff;}
        .bv-plan-icon{font-size:1.4rem;margin-bottom:4px;}
        .bv-plan-name{font-size:.72rem;font-weight:700;color:#e2f0ff;margin-bottom:4px;}
        .bv-plan-price{font-family:'Orbitron','Plus Jakarta Sans',sans-serif;font-size:1.25rem;font-weight:900;margin:6px 0 2px;}
        .bv-plan-period{font-size:.6rem;color:#7a9cc8;margin-bottom:4px;}
        .bv-plan-save{font-size:.6rem;color:#34d399;font-weight:700;margin-bottom:8px;}
        .bv-wa-btn{display:block;padding:7px 4px;border-radius:8px;font-size:.68rem;font-weight:700;text-decoration:none;margin-top:4px;}
        .bv-divider{border:none;border-top:1px solid #1e3a5f;margin:16px 0;}
        .bv-code-label{font-size:.8rem;color:#7a9cc8;margin-bottom:8px;}
        .bv-code-row{display:flex;gap:8px;}
        .bv-code-input{flex:1;padding:10px 12px;border-radius:9px;background:rgba(255,255,255,.05);border:1.5px solid #1e3a5f;color:#e2f0ff;font-family:inherit;font-size:.88rem;text-transform:uppercase;letter-spacing:.08em;}
        .bv-code-input:focus{outline:none;border-color:#00d4ff;}
        .bv-unlock-btn{padding:10px 18px;border-radius:9px;background:linear-gradient(135deg,#00d4ff,#0099cc);color:#050d1a;font-family:inherit;font-size:.85rem;font-weight:800;border:none;cursor:pointer;white-space:nowrap;}
        .bv-code-err{font-size:.75rem;color:#ff6b9d;margin-top:6px;display:none;}
        .bv-note{text-align:center;font-size:.72rem;color:#7a9cc8;margin-top:14px;line-height:1.6;}
        @media(max-width:400px){.bv-plans{grid-template-columns:1fr;}}
      </style>
      <div class="bv-box"><div class="bv-card">
        <div style="text-align:center;margin-bottom:18px;">
          <div style="font-size:2.8rem;margin-bottom:8px;">⏰</div>
          <div class="bv-title">15 Minutes of Free Access Used!</div>
          <p class="bv-sub">You've been exploring Bhāva Tech for 15 minutes — subscribe to keep using Brain Games, Progress Tracking &amp; more.
            ${savedEmail ? `<br><span style="color:#00d4ff;font-size:.8rem;">👤 Detected: ${savedEmail}</span>` : ""}
          </p>
        </div>
        <div class="bv-plans">
          <div class="bv-plan">
            <div class="bv-plan-icon">📅</div>
            <div class="bv-plan-name">Monthly</div>
            <div class="bv-plan-price" style="color:#00d4ff;">₹300</div>
            <div class="bv-plan-period">/month</div>
            <div class="bv-plan-save">&nbsp;</div>
            <a class="bv-wa-btn" style="background:rgba(0,212,255,.15);border:1px solid rgba(0,212,255,.3);color:#00d4ff;"
              href="https://wa.me/919573057516?text=Hi%2C%20I%20want%20Monthly%20plan%20%E2%82%B9300.%20Email%3A%20${encodeURIComponent(savedEmail)}"
              target="_blank">WhatsApp →</a>
          </div>
          <div class="bv-plan popular">
            <div class="bv-pill" style="background:#6366f1;">⭐ POPULAR</div>
            <div class="bv-plan-icon">📦</div>
            <div class="bv-plan-name">Quarterly</div>
            <div class="bv-plan-price" style="color:#a78bfa;">₹500</div>
            <div class="bv-plan-period">3 months</div>
            <div class="bv-plan-save">Save ₹400!</div>
            <a class="bv-wa-btn" style="background:rgba(124,58,237,.25);border:1px solid rgba(124,58,237,.5);color:#a78bfa;"
              href="https://wa.me/919573057516?text=Hi%2C%20I%20want%20Quarterly%20plan%20%E2%82%B9500.%20Email%3A%20${encodeURIComponent(savedEmail)}"
              target="_blank">WhatsApp →</a>
          </div>
          <div class="bv-plan best">
            <div class="bv-pill" style="background:#f59e0b;">🏆 BEST</div>
            <div class="bv-plan-icon">🏆</div>
            <div class="bv-plan-name">Annual</div>
            <div class="bv-plan-price" style="color:#fbbf24;">₹1,200</div>
            <div class="bv-plan-period">per year</div>
            <div class="bv-plan-save">Save ₹2,400!</div>
            <a class="bv-wa-btn" style="background:rgba(245,158,11,.2);border:1px solid rgba(245,158,11,.4);color:#fbbf24;"
              href="https://wa.me/919573057516?text=Hi%2C%20I%20want%20Annual%20plan%20%E2%82%B91200.%20Email%3A%20${encodeURIComponent(savedEmail)}"
              target="_blank">WhatsApp →</a>
          </div>
        </div>
        <p style="text-align:center;font-size:.75rem;color:#7a9cc8;margin-bottom:14px;">
          📲 Pay on WhatsApp → we send you an <strong style="color:#00d4ff;">unlock code</strong> instantly
        </p>
        <hr class="bv-divider">
        <div class="bv-code-label">Already paid? Enter your unlock code:</div>
        <div class="bv-code-row">
          <input class="bv-code-input" id="bv-code-input" type="text" placeholder="e.g. BVQTR01" maxlength="10">
          <button class="bv-unlock-btn" onclick="bvUnlock()">Unlock ✅</button>
        </div>
        <div class="bv-code-err" id="bv-code-err">❌ Invalid code. Please check and try again.</div>
        <p class="bv-note">🔒 Your data stays on this device &nbsp;|&nbsp;
          💬 Support: <a href="https://wa.me/919573057516" target="_blank" style="color:#25d366;">WhatsApp Us</a>
        </p>
      </div></div>`;
    document.body.appendChild(el);
    document.body.style.overflow = "hidden";
  }

  window.bvUnlock = function () {
    const input = document.getElementById("bv-code-input");
    const err   = document.getElementById("bv-code-err");
    const code  = (input.value || "").trim().toUpperCase();
    if (VALID_CODES.includes(code)) {
      localStorage.setItem(UNLOCK_KEY, "1");
      localStorage.setItem(STORAGE_KEY, "0");
      document.getElementById("bv-popup").remove();
      document.body.style.overflow = "";
      const toast = document.createElement("div");
      toast.style.cssText = "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#00e676;color:#050d1a;padding:12px 24px;border-radius:10px;font-weight:800;font-size:.92rem;z-index:999999;box-shadow:0 4px 20px rgba(0,230,118,.4);";
      toast.textContent = "✅ Unlocked! Welcome to Bhāva Tech!";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 4000);
    } else {
      err.style.display = "block";
      input.style.borderColor = "#ff6b9d";
      setTimeout(() => { err.style.display="none"; input.style.borderColor="#1e3a5f"; }, 3000);
    }
  };

  document.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && document.getElementById("bv-code-input") === document.activeElement) {
      window.bvUnlock();
    }
  });

  window.bvSaveEmail = function(email) {
    if (email) localStorage.setItem(EMAIL_KEY, email);
  };

})();

