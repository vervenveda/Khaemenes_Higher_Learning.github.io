(() => {
"use strict";
const body=document.body;
const id=body.dataset.lessonId;
if(!id)return;
const LEGACY_KEY="khaemenes-topology-differential-geometry-lessons-v1";
const UTILITY_WIDGET="https://vervenveda.com/assets/vnv-beta-link.js";
function ensureLearnerToolbar(){
  const mount=()=>{
    if(document.getElementById("vnvBetaProgramLink")||document.querySelector('script[src*="vnv-beta-link.js"]'))return;
    const script=document.createElement("script");script.src=UTILITY_WIDGET;script.async=false;script.dataset.khaemenesHigherLessonUtility="1";(document.head||document.documentElement).append(script);
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});
  else mount();
}
function higherScholarLessonKey(legacyKey){
 try{
  const learnerId=JSON.parse(localStorage.getItem("khaemenes_active_learner_v1")||"null");
  const registry=JSON.parse(localStorage.getItem("khaemenes_family_registry_v1")||"null");
  if(typeof learnerId==="string"&&registry?.learners?.[learnerId]&&String(registry.learners[learnerId].stage||"").toLowerCase()==="higher"){
   return "khaemenes-topology-differential-geometry-lessons-v2:"+learnerId;
  }
  const course=JSON.parse(localStorage.getItem("khaemenes-topology-differential-geometry-course-v1")||"{}");
  return "khaemenes-topology-differential-geometry-lessons-v2:"+(course.activeId?String(course.activeId):"learner-1");
 }catch{return "khaemenes-topology-differential-geometry-lessons-v2:learner-1"}
}

ensureLearnerToolbar();
const KEY=higherScholarLessonKey(LEGACY_KEY);
const THEME_KEY="khaemenes-higher-learning-theme";
const STEPS=["concept","examples","worksheet","check","reflection"];
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
function storageGet(key){try{return localStorage.getItem(key)}catch{return null}}
function storageSet(key,value){try{localStorage.setItem(key,value);return true}catch{return false}}
function loadAll(){try{const x=JSON.parse(storageGet(KEY)||"{}");return x&&typeof x==="object"?x:{}}catch{return {}}}
function saveAll(data){try{return storageSet(KEY,JSON.stringify(data))}catch{return false}}
function freshRecord(){return {complete:false,pathway:"Core",steps:{},reflection:"",quickScore:null,topicScore:null,topicPassed:false,topicChoices:[],topicBankVersion:0,updated:null}}
function normalizeRecord(raw){
  const base=freshRecord();
  if(raw===true||raw===false){base.complete=raw;return base}
  if(typeof raw==="number"&&Number.isFinite(raw)){base.quickScore=Math.max(0,Math.min(100,Math.round(raw)));return base}
  if(!raw||typeof raw!=="object"||Array.isArray(raw))return base;
  base.complete=!!raw.complete;
  base.pathway=typeof raw.pathway==="string"&&raw.pathway?raw.pathway:"Core";
  base.steps=raw.steps&&typeof raw.steps==="object"&&!Array.isArray(raw.steps)?raw.steps:{};
  base.reflection=typeof raw.reflection==="string"?raw.reflection:"";
  base.quickScore=raw.quickScore!=null&&raw.quickScore!==""&&Number.isFinite(Number(raw.quickScore))?Math.max(0,Math.min(100,Math.round(Number(raw.quickScore)))):null;
  base.topicScore=raw.topicScore==null?null:Math.max(0,Math.min(100,Number(raw.topicScore)||0));
  base.topicPassed=raw.topicPassed===true;
  base.topicChoices=Array.isArray(raw.topicChoices)?raw.topicChoices.slice(0,5):[];
  base.topicBankVersion=Number(raw.topicBankVersion)||0;
  base.updated=typeof raw.updated==="string"?raw.updated:null;
  return base;
}
let all=loadAll();if(Array.isArray(all))all={};
let rec=normalizeRecord(all[id]);
function persist(){rec.updated=new Date().toISOString();all[id]=rec;saveAll(all);render()}
function completeCount(){return STEPS.filter(step=>!!rec.steps[step]).length}
function render(){
  const status=$("#lessonStatus"),button=$("#completeLesson"),bar=$("#lessonProgressBar"),count=$("#lessonProgressText");
  STEPS.forEach(step=>{const box=$(`[data-lesson-step="${step}"]`);if(box)box.checked=!!rec.steps[step]});
  const pathway=$("#pathwaySelect");if(pathway)pathway.value=rec.pathway||"Core";
  const reflection=$("#lessonReflection");if(reflection&&document.activeElement!==reflection)reflection.value=rec.reflection||"";
  const done=completeCount();if(bar)bar.style.width=`${done/STEPS.length*100}%`;if(count)count.textContent=`${done}/${STEPS.length} lesson stages recorded`;
  if(button){button.textContent=rec.complete?"✓ Study Activity Reviewed":"Mark Study Activity Reviewed";button.setAttribute("aria-pressed",String(!!rec.complete))}
  if(status)status.textContent=(rec.complete?"Study activity reviewed locally. ":"Study activity not yet reviewed. ")+(rec.quickScore==null?"No formative quick-check score.":"Formative quick check: "+rec.quickScore+"%. ")+(rec.topicPassed?"80% topic-specific practice threshold met; proof review remains separate.":rec.complete&&rec.topicScore==null?"Legacy study activity reviewed; new mathematics-specific topic check remains outstanding.":"Mathematics-specific topic check outstanding; verified proof mastery is separate.");
}
function setTheme(theme){document.documentElement.dataset.theme=theme;try{storageSet(THEME_KEY,theme)}catch{}}
setTheme(storageGet(THEME_KEY)||"dark");
$("#themeToggle")?.addEventListener("click",()=>setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark"));
$$('[data-lesson-step]').forEach(box=>box.addEventListener('change',()=>{rec.steps[box.dataset.lessonStep]=box.checked;persist()}));
$("#pathwaySelect")?.addEventListener("change",event=>{rec.pathway=event.target.value;persist();activatePathway(rec.pathway)});
function activatePathway(name){
  $$('[data-pathway]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pathway===name)));
  const panel=$("#pathwayPanel"),source=$('[data-pathway-copy]').find(node=>node.dataset.pathwayCopy===name);if(panel&&source)panel.innerHTML=source.innerHTML;
}
$$('[data-pathway]').forEach(button=>button.addEventListener('click',()=>{rec.pathway=button.dataset.pathway;persist();activatePathway(rec.pathway)}));
$("#completeLesson")?.addEventListener("click",()=>{if(!rec.complete&&!rec.topicPassed){alert("Complete the new mathematics-specific topic check with at least 80% before marking this activity reviewed. Verified proof mastery is assessed separately.");return}rec.complete=!rec.complete;persist()});
$("#saveReflection")?.addEventListener("click",()=>{rec.reflection=$("#lessonReflection")?.value.trim()||"";rec.steps.reflection=!!rec.reflection;persist();const msg=$("#reflectionMessage");if(msg)msg.textContent="Reflection saved locally."});
$("#printLesson")?.addEventListener("click",()=>window.print());
$("#checkLessonQuestions")?.addEventListener("click",()=>{
  const cards=$$('.lesson-check-question');let correct=0,answered=0;
  cards.forEach(card=>{
    const chosen=card.querySelector('input:checked'),feedback=card.querySelector('.lesson-check-feedback'),answer=Number(card.dataset.answer);
    if(chosen){answered++;const good=Number(chosen.value)===answer;if(good)correct++;feedback.className=`lesson-check-feedback ${good?'good':'bad'}`;feedback.textContent=(good?'Correct. ':'Review: ')+card.dataset.explanation}else{feedback.className='lesson-check-feedback bad';feedback.textContent='Choose an answer before checking.'}
  });
  if(answered===cards.length&&cards.length){rec.quickScore=Math.round(correct/cards.length*100);rec.steps.check=true;persist()}
  const summary=$("#quickCheckSummary");if(summary)summary.textContent=answered===cards.length?`${correct}/${cards.length} correct · ${Math.round(correct/cards.length*100)}%`:`Answer all ${cards.length} questions to save the check.`;
});
$("#resetLessonQuestions")?.addEventListener("click",()=>{$$('#lessonQuickCheck input').forEach(x=>x.checked=false);$$('.lesson-check-feedback').forEach(x=>{x.className='lesson-check-feedback';x.textContent='' });const summary=$("#quickCheckSummary");if(summary)summary.textContent='No quick-check score yet.'});
$("#exportLesson")?.addEventListener("click",()=>{
  const payload={course:"Topology & Differential Geometry",lessonId:id,title:body.dataset.lessonTitle||document.title,unit:Number(body.dataset.unit),lesson:Number(body.dataset.lessonNumber),...rec};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${id}-lesson-record.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});

$("#scoreQuickCheck")?.addEventListener("click",()=>{
  const cards=$$("[data-quick-question]");let correct=0,answered=0;
  cards.forEach(card=>{const chosen=card.querySelector("input:checked"),answer=Number(card.dataset.correct),explanation=card.querySelector(".explanation");if(chosen){answered++;const good=Number(chosen.value)===answer;if(good)correct++;card.classList.toggle("good",good);card.classList.toggle("bad",!good);if(explanation){explanation.hidden=false;explanation.textContent=(good?"Correct. ":"Review: ")+explanation.textContent.replace(/^(Correct\. |Review: )/,"")}}});
  const result=$("#quickCheckResult");if(answered===cards.length&&cards.length){rec.quickScore=Math.round(correct/cards.length*100);rec.steps.check=true;persist();if(result)result.textContent=`${correct}/${cards.length} correct · ${rec.quickScore}%`}else if(result)result.textContent=`Answer all ${cards.length} questions to save the check.`;
});
// Shared academic check enhances each of the 92 lessons without rewriting its existing worksheet.
window.KHAEMENES_TOPOLOGY_TOPIC={
 get:()=>({score:rec.topicScore,passed:rec.topicPassed,choices:[...rec.topicChoices],version:rec.topicBankVersion}),
 save:(score,passed,choices)=>{rec.topicScore=score;rec.topicPassed=passed;rec.topicChoices=choices;rec.topicBankVersion=1;rec.steps.check=passed;persist()}
};
const courseScript=document.currentScript?.src||"";
if(courseScript){
 const bankScript=document.createElement("script");
 bankScript.src=new URL("question-bank.js",courseScript).href;
 bankScript.onload=()=>{
   const checkScript=document.createElement("script");
   checkScript.src=new URL("topic-check.js",courseScript).href;
   document.head.append(checkScript);
 };
 bankScript.onerror=()=>{
  const notice=document.getElementById("quickCheckResult");
  if(notice)notice.textContent="Enhanced topic check unavailable. Reconnect or refresh once the course files are cached. Existing study notes remain saved.";
 };
 document.head.append(bankScript);
}
activatePathway(rec.pathway||"Core");render();
})();
/* Shared page-title enhancement intentionally omitted: no repository-local dependency is required. */
