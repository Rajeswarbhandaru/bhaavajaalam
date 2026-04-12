tracker_js = r"""// ═══════════════════════════════════════════════════════
// session-tracker.js — Bhāva Tech
// Tracks cumulative time on site (excluding take-test.html)
// After 15 minutes → shows subscription popup
// Unlock with a code you send via WhatsApp
// ═══════════════════════════════════════════════════════

(function () {

  // ── CONFIG ──────────────────────────────────────────
  const FREE_MINUTES    = 15;           // free time in minutes
  const FREE_SECONDS    = FREE_MINUTES * 60;
  const STORAGE_KEY     = "bv_time";    // cumulative seconds spent
  const UNLOCK_KEY      = "bv_unlocked";// set to "1" when paid
  const EMAIL_KEY       = "bv_email";   // saved from take-test registration
  const TICK_INTERVAL   = 10;           // save every 10 seconds
  const EXEMPT_PAGES    = ["take-test.html"]; // never track these pages
  const VALID_CODES     = [             // codes you share via WhatsApp after payment
    "BVMONTH1",  "BVMONTH2",  "BVMONTH3",  "BVMONTH4",  "BVMONTH5",
    "BVQTR01",   "BVQTR02",   "BVQTR03",   "BVQTR04",   "BVQTR05",
    "BVYEAR1",   "BVYEAR2",   "BVYEAR3",   "BVYEAR4",   "BVYEAR5"
  ];
  // ────────────────────────────────────────────────────

  // Don't run on exempt pages
  const page = window.location.pathname.split("/").pop();
  if (EXEMPT_PAGES.some(p => page.includes(p))) return;

  // Already unlocked? Do nothing
  if (localStorage.getItem(UNLOCK_KEY) === "1") return;

  // ── TIME TRACKING ────────────────────────────────────
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

  // ── POPUP HTML ───────────────────────────────────────
  function showPopup() {
    // Get saved email if any
    const savedEmail = localStorage.getItem(EMAIL_KEY) || "";

    const el = document.createElement("div");
    el.id = "bv-popup";
    el.innerHTML = `
      <style>
        #bv-popup {
          position:fixed;inset:0;z-index:999999;
          background:rgba(5,13,26,.94);backdrop-filter:blur(12px);
          overflow-y:auto;font-family:'Plus Jakarta Sans',sans-serif;
        }
        .bv-box {
          max-width:520px;margin:36px auto;padding:16px;
        }
        .bv-card {
          background:linear-gradient(135deg,#0d1f35,#112240);
          border:1.5px solid #1e3a5f;border-radius:18px;
          padding:28px 22px;position:relative;overflow:hidden;
        }
        .bv-card::before {
          content:'';position:absolute;top:0;left:0;right:0;height:3px;
          background:linear-gradient(90deg,#00d4ff,#7c3aed);
        }
        .bv-title {
          font-size:1.3rem;font-weight:900;color:#e2f0ff;margin-bottom:6px;
          font-family:'Orbitron','Plus Jakarta Sans',sans-serif;
        }
        .bv-sub { font-size:.86rem;color:#7a9cc8;line-height:1.6;margin-bottom:20px; }
        .bv-plans { display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:18px; }
        .bv-plan {
          background:rgba(255,255,255,.04);border:1.5px solid #1e3a5f;
          border-radius:12px;padding:14px 8px;text-align:center;
        }
        .bv-plan.popular {
          background:rgba(99,102,241,.12);border-color:#6366f1;
          position:relative;
        }
        .bv-plan.best {
          background:rgba(245,158,11,.07);
          border-color:rgba(245,158,11,.4);position:relative;
        }
        .bv-pill {
          position:absolute;top:-10px;left:50%;transform:translateX(-50%);
          font-size:.58rem;font-weight:800;padding:2px 10px;border-radius:20px;
          white-space:nowrap;color:#fff;
        }
        .bv-plan-icon { font-size:1.4rem;margin-bottom:4px; }
        .bv-plan-name { font-size:.72rem;font-weight:700;color:#e2f0ff;margin-bottom:4px; }
        .bv-plan-price {
          font-family:'Orbitron','Plus Jakarta Sans',sans-serif;
          font-size:1.25rem;font-weight:900;margin:6px 0 2px;
        }
        .bv-plan-period { font-size:.6rem;color:#7a9cc8;margin-bottom:4px; }
        .bv-plan-save { font-size:.6rem;color:#34d399;font-weight:700;margin-bottom:8px; }
        .bv-wa-btn {
          display:block;padding:7px 4px;border-radius:8px;
          font-size:.68rem;font-weight:700;text-decoration:none;margin-top:4px;
        }
        .bv-divider {
          border:none;border-top:1px solid #1e3a5f;margin:16px 0;
        }
        .bv-code-label { font-size:.8rem;color:#7a9cc8;margin-bottom:8px; }
        .bv-code-row { display:flex;gap:8px; }
        .bv-code-input {
          flex:1;padding:10px 12px;border-radius:9px;
          background:rgba(255,255,255,.05);border:1.5px solid #1e3a5f;
          color:#e2f0ff;font-family:inherit;font-size:.88rem;
          text-transform:uppercase;letter-spacing:.08em;
        }
        .bv-code-input:focus { outline:none;border-color:#00d4ff; }
        .bv-unlock-btn {
          padding:10px 18px;border-radius:9px;
          background:linear-gradient(135deg,#00d4ff,#0099cc);
          color:#050d1a;font-family:inherit;font-size:.85rem;font-weight:800;
          border:none;cursor:pointer;white-space:nowrap;
        }
        .bv-code-err { font-size:.75rem;color:#ff6b9d;margin-top:6px;display:none; }
        .bv-note {
          text-align:center;font-size:.72rem;color:#7a9cc8;margin-top:14px;line-height:1.6;
        }
        @media(max-width:400px){.bv-plans{grid-template-columns:1fr;}}
      </style>

      <div class="bv-box">
        <div class="bv-card">
          <div style="text-align:center;margin-bottom:18px;">
            <div style="font-size:2.8rem;margin-bottom:8px;">⏰</div>
            <div class="bv-title">15 Minutes of Free Access Used!</div>
            <p class="bv-sub">
              You've been exploring Bhāva Tech for 15 minutes —
              subscribe to keep using Brain Games, Progress Tracking &amp; more.
              ${savedEmail ? `<br><span style="color:#00d4ff;font-size:.8rem;">👤 Detected: ${savedEmail}</span>` : ""}
            </p>
          </div>

          <!-- PLANS -->
          <div class="bv-plans">

            <div class="bv-plan">
              <div class="bv-plan-icon">📅</div>
              <div class="bv-plan-name">Monthly</div>
              <div class="bv-plan-price" style="color:#00d4ff;">₹300</div>
              <div class="bv-plan-period">/month</div>
              <div class="bv-plan-save">&nbsp;</div>
              <a class="bv-wa-btn"
                style="background:rgba(0,212,255,.15);border:1px solid rgba(0,212,255,.3);color:#00d4ff;"
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
              <a class="bv-wa-btn"
                style="background:rgba(124,58,237,.25);border:1px solid rgba(124,58,237,.5);color:#a78bfa;"
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
              <a class="bv-wa-btn"
                style="background:rgba(245,158,11,.2);border:1px solid rgba(245,158,11,.4);color:#fbbf24;"
                href="https://wa.me/919573057516?text=Hi%2C%20I%20want%20Annual%20plan%20%E2%82%B91200.%20Email%3A%20${encodeURIComponent(savedEmail)}"
                target="_blank">WhatsApp →</a>
            </div>

          </div>

          <p style="text-align:center;font-size:.75rem;color:#7a9cc8;margin-bottom:14px;">
            📲 Pay on WhatsApp → we send you an <strong style="color:#00d4ff;">unlock code</strong> instantly
          </p>

          <!-- CODE ENTRY -->
          <hr class="bv-divider">
          <div class="bv-code-label">Already paid? Enter your unlock code:</div>
          <div class="bv-code-row">
            <input class="bv-code-input" id="bv-code-input" type="text" placeholder="e.g. BVQTR01" maxlength="10">
            <button class="bv-unlock-btn" onclick="bvUnlock()">Unlock ✅</button>
          </div>
          <div class="bv-code-err" id="bv-code-err">❌ Invalid code. Please check and try again.</div>

          <p class="bv-note">
            🔒 Your data stays on this device &nbsp;|&nbsp;
            💬 Support: <a href="https://wa.me/919573057516" target="_blank" style="color:#25d366;">WhatsApp Us</a>
          </p>
        </div>
      </div>
    `;

    document.body.appendChild(el);
    document.body.style.overflow = "hidden";
  }

  // ── UNLOCK WITH CODE ─────────────────────────────────
  window.bvUnlock = function () {
    const input = document.getElementById("bv-code-input");
    const err   = document.getElementById("bv-code-err");
    const code  = (input.value || "").trim().toUpperCase();

    if (VALID_CODES.includes(code)) {
      localStorage.setItem(UNLOCK_KEY, "1");
      localStorage.setItem(STORAGE_KEY, "0"); // reset timer
      document.getElementById("bv-popup").remove();
      document.body.style.overflow = "";

      // Show success toast
      const toast = document.createElement("div");
      toast.style.cssText = "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#00e676;color:#050d1a;padding:12px 24px;border-radius:10px;font-weight:800;font-size:.92rem;z-index:999999;box-shadow:0 4px 20px rgba(0,230,118,.4);";
      toast.textContent = "✅ Unlocked! Welcome to Bhāva Tech!";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 4000);
    } else {
      err.style.display = "block";
      input.style.borderColor = "#ff6b9d";
      setTimeout(() => {
        err.style.display = "none";
        input.style.borderColor = "#1e3a5f";
      }, 3000);
    }
  };

  // Allow Enter key on code input
  document.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && document.getElementById("bv-code-input") === document.activeElement) {
      window.bvUnlock();
    }
  });

  // ── SAVE EMAIL FROM TAKE-TEST REGISTRATION ────────────
  // Call this from take-test.html after user registers
  window.bvSaveEmail = function(email) {
    if (email) localStorage.setItem(EMAIL_KEY, email);
  };

})();
"""

with open('/root/output/session-tracker.js','w',encoding='utf-8') as f:
    f.write(tracker_js)
sz = len(tracker_js)
print(f"✅ session-tracker.js — {sz:,} bytes ({sz//1024} KB)")
print()
print("── VALID CODES INCLUDED ──")
codes = ["BVMONTH1-5", "BVQTR01-05", "BVYEAR1-5"]
for c in codes: print(f"  {c}")
print()
print("── HOW TO ADD TO EACH PAGE ──")
print('Add this ONE line before </body> in every HTML page:')
print('<script src="session-tracker.js"></script>')
print()
print("── PAGES TO ADD IT TO ──")
pages = ["index.html","student-form.html","Bhaava-Brain-Quest.html",
         "DayHeroGame.html","MathBlitzGame.html","EmpathyQuestv2.html",
         "IQTestLevel3.html","memory-match-puzzle2.html"]
for p in pages: print(f"  {p}")
