window.CALC1_PROGRESS_GATES=(function core(){
"use strict";
const THRESHOLD=80,ROOT="khaemenes-calculus1-course-v1",COURSE_BANK="khaemenes-calculus1-assessment-records-v2",LESSON_BANK="khaemenes-calculus1-lesson-mastery-v1",SOURCE="calc1-lesson-practice-v1";
const unitOne=["u01-l01","u01-l02","u01-l03","u01-l04","u01-l05","u01-l06","u01-l07"];
function parse(key){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):null}catch{return null}}
function learner(){
 const raw=parse(ROOT);
 if(!raw||!Array.isArray(raw.students)||typeof raw.activeId!=="string"||!raw.activeId)return null;
 const s=raw.students.find(s=>s&&s.id===raw.activeId);
 return s&&typeof s.id==="string"&&s.id?{id:s.id,name:String(s.name||"Learner").slice(0,80)}:null;
}
function lessonsKey(id){return LESSON_BANK+":"+encodeURIComponent(id)}
function assessmentsKey(id){return COURSE_BANK+":"+encodeURIComponent(id)}
function goodAttempt(a,kind){
 return a&&a.source===kind&&a.learnerId&&
   typeof a.score==="number"&&Number.isFinite(a.score)&&a.score>=THRESHOLD&&a.score<=100&&
   Number.isInteger(a.total)&&a.total>=10&&a.passed===true&&
   Array.isArray(a.items)&&a.items.length===a.total;
}
function readLesson(lessonId){
 const active=learner();if(!active)return [];
 const store=parse(lessonsKey(active.id));
 const record=store?.lessons?.[lessonId];
 return Array.isArray(record?.attempts)?record.attempts.filter(a=>a.learnerId===active.id):[];
}
function lessonBest(id){
 const a=readLesson(id).filter(x=>goodAttempt(x,SOURCE));
 return a.length?Math.max(...a.map(x=>x.score)):0;
}
function lessonMastered(id){return lessonBest(id)>=THRESHOLD}
function unitBest(n){
 const active=learner();if(!active)return 0;
 const p=parse(assessmentsKey(active.id));
 const a=p?.["unit-"+String(n).padStart(2,"0")+"-mastery"]?.attempts||[];
 // Formative-only local gate. No credential / transcript authority.
 const ok=Array.isArray(a)?a.filter(x=>x&&x.source==="public-formative-practice"&&
   x.learnerId===active.id&&x.practicePassed===true&&Number.isFinite(Number(x.score))&&
   Number(x.score)>=THRESHOLD&&Array.isArray(x.items)&&x.items.length>=10):[];
 return ok.length?Math.max(...ok.map(x=>Number(x.score))):0;
}
function unitMastered(n){
 return (n!==1||unitOne.every(lessonMastered))&&unitBest(n)>=THRESHOLD;
}
function canOpenLesson(id){
 const unit=Number(id.match(/^u(\d{2})-l\d{2}$/)?.[1]);
 if(!unit)return {ok:false,reason:"Unknown lesson identifier",required:null};
 const local=unitOne.indexOf(id);
 if(unit===1&&local<0)return {ok:false,reason:"Unknown Unit 01 lesson",required:null};
 if(unit>1&&!unitMastered(unit-1))return {ok:false,reason:"Unit "+(unit-1)+" requires 80% mastery before Unit "+unit+".",required:"unit-"+(unit-1)};
 if(unit>1){
  const nth=Number(id.match(/-l(\d{2})$/)?.[1]);
  const previous="u"+String(unit).padStart(2,"0")+"-l"+String(nth-1).padStart(2,"0");
  if(nth>1&&!lessonMastered(previous))return {ok:false,reason:"The preceding lesson needs an 80% mastery score. This later unit's lesson assessments remain in the academic development queue.",required:previous};
 }
 if(unit===1&&local>0&&!lessonMastered(unitOne[local-1]))return {ok:false,reason:"The previous lesson requires 80% mastery first.",required:unitOne[local-1]};
 // Only Unit 01 has finished lesson-level mastery banks in this pass.
 if(unit>1&&local===-1)return {ok:true,underReview:true};
 return {ok:true};
}
function canOpenUnit(n){
 if(!Number.isInteger(n)||n<1||n>13)return {ok:false,reason:"Invalid unit"};
 if(n===1)return {ok:true};
 return unitMastered(n-1)?{ok:true}:{ok:false,reason:"Unit "+(n-1)+" requires 80% mastery on every required lesson and its unit assessment before Unit "+n+" opens.",required:"unit-"+(n-1)};
}
function saveLessonAttempt(id,record){
 const active=learner();
 if(!active||!unitOne.includes(id)||!record||record.learnerId!==active.id)return false;
 if(record.source!==SOURCE||!Number.isInteger(record.total)||record.total!==10||
    !Array.isArray(record.items)||record.items.length!==10||
    typeof record.score!=="number"||record.score<0||record.score>100||
    typeof record.passed!=="boolean"||record.passed!==(record.score>=THRESHOLD))return false;
 const key=lessonsKey(active.id);
 try{
  const data=parse(key)||{version:1,lessons:{}};
  if(!data.lessons||typeof data.lessons!=="object")data.lessons={};
  if(!data.lessons[id])data.lessons[id]={attempts:[]};
  const history=Array.isArray(data.lessons[id].attempts)?data.lessons[id].attempts:[];
  data.lessons[id].attempts=[...history,record].slice(-20);
  const serialized=JSON.stringify(data);
  // Do not save if the user switched learners during scoring.
  if(learner()?.id!==active.id)return false;
  localStorage.setItem(key,serialized);
  return localStorage.getItem(key)===serialized;
 }catch(e){return false}
}
return Object.freeze({threshold:THRESHOLD,unitOne,learner,readLesson,lessonMastered,lessonBest,unitBest,unitMastered,canOpenUnit,canOpenLesson,saveLessonAttempt});
})();
