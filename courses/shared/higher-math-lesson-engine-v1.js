(()=>{"use strict";
const $=s=>document.querySelector(s),esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const courseId=document.body.dataset.courseId||"",hybrid=document.body.dataset.hybrid==="true";
const root=$("#higherMathEngine");
function params(){return new URLSearchParams(location.search)}
function lessonKey(){return params().get("lesson")||""}
async function loadFull(){
 const r=await fetch("course-map.json",{cache:"no-store"});if(!r.ok)throw Error("course-map");
 const map=await r.json(),lessons=(map.units||[]).flatMap(u=>(u.lessons||[]).map(l=>({...l,unitTitle:u.title,essential:u.essential,project:u.project,standards:u.standards||[]})));
 if(!lessons.length)throw Error("lessons");
 let lesson=lessons.find(x=>x.id===lessonKey())||lessons[0],idx=lessons.findIndex(x=>x.id===lesson.id);
 return {map,lessons,lesson,idx,title:map.course?.short_title||map.course?.title||courseId};
}
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement("script");s.src=src;s.onload=res;s.onerror=rej;document.head.append(s)})}
async function loadHybrid(){
 await loadScript("assets/course-data.js");
 const D=window.KHAE_ADVANCED_COURSE_DATA,sessions=Array.isArray(D?.sessions)?D.sessions:[];
 if(!sessions.length)throw Error("hybrid-data");
 let id=lessonKey(),lesson=sessions.find(x=>x.id===id)||sessions[0],idx=sessions.findIndex(x=>x.id===lesson.id);
 return {hybrid:true,lessons:sessions,lesson,idx,title:"Advanced Geometric Topology & Mathematical Physics"};
}
async function sourceHTML(data){
 if(data.hybrid)return '<p>This program is still in its declared hybrid migration state. Open the current session in the protected V2/legacy runtime to preserve proof, lab, correction and defense evidence.</p><p><a class="khm-btn dark" href="lesson.html?week='+data.lesson.week+'&day='+data.lesson.day+'">Open Current Hybrid Session</a></p>';
 const l=data.lesson,u=String(l.unit).padStart(2,"0"),path='units/unit-'+u+'/lessons/'+l.id+'.html';
 try{
  const r=await fetch(path,{cache:"no-store"});if(!r.ok)throw Error("source");
  const doc=new DOMParser().parseFromString(await r.text(),"text/html");
  const node=doc.querySelector(".lesson-main")||doc.querySelector(".lesson-layout")||doc.querySelector("main");
  return node?node.innerHTML:'<p>Detailed lesson source is available at <a href="'+path+'">'+path+'</a>.</p>';
 }catch{return '<p>Detailed lesson source is available at <a href="'+path+'">'+path+'</a>.</p>'}
}
function navUrl(item){return "math-lesson.html?lesson="+encodeURIComponent(item.id)}
let activeLearnerId=null;
function noteKey(id){return activeLearnerId?"khaemenes-higher-math-engine-note:v2:"+encodeURIComponent(activeLearnerId)+":"+courseId+":"+id:null}
function storeNote(id,text){const key=noteKey(id);if(!key)return false;try{localStorage.setItem(key,text);return localStorage.getItem(key)===text}catch{return false}}
function readNote(id){const key=noteKey(id);if(!key)return"";try{return localStorage.getItem(key)||""}catch{return""}}
async function render(){
 const access=await window.KhaemenesHigherMathClassEntry?.requireAccess?.();
 if(!access)return;
 activeLearnerId=access.learner?.learnerId||null;
 const data=hybrid?await loadHybrid():await loadFull(),l=data.lesson,prev=data.lessons[data.idx-1],next=data.lessons[data.idx+1],src=await sourceHTML(data);
 document.title=l.title+" · "+data.title+" · Khaemenes Higher Learning";
 document.body.dataset.lesson=l.id;
 root.innerHTML='<div class="shell khm-lesson-shell"><header class="khm-lesson-head"><p class="khm-eyebrow">'+esc(data.title)+' · '+esc(data.hybrid?("Week "+l.week+" · Day "+l.day):("Unit "+String(l.unit).padStart(2,"0")+" · Lesson "+String(l.number).padStart(2,"0")))+'</p><h1>'+esc(l.title)+'</h1><p class="lead">'+esc(l.focus||l.purpose||l.essential||"Proof-centered mathematics with explicit reasoning, evidence and reflection.")+'</p></header>'+
 '<div class="khm-lesson-nav"><a class="khm-btn dark" href="index.html">Course Home</a>'+(prev?'<a class="khm-btn" href="'+navUrl(prev)+'">← Previous</a>':'')+'<select class="khm-select" id="khmLessonSelect" aria-label="Choose lesson">'+data.lessons.map(x=>'<option value="'+esc(x.id)+'" '+(x.id===l.id?'selected':'')+'>'+esc(x.id+" · "+x.title)+'</option>').join("")+'</select>'+(next?'<a class="khm-btn dark" href="'+navUrl(next)+'">Next →</a>':'')+'</div>'+
 '<div class="khm-flow">'+
 '<section class="khm-step"><p class="khm-kicker">01 · Orient</p><h2>Lesson purpose</h2><p>'+esc(l.essential||l.purpose||l.focus||l.title)+'</p></section>'+
 '<section class="khm-step"><p class="khm-kicker">02 · Recall</p><h2>Prerequisite connection</h2><p>'+esc(data.hybrid?"Retrieve the definitions, theorem hypotheses and prior unit results this session depends on.":data.map.course?.prerequisite||"Retrieve the prerequisite definitions and methods needed for this lesson.")+'</p></section>'+
 '<section class="khm-step"><p class="khm-kicker">03–08 · Learn · Worked · Guided · Independent · Error · Transfer</p><h2>Authoritative lesson content</h2><div class="khm-source">'+src+'</div></section>'+
 '<section class="khm-step"><p class="khm-kicker">09 · Feedback</p><h2>Mastery evidence</h2><p>Academy mathematics uses an 80% minimum where objective mastery applies. Proof-based courses also require reviewed written proof and any assigned lab, correction or defense evidence. Browser practice alone does not award formal mastery.</p></section>'+
 '<section class="khm-step"><p class="khm-kicker">10 · Reflect</p><h2>Save a learner-owned reflection</h2><textarea class="khm-note" id="khmReflection" placeholder="Strategy, correction, question, proof note or next step">'+esc(readNote(l.id))+'</textarea><p><button class="khm-btn dark" id="khmSaveReflection" type="button">Save Reflection</button></p><p class="khm-status" id="khmStatus"></p></section>'+
 '</div></div>';
 $("#khmLessonSelect")?.addEventListener("change",e=>{location.href=navUrl({id:e.target.value})});
 $("#khmSaveReflection")?.addEventListener("click",()=>{const ok=storeNote(l.id,$("#khmReflection").value.trim());$("#khmStatus").textContent=ok?"Reflection saved locally for this learner and lesson.":"Reflection save paused because learner ownership could not be verified.";});
 window.PAGE_REF={course:courseId,unit:String(l.unit||l.week||1).padStart(2,"0"),lesson:String(l.number||l.day||1).padStart(2,"0")};
}
render().catch(err=>{root.innerHTML='<div class="shell khm-lesson-shell"><section class="khm-step"><h1>Lesson engine unavailable</h1><p>The curriculum source could not be loaded. Existing course records were not changed.</p><p>'+esc(err.message)+'</p></section></div>'});
})();