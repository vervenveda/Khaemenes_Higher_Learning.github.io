(function(){
"use strict";
const match=location.pathname.match(/\/unit-(\d{2})\/lessons\/(u\d{2}-l\d{2})\.html$/);
if(!match||Number(match[1])<2)return;
const gate=window.CALC1_PROGRESS_GATES;
const lessonId=match[2],unit=Number(match[1]),n=Number(lessonId.split("-l")[1]);
const rule=gate?gate.canOpenLesson(lessonId):{ok:false,reason:"Course mastery data has not loaded."};
function disableProgress(){
 for(const id of ["completeLesson","lessonComplete","saveLessonNote"]){
  const c=document.getElementById(id);
  if(c){c.disabled=true;c.setAttribute("aria-disabled","true");c.title="Practice preview only; 80% lesson assessment pending academic review."}
 }
}
function banner(){
 const heading=document.querySelector(".lesson-header")||document.querySelector("main");
 if(!heading)return;
 const p=document.createElement("p");p.className="notice";
 p.textContent="Academic review: this later unit's lesson-specific 80% question bank is not yet released. You may read and practice free, but lesson progression and formal completion remain locked pending reviewed mastery evidence.";
 heading.prepend(p);
 disableProgress();
}
if(rule.ok){banner();return}
const main=document.querySelector("main.lesson-shell")||document.querySelector("main");
if(!main)return;
main.hidden=true;main.style.display="none";main.inert=true;main.setAttribute("aria-hidden","true");
const blocker=document.createElement("main");blocker.className="section";blocker.id="calc1DirectLessonGate";blocker.style.cssText="min-height:48vh";
const w=document.createElement("div");w.className="wrap";
const c=document.createElement("article");c.className="card";c.style.cssText="max-width:700px;margin:44px auto;padding:25px;background:#fdfaf4;color:#243c30;border-radius:7px";
const title=document.createElement("h1");title.textContent="Lesson progression locked — 80% mastery required";c.appendChild(title);
const p=document.createElement("p");p.textContent=rule.reason;c.appendChild(p);
const back=document.createElement("a");back.className="btn primary";
back.href=n>1?"u"+String(unit).padStart(2,"0")+"-l"+String(n-1).padStart(2,"0")+".html":"../index.html";
back.textContent="Return to required learning step";c.appendChild(back);
const preview=document.createElement("button");preview.type="button";preview.className="btn";
preview.textContent="Read only as a free study preview";
preview.addEventListener("click",()=>{
 main.hidden=false;main.style.display="";main.inert=false;main.removeAttribute("aria-hidden");
 blocker.hidden=true;disableProgress();banner();
});
c.appendChild(preview);
const note=document.createElement("p");note.textContent="Previewing instructional text never records mastery, advances the course, or grants certificate eligibility.";
c.appendChild(note);w.appendChild(c);blocker.appendChild(w);
main.parentNode.insertBefore(blocker,main);
})();