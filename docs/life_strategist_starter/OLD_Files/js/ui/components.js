window.UI={
  button(label,variant,handler){return Render.el('button',{class:`btn ${variant}`,onclick:handler},label)},
  badge(text){return Render.el('span',{class:'badge'},text)},
  statMini(label,value){return Render.el('div',{class:'mini'},[Render.el('div',{class:'muted'},label),Render.el('div',{class:'stat'},String(value))])},
  choiceCard(choice,handler){return Render.el('button',{class:'choice-card',onclick:handler},[
    Render.el('div',{class:'badge'},`${choice.risk.toUpperCase()} risk · ${choice.reward.toUpperCase()} reward`),
    Render.el('h3',{},choice.title),
    Render.el('p',{class:'muted'},choice.description)
  ])}
};