const V="caisse-v2",F=["./","index.html","manifest.webmanifest","icon.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(V).then(c=>c.addAll(F)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
// Réseau d'abord (version à jour dès qu'il y a du réseau), sinon cache (hors ligne / réseau lent)
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;
e.respondWith((async()=>{const c=await caches.open(V);
try{const net=fetch(e.request,{cache:"no-cache"}).then(r=>{if(r&&r.ok)c.put(e.request,r.clone());return r});
const r=await Promise.race([net,new Promise((_,ko)=>setTimeout(()=>ko(),3000))]);return r}
catch(x){const m=await c.match(e.request,{ignoreSearch:true});if(m)return m;return fetch(e.request)}})())});
