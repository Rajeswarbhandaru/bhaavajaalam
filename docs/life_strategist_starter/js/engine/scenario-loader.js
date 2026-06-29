// scenario-loader.js
// Bhāva Tech — Life Strategist
// Updated to use window.ScenariosData instead of fetch() to fix CORS error
// on file:// protocol (direct open), Electron, and Capacitor.
//
// REQUIRED: scenarios-data.js must be loaded BEFORE this file in index.html:
//   <script src="data/scenarios-data.js"></script>
//   <script src="js/scenario-loader.js"></script>

window.ScenarioLoader = {
  async all(level = 1) {
    return Promise.resolve(window.ScenariosData['level' + level]);
  },
  async byId(id) {
    const level = parseInt(id.split('-')[1]);
    const list = await this.all(level);
    return list.find(s => s.id === id);
  }
};
