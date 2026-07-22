/* ==========================================================================
   THE SECRET OF SILICON — SCRIPT.JS
   Vanilla ES6+ | Modules via classes/objects | No external dependencies
   Architecture: ContentDB -> GameState -> LevelRenderers -> App Controller
   ========================================================================== */

'use strict';

/* ============================================================
   1. CONTENT DATABASE
   All educational content lives here as plain JS objects so
   future topics (Electricity, Batteries, Magnets, Solar Cells)
   can reuse this exact architecture.
   ============================================================ */
const ContentDB = {

  tech: [
    { id:'phone',   icon:'📱', label:'Smartphone' },
    { id:'laptop',  icon:'💻', label:'Laptop' },
    { id:'robot',   icon:'🤖', label:'Robot' },
    { id:'satellite',icon:'🛰️', label:'Satellite' },
    { id:'car',     icon:'🚗', label:'Electric Car' },
    { id:'medical', icon:'🩺', label:'Medical Device' },
    { id:'ai',      icon:'🧠', label:'AI System' },
    { id:'console', icon:'🎮', label:'Gaming Console' },
  ],

  materials: [
    { id:'iron', symbol:'Fe', name:'Iron', tag:'Metal · Conductor',
      conducts:95, cost:20, heat:70,
      fact:'Iron conducts electricity but rusts easily and is heavier than most metals used in electronics.' },
    { id:'copper', symbol:'Cu', name:'Copper', tag:'Metal · Excellent Conductor',
      conducts:98, cost:55, heat:80,
      fact:'Copper is one of the best natural conductors — that is why it fills the wires inside every wall and device.' },
    { id:'gold', symbol:'Au', name:'Gold', tag:'Metal · Premium Conductor',
      conducts:92, cost:99, heat:75,
      fact:'Gold barely corrodes, which is why it plates the tiny connectors inside your phone — but it is far too costly for entire chips.' },
    { id:'silver', symbol:'Ag', name:'Silver', tag:'Metal · Best Conductor',
      conducts:100, cost:85, heat:78,
      fact:'Silver conducts electricity better than any other element, yet it tarnishes and is very expensive at large scale.' },
    { id:'aluminium', symbol:'Al', name:'Aluminium', tag:'Metal · Lightweight Conductor',
      conducts:80, cost:25, heat:65,
      fact:'Aluminium is light and conducts well, often used in power lines and laptop casings.' },
    { id:'plastic', symbol:'Pl', name:'Plastic', tag:'Polymer · Insulator',
      conducts:2, cost:10, heat:5,
      fact:'Plastic blocks electricity completely, which is exactly why it wraps every wire to keep you safe.' },
    { id:'glass', symbol:'Gl', name:'Glass', tag:'Ceramic · Insulator',
      conducts:1, cost:15, heat:8,
      fact:'Glass stops electric current almost entirely, but it can carry light — the basis of fibre-optic cables.' },
    { id:'silicon', symbol:'Si', name:'Silicon', tag:'Metalloid · Semiconductor',
      conducts:35, cost:12, heat:40,
      fact:'Silicon can be switched between conducting and blocking electricity — the single property that built the digital age.' },
    { id:'germanium', symbol:'Ge', name:'Germanium', tag:'Metalloid · Semiconductor',
      conducts:38, cost:60, heat:55,
      fact:'Germanium was used in the very first transistors in 1947, but it is rarer and less heat-stable than silicon.' },
  ],

  circuitBehaviour: {
    iron:'partial', copper:'pass', gold:'pass', silver:'pass', aluminium:'pass',
    plastic:'fail', glass:'fail', silicon:'partial', germanium:'partial'
  },

  sortCategories: [
    { id:'conductor', label:'Conductor', items:['copper','silver','gold','iron','aluminium'] },
    { id:'insulator', label:'Insulator', items:['plastic','glass'] },
    { id:'semiconductor', label:'Semiconductor', items:['silicon','germanium'] },
  ],

  compareRows: [
    { label:'Availability', values:{gold:15, copper:70, iron:95, silicon:98} },
    { label:'Cost (relative)', values:{gold:99, copper:55, iron:20, silicon:12} },
    { label:'Heat Tolerance', values:{gold:75, copper:80, iron:70, silicon:92} },
    { label:'Switchable Behaviour', values:{gold:5, copper:5, iron:5, silicon:97} },
    { label:'Crystal Formation Quality', values:{gold:40, copper:35, iron:30, silicon:99} },
    { label:'Manufacturing Ease', values:{gold:50, copper:60, iron:65, silicon:95} },
    { label:'Environmental Impact (lower=better, shown inverted)', values:{gold:20, copper:55, iron:70, silicon:85} },
  ],

  atomData: {
    default: 'silicon',
    elements: {
      hydrogen: { symbol:'H', protons:1, shells:[1] },
      carbon:   { symbol:'C', protons:6, shells:[2,4] },
      silicon:  { symbol:'Si', protons:14, shells:[2,8,4] },
      phosphorus:{ symbol:'P', protons:15, shells:[2,8,5] },
      boron:    { symbol:'B', protons:5, shells:[2,3] },
      germanium:{ symbol:'Ge', protons:32, shells:[2,8,18,4] },
    }
  },

  latticeDopants: {
    intrinsic: { label:'Pure Silicon', desc:'Every atom shares exactly 4 valence electrons with its neighbours. Very few free electrons exist, so current barely flows.' },
    phosphorus: { label:'Phosphorus Doping (N-Type)', desc:'Phosphorus has 5 valence electrons. One electron has no bonding partner and becomes free to move — creating a surplus of Negative charge carriers.' },
    boron: { label:'Boron Doping (P-Type)', desc:'Boron has only 3 valence electrons, leaving a "hole" where an electron is missing. This hole behaves like a Positive charge carrier.' }
  },

  factorySteps: [
    { id:'sand', icon:'🏖️', label:'Raw Sand', detail:'Ordinary beach sand is rich in silicon dioxide (SiO2) — the starting raw material.' },
    { id:'purify', icon:'🧪', label:'Purification', detail:'Sand is chemically refined until silicon reaches 99.9999999% purity — one impurity atom per billion.' },
    { id:'crystal', icon:'💎', label:'Crystal Growth', detail:'A seed crystal is slowly pulled from molten silicon, forming a single flawless crystal cylinder called an ingot.' },
    { id:'wafer', icon:'🥞', label:'Wafer Slicing', detail:'The ingot is sliced into thin, mirror-polished discs called wafers, each thinner than a human hair in places.' },
    { id:'litho', icon:'🔬', label:'Photolithography', detail:'Ultraviolet light projects billions of tiny circuit patterns onto the wafer through a stencil-like mask.' },
    { id:'etch', icon:'⚡', label:'Etching', detail:'Chemicals and plasma carve away unwanted material, leaving only the designed circuit patterns behind.' },
    { id:'test', icon:'🧭', label:'Testing', detail:'Every single chip is electrically tested while still on the wafer — faulty ones are marked and discarded.' },
    { id:'package', icon:'📦', label:'Packaging', detail:'Good chips are cut apart, wired to metal pins, and sealed in protective casing.' },
    { id:'finished', icon:'✅', label:'Finished Chip', detail:'A finished chip can hold billions of transistors in an area smaller than your fingernail.' },
  ],

  devices: [
    { id:'phone', label:'Smartphone', chips:['Processor (SoC)','Memory Chip','Camera Sensor','Power Management Chip','Modem Chip'] },
    { id:'laptop', label:'Laptop', chips:['CPU','GPU','RAM Modules','SSD Controller','Wi-Fi Chip'] },
    { id:'robot', label:'Robot', chips:['Motor Controller Chip','Sensor Processor','Microcontroller','Battery Management IC'] },
    { id:'drone', label:'Drone', chips:['Flight Controller Chip','GPS Chip','Camera Processor','Radio Transceiver'] },
    { id:'car', label:'Electric Car', chips:['Battery Management IC','Motor Inverter Chip','Infotainment SoC','Sensor Fusion Chip'] },
  ],

  future: [
    { id:'gan', tag:'Power Electronics', name:'Gallium Nitride (GaN)', fact:'Handles higher voltages and switches faster than silicon, already used in compact fast chargers.' },
    { id:'sic', tag:'Power Electronics', name:'Silicon Carbide (SiC)', fact:'Extremely heat-tolerant, making it ideal for electric vehicle power systems.' },
    { id:'graphene', tag:'Experimental', name:'Graphene', fact:'A single layer of carbon atoms that conducts electricity superbly, but is still hard to manufacture at chip scale.' },
    { id:'quantum', tag:'Next-Generation Computing', name:'Quantum Chips', fact:'Use quantum bits (qubits) that can exist in multiple states at once, promising radically new computation.' },
    { id:'photonic', tag:'Next-Generation Computing', name:'Photonic Chips', fact:'Move information using light instead of electrons, potentially cutting heat and boosting speed.' },
    { id:'neuromorphic', tag:'Next-Generation Computing', name:'Neuromorphic Chips', fact:'Designed to mimic how neurons in the brain process information, aiming for efficient AI hardware.' },
  ],

  curiosityPrompts: [
    'Why do you think copper is used in wires but not inside a CPU?',
    'What would happen if CPUs were made entirely from gold?',
    'Can you predict what happens if silicon disappeared tomorrow?',
    'Why not just use the best conductor, silver, for everything?',
    'What if a transistor were the size of a football — how many would fit in your phone?',
    'What if a computer had only one transistor? What could it possibly do?',
    'Why do you think engineers add impurities on purpose during doping?',
    'What happens to a switch when you flip it a billion times per second?',
  ],

  badges: [
    { id:'observer', icon:'👀', name:'The Observer', desc:'Completed Level 1' },
    { id:'material-scout', icon:'🧱', name:'Material Scout', desc:'Explored every material' },
    { id:'circuit-tester', icon:'🔌', name:'Circuit Tester', desc:'Tested all circuit materials' },
    { id:'sorter', icon:'🗂️', name:'Master Sorter', desc:'Sorted every material correctly' },
    { id:'silicon-champion', icon:'🏆', name:'Silicon Champion', desc:'Completed the comparison challenge' },
    { id:'atom-architect', icon:'⚛️', name:'Atom Architect', desc:'Built a stable silicon atom' },
    { id:'crystal-engineer', icon:'💠', name:'Crystal Engineer', desc:'Created N-Type and P-Type silicon' },
    { id:'switch-master', icon:'🔀', name:'Switch Master', desc:'Operated your first transistor' },
    { id:'scale-thinker', icon:'📈', name:'Scale Thinker', desc:'Zoomed from 1 to a billion transistors' },
    { id:'fab-engineer', icon:'🏭', name:'Fab Engineer', desc:'Completed the chip factory process' },
    { id:'chip-hunter', icon:'🔍', name:'Chip Hunter', desc:'Found chips in every device' },
    { id:'future-visionary', icon:'🚀', name:'Future Visionary', desc:'Explored future materials' },
  ]
};

