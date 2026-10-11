(function(){
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const liked=x=>state.core.includes(x.id)||state.choices?.[x.id]==='core'||state.choices?.[x.id]==='keep'||(!state.out.includes(x.id)&&score(x)!==null&&score(x)>=8.2);
const weight=x=>state.core.includes(x.id)?1.7:Math.max(.1,((score(x)||6)-5)/4);
const notes=x=>(window.PW_META?.[x.id]?.n||[]);
const accords=x=>(window.PW_META?.[x.id]?.a||[]);
const discoveries=[
{name:'Althaïr Exclusif',brand:'Parfums de Marly',year:2026,notes:['Vanille','Amber','Praline'],accords:['Süß','Gourmand','Würzig'],type:'Ähnliche Handschrift',url:'https://www.parfumo.de/Search?q=Althair%20Exclusif'},
{name:'Vanilla Canyon',brand:'Phlur',year:2026,notes:['Vanille','Amber','Sandelholz'],accords:['Süß','Vanillig','Holzig'],type:'Neue Alternative',url:'https://www.parfumo.de/Search?q=Vanilla%20Canyon'},
{name:'Cedro Virtuoso',brand:'Acqua di Parma',year:2026,notes:['Zitrone','Zedernholz'],accords:['Frisch','Zitrus','Holzig'],type:'Frische Alternative',url:'https://www.parfumo.de/Search?q=Cedro%20Virtuoso'},
{name:'Absolu Aventus',brand:'Creed',year:2023,notes:['Grapefruit','Ananas','Vetiver'],accords:['Fruchtig','Holzig'],type:'Vergleichsduft',url:'https://www.parfumo.de/Parfums/Creed/absolu-aventus'},
{name:'Gris Charnel Extrait',brand:'BDK Parfums',year:2022,notes:['Kardamom','Feige','Sandelholz'],accords:['Cremig','Holzig','Würzig'],type:'Kontrast',url:'https://www.parfumo.de/Search?q=Gris%20Charnel%20Extrait'},
{name:'Oud Maracujá',brand:'Maison Crivelli',year:2023,notes:['Passionsfrucht','Oud','Vanille'],accords:['Fruchtig','Oud','Süß'],type:'Kontrast',url:'https://www.parfumo.de/Search?q=Oud%20Maracuja'}
];
function matching(){const pool=PERFUMES.filter(liked);const tally={};for(const x of pool)for(const a of accords(x))tally[a]=(tally[a]||0)+weight(x);return tally}
function match(d){const tally=matching();return d.accords.reduce((s,a)=>s+(tally[a]||0),0)/Math.max(1,d.accords.length)}
const prevProfile=profile;
profile=function(){
 const base=prevProfile();const ranking=PERFUMES.filter(liked);const tally=matching();const items=Object.entries(tally).sort((a,b)=>b[1]-a[1]).slice(0,10);
 const max=items[0]?.[1]||1;
 const usage={};for(const x of ranking){const m=PW_META[x.id]||{};for(const u of (m.use||[])){const k=u.trim();if(k)usage[k]=(usage[k]||0)+weight(x)}}let occasions=Object.entries(usage).sort((a,b)=>b[1]-a[1]).slice(0,8),omax=occasions[0]?.[1]||1;
 function bars(arr,m){return '<div class="v24bars">'+arr.map(([k,v])=>'<div class="v24bar"><span>'+esc(k)+'</span><div><i style="width:'+Math.round(v/m*100)+'%"></i></div><b>'+Math.round(v*10)/10+'</b></div>').join('')+'</div>'}
 return base+'<section class="v22panel"><h3>Deine Favoriten-DNA · dynamisch</h3><p>Alle Behalten-/Core-Düfte, gewichtet nach persönlicher Bewertung. Core zählt stärker. Änderungen an Bewertungen und Core werden beim Öffnen des Profils neu berechnet.</p>'+bars(items,max)+'</section><section class="v22panel"><h3>Wann du deine Favoriten trägst</h3><p>Aus den gespeicherten Einsatzbereichen, mit Core-Gewichtung.</p>'+bars(occasions,omax)+'</section><section class="v22panel"><h3>Duft-Entdecker</h3><p>Personalisierte Vorschläge nach deinen Akkorden. Diese Sammlung ist redaktionell kuratiert, nicht automatisch mit Parfumo synchronisiert. Neuheiten und genaue Varianten auf der verlinkten Quelle prüfen.</p><button id="v24refresh" class="v24refresh">Matching aktualisieren</button><div id="v24discover"></div></section>';
};
function fill(){
 const el=document.getElementById('v24discover');if(!el)return;
 const owned=new Set(PERFUMES.map(x=>x.name.toLowerCase()));
 const known=discoveries.map(d=>({...d,match:match(d),owned:owned.has(d.name.toLowerCase())})).sort((a,b)=>b.match-a.match);
 el.innerHTML=known.map(d=>'<article class="v24discovery"><div><strong>'+esc(d.name)+'</strong><small>'+esc(d.brand)+' · '+d.year+' · '+esc(d.type)+'</small><span>'+esc(d.accords.join(' · '))+'</span></div><div class="v24right">'+(d.owned?'<small>Bereits getestet</small>':'<small>Zum Testen</small>')+'<a target="_blank" rel="noopener" href="'+esc(d.url)+'">Parfumo ↗</a></div></article>').join('');
}
const former=render;render=function(){former();if(tab==='profile'){fill();document.getElementById('v24refresh')?.addEventListener('click',fill)}};
if(tab==='profile')render();
})();