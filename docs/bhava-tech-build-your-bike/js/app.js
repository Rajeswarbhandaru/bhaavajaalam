// app.js — application bootstrap
import { GameEngine } from "./engine.js";
import { UIManager } from "./ui.js";

async function bootstrap() {
  const engine = new GameEngine();
  await engine.init();

  document.documentElement.dataset.theme = engine.state.theme || "dark";

  const root = document.getElementById("screen-container");
  const ui = new UIManager(engine, root);

  engine.bus.on("achievement_unlocked", (a) => {
    console.info(`Achievement unlocked: ${a.title}`);
  });

  ui.renderHome();

  // Basic keyboard accessibility: Escape returns home
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") ui.renderHome();
  });

  // Expose for debugging in dev console only (not a global game-state leak; single namespaced ref)
  window.__bhavaBikeApp = { engine, ui };
}

bootstrap().catch(err => {
  console.error("Failed to start Bhāva Tech Build Your Bike:", err);
  document.getElementById("screen-container").innerHTML =
    `<div class="alert" style="margin:2rem">Failed to load game data. Please run this project via a local web server (not file://) so JSON fetch works.</div>`;
});
