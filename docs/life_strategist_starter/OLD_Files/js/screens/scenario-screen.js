Router.register('scenario', async (app,params)=>{
  const scenario=await ScenarioLoader.byId(params.id);
  GameState.progress.currentScenarioId=scenario.id;
  GameState.runtime.scenario=scenario;
  GameState.runtime.resources=JSON.parse(JSON.stringify(scenario.resources));
  GameState.runtime.relationships=JSON.parse(JSON.stringify(scenario.relationships));
  GameState.runtime.hiddenScores={planning:0,adaptability:0,creativity:0,risk_management:0,ethics:0,leadership:0,resource_optimization:0,prediction:0,patience:0,decision_speed:0};
  const hud=Render.el('div',{class:'hud'},[
    UI.statMini('Money',GameState.runtime.resources.money),
    UI.statMini('Time',GameState.runtime.resources.time),
    UI.statMini('Energy',GameState.runtime.resources.energy),
    UI.statMini('Trust',GameState.runtime.resources.trust)
  ]);
  const choose=(choiceId)=>{DecisionEngine.applyChoice(scenario,choiceId);Router.go('report',{id:scenario.id})};
  app.append(Render.el('main',{class:'screen fade-up'},[
    Render.el('div',{class:'btn-row'},[UI.button('Mission List','btn-secondary',()=>Router.go('scenario-list'))]),
    hud,
    Render.el('section',{class:'scenario-top'},[
      Render.el('article',{class:'glass story'},[
        UI.badge('Objective'),
        Render.el('h1',{},scenario.meta.title),
        Render.el('p',{class:'subtitle'},scenario.intro),
        Render.el('p',{},scenario.objective)
      ]),
      Render.el('aside',{class:'glass card'},[
        UI.badge('Relationships'),
        Render.el('p',{class:'muted'},`Parents: ${scenario.relationships.parents} · Friends: ${scenario.relationships.friends} · Teacher: ${scenario.relationships.teacher}`),
        UI.badge('Skills trained'),
        Render.el('p',{class:'muted'},scenario.meta.tags.join(' · '))
      ])
    ]),
    Render.el('section',{class:'choices'},scenario.choices.map(choice=>UI.choiceCard(choice,()=>choose(choice.id))))
  ]));
});