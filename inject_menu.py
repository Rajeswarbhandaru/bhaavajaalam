# inject_menu.py
# Run this from: E:\bhaavajaalam-main\
# Command: python inject_menu.py

import os
import re

DOCS_DIR = "docs"  # your webDir

# ─── Menu CSS to inject inside <head> ────────────────────────────────────────
MENU_CSS = """
  <!-- Bhava Game Menu - Auto Injected -->
  <style>
    .bv-menu-btn {
      position: fixed; top: 14px; right: 16px; z-index: 9999;
      background: #3b5bdb; color: white; border: none;
      border-radius: 8px; padding: 8px 14px;
      font-size: 20px; cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .bv-overlay {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,0.45); z-index: 10000;
      justify-content: center; align-items: center;
    }
    .bv-overlay.active { display: flex; }
    .bv-box {
      background: white; border-radius: 14px;
      padding: 24px; width: 270px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.25);
      animation: bvFadeIn 0.2s ease;
    }
    @keyframes bvFadeIn {
      from { opacity: 0; transform: scale(0.9); }
      to   { opacity: 1; transform: scale(1); }
    }
    .bv-box h3 {
      text-align: center; margin: 0 0 16px;
      color: #333; font-size: 18px;
    }
    .bv-box a {
      display: block; padding: 13px 0;
      border-bottom: 1px solid #eee;
      color: #333; text-decoration: none; font-size: 16px;
      cursor: pointer;
    }
    .bv-box a:last-child { border-bottom: none; color: #e53; }
    .bv-box a:hover { color: #3b5bdb; }
  </style>
  <!-- End Bhava Game Menu CSS -->
"""

# ─── Menu HTML + JS to inject before </body> ─────────────────────────────────
MENU_HTML = """
  <!-- Bhava Game Menu - Auto Injected -->
  <button class="bv-menu-btn" onclick="bvOpenMenu()">☰</button>

  <div class="bv-overlay" id="bvOverlay" onclick="bvCloseMenu()">
    <div class="bv-box" onclick="event.stopPropagation()">
      <h3>☰ Menu</h3>
      <a href="/index.html">🏠 Home</a>
      <a href="/about.html">ℹ️ About</a>
      <a href="/feedback.html">📝 Feedback</a>
      <a onclick="history.back()">← Go Back</a>
      <a onclick="bvCloseMenu()">✕ Close</a>
    </div>
  </div>

  <script>
    function bvOpenMenu()  { document.getElementById('bvOverlay').classList.add('active'); }
    function bvCloseMenu() { document.getElementById('bvOverlay').classList.remove('active'); }

    // Back button fix for Capacitor Android
    document.addEventListener('DOMContentLoaded', function () {
      if (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.App) {
        Capacitor.Plugins.App.addListener('backButton', function (e) {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            Capacitor.Plugins.App.exitApp();
          }
        });
      }
    });
  </script>
  <!-- End Bhava Game Menu -->
"""

# ─── Main injection logic ─────────────────────────────────────────────────────
def inject_menu(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already injected
    if 'Bhava Game Menu - Auto Injected' in content:
        print(f"  ⏭  Already done: {filepath}")
        return

    # Inject CSS before </head>
    if '</head>' in content:
        content = content.replace('</head>', MENU_CSS + '\n</head>', 1)
    else:
        print(f"  ⚠️  No </head> found: {filepath}")

    # Inject HTML before </body>
    if '</body>' in content:
        content = content.replace('</body>', MENU_HTML + '\n</body>', 1)
    else:
        print(f"  ⚠️  No </body> found: {filepath}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"  ✅ Done: {filepath}")


# ─── Walk through docs/ and process all HTML files ───────────────────────────
print("\n🚀 Bhāva Tech — Auto Menu Injector")
print("=" * 45)

count = 0
skipped = []

for root, dirs, files in os.walk(DOCS_DIR):
    # Skip the devanagari-game built folder (React app, different structure)
    if 'devanagari-game' in root:
        continue

    for filename in files:
        if filename.endswith('.html'):
            # Skip feedback.html and about.html (they are destination pages)
            if filename in ['feedback.html', 'about.html']:
                skipped.append(filename)
                continue
            filepath = os.path.join(root, filename)
            inject_menu(filepath)
            count += 1

print("=" * 45)
print(f"\n✅ Processed : {count} HTML files")
print(f"⏭  Skipped   : {skipped}")
print("\n🎉 All done! Now rebuild your APK.\n")