/* ============================================================
   2. GAME STATE  (persisted to LocalStorage)
   ============================================================ */
class GameState {
  constructor(){
    this.storageKey = 'secretOfSilicon_v1';
    this.data = this.load() || this.defaultState();
  }
  defaultState(){
    return {
      currentLevel: 1,
      unlockedLevel: 1,
      completedLevels: [],
      badges: [],
      levelData: {}
    };
  }
  load(){
    try{
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : null;
    }catch(e){ return null; }
  }
  save(){
    try{ localStorage.setItem(this.storageKey, JSON.stringify(this.data)); }
    catch(e){ /* storage unavailable - fail silently */ }
  }
  completeLevel(n){
    if(!this.data.completedLevels.includes(n)) this.data.completedLevels.push(n);
    if(this.data.unlockedLevel <= n) this.data.unlockedLevel = Math.min(n+1, 12);
    this.save();
  }
  isCompleted(n){ return this.data.completedLevels.includes(n); }
  isUnlocked(n){ return n <= this.data.unlockedLevel; }
  setLevelData(n, key, value){
    if(!this.data.levelData[n]) this.data.levelData[n] = {};
    this.data.levelData[n][key] = value;
    this.save();
  }
  getLevelData(n, key){
    return this.data.levelData[n] ? this.data.levelData[n][key] : undefined;
  }
  awardBadge(id){
    if(!this.data.badges.includes(id)){
      this.data.badges.push(id);
      this.save();
      return true;
    }
    return false;
  }
  hasBadge(id){ return this.data.badges.includes(id); }
}

