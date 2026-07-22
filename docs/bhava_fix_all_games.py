#!/usr/bin/env python3
"""
Bhava Game Layout Fixer v2
Run from: E:\bhaavajaalam-main\docs\
python bhava_fix_all_games.py
"""

import os
from pathlib import Path

GAME_FILES = [
    "Bhaava-Brain-Quest.html",
    "DayHero_Game.html",
    "DayHero_15_Auto.html",
    "empathy-quest.html",
    "focus_under_distraction_v2.html",
    "Good Habits.html",
    "GrammarGalaxy.html",
    "grammar_pro.html",
    "heart-heroes.html",
    "IQ_Test_Level_3.html",
    "logic-grid-puzzle.html",
    "logic.html",
    "MathBlitz_Game_v2.html",
    "memory-match-puzzle.html",
    "memory-zoo-puzzle.html",
    "memory_match_ultimate.html",
    "mental-rotation-game.html",
    "MindScape_Pro.html",
    "mindspark-iq-game.html",
    "neuro-ascend-iq.html",
    "neuroflash-memory-game.html",
    "number-garden-quest.html",
    "Percentile_Game.html",
    "planet-guardians.html",
    "telugu_script_game_v3.html",
    "visual-difference-detector.html",
    "Visual_Difference_Detector_v2.html",
    "brain-garden.html",
]

LAYOUT_FIX_CSS = """
        /* ===== Bhava Layout Fix v2 ===================================
           Prevents game buttons/options from being clipped at bottom.
           ============================================================ */
        body {
            align-items: flex-start !important;
            overflow-y: auto !important;
            padding: 16px !important;
        }
        #iq-app, #app, #game-app, #quiz-app, #game-container,
        #main-container, #container, #game-wrapper,
        [id$="-app"], [id$="-game"], [id$="-container"] {
            max-height: none !important;
            overflow: visible !important;
            overflow-y: visible !important;
        }
        .options, .choices, .answer-grid, .btn-grid,
        .option-container, #option-container {
            overflow: visible !important;
        }
        /* ============================================================ */
"""

SAFE_START = (
    "try { if (window.BhavaSession && typeof BhavaSession.start === 'function') "
    "{ BhavaSession.start("
)
SAFE_END = (
    "try { if (window.BhavaSession && typeof BhavaSession.end === 'function') "
    "{ BhavaSession.end("
)

def patch_bhavasession(html):
    """
    Replace bare BhavaSession.start(...) and BhavaSession.end(...)
    with safe try/catch wrappers — simple string split, no regex.
    """
    changed = False

    # Patch .start() calls
    while "BhavaSession.start(" in html:
        idx = html.find("BhavaSession.start(")
        # Check if already wrapped (look 60 chars before)
        before = html[max(0, idx-80):idx]
        if "typeof BhavaSession.start" in before or "try {" in before[-20:]:
            # Already wrapped — find next occurrence by skipping past this one
            end_idx = html.find(";", idx) + 1
            # To avoid infinite loop, temporarily replace with a marker
            html = html[:idx] + html[idx:end_idx].replace(
                "BhavaSession.start(", "__BS_START__(", 1
            ) + html[end_idx:]
            continue

        # Find the closing ); of this call
        paren_start = idx + len("BhavaSession.start(")
        depth = 1
        i = paren_start
        while i < len(html) and depth > 0:
            if html[i] == '(': depth += 1
            elif html[i] == ')': depth -= 1
            i += 1
        # i now points just after the closing )
        args = html[paren_start:i-1]
        semi = html[i:i+1]  # should be ;

        old = f"BhavaSession.start({args}){semi}"
        new = (
            f"try {{ if (window.BhavaSession && typeof BhavaSession.start === 'function') "
            f"{{ BhavaSession.start({args}); }} }} "
            f"catch(e) {{ console.warn('BhavaSession.start:', e.message); }}"
        )
        html = html[:idx] + new + html[idx + len(old):]
        changed = True

    # Patch .end() calls
    while "BhavaSession.end(" in html:
        idx = html.find("BhavaSession.end(")
        before = html[max(0, idx-80):idx]
        if "typeof BhavaSession.end" in before or "try {" in before[-20:]:
            end_idx = html.find(";", idx) + 1
            html = html[:idx] + html[idx:end_idx].replace(
                "BhavaSession.end(", "__BS_END__(", 1
            ) + html[end_idx:]
            continue

        paren_start = idx + len("BhavaSession.end(")
        depth = 1
        i = paren_start
        while i < len(html) and depth > 0:
            if html[i] == '(': depth += 1
            elif html[i] == ')': depth -= 1
            i += 1
        args = html[paren_start:i-1]
        semi = html[i:i+1]

        old = f"BhavaSession.end({args}){semi}"
        new = (
            f"try {{ if (window.BhavaSession && typeof BhavaSession.end === 'function') "
            f"{{ BhavaSession.end({args}); }} }} "
            f"catch(e) {{ console.warn('BhavaSession.end:', e.message); }}"
        )
        html = html[:idx] + new + html[idx + len(old):]
        changed = True

    # Restore markers
    html = html.replace("__BS_START__(", "BhavaSession.start(")
    html = html.replace("__BS_END__(", "BhavaSession.end(")

    return html, changed


def patch_file(filepath):
    result = {"file": filepath.name, "layout": False, "session": False, "error": None}
    try:
        html = filepath.read_text(encoding="utf-8", errors="replace")
        original = html

        # 1. Layout fix — inject CSS before first </style>
        if "</style>" in html and "Bhava Layout Fix" not in html:
            html = html.replace("</style>", LAYOUT_FIX_CSS + "        </style>", 1)
            result["layout"] = True

        # 2. BhavaSession safe wrappers
        if "BhavaSession" in html:
            html, changed = patch_bhavasession(html)
            result["session"] = changed

        # 3. Write only if changed
        if html != original:
            filepath.write_text(html, encoding="utf-8")

    except Exception as e:
        result["error"] = str(e)

    return result


if __name__ == "__main__":
    import sys
    docs_dir = Path(__file__).parent

    print("=" * 60)
    print("  Bhava Game Layout Fixer v2")
    print(f"  Folder: {docs_dir}")
    print(f"  Python: {sys.version}")
    print("=" * 60)

    ok, skipped, errors = 0, 0, 0

    for filename in GAME_FILES:
        fp = docs_dir / filename
        if not fp.exists():
            print(f"  SKIP  {filename}  (not found)")
            skipped += 1
            continue

        res = patch_file(fp)

        if res["error"]:
            print(f"  ERROR {filename}: {res['error']}")
            errors += 1
        else:
            tags = []
            if res["layout"]:  tags.append("layout fix applied")
            if res["session"]: tags.append("BhavaSession wrapped")
            if not tags:       tags.append("no changes needed")
            print(f"  OK    {filename}  [{', '.join(tags)}]")
            ok += 1

    print("=" * 60)
    print(f"  Done: {ok} patched, {skipped} skipped, {errors} errors")
    print("=" * 60)
