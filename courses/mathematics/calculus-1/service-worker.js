"use strict";
// Applied Mission Studio v1.4.0 · SHA-256 portable evidence integrity refresh.
const CACHE="khaemenes-calculus-1-v4-ams-v1.4.0-atomic-r2-20261014";
const CORE=["./","index.html","offline.html","../assets/applied-mission-studio-v1.js","../../shared/course-entry-contract.js","../../shared/math-entry-gate.js","manifest.webmanifest","course-data.js","course-map.json","assets/styles.css","assets/app.js","assets/question-bank.js","assets/assessment-engine.js","assets/lesson-tools.js","assets/unit-progress.js","diagnostic/","assessments/","teacher/","teacher-keys/","./units/unit-01/projects/01-project.html","./units/unit-02/projects/02-project.html","./units/unit-03/projects/03-project.html","./units/unit-04/projects/04-project.html","./units/unit-05/projects/05-project.html","./units/unit-06/projects/06-project.html","./units/unit-07/projects/07-project.html","./units/unit-08/projects/08-project.html","./units/unit-09/projects/09-project.html","./units/unit-10/projects/10-project.html","./units/unit-11/projects/11-project.html","./units/unit-12/projects/12-project.html","./units/unit-13/projects/13-project.html"];

const CACHE_PREFIX="khaemenes-calculus-1-";
const MISSION_OFFLINE_RELEASE="ams-v1.4.0-atomic-r2-20261014";
const MISSION_CRITICAL=["./","index.html","offline.html","../assets/applied-mission-studio-v1.js","./units/unit-01/projects/01-project.html","./units/unit-02/projects/02-project.html","./units/unit-03/projects/03-project.html","./units/unit-04/projects/04-project.html","./units/unit-05/projects/05-project.html","./units/unit-06/projects/06-project.html","./units/unit-07/projects/07-project.html","./units/unit-08/projects/08-project.html","./units/unit-09/projects/09-project.html","./units/unit-10/projects/10-project.html","./units/unit-11/projects/11-project.html","./units/unit-12/projects/12-project.html","./units/unit-13/projects/13-project.html"];
async function installMissionCritical(){
  const cache=await caches.open(CACHE);
  try{await cache.addAll(MISSION_CRITICAL.map(file=>new Request(file,{cache:"reload"})))}
  catch(error){await caches.delete(CACHE);throw error}
}
function matchReleaseCache(request){return caches.open(CACHE).then(cache=>cache.match(request))}
self.addEventListener("install",event=>{event.waitUntil((async()=>{await installMissionCritical();const cache=await caches.open(CACHE),extras=CORE.filter(file=>!MISSION_CRITICAL.includes(file));await Promise.allSettled(extras.map(file=>cache.add(new Request(file,{cache:"reload"}))));await self.skipWaiting()})())});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(CACHE_PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;
 if(event.request.mode==="navigate"){
   event.respondWith(fetch(event.request,{cache:"no-store"}).then(response=>{if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy))}return response}).catch(()=>matchReleaseCache(event.request).then(r=>r||matchReleaseCache("offline.html"))));
   return;
 }
 event.respondWith(matchReleaseCache(event.request).then(hit=>hit||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy))}return response})));
});
