Router.register('report', async (app)=>{
  const report=GameState.progress.lastReport;
  const traits=ScoringEngine.snapshot();
  const stars=ScoringEngine.stars();
  GameState.profile.stars += stars;
  StorageAPI.save();

  AudioEngine.missionComplete();
  Confetti.burst();

  const choiceList=report.choices?.map((c,i)=>Render.el('li',{class:'muted'},`${i+1}. ${c.choiceTitle}`))||[];

  app.append(Render.el('main',{class:'screen fade-up'},[
    Render.el('div',{class:'btn-row'},[
      UI.button('➡ Next Mission','btn-primary',()=>{
        AudioEngine.click();
        const level=report.scenarioId.startsWith('ls-01-')?1:report.scenarioId.startsWith('ls-02-')?2:3;
        ScenarioLoader.all(level).then(list=>{
          const idx=list.findIndex(s=>s.id===report.scenarioId);
          const next=list[idx+1];
          if(next){DecisionEngine.initScenario(next);Router.go('scenario-screen',{id:next.id});}
          else Router.go('levels');
        });
      }),
      UI.button('📋 Mission List','btn-secondary',()=>{
        AudioEngine.click();
        const level=report.scenarioId.startsWith('ls-01-')?1:report.scenarioId.startsWith('ls-02-')?2:3;
        Router.go('scenario-list',{level:level});
      })
    ]),
    Render.el('section',{class:'glass hero',style:'text-align:center;'},[
      UI.badge('🎉 Mission Complete!'),
      Render.el('h1',{class:'neon-text'},report.title),
      UI.starRating(stars),
      Render.el('p',{class:'subtitle'},report.endingText||'Mission complete.'),
      Render.el('p',{style:'color:var(--gold);font-size:1.2rem;'},`⭐ ${stars} Stars · XP +50 · Coins +25`)
    ]),
    Render.el('section',{class:'glass card'},[
      Render.el('h3',{},'🗺 Your Strategy Path'),
      Render.el('ol',{},choiceList)
    ]),
    Render.el('section',{class:'report-grid'},traits.map(t=>Render.el('div',{class:'glass card',style:'text-align:center;'},[
      Render.el('div',{style:'font-size:1.5rem;'},t.value>=60?'🔥':'📈'),
      Render.el('div',{class:'muted'},t.key.replaceAll('_',' ')),
      Render.el('div',{class:'stat',style:'color:'+(t.value>=60?'var(--green)':t.value>=45?'var(--gold)':'var(--text)')},t.value)
    ]))),
    Render.el('section',{class:'glass card'},[
      Render.el('h2',{},'💭 Reflection'),
      ...(report.reflection||[]).map(q=>Render.el('p',{class:'muted'},'• '+q))
    ])
  ]));
});
