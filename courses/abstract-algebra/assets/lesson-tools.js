(() => {
"use strict";
const body=document.body;
const id=body.dataset.lessonId;
if(!id)return;
const KEY="khaemenes-abstract-algebra-lessons-v1";
const THEME_KEY="khaemenes-higher-learning-theme";
const STEPS=["concept","examples","worksheet","check","reflection"];
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
function loadAll(){try{const x=JSON.parse(localStorage.getItem(KEY)||"{}");return x&&typeof x==="object"?x:{}}catch{return {}}}
function saveAll(data){try{localStorage.setItem(KEY,JSON.stringify(data));return true}catch{return false}}
let all=loadAll();
let rec=all[id]||{complete:false,pathway:"Core",steps:{},reflection:"",quickScore:null,updated:null};
rec.steps=rec.steps&&typeof rec.steps==="object"?rec.steps:{};
function persist(){rec.updated=new Date().toISOString();all[id]=rec;saveAll(all);render()}
function completeCount(){return STEPS.filter(step=>!!rec.steps[step]).length}
function render(){
  const status=$("#lessonStatus"),button=$("#completeLesson"),bar=$("#lessonProgressBar"),count=$("#lessonProgressText");
  STEPS.forEach(step=>{const box=$(`[data-lesson-step="${step}"]`);if(box)box.checked=!!rec.steps[step]});
  const pathway=$("#pathwaySelect");if(pathway)pathway.value=rec.pathway||"Core";
  const reflection=$("#lessonReflection");if(reflection&&document.activeElement!==reflection)reflection.value=rec.reflection||"";
  const done=completeCount();if(bar)bar.style.width=`${done/STEPS.length*100}%`;if(count)count.textContent=`${done}/${STEPS.length} lesson stages recorded`;
  if(button){button.textContent=rec.complete?"✓ Lesson Complete":"Mark Lesson Complete";button.setAttribute("aria-pressed",String(!!rec.complete))}
  if(status)status.textContent=rec.complete?`Completed locally${rec.quickScore==null?"":` · Quick check ${rec.quickScore}%`}.`:`In progress${rec.quickScore==null?"":` · Quick check ${rec.quickScore}%`}.`;
}
function setTheme(theme){document.documentElement.dataset.theme=theme;try{localStorage.setItem(THEME_KEY,theme)}catch{}}
setTheme(localStorage.getItem(THEME_KEY)||"dark");
$("#themeToggle")?.addEventListener("click",()=>setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark"));
$$('[data-lesson-step]').forEach(box=>box.addEventListener('change',()=>{rec.steps[box.dataset.lessonStep]=box.checked;persist()}));
$("#pathwaySelect")?.addEventListener("change",event=>{rec.pathway=event.target.value;persist();activatePathway(rec.pathway)});
function activatePathway(name){
  $$('[data-pathway]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pathway===name)));
  const panel=$("#pathwayPanel"),source=$(`[data-pathway-copy="${CSS.escape(name)}"]`);if(panel&&source)panel.innerHTML=source.innerHTML;
}
$$('[data-pathway]').forEach(button=>button.addEventListener('click',()=>{rec.pathway=button.dataset.pathway;persist();activatePathway(rec.pathway)}));
$("#completeLesson")?.addEventListener("click",()=>{rec.complete=!rec.complete;if(rec.complete)STEPS.forEach(step=>rec.steps[step]=true);persist()});
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
  const payload={course:"Abstract Algebra",lessonId:id,title:body.dataset.lessonTitle||document.title,unit:Number(body.dataset.unit),lesson:Number(body.dataset.lessonNumber),...rec};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${id}-lesson-record.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});

$("#scoreQuickCheck")?.addEventListener("click",()=>{
  const cards=$$("[data-quick-question]");let correct=0,answered=0;
  cards.forEach(card=>{const chosen=card.querySelector("input:checked"),answer=Number(card.dataset.correct),explanation=card.querySelector(".explanation");if(chosen){answered++;const good=Number(chosen.value)===answer;if(good)correct++;card.classList.toggle("good",good);card.classList.toggle("bad",!good);if(explanation){explanation.hidden=false;explanation.textContent=(good?"Correct. ":"Review: ")+explanation.textContent.replace(/^(Correct\. |Review: )/,"")}}});
  const result=$("#quickCheckResult");if(answered===cards.length&&cards.length){rec.quickScore=Math.round(correct/cards.length*100);rec.steps.check=true;persist();if(result)result.textContent=`${correct}/${cards.length} correct · ${rec.quickScore}%`}else if(result)result.textContent=`Answer all ${cards.length} questions to save the check.`;
});
activatePathway(rec.pathway||"Core");render();
})();