Router.register('levels', async (app)=>{
  const l1Completed=Object.keys(GameState.progress.completed).filter(k=>k.startsWith('ls-01-')).length;
  const l2Completed=Object.keys(GameState.progress.completed).filter(k=>k.startsWith('ls-02-')).length;
  const l3Completed=Object.keys(GameState.progress.completed).filter(k=>k.startsWith('ls-03-')).length;
  const l2Unlocked=l1Completed>=5;
  const l3Unlocked=l2Completed>=5;

  const levels=[
    {id:1,title:'Everyday Escape',theme:'green',icon:'🌱',desc:'Short daily strategy missions',completed:l1Completed,total:12,unlocked:true},
    {id:2,title:'Smart Planner',theme:'blue',icon:'🧠',desc:'Planning ahead under uncertainty',completed:l2Completed,total:10,unlocked:l2Unlocked},
    {id:3,title:'Master Strategist',theme:'gold',icon:'👑',desc:'Systems thinking and trade-offs',completed:l3Completed,total:8,unlocked:l3Unlocked}
  ];

  const cards=levels.map(level=>{
    const pct=Math.round((level.completed/level.total)*100);
    const colors={green:'#4ade80',blue:'#60a5fa',gold:'#fbbf24'};
    return Render.el('div',{
      class:`glass card level-card ${!level.unlocked?'locked':''}`,
      'data-theme':level.theme,
      style:level.unlocked?`border-color:${colors[level.theme]}40;`:'opacity:0.6;'
    },[
      Render.el('span',{class:'level-icon'},level.icon),
      UI.badge(level.theme+' Theme'),
      Render.el('h2',{class:'neon-text'},level.title),
      Render.el('p',{class:'muted'},level.desc),
      UI.progressBar(level.completed,level.total,colors[level.theme]),
      Render.el('p',{class:'muted'},`${level.completed}/${level.total} missions (${pct}%)`),
      level.unlocked ? UI.button('Open Level '+level.id,'btn-primary pulse',()=>{AudioEngine.levelUp();Router.go('scenario-list',{level:level.id});}) : UI.button('🔒 Locked','btn-secondary',()=>{})
    ]);
  });

  app.append(Render.el('main',{class:'screen fade-up'},[
    Render.el('div',{class:'btn-row'},[UI.button('🏠 Home','btn-secondary',()=>Router.go('home'))]),
    Render.el('h1',{class:'neon-text',style:'text-align:center;margin:16px 0;'},'🎮 Choose Your Level'),
    Render.el('section',{class:'grid grid-3'},cards),
    Render.el('p',{class:'muted',style:'text-align:center;margin-top:16px;'},'⭐ Level 2 unlocks after 5 Level 1 wins. Level 3 unlocks after 5 Level 2 wins.')
  ]));

  if(!document.getElementById('particles-bg')) Particles.init();
});

Router.register('scenario-list', async (app,params)=>{
  const level=params.level||1;
  const scenarios=await ScenarioLoader.all(level);
  const colors={1:'#4ade80',2:'#60a5fa',3:'#fbbf24'};
  const icons={1:'🌱',2:'🧠',3:'👑'};

  app.append(Render.el('main',{class:'screen fade-up'},[
    Render.el('div',{class:'btn-row'},[
      UI.button('🏠 Home','btn-secondary',()=>Router.go('home')),
      UI.button('← Back','btn-secondary',()=>Router.go('levels'))
    ]),
    Render.el('h2',{style:'text-align:center;margin:16px 0;'},`${icons[level]} Level ${level} Missions`),
    Render.el('section',{class:'grid grid-3'},scenarios.map(s=>{
      const completed=GameState.progress.completed[s.id];
      return Render.el('div',{class:'glass card scenario-card',style:completed?'border-color:var(--green)40;':''},[
        UI.badge(`${s.meta.duration} · Difficulty ${s.meta.difficulty}`),
        Render.el('h3',{},s.meta.title),
        Render.el('p',{class:'muted'},s.intro),
        completed ? Render.el('div',{class:'btn-row'},[UI.badge('✅ Completed'),UI.starRating(3,false)]) : UI.button('▶ Start Mission','btn-primary',()=>{DecisionEngine.initScenario(s);Router.go('scenario-screen',{id:s.id});})
      ]);
    }))
  ]));
});
