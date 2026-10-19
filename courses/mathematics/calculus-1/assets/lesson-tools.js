(() => {
"use strict";
const id=document.body.dataset.lessonId;
if(!id)return;
const ACTIVE_KEY="khaemenes_active_learner_v1",REGISTRY_KEY="khaemenes_family_registry_v1",BASE_KEY="khaemenes-calculus1-lesson-progress-v1";
function profile(){try{const via=window.KhaemenesCourseEntryContract?.readAcademyProfile?.();if(via?.learnerId)return via;const id=JSON.parse(localStorage.getItem(ACTIVE_KEY)||"null"),reg=JSON.parse(localStorage.getItem(REGISTRY_KEY)||"null"),learner=typeof id==="string"?reg?.learners?.[id]:null;return learner?.learnerId===id?{learnerId:id,name:String(learner.nickname||"Learner")}:null}catch{return null}}
const ownerAtLoad=profile(),ownerId=ownerAtLoad?.learnerId||null,KEY=ownerId?`${BASE_KEY}:learner:${encodeURIComponent(ownerId)}`:null;
function ownerOk(){return!!ownerId&&profile()?.learnerId===ownerId}
function load(){if(!KEY)return{};try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch{return {}}}
function save(data){if(!KEY||!ownerOk())return false;let before=null;try{before=localStorage.getItem(KEY);const raw=JSON.stringify(data);localStorage.setItem(KEY,raw);if(localStorage.getItem(KEY)!==raw)throw Error("verification-failed");return true}catch{try{before===null?localStorage.removeItem(KEY):localStorage.setItem(KEY,before)}catch{}return false}}
let data=load(),rec=data[id]||{complete:false,note:"",updated:null};
const box=document.getElementById("lessonComplete");
const note=document.getElementById("lessonNote");
const status=document.getElementById("lessonStatus");
if(box)box.checked=!!rec.complete;
if(note)note.value=rec.note||"";
function updateStatus(){if(status)status.textContent=rec.complete?"Marked complete on this device.":"Not yet marked complete."}
box?.addEventListener("change",()=>{const previous=!!rec.complete;rec.complete=box.checked;rec.updated=new Date().toISOString();data[id]=rec;if(!save(data)){rec.complete=previous;box.checked=previous;if(status)status.textContent="Save paused: select the intended Academy learner and reopen this lesson.";return}updateStatus()});
document.getElementById("saveLessonNote")?.addEventListener("click",()=>{const next=note.value.trim(),previous=rec.note;rec.note=next;rec.updated=new Date().toISOString();data[id]=rec;if(save(data))alert("Lesson note saved locally for "+(ownerAtLoad?.name||"the active learner")+".");else{rec.note=previous;if(status)status.textContent="Save paused: select the intended Academy learner and reopen this lesson. Export or copy unsaved notes before leaving."}});
document.getElementById("printLesson")?.addEventListener("click",()=>print());
updateStatus();if(!ownerId&&status)status.textContent="No Academy learner is selected. Reading and printing remain available; lesson progress will not be saved.";
window.addEventListener("storage",event=>{if(event.key===ACTIVE_KEY||event.key===REGISTRY_KEY){if(!ownerOk()){if(box)box.disabled=true;if(note)note.disabled=true;const b=document.getElementById("saveLessonNote");if(b)b.disabled=true;if(status)status.textContent="The active Academy learner changed. Saving is paused to protect both learners’ records; reopen this lesson under the intended learner."}}});
})();
/* Curated High School mathematics studios; independent practice only. */
(()=>{
  const own=document.currentScript;if(!own||document.querySelector('script[data-calc1-shared-highschool-math-tools="v1"]'))return;
  const s=document.createElement("script");s.async=false;s.dataset.calc1SharedHighschoolMathTools="v1";
  s.src=new URL("calculus1-shared-math-tools-v1.js",own.src).href;
  document.body.appendChild(s);
})();

/* Shared Applied Mission Studio lesson connection. */
(()=>{
  const current=document.currentScript;
  if(!current||document.querySelector('script[data-khae-applied-mission-studio="shared-v1"]'))return;
  const s=document.createElement("script");
  s.async=false;
  s.dataset.khaeAppliedMissionStudio="shared-v1";
  s.src=new URL("../../assets/applied-mission-studio-v1.js",current.src).href;
  document.head.appendChild(s);
})();

/* Shared accessible Academy H1 → smaller page subtitle presentation (visual only; no records). */
(function(){
 const own=document.currentScript;if(!own||document.querySelector('script[data-khae-academy-headings="v1"]'))return;
 const script=document.createElement("script");script.dataset.khaeAcademyHeadings="v1";
 script.src=new URL("../../../assets/khaemenes-academy-title-v1.js",own.src).href;
 script.async=false;(document.head||document.documentElement).appendChild(script);
})();
