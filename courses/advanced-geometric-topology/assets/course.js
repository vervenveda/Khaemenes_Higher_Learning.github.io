
"use strict";
const DATA=window.KHAE_ADVANCED_COURSE_DATA;
const KEY="khaemenes-hl-agtgmp-progress-v1";
const q=new URLSearchParams(location.search),week=Math.max(1,Math.min(36,Number(q.get("week")||1))),day=Math.max(1,Math.min(5,Number(q.get("day")||1)));
const session=DATA.sessions.find(s=>s.week===week&&s.day===day);
const state=(()=>{try{return JSON.parse(localStorage.getItem(KEY))||{pathway:"Core",scores:{},reflections:{},evidence:{},completed:[]}}catch{return{pathway:"Core",scores:{},reflections:{},evidence:{},completed:[]}}})();
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function context(){
 window.ARCHAEMENES_LEARNING_CONTEXT={
  mentor:"Archaemenes",expression:"Scholar",course:"KH-HL-AGTGMP",unit:session.unit,week,day,sessionId:session.id,
  topic:session.topic,pathway:state.pathway,objectives:session.objectives,evidenceRequired:session.evidence,
  conceptScore:state.scores[session.id]??null,reflection:state.reflections[session.id]||"",
  teachingPolicy:["clue-first","why-before-procedure","respect learner voice","proof-aware","evidence-labeled-honestly"]
 };
}
function mentorMessage(){
 const p=state.pathway;
 const prompts=session.mentor_prompts;
 let lead=p==="Foundation"
  ?"We will reduce the abstraction, not the standard. Begin by recovering the prerequisite objects."
  :p==="Research"
    ?"Treat this as a seminar problem. Before calculating, map the theorem dependencies and identify what evidence would genuinely settle the claim."
    :"Begin by naming the objects, hypotheses, and target conclusion. I will give a clue before a full route.";
 return `${lead}\n\nArchaemenes asks:\n• ${prompts.slice(0,3).join("\n• ")}`;
}
function render(){
 document.title=`${session.id} · ${session.topic}`;
 document.getElementById("eyebrow").textContent=`Week ${week} · Day ${day} · Unit ${session.unit}`;
 document.getElementById("title").textContent=session.title;
 document.getElementById("purpose").textContent=session.purpose;
 document.getElementById("objectives").innerHTML=session.objectives.map(x=>`<li>${esc(x)}</li>`).join("");
 document.getElementById("warmup").innerHTML=session.warmup.map(x=>`<li>${esc(x)}</li>`).join("");
 document.getElementById("pathway").value=state.pathway;
 document.getElementById("pathwayText").textContent=session.pathways[state.pathway];
 document.getElementById("mentorText").textContent=mentorMessage();
 document.getElementById("evidence").innerHTML=session.evidence.map(x=>`<li>${esc(x)}</li>`).join("");
 document.getElementById("reflection").value=state.reflections[session.id]||"";
 document.getElementById("lab").innerHTML=session.lab?`<div class="notice"><strong>Assigned laboratory:</strong> ${esc(session.lab)}. <a href="labs/">Open lab registry</a>.</div>`:"";
 const prevDay=day>1?`lesson.html?week=${week}&day=${day-1}`:(week>1?`lesson.html?week=${week-1}&day=5`:"index.html");
 const nextDay=day<5?`lesson.html?week=${week}&day=${day+1}`:(week<36?`lesson.html?week=${week+1}&day=1`:"assessments/");
 document.getElementById("prev").href=prevDay;document.getElementById("next").href=nextDay;
 context();
}
document.getElementById("pathway").addEventListener("change",e=>{state.pathway=e.target.value;save();render()});
document.getElementById("askMentor").addEventListener("click",()=>{document.getElementById("mentorText").textContent=mentorMessage();context()});
document.getElementById("saveReflection").addEventListener("click",()=>{state.reflections[session.id]=document.getElementById("reflection").value.trim();save();context();document.getElementById("status").textContent="Reflection saved locally."});
document.getElementById("saveEvidence").addEventListener("click",()=>{state.evidence[session.id]=document.getElementById("evidenceNote").value.trim();save();document.getElementById("status").textContent="Evidence note saved. Proof/lab mastery still requires review."});
document.getElementById("exportRecord").addEventListener("click",()=>{context();const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),context:window.ARCHAEMENES_LEARNING_CONTEXT,state},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`${session.id}-scholar-record.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)});
render();
