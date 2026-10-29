/* Read-only unit overview: never assign old unscoped lesson work to a student. */
(() => {
"use strict";
const unit=Number(document.body.dataset.unit);
if(!unit)return;
function learnerId(){
 try{
  const active=JSON.parse(localStorage.getItem("khaemenes_active_learner_v1")||"null");
  const registry=JSON.parse(localStorage.getItem("khaemenes_family_registry_v1")||"null");
  const id=typeof active==="string"?active:active?.learnerId;
  if(id&&registry?.learners?.[id]&&String(registry.learners[id].stage||"").toLowerCase()==="higher")
   return String(id);
 }catch{}
 try{
  const course=JSON.parse(localStorage.getItem("khaemenes-topology-differential-geometry-course-v1")||"{}");
  if(course.activeId)return String(course.activeId);
 }catch{}
 return "learner-1";
}
const KEY="khaemenes-topology-differential-geometry-lessons-v2:"+learnerId();
let data={};
try{
 const value=JSON.parse(localStorage.getItem(KEY)||"{}");
 if(value&&typeof value==="object"&&!Array.isArray(value))data=value;
}catch{}
const cards=[...document.querySelectorAll("[data-lesson-id]")];
let done=0;
for(const card of cards){
 const id=card.dataset.lessonId,record=data[id];
 if(record?.complete===true){
  done++;card.classList.add("completed");
  const label=card.querySelector(".lesson-state");
  if(label)label.textContent="Reviewed for this learner on this device";
 }
}
const out=document.getElementById("unitProgress");
if(out){
 out.textContent=done+"/"+cards.length+" lessons marked reviewed for this learner";
 if(localStorage.getItem("khaemenes-topology-differential-geometry-lessons-v1")!==null)
  out.title="Older shared-browser lesson records are preserved separately for manual attribution and are not included in this learner's count.";
}
})();
