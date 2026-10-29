/* Local-only readiness routing; no remote data, credentials or grade authority. */
(() => {
"use strict";
const COURSE_KEY="khaemenes-topology-differential-geometry-course-v1";
const ASSESS_KEY="khaemenes-topology-differential-geometry-assessment-v2:";
const SUPPORT_KEY="khaemenes-topology-differential-geometry-unit00-v1:";
function get(k,f=null){try{const v=JSON.parse(localStorage.getItem(k)||"null");return v??f}catch{return f}}
function learnerId(){
 const registry=get("khaemenes_family_registry_v1");
 const active=get("khaemenes_active_learner_v1");
 const raw=typeof active==="string"?active:active?.learnerId;
 if(raw&&registry?.learners?.[raw]&&String(registry.learners[raw].stage||"").toLowerCase()==="higher")return String(raw).slice(0,90);
 const course=get(COURSE_KEY,{});
 return String(course?.activeId||"learner-1").slice(0,90);
}
function records(id=learnerId()){const v=get(SUPPORT_KEY+id,{});return v&&typeof v==="object"?v:{}}
function attempts(id=learnerId()){return get(ASSESS_KEY+id,{})?.diagnostic?.attempts||[]}
function summary(id=learnerId()){
 const history=attempts(id);
 const validHistory=history.filter(a=>a.assessmentVersion==="topology-readiness-v2");
 const best=validHistory.length?Math.max(...validHistory.map(x=>Number(x.score)||0)):null;
 const archived=history.length-validHistory.length;
 const support=records(id),done=Array.from({length:6},(_,i)=>support?.lessons?.[i+1]?.passed===true).filter(Boolean).length;
 const exit=support?.exit?.passed===true&&Number(support?.exit?.score)>=80&&support?.exit?.correctionsComplete===true;
 // Never silently invalidate existing progress created before the new placement model.
 const existing=get(COURSE_KEY,{});
 const student=existing?.students?.find(s=>s.id===id);
 const historical=!!student&&Object.values(student.weeks||{}).some(w=>w&&(
  Object.values(w.days||{}).some(Boolean)||Number(w.masteryBest)>=80||Number(w.classwork)>=80));
 if(best!==null&&best>=80)return{id,best,done,mode:"direct",route:"units/unit-01/index.html",message:"Readiness gateway passed at 80% or above. Begin the official course."};
 if(exit)return{id,best,done,mode:"supported",route:"units/unit-01/index.html",message:"Six foundation lessons and the Unit 00 exit are complete. Begin the official course."};
 if(historical)return{id,best,done,mode:"legacy",route:"units/unit-01/index.html",message:"Existing course activity is preserved. A retrospective readiness check is recommended but is not used to erase past work."};
 if(best===null)return{id,best,done,mode:"diagnostic",route:"diagnostic/index.html",message:archived?"An earlier unversioned diagnostic remains saved as historical practice. Complete the revised 40-question readiness diagnostic to obtain current placement guidance.":"Complete the revised 40-question readiness diagnostic to select the appropriate starting route."};
 return{id,best,done,mode:"bridge",route:"units/unit-00/index.html",message:"Diagnostic below 80%: complete the six-lesson prerequisite bridge and its exit evidence before starting Unit 01."};
}
window.KhaemenesTopologyReadiness={learnerId,records,attempts,summary,supportKey:id=>SUPPORT_KEY+(id||learnerId())};
})();
