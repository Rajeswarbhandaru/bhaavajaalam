# fix_inject.py — removes injected menu from index.html only
import os

files_to_clean = [
    "docs/index.html",
]

for filepath in files_to_clean:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove injected CSS
    import re
    content = re.sub(
        r'\n\s*<!-- Bhava Game Menu - Auto Injected -->.*?<!-- End Bhava Game Menu CSS -->',
        '', content, flags=re.DOTALL
    )
    # Remove injected HTML
    content = re.sub(
        r'\n\s*<!-- Bhava Game Menu - Auto Injected -->.*?<!-- End Bhava Game Menu -->',
        '', content, flags=re.DOTALL
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✅ Cleaned: {filepath}")

print("Done!")