Router.register('home', async (app)=>{
  const completed=Object.keys(GameState.progress.completed).length;
  const total=30;
  const pct=Math.round((completed/total)*100);

  const wrap=Render.el('main',{class:'screen fade-up'},[
    Render.el('section',{class:'home-layout',style:'position:relative;z-index:1;'},[
      Render.el('div',{class:'glass hero',style:'text-align:center;'},[
        Render.el('div',{style:'font-size:4rem;margin-bottom:8px;animation:wobble 3s ease-in-out infinite;'},'🧭'),
        UI.badge('Bhāva Tech Cognitive Games'),
        Render.el('h1',{class:'title neon-text',style:'font-size:2.5rem;'},'Life Strategist'),
        Render.el('p',{class:'class subtitle',style:'max-width:500px;margin:0 auto 16px;'},'Small decisions. Big consequences. Build planning, prediction, adaptability, ethics, and practical intelligence through story-based missions.'),
        Render.el('div',{style:'margin:16px 0;'},UI.progressBar(completed,total,'#fbbf24')),
        Render.el('p',{class:'muted'},`${completed}/${total} missions complete (${pct}%)`),
        Render.el('div',{class:'btn-row',style:'justify-content:center;'},[
          UI.button('🎮 Play','btn-primary pulse',()=>{AudioEngine.levelUp();Router.go('levels');}),
          UI.button('▶ Continue','btn-secondary',()=>{AudioEngine.click(); completed ? Router.go('scenario-screen',{id:Object.keys(GameState.progress.completed).slice(-1)[0]}) : Router.go('levels');})
        ])
      ]),
      Render.el('div',{class:'glass orb floaty',style:'text-align:center;'},[
        Render.el('div',{style:'font-size:3rem;margin-bottom:8px;'},'🏆'),
        Render.el('div',{class:'badge'},`⭐ Stars: ${GameState.profile.stars||0}`),
        Render.el('h2',{},'Your Journey'),
        Render.el('p',{class:'muted'},'Level up through 3 worlds of strategy.')
      ])
    ]),
    Render.el('div',{class:'btn-row',style:'margin-top:16px;justify-content:center;position:relative;z-index:1;'},[
      UI.button(AudioEngine.muted?'🔇 Unmute':'🔊 Sound On','btn-secondary',()=>{
        const muted=AudioEngine.toggleMute();
        event.target.textContent=muted?'🔇 Unmute':'🔊 Sound On';
      })
    ])
  ]);
  app.append(wrap);
  if(!document.getElementById('particles-bg')) Particles.init();
  AudioEngine.init();
});
