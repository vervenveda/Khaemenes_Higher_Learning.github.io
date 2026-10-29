/* Topic-specific formative checks shared by all 92 lessons; local practice, not authenticated examination. */
(() => {
 "use strict";
 const base=window.KHAEMENES_TOPOLOGY_TOPIC;
 const bank=window.TOPOLOGY_DIFFERENTIAL_GEOMETRY_QUESTIONS;
 const section=document.getElementById("check");
 const lesson=document.body.dataset.lessonId;
 const unit=Number(document.body.dataset.unit);
 const index=Number(document.body.dataset.lessonNumber)||1;
 if(!section||!base||!Array.isArray(bank)||!lesson||!unit)return;
 const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const topic=bank.filter(q=>q.unit===unit&&q.skill==="mathematical concept").sort((a,b)=>a.id.localeCompare(b.id));
 const own=bank.find(q=>q.id===lesson+"-q1");
 if(topic.length<4||!own){
  const note=document.createElement("p");note.textContent="Mathematics-specific topic check is unavailable for this lesson. Report this through Beta; no progress has been erased.";section.append(note);return;
 }
 const offset=(index-1)%topic.length;
 const selected=[own,...Array.from({length:4},(_,j)=>topic[(offset+j)%topic.length])];
 const oldCards=section.querySelector(".quick-check-grid");
 const oldButton=document.getElementById("scoreQuickCheck");
 const oldResult=document.getElementById("quickCheckResult");
 if(oldCards)oldCards.hidden=true;
 if(oldButton)oldButton.hidden=true;
 if(oldResult)oldResult.hidden=true;
 const host=document.createElement("div");host.id="topicMasteryCheck";host.className="quick-check-grid";
 host.innerHTML='<article class="card" style="grid-column:1/-1"><h3>Five-question mathematics topic check</h3><p>Four correct answers out of five earn the 80% formative threshold. Below 80%, correct your answers without a shuffle. At 80% or above, your answers lock. Instructor-reviewed proofs remain a separate requirement.</p></article>'+
 selected.map((q,i)=>'<article class="question-card" data-topic-question><h3>'+(i+1)+'. '+esc(q.prompt)+'</h3><div class="answer-list">'+
 q.options.map((text,j)=>'<label class="answer-option"><input type="radio" name="topic-q'+i+'" value="'+j+'"><span>'+esc(text)+'</span></label>').join("")+
 '</div><p class="explanation" hidden></p></article>').join("")+
 '<div class="actions" style="grid-column:1/-1"><button class="btn primary" type="button" id="scoreTopicCheck">Score Topic Check</button></div><p id="topicResult" role="status" aria-live="polite" style="grid-column:1/-1"></p>';
 const anchor=oldCards||section.querySelector(".section-head");
 if(anchor)anchor.insertAdjacentElement("afterend",host);else section.append(host);
 const saved=base.get();
 if(saved.version===1&&Array.isArray(saved.choices)){
  saved.choices.slice(0,5).forEach((choice,i)=>{
   if(choice==null)return;
   const radio=host.querySelector('input[name="topic-q'+i+'"][value="'+choice+'"]');
   if(radio)radio.checked=true;
  });
 }
 const cards=[...host.querySelectorAll("[data-topic-question]")];
 const inputs=[...host.querySelectorAll('input[type="radio"]')];
 const button=host.querySelector("#scoreTopicCheck"),result=host.querySelector("#topicResult");
 function selections(){return selected.map((q,i)=>{const answer=host.querySelector('input[name="topic-q'+i+'"]:checked');return answer?Number(answer.value):null})}
 function report(correct){
  const choices=selections();
  cards.forEach((card,i)=>{
   const feedback=card.querySelector(".explanation"),q=selected[i],passed=choices[i]===q.answer;
   feedback.hidden=false;
   feedback.textContent=(passed?"Correct. ":"Review: ")+q.explanation;
   card.classList.toggle("good",passed);card.classList.toggle("bad",!passed);
  });
  const score=Math.round(correct/selected.length*100),pass=score>=80;
  base.save(score,pass,choices);
  result.textContent=correct+"/"+selected.length+" · "+score+"%. "+(pass?"Topic practice threshold reached; answers are locked. Proof review remains separate.":"Correct missed answers and resubmit the SAME questions.");
  if(pass){inputs.forEach(input=>input.disabled=true);button.disabled=true}
 }
 if(saved.version===1&&saved.passed){
  const correct=selections().filter((v,i)=>v===selected[i].answer).length;
  cards.forEach((card,i)=>{
   const text=card.querySelector(".explanation");text.hidden=false;
   text.textContent=(selections()[i]===selected[i].answer?"Correct. ":"Review: ")+selected[i].explanation;
  });
  inputs.forEach(input=>input.disabled=true);button.disabled=true;
  result.textContent="Saved passing result: "+saved.score+"%. Answers locked on this device. Instructor review remains separate.";
 }else if(saved.version===1&&saved.score!=null){
  result.textContent="Previous topic score: "+saved.score+"%. Revise without reshuffling.";
 }
 host.addEventListener("change",event=>{
  if(event.target?.matches('input[type="radio"]')&&!base.get().passed)base.save(null,false,selections());
 });
 button.addEventListener("click",()=>{
  const choices=selections();if(choices.some(v=>v===null)){result.textContent="Answer all five questions before scoring.";return}
  report(choices.filter((value,i)=>value===selected[i].answer).length);
 });
})();