# Life Strategist Starter Pack

This starter pack includes:
- A plain HTML/CSS/JS engine skeleton.
- A Level 1 scenario pack with 12 missions.
- A basic loop: Home -> Levels -> Mission List -> Scenario -> Report.
- LocalStorage save support.

## Run
Use a local server because browsers often block `fetch()` from `file://`.

Examples:
- `python -m http.server`
- `npx serve`

Then open `http://localhost:8000/output/life_strategist_starter/` or serve the folder directly.

## Included files
- `index.html`
- `data/scenarios-level1.json`
- core engine modules in `js/`
- CSS design system in `css/`

## Next recommended upgrades
1. Add consequence overlay before the report.
2. Add random events and inventory checks.
3. Replace stat cards with animated bars.
4. Add IndexedDB and profile slots.
5. Expand Level 2 and Level 3 packs.
