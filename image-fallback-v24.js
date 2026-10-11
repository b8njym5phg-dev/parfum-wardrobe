(function(){
const q=x=>'https://www.google.com/search?tbm=isch&q='+encodeURIComponent(x.brand+' '+x.name+' original flakon parfum');
function alt(x){return 'https://www.parfumo.de/Search?q='+encodeURIComponent(x.brand+' '+x.name)}
const style=document.createElement('style');style.textContent='.v24bars{display:grid;gap:10px;margin:16px 0}.v24bar{display:grid;grid-template-columns:minmax(84px,1fr) minmax(80px,2fr) 30px;gap:7px;align-items:center;font-size:11px}.v24bar>div{background:#ece6de;border-radius:8px;height:10px;overflow:hidden}.v24bar>div i{display:block;background:#b49160;height:100%;border-radius:8px}.v24discovery{display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid #e5d8c8;font-size:12px}.v24discovery strong,.v24discovery small,.v24discovery span{display:block;margin:3px 0}.v24discovery small{color:#918376;font-size:10px}.v24right{text-align:right}.v24right a{color:#5a4026}.v24refresh{border:1px solid #a38b6c;padding:8px 12px;border-radius:10px;background:#27221b;color:#f4e9d9}.v24ImageFail{font-size:10px;display:grid;place-items:center;text-align:center;gap:6px;max-width:100%}.v24ImageFail a{color:#66492c;text-decoration:underline}.coreVisual .v24ImageFail{max-width:100%;overflow-wrap:anywhere}.v22figure .v24ImageFail{max-width:100%;overflow-wrap:anywhere}.v22figure,.coreVisual{position:relative}';document.head.appendChild(style);
function apply(container){
 const img=container.querySelector('img');if(!img||img.dataset.v24)return;
 img.dataset.v24='1';
 const srcs=[img.src];
 const x=PERFUMES.find(p=>img.alt.toLowerCase().includes(p.name.toLowerCase()));
 if(!x)return;
 const original=window.PW_META?.[x.id]?.img;
 const core=window.CORE_META?.[x.id]?.img;
 for(const u of [original,core])if(u&&!srcs.includes(u))srcs.push(u);
for(const u of [...srcs])if(u.startsWith('https://')&&!u.includes('images.weserv.nl'))srcs.push('https://images.weserv.nl/?url='+encodeURIComponent(u)+'&w=500&h=650&fit=contain&we');
 img.referrerPolicy='no-referrer';
 img.addEventListener('error',()=>{
  const i=Number(img.dataset.fallback||0)+1;
  if(i<srcs.length){img.dataset.fallback=String(i);img.src=srcs[i];return}
  img.remove();
  const wrap=document.createElement('div');wrap.className='v24ImageFail';
  const link=document.createElement('a');link.target='_blank';link.rel='noopener';link.href=q(x);link.textContent='Flakonfoto suchen ↗';
  const link2=document.createElement('a');link2.target='_blank';link2.rel='noopener';link2.href=alt(x);link2.textContent='Parfumo ansehen ↗';
  const t=document.createElement('small');t.textContent='Fotoquelle blockiert';
  wrap.append(t,link,link2);container.append(wrap);
 });
}
function enhance(){document.querySelectorAll('.v22figure,.coreVisual').forEach(apply)}
const view=document.getElementById('view');if(view){new MutationObserver(enhance).observe(view,{childList:true,subtree:true});enhance()}
})();