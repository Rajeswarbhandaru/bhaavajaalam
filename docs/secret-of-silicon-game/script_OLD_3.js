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
    { id:'iron', symbol:'Fe', name:'Iron', tag:'Metal · Conductor', img:'https://upload.wikimedia.org/wikipedia/commons/e/e2/Iron_element.jpg',
      conducts:95, cost:20, heat:70,
      personality:'"I am strong and everywhere, but I rust when nobody\'s watching."',
      strength:'Extremely abundant and structurally strong — the backbone of bridges and tools.',
      weakness:'Corrodes (rusts) over time and is heavier than metals typically chosen for circuits.',
      fact:'Iron conducts electricity but rusts easily and is heavier than most metals used in electronics.' },
    { id:'copper', symbol:'Cu', name:'Copper', tag:'Metal · Excellent Conductor', img:'https://upload.wikimedia.org/wikipedia/commons/f/f0/NatCopper.jpg',
      conducts:98, cost:55, heat:80,
      personality:'"I move electricity faster than almost anyone else in the room."',
      strength:'One of the best natural conductors on Earth — reliable and easy to shape into wires.',
      weakness:'Cannot be switched on and off, so it can never act as a digital switch inside a chip.',
      fact:'Copper is one of the best natural conductors — that is why it fills the wires inside every wall and device.' },
    { id:'gold', symbol:'Au', name:'Gold', tag:'Metal · Premium Conductor', img:'',
      conducts:92, cost:99, heat:75,
      personality:'"I never tarnish, but I am too precious to build a whole chip from."',
      strength:'Barely corrodes, making it perfect for tiny, long-lasting connector plating.',
      weakness:'Extremely expensive at scale — building an entire chip from gold would be wildly costly.',
      fact:'Gold barely corrodes, which is why it plates the tiny connectors inside your phone — but it is far too costly for entire chips.' },
    { id:'silver', symbol:'Ag', name:'Silver', tag:'Metal · Best Conductor', img:'',
      conducts:100, cost:85, heat:78,
      personality:'"I conduct better than anyone, but I tarnish and cost a fortune."',
      strength:'The single best natural electrical conductor known.',
      weakness:'Tarnishes with exposure and is too costly for mass production.',
      fact:'Silver conducts electricity better than any other element, yet it tarnishes and is very expensive at large scale.' },
    { id:'aluminium', symbol:'Al', name:'Aluminium', tag:'Metal · Lightweight Conductor', img:'',
      conducts:80, cost:25, heat:65,
      personality:'"I am light on my feet and easy to work with."',
      strength:'Lightweight and a decent conductor, popular for power lines and laptop casings.',
      weakness:'Conducts less efficiently than copper and heats up faster under heavy current.',
      fact:'Aluminium is light and conducts well, often used in power lines and laptop casings.' },
    { id:'plastic', symbol:'Pl', name:'Plastic', tag:'Polymer · Insulator', img:'',
      conducts:2, cost:10, heat:5,
      personality:'"I stop electricity cold — that is exactly my job."',
      strength:'Blocks electricity completely, keeping people safe from live wires.',
      weakness:'Cannot carry any current at all, so it is useless for building circuits.',
      fact:'Plastic blocks electricity completely, which is exactly why it wraps every wire to keep you safe.' },
    { id:'glass', symbol:'Gl', name:'Glass', tag:'Ceramic · Insulator', img:'',
      conducts:1, cost:15, heat:8,
      personality:'"Electricity cannot pass through me, but light can."',
      strength:'Transparent to light, enabling fibre-optic cables to carry data at incredible speed.',
      weakness:'Almost completely blocks electric current, so it cannot form an electrical circuit.',
      fact:'Glass stops electric current almost entirely, but it can carry light — the basis of fibre-optic cables.' },
    { id:'silicon', symbol:'Si', name:'Silicon', tag:'Metalloid · Semiconductor', img:'https://upload.wikimedia.org/wikipedia/commons/1/1e/Silicon_%2814_Si%29.jpg',
      conducts:35, cost:12, heat:40,
      personality:'"I can be a conductor or an insulator — you decide, and that makes me special."',
      strength:'Its conductivity can be precisely controlled through doping — the key to building transistors.',
      weakness:'On its own, conducts far worse than metals like copper or silver.',
      fact:'Silicon can be switched between conducting and blocking electricity — the single property that built the digital age.' },
    { id:'germanium', symbol:'Ge', name:'Germanium', tag:'Metalloid · Semiconductor', img:'',
      conducts:38, cost:60, heat:55,
      personality:'"I was the first semiconductor star, before silicon stole the spotlight."',
      strength:'Was used in the very first transistors ever built, in 1947.',
      weakness:'Rarer and less heat-stable than silicon, making it costlier at large scale.',
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
  { n:12, title:'Beyond Silicon', tag:'Horizon' },
  { n:13, title:'Transistor Power', tag:'Switch' },
  { n:14, title:'Logic Gate Lab', tag:'Logic' },
  { n:15, title:'Integrated Circuits', tag:'ICs' },
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
  const title = Utils.el('div','big-question', '📱 Today's Technology');
  container.appendChild(title);

  const intro = Utils.el('div','reveal-panel show', `
    <h4>Tap each card</h4>
    <p>These machines are made from many materials. Open the cards to see the mix, then solve the mystery of the hidden brain.</p>
  `);
  container.appendChild(intro);

  const techMaterials = {
    phone: ['Glass', 'Aluminum', 'Plastic', 'Copper', 'Gold', 'Silicon'],
    laptop: ['Aluminum', 'Copper', 'Plastic', 'Battery parts', 'Gold', 'Silicon'],
    desktop: ['Steel', 'Aluminum', 'Copper', 'Glass', 'Gold', 'Silicon'],
    robot: ['Aluminum', 'Steel', 'Plastic', 'Sensors', 'Copper', 'Silicon'],
    satellite: ['Aluminum alloys', 'Titanium', 'Composites', 'Copper', 'Gold', 'Silicon'],
    car: ['Steel', 'Aluminum', 'Plastic', 'Copper', 'Glass', 'Silicon'],
    medical: ['Plastic', 'Glass', 'Metals', 'Sensors', 'Copper', 'Silicon'],
    console: ['Plastic', 'Copper', 'Aluminum', 'Memory parts', 'Gold', 'Silicon']
  };

  const techGrid = Utils.el('div','grid grid-4');
  let opened = new Set();

  ContentDB.tech.forEach(t=>{
    const tile = Utils.el('div','card tile material-reveal-card', `
      <span class="pulse-ring"></span>
      <div class="tech-icon">${t.icon}</div>
      <div class="tech-name">${t.label}</div>
      <div class="hidden-materials" style="display:none;"></div>
    `);

    tile.tabIndex = 0;
    tile.setAttribute('role','button');
    tile.setAttribute('aria-label', `Open ${t.label}`);
    Utils.attachTooltip(tile, `Tap to explore the materials inside ${t.label}`);

    const reveal = ()=>{
      if(tile.classList.contains('revealed')) return;
      tile.classList.add('revealed');
      opened.add(t.id);

      const matBox = Utils.qs('.hidden-materials', tile);
      const items = (techMaterials[t.id] || []).map(m => `<span class="material-chip">${m}</span>`).join('');
      matBox.innerHTML = `
        <div class="mini-note">Common materials inside:</div>
        <div class="material-chip-wrap">${items}</div>
      `;
      matBox.style.display = 'block';

      if(opened.size === ContentDB.tech.length){
        questionPanel.classList.add('show');
        optionsTitle.style.display = 'block';
        optionGrid.style.display = 'grid';
      }
    };

    tile.addEventListener('click', ()=>{ this.sound?.tap?.(); reveal(); });
    tile.addEventListener('keydown', e=>{
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        reveal();
      }
    });

    techGrid.appendChild(tile);
  });

  container.appendChild(techGrid);

  const questionPanel = Utils.el('div','reveal-panel question-panel', `
    <h4>Now think like a tech detective</h4>
    <p>All these devices use many materials. Which one is the hidden brain inside the tiny chips that help them think, calculate, and control?</p>
  `);
  questionPanel.classList.add('question-panel-hidden');
  container.appendChild(questionPanel);

  const optionsTitle = Utils.el('div','big-question', '🧠 Which material is the hidden brain of modern chips?');
  optionsTitle.style.display = 'none';
  container.appendChild(optionsTitle);

  const optionGrid = Utils.el('div','grid grid-5 option-grid');
  optionGrid.style.display = 'none';

  const options = [
    { id:'gold', label:'Gold', icon:'🟡', correct:false },
    { id:'plastic', label:'Plastic', icon:'🧴', correct:false },
    { id:'silicon', label:'Silicon', icon:'✨', correct:true },
    { id:'glass', label:'Glass', icon:'🪟', correct:false },
    { id:'copper', label:'Copper', icon:'🟠', correct:false }
  ];

  let answered = false;

  const siliconReveal = Utils.el('div','silicon-celebration', `
    <div class="silicon-core" aria-hidden="true">
      <div class="silicon-glow"></div>
      <div class="silicon-chip">Si</div>
      <div class="orbit orbit-1"></div>
      <div class="orbit orbit-2"></div>
    </div>
    <div class="reveal-panel show">
      <h4>Silicon is the chip hero</h4>
      <p>Silicon is the most important semiconductor material inside the chips that power smart devices. It helps process information, sense signals, and control actions.</p>
    </div>
  `);
  siliconReveal.style.display = 'none';
  container.appendChild(siliconReveal);

  options.forEach(opt=>{
    const card = Utils.el('div','card tile option-card', `
      <div class="option-icon">${opt.icon}</div>
      <div class="option-label">${opt.label}</div>
    `);

    card.tabIndex = 0;
    card.setAttribute('role','button');
    card.setAttribute('aria-label', `Choose ${opt.label}`);

    const choose = ()=>{
      if(answered) return;
      if(opt.correct){
        answered = true;
        card.classList.add('revealed', 'correct');
        siliconReveal.style.display = 'grid';
        this.sound?.correct?.();
        this.sound?.siliconMagic?.();
        this.showFeedback(container, 'good', '🎉 Yes! Silicon is the hidden brain inside modern chips.');
        this.enableComplete(container, 1);
      }else{
        card.classList.add('wrong');
        this.sound?.wrong?.();
        this.toast.show(`❌ Not ${opt.label}. Try again!`);
      }
    };

    card.addEventListener('click', choose);
    card.addEventListener('keydown', e=>{
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        choose();
      }
    });

    optionGrid.appendChild(card);
  });

  container.appendChild(optionGrid);
  this.addCompleteButton(container, 1, false);
}
/* ---------- LEVEL 2 : Meet the Materials ---------- */
  renderLevel2(container){
    const q = Utils.el('div','big-question', '🧪 Every material has its own personality. Click a card to flip it and meet the material — then predict: can it carry electricity?');
    container.appendChild(q);

    const progress = Utils.el('div','feedback show info', `Materials met: <strong id="metCount">0</strong> / ${ContentDB.materials.length}`);
    container.appendChild(progress);

    const grid = Utils.el('div','grid grid-3');
    let opened = new Set();
    const metCount = ()=> Utils.qs('#metCount', container);

    ContentDB.materials.forEach(m=>{
      const card = Utils.el('div','card material-card',`
        <div class="mhead"><div class="msym">${m.symbol}</div><div><h4>${m.name}</h4><div class="mtag">${m.tag}</div></div></div>${m.img ? `<div style="margin:10px 0 2px;"><img src="${m.img}" alt="${m.name}" style="width:100%;height:120px;object-fit:cover;border-radius:12px;border:1px solid var(--border);"></div>` : ''}
        <p style="font-style:italic;font-size:12.5px;margin:2px 0 0;color:var(--accent-1);">${m.personality || ''}</p>
        <div class="mbars">
          <div class="mbar-row">Conducts electricity <div class="mbar-track"><div class="mbar-fill" style="width:${m.conducts}%"></div></div></div>
        </div>
        <div class="mfact">
          <p style="margin:0 0 6px;"><strong style="color:var(--accent-3);">Strength:</strong> ${m.strength || m.fact}</p>
          <p style="margin:0;"><strong style="color:var(--accent-err);">Weakness:</strong> ${m.weakness || ''}</p>
        </div>
      `);
      card.tabIndex = 0;
      card.setAttribute('role','button');
      card.setAttribute('aria-label', `Learn about ${m.name}`);
      Utils.attachTooltip(card, `Click to meet ${m.name}`);
      const toggle = ()=>{
        card.classList.toggle('open');
        if(!opened.has(m.id)){
          opened.add(m.id);
          metCount().textContent = opened.size;
        }
        if(opened.size === ContentDB.materials.length){
          this.showFeedback(container, 'good', '🧠 You have met all nine materials. Notice how silicon and germanium sit right in the middle — not great conductors, not full insulators. Keep that in mind for the next experiment!');
          this.enableComplete(container, 2);
        }
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
    const q = Utils.el('div','big-question', '⚡ Drag a material into the circuit slot, make your prediction, then test it. Will the bulb light up, stay dark, or glow dimly?');
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
      <div id="predictRow" style="display:none;margin-top:16px;text-align:center;">
        <p style="margin-bottom:10px;font-size:13px;color:var(--text-1);">🔮 Before testing — predict what will happen:</p>
        <div class="zoom-controls">
          <button class="chip-btn" data-guess="pass">Bulb Lights Up</button>
          <button class="chip-btn" data-guess="fail">Stays Dark</button>
          <button class="chip-btn" data-guess="partial">Glows Dimly</button>
        </div>
      </div>
    `);

    zone.appendChild(pool);
    zone.appendChild(circuitWrap);
    container.appendChild(zone);

    const slot = ()=>Utils.qs('#circuitSlot', container);
    const bulb = ()=>Utils.qs('#circuitBulb', container);
    const wireL = ()=>Utils.qs('#wireLeft', container);
    const wireR = ()=>Utils.qs('#wireRight', container);
    const predictRow = ()=>Utils.qs('#predictRow', container);
    let testedSet = new Set();
    let pendingMat = null;

    const runTest = (mat, guess)=>{
      const behaviour = ContentDB.circuitBehaviour[mat.id];
      const s = slot();
      s.textContent = mat.symbol + ' ' + mat.name;
      s.classList.add('filled');
      s.classList.remove('result-pass','result-fail','result-partial');
      bulb().classList.remove('lit','dim');
      wireL().classList.remove('active'); wireR().classList.remove('active');

      const correct = guess === behaviour;
      let msg = '';
      if(behaviour === 'pass'){
        s.classList.add('result-pass'); bulb().classList.add('lit');
        wireL().classList.add('active'); wireR().classList.add('active');
        msg = `${mat.name} let electricity flow freely — a true conductor!`;
      } else if(behaviour === 'fail'){
        s.classList.add('result-fail');
        msg = `${mat.name} completely blocked the current — that makes it an insulator.`;
      } else {
        s.classList.add('result-partial'); bulb().classList.add('dim');
        wireL().classList.add('active'); wireR().classList.add('active');
        msg = `${mat.name} let a little current pass — it behaves in between a conductor and an insulator. Interesting, right?`;
      }
      const prefix = correct ? '✅ Your prediction was right! ' : '🤔 Not what you guessed — ';
      this.showFeedback(container, correct ? 'good' : 'info', prefix + msg);

      testedSet.add(mat.id);
      predictRow().style.display = 'none';
      if(testedSet.size >= 6){
        this.badge.award('circuit-tester');
        this.enableComplete(container, 3);
      }
    };

    Utils.qsa('#predictRow .chip-btn', container).forEach(btn=>{
      btn.addEventListener('click', ()=>{
        if(!pendingMat) return;
        Utils.qsa('#predictRow .chip-btn', container).forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        runTest(pendingMat, btn.dataset.guess);
        pendingMat = null;
      });
    });

    const s = slot();
    s.addEventListener('dragover', e=>{ e.preventDefault(); s.classList.add('dragover'); });
    s.addEventListener('dragleave', ()=> s.classList.remove('dragover'));
    s.addEventListener('drop', e=>{
      e.preventDefault();
      s.classList.remove('dragover');
      const id = e.dataTransfer.getData('text/plain');
      const mat = ContentDB.materials.find(m=>m.id===id);
      if(!mat) return;
      pendingMat = mat;
      s.textContent = `${mat.symbol} ${mat.name} — ready to test`;
      s.classList.add('filled');
      predictRow().style.display = 'block';
    });

    this.addCompleteButton(container, 3, false);
  }

/* ---------- LEVEL 4 : Conductors / Insulators / Semiconductors sorting ---------- */
  renderLevel4(container){
    const q = Utils.el('div','big-question', '🗂️ Drag each material into the column where you think it belongs. Use what you observed in the circuit experiment!');
    container.appendChild(q);

    const progress = Utils.el('div','feedback show info', `Correctly sorted: <strong id="sortedCount">0</strong> / ${ContentDB.materials.length}`);
    container.appendChild(progress);
    const sortedCountEl = ()=>Utils.qs('#sortedCount', container);

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
          chip.style.borderColor = 'var(--accent-3)';
          this.showFeedback(container,'good', `Correct! That belongs with ${cat.label.toLowerCase()}s.`);
        } else {
          chip.style.borderColor = 'var(--accent-err)';
          this.showFeedback(container,'bad', `Not quite — think back to the circuit test: did the bulb light up fully, dimly, or not at all?`);
        }
        this.checkSortComplete(container, sortedCountEl);
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

  checkSortComplete(container, sortedCountEl){
    let correctCount = 0;
    let allPlaced = true;
    ContentDB.sortCategories.forEach(cat=>{
      const col = Utils.qs(`.sort-column[data-cat="${cat.id}"]`, container);
      cat.items.forEach(id=>{
        const chip = Utils.qs(`[data-id="${id}"]`, container);
        if(!chip || chip.parentElement !== col) allPlaced = false;
        else correctCount++;
      });
    });
    if(sortedCountEl && sortedCountEl()) sortedCountEl().textContent = correctCount;
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
        <select id="elementSelect" class="element-select">
          <option value="hydrogen">Hydrogen (H)</option>
          <option value="carbon">Carbon (C)</option>
          <option value="boron">Boron (B)</option>
          <option value="silicon" selected>Silicon (Si)</option>
          <option value="phosphorus">Phosphorus (P)</option>
          <option value="germanium">Germanium (Ge)</option>
          <option value="oxygen">Oxygen (O)</option>
          <option value="sulfur">Sulfur (S)</option>
          <option value="aluminum">Aluminium (Al)</option>
        </select>
      </div>
      <p id="valenceInfo" class="atom-info"></p>
      <div id="atomHint" class="atom-hint"></div>
    `);
    stage.appendChild(view);
    stage.appendChild(controls);
    container.appendChild(stage);


    const drawAtom = (key)=>{
      const el = ContentDB.atomData.elements[key];
      const info = Utils.qs('#valenceInfo', container);
      const hint = Utils.qs('#atomHint', container);
      view.innerHTML = `<div class="nucleus">${el.symbol}<br>+${el.protons}</div>`;
      const baseRadius = 40;
      el.shells.forEach((count, shellIdx)=>{
        const radius = baseRadius + shellIdx * 48;
        const shellDiv = Utils.el('div','shell');
        shellDiv.style.width = radius*2+'px';
        shellDiv.style.height = radius*2+'px';
        shellDiv.style.animation = `pulseShell ${4+shellIdx}s ease-in-out infinite`;
        view.appendChild(shellDiv);
        const isOuter = shellIdx === el.shells.length -1;
        for(let i=0;i<count;i++){
          const angle = (2*Math.PI/count) * i;
          const ex = radius * Math.cos(angle);
          const ey = radius * Math.sin(angle);
          const eDiv = Utils.el('div', `electron${isOuter?' valence':''}`);
          eDiv.style.transform = `translate(${ex}px, ${ey}px)`;
          eDiv.style.animation = `orbit${shellIdx} ${8+shellIdx*2}s linear infinite`;
          view.appendChild(eDiv);
        }
        if(!document.getElementById(`orbit-style-${shellIdx}`)){
          const styleTag = document.createElement('style');
          styleTag.id = `orbit-style-${shellIdx}`;
          styleTag.textContent = `@keyframes orbit${shellIdx}{from{transform:rotate(0deg) translateX(${radius}px) rotate(0deg);}to{transform:rotate(360deg) translateX(${radius}px) rotate(-360deg);}}`;
          document.head.appendChild(styleTag);
        }
      });
      const outerCount = el.shells[el.shells.length-1];
      info.textContent = `${el.symbol} has ${outerCount} valence electron${outerCount===1?'':'s'} in its outer shell.`;
      if(key==='silicon') hint.textContent = 'Silicon is special because four outer electrons let it connect in a crystal lattice.';
      else if(key==='boron') hint.textContent = 'Boron has only 3 outer electrons, so it creates a hole.';
      else if(key==='phosphorus') hint.textContent = 'Phosphorus brings one extra electron, making N-Type silicon.';
      else hint.textContent = 'Try another atom and notice how the outer shell changes.';
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
    const q = Utils.el('div','big-question', '🔍 Choose a device, then uncover the chips hiding inside it. Each one has a job — thinking, sensing, controlling, connecting, or saving power.');
    container.appendChild(q);

    const intro = Utils.el('div','reveal-panel show', `
      <h4>How to read this level</h4>
      <p>First choose a device. Then click the glowing circles placed on a clear silhouette of that device. Each circle reveals one chip and explains its role.</p>
    `);
    container.appendChild(intro);

    const selector = Utils.el('div','device-selector');
    const shell = Utils.el('div','device-shell');
    container.appendChild(selector);
    container.appendChild(shell);

    let foundAllDevices = new Set();

    const deviceTemplates = {
      phone:{ title:'Smartphone', subtitle:'A tiny supercomputer in your hand', bodyClass:'phone', icon:'📱', chips:['Processor (SoC)','Memory Chip','Camera Sensor','Power Management Chip','Modem Chip','Touch Controller','Audio Codec'] },
      laptop:{ title:'Laptop', subtitle:'A work machine that balances speed and battery life', bodyClass:'laptop', icon:'💻', chips:['CPU','GPU','RAM Modules','SSD Controller','Wi-Fi Chip','USB Controller','Display Controller'] },
      robot:{ title:'Robot', subtitle:'A machine that senses, thinks, and acts', bodyClass:'robot', icon:'🤖', chips:['Motor Controller Chip','Sensor Processor','Microcontroller','Battery Management IC','IMU Chip','Voice Processor'] },
      drone:{ title:'Drone', subtitle:'A flying device that must think quickly and stay light', bodyClass:'drone', icon:'🚁', chips:['Flight Controller Chip','GPS Chip','Camera Processor','Radio Transceiver','Stabilization Chip'] },
      car:{ title:'Electric Car', subtitle:'A moving computer with motors, sensors, and safety systems', bodyClass:'car', icon:'🚗', chips:['Battery Management IC','Motor Inverter Chip','Infotainment SoC','Sensor Fusion Chip','ADAS Processor','Charging Controller'] }
    };

    const positions = {
      phone:[[24,20],[54,14],[74,30],[20,54],[56,56],[34,78],[76,76]],
      laptop:[[18,22],[40,16],[66,18],[22,52],[44,56],[66,56],[50,82]],
      robot:[[26,22],[52,16],[74,24],[28,52],[54,54],[78,56]],
      drone:[[22,24],[48,16],[72,24],[26,54],[58,54]],
      car:[[16,24],[40,16],[66,18],[24,54],[48,56],[72,56]]
    };

    const drawDeviceSilhouette = (device)=>{
      const t = deviceTemplates[device.id];
      const chips = t.chips;

      shell.innerHTML = `
        <div class="device-stage">
          <div class="device-silhouette ${t.bodyClass}">
            <div class="device-banner">${t.icon} ${t.title}</div>
            <div class="silhouette-icon">${t.icon}</div>
            <div class="silhouette-label">${t.title}</div>
          </div>
          <div class="device-legend">
            <div class="device-name">${t.title}</div>
            <div class="device-subtitle">${t.subtitle}</div>
            <div style="font-size:12px;color:var(--text-2);margin:12px 0 8px;">Discovered chips: <strong id="chipCount">0</strong> / ${chips.length}</div>
            <div class="chip-pill-list">${chips.map(c=>`<span class="chip-pill">${c}</span>`).join('')}</div>
          </div>
        </div>
      `;

      let found = new Set();
      let revealCount = 0;
      const map = positions[device.id];
      const centralNote = Utils.el('div','device-note', 'Tap the glowing spots on the device body to reveal the hidden chips.');
      shell.querySelector('.device-stage').prepend(centralNote);

      chips.forEach((chipName, i)=>{
        const pos = map[i % map.length];
        const hs = Utils.el('button','hotspot', '+');
        hs.style.left = pos[0] + '%';
        hs.style.top = pos[1] + '%';
        hs.type = 'button';
        hs.setAttribute('aria-label', `Reveal chip: ${chipName}`);
        Utils.attachTooltip(hs, chipName);

        const reveal = ()=>{
          if(found.has(i)) return;
          found.add(i);
          revealCount++;
          hs.classList.add('revealed');
          const countNode = Utils.qs('#chipCount', shell);
          if(countNode) countNode.textContent = revealCount;
          this.showFeedback(container,'info', `${chipName} found. It has a specific job inside this device.`);

          if(found.size === chips.length){
            foundAllDevices.add(device.id);
            if(foundAllDevices.size === Object.keys(deviceTemplates).length){
              this.badge.award('chip-hunter');
              this.showFeedback(container,'good', '🎉 You found chips inside every device. Real products are bundles of chips, each doing a tiny but important job.');
              this.enableComplete(container, 11);
            } else {
              this.showFeedback(container,'good', `Great! Every chip inside the ${t.title} was found. Try another device and compare the jobs.`);
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
        drawDeviceSilhouette(d);
      });
      selector.appendChild(btn);
    });

    const firstBtn = Utils.qs('.chip-btn', selector);
    if(firstBtn) firstBtn.classList.add('active');
    drawDeviceSilhouette(ContentDB.devices[0]);
    this.addCompleteButton(container, 11, false);
  }
  /* ---------- LEVEL 12 : Future Materials ---------- */

  renderLevel12(container){
    const q = Utils.el('div','big-question', '🚀 Silicon changed the world, but engineers are already exploring the next wave of computing ideas.');
    container.appendChild(q);

    const intro = Utils.el('div','reveal-panel show', `
      <h4>What comes next?</h4>
      <p>Some future technologies are not “replacements” for silicon — they are tools that help silicon do more, use less energy, or work in tougher places.</p>
    `);
    container.appendChild(intro);

    const grid = Utils.el('div','grid grid-3');
    let viewed = new Set();

    ContentDB.future.forEach(f=>{
      const card = Utils.el('div','card future-card', `
        <div class="ftag">${f.tag}</div>
        <h4>${f.name}</h4>
        <p>${f.fact}</p>
      `);
      card.tabIndex = 0;
      card.setAttribute('role','button');
      card.addEventListener('click', ()=>{
        card.classList.add('seen');
        viewed.add(f.id);
        this.showFeedback(container,'info', `${f.name}: ${f.fact}`);
        if(viewed.size === ContentDB.future.length){
          this.badge.award('future-visionary');
          this.enableComplete(container, 12);
          this.showFeedback(container,'good','🌟 You explored the next ideas in computing. Real progress often comes from combining new materials, better packaging, and smarter chip design.');
        }
      });
      grid.appendChild(card);
    });

    container.appendChild(grid);
    this.addCompleteButton(container, 12, false);
  }


  /* ---------- LEVEL 13 : Transistor Power ---------- */
  renderLevel13(container){
    const q = Utils.el('div','big-question', '⚡ A transistor is like a tiny electronic gate. Open it the right way, and current can flow or stop.');
    container.appendChild(q);

    const intro = Utils.el('div','reveal-panel show', `
      <h4>Why transistors matter</h4>
      <p>Transistors are the workhorses inside chips. They can act like switches, and that is how chips make decisions, store information, and control power.</p>
    `);
    container.appendChild(intro);

    const board = Utils.el('div','transistor-board');
    const status = Utils.el('div','feedback show info', `Gate closed. Try turning it on.`);
    const controlRow = Utils.el('div','transistor-controls');
    const switchBtn = Utils.el('button','chip-btn', 'Toggle Gate');
    const modeBtn = Utils.el('button','chip-btn', 'Switch Role: Switch');
    controlRow.appendChild(switchBtn);
    controlRow.appendChild(modeBtn);

    const lamp = Utils.el('div','transistor-lamp');
    const wireLeft = Utils.el('div','wire wire-left');
    const wireRight = Utils.el('div','wire wire-right');
    const transistor = Utils.el('div','transistor-body', `
      <div class="transistor-label">Transistor</div>
      <div class="transistor-legs"><span></span><span></span><span></span></div>
    `);
    board.appendChild(wireLeft);
    board.appendChild(transistor);
    board.appendChild(wireRight);
    board.appendChild(lamp);

    let on = false;
    let amplifierMode = false;
    let completed = false;

    const updateUI = ()=>{
      transistor.classList.toggle('on', on);
      lamp.classList.toggle('lit', on);
      lamp.textContent = on ? (amplifierMode ? 'A' : 'ON') : 'OFF';
      status.textContent = on
        ? (amplifierMode ? 'A small input is making a bigger output. That is amplification.' : 'Gate open. Current flows through the transistor.')
        : 'Gate closed. Try turning it on.';
      modeBtn.textContent = amplifierMode ? 'Switch Role: Amplifier' : 'Switch Role: Switch';
      if(on && amplifierMode && !completed){
        completed = true;
        this.badge.award('switch-master');
        this.showFeedback(container,'good', '🎉 You used a transistor like a switch and like an amplifier. That is one of the most important ideas in electronics.');
        this.enableComplete(container, 13);
      }
    };

    switchBtn.addEventListener('click', ()=>{
      on = !on;
      this.showFeedback(container, on ? 'good' : 'info', on ? 'Current is now flowing.' : 'Current stopped.');
      updateUI();
    });

    modeBtn.addEventListener('click', ()=>{
      amplifierMode = !amplifierMode;
      this.showFeedback(container, amplifierMode ? 'info' : 'info', amplifierMode ? 'Now try to use the transistor as an amplifier.' : 'Now use the transistor as a switch again.');
      updateUI();
    });

    container.appendChild(controlRow);
    container.appendChild(board);
    container.appendChild(status);
    this.addCompleteButton(container, 13, false);
    updateUI();
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


const ExtraStyleBlock = `
.device-stage{display:flex;gap:16px;align-items:stretch;flex-wrap:wrap;width:100%;}
.device-silhouette{position:relative;flex:1;min-width:300px;min-height:360px;border-radius:28px;border:1px solid var(--border);overflow:hidden;box-shadow:var(--shadow-soft);display:flex;align-items:center;justify-content:center;}
.device-silhouette::before{content:'';position:absolute;inset:14px;border-radius:22px;border:1px dashed rgba(255,255,255,0.08);}
.device-silhouette::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 20%, rgba(255,255,255,0.08), transparent 40%);pointer-events:none;}
.silhouette-icon{font-size:68px;filter:drop-shadow(0 0 16px rgba(255,255,255,0.12));animation:iconFloat 3.8s ease-in-out infinite;}
.silhouette-label{position:absolute;bottom:18px;left:18px;font-size:15px;font-weight:700;color:var(--text-0);}
.device-silhouette.phone{border-radius:38px;aspect-ratio:0.58/1;max-width:210px;background:linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));}
.device-silhouette.phone .silhouette-icon{font-size:58px;}
.device-silhouette.laptop{border-radius:18px;aspect-ratio:1.35/1;background:linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));}
.device-silhouette.laptop::before{inset:22px 20px 70px 20px;border-radius:14px;}
.device-silhouette.laptop::after{content:'';position:absolute;bottom:18px;left:50%;transform:translateX(-50%);width:78%;height:18px;border-radius:10px;background:rgba(255,255,255,0.08);}
.device-silhouette.robot{border-radius:28px 28px 36px 36px;background:linear-gradient(180deg, rgba(167,139,250,0.08), rgba(255,255,255,0.02));}
.device-silhouette.robot::before{inset:18px 24px 24px 24px;border-radius:22px;}
.device-silhouette.drone{border-radius:22px;background:linear-gradient(180deg, rgba(56,189,248,0.07), rgba(255,255,255,0.02));}
.device-silhouette.drone::before{inset:26px 30px 26px 30px;border-radius:18px;}
.device-silhouette.car{border-radius:22px 22px 40px 40px;background:linear-gradient(180deg, rgba(52,211,153,0.07), rgba(255,255,255,0.02));}
.device-silhouette.car::before{inset:24px 18px 70px 18px;border-radius:24px 24px 16px 16px;}
.device-silhouette.car::after{content:'';position:absolute;bottom:16px;left:18%;width:64%;height:20px;border-radius:16px;background:rgba(255,255,255,0.08);}
.device-legend{min-width:260px;flex:1;background:var(--glass);border:1px solid var(--border);border-radius:22px;padding:16px;backdrop-filter:blur(12px);}
.chip-pill-list{display:flex;flex-wrap:wrap;gap:8px;max-height:250px;overflow:auto;padding-right:4px;}
.chip-pill{padding:6px 10px;border-radius:999px;background:rgba(255,255,255,0.05);border:1px solid var(--border);font-size:11px;color:var(--text-2);transition:all .2s var(--ease);}
.chip-pill:hover{transform:translateY(-1px);border-color:var(--accent-1);color:var(--text-0);}
.hotspot{position:absolute;z-index:5;width:34px;height:34px;border-radius:50%;border:2px solid var(--accent-1);background:rgba(110,231,255,0.18);color:#fff;box-shadow:0 0 16px rgba(110,231,255,0.25);display:flex;align-items:center;justify-content:center;font-weight:800;transition:transform .2s var(--ease), opacity .2s var(--ease), background .2s var(--ease), border-color .2s var(--ease);animation:hotspotPulse 2.2s ease-in-out infinite;}
.hotspot:hover{transform:scale(1.08);}
.hotspot.revealed{opacity:.25;border-color:var(--accent-3);animation:none;}
@keyframes iconFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes hotspotPulse{0%,100%{box-shadow:0 0 0 0 rgba(110,231,255,0.25);}50%{box-shadow:0 0 0 10px rgba(110,231,255,0);}}
`;
class App {
  constructor(){
    this.state = new GameState();
    this.toast = new ToastSystem();
    this.badgeSystem = new BadgeSystem(this.state, this.toast);
    this.curiosity = new CuriositySystem();
    this.tooltips = new TooltipManager();
    
    this.stage = Utils.qs('#stage');
    this.levelListEl = Utils.qs('#levelList');

    this.buildNav();
    this.bindFooter();
    this.bindBadgePanel();
    this.goToLevel(this.state.data.currentLevel || 1, false);
    this.refreshNav();
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
    const head = Utils.el('div','level-head', `<span class="level-tag">${meta.tag} · Level ${meta.n} of ${LevelMeta.length}</span><h2>${meta.title}</h2>`);
    section.appendChild(head);
    this.stage.appendChild(section);
    const fnName = `renderLevel${this.currentLevel}`;
    if(typeof this.renderers[fnName] === 'function'){
      this.renderers[fnName](section);
    }
  }

  bindFooter(){
    Utils.qs('#prevBtn').addEventListener('click', ()=>{
      this.sound?.tap?.();
      if(this.currentLevel > 1) this.goToLevel(this.currentLevel - 1, true);
    });
    Utils.qs('#nextBtn').addEventListener('click', ()=>{
      this.sound?.tap?.();
      const next = this.currentLevel + 1;
      if(next > LevelMeta.length) return;
      if(!this.state.isUnlocked(next)){
        this.toast.show('🔒 Complete the current level to continue.');
        this.sound?.wrong?.();
        return;
      }
      this.goToLevel(next, true);
    });
  }

  updateFooterButtons(){
    Utils.qs('#prevBtn').disabled = this.currentLevel <= 1;
    Utils.qs('#nextBtn').disabled = this.currentLevel >= LevelMeta.length;
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
    const pct = Math.round((completed/LevelMeta.length)*100);
    Utils.qs('#progressFill').style.width = pct + '%';
    Utils.qs('#progressLabel').textContent = `${completed} / ${LevelMeta.length} Levels`;
  }
}

/* ============================================================
   8. BOOTSTRAP
   ============================================================ */
document.addEventListener('DOMContentLoaded', ()=>{
  if(!document.getElementById('extra-style-block')){
    const s = document.createElement('style');
    s.id = 'extra-style-block';
    s.textContent = ExtraStyleBlock;
    document.head.appendChild(s);
  }
  window.silliconApp = new App();
window.game = window.silliconApp;
});
