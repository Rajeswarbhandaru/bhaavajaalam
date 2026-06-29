window.ScenarioLoader={
  async all(level=1){const res=await fetch('data/scenarios-level'+level+'.json');return res.json()},
  async byId(id){const level=parseInt(id.split('-')[1]);const list=await this.all(level);return list.find(s=>s.id===id)}
};
