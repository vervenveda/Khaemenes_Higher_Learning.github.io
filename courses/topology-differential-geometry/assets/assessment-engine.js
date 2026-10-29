(() => {
"use strict";
const cfg=window.TOPOLOGY_DIFFERENTIAL_GEOMETRY_ASSESSMENT_CONFIG||{};
const all=cfg.source==="diagnostic"?window.TOPOLOGY_DIFFERENTIAL_GEOMETRY_DIAGNOSTIC:window.TOPOLOGY_DIFFERENTIAL_GEOMETRY_QUESTIONS;
const host=document.getElementById("assessmentRoot");
if(!host||!Array.isArray(all))return;
// Keep legacy unscoped records intact; never silently assign another learner's results.
function activeLearnerId(){
 try{
  const id=JSON.parse(localStorage.getItem("khaemenes_active_learner_v1")||"null");
  if(typeof id==="string"&&id.trim())return id.trim().slice(0,90);
  if(id&&typeof id==="object"&&id.learnerId)return String(id.learnerId).slice(0,90);
 }catch{}
 try{
  const course=JSON.parse(localStorage.getItem("khaemenes-topology-differential-geometry-course-v1")||"{}");
  if(course.activeId)return String(course.activeId).slice(0,90);
 }catch{}
 return "learner-1";
}
const LEARNER=activeLearnerId();
const KEY="khaemenes-topology-differential-geometry-assessment-v2:"+LEARNER;
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function load(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch{return {}}}
function save(x){try{localStorage.setItem(KEY,JSON.stringify(x))}catch{}}
function shuffle(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
function pool(){
 let p=[...all];
 if(Array.isArray(cfg.units)&&cfg.units.length)p=p.filter(q=>cfg.units.includes(q.unit));
 return p;
}
let set=[];
function rememberDraft(token){
 const d=records(),key=cfg.recordKey||"assessment";
 d[key]=d[key]||{title:cfg.title||key,attempts:[]};
 d[key].draft={ids:set.map(q=>q.id),choices:set.map((q,i)=>{
   const selected=document.querySelector('input[name="'+token+'-q'+i+'"]:checked');
   return selected?Number(selected.value):null;
 }),passed:false,updated:new Date().toISOString()};
 save(d);
}
function records(){return load()}
function best(){
 const arr=records()[cfg.recordKey]?.attempts||[];
 return arr.length?Math.max(...arr.map(x=>x.score)):null;
}
function start(newAttempt=false){
 const d=records(),key=cfg.recordKey||"assessment",old=d[key]?.draft;
 const items=pool(),byId=new Map(items.map(q=>[q.id,q]));
 if(!newAttempt&&old&&!old.passed&&Array.isArray(old.ids)&&old.ids.every(id=>byId.has(id))){
  set=old.ids.map(id=>byId.get(id));
 }else{
  set=shuffle(items).slice(0,Math.min(Number(cfg.count)||10,items.length));
 }
 const token=`topology-differential-geometry-${Date.now()}`;
 host.innerHTML=`<article class="card"><div class="form-grid"><label>Learner name or initials<input id="assessmentLearner" maxlength="60" placeholder="Optional local label"></label><label>Pathway<select id="assessmentPathway"><option>Foundation</option><option selected>Core</option><option>Research / Graduate</option></select></label></div><p class="notice">${esc(cfg.instructions||"Answer every question. Submit once complete, review explanations, and correct missed work.")}</p></article>`+
 set.map((q,i)=>`<article class="question"><fieldset><legend>${i+1}. ${esc(q.prompt)}</legend><div class="options">${q.options.map((o,j)=>`<label class="option"><input type="radio" name="${token}-q${i}" value="${j}"><span>${esc(o)}</span></label>`).join("")}</div><div class="feedback" id="${token}-fb${i}" hidden></div></fieldset></article>`).join("")+
 `<div class="assessment-result"><button class="btn primary" id="submitAssessment" type="button">Submit &amp; Score</button><button class="btn" id="printAssessment" type="button">Print</button><p id="assessmentMessage">Best saved score: ${best()==null?"—":best()+"%"}</p></div>`;
 const choices=(!newAttempt&&old&&!old.passed&&Array.isArray(old.choices))?old.choices:[];
 set.forEach((q,i)=>{
  if(choices[i]!==null&&choices[i]!==undefined){
   const box=document.querySelector('input[name="'+token+'-q'+i+'"][value="'+choices[i]+'"]');
   if(box)box.checked=true;
  }
 });
 host.onchange=event=>{
  if(event.target?.matches('input[type="radio"]'))rememberDraft(token);
 };
 rememberDraft(token);
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
 data[key].attempts.push({date:new Date().toISOString(),score,right,total:set.length,missed,learner:document.getElementById("assessmentLearner").value.trim(),pathway:document.getElementById("assessmentPathway").value});
 if(data[key].draft){
  data[key].draft.passed=score>=80;
  data[key].draft.lastScore=score;
 }
 save(data);
 document.getElementById("assessmentMessage").innerHTML=`<span class="score">${score}%</span> · ${right}/${set.length} · Best ${Math.max(...data[key].attempts.map(x=>x.score))}%`;
 if(score>=80){
  document.querySelectorAll('#assessmentRoot input[type="radio"]').forEach(input=>input.disabled=true);
  document.getElementById("submitAssessment").disabled=true;
  document.getElementById("assessmentMessage").insertAdjacentText("beforeend"," · 80% practice threshold met; answers locked. Academic proof review is separate.");
 }else{
  document.getElementById("assessmentMessage").insertAdjacentText("beforeend"," · Below 80%: revise selected answers and submit again; the same question set is retained.");
 }
}
document.getElementById("startAssessment")?.addEventListener("click",()=>start(true));
document.getElementById("resetAssessment")?.addEventListener("click",()=>{if(confirm("Start a new attempt? Unpassed corrections will be replaced only for this assessment."))start(true)});
start(false);
})();