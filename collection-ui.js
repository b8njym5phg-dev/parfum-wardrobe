(function(){
  function makeSelect(x){
    const current=PWCollection.get(x);
    const select=document.createElement('select');
    select.className='collectionSelect';
    select.dataset.state=current;
    [['keep','Behalten'],['out','Raus'],['core','Core']].forEach(([value,label])=>{
      const option=document.createElement('option');
      option.value=value;
      option.textContent=label;
      option.selected=value===current;
      select.appendChild(option);
    });
    select.addEventListener('change',()=>PWCollection.set(x.id,select.value));
    return select;
  }

  function enhanceRanking(){
    document.querySelectorAll('.card').forEach(card=>{
      if(card.querySelector('.collectionRow')) return;
      const name=card.querySelector('.name')?.textContent?.trim();
      const brand=card.querySelector('.brand')?.textContent?.trim();
      const x=PERFUMES.find(p=>p.name===name&&p.brand===brand);
      if(!x) return;
      const row=document.createElement('div');
      row.className='collectionRow';
      const label=document.createElement('span');
      label.className='collectionLabel';
      label.textContent='Sammlung';
      row.append(label,makeSelect(x));
      card.insertBefore(row,card.querySelector('.details'));
    });
  }

  const view=document.getElementById('view');
  if(view){
    new MutationObserver(enhanceRanking).observe(view,{childList:true,subtree:true});
    enhanceRanking();
  }
})();