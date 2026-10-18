(function(){
"use strict";
const gate=window.CALC1_PROGRESS_GATES,data=window.CALCULUS1_DATA;
if(!gate||!data)return;
const weeks=Array.isArray(data.weeks)?data.weeks:[];
function canWeek(n){
 if(!Number.isInteger(n)||n<1||n>weeks.length)return{ok:false,reason:"Unknown week"};
 if(n===1)return{ok:true};
 const week=weeks[n-1],previous=weeks[n-2];
 const unit=Number(week?.unit)||0;
 if(unit>1){
  const g=gate.canOpenUnit(unit);if(!g.ok)return g;
 }
 const ids=previous?.lesson_ids||[];
 if(ids.length&&!ids.every(gate.lessonMastered))
  return {ok:false,reason:"Week "+n+" is locked until all lessons from Week "+(n-1)+" have reached 80% mastery."};
 if(n>4){
  // These advanced weekly question banks are still awaiting discipline-level review.
  return {ok:false,reason:"This weekly progression gate is awaiting reviewed lesson-level 80% assessments; use the source unit for free reading and remediation."};
 }
 return{ok:true};
}
function guard(url){
 let m=url.match(/\/units\/unit-(\d{2})\/lessons\/(u\d{2}-l\d{2})\.html$/);
 if(m){
  const id=m[2],unit=Number(m[1]);
  if(unit===1)return gate.canOpenLesson(id);
  const g=gate.canOpenUnit(unit);
  return g.ok?{ok:false,reason:"The lesson-specific 80% gate for this later unit is still under academic quality review. Reading resources remain accessible from the original unit."}:g;
 }
 m=url.match(/\/units\/unit-(\d{2})\/(?:index\.html)?$/);
 if(m)return gate.canOpenUnit(Number(m[1]));
 return{ok:true};
}
let toast;
function message(text){
 if(!toast){
  toast=document.createElement("div");toast.id="calc1MasteryNavigationMessage";
  toast.setAttribute("role","status");toast.setAttribute("aria-live","polite");
  toast.style.cssText="position:fixed;bottom:12px;left:12px;right:12px;z-index:9998;max-width:640px;margin:auto;background:#fff8e9;color:#34483b;border:1px solid #ad9367;border-radius:7px;padding:13px 18px;box-shadow:0 8px 22px #0003;font-size:14px";
  document.body.appendChild(toast);
 }
 toast.textContent=text+" Free study, corrections, and retakes remain available.";
}
function apply(){
 document.querySelectorAll("a[href]").forEach(a=>{
  let href;try{href=new URL(a.href,location.href).pathname}catch{return}
  const v=guard(href),locked=!v.ok;
  if(!/\/units\/unit-\d{2}\//.test(href))return;
  a.dataset.calc1GateLocked=String(locked);
  a.setAttribute("aria-disabled",String(locked));
  a.title=locked?v.reason:"";
  a.style.opacity=locked?".48":"";
 });
 document.querySelectorAll("[data-week],#openNext").forEach(button=>{
  const n=button.id==="openNext"?
    Number(button.textContent.match(/\d+/)?.[0]):Number(button.dataset.week);
  if(!n)return;
  const v=canWeek(n);
  button.dataset.calc1GateLocked=String(!v.ok);
  button.setAttribute("aria-disabled",String(!v.ok));
  button.title=v.ok?"":v.reason;
  button.style.opacity=v.ok?"":".48";
 });
}
document.addEventListener("click",e=>{
 const anchor=e.target.closest?.('a[data-calc1-gate-locked="true"]');
 const button=e.target.closest?.('[data-calc1-gate-locked="true"]');
 if(!anchor&&!button)return;
 e.preventDefault();e.stopImmediatePropagation();
 const rule=anchor?guard(new URL(anchor.href,location.href).pathname):canWeek(button.id==="openNext"?Number(button.textContent.match(/\d+/)?.[0]):Number(button.dataset.week));
 message(rule.reason||"Progression is locked until 80% mastery.");
},true);
let queued=false;
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}
new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
window.addEventListener("storage",schedule);
apply();
})();