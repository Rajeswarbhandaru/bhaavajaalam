Router.register('levels', async (app)=>{
  const levels=[
    {id:1,title:'Everyday Escape',theme:'Green',desc:'Short daily strategy missions',unlocked:true},
    {id:2,title:'Smart Planner',theme:'Blue',desc:'Planning ahead under uncertainty',unlocked:false},
    {id:3,title:'Master Strategist',theme:'Gold',desc:'Systems thinking and trade-offs',unlocked:false}
  ];
  const scenarios=await ScenarioLoader.all();
  const cards=levels.map(level=>Render.el('div',{class:'glass card level-card'},[
    UI.badge(level.theme+' Theme'),
    Render.el('h2',{},level.title),
    Render.el('p',{class:'muted'},level.desc),
    level.unlocked ? UI.button(level.id===1 ? 'Open Level 1' : 'Locked for v1','btn-primary',()=> level.id===1 && Router.go('scenario-list')) : UI.button('Locked','btn-secondary',()=>{})
  ]));
  app.append(Render.el('main',{class:'screen fade-up'},[
    Render.el('div',{class:'btn-row'},[UI.button('Home','btn-secondary',()=>Router.go('home'))]),
    Render.el('section',{class:'grid grid-3'},cards),
    Render.el('p',{class:'muted'},`${scenarios.length} Level 1 missions are bundled in this starter pack.`)
  ]));
});
Router.register('scenario-list', async (app)=>{
  const scenarios=await ScenarioLoader.all();
  app.append(Render.el('main',{class:'screen fade-up'},[
    Render.el('div',{class:'btn-row'},[UI.button('Back','btn-secondary',()=>Router.go('levels'))]),
    Render.el('section',{class:'grid grid-3'},scenarios.map(s=>Render.el('div',{class:'glass card'},[
      UI.badge(`${s.meta.duration} · Difficulty ${s.meta.difficulty}`),
      Render.el('h3',{},s.meta.title),
      Render.el('p',{class:'muted'},s.intro),
      UI.button('Start Mission','btn-primary',()=>Router.go('scenario',{id:s.id}))
    ])))
  ]));
});