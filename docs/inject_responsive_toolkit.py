#!/usr/bin/env python3
"""
inject_responsive_toolkit.py — Bulk-inject the Bhāva responsive toolkit
(bhava-responsive.css + bhava-responsive.js) into every game's HTML file.

WHAT IT DOES, per game file it finds:
  1. Copies bhava-responsive.css and bhava-responsive.js next to that HTML
     file (same folder — matches how you already keep bhava-bridge.js etc.),
     unless they're already there.
  2. Adds  <html data-bhava-mobile="nudge">  (only if data-bhava-mobile is
     not already present — never overwrites a value you set by hand).
  3. Adds  <link rel="stylesheet" href="bhava-responsive.css">  right before
     </head> (only if not already linked).
  4. Adds  <script src="bhava-responsive.js"></script>  right before
     </body> (only if not already included).

SAFE BY DESIGN:
  - Dry-run by default. Nothing is written until you pass --apply.
  - Every HTML file that WILL be changed gets a .bak copy next to it the
    first time it's touched (never overwritten on later re-runs).
  - Idempotent: running it again on already-injected files changes nothing
    and reports them as "already done" — safe to re-run any time.
  - Only touches HTML files that look like actual games (skips README.md,
    .bak files, non-html files, and anything already fully injected).
  - Never touches files outside the docs/ folder you point it at.

USAGE:
  1. Copy this script into your repo, next to the "docs" folder
     (i.e. same level as docs/, CNAME, .git) — e.g.
     E:\\bhaavajaalam-main\\inject_responsive_toolkit.py

  2. Make sure bhava-responsive.css and bhava-responsive.js (the two files
     already shared with you) sit directly inside E:\\bhaavajaalam-main\\docs\\
     — the script copies FROM there INTO each game folder/location.

  3. Preview first (recommended) — shows exactly what would change, writes
     nothing:
       python inject_responsive_toolkit.py

  4. Apply for real:
       python inject_responsive_toolkit.py --apply

  5. Re-run any time later (e.g. after adding new games) — already-done
     games are skipped automatically, only new ones get touched:
       python inject_responsive_toolkit.py --apply

OPTIONAL FLAGS:
  --docs PATH        Path to your docs folder (default: ./docs next to this script)
  --mode nudge|block|off   Default data-bhava-mobile value to inject (default: nudge)
  --apply             Actually write changes (omit this for a safe dry-run)
"""

import argparse
import re
import shutil
import sys
from pathlib import Path

TOOLKIT_FILES = ["bhava-responsive.css", "bhava-responsive.js"]

HEAD_LINK_TAG = '<link rel="stylesheet" href="bhava-responsive.css">'
BODY_SCRIPT_TAG = '<script src="bhava-responsive.js"></script>'

HEAD_LINK_RE = re.compile(r'bhava-responsive\.css', re.IGNORECASE)
BODY_SCRIPT_RE = re.compile(r'bhava-responsive\.js', re.IGNORECASE)
DATA_ATTR_RE = re.compile(r'data-bhava-mobile\s*=\s*["\'][^"\']*["\']', re.IGNORECASE)
HTML_TAG_RE = re.compile(r'<html\b([^>]*)>', re.IGNORECASE)
HEAD_CLOSE_RE = re.compile(r'</head\s*>', re.IGNORECASE)
BODY_CLOSE_RE = re.compile(r'</body\s*>', re.IGNORECASE)

# Files/folders we never treat as a "game" to inject into
SKIP_NAME_PATTERNS = [
    re.compile(r'\.bak$', re.IGNORECASE),
    re.compile(r'^readme', re.IGNORECASE),
]


def is_skippable(html_path: Path) -> bool:
    name = html_path.name
    for pat in SKIP_NAME_PATTERNS:
        if pat.search(name):
            return True
    return False


def find_game_html_files(docs_dir: Path):
    """
    Finds every game HTML file under docs/:
      - flat games: docs/*.html directly at root
      - folder games: docs/<game-folder>/index.html (one level deep)
    Does NOT recurse into assets/css/js/data subfolders.
    """
    games = []

    # Flat games at docs/ root
    for f in sorted(docs_dir.glob("*.html")):
        if is_skippable(f):
            continue
        games.append(f)

    # Folder games: docs/<folder>/index.html
    for sub in sorted(docs_dir.iterdir()):
        if not sub.is_dir():
            continue
        index_file = sub / "index.html"
        if index_file.exists() and not is_skippable(index_file):
            games.append(index_file)

    return games


def ensure_toolkit_files_present(game_dir: Path, docs_dir: Path, apply: bool, log: list):
    """Copy bhava-responsive.css/.js into game_dir if not already there."""
    source_dir = docs_dir  # the two toolkit files should live at docs/ root as the master copy
    for fname in TOOLKIT_FILES:
        dest = game_dir / fname
        if dest.exists():
            continue
        src = source_dir / fname
        if not src.exists():
            log.append(f"  [WARN] Master copy missing: {src} — cannot copy into {game_dir}")
            continue
        log.append(f"  [COPY] {fname}  ->  {dest}")
        if apply:
            shutil.copy2(src, dest)


