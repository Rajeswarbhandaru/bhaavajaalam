window.ScoringEngine={
  traitList:['planning','adaptability','creativity','risk_management','ethics','leadership','resource_optimization','prediction','patience','decision_speed'],
  snapshot(){
    const hidden=window.GameState.runtime.hiddenScores;
    return this.traitList.map(key=>({key,value:Math.max(0,Math.min(100,50+(hidden[key]||0)))}));
  },
  stars(){
    const avg=this.snapshot().reduce((a,b)=>a+b.value,0)/this.traitList.length;
    if(avg>=62)return 3;
    if(avg>=54)return 2;
    return 1;
  }
};