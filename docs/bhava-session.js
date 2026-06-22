// ── Bhāva Tech — Session Tracker + Game Nav v3 ───────────────────────────────
// Single unified file. Drop ONE tag before </body> in any game HTML:
//   <script src="bhava-session.js"></script>
//
// Behaviour:
//   Browser / website  → completely silent (public access, no tracking)
//   Electron + guest   → login modal shown, student chooses Login or Guest
//   Electron + login   → full session tracking + nav bar with My Report page
//   Android/Capacitor  → login via cloud lookup, session posted to cloud on end
//
// Call from game score logic:
//   BhavaSession.end(myScore);   // score: 0–100
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  var SCHOOL_ID  = 'BHAVA-SVN-001';
  var CLOUD_URL  = 'https://bhava-cloud.onrender.com';
  var CLOUD_KEY  = '0042bfd36ef4a5a219e0bbb206e58ec7b84c7d9334b75c7e';
  var GAME_NAME  = document.title || 'Unknown Game';
  var REPORT_URL = 'bhava-student-report.html';   // all files are inside docs/

  var currentStudent   = null;
  var currentSessionId = null;

  // ── Environment detection ──────────────────────────────────────────────────
  // Electron sets window.bhava without _isElectron flag (undefined = truthy check).
  // bhava-bridge.js sets window.bhava._isElectron = false to signal Android/web mode.
  var isElectron  = (typeof window !== 'undefined') &&
                    (typeof window.bhava !== 'undefined') &&
                    (window.bhava._isElectron !== false);
  var isCapacitor = !isElectron && (typeof window !== 'undefined') && (
    (typeof window.bhava !== 'undefined') ||   // bhava-bridge.js active = Capacitor/web
    window.location.protocol === 'capacitor:' ||
    (typeof navigator !== 'undefined' && /wv|Android/i.test(navigator.userAgent))
  );
  var isActive = isElectron || isCapacitor;  // tracking is active on either platform

  if (!isActive) {
    // Browser / public website — expose silent no-op API
    window.BhavaSession = {
      end:        function () {},
      getStudent: function () { return null; },
      isLoggedIn: function () { return false; },
      showLogin:  function () {},
      logout:     function () {},
      setStudent: function () {},
    };
    return;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 1 — Student Storage
  // Saves student under every key name used anywhere in the codebase so that
  // bhava-student-report.html, bhava-game-nav, and any legacy code all find it.
  // ─────────────────────────────────────────────────────────────────────────

  function persistStudent(student) {
    if (!student) return;
    currentStudent = student;
    // Window var — fastest synchronous read (survives sessionStorage sandbox lock)
    window._bhavaStudentId = student.id;
    try {
      sessionStorage.setItem('bhava_student',    JSON.stringify(student));
      sessionStorage.setItem('bhavaStudentId',   String(student.id));
      sessionStorage.setItem('bhava_student_id', String(student.id));
      sessionStorage.setItem('studentId',        String(student.id));
    } catch (e) {}
    // Also write to localStorage so report page can read it after page navigation
    // (sessionStorage is cleared on Android WebView when navigating to a new page)
    try {
      localStorage.setItem('bhava_current_student', JSON.stringify(student));
    } catch (e) {}
  }

  function restoreStudent() {
    try {
      var saved = sessionStorage.getItem('bhava_student');
      if (saved) {
        var obj = JSON.parse(saved);
        if (obj && obj.id != null) {
          currentStudent = obj;
          window._bhavaStudentId = obj.id;
          return true;
        }
      }
    } catch (e) {}
    return false;
  }

  function clearStudent() {
    currentStudent   = null;
    currentSessionId = null;
    window._bhavaStudentId = null;
    try {
      sessionStorage.removeItem('bhava_student');
      sessionStorage.removeItem('bhavaStudentId');
      sessionStorage.removeItem('bhava_student_id');
      sessionStorage.removeItem('studentId');
    } catch (e) {}
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 2 — Login Modal
  // ─────────────────────────────────────────────────────────────────────────

  function showLoginModal() {
    if (document.getElementById('bhava-login-modal')) return;

    var classes = [1,2,3,4,5,6,7,8,9,10,11,12].map(function (c) {
      return '<option value="' + c + '">Class ' + c + '</option>';
    }).join('');

    var modal = document.createElement('div');
    modal.id = 'bhava-login-modal';
    modal.innerHTML = '<div style="'
      + 'position:fixed;inset:0;background:rgba(0,0,0,0.80);z-index:999999;'
      + 'display:flex;align-items:center;justify-content:center;'
      + 'font-family:system-ui,sans-serif;">'
      + '<div style="'
      + 'background:#fff;border-radius:16px;padding:2.5rem 2rem;width:340px;'
      + 'box-shadow:0 8px 40px rgba(1,105,111,0.25);text-align:center;">'

      + '<svg width="44" height="44" viewBox="0 0 48 48" style="margin-bottom:8px;display:inline-block">'
      + '<circle cx="24" cy="24" r="22" fill="#01696f"/>'
      + '<text x="24" y="30" text-anchor="middle" fill="white"'
      + ' font-size="18" font-weight="bold" font-family="sans-serif">\u092D</text>'
      + '</svg>'
      + '<h2 style="margin:0 0 2px;color:#01696f;font-size:1.35rem">Bh\u0101va Tech</h2>'
      + '<p style="color:#888;font-size:0.82rem;margin:0 0 18px">'
      + 'Login to save progress &amp; earn reports</p>'

      + '<label style="display:block;text-align:left;font-size:0.8rem;font-weight:600;'
      + 'color:#333;margin-bottom:3px">Roll Number</label>'
      + '<input id="bt-roll" type="number" placeholder="e.g. 1001"'
      + ' style="width:100%;padding:9px 12px;border:1.5px solid #ddd;border-radius:8px;'
      + 'font-size:1rem;margin-bottom:10px;box-sizing:border-box;outline:none"/>'

      + '<label style="display:block;text-align:left;font-size:0.8rem;font-weight:600;'
      + 'color:#333;margin-bottom:3px">Class</label>'
      + '<select id="bt-class"'
      + ' style="width:100%;padding:9px 12px;border:1.5px solid #ddd;border-radius:8px;'
      + 'font-size:0.92rem;margin-bottom:14px;box-sizing:border-box;background:#fff;outline:none">'
      + '<option value="">Select class</option>'
      + classes
      + '</select>'

      + '<div id="bt-err" style="color:#a12c7b;font-size:0.8rem;min-height:16px;margin-bottom:8px"></div>'

      + '<button id="bt-login-btn"'
      + ' style="width:100%;padding:11px;background:#01696f;color:#fff;border:none;'
      + 'border-radius:8px;font-size:0.95rem;font-weight:700;cursor:pointer;margin-bottom:8px">'
      + '&#9654; Login &amp; Play</button>'

      + '<button id="bt-guest-btn"'
      + ' style="width:100%;padding:9px;background:#f3f3f3;color:#555;border:none;'
      + 'border-radius:8px;font-size:0.85rem;cursor:pointer">'
      + 'Continue as Guest</button>'

      + '<p style="font-size:0.7rem;color:#ccc;margin:10px 0 0">'
      + 'Ask your teacher for your Roll No</p>'
      + '</div></div>';

    document.body.appendChild(modal);

    // Clicking backdrop does nothing — must choose Login or Guest
    modal.querySelector('div').addEventListener('click', function (e) {
      e.stopPropagation();
    });

    document.getElementById('bt-guest-btn').addEventListener('click', function () {
      modal.remove();
    });

    document.getElementById('bt-login-btn').addEventListener('click', async function () {
      var rollNo = parseInt(document.getElementById('bt-roll').value, 10);
      var cls    = document.getElementById('bt-class').value;
      var errEl  = document.getElementById('bt-err');

      if (!rollNo || !cls) { errEl.textContent = 'Enter Roll No and Class.'; return; }
      errEl.textContent = '';

      var btn = document.getElementById('bt-login-btn');
      btn.textContent = 'Checking…';
      btn.disabled = true;

      try {
        var student;

        if (window.bhava && window.bhava._isElectron !== false) {
          // Electron — look up from local SQLite
          student = await window.bhava.login(rollNo, cls);
        } else {
          // Android/Capacitor — look up from cloud
          var res = await fetch(
            CLOUD_URL + '/sync/student-lookup?roll=' + encodeURIComponent(rollNo) +
            '&class=' + encodeURIComponent(cls),
            { headers: { 'x-bhava-sync-key': CLOUD_KEY } }
          );
          student = res.ok ? await res.json() : null;
          // Normalise field names to match Electron response shape
          if (student && student.roll_number && !student.roll_no) {
            student.roll_no = student.roll_number;
          }
        }

        if (!student || !student.id) {
          errEl.textContent = 'Not found. Check Roll No and Class.';
          btn.textContent = '\u25B6 Login & Play';
          btn.disabled = false;
          return;
        }

        persistStudent(student);   // saves to all keys + window var
        _syncToNav();              // tell nav bar immediately
        modal.remove();
        startSession();

      } catch (err) {
        errEl.textContent = 'Login error: ' + (err.message || err);
        btn.textContent = '\u25B6 Login & Play';
        btn.disabled = false;
      }
    });

    document.getElementById('bt-roll').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') document.getElementById('bt-login-btn').click();
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 3 — Session Management
  // ─────────────────────────────────────────────────────────────────────────

  async function startSession() {
    if (!currentStudent) return;
    try {
      if (window.bhava && window.bhava._isElectron !== false) {
        // Electron — create session in local SQLite via IPC
        currentSessionId = await window.bhava.startSession(
          currentStudent.id,
          currentStudent.school_id || SCHOOL_ID,
          GAME_NAME
        );
        console.log('[BhavaSession] started:', currentSessionId, '| game:', GAME_NAME);
      } else {
        // Android/Capacitor — generate a local UUID; session is posted to cloud on end
        currentSessionId = 'and-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
        console.log('[BhavaSession] Android session ID generated:', currentSessionId, '| game:', GAME_NAME);
      }
    } catch (e) {
      console.error('[BhavaSession] startSession failed:', e);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 4 — Score helpers (handles all IPC return shapes)
  // ─────────────────────────────────────────────────────────────────────────

  function extractTotal(v) {
    if (v == null) return null;
    if (typeof v.total           === 'number') return Math.round(v.total);
    if (typeof v.iq_score        === 'number') return Math.round(v.iq_score);
    if (typeof v.eq_score        === 'number') return Math.round(v.eq_score);
    if (typeof v.sq_score        === 'number') return Math.round(v.sq_score);
    if (typeof v.score           === 'number') return Math.round(v.score);
    if (typeof v.composite       === 'number') return Math.round(v.composite);
    // last resort: first positive number found
    var keys = Object.keys(v);
    for (var i = 0; i < keys.length; i++) {
      if (typeof v[keys[i]] === 'number' && v[keys[i]] > 0) return Math.round(v[keys[i]]);
    }
    return null;
  }

  function fmtScore(promiseResult) {
    if (!promiseResult || promiseResult.status !== 'fulfilled' || !promiseResult.value) return '—';
    var n = extractTotal(promiseResult.value);
    return n != null ? n : '—';
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 5 — Nav Bar (injected into every game page)
  // ─────────────────────────────────────────────────────────────────────────

  function injectNavBar() {
    if (document.getElementById('bhava-game-nav')) return;

    // ── Styles ──────────────────────────────────────────────────────────────
    var style = document.createElement('style');
    style.textContent =
      '#bhava-game-nav{position:fixed;top:0;left:0;right:0;z-index:9999;display:flex;' +
      'align-items:center;gap:8px;padding:6px 14px;height:44px;' +
      'background:rgba(10,8,20,0.88);backdrop-filter:blur(14px);' +
      '-webkit-backdrop-filter:blur(14px);' +
      'border-bottom:1px solid rgba(255,255,255,0.08);' +
      "font-family:'Poppins','Inter',sans-serif;}" +

      '#bhava-game-nav-spacer{height:44px;display:block;}' +

      '#bhava-game-nav .bgnav-btn{display:inline-flex;align-items:center;gap:5px;' +
      'padding:5px 13px;border-radius:999px;font-size:12px;font-weight:700;' +
      'letter-spacing:.04em;border:1px solid transparent;cursor:pointer;' +
      'transition:background .18s,border-color .18s,transform .15s;' +
      'white-space:nowrap;font-family:inherit;background:none;}' +
      '#bhava-game-nav .bgnav-btn:active{transform:scale(.95);}' +

      '#bhava-game-nav .bgnav-back{background:rgba(255,255,255,.05);' +
      'border-color:rgba(255,255,255,.12);color:#94a3b8;}' +
      '#bhava-game-nav .bgnav-back:hover{background:rgba(255,255,255,.12);' +
      'border-color:rgba(255,255,255,.28);color:#e2e8f0;}' +

      '#bhava-game-nav .bgnav-home{background:rgba(109,40,217,.18);' +
      'border-color:rgba(167,139,250,.35);color:#c4b5fd;}' +
      '#bhava-game-nav .bgnav-home:hover{background:rgba(109,40,217,.35);' +
      'border-color:rgba(167,139,250,.65);color:#e9d5ff;}' +

      '#bhava-game-nav .bgnav-title{font-size:11px;font-weight:600;' +
      'color:rgba(255,255,255,.28);letter-spacing:.08em;text-transform:uppercase;' +
      'flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:center;}' +

      '#bhava-game-nav .bgnav-report{background:rgba(1,105,111,.18);' +
      'border-color:rgba(79,152,163,.4);color:#67e8f9;margin-left:auto;}' +
      '#bhava-game-nav .bgnav-report:hover{background:rgba(1,105,111,.35);' +
      'border-color:rgba(79,152,163,.7);color:#a5f3fc;}' +
      '#bhava-game-nav .bgnav-report.bgnav-hidden{display:none;}' +

      // ── Report modal ──────────────────────────────────────────────────────
      '#bgnav-modal{display:none;position:fixed;inset:0;z-index:10000;' +
      'background:rgba(5,5,15,.92);backdrop-filter:blur(18px);' +
      '-webkit-backdrop-filter:blur(18px);align-items:center;justify-content:center;' +
      "padding:20px;font-family:'Poppins','Inter',sans-serif;}" +
      '#bgnav-modal.bgnav-open{display:flex;}' +

      '#bgnav-modal-inner{background:linear-gradient(145deg,#0f0e1a,#1a1630);' +
      'border:1px solid rgba(167,139,250,.25);border-radius:20px;' +
      'padding:28px 24px;width:100%;max-width:460px;' +
      'box-shadow:0 24px 64px rgba(0,0,0,.5);}' +
      '#bgnav-modal-inner h3{font-size:18px;font-weight:800;color:#e2e8f0;' +
      'margin:0 0 4px;display:flex;align-items:center;gap:8px;}' +
      '.bgnav-msub{font-size:12px;color:#64748b;margin-bottom:20px;}' +

      '.bgnav-srow{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:18px;}' +
      '.bgnav-sc{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);' +
      'border-radius:14px;padding:14px 10px;text-align:center;}' +
      '.bgnav-sc .sl{font-size:10px;font-weight:700;letter-spacing:.1em;' +
      'text-transform:uppercase;color:#64748b;margin-bottom:6px;}' +
      '.bgnav-sc .sv{font-size:26px;font-weight:800;font-variant-numeric:tabular-nums;line-height:1;}' +
      '.bgnav-sc.iq .sv{color:#818cf8;}.bgnav-sc.eq .sv{color:#f472b6;}.bgnav-sc.sq .sv{color:#34d399;}' +

      '.bgnav-slbl{font-size:10px;font-weight:700;letter-spacing:.08em;' +
      'text-transform:uppercase;color:#475569;margin-bottom:8px;}' +
      '.bgnav-si{display:flex;align-items:center;justify-content:space-between;' +
      'padding:8px 12px;background:rgba(255,255,255,.03);border-radius:10px;' +
      'margin-bottom:6px;font-size:12px;color:#94a3b8;' +
      'border:1px solid rgba(255,255,255,.05);}' +
      '.bgnav-si .sg{font-weight:600;color:#c4b5fd;flex:1;' +
      'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}' +
      '.bgnav-si .ss{color:#fde68a;font-weight:700;margin:0 8px;white-space:nowrap;}' +
      '.bgnav-tag{display:inline-block;font-size:10px;font-weight:700;padding:2px 7px;' +
      'border-radius:999px;margin-left:4px;}' +
      '.bgnav-tag.done{background:rgba(52,211,153,.12);color:#34d399;}' +
      '.bgnav-tag.playing{background:rgba(251,191,36,.1);color:#fbbf24;}' +

      '.bgnav-actions{display:flex;gap:10px;margin-top:18px;}' +
      '.bgnav-actions button{flex:1;padding:10px;border-radius:10px;font-size:13px;' +
      'font-weight:700;cursor:pointer;font-family:inherit;border:none;' +
      'transition:opacity .2s;}' +
      '.bgnav-actions button:hover{opacity:.85;}' +
      '.bgnav-btn-close{background:rgba(255,255,255,.08)!important;' +
      'color:#94a3b8!important;border:1px solid rgba(255,255,255,.1)!important;}' +
      '.bgnav-btn-report-full{background:linear-gradient(135deg,#01696f,#06b6d4);color:#fff;}' +

      '.bgnav-info{text-align:center;color:#475569;font-size:13px;' +
      'padding:18px;border:1px dashed rgba(255,255,255,.08);border-radius:12px;}' +
      '.bgnav-loading{text-align:center;color:#475569;font-size:13px;padding:18px 0;}';
    document.head.appendChild(style);

    // ── Nav bar HTML ─────────────────────────────────────────────────────────
    var gameTitle = (document.title || 'Game')
      .replace(/bh[aā]va|tech/gi, '').trim().slice(0, 32) || 'Bhāva Game';

    var nav = document.createElement('div');
    nav.id = 'bhava-game-nav';
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Game navigation');
    nav.innerHTML =
      '<button class="bgnav-btn bgnav-back"   id="bgnav-back"   aria-label="Go back">&#8592; Back</button>' +
      '<button class="bgnav-btn bgnav-home"   id="bgnav-home"   aria-label="Go home">&#127968; Home</button>' +
      '<span  class="bgnav-title">' + gameTitle + '</span>' +
      '<button class="bgnav-btn bgnav-report bgnav-hidden" id="bgnav-report" aria-label="My report">&#128202; My Report</button>';

    var spacer = document.createElement('div');
    spacer.id = 'bhava-game-nav-spacer';

    // Prepend spacer then nav so nav sits above all content
    document.body.insertBefore(spacer, document.body.firstChild);
    document.body.insertBefore(nav,    document.body.firstChild);

    // ── Report modal HTML ────────────────────────────────────────────────────
    var modal = document.createElement('div');
    modal.id = 'bgnav-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML =
      '<div id="bgnav-modal-inner">' +
        '<h3>&#128202; My Report</h3>' +
        '<div class="bgnav-msub" id="bgnav-msub">Your cognitive scores</div>' +
        '<div id="bgnav-mbody"><div class="bgnav-loading">Fetching scores from Bh\u0101va DB\u2026</div></div>' +
        '<div class="bgnav-actions">' +
          '<button class="bgnav-btn-close"       id="bgnav-mclose">&#10005; Close</button>' +
          '<button class="bgnav-btn-report-full" id="bgnav-mfull">&#128196; Full Report</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    // ── Nav actions ──────────────────────────────────────────────────────────
    document.getElementById('bgnav-back').addEventListener('click', _goBack);
    document.getElementById('bgnav-home').addEventListener('click', _goHome);
    document.getElementById('bgnav-mclose').addEventListener('click', function () {
      modal.classList.remove('bgnav-open');
    });
    document.getElementById('bgnav-mfull').addEventListener('click', function () {
      _openReportPage();
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.classList.remove('bgnav-open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') modal.classList.remove('bgnav-open');
    });

    // My Report button → open inline modal
    document.getElementById('bgnav-report').addEventListener('click', _openReportModal);

    // Show report button once student is confirmed (Electron IPC or Capacitor login)
    var checks = 0;
    var poll = setInterval(function () {
      if (currentStudent || window.bhava) {
        document.getElementById('bgnav-report').classList.remove('bgnav-hidden');
        clearInterval(poll);
      }
      if (++checks > 30) clearInterval(poll);
    }, 200);
  }

  // ── Navigation helpers ─────────────────────────────────────────────────────
  function _goHome() {
    var here = window.location.pathname;
    if (here.indexOf('/docs/') !== -1) {
      window.location.href = 'index.html';
    } else {
      window.location.href = 'docs/index.html';
    }
  }
  function _goBack() {
    window.history.length > 1 ? window.history.back() : _goHome();
  }

  // ── Open the full report page (passes sid in URL) ──────────────────────────
  function _openReportPage() {
    var sid = _resolveStudentId();
    var base = 'bhava-student-report.html';
    window.location.href = base + (sid ? '?sid=' + encodeURIComponent(sid) : '');
  }

  // ── Resolve student ID from all possible sources ───────────────────────────
  function _resolveStudentId() {
    if (currentStudent && currentStudent.id != null) return String(currentStudent.id);
    if (window._bhavaStudentId) return String(window._bhavaStudentId);
    var keys = ['bhava_student', 'bhavaStudentId', 'bhava_student_id', 'studentId'];
    try {
      var json = sessionStorage.getItem('bhava_student');
      if (json) { var obj = JSON.parse(json); if (obj && obj.id) return String(obj.id); }
    } catch (e) {}
    for (var i = 1; i < keys.length; i++) {
      try { var v = sessionStorage.getItem(keys[i]); if (v) return v; } catch (e) {}
    }
    try {
      var p = new URLSearchParams(window.location.search);
      return p.get('sid') || p.get('studentId') || null;
    } catch (e) {}
    return null;
  }

  // ── Sync student ID to BhavaNav API (after nav bar is mounted) ────────────
  function _syncToNav() {
    var sid = _resolveStudentId();
    if (!sid) return;
    window._bhavaStudentId = sid;
    var btn = document.getElementById('bgnav-report');
    if (btn) btn.classList.remove('bgnav-hidden');
    if (window.BhavaNav && typeof window.BhavaNav.setStudent === 'function') {
      window.BhavaNav.setStudent(sid);
    }
  }

  // ── Inline modal: fetch and render scores ─────────────────────────────────
  async function _openReportModal() {
    var modal = document.getElementById('bgnav-modal');
    if (!modal) return;
    modal.classList.add('bgnav-open');

    var body = document.getElementById('bgnav-mbody');
    var sub  = document.getElementById('bgnav-msub');
    body.innerHTML = '<div class="bgnav-loading">Fetching scores from Bh\u0101va DB\u2026</div>';

    var sid = _resolveStudentId();
    if (!sid) {
      body.innerHTML = '<div class="bgnav-info">Not logged in.<br>Please log in from Home first.</div>';
      return;
    }

    if (currentStudent && currentStudent.name) {
      sub.textContent = currentStudent.name + (currentStudent.class ? ' \u00B7 Class ' + currentStudent.class : '');
    } else {
      sub.textContent = 'Student ID: ' + sid;
    }

    try {
      var iq = '—', eq = '—', sq = '—', sessions = [];

      if (window.bhava && window.bhava._isElectron !== false) {
        // Electron — use IPC
        var results = await Promise.allSettled([
          window.bhava.getIQScores(sid),
          window.bhava.getEQScores(sid),
          window.bhava.getSQScores(sid),
          window.bhava.getGameSessions(sid)
        ]);
        iq = fmtScore(results[0]);
        eq = fmtScore(results[1]);
        sq = fmtScore(results[2]);
        sessions = (results[3].status === 'fulfilled' && Array.isArray(results[3].value))
          ? results[3].value.filter(function (s) { return s.game_name !== 'TestGame'; }).slice(0, 5)
          : [];
      } else {
        // Android/Capacitor — fetch from cloud
        var qRes = await fetch(
          CLOUD_URL + '/sync/student-quotients?student_id=' + encodeURIComponent(sid),
          { headers: { 'x-bhava-sync-key': CLOUD_KEY } }
        );
        if (qRes.ok) {
          var qData = await qRes.json();
          iq = qData.iq_total != null ? Math.round(qData.iq_total) : '—';
          eq = qData.eq_total != null ? Math.round(qData.eq_total) : '—';
          sq = qData.sq_total != null ? Math.round(qData.sq_total) : '—';
        }
        var sRes = await fetch(
          CLOUD_URL + '/sync/student-sessions?student_id=' + encodeURIComponent(sid) + '&limit=5',
          { headers: { 'x-bhava-sync-key': CLOUD_KEY } }
        );
        if (sRes.ok) {
          var sData = await sRes.json();
          sessions = Array.isArray(sData) ? sData : [];
        }
      }

      var sessHtml = sessions.length === 0
        ? '<div class="bgnav-info">No sessions yet. Start playing!</div>'
        : sessions.map(function (s) {
            var done  = s.completed === 1 || s.completed === true;
            var score = s.raw_score != null ? s.raw_score + ' pts' : '\u2014';
            var date  = s.started_at
              ? new Date(s.started_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
              : '';
            return '<div class="bgnav-si">'
              + '<span class="sg">' + (s.game_name || 'Game') + '</span>'
              + '<span class="ss">' + score + '</span>'
              + '<span>' + date + '<span class="bgnav-tag ' + (done ? 'done' : 'playing') + '">'
              + (done ? 'done' : 'live') + '</span></span>'
              + '</div>';
          }).join('');

      body.innerHTML =
        '<div class="bgnav-srow">' +
          '<div class="bgnav-sc iq"><div class="sl">IQ</div><div class="sv">' + iq + '</div></div>' +
          '<div class="bgnav-sc eq"><div class="sl">EQ</div><div class="sv">' + eq + '</div></div>' +
          '<div class="bgnav-sc sq"><div class="sl">SQ</div><div class="sv">' + sq + '</div></div>' +
        '</div>' +
        '<div class="bgnav-slbl">Recent Sessions</div>' +
        sessHtml;

    } catch (err) {
      body.innerHTML = '<div class="bgnav-info">Error: ' + err.message + '</div>';
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 6 — Public API
  // ─────────────────────────────────────────────────────────────────────────

  window.BhavaSession = {

    end: async function (rawScore) {
      if (!currentStudent || !currentSessionId) {
        console.log('[BhavaSession] Guest mode — score not saved:', rawScore);
        return;
      }
      try {
        if (window.bhava && window.bhava._isElectron !== false) {
          // Electron — save to local SQLite via IPC
          var result = await window.bhava.endSession(currentSessionId, rawScore);
          console.log('[BhavaSession] Score saved. Scaled:', result && result.scaled);
        } else {
          // Android/Capacitor/Website — post directly to cloud
          var now = new Date().toISOString();
          await fetch(CLOUD_URL + '/sync/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-bhava-sync-key': CLOUD_KEY
            },
            body: JSON.stringify({
              id:               currentSessionId,
              student_id:       currentStudent.id,
              school_id:        currentStudent.school_id || SCHOOL_ID,
              game_name:        GAME_NAME,
              raw_score:        rawScore,
              completed:        true,
              started_at:       now,
              ended_at:         now,
              duration_minutes: 0
            })
          });
          console.log('[BhavaSession] Score posted to cloud (Android).');
        }
        currentSessionId = null;
      } catch (e) {
        console.error('[BhavaSession] endSession failed:', e);
      }
    },

    getStudent:  function () { return currentStudent; },
    isLoggedIn:  function () { return currentStudent !== null; },
    showLogin:   showLoginModal,
    logout:      clearStudent,

    setStudent:  function (student) {
      persistStudent(student);
      _syncToNav();
    },

    openReport:     _openReportModal,
    openReportPage: _openReportPage,
    goHome:         _goHome,
    goBack:         _goBack,
  };

  // Also expose as BhavaNav for backward compat
  window.BhavaNav = {
    setStudent:     function (id) {
      window._bhavaStudentId = String(id);
      try { sessionStorage.setItem('bhavaStudentId', String(id)); } catch (e) {}
      var btn = document.getElementById('bgnav-report');
      if (btn) btn.classList.remove('bgnav-hidden');
    },
    openReport:     _openReportModal,
    openReportPage: _openReportPage,
    goHome:         _goHome,
    goBack:         _goBack,
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 7 — Auto-init
  // ─────────────────────────────────────────────────────────────────────────

  function init() {
    injectNavBar();

    var alreadyLoggedIn = restoreStudent();
    if (alreadyLoggedIn) {
      _syncToNav();
      startSession();
    } else {
      showLoginModal();
    }

    setTimeout(function () { if (currentStudent) _syncToNav(); }, 300);
    setTimeout(function () { if (currentStudent) _syncToNav(); }, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
