/* Higher Learning readiness evidence importer v1.
 * Imports High School Algebra II / Geometry readiness receipts as learner-scoped advisory evidence.
 * Never auto-unlocks a course, awards credit, or accepts name-only identity matches.
 */
(function attach(global){
"use strict";
if(global.KhaemenesHigherMathReadinessImport)return;
const SCHEMA="khaemenes-high-to-higher-math-readiness-receipt-v1";
const ALLOWED=new Set(["algebra-2","geometry"]);
function parse(key){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):null}catch{return null}}
function academyLearner(){
 try{
  const active=parse("khaemenes_active_learner_v1");
  const registry=parse("khaemenes_family_registry_v1");
  const id=typeof active==="string"?active:active?.learnerId;
  const learner=id?registry?.learners?.[id]:null;
  return learner?.learnerId===id?{learnerId:String(id),name:String(learner.nickname||learner.name||"Learner"),stage:String(learner.stage||"")}:null;
 }catch{return null}
}
function validate(payload){
 if(!payload||payload.schema!==SCHEMA)throw Error("unsupported readiness receipt");
 const course=String(payload.course?.courseId||"");
 if(!ALLOWED.has(course))throw Error("receipt must be Algebra II or Geometry");
 if(payload.authority?.automaticUnlock!==false||payload.authority?.awardsCredit!==false)throw Error("unsafe receipt authority");
 if(payload.identity?.bindingStatus!=="explicit-id-match")throw Error("source receipt is not bound to an exact Academy learner ID");
 const sourceLearner=String(payload.identity?.academyLearner?.learnerId||"");
 if(!sourceLearner)throw Error("source learner ID missing");
 return {course,sourceLearner};
}
function key(id){return "khaemenes-higher-math-readiness-evidence-v1:"+encodeURIComponent(id)}
function importPayload(payload){
 const learner=academyLearner();if(!learner?.learnerId)throw Error("no active Academy learner");
 const v=validate(payload);
 if(v.sourceLearner!==learner.learnerId)throw Error("receipt belongs to a different learner");
 const k=key(learner.learnerId),existing=parse(k)||{schema:"khaemenes-higher-math-readiness-evidence-store-v1",learnerId:learner.learnerId,receipts:{}};
 existing.receipts[v.course]={...payload,importedAt:new Date().toISOString(),receivingAuthority:"advisory-prerequisite-evidence-only"};
 const raw=JSON.stringify(existing);
 localStorage.setItem(k,raw);
 if(localStorage.getItem(k)!==raw)throw Error("readiness evidence did not persist");
 return summary(existing);
}
function summary(store){
 const receipts=store?.receipts||{};
 return {
  learnerId:store?.learnerId||null,
  algebra2:Boolean(receipts["algebra-2"]),
  geometry:Boolean(receipts.geometry),
  completePair:Boolean(receipts["algebra-2"]&&receipts.geometry),
  automaticUnlock:false,
  note:"Imported evidence supports placement review only. The receiving diagnostic/mastery contract remains authoritative."
 };
}
function current(){
 const learner=academyLearner();if(!learner?.learnerId)return null;
 return summary(parse(key(learner.learnerId))||{learnerId:learner.learnerId,receipts:{}});
}
function setStatus(msg){
 const el=document.querySelector("[data-higher-math-readiness-import-status]");
 if(el)el.textContent=msg;
}
function chooseFile(){
 const input=document.createElement("input");input.type="file";input.accept=".json,application/json";input.hidden=true;
 input.addEventListener("change",async()=>{
  const file=input.files?.[0];if(!file)return;
  try{
   const payload=JSON.parse(await file.text()),s=importPayload(payload);
   setStatus((s.completePair?"Algebra II and Geometry readiness evidence imported. ":"Readiness evidence imported. ")+"Placement remains subject to the Higher Learning diagnostic and mastery rules.");
  }catch(err){setStatus("Import rejected: "+err.message)}
  input.remove();
 },{once:true});
 document.body.appendChild(input);input.click();
}
document.addEventListener("click",e=>{
 const b=e.target?.closest?.("[data-higher-math-readiness-import]");
 if(!b)return;e.preventDefault();chooseFile();
});
document.addEventListener("DOMContentLoaded",()=>{
 const s=current();
 if(s) setStatus(s.completePair?"Algebra II and Geometry readiness evidence is available for this learner. It does not auto-unlock Precalculus.":"No complete Algebra II + Geometry readiness evidence pair is stored for this learner.");
},{once:true});
global.KhaemenesHigherMathReadinessImport=Object.freeze({version:"1.0.0",validate,importPayload,current,automaticUnlock:false,awardsCredit:false});
})(window);
