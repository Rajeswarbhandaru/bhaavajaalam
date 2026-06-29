window.Router={
  routes:{},
  register(name,screen){this.routes[name]=screen},
  go(name,params={}){const app=document.getElementById('app');app.innerHTML='';this.routes[name](app,params)}
};