(()=>{
"use strict";
const COURSE_ID="advanced-geometric-topology";
const PIN_KEY="khaemenes-higher-learning-pinned-courses-v1";
const shared=new URL("../../../assets/khaemenes-course-identity-adapter.js",document.currentScript?.src||location.href).href;
function load(src){return new Promise((resolve,reject)=>{const s=document.createElement("script");s.src=src;s.async=false;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})}
function readPins(){try{const v=JSON.parse(localStorage.getItem(PIN_KEY)||"[]");return Array.isArray(v)?v:[]}catch{return[]}}
function writePins(v){try{localStorage.setItem(PIN_KEY,JSON.stringify([...new Set(v)]));return true}catch{return false}}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function render(){
 const A=window.KhaemenesCourseIdentityAdapter,s=A?.currentScholar?.()||null;
 const profile=document.getElementById("departmentProfileStatus"),pin=document.getElementById("pinCourseButton"),progress=document.getElementById("departmentProgressStatus");
 const pins=readPins(),isPinned=pins.includes(COURSE_ID);
 if(pin){pin.disabled=!s;pin.setAttribute("aria-pressed",String(isPinned));pin.textContent=isPinned?"★ Pinned to Profile":"☆ Pin to Profile";pin.title=s?"Save this course to the active Higher Learning scholar.":"Open Scholar Entry or select a Higher Learning learner first."}
 if(profile)profile.innerHTML=s?("<strong>"+esc(s.nickname||s.displayName||s.name||"Scholar")+"</strong> · Academy Family Registry authority · Higher Learning scholar selected."):"<strong>No Higher Learning scholar selected.</strong> Course study can be viewed, but learner-owned department pins require Scholar Entry.";
 const state=window.KHAEMENES_STORAGE?.getState?.(),mastery=window.KHAEMENES_MASTERY;
 if(progress&&state){
   const records=Object.values(state.sessions||{}),viewed=records.filter(r=>r&&r.viewed).length,mastered=records.filter(r=>mastery?.status?.(r)==="mastered").length;
   const capstone=state.capstone&&Object.keys(state.capstone).length?"Capstone evidence present":"Capstone evidence not yet recorded";
   progress.textContent=viewed+"/180 sessions viewed · "+mastered+"/180 sessions mastered · "+capstone+".";
 }
}
function togglePin(){
 const A=window.KhaemenesCourseIdentityAdapter,s=A?.currentScholar?.();if(!s){location.href="../../start/";return}
 const pins=readPins(),i=pins.indexOf(COURSE_ID);if(i>=0)pins.splice(i,1);else pins.push(COURSE_ID);writePins(pins);render()
}
async function boot(){
 try{if(!window.KhaemenesCourseIdentityAdapter)await load(shared);await window.KhaemenesCourseIdentityAdapter.bootShell({courseId:COURSE_ID})}
 catch(error){console.error("Higher Learning department integration unavailable.",error)}
 document.getElementById("pinCourseButton")?.addEventListener("click",togglePin);
 window.addEventListener("khaemenes-higher-pins-changed",render);
 window.addEventListener("khaemenes-family-changed",render);
 render();
}
boot();
})();