window.ConsequenceScreen={
  render(app,params){
    const scenario=GameState.runtime.scenario;
    const lastChoice=GameState.runtime.nodeHistory[GameState.runtime.nodeHistory.length-1];
    const effects=lastChoice.effects;
    const before=params.before;
    const after=params.after;

    // Play sound based on net effect
    const netResource=Object.values(effects.resources||{}).reduce((a,b)=>a+b,0);
    const netRel=Object.values(effects.relationships||{}).reduce((a,b)=>a+b,0);
    if(netResource>0 || netRel>0){AudioEngine.positiveEffect();}
    else if(netResource<0 || netRel<0){AudioEngine.negativeEffect();}
    else{AudioEngine.stepForward();}

    const resourceChanges=[];
    Object.entries(effects.resources||{}).forEach(([k,v])=>{
      const oldVal=before.resources[k]||0;
      const newVal=after.resources[k]||0;
      const color=v>0?'var(--green)':'var(--red)';
      const sign=v>0?'+':'';
      resourceChanges.push(Render.el('div',{class:'mini',style:'border-left:4px solid '+color},[
        Render.el('div',{class:'muted'},k),
        Render.el('div',{class:'stat',style:'color:'+color},`${oldVal} → ${newVal} (${sign}${v})`)
      ]));
    });

    const relChanges=[];
    Object.entries(effects.relationships||{}).forEach(([k,v])=>{
      const color=v>0?'var(--green)':'var(--red)';
      const sign=v>0?'+':'';
      relChanges.push(Render.el('span',{class:'badge',style:'border-left:4px solid '+color},`${k}: ${sign}${v}`));
    });

    const hiddenChanges=[];
    Object.entries(effects.hidden||{}).forEach(([k,v])=>{
      const sign=v>0?'+':'';
      hiddenChanges.push(Render.el('span',{class:'badge'},`${k}: ${sign}${v}`));
    });

    const nextNodeId=GameState.runtime.currentNodeId;
    const node=scenario.nodes.find(n=>n.id===nextNodeId);

    app.append(Render.el('main',{class:'screen fade-up'},[
      Render.el('section',{class:'glass hero'},[
        UI.badge('Consequence'),
        Render.el('h1',{},`After: ${lastChoice.choiceTitle}`),
        Render.el('p',{class:'subtitle'},node && node.type==='random'?'An unexpected event occurs...':'The situation changes...')
      ]),
      Render.el('section',{class:'report-grid'},resourceChanges),
      Render.el('section',{class:'glass card'},[
        Render.el('h3',{},'Relationships'),
        Render.el('div',{class:'btn-row'},relChanges)
      ]),
      Render.el('section',{class:'glass card'},[
        Render.el('h3',{},'Hidden Skills'),
        Render.el('div',{class:'btn-row'},hiddenChanges)
      ]),
      Render.el('div',{class:'btn-row'},[
        UI.button('Continue','btn-primary pulse',()=>{
          AudioEngine.click();
          if(node && node.type==='ending'){Router.go('report',{id:scenario.id});}
          else{Router.go('scenario-screen',{id:scenario.id});}
        })
      ])
    ]));
  }
};
