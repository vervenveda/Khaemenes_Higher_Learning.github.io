const CACHE="khaemenes-bio101-foundation-v1";
const CORE=["./","./index.html","./offline.html","./course-map.json","./course-data.js","./architecture-contract.json","./diagnostic/blueprint.json","./assessments/assessment-map.json","./labs/laboratory-spine.json","./vocabulary/vocabulary-framework.json","./vocabulary/weekly-map.json"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{if(event.request.method!=="GET")return;event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).catch(()=>caches.match("./offline.html"))));});
