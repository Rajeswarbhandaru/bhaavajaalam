Router.register('home', async (app)=>{
  const completed=Object.keys(GameState.progress.completed).length;
  const wrap=Render.el('main',{class:'screen fade-up'},[
    Render.el('section',{class:'home-layout'},[
      Render.el('div',{class:'glass hero'},[
        UI.badge('Bhāva Tech Cognitive Games'),
        Render.el('h1',{class:'title'},'Life Strategist'),
        Render.el('p',{class:'class subtitle'},'Small decisions. Big consequences. Build planning, prediction, adaptability, ethics, and practical intelligence through story-based missions.'),
        Render.el('div',{class:'btn-row'},[
          UI.button('Play','btn-primary pulse',()=>Router.go('levels')),
          UI.button('Continue','btn-secondary',()=> completed ? Router.go('scenario',{id:Object.keys(GameState.progress.completed).slice(-1)[0]}) : Router.go('levels'))
        ])
      ]),
      Render.el('div',{class:'glass orb floaty'},[
        Render.el('div',{},[
          Render.el('div',{class:'badge'},`Completed missions: ${completed}/12`),
          Render.el('h2',{},'Level 1 Ready'),
          Render.el('p',{class:'muted'},'Starter engine + scenario pack included.')
        ])
      ])
    ])
  ]);
  app.append(wrap);
});