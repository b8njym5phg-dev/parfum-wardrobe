const CACHE='parfum-wardrobe-v20';
const ASSETS=['./','./index.html','./styles.css','./app.js','./data.js','./manifest.webmanifest','./collection-state.js','./collection-ui.js'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(async response=>{
      let html=await response.text();
      if(!html.includes('collection-state.js')) html=html.replace('</body>','<script src="./collection-state.js"></script><script src="./collection-ui.js"></script></body>');
      return new Response(html,{headers:{'Content-Type':'text/html;charset=utf-8'}});
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;})));
});
