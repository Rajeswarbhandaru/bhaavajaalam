window.AudioEngine={
  ctx:null,
  muted:false,
  init(){
    if(!this.ctx){this.ctx=new (window.AudioContext||window.webkitAudioContext)();}
  },
  ensure(){if(!this.ctx)this.init();if(this.ctx.state==='suspended')this.ctx.resume();},
  playTone(freq,duration,type='sine',volume=0.15,slideTo=null){
    if(this.muted)return;
    this.ensure();
    const ctx=this.ctx;
    const osc=ctx.createOscillator();
    const gain=ctx.createGain();
    osc.type=type;
    osc.frequency.setValueAtTime(freq,ctx.currentTime);
    if(slideTo){osc.frequency.linearRampToValueAtTime(slideTo,ctx.currentTime+duration);}
    gain.gain.setValueAtTime(volume,ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+duration);
    osc.connect(gain);gain.connect(ctx.destination);
    osc.start();osc.stop(ctx.currentTime+duration);
  },
  playChord(freqs,duration=0.5,type='sine',volume=0.12){
    if(this.muted)return;
    freqs.forEach(f=>this.playTone(f,duration,type,volume));
  },
  // Specific sound events
  click(){this.playTone(440,0.08,'sine',0.08);},
  hover(){this.playTone(330,0.05,'sine',0.04);},
  decisionMade(){this.playChord([523,659],0.3,'sine',0.1);},
  positiveEffect(){this.playChord([523,659,784],0.5,'sine',0.12);}, // C major
  negativeEffect(){this.playTone(150,0.4,'sawtooth',0.08,100);}, // Descending buzz
  randomEvent(){this.playTone(600,0.2,'square',0.08,400);this.playTone(400,0.3,'square',0.06,200);},
  missionComplete(){this.playChord([523,659,784,1047],0.8,'sine',0.15);setTimeout(()=>this.playChord([587,740,880,1175],0.8,'sine',0.15),400);},
  levelUp(){this.playChord([392,523,659],0.6,'sine',0.14);setTimeout(()=>this.playChord([523,659,784],0.6,'sine',0.14),300);setTimeout(()=>this.playChord([659,784,1047],0.8,'sine',0.16),600);},
  stepForward(){this.playTone(440,0.1,'sine',0.08,660);},
  toggleMute(){this.muted=!this.muted;return this.muted;}
};
