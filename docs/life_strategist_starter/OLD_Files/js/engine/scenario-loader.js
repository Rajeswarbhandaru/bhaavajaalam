window.ScenarioLoader={
  async all(){const res=await fetch('data/scenarios-level1.json');return res.json()},
  async byId(id){const list=await this.all();return list.find(s=>s.id===id)}
};