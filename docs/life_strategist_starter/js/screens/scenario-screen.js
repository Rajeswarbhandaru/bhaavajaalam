Router.register('scenario-screen', async (app,params)=>{
  const scenario=GameState.runtime.scenario;
  const node=DecisionEngine.getCurrentNode();
  const hud=Render.el('div',{class:'hud'},[
    UI.statMini('Money',GameState.runtime.resources.money),
    UI.statMini('Time',GameState.runtime.resources.time),
    UI.statMini('Energy',GameState.runtime.resources.energy),
    UI.statMini('Trust',GameState.runtime.resources.trust)
  ]);
  if(!node){
    app.append(Render.el('main',{class:'screen'},[Render.el('p',{},'Error loading scenario node')]));
    return;
  }
  if(node.type==='random'){AudioEngine.randomEvent();}
  let mainContent;
  if(node.type==='story'){
    mainContent=Render.el('article',{class:'glass story'},[
      UI.badge('Objective'),
      Render.el('h1',{},scenario.meta.title),
      Render.el('p',{class:'subtitle'},node.text),
      UI.button('Continue','btn-primary',()=>{AudioEngine.click();DecisionEngine.goToNode(node.next);Router.go('scenario-screen',{id:scenario.id});})
    ]);
  } else if(node.type==='decision'){
    const choose=(choiceId)=>{
      const result=DecisionEngine.applyChoice(choiceId);
      if(result){
        const nextNode=DecisionEngine.getCurrentNode();
        if(nextNode && nextNode.type==='ending'){
          Router.go('report',{id:scenario.id});
        } else {
          const cApp=document.getElementById('app');
          cApp.innerHTML='';
          window.ConsequenceScreen.render(cApp,result);
        }
      }
    };
    mainContent=Render.el('div',{},[
      Render.el('article',{class:'glass story'},[
        UI.badge('Decision'),
        Render.el('h1',{},scenario.meta.title),
        Render.el('p',{class:'subtitle'},node.text),
        Render.el('p',{class:'muted'},`Step ${GameState.runtime.nodeHistory.length+1} of mission`)
      ]),
      Render.el('section',{class:'choices'},node.choices.map(choice=>UI.choiceCard(choice,()=>choose(choice.id))))
    ]);
  } else if(node.type==='random'){
    mainContent=Render.el('article',{class:'glass story'},[
      UI.badge('Unexpected Event'),
      Render.el('h1',{},scenario.meta.title),
      Render.el('p',{class:'subtitle'},node.text),
      Render.el('p',{class:'muted'},'Processing...')
    ]);
  } else {
    mainContent=Render.el('article',{class:'glass story'},[Render.el('p',{},'Loading...')]);
  }
  app.append(Render.el('main',{class:'screen fade-up'},[
    Render.el('div',{class:'btn-row'},[
      UI.button('Mission List','btn-secondary',()=>{AudioEngine.click();Router.go('scenario-list',{level:scenario.meta.level});}),
      UI.button('Save & Home','btn-secondary',()=>{AudioEngine.click();StorageAPI.save();Router.go('home');})
    ]),
    hud,
    mainContent,
    Render.el('aside',{class:'glass card',style:'margin-top:12px'},[
      UI.badge('Relationships'),
      Render.el('p',{class:'muted'},`Parents: ${GameState.runtime.relationships.parents||50} · Friends: ${GameState.runtime.relationships.friends||50} · Teacher: ${GameState.runtime.relationships.teacher||50} · Team: ${GameState.runtime.relationships.team||50}`)
    ])
  ]));
});
