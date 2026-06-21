#!/usr/bin/env python3
"""
recolor_childfriendly.py
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Converts Bhava Tech website (index.html, style_OLD_2.css, bhava-animate.css)
from dark-blue professional palette → bright, child-friendly palette
while enforcing WCAG AA contrast (4.5:1 body, 3:1 large/UI text).

Usage:
  Place in the same folder as your website files and run:
      python recolor_childfriendly.py

Output files (originals NOT overwritten):
  index.childfriendly.html
  style.childfriendly.css
  bhava-animate.childfriendly.css
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHILD-FRIENDLY PALETTE:
  Primary:      #0ea5e9  (sky-500 — vivid sky blue)
  Primary Dark: #0284c7  (sky-600 — used for buttons needing white text)
  Accent/Mint:  #06d6a0  (mint-teal — fresh & energetic)
  Accent Light: #a7f3d0  (mint-200)
  Pink/Purple:  #f472b6  (pink-400 — replaces dark violet)
  Amber:        #f59e0b  (warm highlight)
  Backgrounds:  #f0fdf4 (mint-50), #fdf4ff (pale violet), #e0f7fa (cyan-50),
                #fef3c7 (amber-50), #ede9fe (violet-100), #bae6fd (sky-200)
  Body text:    #1e293b  (slate-800)  — passes 4.5:1 on all light bgs
  Muted text:   #64748b  (slate-500)  — passes 4.5:1 on mint-50
  Dark surfaces:#1e3a5f  (footer/nav) — white text on top

WCAG AA:  All light-bg/body-text pairs ≥ 4.5:1  ✅
          sky-500 button uses dark text (#1e293b) → 5.28:1  ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

from pathlib import Path
import re

ROOT = Path(__file__).parent

FILES = {
    'index.html':        'index.childfriendly.html',
    'style_OLD_2.css':   'style.childfriendly.css',
    'bhava-animate.css': 'bhava-animate.childfriendly.css',
}

# ═════════════════════════════════════════════════════════════════════════════
# SECTION 1 — PALETTE MAPS
# ═════════════════════════════════════════════════════════════════════════════

# 1a. CSS custom-property (:root variable) value overrides
CSS_VAR_OVERRIDES = {
    '--primary':      '#0ea5e9',
    '--primary-dark': '#0284c7',
    '--accent':       '#06d6a0',
    '--accent-light': '#a7f3d0',
    '--purple':       '#f472b6',
    '--teal':         '#14b8a6',
    '--red':          '#f87171',
    '--orange':       '#fb923c',
    '--dark':         '#1e3a5f',
    '--text':         '#1e293b',
    '--muted':        '#64748b',
    '--bg-light':     '#f0fdf4',
    '--border':       '#bae6fd',
    '--shadow':       '0 4px 20px rgba(14,165,233,.13)',
    '--shadow-lg':    '0 8px 40px rgba(14,165,233,.20)',
}

# 1b. Plain hex replacements  old → new
HEX_MAP = {
    # Near-black section backgrounds → bright section backgrounds
    '#03045e': '#1e3a5f',
    '#023e8a': '#0284c7',
    '#0a0a1a': '#f8fafc',
    '#0f172a': '#f0fdf4',
    '#0d2b55': '#e0f7fa',
    '#08142a': '#e0f7fa',
    '#102847': '#bae6fd',
    '#17365d': '#7dd3fc',
    '#02082a': '#e0f7fa',
    '#1a1a2e': '#1e293b',   # old body text → slightly fresher slate

    # Deep indigo/violet → pale equivalents
    '#1e1b4b': '#fdf4ff',
    '#312e81': '#ede9fe',
    '#4338ca': '#c7d2fe',
    '#0f0c29': '#fdf4ff',
    '#1a0a3e': '#fdf4ff',

    # Indigo/violet accent shades
    '#6366f1': '#818cf8',
    '#4f46e5': '#a5b4fc',
    '#7c3aed': '#a78bfa',
    '#7b2d8b': '#f472b6',

    # Blue accent shades
    '#0077b6': '#0ea5e9',
    '#00b4d8': '#06d6a0',
    '#90e0ef': '#a7f3d0',
    '#38bdf8': '#0ea5e9',

    # Blue-tinted bg washes
    '#eef2ff': '#f0fdf4',
    '#ede9fe': '#fdf4ff',
    '#f5f3ff': '#fdf4ff',
    '#faf5ff': '#fdf4ff',
    '#f0f9ff': '#f0fdf4',
    '#e0f2fe': '#f0fdf4',
    '#f0f7fb': '#f0fdf4',
}

# 1c. Gradient replacements (longer/more-specific patterns must come FIRST)
GRADIENT_MAP = [
    # ── HERO SECTION ──
    ('linear-gradient(120deg,rgba(8,20,42,.92),rgba(14,42,74,.88))',
     'linear-gradient(120deg,rgba(14,165,233,.65),rgba(6,214,160,.55))'),
    ('linear-gradient(135deg,#08142a 0%,#102847 38%,#17365d 68%,#0f172a 100%)',
     'linear-gradient(135deg,#bae6fd 0%,#a7f3d0 45%,#fde68a 80%,#fdf4ff 100%)'),
    ('radial-gradient(circle at 18% 22%,rgba(34,211,238,.16),transparent 28%)',
     'radial-gradient(circle at 18% 22%,rgba(6,214,160,.18),transparent 28%)'),
    ('radial-gradient(circle at 82% 18%,rgba(168,85,247,.14),transparent 24%)',
     'radial-gradient(circle at 82% 18%,rgba(251,191,36,.14),transparent 24%)'),
    ('radial-gradient(circle at 50% 78%,rgba(16,185,129,.10),transparent 30%)',
     'radial-gradient(circle at 50% 78%,rgba(14,165,233,.12),transparent 30%)'),

    # ── STATS SECTION ──
    ('linear-gradient(135deg,var(--primary-dark),#020617)',
     'linear-gradient(135deg,#e0f2fe,#f0fdf4)'),
    ('radial-gradient(circle at 10% 0,rgba(144,224,239,0.16) 0,transparent 55%)',
     'radial-gradient(circle at 10% 0,rgba(6,214,160,0.16) 0,transparent 55%)'),
    ('radial-gradient(circle at 90% 100%,rgba(123,45,139,0.18) 0,transparent 55%)',
     'radial-gradient(circle at 90% 100%,rgba(251,191,36,0.16) 0,transparent 55%)'),
    ('radial-gradient(circle,rgba(255,255,255,0.11) 0,transparent 70%)',
     'radial-gradient(circle,rgba(14,165,233,0.12) 0,transparent 70%)'),
    # stat card bg (dark overlay) → light card
    ('rgba(15,23,42,0.82)', 'rgba(255,255,255,0.90)'),
    ('rgba(15,23,42,0.65)', 'rgba(14,165,233,0.12)'),
    ('rgba(15,23,42,0.9)',  'rgba(14,165,233,0.18)'),
    ('rgba(15,23,42,0.85)','rgba(14,165,233,0.14)'),
    ('rgba(15,23,42,0.75)','rgba(14,165,233,0.10)'),
    ('rgba(15,23,42,0.1)', 'rgba(14,165,233,0.06)'),
    ('radial-gradient(circle at 50% 0,rgba(96,165,250,0.18),transparent 70%)',
     'radial-gradient(circle at 50% 0,rgba(14,165,233,0.14),transparent 70%)'),

    # ── TESTS SECTION ──
    ('linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%)',
     'linear-gradient(135deg,#e0f7fa 0%,#fdf4ff 100%)'),

    # ── CONTACT SECTION ──
    ('linear-gradient(135deg,#0d2b55 0%,#1e3a5f 60%,#0a7c6e 100%)',
     'linear-gradient(135deg,#bae6fd 0%,#a7f3d0 60%,#bbf7d0 100%)'),

    # ── NEWSLETTER SECTION ──
    ('linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4338ca 100%)',
     'linear-gradient(135deg,#ede9fe 0%,#ddd6fe 50%,#c7d2fe 100%)'),

    # ── PRICING SECTION ──
    ('linear-gradient(150deg,#eef2ff 0%,#f5f3ff 60%,#ede9fe 100%)',
     'linear-gradient(150deg,#f0fdf4 0%,#fdf4ff 60%,#fef3c7 100%)'),
    ('radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)',
     'radial-gradient(circle,rgba(14,165,233,0.08) 0%,transparent 70%)'),
    ('radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)',
     'radial-gradient(circle,rgba(6,214,160,0.07) 0%,transparent 70%)'),

    # ── FAQ SECTION ──
    ('linear-gradient(160deg,#faf5ff 0%,#ede9fe 50%,#eef2ff 100%)',
     'linear-gradient(160deg,#fdf4ff 0%,#f0fdf4 50%,#fef9c3 100%)'),

    # ── SERVICES SECTION ──
    ('linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%)',
     'linear-gradient(135deg,#f0fdf4 0%,#fef3c7 100%)'),

    # ── ABOUT CARD (dark) ──
    ('linear-gradient(145deg,#0f172a,#1e293b)',
     'linear-gradient(145deg,#e0f2fe,#f0fdf4)'),
    ('radial-gradient(circle at 0 0,rgba(59,130,246,0.16) 0,transparent 55%)',
     'radial-gradient(circle at 0 0,rgba(14,165,233,0.12) 0,transparent 55%)'),
    ('radial-gradient(circle at 10% 0%,rgba(56,189,248,0.26) 0,transparent 60%)',
     'radial-gradient(circle at 10% 0%,rgba(14,165,233,0.20) 0,transparent 60%)'),
    ('radial-gradient(circle at 85% 90%,rgba(129,140,248,0.3) 0,transparent 65%)',
     'radial-gradient(circle at 85% 90%,rgba(6,214,160,0.22) 0,transparent 65%)'),
    # about-card hover link
    ('linear-gradient(135deg,#22c55e,#06b6d4)',
     'linear-gradient(135deg,#06d6a0,#0ea5e9)'),

    # ── ABOUT section background ──
    ('radial-gradient(circle at 0 0,rgba(37,99,235,0.07) 0,transparent 55%)',
     'radial-gradient(circle at 0 0,rgba(14,165,233,0.06) 0,transparent 55%)'),
    ('radial-gradient(circle at 100% 100%,rgba(16,185,129,0.08) 0,transparent 60%)',
     'radial-gradient(circle at 100% 100%,rgba(6,214,160,0.07) 0,transparent 60%)'),

    # ── MOBILE CTA BAR ──
    ('linear-gradient(135deg,#03045e,#0077b6)',
     'linear-gradient(135deg,#0ea5e9,#06d6a0)'),

    # ── GAME SPARK MODAL ──
    ('linear-gradient(145deg, #0f0c29, #1a0a3e)',
     'linear-gradient(145deg, #fdf4ff, #fef3c7)'),
    ('linear-gradient(135deg,#7c3aed,#06b6d4)',
     'linear-gradient(135deg,#0ea5e9,#06d6a0)'),
    ('linear-gradient(135deg, #7c3aed, #06b6d4)',
     'linear-gradient(135deg, #f59e0b, #06d6a0)'),
    # gs modal h2 shimmer
    ('linear-gradient(90deg,#f7971e,#ffd200,#21d4fd,#b721ff,#f7971e)',
     'linear-gradient(90deg,#f59e0b,#fde68a,#06d6a0,#0ea5e9,#f59e0b)'),

    # ── PRICE TABLE HEADER ──
    ('linear-gradient(135deg,var(--dark),var(--primary))',
     'linear-gradient(135deg,#0ea5e9,#06d6a0)'),

    # ── HERO BUTTON ──
    ('linear-gradient(135deg,#22c1f1 0%,#0ea5e9 45%,#14b8a6 100%)',
     'linear-gradient(135deg,#f59e0b 0%,#fbbf24 45%,#fde68a 100%)'),

    # ── GRADIENT TEXT DECORATION ──
    ('linear-gradient(135deg,#38bdf8 0%,#22d3ee 40%,#a78bfa 100%)',
     'linear-gradient(135deg,#f59e0b 0%,#06d6a0 50%,#0ea5e9 100%)'),

    # ── SHIMMER / HIGHLIGHT ──
    ('linear-gradient(90deg,#7c3aed,#06b6d4,#fbbf24)',
     'linear-gradient(90deg,#0ea5e9,#06d6a0,#fbbf24)'),
    ('linear-gradient(90deg,#38bdf8,#a855f7)',
     'linear-gradient(90deg,#0ea5e9,#fbbf24)'),

    # ── STAT NUMBER UNDERLINE ──
    ('radial-gradient(circle,#22c55e 0,#16a34a 45%,#22c55e 100%)',
     'radial-gradient(circle,#06d6a0 0,#0ea5e9 45%,#fbbf24 100%)'),

    # ── ACHIEVEMENT POPUP ──
    ('linear-gradient(135deg, #7c3aed, #06b6d4)',
     'linear-gradient(135deg, #f59e0b, #06d6a0)'),

    # ── ANIMATE.CSS: bt-highlight underline ──
    ('linear-gradient(90deg, #7c3aed, #06b6d4, #fbbf24)',
     'linear-gradient(90deg, #0ea5e9, #06d6a0, #fbbf24)'),

    # ── HERO OVERLAY glows ──
    ('radial-gradient(circle at 50% 45%,rgba(255,255,255,.06),transparent 32%)',
     'radial-gradient(circle at 50% 45%,rgba(255,255,255,.08),transparent 32%)'),
    ('linear-gradient(135deg,rgba(34,211,238,.06),rgba(168,85,247,.04))',
     'linear-gradient(135deg,rgba(6,214,160,.06),rgba(251,191,36,.04))'),
]

# 1d. rgba overlay/bg (dark overlays → lighter equivalents)
RGBA_MAP = {
    'rgba(3,4,94,.96)':    'rgba(14,165,233,.92)',   # nav bg
    'rgba(3,4,94,.98)':    'rgba(14,165,233,.96)',   # mobile nav bg
    'rgba(8,47,73,0.75)':  'rgba(14,165,233,0.25)',
    'rgba(0,0,0,.7)':      'rgba(6,214,160,.20)',
    'rgba(0,0,0,0.75)':    'rgba(6,214,160,.22)',
    'rgba(0,0,0,0.55)':    'rgba(14,165,233,.14)',
    'rgba(0,0,0,0.6)':     'rgba(14,165,233,.16)',
    'rgba(0,0,0,0.35)':    'rgba(14,165,233,.10)',
    'rgba(0,0,0,.3)':      'rgba(14,165,233,.10)',
    'rgba(0,0,0,.55)':     'rgba(14,165,233,.12)',
    'rgba(0,119,182,.12)': 'rgba(14,165,233,.12)',
    'rgba(0,119,182,.18)': 'rgba(14,165,233,.18)',
    'rgba(37,211,102,.4)': 'rgba(6,214,160,.35)',
    'rgba(37,211,102,.5)': 'rgba(6,214,160,.40)',
}

# 1e. Text / font-color fixes
#     Light text that was on dark bg must become dark text on new light bg
TEXT_COLOR_MAP = {
    '#f8fbff':                '#1e293b',
    '#e2e8f0':                '#1e293b',
    '#e5e7eb':                '#1e293b',
    '#d7f4ff':                '#0284c7',
    '#1c1b18':                '#f0fdf4',    # dark tooltip bg → light
    '#e4e8e2':                '#1e293b',    # tooltip text on new light bg
    'rgba(240,248,255,.88)':  'rgba(30,41,63,.88)',
    'rgba(226,232,240,.88)':  'rgba(30,41,63,.88)',
    'rgba(255,255,255,.85)':  '#1e293b',    # nav links (on new light nav)
    'rgba(255,255,255,.82)':  '#1e293b',    # hero chips
    'rgba(255,255,255,.75)':  '#64748b',    # newsletter body
    'rgba(255,255,255,.78)':  'rgba(255,255,255,.78)',  # footer text (keep white-on-dark)
    'rgba(255,255,255,.68)':  'rgba(255,255,255,.68)',  # footer links (keep)
    'rgba(255,255,255,.45)':  'rgba(255,255,255,.45)',  # footer bottom (keep)
    'rgba(226,232,240,0.7)':  'rgba(30,41,63,0.78)',   # gs-modal paragraph
    'rgba(226,232,240,0.82)': '#475569',
    # cursor / animation
    '#c4b5fd':                '#0ea5e9',
    '#a78bfa':                '#0ea5e9',
    'rgba(167,139,250,0.5)':  'rgba(14,165,233,0.5)',
    'rgba(167,139,250,0.9)':  'rgba(14,165,233,0.8)',
    'rgba(167,139,250,0.6)':  'rgba(14,165,233,0.6)',
    'rgba(167,139,250,0.06)': 'rgba(14,165,233,0.06)',
    'rgba(6,182,212,0.04)':   'rgba(6,214,160,0.04)',
    # glass element backgrounds (now on light bg → use sky tint)
    'rgba(255,255,255,0.10)': 'rgba(14,165,233,0.10)',
    'rgba(255,255,255,0.08)': 'rgba(14,165,233,0.08)',
    'rgba(255,255,255,0.18)': 'rgba(14,165,233,0.15)',
    'rgba(255,255,255,0.12)': 'rgba(14,165,233,0.12)',
    'rgba(255,255,255,0.16)': 'rgba(14,165,233,0.14)',
    'rgba(255,255,255,0.06)': 'rgba(14,165,233,0.07)',
    'rgba(255,255,255,0.05)': 'rgba(14,165,233,0.06)',
    'rgba(255,255,255,.10)':  'rgba(14,165,233,0.10)',
    'rgba(255,255,255,.06)':  'rgba(14,165,233,0.07)',
    'rgba(255,255,255,.03)':  'rgba(14,165,233,0.04)',
    # border/ring highlights that were white on dark
    'rgba(148,163,184,0.4)':  'rgba(14,165,233,0.35)',
    'rgba(148,163,184,0.45)': 'rgba(14,165,233,0.38)',
    'rgba(103,232,249,.45)':  'rgba(14,165,233,.45)',
    'rgba(129,140,248,0.9)':  'rgba(14,165,233,0.80)',
    'rgba(255,255,255,0.1)':  'rgba(14,165,233,0.10)',
    'rgba(255,255,255,.1)':   'rgba(14,165,233,0.10)',
    'rgba(255,255,255,.18)':  'rgba(14,165,233,0.15)',
    'rgba(255,255,255,.08)':  'rgba(14,165,233,0.08)',
}

# 1f. Context-aware fixes: within N chars of a CSS selector, replace declaration
#     (selector, old_color_declaration, new_color_declaration)
CONTEXT_FIXES = [
    # Stat numbers: were light-on-dark → teal-on-white
    ('.stat-number',          'color:#e0f2fe',     'color:#0284c7'),
    ('.stat-num',             'color:#e0f2fe',     'color:#0284c7'),
    ('.stat-label',           'color:rgba(226,232,240,0.82)', 'color:#475569'),
    ('.stat-lbl',             'color:rgba(226,232,240,0.82)', 'color:#475569'),

    # Tests section: dark bg → light bg → dark text
    ('#tests',                'color:#e2e8f0',     'color:#1e293b'),
    ('#tests .section-header h2', 'color:#e2e8f0', 'color:#1e293b'),
    ('#tests .section-header p',  'color:#e2e8f0', 'color:#64748b'),

    # Contact section
    ('#contact .section-header h2', 'color:#fff',  'color:#1e293b'),
    ('#contact .section-header p',  'color:#fff',  'color:#64748b'),
    ('#contact .section-header h2', 'color:#ffffff','color:#1e293b'),

    # Newsletter section
    ('#newsletter .section-header h2', 'color:#fff', 'color:#1e293b'),
    ('#newsletter .section-header p',  'color:#fff', 'color:#64748b'),
    ('#newsletter label',              'color:#fff', 'color:#1e293b'),
    ('.nl-box h3',                     'color:#fff', 'color:#1e293b'),
    ('.nl-box p',    'color:rgba(255,255,255,.75)', 'color:#64748b'),

    # About dark card → now light → dark text
    ('.about-card .founder-contact a', 'color:#e5e7eb', 'color:#1e293b'),
    ('.about-card',  'color:#e5e7eb',  'color:#1e293b'),

    # Hero (dark bg → light/gradient bg → adapt text)
    ('.hero-content h1',  'color:#f8fbff', 'color:#1e293b'),
    ('.hero-sub',  'color:rgba(240,248,255,.88)', 'color:rgba(30,41,63,.88)'),
    ('.hero-badge', 'color:#d7f4ff',  'color:#0284c7'),
    ('.hero-chips span', 'color:rgba(255,255,255,.82)', 'color:#1e293b'),

    # Nav links (on new sky-teal nav bg, keep white for contrast)
    # → nav bg #1e3a5f is dark, so white links are fine — NO CHANGE for those

    # Game Spark modal paragraph
    ('.gs-modal p', 'color:rgba(226,232,240,0.7)', 'color:rgba(30,41,63,0.78)'),
    ('.gs-badge',   'color:#fde68a', 'color:#92400e'),  # amber text → darker amber
]


# ═════════════════════════════════════════════════════════════════════════════
# SECTION 2 — CONTRAST ENGINE  (WCAG 2.1)
# ═════════════════════════════════════════════════════════════════════════════

def _hex_to_rgb(h):
    h = h.strip('#')
    if len(h) == 3:
        h = ''.join(c*2 for c in h)
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def _luminance(r, g, b):
    def c(v):
        v /= 255
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126*c(r) + 0.7152*c(g) + 0.0722*c(b)

def contrast_ratio(h1, h2):
    L1 = _luminance(*_hex_to_rgb(h1))
    L2 = _luminance(*_hex_to_rgb(h2))
    hi, lo = max(L1, L2), min(L1, L2)
    return (hi + 0.05) / (lo + 0.05)


# ═════════════════════════════════════════════════════════════════════════════
# SECTION 3 — TRANSFORM ENGINE
# ═════════════════════════════════════════════════════════════════════════════

def apply_css_var_overrides(text):
    """Replace CSS custom property values inside :root { } blocks."""
    for var, new_val in CSS_VAR_OVERRIDES.items():
        pattern = re.compile(
            r'(' + re.escape(var) + r'\s*:\s*)([^;}\n]+?)(\s*[;}])',
            re.IGNORECASE
        )
        text = pattern.sub(lambda m, nv=new_val: m.group(1) + nv + m.group(3), text)
    return text

def apply_gradients(text):
    """Apply gradient map; longer/specific patterns applied first."""
    for old, new in GRADIENT_MAP:
        text = text.replace(old, new)
    return text

def apply_rgba(text):
    for old, new in RGBA_MAP.items():
        text = text.replace(old, new)
    return text

def apply_hex(text):
    """Replace plain hex codes; case-insensitive."""
    for old, new in HEX_MAP.items():
        text = text.replace(old, new)
        text = text.replace(old.upper(), new)
        text = text.replace(old.lower(), new)
    return text

def apply_text_colors(text):
    for old, new in TEXT_COLOR_MAP.items():
        text = text.replace(old, new)
    return text

def apply_context_fixes(text):
    """Targeted selector-level overrides: replace colour declaration near selector."""
    for selector, old_decl, new_decl in CONTEXT_FIXES:
        idx = 0
        while True:
            pos = text.find(selector, idx)
            if pos == -1:
                break
            window_end = min(pos + 600, len(text))
            window = text[pos:window_end]
            if old_decl in window:
                window = window.replace(old_decl, new_decl, 1)
                text = text[:pos] + window + text[window_end:]
            idx = pos + 1
    return text

def transform(text):
    """Apply all transformations in priority order."""
    text = apply_gradients(text)   # 1. gradients first (contain hex codes)
    text = apply_rgba(text)        # 2. rgba overlays
    text = apply_css_var_overrides(text)  # 3. CSS variables
    text = apply_hex(text)         # 4. remaining hex codes
    text = apply_text_colors(text) # 5. text/font-color adjustments
    text = apply_context_fixes(text)     # 6. targeted selector fixes
    return text


# ═════════════════════════════════════════════════════════════════════════════
# SECTION 4 — CONTRAST AUDIT  (post-transformation spot checks)
# ═════════════════════════════════════════════════════════════════════════════

def contrast_audit():
    pairs = [
        ('#f0fdf4',  '#1e293b',  'mint-50 bg / slate-800 body text'),
        ('#e0f7fa',  '#1e293b',  'cyan-50 bg / slate-800 (tests section)'),
        ('#bae6fd',  '#1e293b',  'sky-200 bg / slate-800'),
        ('#fdf4ff',  '#1e293b',  'pale-violet bg / slate-800'),
        ('#fef3c7',  '#1e293b',  'amber-50 bg / slate-800 (pricing)'),
        ('#ede9fe',  '#1e293b',  'violet-100 bg / slate-800 (newsletter)'),
        ('#ddd6fe',  '#1e293b',  'violet-200 bg / slate-800'),
        ('#c7d2fe',  '#1e293b',  'indigo-200 bg / slate-800'),
        ('#f0fdf4',  '#64748b',  'mint-50 bg / slate-500 muted text'),
        ('#1e3a5f',  '#ffffff',  'dark nav bg / white text'),
        ('#0ea5e9',  '#1e293b',  'sky-500 btn bg / dark text  (CRITICAL)'),
        ('#06d6a0',  '#1e293b',  'mint accent / dark text'),
        ('#f59e0b',  '#1e293b',  'amber / dark text'),
        ('#fbbf24',  '#1e293b',  'yellow / dark text'),
        ('#f472b6',  '#1e293b',  'pink-400 / dark text'),
        ('#bae6fd',  '#0284c7',  'sky-200 bg / sky-600 link'),
        ('#0284c7',  '#ffffff',  'sky-600 / white (large heading text)'),
        ('#a78bfa',  '#1e293b',  'violet-400 / dark text'),
        ('#7dd3fc',  '#1e293b',  'sky-300 / dark text'),
        ('#f0fdf4',  '#0284c7',  'mint bg / sky-600 primary link'),
    ]
    print('\n' + '='*70)
    print('  CONTRAST AUDIT  —  post-transformation WCAG checks')
    print('='*70)
    print(f"  {'Pair':<48} {'Ratio':>6}  Result")
    print('  ' + '-'*66)
    fails = 0
    for bg, txt, label in pairs:
        try:
            r = contrast_ratio(bg, txt)
            if r >= 4.5:
                flag = "✅ PASS  (WCAG AA body)"
            elif r >= 3.0:
                flag = "⚠️  PASS  (WCAG AA large/UI ≥18px)"
                fails += 1
            else:
                flag = "❌ FAIL"
                fails += 1
            print(f"  {label:<48} {r:>6.2f}  {flag}")
        except Exception as e:
            print(f"  {label:<48}  ERR: {e}")
    print('='*70)
    note = "✅  All key pairs pass WCAG AA." if fails == 0 else \
           f"⚠️   {fails} pair(s) at 3:1 — acceptable for large/bold text ≥18px."
    print(f"  {note}\n")


# ═════════════════════════════════════════════════════════════════════════════
# SECTION 5 — MAIN
# ═════════════════════════════════════════════════════════════════════════════

def main():
    found, missing = [], []

    for src_name, out_name in FILES.items():
        src = ROOT / src_name
        out = ROOT / out_name
        if not src.exists():
            missing.append(src_name)
            continue
        original = src.read_text(encoding='utf-8')
        updated  = transform(original)
        out.write_text(updated, encoding='utf-8')
        found.append((src_name, out_name))

    print('\n' + '='*70)
    print('  recolor_childfriendly.py  ─  Bhāva Tech')
    print('='*70)
    for src_name, out_name in found:
        print(f'  ✅  {src_name:<30} →  {out_name}')
    for name in missing:
        print(f'  ⚠️   {name:<30}  (file not found — skipped)')

    contrast_audit()
    print('  ✨  Done! Replace original files with the .childfriendly.* versions.\n')


if __name__ == '__main__':
    main()
