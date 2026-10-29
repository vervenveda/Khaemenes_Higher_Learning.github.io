/* Six-module optional support bridge. Practice scores are local, editable evidence. */
(() => {
"use strict";
const M=window.KHAEMENES_TOPOLOGY_UNIT00?.modules, Q=window.KHAEMENES_TOPOLOGY_UNIT00_QUESTIONS;
const R=window.KhaemenesTopologyReadiness;
if(!Array.isArray(M)||!Array.isArray(Q)||!R)return;
const id=R.learnerId(),key=R.supportKey(id),host=document.getElementById("bridgeContent");
if(!host)return;
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const read=()=>{try{const x=JSON.parse(localStorage.getItem(key)||"{}");return x&&typeof x==="object"?x:{}}catch{return {}}};
let state=read();state.lessons??={};
const save=()=>{try{localStorage.setItem(key,JSON.stringify(state));return true}catch{status("Browser storage unavailable; print or export your evidence.");return false}};
function status(msg){const x=document.getElementById("bridgeStatus");if(x)x.textContent=msg}
function link(n){return"lessons/u00-l"+String(n).padStart(2,"0")+".html"}
function exportJSON(){const blob=new Blob([JSON.stringify({course:"Topology & Differential Geometry",kind:"conditional readiness support",learner:id,verified:false,evidence:state,exported:new Date().toISOString()},null,2)],{type:"application/json"});const a=document.createElement("a"),url=URL.createObjectURL(blob);a.href=url;a.download="topology-unit00-evidence.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function actions(){return'<div class="actions"><button type="button" class="btn" id="exportBridge">Export Evidence</button><button type="button" class="btn" id="printBridge">Print</button></div><p id="bridgeStatus" role="status" aria-live="polite"></p>'}
function controls(){document.getElementById("exportBridge")?.addEventListener("click",exportJSON);document.getElementById("printBridge")?.addEventListener("click",()=>window.print())}
function renderHome(){
 const route=R.summary(id),complete=M.filter((_,i)=>state.lessons[i+1]?.passed===true).length;
 host.innerHTML='<section class="stage"><p class="eyebrow">Conditional Unit 00 · Prerequisite foundation</p><h1>Proof and Geometry Readiness Bridge</h1><p>Six tutorial lessons before the official 36-week, 92-lesson course. This pathway supports proof fluency, real analysis, multivariable calculus and linear algebra; it does not add official course credit or overwrite prior grades.</p><p><strong>'+esc(route.message)+'</strong></p><p>'+complete+'/6 lesson checks passed. The exit requires at least 80% on 24 cumulative questions plus written reasoning and corrections; faculty evaluation is separate.</p><div class="actions"><a class="btn" href="../../diagnostic/index.html">Readiness Diagnostic</a><a class="btn" href="../../index.html">Course Home</a></div></section>'+
 '<section class="stage"><h2>Six prerequisite lessons</h2><div class="bridge-grid">'+M.map((m,i)=>{const n=i+1,r=state.lessons[n],open=n===1||state.lessons[n-1]?.passed===true;return'<article class="card"><p>Lesson '+n+' · '+esc(m.strand)+'</p><h3>'+esc(m.title)+'</h3><p>'+(!r?"Not started":r.passed?"Practice passed · "+r.score+"%":"Current score "+(r.score??"—")+"%")+'</p>'+(open?'<a class="btn primary" href="'+link(n)+'">Open Lesson '+n+'</a>':'<p>Finish Lesson '+(n-1)+' at 80% first.</p>')+'</article>'}).join("")+'</div></section>'+
 '<section class="stage"><h2>Unit 00 Exit and Official Unit 01</h2>'+(complete===6?'<a class="btn primary" href="exit-check.html">Open 24-Question Unit 00 Exit</a>':'<p>Complete all six lesson mastery checks to unlock the exit checkpoint.</p>')+'<p>Exit result: '+(state.exit?.passed?"80%+ checkpoint passed with written corrections":"Not complete")+'</p><a class="btn" href="../../units/unit-01/index.html">Visit Official Unit 01</a></section>'+actions();
 controls();
}
function selectedChoices(scope){return [...scope.querySelectorAll("[data-q]")].map((card,i)=>{const x=card.querySelector('input[type="radio"]:checked');return x?Number(x.value):null})}
function buildQuestions(list,record,locked){
 const existing=Array.isArray(record?.choices)?record.choices:[];
 return list.map((q,i)=>'<fieldset class="bridge-question" data-q><legend>'+(i+1)+'. '+esc(q.prompt)+'</legend>'+q.options.map((v,j)=>'<label class="bridge-choice"><input type="radio" name="bq'+i+'" value="'+j+'" '+(existing[i]===j?"checked ":"")+(locked?"disabled ":"")+'> '+esc(v)+'</label>').join("")+'<p class="bridge-feedback" hidden></p></fieldset>').join("");
}
function renderLesson(n){
 const m=M[n-1],previous=state.lessons[n-1],blocked=n>1&&!previous?.passed;
 if(blocked){host.innerHTML='<section class="stage"><h1>Lesson '+n+' preparation</h1><p>Lesson '+(n-1)+' requires 80% first. Existing evidence remains saved.</p><a class="btn" href="'+link(n-1).split("/").pop()+'">Return to previous lesson</a></section>';return}
 const qs=Q.filter(q=>q.module===n),rec=state.lessons[n]||{choices:[],attempts:[],proof:"",corrections:"",passed:false,score:null};
 state.lessons[n]=rec;
 host.innerHTML='<section class="stage"><p class="eyebrow">Unit 00 · Lesson '+n+' of 6</p><h1>'+esc(m.title)+'</h1><p>'+esc(m.lecture)+'</p><h2>Worked mathematical examples</h2><ol>'+m.worked.map(w=>'<li>'+esc(w)+'</li>').join("")+'</ol><h2>Independent proof and transfer</h2><p>'+esc(m.task)+'</p><h3>Common misconception to address</h3><p>'+esc(m.pitfall)+'</p><label class="block-label" for="bridgeProof">Your mathematical derivation and reasoning</label><textarea id="bridgeProof" rows="5" placeholder="State each definition and justify your inferences."></textarea><label class="block-label" for="bridgeCorrections">Counterexample, limitation or corrected misconception</label><textarea id="bridgeCorrections" rows="4" placeholder="Explain a meaningful counterexample or why a hypothesis matters."></textarea></section>'+
 '<section class="stage"><h2>Ten-question formative assessment</h2><p>Eight correct answers out of ten meet 80%. Below 80%, correct answers without changing this question set. Once passed, answers lock. Written reasoning is saved as evidence, not independently graded.</p><div id="bridgeQuestions">'+buildQuestions(qs,rec,rec.passed)+'</div><div class="actions"><button id="submitBridge" type="button" class="btn primary" '+(rec.passed?"disabled":"")+'>Submit Assignment</button><a class="btn" href="../index.html">Unit 00 Overview</a></div><p id="lessonScore" role="status" aria-live="polite">'+(rec.score==null?"Not yet scored":rec.score+"% · "+(rec.passed?"Practice passed; answers locked":"Correct and resubmit"))+'</p></section>'+actions();
 const proof=document.getElementById("bridgeProof"),corrections=document.getElementById("bridgeCorrections"),list=document.getElementById("bridgeQuestions");
 proof.value=rec.proof||"";corrections.value=rec.corrections||"";
 function draft(){rec.proof=proof.value;rec.corrections=corrections.value;rec.choices=selectedChoices(list);save()}
 proof.addEventListener("input",draft);corrections.addEventListener("input",draft);list.addEventListener("change",draft);
 document.getElementById("submitBridge").onclick=()=>{
  draft();if(rec.choices.some(x=>x===null)||rec.choices.length!==10){status("Answer all ten questions.");return}
  const correct=qs.filter((q,i)=>rec.choices[i]===q.answer).length,score=correct*10;
  rec.attempts??=[];rec.attempts.push({date:new Date().toISOString(),score,correct,total:10});rec.score=score;
  const explained=rec.proof.trim().length>=40&&rec.corrections.trim().length>=30;
  rec.passed=score>=80&&explained;save();
  [...list.querySelectorAll("[data-q]")].forEach((card,i)=>{const f=card.querySelector(".bridge-feedback");f.hidden=false;f.textContent=(rec.choices[i]===qs[i].answer?"Correct. ":"Review: ")+qs[i].explanation});
  if(rec.passed){list.querySelectorAll("input").forEach(input=>input.disabled=true);document.getElementById("submitBridge").disabled=true;}
  document.getElementById("lessonScore").textContent=score+"% · "+(rec.passed?"Practice checkpoint passed; answer controls locked.":"Correct the same questions; both independent proof and misconception explanation are also required.");
  if(score>=80&&!explained)status("Objective score passed, but supply a complete derivation (40+ characters) and a misconception/correction (30+ characters) before progression.");
  else status(rec.passed?"Local practice evidence saved. A mentor must still evaluate proof quality.":"Below local mastery; continue revising your answers and evidence.");
 };
 controls();
}
function shuffle(xs){const a=[...xs];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function renderExit(){
 if(!M.every((_,i)=>state.lessons[i+1]?.passed)){host.innerHTML='<section class="stage"><h1>Unit 00 exit is not yet open</h1><p>Complete six formative lesson assessments first.</p><a class="btn" href="index.html">Unit 00 Overview</a></section>';return}
 let rec=state.exit||{choices:[],attempts:[],proof:"",corrections:"",passed:false,score:null};
 if(!Array.isArray(rec.ids)||rec.ids.length!==24){rec.ids=M.flatMap((m,i)=>shuffle(Q.filter(q=>q.module===i+1)).slice(0,4).map(q=>q.id));rec.choices=[]}
 state.exit=rec;save();
 const questions=rec.ids.map(id=>Q.find(q=>q.id===id));if(questions.some(x=>!x)){host.textContent="Assessment bank cannot be verified; do not submit. Your prior work remains intact.";return}
 host.innerHTML='<section class="stage"><p class="eyebrow">Unit 00 · Prerequisite Exit</p><h1>Foundation and Proof Fluency Check</h1><p>Four items from each of six strands: 24 unique questions. A score of at least 20/24 (83.3%) meets the 80% threshold. Below threshold, revise the same set. A written mathematical proof and a substantive correction are required; instructor certification is separate.</p><label class="block-label" for="bridgeProof">Independent synthesis proof</label><textarea id="bridgeProof" rows="6" placeholder="Prove a continuity or linear-algebra statement using stated hypotheses."></textarea><label class="block-label" for="bridgeCorrections">Reasoned corrections and limitations</label><textarea id="bridgeCorrections" rows="4" placeholder="Explain what you corrected and identify a false converse or missing hypothesis."></textarea></section><section class="stage"><div id="bridgeQuestions">'+buildQuestions(questions,rec,rec.passed)+'</div><div class="actions"><button id="submitBridge" type="button" class="btn primary" '+(rec.passed?"disabled":"")+'>Submit Exit Check</button><a class="btn" href="index.html">Unit 00 Overview</a></div><p id="lessonScore" role="status" aria-live="polite">'+(rec.score==null?"Not yet scored":rec.score+"% · "+(rec.passed?"Readiness support completed":"Corrections needed"))+'</p></section>'+actions();
 const proof=document.getElementById("bridgeProof"),corrections=document.getElementById("bridgeCorrections"),list=document.getElementById("bridgeQuestions");
 proof.value=rec.proof||"";corrections.value=rec.corrections||"";
 function draft(){rec.proof=proof.value;rec.corrections=corrections.value;rec.choices=selectedChoices(list);save()}
 proof.addEventListener("input",draft);corrections.addEventListener("input",draft);list.addEventListener("change",draft);
 document.getElementById("submitBridge").onclick=()=>{
  draft();if(rec.choices.length!==24||rec.choices.some(x=>x===null)){status("Answer all 24 questions.");return}
  const correct=questions.filter((q,i)=>q.answer===rec.choices[i]).length,score=Math.round(correct/24*100);
  rec.attempts??=[];rec.attempts.push({date:new Date().toISOString(),score,correct,total:24});
  const explained=rec.proof.trim().length>=75&&rec.corrections.trim().length>=55;
  rec.score=score;rec.correctionsComplete=explained;rec.passed=score>=80&&explained;save();
  [...list.querySelectorAll("[data-q]")].forEach((card,i)=>{const f=card.querySelector(".bridge-feedback");f.hidden=false;f.textContent=(rec.choices[i]===questions[i].answer?"Correct. ":"Review: ")+questions[i].explanation});
  if(rec.passed){list.querySelectorAll("input").forEach(x=>x.disabled=true);document.getElementById("submitBridge").disabled=true;}
  document.getElementById("lessonScore").textContent=correct+"/24 · "+score+"%. "+(rec.passed?"Prerequisite practice completed; you may start Official Unit 01.":"Revise the same questions and provide independent proof and corrections.");
  status(rec.passed?"Readiness support completed locally. This is not a university credential or faculty-reviewed proof.":"Corrections required before Unit 01 is marked ready.");
 };
 controls();
}
const mode=host.dataset.bridgeMode;
if(mode==="home")renderHome();
else if(mode==="exit")renderExit();
else {const n=Number(host.dataset.module);if(n>=1&&n<=6)renderLesson(n)}
})();