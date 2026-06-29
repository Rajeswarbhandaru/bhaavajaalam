import os
import glob

DIR = r"E:\hidden-maths"

# ── Exact strings to find (from diagnostic) ──────────────────
NEXT_OLD   = "  nextBtn.addEventListener('click', nextStep);"
NEXT_NEW   = """  nextBtn.addEventListener('click', function() {
    var lbl = nextBtn.textContent.trim().toLowerCase();
    if (lbl === 'begin') { AudioEngine.begin(); }
    else if (lbl === 'finish') { AudioEngine.celebrate(); }
    else { AudioEngine.next(); }
    nextStep();
  });
  nextBtn.addEventListener('mouseenter', AudioEngine.hover);"""

PREV_OLD   = "  prevBtn.addEventListener('click', prevStep);"
PREV_NEW   = """  prevBtn.addEventListener('click', function() {
    AudioEngine.back();
    prevStep();
  });
  prevBtn.addEventListener('mouseenter', AudioEngine.hover);"""

QUIZ_OLD   = "          if (!isCorrect) {"
QUIZ_NEW   = """          if (!isCorrect) {
            AudioEngine.incorrect();"""

QUIZ2_OLD  = "          feedback.className = 'quiz-feedback ' + (isCorrect ? 'correct' : 'incorrect');"
QUIZ2_NEW  = """          AudioEngine.correct();
          feedback.className = 'quiz-feedback ' + (isCorrect ? 'correct' : 'incorrect');"""

GAUGE_OLD  = "  gaugeSlider.addEventListener('input', updateGauge);"
GAUGE_NEW  = """  gaugeSlider.addEventListener('input', function() {
    AudioEngine.tick();
    updateGauge();
  });"""

CELEBR_OLD = "  function initCelebration() {"
CELEBR_NEW = """  function initCelebration() {
    AudioEngine.celebrate();"""

PROGRESS_OLD = "    updateProgress();\n  }"   # last occurrence only
PROGRESS_NEW = "    updateProgress();\n    AudioEngine.ready();\n  }"

# ── Patch JS files ────────────────────────────────────────────
print("=== Patching JS files ===\n")

for path in sorted(glob.glob(os.path.join(DIR, "mystery-*.js"))):
    name = os.path.basename(path)

    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already patched
    if 'AudioEngine.' in content:
        print(f"  SKIPPED (already patched): {name}")
        continue

    original = content
    changes = []

    # 1. Next button
    if NEXT_OLD in content:
        content = content.replace(NEXT_OLD, NEXT_NEW)
        changes.append("next button")

    # 2. Prev button
    if PREV_OLD in content:
        content = content.replace(PREV_OLD, PREV_NEW)
        changes.append("prev button")

    # 3. Quiz incorrect (add AudioEngine.incorrect() inside if block)
    if QUIZ_OLD in content:
        content = content.replace(QUIZ_OLD, QUIZ2_NEW + "\n" + QUIZ_OLD)
        changes.append("quiz correct sound")

    # 4. Quiz incorrect sound (after the existing if block)
    if QUIZ_OLD in content:
        content = content.replace(QUIZ_OLD, QUIZ_OLD.replace(
            "if (!isCorrect) {",
            "if (!isCorrect) {\n            AudioEngine.incorrect();"
        ))
        changes.append("quiz incorrect sound")

    # 5. Gauge slider tick
    if GAUGE_OLD in content:
        content = content.replace(GAUGE_OLD, GAUGE_NEW)
        changes.append("gauge slider tick")

    # 6. Celebration sound
    if CELEBR_OLD in content:
        content = content.replace(CELEBR_OLD, CELEBR_NEW)
        changes.append("celebration sound")

    # 7. AudioEngine.ready() at end of init — only replace LAST occurrence
    last_idx = content.rfind(PROGRESS_OLD)
    if last_idx != -1:
        content = content[:last_idx] + PROGRESS_NEW + content[last_idx + len(PROGRESS_OLD):]
        changes.append("AudioEngine.ready() in init")

    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  PATCHED: {name}")
        for c in changes:
            print(f"    + {c}")
        print()
    else:
        print(f"  NO CHANGES: {name}\n")

# ── Patch HTML files ──────────────────────────────────────────
print("=== Patching HTML files ===\n")

for path in sorted(glob.glob(os.path.join(DIR, "mystery-*.html"))):
    name = os.path.basename(path)
    num  = name.replace("mystery-", "").replace(".html", "")

    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'audio.js' in content:
        print(f"  SKIPPED (already patched): {name}")
        continue

    old = f'    <script src="mystery-{num}.js"></script>'
    new = f'    <script src="audio.js"></script>\n    <script src="mystery-{num}.js"></script>'

    if old in content:
        content = content.replace(old, new)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  PATCHED: {name}")
    else:
        print(f"  WARNING: script tag not found in {name}")

print("\n=== All done! ===")
print("Now run:  python -m http.server 3000")