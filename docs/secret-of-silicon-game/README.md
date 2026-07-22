# The Secret of Silicon – The Heart of Modern Technology

An interactive discovery-based educational game teaching children (10-18) how semiconductors work,
built with vanilla HTML5, CSS3, and ES6+ JavaScript only (no frameworks, no build tools, no backend).

## How to run
Simply open `index.html` in any modern browser. No server, no installation, no internet required.

## Structure
- `index.html` — page skeleton and semantic structure
- `style.css` — dark glassmorphism theme, responsive layout, animations
- `script.js` — all logic: ContentDB (content), GameState (LocalStorage persistence),
  LevelRenderers (12 levels of interactive gameplay), App controller
- `assets/` — folder reserved for icons/images/audio/json if you want to enrich further

## Design philosophy
Observe -> Predict -> Experiment -> Fail -> Try Again -> Discover -> Understand.
No level explains a concept before the learner interacts with it.

## Levels
1. Technology Everywhere (click-to-reveal)
2. Meet the Materials (click-to-open fact cards)
3. Electricity Experiment (drag & drop circuit)
4. Conductors/Insulators/Semiconductors (drag & drop sorting)
5. Why Silicon? (data comparison + reveal)
6. Atom Builder (interactive electron shells)
7. Crystal Builder (lattice doping simulation)
8. Tiny Switch (transistor ON/OFF simulation)
9. Billions of Switches (scale visualization)
10. Chip Factory (ordered process simulation)
11. Inside My Devices (hotspot discovery)
12. Future of Silicon (GaN, SiC, graphene, quantum, photonic, neuromorphic)

## Extending
All educational content lives in the `ContentDB` object at the top of `script.js`.
To add a new topic (Electricity, Batteries, Magnets, Solar Cells), create a new
ContentDB section plus corresponding `renderLevelN` methods reusing the same
card/grid/drag-drop/badge patterns already built.

## Accessibility
Keyboard navigable (Tab/Enter/Space), ARIA roles/labels on interactive elements,
visible focus states, tooltips, reduced-motion support, responsive down to mobile widths.

## Persistence
Progress, completed levels, and badges are saved automatically to LocalStorage
under key `secretOfSilicon_v1`. Clearing browser storage resets progress.
