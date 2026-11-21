/* Higher Learning mathematics evidence receipt v1.
 * Read-only exporter for learner-visible evidence. No automatic transcript credit,
 * no cross-repository write, no assessment-answer export, no identity guessing.
 */
(function attachHigherMathEvidenceReceipt(global){
"use strict";
if(global.KhaemenesHigherMathEvidenceReceipt)return;
const CONFIG={
 "precalculus-trigonometry":{
  title:"Precalculus & Trigonometry",courseId:"precalculus-trigonometry",aliases:[],
  rootKey:"khaemenes-precalculus-trigonometry-course-v1",
  assessmentPrefix:"khaemenes-precalculus-trigonometry-assessment-records-v2",
  legacyAssessmentKey:"khaemenes-precalculus-trigonometry-assessment-records-v1"
 },
 "calculus-1":{
  title:"Calculus I",courseId:"calculus-i",aliases:["calculus-1"],
  rootKey:"khaemenes-calculus1-course-v1",
  assessmentPrefix:"khaemenes-calculus1-assessment-records-v2"
 },
 "calculus-ii":{
  title:"Calculus II",courseId:"calculus-ii",aliases:[],
  rootKey:"khaemenes-calculus2-college-course-v1",
  assessmentPrefix:"khaemenes-calculus2-assessment-records-v2",
  legacyAssessmentKey:"khaemenes-calculus2-assessment-records-v1"
 },
 "calculus-iii-multivariable":{
  title:"Calculus III · Multivariable & Vector Calculus",courseId:"calculus-iii-multivariable",aliases:["calculus-3","multivariable-calculus"],
  rootKey:"khaemenes-calculus3-multivariable-course-v1",
  assessmentPrefix:"khaemenes-calculus3-multivariable-assessment-records-v2",
  legacyAssessmentKey:"khaemenes-calculus3-multivariable-assessment-records-v1"
 },
 "differential-equations":{
  title:"Differential Equations",courseId:"differential-equations",aliases:[],
  rootKey:"khaemenes-differential-equations-college-course-v1",
  assessmentPrefix:"khaemenes-differential-equations-assessment-records-v2",
  legacyAssessmentKey:"khaemenes-differential-equations-assessment-records-v1"
 },
 "linear-algebra":{
  title:"Linear Algebra",courseId:"linear-algebra",aliases:[],
  rootKey:"khaemenes-linear-algebra-college-course-v1",
  assessmentPrefix:"khaemenes-linear-algebra-assessment-records-v2",
  legacyAssessmentKey:"khaemenes-linear-algebra-assessment-records-v1"
 },
 "introduction-to-proofs":{
  title:"Introduction to Proofs",courseId:"introduction-to-proofs",aliases:[],
  rootKey:"khaemenes-introduction-to-proofs-course-v1",
  assessmentPrefix:"khaemenes-introduction-to-proofs-assessment-v2",
  legacyAssessmentKey:"khaemenes-introduction-to-proofs-assessment-v1",
  proofReviewRequired:true
 },
 "abstract-algebra":{
  title:"Abstract Algebra",courseId:"abstract-algebra",aliases:[],
  rootKey:"khaemenes-abstract-algebra-course-v1",
  assessmentPrefix:"khaemenes-abstract-algebra-assessment-v2",
  legacyAssessmentKey:"khaemenes-abstract-algebra-assessment-v1",
  proofReviewRequired:true
 },
 "real-complex-analysis":{
  title:"Real & Complex Analysis",courseId:"real-complex-analysis",aliases:[],
  rootKey:"khaemenes-real-complex-analysis-course-v1",
  assessmentPrefix:"khaemenes-real-complex-analysis-assessment-v2",
  legacyAssessmentKey:"khaemenes-real-complex-analysis-assessment-v1",
  proofReviewRequired:true
 },
 "topology-differential-geometry":{
  title:"Topology & Differential Geometry",courseId:"topology-differential-geometry",aliases:[],
  rootKey:"khaemenes-topology-differential-geometry-course-v1",
  assessmentPrefix:"khaemenes-topology-differential-geometry-assessment-v2",
  legacyAssessmentKey:"khaemenes-topology-differential-geometry-assessment-v1",
  proofReviewRequired:true
 }
};
function config(){
 const path=String(location.pathname);
 let m=path.match(/\/courses\/mathematics\/(precalculus-trigonometry|calculus-1)(?:\/|$)/);
 if(m)return CONFIG[m[1]];
 m=path.match(/\/courses\/(calculus-ii|calculus-iii-multivariable|differential-equations|linear-algebra|introduction-to-proofs|abstract-algebra|real-complex-analysis|topology-differential-geometry)(?:\/|$)/);
 return m?CONFIG[m[1]]:null;
}
function parse(key){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):null}catch{return null}}
function academyLearner(){
 try{
  const active=JSON.parse(localStorage.getItem("khaemenes_active_learner_v1")||"null");
  const registry=JSON.parse(localStorage.getItem("khaemenes_family_registry_v1")||"null");
  const learner=typeof active==="string"?registry?.learners?.[active]:null;
  return learner?.learnerId===active?{learnerId:active,name:String(learner.nickname||learner.name||"Learner"),stage:String(learner.stage||"")}:null;
 }catch{return null}
}
function localLearner(cfg){
 const state=parse(cfg.rootKey),rows=Array.isArray(state?.students)?state.students:[];
 const learner=rows.find(x=>x?.id===state?.activeId)||rows[0]||null;
 return learner?.id?learner:null;
}
function assessmentRows(cfg,local){
 if(!local?.id)return [];
 const store=parse(cfg.assessmentPrefix+":"+encodeURIComponent(local.id))||{};
 const out=[];
 for(const [assessmentId,record] of Object.entries(store)){
  const attempts=Array.isArray(record?.attempts)?record.attempts:[];
  for(const a of attempts.slice(-20)){
   const score=Number(a?.score),total=Number(a?.total),right=Number(a?.right);
   if(!Number.isFinite(score)||score<0||score>100)continue;
   out.push({
    assessmentId:String(assessmentId).slice(0,120),
    title:String(record?.title||assessmentId).slice(0,140),
    score,
    right:Number.isFinite(right)?right:null,
    total:Number.isFinite(total)?total:null,
    attemptedAt:String(a?.date||"").slice(0,40),
    source:String(a?.source||"browser-local-assessment").slice(0,120),
    practicePassed:a?.practicePassed===true,
    pathway:String(a?.pathway||"").slice(0,80)
   });
  }
 }
 return out;
}
function build(){
 const cfg=config();if(!cfg)throw Error("unsupported-course");
 const local=localLearner(cfg),academy=academyLearner();
 if(!local?.id)throw Error("no-active-local-course-learner");
 const state=parse(cfg.rootKey)||{},weeks=local.weeks&&typeof local.weeks==="object"?local.weeks:{};
 const completedWeeks=Object.values(weeks).filter(w=>w?.days&&Object.values(w.days).filter(Boolean).length===5).length;
 const binding=academy?.learnerId&&academy.learnerId===String(local.id)?"explicit-id-match":"unverified";
 return {
  schema:"khaemenes-higher-math-evidence-receipt-v1",
  generatedAt:new Date().toISOString(),
  sourceRepository:"vervenveda/Khaemenes_Higher_Learning.github.io",
  sourceOrigin:location.origin,
  course:{courseId:cfg.courseId,aliases:cfg.aliases,title:cfg.title,route:location.pathname},
  identity:{
   localCourseLearner:{id:String(local.id),name:String(local.name||"").slice(0,100)},
   academyLearner:academy,
   bindingStatus:binding,
   bindingRule:"Only an exact learner-id match is treated as bound. Name similarity is never sufficient."
  },
  progress:{completedSessionWeeks:completedWeeks,totalWeeks:36,percent:Math.round(completedWeeks/36*100)},
  formalReported:{
   diagnostic:Number.isFinite(Number(local.formal?.diagnostic))?Number(local.formal.diagnostic):null,
   midterm:Number.isFinite(Number(local.formal?.midterm))?Number(local.formal.midterm):null,
   final:Number.isFinite(Number(local.formal?.final))?Number(local.formal.final):null,
   capstone:Number.isFinite(Number(local.formal?.capstone))?Number(local.formal.capstone):null,
   authority:"self/instructor-reported local notes; not verified transcript grades"
  },
  assessments:assessmentRows(cfg,local),
  provenance:{
   courseStorageKey:cfg.rootKey,
   assessmentStorageKey:cfg.assessmentPrefix+":"+encodeURIComponent(local.id),
   legacyAssessmentKey:cfg.legacyAssessmentKey||null,
   legacyAssessmentImported:false,
   includesAssessmentAnswers:false,
   writesSourceRecords:false,
   awardsCredit:false,
   highSchoolImportCertified:false,
   proofReviewRequired:cfg.proofReviewRequired===true,
   proofReviewStatus:cfg.proofReviewRequired===true?"requires-evaluator-review":"not-applicable"
  }
 };
}
function download(){
 const payload=build(),blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="khaemenes-"+payload.course.courseId+"-evidence-receipt.json";
 document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 return payload;
}
document.addEventListener("click",e=>{
 const b=e.target?.closest?.("[data-higher-math-evidence-receipt]");
 if(!b)return;e.preventDefault();
 try{download()}catch(err){alert("Evidence receipt could not be created: "+err.message)}
});
global.KhaemenesHigherMathEvidenceReceipt=Object.freeze({version:"1.0.0",build,download,writesSourceRecords:false,awardsCredit:false,highSchoolImportCertified:false});
})(window);
