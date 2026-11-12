const V='dial-studio-4.9.9';
const SHELL=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','https://cdn.jsdelivr.net/npm/opentype.js@2.0.0/dist/opentype.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.allSettled(SHELL.map(u=>c.add(u)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// pages: network first (so a new deploy shows up), cache when offline. Everything else: cache first, refreshed in the background.
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put('./index.html',c));return res}).catch(()=>caches.match('./index.html')));return}
e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res&&(res.status===200||res.type==='opaque'))caches.open(V).then(x=>x.put(r,res.clone()));return res}).catch(()=>hit);return hit||net}))});
