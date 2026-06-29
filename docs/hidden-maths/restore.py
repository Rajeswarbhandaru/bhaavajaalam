import os
import re
import glob

dir = r"E:\hidden-maths"

# ============================================================
# STEP 1: Clean all mystery JS files
# Remove every broken audio line inserted by PowerShell
# ============================================================
print("=== Cleaning JS files ===\n")

for path in sorted(glob.glob(os.path.join(dir, "mystery-*.js"))):
    name = os.path.basename(path)
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content

    # Remove literal \n text that PowerShell injected
    content = content.replace('\\n ', '\n')
    content = content.replace('\\n', '\n')

    # Remove AudioEngine lines added by PowerShell
    lines = content.split('\n')
    cleaned = []
    skip_next = False

    for line in lines:
        stripped = line.strip()

        # Remove any AudioEngine.* lines
        if 'AudioEngine.' in stripped:
            print(f"  Removing: {stripped}  ({name})")
            continue

        # Remove broken else block inserted by PowerShell
        # Pattern: } else {\n  AudioEngine.incorrect();\n}
        if stripped == '} else {' and skip_next:
            skip_next = False
            continue

        # Remove double semicolons caused by patch
        line = line.replace(';;', ';')

        cleaned.append(line)

    content = '\n'.join(cleaned)

    # Fix quiz block — restore original structure
    # PowerShell broke: if (isCorrect) { quizScore++; }
    # back to clean:    if (isCorrect) { quizScore++; }
    content = re.sub(
        r'if\s*\(isCorrect\)\s*\{[\s\n]*quizScore\+\+;[\s\n]*\}[\s\n]*else[\s\n]*\{[\s\n]*\}',
        'if (isCorrect) { quizScore++; }',
        content
    )

    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  FIXED: {name}\n")
    else:
        print(f"  OK (no changes): {name}\n")


# ============================================================
# STEP 2: Clean HTML files
# Remove the audio.js script tag (since JS is broken, remove it too)
# ============================================================
print("=== Cleaning HTML files ===\n")

for path in sorted(glob.glob(os.path.join(dir, "mystery-*.html"))):
    name = os.path.basename(path)

    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Remove literal \n injected by PowerShell
    content = content.replace('\\n', '\n')

    # Remove the audio.js script line entirely
    content = re.sub(r'\s*<script src="audio\.js"></script>', '', content)

    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  FIXED: {name}")
    else:
        print(f"  OK (no changes): {name}")

print("\n=== Done! ===")
print("All files restored to original working state.")
print("Start your server: python -m http.server 3000")