/* ============================================================
   3. UTILITIES
   ============================================================ */
const Utils = {
  qs(sel, root=document){ return root.querySelector(sel); },
  qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); },
  el(tag, cls, html){
    const e = document.createElement(tag);
    if(cls) e.className = cls;
    if(html !== undefined) e.innerHTML = html;
    return e;
  },
  shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  },
  clamp(v,min,max){ return Math.max(min, Math.min(max, v)); },
  colorForScore(v){
    if(v >= 66) return 'var(--accent-3)';
    if(v >= 33) return 'var(--accent-warn)';
    return 'var(--accent-err)';
  },
  randomFrom(arr){ return arr[Math.floor(Math.random()*arr.length)]; },
  attachTooltip(node, text){
    node.setAttribute('data-tooltip', text);
  }
};

/* ============================================================
   4. TOAST + BADGE + CURIOSITY SYSTEMS
   ============================================================ */
class ToastSystem {
  constructor(){ this.node = Utils.qs('#toast'); this.timer = null; }
  show(msg, ms=3200){
    this.node.textContent = msg;
    this.node.classList.add('show');
    clearTimeout(this.timer);
    this.timer = setTimeout(()=> this.node.classList.remove('show'), ms);
  }
}

class BadgeSystem {
  constructor(state, toast){
    this.state = state; this.toast = toast;
    this.grid = Utils.qs('#badgesGrid');
    this.countEl = Utils.qs('#badgeCount');
    this.renderPanel();
    this.updateCount();
  }
  award(id){
    const badge = ContentDB.badges.find(b=>b.id===id);
    if(!badge) return;
    const isNew = this.state.awardBadge(id);
    if(isNew){
      this.toast.show(`🏆 Achievement unlocked: ${badge.name}`);
      this.renderPanel();
      this.updateCount();
    }
  }
  updateCount(){ this.countEl.textContent = this.state.data.badges.length; }
  renderPanel(){
    this.grid.innerHTML = '';
    ContentDB.badges.forEach(b=>{
      const earned = this.state.hasBadge(b.id);
      const item = Utils.el('div', `badge-item${earned?' earned':''}`,
        `<span class="bicon">${b.icon}</span><span class="bname">${b.name}</span>`);
      item.title = b.desc;
      this.grid.appendChild(item);
    });
  }
}

class CuriositySystem {
  constructor(){
    this.bar = Utils.qs('#curiosityBar');
    this.prompts = ContentDB.curiosityPrompts;
    this.rotate();
    this.timer = setInterval(()=>this.rotate(), 9000);
  }
  rotate(){
    this.bar.style.opacity = 0;
    setTimeout(()=>{
      this.bar.textContent = '💭 ' + Utils.randomFrom(this.prompts);
      this.bar.style.opacity = 1;
    }, 300);
  }
  setContextual(text){
    this.bar.textContent = '💭 ' + text;
  }
}

/* ============================================================
   5. TOOLTIP MANAGER (accessibility + hover facts)
   ============================================================ */
class TooltipManager {
  constructor(){
    this.node = Utils.qs('#tooltip');
    document.addEventListener('mouseover', e=>{
      const t = e.target.closest('[data-tooltip]');
      if(t) this.show(t, t.getAttribute('data-tooltip'));
    });
    document.addEventListener('mouseout', e=>{
      const t = e.target.closest('[data-tooltip]');
      if(t) this.hide();
    });
    document.addEventListener('focusin', e=>{
      const t = e.target.closest('[data-tooltip]');
      if(t) this.show(t, t.getAttribute('data-tooltip'));
    });
    document.addEventListener('focusout', e=>{
      const t = e.target.closest('[data-tooltip]');
      if(t) this.hide();
    });
  }
  show(target, text){
    const r = target.getBoundingClientRect();
    this.node.textContent = text;
    this.node.classList.remove('hidden');
    this.node.style.left = Utils.clamp(r.left, 8, window.innerWidth-236) + 'px';
    this.node.style.top = Math.max(8, r.top - 46) + 'px';
  }
  hide(){ this.node.classList.add('hidden'); }
}

/* ============================================================
   6. LEVEL RENDERER BASE + REGISTRY
   Each level is a self-contained render() function that builds
   DOM inside a provided container. State is read/written via
   the shared GameState instance for persistence across reloads.
   ============================================================ */

const LevelMeta = [
  { n:1,  title:'Technology Everywhere', tag:'Discovery' },
  { n:2,  title:'Meet the Materials', tag:'Exploration' },
  { n:3,  title:'The Electricity Experiment', tag:'Experiment' },
  { n:4,  title:'Conductors, Insulators, Semiconductors', tag:'Sorting' },
  { n:5,  title:'Why Silicon?', tag:'Comparison' },
  { n:6,  title:'Atom Builder', tag:'Build' },
  { n:7,  title:'Crystal Builder', tag:'Build' },
  { n:8,  title:'The Tiny Switch', tag:'Simulation' },
  { n:9,  title:'Billions of Switches', tag:'Scale' },
  { n:10, title:'Chip Factory', tag:'Process' },
  { n:11, title:'Inside My Devices', tag:'Discovery' },
  { n:12, title:'The Future of Silicon', tag:'Horizon' },
];

class LevelRenderers {
  constructor(app){ this.app = app; this.state = app.state; this.badge = app.badgeSystem; this.curiosity = app.curiosity; }

  markDone(n){
    this.state.completeLevel(n);
    this.app.refreshNav();
    this.app.updateProgress();
    this.app.toast.show(`✅ Level ${n} complete — new level unlocked!`);
  }

  showFeedback(container, cls, text){
    let fb = container.querySelector('.feedback');
    if(!fb){
      fb = Utils.el('div','feedback');
      container.appendChild(fb);
    }
    fb.className = `feedback show ${cls}`;
    fb.textContent = text;
  }

