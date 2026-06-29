import os
import glob

dir = r"E:\hidden-maths"

for path in sorted(glob.glob(os.path.join(dir, "mystery-*.js"))):
    name = os.path.basename(path)
    lines = open(path, encoding='utf-8').readlines()
    
    print(f"\n{'='*50}")
    print(f"FILE: {name}  ({len(lines)} lines)")
    print(f"{'='*50}")
    
    for i, line in enumerate(lines, 1):
        s = line.strip()
        
        # Show next/prev button listeners
        if 'nextBtn.addEventListener' in s:
            print(f"  Line {i:3d} [NEXT BTN]: {s}")
        if 'prevBtn.addEventListener' in s:
            print(f"  Line {i:3d} [PREV BTN]: {s}")
        
        # Show quiz correct block
        if 'isCorrect' in s:
            print(f"  Line {i:3d} [QUIZ    ]: {s}")
        
        # Show slider listeners
        if "addEventListener('input'" in s or 'addEventListener("input"' in s:
            print(f"  Line {i:3d} [SLIDER  ]: {s}")
        
        # Show initCelebration
        if 'function initCelebration' in s:
            print(f"  Line {i:3d} [CELEBR  ]: {s}")
            # Show next 3 lines too
            for j in range(1, 4):
                if i-1+j < len(lines):
                    print(f"  Line {i+j:3d}           : {lines[i-1+j].rstrip()}")
        
        # Show updateProgress
        if 'updateProgress()' in s:
            print(f"  Line {i:3d} [PROGRESS]: {s}")