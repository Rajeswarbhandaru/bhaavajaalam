# Bhāva Tech — Build Device Engineer

A vanilla HTML5/CSS3/JavaScript (ES2022) educational engineering simulator that teaches
students (11–18) how smartphones and laptops work by building, testing, debugging, and
optimizing devices from data-driven components.

## Tech Constraints
- No React / Vue / Angular
- No backend — 100% client-side, persistence via `localStorage`
- ES6 Modules, Classes, Factory + Observer patterns

## Folder Structure
```
index.html
css/
  layout.css       -> structural grid/flex layout
  styles.css       -> theme tokens, glassmorphism, component skins
  animations.css   -> keyframes, transitions, particle/wire effects
js/
  app.js           -> entry point, wires all modules together
  engine.js        -> EventBus, DataStore, GameState, Device/DeviceFactory
  ui.js            -> navigation, toasts, modals, reusable render helpers
  dragdrop.js      -> drag-and-drop + touch interaction framework
  simulation.js    -> CompatibilityEngine + SimulationEngine (boot sequence)
  diagnostics.js   -> live diagnostics panel rendering
  scoring.js       -> multi-dimension Engineering Score + mission evaluation
  animation.js     -> AnimationEngine (wires/particles) + canvas motherboard bg
  storage.js       -> LocalStorage persistence layer
data/
  components.json    -> all buildable parts (motherboards, CPU, RAM, etc.)
  compatibility.json -> rule engine definitions + failure symptom library
  lessons.json       -> "How Devices Work" interactive lesson content
  scenarios.json     -> customer missions (Grandmother, Teen Gamer, etc.)
  achievements.json  -> achievement/badge definitions
  glossary.json      -> term/definition pairs
assets/
  icons/ img/ sfx/ -> placeholders for future art & sound assets
```

## Running Locally
Because this uses `fetch()` for JSON data, open via a local server rather than `file://`:
```
npx serve .
# or
python -m http.server 8080
```
Then visit `http://localhost:8080` (or the port shown).

## Next Development Stages (Recommended Roadmap)
1. Reverse Engineering Mode — explode/rotate/disassemble view of a pre-built phone.
2. Component Laboratory deep-dives — CPU/Battery/Display/Sensor mini-games with live graphs.
3. AI Mentor — Socratic question engine wired to `sim:failure` events.
4. Invent Mode — open-ended custom device canvas with creativity scoring.
5. Full accessibility pass — keyboard-only slot placement, ARIA live regions.
6. Visual polish — SVG icon set, real component artwork in `/assets`.
