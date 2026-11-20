(() => {
"use strict";
const cfg=window.PCT_ASSESSMENT_CONFIG||{};
const all=cfg.source==="diagnostic"?window.PRECALCULUS_DIAGNOSTIC:window.PRECALCULUS_QUESTIONS;
const host=document.getElementById("assessmentRoot");
if(!host||!Array.isArray(all))return;
const ROOT_KEY="khaemenes-precalculus-trigonometry-course-v1";
const HISTORY_PREFIX="khaemenes-precalculus-trigonometry-assessment-records-v2";
const LEGACY_KEY="khaemenes-precalculus-trigonometry-assessment-records-v1";
function activeLearner(){
 try{
  const state=JSON.parse(localStorage.getItem(ROOT_KEY)||"null");
  const learner=state?.students?.find?.(x=>x?.id===state?.activeId)||state?.students?.[0]||null;
  return learner?.id?{id:String(learner.id),name:String(learner.name||"")}:null;
 }catch{return null}
}
function key(){const learner=activeLearner();return learner?HISTORY_PREFIX+":"+encodeURIComponent(learner.id):null}
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function load(){
 const KEY=key();if(!KEY)return {};
 try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch{return {}}
}
function legacyRecords(){
 try{return JSON.parse(localStorage.getItem(LEGACY_KEY)||"{}")}catch{return {}}
}
function save(x){
 const KEY=key();if(!KEY)return false;
 try{localStorage.setItem(KEY,JSON.stringify(x));return true}catch{return false}
}
function publishReadinessCompatibility(record){
 if(cfg.recordKey!=="diagnostic"||!record)return false;
 const contract=window.KhaemenesCourseEntryContract,profile=contract?.readAcademyProfile?.();
 if(!contract?.writeJSON||!profile?.learnerId)return false;
 try{
  return contract.writeJSON(LEGACY_KEY,{diagnostic:{title:cfg.title||"Readiness Diagnostic",attempts:[{
   date:record.date,score:record.score,right:record.right,total:record.total,learnerId:profile.learnerId,
   source:"readiness-compatibility-summary-v1",practicePassed:record.practicePassed===true
  }]}},profile)!==false;
 }catch{return false}
}
function shuffle(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
function pool(){
 let p=[...all];
 if(Array.isArray(cfg.units)&&cfg.units.length)p=p.filter(q=>cfg.units.includes(q.unit));
 return p;
}
let set=[];
function records(){return load()}
function best(){
 const arr=records()[cfg.recordKey]?.attempts||[];
 return arr.length?Math.max(...arr.map(x=>x.score)):null;
}
function start(){
 set=shuffle(pool()).slice(0,Math.min(Number(cfg.count)||10,pool().length));
 const token=`pct-${Date.now()}`;
 host.innerHTML=`<article class="card"><div class="form-grid"><label>Learner name or initials<input id="assessmentLearner" maxlength="60" placeholder="Optional local label"></label><label>Pathway<select id="assessmentPathway"><option>Foundation</option><option selected>Core</option><option>Extended</option></select></label></div><p class="notice">${esc(cfg.instructions||"Answer every question. Submit once complete, review explanations, and correct missed work.")}</p></article>`+
 set.map((q,i)=>`<article class="question"><fieldset><legend>${i+1}. ${esc(q.prompt)}</legend><div class="options">${q.options.map((o,j)=>`<label class="option"><input type="radio" name="${token}-q${i}" value="${j}"><span>${esc(o)}</span></label>`).join("")}</div><div class="feedback" id="${token}-fb${i}" hidden></div></fieldset></article>`).join("")+
 `<div class="assessment-result"><button class="btn primary" id="submitAssessment" type="button">Submit &amp; Score</button><button class="btn" id="printAssessment" type="button">Print</button><p id="assessmentMessage">Best saved score: ${best()==null?"—":best()+"%"}</p><p class="notice">New attempts are saved only to the active local learner. Any older unscoped v1 assessment history remains untouched and is not automatically attributed.</p></div>`;
 document.getElementById("submitAssessment").addEventListener("click",()=>score(token));
 document.getElementById("printAssessment").addEventListener("click",()=>print());
}
function score(token){
 let right=0,complete=true,missed=[];
 set.forEach((q,i)=>{
  const selected=document.querySelector(`input[name="${token}-q${i}"]:checked`);
  const fb=document.getElementById(`${token}-fb${i}`);fb.hidden=false;
  if(!selected){complete=false;fb.className="feedback bad";fb.textContent="Choose an answer.";return}
  const ok=Number(selected.value)===q.answer;if(ok)right++;else missed.push(q.id);
  fb.className=`feedback ${ok?"good":"bad"}`;
  fb.textContent=`${ok?"Correct.":"Review."} ${q.explanation}`;
 });
 if(!complete){document.getElementById("assessmentMessage").textContent="Answer every question before scoring.";return}
 const score=Math.round(right/set.length*100),data=records(),key=cfg.recordKey||"assessment";
 data[key]=data[key]||{title:cfg.title||key,attempts:[]};
 const learner=activeLearner();
const attempt={date:new Date().toISOString(),score,right,total:set.length,missed,learner:document.getElementById("assessmentLearner").value.trim(),learnerId:learner?.id||null,pathway:document.getElementById("assessmentPathway").value,source:"public-formative-practice",practicePassed:score>=80};
 data[key].attempts.push(attempt);
 save(data);
 publishReadinessCompatibility(attempt);
 document.getElementById("assessmentMessage").innerHTML=`<span class="score">${score}%</span> · ${right}/${set.length} · Best ${Math.max(...data[key].attempts.map(x=>x.score))}%`;
 document.getElementById("submitAssessment").disabled=true;
}
document.getElementById("startAssessment")?.addEventListener("click",start);
document.getElementById("resetAssessment")?.addEventListener("click",()=>{if(confirm("Start a new attempt?"))start()});
start();
})();