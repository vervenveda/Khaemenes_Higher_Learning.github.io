(function(){
"use strict";
// Browser-local formative assessment. Public questions/keys are not secure formal exams.
var cfg=window.CALC1_ASSESSMENT_CONFIG||{};
var all=cfg.source==="diagnostic"?window.CALCULUS1_DIAGNOSTIC:window.CALCULUS1_QUESTIONS;
var host=document.getElementById("assessmentRoot");
if(!host||!Array.isArray(all))return;
var ROOT_KEY="khaemenes-calculus1-course-v1";
var HISTORY_PREFIX="khaemenes-calculus1-assessment-records-v2";
var PASS=80, HISTORY_LIMIT=20;
var esc=function(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
function activeLearner(){
 try{
  var state=JSON.parse(localStorage.getItem(ROOT_KEY)||"null");
  if(!state||!Array.isArray(state.students))return null;
  var scholar=state.students.find(function(s){return s&&s.id===state.activeId});
  if(!scholar||typeof scholar.id!=="string"||!scholar.id)return null;
  return {id:scholar.id,name:String(scholar.name||"Learner").slice(0,70)};
 }catch(e){return null}
}
var learner=activeLearner();
var KEY=learner?HISTORY_PREFIX+":"+encodeURIComponent(learner.id):null;
function load(){
 if(!KEY)return {};
 try{var r=JSON.parse(localStorage.getItem(KEY)||"{}");return r&&typeof r==="object"&&!Array.isArray(r)?r:{}}
 catch(e){return {}}
}
function save(value){
 if(!KEY)return false;
 try{localStorage.setItem(KEY,JSON.stringify(value));return true}catch(e){return false}
}
function shuffle(a){
 var out=a.slice();
 for(var i=out.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=out[i];out[i]=out[j];out[j]=t}
 return out;
}
function pool(){
 var p=all.filter(function(q){return q&&typeof q.id==="string"&&Array.isArray(q.options)&&q.options.length>=2&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length});
 if(Array.isArray(cfg.units)&&cfg.units.length)p=p.filter(function(q){return cfg.units.includes(q.unit)});
 return p;
}
function sample(items,n){
 n=Math.max(0,Math.min(items.length,Number(n)||10));
 var choices=shuffle(items),wanted=Array.isArray(cfg.units)&&cfg.units.length?cfg.units:[];
 if(!wanted.length||n<wanted.length)return choices.slice(0,n);
 var bins=wanted.map(function(u){return shuffle(choices.filter(function(q){return q.unit===u}))});
 var picked=[],seen=new Set();
 // Every specified unit must contribute to midterm/final.
 while(picked.length<n){
  var progressed=false;
  for(var i=0;i<bins.length&&picked.length<n;i++){
   var item=bins[i].shift();
   if(item&&!seen.has(item.id)){picked.push(item);seen.add(item.id);progressed=true}
  }
  if(!progressed)break;
 }
 // Fallback if the bank lacks some expected units.
 for(var j=0;j<choices.length&&picked.length<n;j++){
  if(!seen.has(choices[j].id)){picked.push(choices[j]);seen.add(choices[j].id)}
 }
 return shuffle(picked);
}
var selected=[],attemptToken="",submitted=false;
function best(){
 var r=load()[cfg.recordKey||"assessment"];
 if(!r||!Array.isArray(r.attempts))return null;
 var values=r.attempts.map(function(x){return Number(x.score)}).filter(function(n){return Number.isFinite(n)&&n>=0&&n<=100});
 return values.length?Math.max.apply(null,values):null;
}
function textInfo(){
 return "80% minimum for formative practice. A pass here is not a verified collegiate mastery gate. "+
 "These public questions and answer keys are unsuitable for a secure midterm/final or accredited credential decision.";
}
function start(){
 var available=pool(),count=Math.min(available.length,Math.max(1,Number(cfg.count)||10));
 if(!available.length){host.textContent="No valid assessment questions found. Please report this course error.";return}
 selected=sample(available,count).map(function(q){
  return {q:q,opts:shuffle(q.options.map(function(t,i){return {text:t,original:i}}))};
 });
 submitted=false;
 attemptToken="calc1-"+Date.now()+"-"+Math.floor(Math.random()*1000000);
 var header='<article class="card"><p class="notice">'+esc(textInfo())+'</p>'+
  '<p><strong>Study profile:</strong> '+esc(learner?learner.name:"Guest practice (not saved)")+'</p>'+
  '<p class="notice">'+esc(cfg.instructions||"Answer every question; then review your explanation and corrections.")+'</p></article>';
 var questions=selected.map(function(row,i){
  return '<article class="question"><fieldset><legend>'+String(i+1)+'. '+esc(row.q.prompt)+'</legend>'+
   '<div class="options">'+row.opts.map(function(o,j){
    return '<label class="option"><input type="radio" name="'+attemptToken+'-q'+i+'" value="'+j+'"><span>'+esc(o.text)+'</span></label>';
   }).join("")+'</div><div class="feedback" id="'+attemptToken+'-fb'+i+'" hidden></div></fieldset></article>';
 }).join("");
 var prior=best();
 var controls='<div class="assessment-result"><button class="btn primary" id="submitAssessment" type="button">Submit &amp; Score</button>'+
  '<button class="btn" id="printAssessment" type="button">Print</button>'+
  '<p id="assessmentMessage" role="status" aria-live="polite">Best prior practice score: '+(prior===null?"—":esc(prior)+"%")+'. Threshold: '+PASS+'%.</p></div>';
 host.innerHTML=header+questions+controls;
 document.getElementById("submitAssessment").addEventListener("click",score);
 document.getElementById("printAssessment").addEventListener("click",function(){window.print()});
}
function score(){
 if(submitted)return;
 var answers=[],complete=true;
 selected.forEach(function(row,i){
  var checked=document.querySelector('input[name="'+attemptToken+'-q'+i+'"]:checked');
  if(!checked){complete=false;document.getElementById(attemptToken+'-fb'+i).textContent="Choose an answer before submitting.";}
  answers.push(checked?Number(checked.value):null);
 });
 if(!complete){
  document.getElementById("assessmentMessage").textContent="Every question needs an answer before it can be scored.";
  return;
 }
 var right=0,missed=[],items=[];
 selected.forEach(function(row,i){
  var selection=row.opts[answers[i]],correct=selection.original===row.q.answer;
  if(correct)right++;else missed.push(row.q.id);
  var fb=document.getElementById(attemptToken+"-fb"+i);fb.hidden=false;
  fb.className="feedback "+(correct?"good":"bad");
  fb.textContent=(correct?"Correct. ":"Review. ")+String(row.q.explanation||"Discuss and correct your reasoning.");
  items.push({id:row.q.id,prompt:row.q.prompt,shownOptions:row.opts.map(function(o){return o.text}),
   selectedIndex:answers[i],correctIndex:row.opts.findIndex(function(o){return o.original===row.q.answer}),unit:row.q.unit||null});
 });
 var scorePercent=Math.round(100*right/selected.length),passed=scorePercent>=PASS;
 var attempt={id:attemptToken,date:new Date().toISOString(),engineVersion:2,source:"public-formative-practice",
  practicePassed:passed,certificateApproved:false,score:scorePercent,right:right,total:selected.length,
  missed:missed,learnerId:learner?learner.id:null,items:items};
 var key=cfg.recordKey||"assessment",records=load();
 if(!records[key]||!Array.isArray(records[key].attempts))records[key]={title:cfg.title||key,attempts:[]};
 records[key].attempts.push(attempt);
 records[key].attempts=records[key].attempts.slice(-HISTORY_LIMIT);
 var saved=save(records);
 submitted=true;
 document.querySelectorAll('input[name^="'+attemptToken+'-"]').forEach(function(input){input.disabled=true});
 var btn=document.getElementById("submitAssessment");if(btn)btn.disabled=true;
 document.getElementById("assessmentMessage").textContent=scorePercent+"% · "+right+"/"+selected.length+
  " · "+(passed?"Practice threshold met (80%+)":"Below 80% — study corrections and retake")+
  (saved?" · Snapshot saved to this local learner profile.":" · No persistent snapshot saved.")+
  " Formal mastery and certificate eligibility require independent evaluation.";
}
document.getElementById("startAssessment")?.addEventListener("click",start);
document.getElementById("resetAssessment")?.addEventListener("click",function(){
 if(window.confirm("Start a new practice attempt?"))start();
});
start();
})();