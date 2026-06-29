Router.register('report', async (app)=>{
  const report=GameState.progress.lastReport;
  const traits=ScoringEngine.snapshot();
  const stars=ScoringEngine.stars();
  GameState.profile.stars += stars;
  StorageAPI.save();
  app.append(Render.el('main',{class:'screen fade-up'},[
    Render.el('div',{class:'btn-row'},[
      UI.button('Next Mission','btn-primary',()=>{
        const done=Object.keys(GameState.progress.completed).length;
        const nextIndex=Math.min(done,11);
        ScenarioLoader.all().then(list=>Router.go('scenario',{id:list[nextIndex].id}));
      }),
      UI.button('Mission List','btn-secondary',()=>Router.go('scenario-list'))
    ]),
    Render.el('section',{class:'glass hero'},[
      UI.badge('Mission Report'),
      Render.el('h1',{},report.title),
      Render.el('p',{class:'subtitle'},`Chosen strategy: ${report.choiceTitle}`),
      Render.el('p',{},`Stars earned: ${stars} · XP +25 · Coins +10`)
    ]),
    Render.el('section',{class:'report-grid'},traits.map(t=>Render.el('div',{class:'glass card'},[
      Render.el('div',{class:'muted'},t.key.replaceAll('_',' ')),
      Render.el('div',{class:'stat'},t.value)
    ]))),
    Render.el('section',{class:'glass card'},[
      Render.el('h2',{},'Reflection'),
      ...report.reflection.map(q=>Render.el('p',{class:'muted'},'• '+q))
    ])
  ]));
});