# Bhāva Tech — Build Your Bike

A browser-based engineering education game teaching kids (11-18) how bicycles work through
hands-on experimentation, building, diagnosing failures, and optimizing designs.

## Tech Stack
Pure HTML5 + CSS3 + Vanilla JavaScript ES2022 (ES Modules). No frameworks, no backend.

## Running Locally
Browsers block `fetch()` on `file://` URLs, so you must serve the folder with a simple local server:

```bash
cd bhava-bike
python3 -m http.server 8080
# then open http://localhost:8080
```

Or with Node:
```bash
npx serve .
```

## Folder Structure
- `index.html` — shell with header, theme toggle, and screen templates
- `/css` — themes (dark/light/high-contrast), layout (grid), styles (components), animations (keyframes)
- `/js` — modular engine: storage, audio, physics, compatibility, diagnostics, scoring, animation,
  dragdrop, achievements, missions, engine (orchestrator), ui (rendering), app (bootstrap)
- `/data` — all game content as JSON (components, bike types, compatibility rules, lessons,
  glossary, missions, scenarios, achievements, materials, physics formulas)
- `/assets` — place images/icons/sounds/particles here (currently CSS/Canvas-generated placeholders)

## What's Implemented (v1 scaffold)
- Home screen with animated workshop background and full navigation menu
- Build Mode for all 6 bike types, driven by `bike_types.json` required-slot lists
- Rule-based Compatibility Engine (no hardcoded pass/fail — reads `compatibility.json`)
- Scoring Engine with 11 weighted criteria and human-readable explanations
- Component Laboratory tabs for Frame, Gear, Wheel, Brake, Suspension comparisons
- Repair Workshop covering all 18 specified failure modes with causes + fix hints
- Achievements/XP/Rank system persisted via LocalStorage
- Daily Missions and Customer Challenge browsing
- Invent Mode for open-ended creative submissions (Flying Bike, Solar Bike, Mars Bike, etc.)
- Glossary and Garage (saved builds) screens
- Dark/light theme toggle, glassmorphism panels, particle spark effects, sunbeam animation

## Extending to New Products (Motorcycle, Car, Rover, etc.)
The engine (`engine.js`, `compatibility.js`, `scoring.js`) never references bicycle-specific
strings directly in logic — all part names, slots, and rules come from JSON. To add a new
vehicle type:
1. Add entries to `bike_types.json` (or create `vehicle_types.json` and extend `DATA_FILES`).
2. Add new component categories to `components.json`.
3. Add new compatibility rules to `compatibility.json` and matching evaluator functions in
   `compatibility.js` (small, isolated additions — no core rewrite).
4. The Build Mode UI automatically renders any `requiredSlots` array, so no HTML changes needed.

## Next Steps for Full Production Build
- Replace canvas placeholder bike preview with a real layered SVG/Canvas rig (exploded view,
  rotate/zoom, part-specific animations: chain links, spinning spokes, suspension compression).
- Add real asset files (images/icons/sounds) referenced in `/assets`.
- Flesh out full lesson content (animations, mini-quizzes, prediction questions) per topic in
  `lessons.json` — currently topics render as cards; each needs a dedicated lesson view.
- Wire `dragdrop.js` into the Build Mode tray for true drag-and-drop part installation.
- Add AI Engineering Mentor dialogue system (Socratic question bank tied to failure events).
- Add environment/weather simulation visuals (rain, mud, snow, sand) using `scenarios.json`.
- Add accessibility toggles UI (high contrast, colorblind mode, large fonts) wired to `themes.css`.
