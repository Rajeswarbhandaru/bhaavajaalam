window.UI={
  button(label,variant,handler){
    const btn=Render.el('button',{class:`btn ${variant}`,onclick:(e)=>{AudioEngine.click();handler(e);}},label);
    btn.addEventListener('mouseenter',()=>AudioEngine.hover());
    return btn;
  },
  badge(text){return Render.el('span',{class:'badge'},text)},
  statMini(label,value){
    const icons={money:'💰',time:'⏱️',energy:'⚡',trust:'🤝',knowledge:'📚',confidence:'💪',health:'❤️'};
    return Render.el('div',{class:'mini'},[
      Render.el('div',{class:'muted'},(icons[label]||'📊')+' '+label),
      Render.el('div',{class:'stat'},String(value))
    ]);
  },
  choiceCard(choice,handler){
    const icons={low:'🟢',medium:'🟡',high:'🔴'};
    const card=Render.el('button',{class:'choice-card',onclick:(e)=>{AudioEngine.decisionMade();handler(e);}},[
      Render.el('div',{class:'badge'},`${icons[choice.risk]||''} ${choice.risk.toUpperCase()} risk · ${choice.reward.toUpperCase()} reward`),
      Render.el('h3',{},choice.title),
      Render.el('p',{class:'muted'},choice.description)
    ]);
    card.addEventListener('mouseenter',()=>AudioEngine.hover());
    return card;
  },
  progressBar(current,total,color='#4ade80'){
    const pct=Math.round((current/total)*100);
    const bar=Render.el('div',{class:'progress-bar'},[
      Render.el('div',{class:'progress-fill',style:`--target-width:${pct}%;width:0%;background:linear-gradient(90deg,${color},#fff);`})
    ]);
    // Animate after mount
    setTimeout(()=>{const fill=bar.querySelector('.progress-fill');if(fill)fill.style.width=pct+'%';},100);
    return bar;
  },
  starRating(count,animated=true){
    const container=Render.el('div',{class:'star-rating'});
    for(let i=0;i<count;i++){
      const star=Render.el('span',{class:'star'},'⭐');
      if(animated)star.style.animationDelay=(i*0.2)+'s';
      container.appendChild(star);
    }
    return container;
  }
};
