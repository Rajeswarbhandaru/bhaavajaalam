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
