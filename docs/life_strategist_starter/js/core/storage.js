window.StorageAPI={
  key:'life_strategist_save_v1',
  save(){localStorage.setItem(this.key,JSON.stringify(window.GameState))},
  load(){const raw=localStorage.getItem(this.key);if(!raw)return;try{Object.assign(window.GameState,JSON.parse(raw))}catch(e){console.warn(e)}}
};