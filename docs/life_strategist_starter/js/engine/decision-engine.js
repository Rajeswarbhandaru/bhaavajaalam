window.DecisionEngine={
  currentNode:null,
  initScenario(scenario){GameState.runtime.scenario=scenario;GameState.runtime.currentNodeId=scenario.nodes[0].id;GameState.runtime.nodeHistory=[];GameState.runtime.resources=JSON.parse(JSON.stringify(scenario.resources));GameState.runtime.relationships=JSON.parse(JSON.stringify(scenario.relationships));GameState.runtime.hiddenScores={planning:0,adaptability:0,creativity:0,risk_management:0,ethics:0,leadership:0,resource_optimization:0,prediction:0,patience:0,decision_speed:0};},
  getCurrentNode(){return GameState.runtime.scenario.nodes.find(n=>n.id===GameState.runtime.currentNodeId);},
  applyChoice(choiceId){
    const node=this.getCurrentNode();
    const choice=node.choices.find(c=>c.id===choiceId);
    if(!choice)return null;
    const before=JSON.parse(JSON.stringify(GameState.runtime));
    const r=GameState.runtime.resources;
    const rel=GameState.runtime.relationships;
    const h=GameState.runtime.hiddenScores;
    Object.entries(choice.effects.resources||{}).forEach(([k,v])=>r[k]=(r[k]||0)+v);
    Object.entries(choice.effects.relationships||{}).forEach(([k,v])=>rel[k]=(rel[k]||0)+v);
    Object.entries(choice.effects.hidden||{}).forEach(([k,v])=>h[k]=(h[k]||0)+v);
    GameState.runtime.nodeHistory.push({nodeId:node.id,choiceId:choice.id,choiceTitle:choice.title,effects:choice.effects});
    this.goToNode(choice.next);
    const after=JSON.parse(JSON.stringify(GameState.runtime));
    return {choice,before,after};
  },
  goToNode(nodeId){
    GameState.runtime.currentNodeId=nodeId;
    const node=this.getCurrentNode();
    if(node.type==='random'){
      Object.entries(node.effects?.resources||{}).forEach(([k,v])=>GameState.runtime.resources[k]=(GameState.runtime.resources[k]||0)+v);
      Object.entries(node.effects?.relationships||{}).forEach(([k,v])=>GameState.runtime.relationships[k]=(GameState.runtime.relationships[k]||0)+v);
      setTimeout(()=>{
        this.goToNode(node.next);
        Router.go('scenario-screen',{id:GameState.runtime.scenario.id});
      },1500);
    }
    if(node.type==='ending'){
      const summary={scenarioId:GameState.runtime.scenario.id,title:GameState.runtime.scenario.meta.title,choices:GameState.runtime.nodeHistory,reflection:node.reflection,endingText:node.text};
      GameState.progress.completed[GameState.runtime.scenario.id]=summary;
      GameState.progress.lastReport=summary;
      GameState.profile.xp+=50;
      GameState.profile.coins+=25;
      StorageAPI.save();
    }
  }
};
