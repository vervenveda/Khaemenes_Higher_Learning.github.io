(function(){
"use strict";
const gate=window.CALC1_PROGRESS_GATES;
if(!gate)return;
const unitMatch=location.pathname.match(/\/unit-(\d{2})\/(?:index\.html)?$/);
const unit=Number(unitMatch?.[1]||0),main=document.querySelector("main");
function notice(reason,back){
 if(main){main.hidden=true;main.style.display="none";main.inert=true;main.setAttribute("aria-hidden","true");}
 const panel=document.createElement("main");panel.className="section";panel.id="calc1UnitLocked";
 const w=document.createElement("div");w.className="wrap";
 const c=document.createElement("article");c.className="card";c.style.cssText="max-width:680px;margin:35px auto;padding:22px;background:#fdfaf4;color:#203e31";
 const h=document.createElement("h1");h.textContent="Unit "+unit+" locked until 80% mastery";c.appendChild(h);
 const p=document.createElement("p");p.textContent=reason;c.appendChild(p);
 const a=document.createElement("a");a.className="btn primary";a.href=back;a.textContent="Return to required unit";c.appendChild(a);
 w.appendChild(c);panel.appendChild(w);main?.parentNode?.insertBefore(panel,main);
}
if(unit>1){
 const state=gate.canOpenUnit(unit);
 if(!state.ok){notice(state.reason,"../unit-"+String(unit-1).padStart(2,"0")+"/");return;}
}
function showState(){
 if(unit!==1)return;
 const ids=gate.unitOne;
 document.querySelectorAll("a[href]").forEach(a=>{
  const found=a.getAttribute("href")?.match(/lessons\/(u01-l\d{2})\.html$/);
  if(!found)return;
  const state=gate.canOpenLesson(found[1]),locked=!state.ok;
  a.setAttribute("aria-disabled",String(locked));a.dataset.masteryLocked=String(locked);
  a.title=locked?state.reason:"Ready for this learner";
  if(locked){a.style.opacity=".5";a.style.cursor="not-allowed";}else{a.style.opacity="";a.style.cursor="";}
 });
 let msg=document.getElementById("calc1UnitMasteryState");
 if(!msg){
  msg=document.createElement("p");msg.className="notice";msg.id="calc1UnitMasteryState";msg.setAttribute("role","status");
  const header=document.querySelector(".section-head");header?.appendChild(msg);
 }
 if(msg)msg.textContent=ids.filter(gate.lessonMastered).length+"/7 lessons have reached 80% mastery. Each new lesson requires at least 80% on its predecessor. After all seven, the Unit 01 assessment also requires 80%.";
}
showState();
document.addEventListener("click",e=>{
 const a=e.target.closest?.('a[data-mastery-locked="true"]');
 if(!a)return;
 e.preventDefault();e.stopImmediatePropagation();
 const id=a.getAttribute("href")?.match(/(u01-l\d{2})\.html$/)?.[1];
 const g=gate.canOpenLesson(id||"");
 const p=document.getElementById("calc1UnitMasteryState");if(p)p.textContent=g.reason+". Return to the preceding lesson for free practice and a new attempt.";
},true);
window.addEventListener("storage",showState);
})();