  /* ---------- LEVEL 1 : Technology Everywhere ---------- */
  renderLevel1(container){
    const grid = Utils.el('div','grid grid-4');
    let revealedCount = 0;
    ContentDB.tech.forEach(t=>{
      const tile = Utils.el('div','card tile', `<span class="pulse-ring"></span><span class="icon">${t.icon}</span><span class="label">${t.label}</span>`);
      tile.tabIndex = 0;
      tile.setAttribute('role','button');
      tile.setAttribute('aria-label', `Reveal what is inside ${t.label}`);
      Utils.attachTooltip(tile, `Click to peek inside the ${t.label}`);
      const reveal = ()=>{
        if(tile.classList.contains('revealed')) return;
        tile.classList.add('revealed');
        revealedCount++;
        if(revealedCount === ContentDB.tech.length){
          this.showFeedback(container, 'info', '🔎 Every single device runs on the same hidden ingredient: a tiny chip made mostly of silicon. Curious why? Keep going!');
          this.enableComplete(container, 1);
        }
      };
      tile.addEventListener('click', reveal);
      tile.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); reveal(); } });
      grid.appendChild(tile);
    });
    container.appendChild(grid);
    const q = Utils.el('div','big-question', '❓ What is common inside all of these machines? Click every card to reveal a clue.');
    container.insertBefore(q, grid);
    this.addCompleteButton(container, 1, false);
  }

  /* ---------- LEVEL 2 : Meet the Materials ---------- */
  renderLevel2(container){
    const q = Utils.el('div','big-question', '🧪 Click each material to learn its personality. Which ones do you think can carry electricity?');
    container.appendChild(q);
    const grid = Utils.el('div','grid grid-3');
    let opened = new Set();
    ContentDB.materials.forEach(m=>{
      const card = Utils.el('div','card material-card',`
        <div class="mhead"><div class="msym">${m.symbol}</div><div><h4>${m.name}</h4><div class="mtag">${m.tag}</div></div></div>
        <div class="mbars">
          <div class="mbar-row">Conducts <div class="mbar-track"><div class="mbar-fill" style="width:${m.conducts}%"></div></div></div>
        </div>
        <div class="mfact">${m.fact}</div>
      `);
      card.tabIndex = 0;
      card.setAttribute('role','button');
      Utils.attachTooltip(card, `Click to reveal a fact about ${m.name}`);
      const toggle = ()=>{
        card.classList.toggle('open');
        opened.add(m.id);
        if(opened.size === ContentDB.materials.length) this.enableComplete(container, 2);
      };
      card.addEventListener('click', toggle);
      card.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggle(); } });
      grid.appendChild(card);
    });
    container.appendChild(grid);
    this.addCompleteButton(container, 2, false);
  }

  /* ---------- LEVEL 3 : Electricity Experiment ---------- */
  renderLevel3(container){
    const q = Utils.el('div','big-question', '⚡ Drag a material into the circuit slot. Predict first — will the bulb light up, stay dark, or glow dimly?');
    container.appendChild(q);

    const zone = Utils.el('div','dnd-zone');
    const pool = Utils.el('div','dnd-pool');
    ContentDB.materials.forEach(m=>{
      const chip = Utils.el('div','drag-chip', `${m.symbol} ${m.name}`);
      chip.draggable = true;
      chip.dataset.id = m.id;
      chip.addEventListener('dragstart', e=>{ e.dataTransfer.setData('text/plain', m.id); chip.classList.add('dragging'); });
      chip.addEventListener('dragend', ()=> chip.classList.remove('dragging'));
      pool.appendChild(chip);
    });

    const circuitWrap = Utils.el('div','card', `
      <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;justify-content:center;">
        <div class="bulb" id="circuitBulb">💡</div>
        <div class="circuit-wire" id="wireLeft"><div class="flow"></div></div>
        <div class="drop-slot" id="circuitSlot">Drop material here</div>
        <div class="circuit-wire" id="wireRight"><div class="flow"></div></div>
      </div>
    `);

    [circuitWrap].forEach(c=>{});
    zone.appendChild(pool);
    zone.appendChild(circuitWrap);
    container.appendChild(zone);

    const slot = ()=>Utils.qs('#circuitSlot', container);
    const bulb = ()=>Utils.qs('#circuitBulb', container);
    const wireL = ()=>Utils.qs('#wireLeft', container);
    const wireR = ()=>Utils.qs('#wireRight', container);
    let testedSet = new Set();

    const s = slot();
    s.addEventListener('dragover', e=>{ e.preventDefault(); s.classList.add('dragover'); });
    s.addEventListener('dragleave', ()=> s.classList.remove('dragover'));
    s.addEventListener('drop', e=>{
      e.preventDefault();
      s.classList.remove('dragover');
      const id = e.dataTransfer.getData('text/plain');
      const mat = ContentDB.materials.find(m=>m.id===id);
      if(!mat) return;
      const behaviour = ContentDB.circuitBehaviour[id];
      s.textContent = mat.symbol + ' ' + mat.name;
      s.classList.add('filled');
      s.classList.remove('result-pass','result-fail','result-partial');
      bulb().classList.remove('lit','dim');
      wireL().classList.remove('active'); wireR().classList.remove('active');

      if(behaviour === 'pass'){
        s.classList.add('result-pass'); bulb().classList.add('lit');
        wireL().classList.add('active'); wireR().classList.add('active');
        this.showFeedback(container,'good', `${mat.name} let electricity flow freely — a true conductor!`);
      } else if(behaviour === 'fail'){
        s.classList.add('result-fail');
        this.showFeedback(container,'bad', `${mat.name} completely blocked the current — that makes it an insulator.`);
      } else {
        s.classList.add('result-partial'); bulb().classList.add('dim');
        wireL().classList.add('active'); wireR().classList.add('active');
        this.showFeedback(container,'info', `${mat.name} let a little current pass — it behaves in between a conductor and an insulator. Interesting, right?`);
      }
      testedSet.add(id);
      if(testedSet.size >= 6){
        this.badge.award('circuit-tester');
        this.enableComplete(container, 3);
      }
    });

    this.addCompleteButton(container, 3, false);
  }

  /* ---------- LEVEL 4 : Conductors / Insulators / Semiconductors sorting ---------- */
  renderLevel4(container){
    const q = Utils.el('div','big-question', '🗂️ Drag each material into the column where you think it belongs.');
    container.appendChild(q);

    const board = Utils.el('div','sort-board');
    const columns = {};
    ContentDB.sortCategories.forEach(cat=>{
      const col = Utils.el('div','sort-column', `<h4>${cat.label}</h4>`);
      col.dataset.cat = cat.id;
      col.addEventListener('dragover', e=>{ e.preventDefault(); col.classList.add('dragover'); });
      col.addEventListener('dragleave', ()=> col.classList.remove('dragover'));
      col.addEventListener('drop', e=>{
        e.preventDefault();
        col.classList.remove('dragover');
        const id = e.dataTransfer.getData('text/plain');
        const chip = Utils.qs(`[data-id="${id}"]`, container);
        if(!chip) return;
        const correctCat = ContentDB.sortCategories.find(c=>c.items.includes(id));
        col.appendChild(chip);
        if(correctCat.id === cat.id){
          this.showFeedback(container,'good', `Correct! That belongs with ${cat.label.toLowerCase()}s.`);
        } else {
          this.showFeedback(container,'bad', `Not quite — try comparing how much electricity it lets through.`);
        }
        this.checkSortComplete(container);
      });
      columns[cat.id] = col;
      board.appendChild(col);
    });

    const pool = Utils.el('div','dnd-pool');
    Utils.shuffle(ContentDB.materials).forEach(m=>{
      const chip = Utils.el('div','drag-chip', `${m.symbol} ${m.name}`);
      chip.draggable = true;
      chip.dataset.id = m.id;
      chip.addEventListener('dragstart', e=>{ e.dataTransfer.setData('text/plain', m.id); chip.classList.add('dragging'); });
      chip.addEventListener('dragend', ()=>chip.classList.remove('dragging'));
      pool.appendChild(chip);
    });

    container.appendChild(pool);
    container.appendChild(board);
    this.addCompleteButton(container, 4, false);
  }

  checkSortComplete(container){
    let allPlaced = true;
    ContentDB.sortCategories.forEach(cat=>{
      const col = Utils.qs(`.sort-column[data-cat="${cat.id}"]`, container);
      cat.items.forEach(id=>{
        const chip = Utils.qs(`[data-id="${id}"]`, container);
        if(!chip || chip.parentElement !== col) allPlaced = false;
      });
    });
    if(allPlaced){
      this.badge.award('sorter');
      this.showFeedback(container, 'good', '🎉 Perfectly sorted! Semiconductors sit in the middle — sometimes they conduct, sometimes they do not. That flexibility is their superpower.');
      this.enableComplete(container, 4);
    }
  }

  /* ---------- LEVEL 5 : Why Silicon? Comparison ---------- */
  renderLevel5(container){
    const q = Utils.el('div','big-question', '⚖️ Gold conducts electricity beautifully. So why is gold not used to build entire computer chips? Compare below.');
    container.appendChild(q);

    const table = Utils.el('table','compare-table');
    let head = '<tr><th>Property</th><th>Gold</th><th>Copper</th><th>Iron</th><th>Silicon</th></tr>';
    let rows = '';
    ContentDB.compareRows.forEach(r=>{
      rows += `<tr><td>${r.label}</td>`;
      ['gold','copper','iron','silicon'].forEach(mat=>{
        const v = r.values[mat];
        rows += `<td><span class="score-dot" style="background:${Utils.colorForScore(v)}"></span>${v}</td>`;
      });
      rows += '</tr>';
    });
    table.innerHTML = head + rows;
    container.appendChild(table);

    const revealBtn = Utils.el('button','complete-btn', 'Reveal Why Silicon Wins');
    const reveal = Utils.el('div','reveal-panel', `
      <h4>The Discovery</h4>
      <p>Silicon is not the best conductor — copper and gold both beat it easily. But silicon has one property none of the others have: its conductivity can be switched on and off, and finely controlled through doping.
      That "switchability" is exactly what a transistor needs. Combined with being cheap, abundant (found in ordinary sand), and forming perfect crystals, silicon became the material every chip is built from.</p>
    `);
    revealBtn.addEventListener('click', ()=>{
      reveal.classList.add('show');
      this.badge.award('silicon-champion');
      this.enableComplete(container, 5);
    });
    container.appendChild(revealBtn);
    container.appendChild(reveal);
    this.addCompleteButton(container, 5, false);
  }

  /* ---------- LEVEL 6 : Atom Builder ---------- */
  renderLevel6(container){
    const q = Utils.el('div','big-question', '⚛️ Build a silicon atom. Add electron shells and see how many electrons sit in the outermost shell — the valence shell.');
    container.appendChild(q);

    const stage = Utils.el('div','atom-stage');
    const view = Utils.el('div','atom-view');
    view.innerHTML = '<div class="nucleus">Si\n+14</div>';
    const controls = Utils.el('div','atom-controls', `
      <div class="slider-row">
        <label for="elementSelect">Choose an element</label>
        <select id="elementSelect" style="width:100%;padding:8px;border-radius:8px;background:var(--glass-strong);color:var(--text-0);border:1px solid var(--border);">
          <option value="hydrogen">Hydrogen (H)</option>
          <option value="carbon">Carbon (C)</option>
          <option value="boron">Boron (B)</option>
          <option value="silicon" selected>Silicon (Si)</option>
          <option value="phosphorus">Phosphorus (P)</option>
          <option value="germanium">Germanium (Ge)</option>
        </select>
      </div>
      <p id="valenceInfo" style="font-size:13px;"></p>
    `);
    stage.appendChild(view);
    stage.appendChild(controls);
    container.appendChild(stage);

    const drawAtom = (key)=>{
      const el = ContentDB.atomData.elements[key];
      view.innerHTML = `<div class="nucleus">${el.symbol}<br>+${el.protons}</div>`;
      const baseRadius = 40;
      el.shells.forEach((count, shellIdx)=>{
        const radius = baseRadius + shellIdx * 45;
        const shellDiv = Utils.el('div','shell');
        shellDiv.style.width = radius*2+'px';
        shellDiv.style.height = radius*2+'px';
        view.appendChild(shellDiv);
        const isOuter = shellIdx === el.shells.length -1;
        for(let i=0;i<count;i++){
          const angle = (2*Math.PI/count) * i;
          const ex = radius * Math.cos(angle);
          const ey = radius * Math.sin(angle);
          const eDiv = Utils.el('div', `electron${isOuter?' valence':''}`);
          eDiv.style.transform = `translate(${ex}px, ${ey}px)`;
          eDiv.style.animation = `orbit${shellIdx} ${6+shellIdx*2}s linear infinite`;
          view.appendChild(eDiv);
        }
        if(!document.getElementById(`orbit-style-${shellIdx}`)){
          const styleTag = document.createElement('style');
          styleTag.id = `orbit-style-${shellIdx}`;
          styleTag.textContent = `@keyframes orbit${shellIdx}{from{transform:rotate(0deg) translateX(${radius}px) rotate(0deg);}to{transform:rotate(360deg) translateX(${radius}px) rotate(-360deg));}}`;
          document.head.appendChild(styleTag);
        }
      });
      const outerCount = el.shells[el.shells.length-1];
      const info = Utils.qs('#valenceInfo', container);
      info.textContent = `${el.symbol} has ${outerCount} valence electron${outerCount===1?'':'s'} in its outer shell.` +
        (key==='silicon' ? ' Four valence electrons let silicon form four strong bonds with neighbouring atoms — the foundation of its crystal structure.' : '');
      if(key === 'silicon'){
        this.badge.award('atom-architect');
        this.enableComplete(container, 6);
      }
    };

    Utils.qs('#elementSelect', controls).addEventListener('change', e=> drawAtom(e.target.value));
    drawAtom('silicon');
    this.addCompleteButton(container, 6, false);
  }

  /* ---------- LEVEL 7 : Crystal Builder ---------- */
  renderLevel7(container){
    const q = Utils.el('div','big-question', '💠 Click nodes in the lattice to swap a silicon atom for a dopant. Watch how the crystal changes.');
    container.appendChild(q);

    const controls = Utils.el('div', 'zoom-controls');
    ['intrinsic','phosphorus','boron'].forEach(mode=>{
      const btn = Utils.el('button','chip-btn', mode==='intrinsic'?'Pure Silicon':mode==='phosphorus'?'Add Phosphorus':'Add Boron');
      btn.dataset.mode = mode;
      controls.appendChild(btn);
    });
    container.appendChild(controls);

    const lattice = Utils.el('div','lattice-grid');
    const nodes = [];
    for(let i=0;i<24;i++){
      const node = Utils.el('div','lattice-node si', 'Si');
      lattice.appendChild(node);
      nodes.push(node);
    }
    container.appendChild(lattice);

    const info = Utils.el('div','reveal-panel show', `<h4>${ContentDB.latticeDopants.intrinsic.label}</h4><p>${ContentDB.latticeDopants.intrinsic.desc}</p>`);
    container.appendChild(info);

    let currentMode = 'intrinsic';
    let dopedOnce = { phosphorus:false, boron:false };

    Utils.qsa('.chip-btn', controls).forEach(btn=>{
      btn.addEventListener('click', ()=>{
        Utils.qsa('.chip-btn', controls).forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.dataset.mode;
        if(currentMode === 'intrinsic'){
          nodes.forEach(n=>{ n.className='lattice-node si'; n.textContent='Si'; });
        }
        const d = ContentDB.latticeDopants[currentMode];
        info.innerHTML = `<h4>${d.label}</h4><p>${d.desc}</p>`;
      });
    });

    nodes.forEach(node=>{
      node.addEventListener('click', ()=>{
        if(currentMode === 'intrinsic') return;
        const cls = currentMode === 'phosphorus' ? 'p-dopant' : 'b-dopant';
        const sym = currentMode === 'phosphorus' ? 'P' : 'B';
        node.className = `lattice-node ${cls}`;
        node.textContent = sym;
        dopedOnce[currentMode] = true;
        if(dopedOnce.phosphorus && dopedOnce.boron){
          this.badge.award('crystal-engineer');
          this.showFeedback(container,'good','🎉 You have created both N-Type (phosphorus) and P-Type (boron) silicon — the two building blocks of every transistor.');
          this.enableComplete(container, 7);
        }
      });
    });

    this.addCompleteButton(container, 7, false);
  }

  /* ---------- LEVEL 8 : Tiny Switch (Transistor) ---------- */
  renderLevel8(container){
    const q = Utils.el('div','big-question', '🔀 A transistor is built from N-Type and P-Type silicon layers. Toggle the gate voltage and watch what happens.');
    container.appendChild(q);

    const stage = Utils.el('div','switch-stage');
    stage.innerHTML = `
      <div class="card" style="text-align:center;">
        <p style="margin-bottom:10px;">Gate Voltage</p>
        <div class="mega-switch" id="gateSwitch" tabindex="0" role="switch" aria-checked="false" aria-label="Toggle transistor gate voltage"><div class="knob"></div></div>
      </div>
      <div class="card" style="text-align:center;">
        <p style="margin-bottom:10px;">Current Flow</p>
        <div class="status-led" id="switchLed" style="margin:0 auto;"></div>
      </div>
      <div class="card" style="max-width:280px;">
        <p id="switchExplain" style="margin:0;">Flip the gate switch to apply voltage. Observe what happens to the current below before reading the explanation.</p>
      </div>
    `;
    container.appendChild(stage);

    const gate = Utils.qs('#gateSwitch', container);
    const led = Utils.qs('#switchLed', container);
    const explain = Utils.qs('#switchExplain', container);
    let toggles = 0;
    const toggle = ()=>{
      const isOn = gate.classList.toggle('on');
      gate.setAttribute('aria-checked', String(isOn));
      led.classList.toggle('on', isOn);
      toggles++;
      explain.textContent = isOn
        ? 'Gate voltage created a conducting channel — current now flows. This is the ON state, meaning a digital 1.'
        : 'No gate voltage means no channel — current is blocked. This is the OFF state, meaning a digital 0.';
      if(toggles >= 2){
        this.badge.award('switch-master');
        this.showFeedback(container,'good','⚡ You just operated a transistor — the tiniest switch in the world, and the basic building block of every computer chip.');
        this.enableComplete(container, 8);
      }
    };
    gate.addEventListener('click', toggle);
    gate.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggle(); } });
    this.addCompleteButton(container, 8, false);
  }

  /* ---------- LEVEL 9 : Billions of Switches ---------- */
  renderLevel9(container){
    const q = Utils.el('div','big-question', '📈 One transistor is a switch. What happens when you connect a billion of them together? Zoom out step by step.');
    container.appendChild(q);

    const steps = [
      { n:1, label:'1 Transistor — a single switch' },
      { n:10, label:'10 Transistors — a tiny logic circuit' },
      { n:100, label:'100 Transistors — a basic calculator function' },
      { n:1000, label:'1,000 Transistors — an early digital chip' },
      { n:1000000, label:'1 Million Transistors — a simple 1990s processor' },
      { n:1000000000, label:'1 Billion+ Transistors — a modern CPU or AI chip' },
    ];
    const zoomStage = Utils.el('div','zoom-stage');
    const canvas = Utils.el('div','zoom-canvas');
    const controls = Utils.el('div','zoom-controls');
    const label = Utils.el('p', null, steps[0].label);
    label.style.marginTop = '10px';
    label.style.fontWeight = '600';

    let visited = new Set();
    const renderStep = (idx)=>{
      const step = steps[idx];
      const dotCount = Math.min(400, Math.max(1, Math.round(Math.log10(step.n+1)*70)));
      canvas.innerHTML = '';
      canvas.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(dotCount))}, 1fr)`;
      for(let i=0;i<dotCount;i++) canvas.appendChild(Utils.el('div','zoom-dot'));
      label.textContent = step.label;
      visited.add(idx);
      Utils.qsa('.chip-btn', controls).forEach((b,i)=> b.classList.toggle('active', i===idx));
      if(visited.size === steps.length){
        this.badge.award('scale-thinker');
        this.showFeedback(container,'good','🚀 From one simple switch to billions working together in perfect timing — that leap in scale is what powers modern AI chips.');
        this.enableComplete(container, 9);
      }
    };

    steps.forEach((s,i)=>{
      const btn = Utils.el('button','chip-btn', s.n.toLocaleString());
      btn.addEventListener('click', ()=>renderStep(i));
      controls.appendChild(btn);
    });

    zoomStage.appendChild(canvas);
    zoomStage.appendChild(controls);
    zoomStage.appendChild(label);
    container.appendChild(zoomStage);
    renderStep(0);
    this.addCompleteButton(container, 9, false);
  }

  /* ---------- LEVEL 10 : Chip Factory ---------- */
  renderLevel10(container){
    const q = Utils.el('div','big-question', '🏭 Click each stage in order to follow raw sand as it becomes a finished microchip.');
    container.appendChild(q);

    const line = Utils.el('div','factory-line');
    let nextIndex = 0;
    ContentDB.factorySteps.forEach((step, idx)=>{
      const card = Utils.el('div','card factory-step', `<span class="ficon">${step.icon}</span><div class="fnum">Step ${idx+1}</div><div>${step.label}</div>`);
      card.tabIndex = 0;
      card.setAttribute('role','button');
      Utils.attachTooltip(card, step.detail);
      card.addEventListener('click', ()=>{
        if(idx !== nextIndex){
          this.showFeedback(container,'bad', 'Try following the process in order — what has to happen before this step?');
          return;
        }
        card.classList.add('done');
        this.showFeedback(container,'info', step.detail);
        nextIndex++;
        if(nextIndex === ContentDB.factorySteps.length){
          this.badge.award('fab-engineer');
          this.showFeedback(container,'good','🎉 You just built a chip from raw sand to finished product — the same journey real fabs perform billions of times.');
          this.enableComplete(container, 10);
        }
      });
      line.appendChild(card);
    });
    container.appendChild(line);
    this.addCompleteButton(container, 10, false);
  }

  /* ---------- LEVEL 11 : Inside My Devices ---------- */
  renderLevel11(container){
    const q = Utils.el('div','big-question', '🔍 Select a device, then click the glowing hotspots to find every hidden chip inside.');
    container.appendChild(q);

    const selector = Utils.el('div','device-selector');
    const shell = Utils.el('div','device-shell');
    container.appendChild(selector);
    container.appendChild(shell);

    let foundAllDevices = new Set();

    const renderDevice = (device)=>{
      shell.innerHTML = `<h3 style="margin-bottom:6px;">${device.label}</h3><p style="font-size:13px;">Click each glowing point to reveal the chip hidden there.</p>`;
      const positions = [ [15,30],[70,20],[40,60],[80,65],[25,80] ];
      let found = new Set();
      device.chips.forEach((chipName, i)=>{
        const pos = positions[i % positions.length];
        const hs = Utils.el('div','hotspot', '+');
        hs.style.left = pos[0]+'%';
        hs.style.top = pos[1]+'%';
        hs.tabIndex = 0;
        hs.setAttribute('role','button');
        hs.setAttribute('aria-label', `Reveal chip: ${chipName}`);
        Utils.attachTooltip(hs, chipName);
        const reveal = ()=>{
          if(found.has(i)) return;
          found.add(i);
          hs.style.opacity = '0.25';
          hs.style.animation = 'none';
          this.showFeedback(container,'info', `Found: ${chipName}`);
          if(found.size === device.chips.length){
            foundAllDevices.add(device.id);
            if(foundAllDevices.size === ContentDB.devices.length){
              this.badge.award('chip-hunter');
              this.enableComplete(container, 11);
            } else {
              this.showFeedback(container,'good', `All chips found in the ${device.label}! Try another device.`);
            }
          }
        };
        hs.addEventListener('click', reveal);
        hs.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); reveal(); } });
        shell.appendChild(hs);
      });
    };

    ContentDB.devices.forEach(d=>{
      const btn = Utils.el('button','chip-btn', d.label);
      btn.addEventListener('click', ()=>{
        Utils.qsa('.chip-btn', selector).forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        renderDevice(d);
      });
      selector.appendChild(btn);
    });
    Utils.qsa('.chip-btn', selector)[0].classList.add('active');
    renderDevice(ContentDB.devices[0]);
    this.addCompleteButton(container, 11, false);
  }

  /* ---------- LEVEL 12 : Future Materials ---------- */
  renderLevel12(container){
    const q = Utils.el('div','big-question', '🚀 Silicon transformed the world, but engineers are already exploring what comes next.');
    container.appendChild(q);

    const grid = Utils.el('div','grid grid-3');
    let viewed = new Set();
    ContentDB.future.forEach(f=>{
      const card = Utils.el('div','card future-card', `<div class="ftag">${f.tag}</div><h4>${f.name}</h4><p>${f.fact}</p>`);
      card.tabIndex = 0;
      card.addEventListener('click', ()=>{
        viewed.add(f.id);
        if(viewed.size === ContentDB.future.length){
          this.badge.award('future-visionary');
          this.enableComplete(container, 12);
        }
      });
      grid.appendChild(card);
    });
    container.appendChild(grid);
    this.addCompleteButton(container, 12, false);
  }

  /* ---------- Shared helpers ---------- */
  addCompleteButton(container, levelNum, initiallyEnabled){
    const btn = Utils.el('button','complete-btn', 'Mark Level Complete');
    btn.id = `completeBtn-${levelNum}`;
    btn.disabled = !initiallyEnabled && !this.state.isCompleted(levelNum);
    if(this.state.isCompleted(levelNum)) btn.textContent = '✅ Level Completed';
    btn.addEventListener('click', ()=>{
      if(btn.disabled) return;
      this.markDone(levelNum);
      btn.textContent = '✅ Level Completed';
      if(levelNum === 1) this.badge.award('observer');
      if(levelNum === 2) this.badge.award('material-scout');
    });
    container.appendChild(btn);
  }
  enableComplete(container, levelNum){
    const btn = Utils.qs(`#completeBtn-${levelNum}`, container);
    if(btn) btn.disabled = false;
  }
}

