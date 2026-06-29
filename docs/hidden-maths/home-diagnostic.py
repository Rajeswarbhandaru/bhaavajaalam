# Save as home-diagnostic.py in E:\hidden-maths\
import os

DIR = r"E:\hidden-maths"

for filename in ['script.js', 'index.js']:
    path = os.path.join(DIR, filename)
    if not os.path.exists(path):
        print(f"{filename}: NOT FOUND")
        continue

    lines = open(path, encoding='utf-8').readlines()
    print(f"\n{'='*50}")
    print(f"FILE: {filename}  ({len(lines)} lines)")
    print(f"{'='*50}")

    for i, line in enumerate(lines, 1):
        s = line.strip()

        if 'addEventListener' in s:
            print(f"  Line {i:3d} [EVENT ]: {s}")
        if 'mystery-card' in s or 'mysteryCard' in s or 'card' in s.lower():
            print(f"  Line {i:3d} [CARD  ]: {s}")
        if 'Start Exploring' in s or 'startBtn' in s or 'exploreBtn' in s or 'heroBtn' in s:
            print(f"  Line {i:3d} [HEROBTN]: {s}")
        if 'function init' in s:
            print(f"  Line {i:3d} [INIT  ]: {s}")
        if 'audio' in s.lower():
            print(f"  Line {i:3d} [AUDIO ]: {s}")

    # Also show last 20 lines
    print(f"\n  --- Last 20 lines of {filename} ---")
    for i, line in enumerate(lines[-20:], len(lines)-19):
        print(f"  Line {i:3d}: {line.rstrip()}")