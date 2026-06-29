import os
import glob

dir = r"E:\hidden-maths"

# Fix all JS files
for path in glob.glob(os.path.join(dir, "mystery-*.js")):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Count literal \n before fix
    count = content.count('\\\\n')
    if count > 0:
        print(f"Fixing {os.path.basename(path)}: {count} literal \\\\n found")
        # Replace literal backslash-n followed by optional space with actual newline
        content = content.replace('\\n ', '\n')
        content = content.replace('\\n', '\n')
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  Fixed.")
    else:
        print(f"Skipping {os.path.basename(path)}: no corruption")

# Fix all HTML files (same issue)
for path in glob.glob(os.path.join(dir, "mystery-*.html")):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '\\n' in content:
        print(f"Fixing {os.path.basename(path)}: literal \\\\n found")
        content = content.replace('\\n', '\n')
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  Fixed.")

print("Done. Restart your server.")