/* ============================================================
   7. APP CONTROLLER
   ============================================================ */
class App {
  constructor(){
    this.state = new GameState();
    this.toast = new ToastSystem();
    this.badgeSystem = new BadgeSystem(this.state, this.toast);
    this.curiosity = new CuriositySystem();
    this.tooltips = new TooltipManager();
    this.renderers = new LevelRenderers(this);
    this.stage = Utils.qs('#stage');
    this.levelListEl = Utils.qs('#levelList');

    this.buildNav();
    this.bindFooter();
    this.bindBadgePanel();
    this.goToLevel(this.state.data.currentLevel || 1, false);
    this.updateProgress();
  }

  buildNav(){
    this.levelListEl.innerHTML = '';
    LevelMeta.forEach(lvl=>{
      const li = Utils.el('li', 'level-item', `<span class="num">${lvl.n}</span><span>${lvl.title}</span>`);
      li.dataset.level = lvl.n;
      li.tabIndex = 0;
      li.setAttribute('role','button');
      const go = ()=>{
        if(!this.state.isUnlocked(lvl.n)){
          this.toast.show(`🔒 Complete Level ${lvl.n-1} first to unlock this.`);
          return;
        }
        this.goToLevel(lvl.n, true);
      };
      li.addEventListener('click', go);
      li.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(); } });
      this.levelListEl.appendChild(li);
    });
    this.refreshNav();
  }

  refreshNav(){
    Utils.qsa('.level-item', this.levelListEl).forEach(li=>{
      const n = Number(li.dataset.level);
      li.classList.toggle('active', n === this.currentLevel);
      li.classList.toggle('completed', this.state.isCompleted(n));
      li.classList.toggle('locked', !this.state.isUnlocked(n));
    });
  }

  goToLevel(n, scroll){
    this.currentLevel = n;
    this.state.data.currentLevel = n;
    this.state.save();
    this.renderCurrentLevel();
    this.refreshNav();
    this.updateFooterButtons();
    if(scroll) this.stage.scrollTo({top:0, behavior:'smooth'});
    const meta = LevelMeta.find(l=>l.n===n);
    if(meta) this.curiosity.setContextual(`Level ${n}: ${meta.title} — start exploring!`);
  }

  renderCurrentLevel(){
    this.stage.innerHTML = '';
    const meta = LevelMeta.find(l=>l.n===this.currentLevel);
    const section = Utils.el('section','level-section active');
    section.setAttribute('aria-label', meta.title);
    const head = Utils.el('div','level-head', `<span class="level-tag">${meta.tag} · Level ${meta.n} of 12</span><h2>${meta.title}</h2>`);
    section.appendChild(head);
    this.stage.appendChild(section);
    const fnName = `renderLevel${this.currentLevel}`;
    if(typeof this.renderers[fnName] === 'function'){
      this.renderers[fnName](section);
    }
  }

  bindFooter(){
    Utils.qs('#prevBtn').addEventListener('click', ()=>{
      if(this.currentLevel > 1) this.goToLevel(this.currentLevel - 1, true);
    });
    Utils.qs('#nextBtn').addEventListener('click', ()=>{
      const next = this.currentLevel + 1;
      if(next > 12) return;
      if(!this.state.isUnlocked(next)){
        this.toast.show('🔒 Complete the current level to continue.');
        return;
      }
      this.goToLevel(next, true);
    });
  }

  updateFooterButtons(){
    Utils.qs('#prevBtn').disabled = this.currentLevel <= 1;
    Utils.qs('#nextBtn').disabled = this.currentLevel >= 12;
  }

  bindBadgePanel(){
    const panel = Utils.qs('#badgesPanel');
    Utils.qs('#badgesBtn').addEventListener('click', ()=> panel.classList.remove('hidden'));
    Utils.qs('#closeBadges').addEventListener('click', ()=> panel.classList.add('hidden'));
    panel.addEventListener('click', e=>{ if(e.target === panel) panel.classList.add('hidden'); });
    document.addEventListener('keydown', e=>{ if(e.key==='Escape') panel.classList.add('hidden'); });
  }

  updateProgress(){
    const completed = this.state.data.completedLevels.length;
    const pct = Math.round((completed/12)*100);
    Utils.qs('#progressFill').style.width = pct + '%';
    Utils.qs('#progressLabel').textContent = `${completed} / 12 Levels`;
  }
}

/* ============================================================
   8. BOOTSTRAP
   ============================================================ */
document.addEventListener('DOMContentLoaded', ()=>{
  window.silliconApp = new App();
});
