// ── Bhāva Tech — Session Tracker v2 ─────────────────────────────────────────
// Add to any game HTML just before </body>:
//   <script src="bhava-session.js"></script>
//
// Behaviour:
//   Browser/website  → completely silent, no popup, no tracking (public access)
//   Electron + guest → modal shown, student must choose Login or Guest
//   Electron + login → full tracking to SQLite (school students)
//
// Call from game's score-save logic:
//   BhavaSession.end(myScore);  // score: 0–100

(function () {
  'use strict';

  const SCHOOL_ID = 'BHAVA-SVN-001';
  const GAME_NAME = document.title || 'Unknown Game';

  let currentStudent   = null;
  let currentSessionId = null;

  // ── Only activate inside Electron ─────────────────────────────────────────
  const isElectron = typeof window !== 'undefined' && typeof window.bhava !== 'undefined';

  // If running in a browser (website), do nothing at all
  if (!isElectron) {
    window.BhavaSession = {
      end:        () => {},
      getStudent: () => null,
      showLogin:  () => {},
    };
    return;
  }

  // ── Restore student from sessionStorage (persists across games) ───────────
  function restoreStudent() {
    try {
      const saved = sessionStorage.getItem('bhava_student');
      if (saved) { currentStudent = JSON.parse(saved); return true; }
    } catch (e) {}
    return false;
  }

  function saveStudent(student) {
    try { sessionStorage.setItem('bhava_student', JSON.stringify(student)); } catch (e) {}
    currentStudent = student;
  }

  function clearStudent() {
    try { sessionStorage.removeItem('bhava_student'); } catch (e) {}
    currentStudent = null;
    currentSessionId = null;
  }

  // ── Login modal — blocks game until Login or Guest is chosen ──────────────
  function showLoginModal() {
    if (document.getElementById('bhava-login-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'bhava-login-modal';
    modal.innerHTML = `
      <div style="
        position:fixed;inset:0;background:rgba(0,0,0,0.80);z-index:999999;
        display:flex;align-items:center;justify-content:center;
        font-family:system-ui,sans-serif;">
        <div style="
          background:#fff;border-radius:16px;padding:2.5rem 2rem;width:340px;
          box-shadow:0 8px 40px rgba(1,105,111,0.25);text-align:center;">

          <svg width="44" height="44" viewBox="0 0 48 48" style="margin-bottom:8px">
            <circle cx="24" cy="24" r="22" fill="#01696f"/>
            <text x="24" y="30" text-anchor="middle" fill="white"
                  font-size="18" font-weight="bold" font-family="sans-serif">भ</text>
          </svg>
          <h2 style="margin:0 0 2px;color:#01696f;font-size:1.35rem">Bhāva Tech</h2>
          <p style="color:#888;font-size:0.82rem;margin:0 0 18px">
            Login to save progress &amp; earn reports
          </p>

          <label style="display:block;text-align:left;font-size:0.8rem;font-weight:600;
                        color:#333;margin-bottom:3px">School Name</label>
          <input id="bt-school" type="text" placeholder="e.g. ZP High School"
            style="width:100%;padding:9px 12px;border:1.5px solid #ddd;border-radius:8px;
                   font-size:1rem;margin-bottom:10px;box-sizing:border-box;outline:none"/>

          <label style="display:block;text-align:left;font-size:0.8rem;font-weight:600;
                        color:#333;margin-bottom:3px">Roll Number</label>
          <input id="bt-roll" type="number" placeholder="e.g. 1001"
            style="width:100%;padding:9px 12px;border:1.5px solid #ddd;border-radius:8px;
                   font-size:1rem;margin-bottom:10px;box-sizing:border-box;outline:none"/>

          <label style="display:block;text-align:left;font-size:0.8rem;font-weight:600;
                        color:#333;margin-bottom:3px">Class</label>
          <select id="bt-class"
            style="width:100%;padding:9px 12px;border:1.5px solid #ddd;border-radius:8px;
                   font-size:0.92rem;margin-bottom:14px;box-sizing:border-box;
                   background:#fff;outline:none">
            <option value="">Select class</option>
            ${[1,2,3,4,5,6,7,8,9,10,11,12].map(c=>`<option value="${c}">Class ${c}</option>`).join('')}
          </select>

          <div id="bt-err" style="color:#a12c7b;font-size:0.8rem;min-height:16px;margin-bottom:8px"></div>

          <button id="bt-login-btn"
            style="width:100%;padding:11px;background:#01696f;color:#fff;border:none;
                   border-radius:8px;font-size:0.95rem;font-weight:700;cursor:pointer;
                   margin-bottom:8px">
            ▶ Login &amp; Play
          </button>
          <button id="bt-guest-btn"
            style="width:100%;padding:9px;background:#f3f3f3;color:#555;border:none;
                   border-radius:8px;font-size:0.85rem;cursor:pointer">
            Continue as Guest
          </button>
          <p style="font-size:0.7rem;color:#ccc;margin:10px 0 0">
            Ask your teacher for your Roll No
          </p>
        </div>
      </div>`;

    document.body.appendChild(modal);

    // Clicking the dark backdrop does nothing — must choose Login or Guest
    modal.querySelector('div').addEventListener('click', e => e.stopPropagation());

    // Guest button — dismiss modal, play without tracking
    document.getElementById('bt-guest-btn').addEventListener('click', () => {
      modal.remove();
    });

    // Login button
    document.getElementById('bt-login-btn').addEventListener('click', async () => {
      const school = document.getElementById('bt-school').value.trim();
      const rollNo = parseInt(document.getElementById('bt-roll').value, 10);
      const cls    = document.getElementById('bt-class').value;
      const errEl  = document.getElementById('bt-err');

      if (!rollNo || !cls) { errEl.textContent = 'Enter Roll No and Class.'; return; }
      errEl.textContent = '';

      const btn = document.getElementById('bt-login-btn');
      btn.textContent = 'Checking...';
      btn.disabled = true;

      const student = await window.bhava.login(rollNo, cls);
      if (!student) {
        errEl.textContent = 'Not found. Check Roll No and Class.';
        btn.textContent = '▶ Login & Play';
        btn.disabled = false;
        return;
      }

      // Attach school name entered by student
      student.school_name = school;
      saveStudent(student);
      modal.remove();
      startSession();
    });

    // Allow pressing Enter on Roll No field to trigger login
    document.getElementById('bt-roll').addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('bt-login-btn').click();
    });
  }

  // ── Session management ─────────────────────────────────────────────────────
  async function startSession() {
    if (!currentStudent) return;
    try {
      currentSessionId = await window.bhava.startSession(
        currentStudent.id,
        currentStudent.school_id || SCHOOL_ID,
        GAME_NAME
      );
      console.log('[BhavaSession] started:', currentSessionId, 'game:', GAME_NAME);
    } catch (e) {
      console.error('[BhavaSession] startSession failed:', e);
    }
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  window.BhavaSession = {

    end: async function (rawScore) {
      if (!currentStudent || !currentSessionId) {
        console.log('[BhavaSession] Guest mode — score not saved:', rawScore);
        return;
      }
      try {
        const result = await window.bhava.endSession(currentSessionId, rawScore);
        console.log('[BhavaSession] Score saved. Scaled:', result?.scaled);
        currentSessionId = null;
      } catch (e) {
        console.error('[BhavaSession] endSession failed:', e);
      }
    },

    getStudent: () => currentStudent,
    isLoggedIn: () => currentStudent !== null,
    showLogin:  showLoginModal,
    logout:     clearStudent,
  };

  // ── Auto-init ──────────────────────────────────────────────────────────────
  function init() {
    const alreadyLoggedIn = restoreStudent();
    if (alreadyLoggedIn) {
      startSession();       // already logged in — resume silently
    } else {
      showLoginModal();     // block game until Login or Guest chosen
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ── Global Nav Bar (auto-injects on every page) ──────────────
(function injectNavBar() {
  // Don't show on the login/home page itself
  const currentPage = window.location.pathname.split('/').pop()
  if (currentPage === 'index.html' || currentPage === '') return

  const bar = document.createElement('div')
  bar.id = 'bhava-global-nav'
  bar.innerHTML = `
    <button onclick="window.location.href='index.html'" title="Home">
      🏠 Home
    </button>
    <button onclick="window.location.href='bhava-student-report.html'" title="My Report">
      📊 My Report
    </button>
  `
  bar.style.cssText = `
    position: fixed;
    bottom: 16px;
    right: 16px;
    display: flex;
    gap: 8px;
    z-index: 99999;
  `
  const btnStyle = `
    background: rgba(30,30,40,0.85);
    color: white;
    border: none;
    border-radius: 999px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    transition: background 0.2s;
  `
  bar.querySelectorAll('button').forEach(b => {
    b.style.cssText = btnStyle
    b.onmouseenter = () => b.style.background = 'rgba(74,108,247,0.9)'
    b.onmouseleave = () => b.style.background = 'rgba(30,30,40,0.85)'
  })

  document.body.appendChild(bar)
})()

})();