def backup_once(html_path: Path, apply: bool):
    """Creates a .responsive_bak copy the first time a file is touched.
    Returns a log line describing what happened (or None if a backup
    already existed and nothing needed to be done)."""
    bak_path = html_path.with_suffix(html_path.suffix + ".responsive_bak")
    if bak_path.exists():
        return None  # never overwrite an existing backup
    line = f"  [BACKUP] {html_path.name}  ->  {bak_path.name}"
    if apply:
        shutil.copy2(html_path, bak_path)
    return line


def inject_into_html(text: str, mode: str):
    """
    Returns (new_text, changes_made: list[str]).
    Only adds what's missing — never duplicates, never removes user edits.
    """
    changes = []

    # 1. data-bhava-mobile on <html ...>
    if not DATA_ATTR_RE.search(text):
        m = HTML_TAG_RE.search(text)
        if m:
            original_tag = m.group(0)
            new_tag = original_tag[:-1] + f' data-bhava-mobile="{mode}">'
            text = text[:m.start()] + new_tag + text[m.end():]
            changes.append(f'added data-bhava-mobile="{mode}" to <html>')
        else:
            changes.append('[WARN] no <html> tag found — could not add data-bhava-mobile')

    # 2. CSS link before </head>
    if not HEAD_LINK_RE.search(text):
        m = HEAD_CLOSE_RE.search(text)
        if m:
            insert = f'  {HEAD_LINK_TAG}\n'
            text = text[:m.start()] + insert + text[m.start():]
            changes.append('added bhava-responsive.css link before </head>')
        else:
            changes.append('[WARN] no </head> found — could not add CSS link')

    # 3. JS script before </body>
    if not BODY_SCRIPT_RE.search(text):
        m = BODY_CLOSE_RE.search(text)
        if m:
            insert = f'  {BODY_SCRIPT_TAG}\n'
            text = text[:m.start()] + insert + text[m.start():]
            changes.append('added bhava-responsive.js script before </body>')
        else:
            changes.append('[WARN] no </body> found — could not add JS script')

    return text, changes


def main():
    parser = argparse.ArgumentParser(description="Bulk-inject Bhāva responsive toolkit into all games.")
    parser.add_argument("--docs", default="docs", help="Path to docs folder (default: ./docs)")
    parser.add_argument("--mode", default="nudge", choices=["nudge", "block", "off"],
                         help="Default data-bhava-mobile value (default: nudge)")
    parser.add_argument("--apply", action="store_true",
                         help="Actually write changes. Omit for a safe dry-run/preview.")
    args = parser.parse_args()

    docs_dir = Path(args.docs).resolve()
    if not docs_dir.exists():
        print(f"ERROR: docs folder not found at {docs_dir}")
        sys.exit(1)

    for fname in TOOLKIT_FILES:
        if not (docs_dir / fname).exists():
            print(f"ERROR: {fname} not found at {docs_dir / fname}")
            print("Place the master copies of bhava-responsive.css and bhava-responsive.js")
            print(f"directly inside {docs_dir} before running this script.")
            sys.exit(1)

    games = find_game_html_files(docs_dir)
    if not games:
        print(f"No game HTML files found under {docs_dir}")
        sys.exit(0)

    mode_label = "APPLY (writing changes)" if args.apply else "DRY-RUN (preview only, nothing written)"
    print(f"=== Bhāva Responsive Toolkit Injector — {mode_label} ===")
    print(f"docs folder : {docs_dir}")
    print(f"default mode: {args.mode}")
    print(f"games found : {len(games)}\n")

    touched, already_done, warned = 0, 0, 0

    for html_path in games:
        game_dir = html_path.parent
        rel = html_path.relative_to(docs_dir)
        log = []

        original_text = html_path.read_text(encoding="utf-8", errors="ignore")
        new_text, changes = inject_into_html(original_text, args.mode)

        real_changes = [c for c in changes if not c.startswith("[WARN]")]
        warnings = [c for c in changes if c.startswith("[WARN]")]

        if not real_changes and not warnings:
            already_done += 1
            print(f"[SKIP] {rel} — already fully injected")
            continue

        print(f"[GAME] {rel}")
        ensure_toolkit_files_present(game_dir, docs_dir, args.apply, log)
        for line in log:
            print(line)
        for c in real_changes:
            print(f"  [HTML] {c}")
        for w in warnings:
            print(f"  {w}")
            warned += 1

        if real_changes:
            backup_line = backup_once(html_path, args.apply)
            if backup_line:
                print(backup_line)
            if args.apply:
                html_path.write_text(new_text, encoding="utf-8")
                print(f"  [WRITE] {rel} updated")
            touched += 1
        print()

    print("=== Summary ===")
    print(f"  Updated / would update : {touched}")
    print(f"  Already done (skipped) : {already_done}")
    print(f"  Warnings                : {warned}")
    if not args.apply:
        print("\nThis was a DRY-RUN. No files were changed.")
        print("Re-run with --apply once this preview looks correct:")
        print(f"  python {Path(__file__).name} --docs \"{args.docs}\" --mode {args.mode} --apply")


if __name__ == "__main__":
    main()
