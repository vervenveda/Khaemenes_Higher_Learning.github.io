(function lessonUI(){
"use strict";
const gates=window.CALC1_PROGRESS_GATES,bank=window.CALC1_LESSON_MASTERY_BANK;
const id=document.body?.dataset.lessonId;
if(!gates||!bank||!bank.lessonIds.includes(id))return;
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const shuffle=a=>{let o=[...a];for(let i=o.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[o[j],o[i]]=[o[i],o[j]]}return o};
const idx=gates.unitOne.indexOf(id),prev=gates.unitOne[idx-1],next=gates.unitOne[idx+1];
const learner=gates.learner();
const target=document.querySelector(".lesson-main")||document.querySelector("main");
if(!target)return;
const status=gates.canOpenLesson(id);
function lock(reason){
 const main=document.getElementById("lessonMain");if(main){main.hidden=true;main.setAttribute("aria-hidden","true");main.inert=true}
 const panel=document.createElement("main");panel.className="section";panel.id="calc1LockedStep";panel.setAttribute("role","main");
 const wrap=document.createElement("div");wrap.className="wrap";
 const card=document.createElement("article");card.className="card";card.style.cssText="max-width:680px;margin:34px auto;padding:24px;background:#fdfaf3;color:#233b32;border-radius:7px";
 const h=document.createElement("h1");h.textContent="Next lesson locked · 80% mastery";card.appendChild(h);
 const p=document.createElement("p");p.textContent=reason;card.appendChild(p);
 const a=document.createElement("a");a.className="btn primary";a.textContent="Return to required lesson";a.href=prev?prev+".html":"../index.html";card.appendChild(a);
 wrap.appendChild(card);panel.appendChild(wrap);main?.parentNode?.insertBefore(panel,main);
}
if(!status.ok){lock(status.reason);return}
const section=document.createElement("section");section.className="visual-card screen-only";section.id="calc1LessonMastery";
section.style.cssText="margin-top:24px;padding:20px;border:1px solid #b9c6b9;border-radius:7px;background:#fbfaf5;color:#243b30";
target.appendChild(section);
let set=[],done=false;
function start(){
 const pool=bank.generate(id);
 if(pool.length<10){section.textContent="This lesson's question bank is unavailable. Your next lesson remains locked; contact the Academy mentor.";return}
 set=shuffle(pool).slice(0,10).map(item=>{
  const opts=shuffle(item.options.map((text,orig)=>({text,orig})));
  return {item,opts};
 });
 done=false;
 const best=gates.lessonBest(id);
 section.innerHTML='<div class="section-head"><p class="eyebrow">Academy · 80% mastery gate</p><h2>Lesson Mastery Check</h2><p>Answer 10 questions to demonstrate mastery. Eight correct answers unlock the next lesson. Fresh, varied practice and corrections are always free. Best retained: '+best+'%.</p>'+
 (learner?'<p class="notice">Practice learner: '+esc(learner.name)+'</p>':'<p class="notice">No Calculus I learner is selected. Reading and practice remain free, but progression is not saved until a learner profile is selected in the course dashboard.</p>')+'</div>'+
 set.map((row,i)=>'<article class="question" style="margin:14px 0;padding:10px"><fieldset><legend>'+(i+1)+'. '+esc(row.item.prompt)+'</legend><div class="options">'+row.opts.map((opt,j)=>'<label class="option" style="display:block;padding:5px"><input type="radio" name="calc1lessonq'+i+'" value="'+j+'"> '+esc(opt.text)+'</label>').join("")+'</div><p class="feedback" id="calc1LessonFeedback'+i+'" hidden></p></fieldset></article>').join("")+
 '<div class="actions no-print"><button type="button" class="btn primary" id="calc1LessonSubmit">Submit mastery check</button><button type="button" class="btn" id="calc1LessonRetry">New practice form</button></div><p id="calc1LessonResult" role="status" aria-live="polite"></p><div id="calc1NextStep"></div>'+
 '<p class="small">These are browser-local formative gates modeled on Pre-Algebra. A public JavaScript quiz is not a confidential collegiate final or an accredited credential assessment.</p>';
 section.querySelector("#calc1LessonSubmit")?.addEventListener("click",submit);
 section.querySelector("#calc1LessonRetry")?.addEventListener("click",start);
 if(gates.lessonMastered(id))nextLink(section.querySelector("#calc1NextStep"),"Previous mastery already meets the required 80%.");
}
function nextLink(host,message){
 if(!host)return;
 host.replaceChildren();
 const p=document.createElement("p");p.textContent=message;host.appendChild(p);
 const a=document.createElement("a");a.className="btn primary";
 if(next){a.href=next+".html";a.textContent="Open next lesson →"}
 else{a.href="../assessment/mastery-check.html";a.textContent="Open Unit 01 mastery assessment →"}
 host.appendChild(a);
}
function submit(){
 if(done)return;
 const picks=set.map((row,i)=>section.querySelector('input[name="calc1lessonq'+i+'"]:checked'));
 if(picks.some(x=>!x)){section.querySelector("#calc1LessonResult").textContent="Please answer all 10 questions before scoring.";return}
 const items=[];let right=0;
 set.forEach((row,i)=>{
  const chosen=Number(picks[i].value),rightIndex=row.opts.findIndex(o=>o.orig===row.item.answer);
  if(chosen===rightIndex)right++;
  const fb=section.querySelector("#calc1LessonFeedback"+i);fb.hidden=false;fb.textContent=(chosen===rightIndex?"Correct. ":"Review. ")+row.item.explanation;fb.className="feedback "+(chosen===rightIndex?"good":"bad");
  items.push({id:row.item.id,prompt:row.item.prompt,options:row.opts.map(o=>o.text),selectedIndex:chosen,correctIndex:rightIndex});
 });
 const score=right*10,passed=score>=gates.threshold;
 const snapshot={date:new Date().toISOString(),source:"calc1-lesson-practice-v1",learnerId:learner?.id||null,lessonId:id,score,passed,total:10,items};
 const saved=learner?gates.saveLessonAttempt(id,snapshot):false;
 done=true;
 section.querySelector("#calc1LessonSubmit").disabled=true;
 section.querySelectorAll('input[type="radio"]').forEach(el=>{el.disabled=true});
 const msg=score+"% · "+right+"/10 · "+(passed?"80% mastery reached":"Below 80% · correct and retry")+" · "+(saved?"Saved to your local learner record.":"No progress saved; verify learner profile/storage.");
 section.querySelector("#calc1LessonResult").textContent=msg;
 if(passed&&saved)nextLink(section.querySelector("#calc1NextStep"),"Mastery confirmed for local progression. You may advance.");
}
start();
window.addEventListener("storage",e=>{if(e.key==="khaemenes-calculus1-course-v1"){if(gates.learner()?.id!==learner?.id){section.replaceChildren();section.textContent="Learner profile changed. Reopen this lesson to protect your records.";}}});
})();
