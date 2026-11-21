(()=>{"use strict";
const ROOT="khaemenes-calculus3-multivariable-course-v1";
function parse(k){try{return JSON.parse(localStorage.getItem(k)||"null")}catch{return null}}
function academyLearner(){try{const a=parse("khaemenes_active_learner_v1"),reg=parse("khaemenes_family_registry_v1"),id=typeof a==="string"?a:a?.learnerId,l=id?reg?.learners?.[id]:null;return l?.learnerId===id?{id:String(id),name:String(l.nickname||l.name||"Learner")}:null}catch{return null}}
function defaultStudent(l){return{id:l?.id||"unbound",name:l?.name||"Learner",pathway:"Core",weeks:{},formal:{diagnostic:null,midterm:null,final:null,capstone:null},notes:""}}
function normalize(raw){
 const a=academyLearner();
 if(!raw||!Array.isArray(raw.students))raw={version:1,activeId:a?.id||"unbound",students:[defaultStudent(a)]};
 if(a&&!raw.students.some(s=>s?.id===a.id))raw.students.push(defaultStudent(a));
 if(a)raw.activeId=a.id;
 return raw;
}
function load(){return normalize(parse(ROOT))}
function save(s){try{const raw=JSON.stringify(s);localStorage.setItem(ROOT,raw);return localStorage.getItem(ROOT)===raw}catch{return false}}
function active(s=load()){return s.students.find(x=>x?.id===s.activeId)||s.students[0]||null}
function render(){
 const root=document.querySelector("#recordRoot");if(!root)return;
 const s=load(),l=active(s);save(s);
 root.innerHTML='<section class="lesson-section"><p class="eyebrow">Calculus III · Learner-owned records</p><h1>Calculus III Course Records</h1><p>'+(l?l.name+" · "+l.id:"No Academy learner is currently bound.")+'</p><p>Diagnostic, unit mastery reviews, corrections, midterm, final and capstone defense remain separate evidence streams. This browser-local record never awards credit by itself.</p><p><a href="diagnostic/">Readiness Diagnostic</a> · <a href="assessments/midterm.html">Midterm</a> · <a href="assessments/final.html">Final</a> · <a href="records/course-completion-certificate.html">Completion Record</a></p><button type="button" data-higher-math-evidence-receipt>Export Mathematics Evidence Receipt</button></section>';
}
addEventListener("DOMContentLoaded",render,{once:true});
window.KhaemenesCalculus3Record=Object.freeze({load,save,active,academyLearner});
})();