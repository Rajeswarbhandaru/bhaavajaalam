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
