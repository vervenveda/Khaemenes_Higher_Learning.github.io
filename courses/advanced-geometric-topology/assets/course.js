
"use strict";
const DATA=window.KHAE_ADVANCED_COURSE_DATA;
const KEY="khaemenes-hl-agtgmp-progress-v1";
const COURSE_ID="KH-HL-AGTGMP";
const MATH_CONFIG=window.KHAEMENES_MATH_CONTINUUM_CONFIG||null;
const mathState={status:"local-fallback",profile:null,continuum:null,error:null};
const q=new URLSearchParams(location.search),week=Math.max(1,Math.min(36,Number(q.get("week")||1))),day=Math.max(1,Math.min(5,Number(q.get("day")||1)));
const session=DATA.sessions.find(s=>s.week===week&&s.day===day);
const state=(()=>{try{return JSON.parse(localStorage.getItem(KEY))||{pathway:"Core",scores:{},reflections:{},evidence:{},completed:[]}}catch{return{pathway:"Core",scores:{},reflections:{},evidence:{},completed:[]}}})();
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;","&gt;":"&gt;",'"':"&quot;","'":"&#39;"}[c])||c);
const safeUrl=value=>{try{const u=new URL(value,location.href);return /^https?:$/.test(u.protocol)?u.href:""}catch{return""}};

function matchedTools(){
 if(!mathState.profile||!mathState.continuum)return[];
 const allowed=new Set(mathState.profile.toolPreferences||[]);
 const tools=(mathState.continuum.publicTools||[]).filter(t=>allowed.has(t.id));
 const haystack=[session.id,session.title,session.topic,session.purpose,...(session.objectives||[]),...(session.evidence||[]),session.lab].filter(Boolean).join(" ").toLowerCase();
 const out=[];
 for(const rule of mathState.profile.toolRules||[]){
  if(rule.pathways&&!rule.pathways.includes(state.pathway))continue;
  if(!(rule.whenAny||[]).some(word=>haystack.includes(String(word).toLowerCase())))continue;
  const tool=tools.find(t=>t.id===rule.toolId);
  if(tool&&!out.some(x=>x.id===tool.id))out.push(tool);
 }
 if(!out.length){const evidenceTool=tools.find(t=>t.id==="evidence-citation-studio");if(evidenceTool)out.push(evidenceTool)}
 return out;
}

function matchedMiniClouds(){
 if(!mathState.profile||!mathState.continuum)return[];
 const allowed=new Set(mathState.profile.miniClouds||[]);
 return (mathState.continuum.miniClouds||[]).filter(cloud=>allowed.has(cloud.id));
}

function mathContext(){
 return{
  status:mathState.status,
  consumerId:mathState.profile?.consumerId||"khaemenes.math.consumer.001",
  courseId:COURSE_ID,
  stage:mathState.profile?.stage||"higher",
  strands:mathState.profile?.strands||[],
  miniClouds:matchedMiniClouds().map(cloud=>({id:cloud.id,label:cloud.label})),
  recommendedTools:matchedTools().map(tool=>({id:tool.id,title:tool.title,home:tool.home,evidenceRole:tool.evidenceRole})),
  mathematicalStatusVocabulary:mathState.continuum?.mathematicalStatusVocabulary||[],
  evidencePrinciples:mathState.continuum?.evidencePrinciples||[],
  evidenceContract:mathState.profile?.evidenceContract||{},
  continuum:mathState.continuum?{canonicalId:mathState.continuum.canonicalId,schemaVersion:mathState.continuum.schemaVersion,effectiveDate:mathState.continuum.effectiveDate,status:mathState.continuum.status}:null
 };
}

function context(){
 window.KHAEMENES_MATH_CONTEXT=mathContext();
 window.ARCHAEMENES_LEARNING_CONTEXT={
  mentor:"Archaemenes",expression:"Scholar",course:COURSE_ID,unit:session.unit,week,day,sessionId:session.id,
  topic:session.topic,pathway:state.pathway,objectives:session.objectives,evidenceRequired:session.evidence,
  conceptScore:state.scores[session.id]??null,reflection:state.reflections[session.id]||"",
  teachingPolicy:["clue-first","why-before-procedure","respect learner voice","proof-aware","evidence-labeled-honestly"],
  mathematics:window.KHAEMENES_MATH_CONTEXT
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

function renderMathCloud(){
 const status=document.getElementById("mathCloudStatus"),tools=document.getElementById("mathCloudTools"),principles=document.getElementById("mathCloudPrinciples");
 if(!status||!tools||!principles)return;
 const recs=matchedTools();
 status.textContent=mathState.status==="connected"
  ?"Connected to the shared Khaemenes Mathematics Continuum. Course-owned lessons remain authoritative."
  :"Local course mode is active. Shared mathematics information is optional, so the lesson remains fully usable.";
 tools.innerHTML=recs.length
  ?`<p><strong>Lesson-aware public tools</strong></p><div class="nav">${recs.map(tool=>{const url=safeUrl(tool.home);return url?`<a class="btn secondary" href="${esc(url)}" target="_blank" rel="noopener">${esc(tool.title)}</a>`:""}).join("")}</div>`
  :"<p>No specialized public tool is required for this session.</p>";
 const shared=(mathState.continuum?.evidencePrinciples||[]).slice(0,5);
 const fallback=["A numerical score measures only what the scored instrument assessed.","Visualization and computation can support reasoning without automatically constituting proof.","Required written mathematics remains distinct from objective-question performance."];
 principles.innerHTML=(shared.length?shared:fallback).map(item=>`<li>${esc(item)}</li>`).join("");
 context();
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
 renderMathCloud();
 context();
}

async function loadMathContinuum(){
 if(!MATH_CONFIG){renderMathCloud();return}
 try{
  const [profileRes,continuumRes]=await Promise.all([fetch(MATH_CONFIG.profileUrl,{cache:"no-cache"}),fetch(MATH_CONFIG.continuumUrl,{cache:"no-cache"})]);
  if(!profileRes.ok||!continuumRes.ok)throw new Error("Shared mathematics information is not yet available.");
  const [profile,continuum]=await Promise.all([profileRes.json(),continuumRes.json()]);
  if(profile.courseId!==COURSE_ID)throw new Error("Course ID mismatch.");
  if(continuum.canonicalId!==profile.continuum.canonicalId)throw new Error("Continuum ID mismatch.");
  mathState.profile=profile;mathState.continuum=continuum;mathState.status="connected";
 }catch(error){mathState.status="local-fallback";mathState.error=String(error?.message||error);console.warn("Shared mathematics information unavailable; using local course mode.",error)}
 renderMathCloud();
}

document.getElementById("pathway").addEventListener("change",e=>{state.pathway=e.target.value;save();render()});
document.getElementById("askMentor").addEventListener("click",()=>{document.getElementById("mentorText").textContent=mentorMessage();context()});
document.getElementById("saveReflection").addEventListener("click",()=>{state.reflections[session.id]=document.getElementById("reflection").value.trim();save();context();document.getElementById("status").textContent="Reflection saved locally."});
document.getElementById("saveEvidence").addEventListener("click",()=>{state.evidence[session.id]=document.getElementById("evidenceNote").value.trim();save();context();document.getElementById("status").textContent="Evidence note saved. Proof/lab mastery still requires review."});
document.getElementById("exportRecord").addEventListener("click",()=>{context();const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),context:window.ARCHAEMENES_LEARNING_CONTEXT,state},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`${session.id}-scholar-record.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)});
render();
loadMathContinuum();
