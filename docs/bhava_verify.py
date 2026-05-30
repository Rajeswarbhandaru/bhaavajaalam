#!/usr/bin/env python3
"""
Bhava Game Patch Verifier
Run from: E:\bhaavajaalam-main\docs\
python bhava_verify.py
"""

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

docs_dir = Path(__file__).parent

print("=" * 70)
print("  Bhava Game Patch Verifier — READ ONLY, no files modified")
print("=" * 70)
print(f"  {'Game File':<42} {'Layout':^8} {'Session':^10} {'Safe Call':^10}")
print("-" * 70)

layout_ok = 0
session_ok = 0
safe_ok = 0
not_found = 0
total = 0

results = []

for filename in GAME_FILES:
    fp = docs_dir / filename
    if not fp.exists():
        results.append((filename, "NOT FOUND", "-", "-"))
        not_found += 1
        continue

    html = fp.read_text(encoding="utf-8", errors="replace")
    total += 1

    has_layout  = "Bhava Layout Fix" in html
    has_session = "bhava-session.js" in html or "BhavaSession" in html
    has_safe    = "typeof BhavaSession" in html  # safe wrapper present

    # Layout: was the CSS patch applied?
    layout_str  = "PASS" if has_layout  else "MISSING"
    # Session: does the game even use BhavaSession at all?
    session_str = "YES"  if has_session else "NO"
    # Safe call: if it uses BhavaSession, is it safely wrapped?
    if has_session:
        safe_str = "PASS" if has_safe else "BARE"  # BARE = unsafe direct call
    else:
        safe_str = "N/A"

    if has_layout:  layout_ok  += 1
    if has_safe or not has_session: safe_ok += 1

    results.append((filename, layout_str, session_str, safe_str))

for (fname, layout, session, safe) in results:
    l_icon = "✔" if layout  == "PASS"    else ("?" if layout == "-" else "✗")
    s_icon = "✔" if safe    in ("PASS","N/A") else "✗"
    print(f"  {fname:<42} {l_icon} {layout:<8} {session:<10} {s_icon} {safe}")

print("=" * 70)
print(f"  Total games : {total}")
print(f"  Layout fix  : {layout_ok}/{total} {'✔ ALL GOOD' if layout_ok==total else '✗ SOME MISSING'}")
print(f"  Safe session: {safe_ok}/{total}  {'✔ ALL GOOD' if safe_ok==total else '✗ SOME BARE CALLS'}")
if not_found:
    print(f"  Not found   : {not_found} files")
print("=" * 70)

if layout_ok == total and safe_ok == total:
    print("\n  ✅ All checks passed — ready to proceed!\n")
else:
    print("\n  ⚠  Some fixes missing — re-run bhava_fix_all_games.py\n")
