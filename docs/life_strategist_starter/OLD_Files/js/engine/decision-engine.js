window.DecisionEngine={
  applyChoice(scenario,choiceId){
    const choice=scenario.choices.find(c=>c.id===choiceId);
    if(!choice)return null;
    const before=JSON.parse(JSON.stringify(window.GameState.runtime));
    const resources=window.GameState.runtime.resources;
    const relationships=window.GameState.runtime.relationships;
    const hidden=window.GameState.runtime.hiddenScores;
    Object.entries(choice.effects.resources||{}).forEach(([k,v])=>resources[k]=(resources[k]||0)+v);
    Object.entries(choice.effects.relationships||{}).forEach(([k,v])=>relationships[k]=(relationships[k]||0)+v);
    Object.entries(choice.effects.hidden||{}).forEach(([k,v])=>hidden[k]=(hidden[k]||0)+v);
    const summary={scenarioId:scenario.id,title:scenario.meta.title,choiceTitle:choice.title,choiceId:choice.id,effects:choice.effects,reflection:scenario.reflection};
    window.GameState.progress.completed[scenario.id]=summary;
    window.GameState.progress.lastReport=summary;
    window.GameState.profile.xp+=25;
    window.GameState.profile.coins+=10;
    StorageAPI.save();
    return {choice,before,after:JSON.parse(JSON.stringify(window.GameState.runtime)),summary};
  }
};