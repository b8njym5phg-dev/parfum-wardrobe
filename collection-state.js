window.PWCollection={
  get(x){
    if(!state.choices) state.choices={};
    if(state.core.includes(x.id)) return 'core';
    const c=state.choices[String(x.id)];
    if(c==='keep'||c==='out') return c;
    if(state.out.includes(x.id)) return 'out';
    const s=score(x);
    return typeof s==='number'&&s<6?'out':'keep';
  },
  set(id,value){
    if(!state.choices) state.choices={};
    state.core=state.core.filter(x=>x!==id);
    state.out=state.out.filter(x=>x!==id);
    if(value==='core') state.core=[...state.core,id];
    if(value==='out') state.out=[...state.out,id];
    state.choices[String(id)]=value;
    save();
    render();
  },
  label(value){
    return value==='core'?'CORE':value==='out'?'RAUS':'BEHALTEN';
  }
};