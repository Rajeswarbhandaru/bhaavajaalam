#!/usr/bin/env python3
"""
Targeted BhavaSession.end() fix for:
  1. empathy-quest.html  — BhavaSession.end(finalScore) → BhavaSession.end(percent)
  2. grammar_pro.html    — BhavaSession.end(finalScore) → BhavaSession.end(percentage)

Run from: E:\bhaavajaalam-main\docs\
python fix_two_games.py
"""

from pathlib import Path
import sys

docs_dir = Path(__file__).parent

FIXES = [
    {
        "file": "empathy-quest.html",

        # The bad line — at top of showResults(), before percent is calculated
        "remove": (
            "try { if (window.BhavaSession && typeof BhavaSession.end === 'function') "
            "{ BhavaSession.end(finalScore); } } catch(e) { console.warn('BhavaSession.end:', e.message); } // Bhava auto-tracked"
        ),

        # Anchor — the line AFTER which we insert the correct call
        # This line comes right after percent is calculated in showResults()
        "after": "const percent = Math.round((score / maxScore) * 100);",

        # What to insert after the anchor line
        "insert": (
            "\n  // ✅ BhavaSession.end — correct percentage (0–100)\n"
            "  try { if (window.BhavaSession && typeof BhavaSession.end === 'function') "
            "{ BhavaSession.end(percent); } } "
            "catch(e) { console.warn('BhavaSession.end:', e.message); }"
        ),
    },
    {
        "file": "grammar_pro.html",

        # The bad line — at top of showResults(), before percentage is calculated
        "remove": (
            "try { if (window.BhavaSession && typeof BhavaSession.end === 'function') "
            "{ BhavaSession.end(finalScore); } } catch(e) { console.warn('BhavaSession.end:', e.message); } // Bhava auto-tracked"
        ),

        # Anchor — the line right after percentage is calculated in showResults()
        "after": "const percentage = Math.round(state.score / state.questions.length / 10 * 100);",

        # What to insert
        "insert": (
            "\n  // ✅ BhavaSession.end — correct percentage (0–100)\n"
            "  try { if (window.BhavaSession && typeof BhavaSession.end === 'function') "
            "{ BhavaSession.end(percentage); } } "
            "catch(e) { console.warn('BhavaSession.end:', e.message); }"
        ),
    },
]


def fix_file(fix):
    fp = docs_dir / fix["file"]
    if not fp.exists():
        print(f"  ✗ NOT FOUND: {fix['file']}")
        return False

    html = fp.read_text(encoding="utf-8", errors="replace")

    # ── Step 1: verify the bad line exists ──
    if fix["remove"] not in html:
        print(f"  ⚠ '{fix['file']}': bad line not found — already fixed or pattern mismatch")
        return False

    # ── Step 2: verify the anchor line exists ──
    if fix["after"] not in html:
        print(f"  ✗ '{fix['file']}': anchor line not found — check manually")
        print(f"     Looking for: {fix['after'][:80]}...")
        return False

    # ── Step 3: remove the bad BhavaSession.end call ──
    html = html.replace(fix["remove"], "", 1)

    # ── Step 4: insert correct call after anchor line ──
    html = html.replace(
        fix["after"],
        fix["after"] + fix["insert"],
        1  # replace only first occurrence (safe — anchor is inside showResults)
    )

    fp.write_text(html, encoding="utf-8")
    return True


print("=" * 60)
print("  BhavaSession.end() Fix — empathy-quest + grammar_pro")
print(f"  Folder: {docs_dir}")
print("=" * 60)

for fix in FIXES:
    ok = fix_file(fix)
    if ok:
        print(f"  ✔ FIXED  {fix['file']}")
        print(f"         Removed: BhavaSession.end(finalScore)  [undefined variable]")
        print(f"         Added:   BhavaSession.end({fix['insert'].split('BhavaSession.end(')[1].split(')')[0]})  [correct percentage]")
    print()

print("=" * 60)
print("  Done. Verify by opening each game and completing it.")
print("  Check DevTools console for: [BhavaSession] sending score: XX")
print("=" * 60)
