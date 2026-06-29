window.Particles={
  colors:['#4ade80','#60a5fa','#fbbf24','#f472b6','#a78bfa','#ffffff'],
  init(){
    const container=document.createElement('div');
    container.id='particles-bg';
    document.body.appendChild(container);
    this.container=container;
    this.createParticles();
  },
  createParticles(){
    for(let i=0;i<30;i++){
      const p=document.createElement('div');
      p.className='particle';
      const size=Math.random()*4+2;
      p.style.width=size+'px';
      p.style.height=size+'px';
      p.style.left=Math.random()*100+'vw';
      p.style.animationDuration=(Math.random()*10+10)+'s';
      p.style.animationDelay=(Math.random()*10)+'s';
      p.style.background=this.colors[Math.floor(Math.random()*this.colors.length)];
      p.style.opacity=Math.random()*0.5+0.2;
      this.container.appendChild(p);
    }
  }
};

window.Confetti={
  colors:['#4ade80','#60a5fa','#fbbf24','#f472b6','#a78bfa','#f87171'],
  burst(){
    const container=document.createElement('div');
    container.id='confetti-overlay';
    document.body.appendChild(container);
    for(let i=0;i<50;i++){
      const c=document.createElement('div');
      c.className='confetti-piece';
      c.style.left=Math.random()*100+'vw';
      c.style.top='-10px';
      c.style.background=this.colors[Math.floor(Math.random()*this.colors.length)];
      c.style.width=(Math.random()*8+4)+'px';
      c.style.height=(Math.random()*8+4)+'px';
      c.style.animationDuration=(Math.random()*3+2)+'s';
      c.style.animationDelay=(Math.random()*1)+'s';
      c.style.borderRadius=Math.random()>0.5?'50%':'0';
      container.appendChild(c);
    }
    setTimeout(()=>container.remove(),5000);
  }
};

window.VisualEffects={
  flash(type){
    const overlay=document.createElement('div');
    overlay.style.cssText='position:fixed;inset:0;z-index:9998;pointer-events:none;';
    overlay.className=type==='success'?'flash-success':'flash-danger';
    document.body.appendChild(overlay);
    setTimeout(()=>overlay.remove(),500);
  },
  floatNumber(element,value,color){
    const num=document.createElement('div');
    num.className='float-number '+(value>0?'positive':'negative');
    num.textContent=(value>0?'+':'')+value;
    const rect=element.getBoundingClientRect();
    num.style.left=(rect.left+rect.width/2)+'px';
    num.style.top=rect.top+'px';
    document.body.appendChild(num);
    setTimeout(()=>num.remove(),1000);
  }
};
