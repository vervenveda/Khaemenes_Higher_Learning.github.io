/* Unit index progress: scoped by Academy scholar or course learner, never shared legacy records. */
(() => {
"use strict";
const match=location.pathname.match(/\/unit-(\d{2})(?:\/|$)/);
const unit=Number(document.body.dataset.unit||match?.[1]||0);
if(!unit)return;
function learnerId(){
 try{
  const active=JSON.parse(localStorage.getItem("khaemenes_active_learner_v1")||"null");
  const registry=JSON.parse(localStorage.getItem("khaemenes_family_registry_v1")||"null");
  const id=typeof active==="string"?active:active?.learnerId;
  if(id&&registry?.learners?.[id]&&String(registry.learners[id].stage||"").toLowerCase()==="higher")return String(id);
 }catch{}
 try{
  const course=JSON.parse(localStorage.getItem("khaemenes-topology-differential-geometry-course-v1")||"{}");
  if(course.activeId)return String(course.activeId);
 }catch{}
 return "learner-1";
}
const key="khaemenes-topology-differential-geometry-lessons-v2:"+learnerId();
let data={};
try{
 const value=JSON.parse(localStorage.getItem(key)||"{}");
 if(value&&typeof value==="object"&&!Array.isArray(value))data=value;
}catch{}
const cards=[...document.querySelectorAll('a.card[href^="lessons/"]')]
 .map(a=>({element:a,id:a.getAttribute("href")?.match(/(?:^|\/)(u\d{2}-l\d{2})\.html(?:$|[?#])/)?.[1]}))
 .filter(c=>c.id&&Number(c.id.slice(1,3))===unit);
let done=0;
for(const {element,id} of cards){
 const record=data[id];
 if(record?.complete===true){
  done++;element.classList.add("completed");
  const pill=document.createElement("span");
  pill.className="pill good lesson-state";
  pill.textContent="Reviewed for this learner";
  pill.style.marginTop="8px";
  element.append(pill);
 }
}
if(!cards.length)return;
let result=document.getElementById("unitProgress");
if(!result){
 result=document.createElement("p");result.id="unitProgress";
 result.setAttribute("role","status");
 result.setAttribute("aria-live","polite");
 const section=document.querySelector(".section-head");
 section?.append(result);
}
if(result){
 result.textContent=done+"/"+cards.length+" lessons marked reviewed for this learner";
 try{
  if(localStorage.getItem("khaemenes-topology-differential-geometry-lessons-v1")!==null)
   result.title="Older unassigned lesson records remain preserved and are not included in this learner's total.";
 }catch{}
}
})();
