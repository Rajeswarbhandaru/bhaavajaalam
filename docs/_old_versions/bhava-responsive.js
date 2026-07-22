// ─────────────────────────────────────────────────────────────────────────────
// bhava-responsive.js — Global Mobile/Tablet Toolkit for Bhāva Tech Games
// Include ONCE per game, before </body>, AFTER bhava-game-nav.js:
//   <script src="bhava-responsive.js"></script>
//
// HOW THE TOOL "KNOWS" WHAT TO DO — you tell it, per game, with ONE line:
//
//   <html data-bhava-mobile="nudge">     ← soft dismissible banner (default)
//   <html data-bhava-mobile="block">     ← hard rotate-block for unplayable UIs
//   <html data-bhava-mobile="off">       ← no rotate messaging at all
//
// If you don't add data-bhava-mobile at all, it defaults to "nudge" — the
// safest option (never hides your game, just suggests a bigger screen).
//
// You decide "block" only for the handful of games where portrait truly
// cannot work (e.g. the 20-slot motherboard build grid) — everything else
// should stay on "nudge" or "off".
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  const mode = document.documentElement.getAttribute('data-bhava-mobile') || 'nudge';
  const MOBILE_BREAKPOINT = 900; // matches the CSS @media rule

  function isSmallScreen() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }
  function isPortrait() {
    return window.innerHeight > window.innerWidth;
  }

  // ── Soft banner (mode: "nudge") ─────────────────────────────────────────
  function ensureBanner() {
    let banner = document.getElementById('bhava-rotate-banner');
    if (banner) return banner;
    banner = document.createElement('div');
    banner.id = 'bhava-rotate-banner';
    banner.innerHTML =
      '<span class="bhava-rb-icon">📱↻</span>' +
      '<span class="bhava-rb-text">This game feels better on a bigger screen or in landscape. You can still play here!</span>' +
      '<button class="bhava-rb-close" aria-label="Dismiss">✕</button>';
    document.body.insertBefore(banner, document.body.firstChild.nextSibling || null);
    banner.querySelector('.bhava-rb-close').addEventListener('click', function () {
      banner.classList.remove('bhava-show');
      try { sessionStorage.setItem('bhava_rotate_dismissed', '1'); } catch (e) {}
    });
    return banner;
  }

  function updateBanner() {
    const banner = ensureBanner();
    let dismissed = false;
    try { dismissed = sessionStorage.getItem('bhava_rotate_dismissed') === '1'; } catch (e) {}
    const shouldShow = isSmallScreen() && isPortrait() && !dismissed;
    banner.classList.toggle('bhava-show', shouldShow);
  }

  // ── Hard block (mode: "block") ──────────────────────────────────────────
  function ensureBlock() {
    let block = document.getElementById('bhava-rotate-block');
    if (block) return block;
    block = document.createElement('div');
    block.id = 'bhava-rotate-block';
    block.innerHTML =
      '<div class="bhava-rotate-icon">📱</div>' +
      '<h3>Please rotate your device</h3>' +
      '<p>This activity needs a wider screen to show everything clearly. ' +
      'Turn your phone or tablet sideways, or open this on a laptop for the best experience.</p>';
    document.body.appendChild(block);
    return block;
  }

  function updateBlock() {
    const block = ensureBlock();
    const shouldBlock = isSmallScreen() && isPortrait();
    block.classList.toggle('bhava-show', shouldBlock);
  }

  // ── Horizontal-scroll edge-fade helper (works with .bhava-hscroll-wrap) ─
  function initScrollFades() {
    document.querySelectorAll('.bhava-hscroll-wrap').forEach(function (wrap) {
      const scroller = wrap.querySelector('.bhava-hscroll, .bhava-hscroll-auto');
      if (!scroller) return;
      function check() {
        const atEnd = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 4;
        wrap.classList.toggle('bhava-scrolled-end', atEnd);
      }
      scroller.addEventListener('scroll', check, { passive: true });
      check();
    });
  }

  // ── Wire it up ───────────────────────────────────────────────────────────
  function update() {
    if (mode === 'nudge') { updateBanner(); }
    else if (mode === 'block') { updateBlock(); }
    // mode === 'off' → do nothing
  }

  window.addEventListener('resize', update);
  window.addEventListener('orientationchange', function () {
    setTimeout(update, 150); // slight delay lets innerWidth/Height settle
  });
  document.addEventListener('DOMContentLoaded', function () {
    update();
    initScrollFades();
  });
  // In case the script loads after DOMContentLoaded already fired
  if (document.readyState !== 'loading') {
    update();
    initScrollFades();
  }

  // ── Public API — for games that want manual control ────────────────────
  window.BhavaResponsive = {
    refresh: update,
    isSmallScreen: isSmallScreen,
    isPortrait: isPortrait,
  };

})();
