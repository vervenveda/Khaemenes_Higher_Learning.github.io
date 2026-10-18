import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
let checks=0;
function check(ok,msg){checks++;assert.ok(ok,msg)}
const scripts=[
"assets/lesson-mastery-bank-u01.js","assets/calculus1-progress-gates-v1.js",
"assets/calculus1-lesson-mastery-ui-v1.js","assets/calculus1-unit01-mastery-source-v1.js",
"assets/calculus1-course-navigation-gates-v1.js","assets/calculus1-unit-route-gates-v1.js",
"assets/calculus1-direct-lesson-guard-v1.js","assets/assessment-engine.js","assets/app.js"];
for(const s of scripts){check(fs.existsSync(path.join(ROOT,s)),s+" must exist");new vm.Script(read(s),{filename:s});check(true,s+" must parse")}
const bankEnv={window:{},Math,console};vm.runInNewContext(read("assets/lesson-mastery-bank-u01.js"),bankEnv);
const bank=bankEnv.window.CALC1_LESSON_MASTERY_BANK;
check(bank.lessonIds.length===7,"Unit 01 has seven lesson assessments");
for(const lesson of bank.lessonIds){
 for(let i=0;i<20;i++){
  const questions=bank.generate(lesson);
  check(questions.length>=20,lesson+" must have at least 20 distinct generated problems");
  check(new Set(questions.map(q=>q.prompt)).size===questions.length,lesson+" duplicates a prompt");
  for(const q of questions){
    check(q.options.length===4&&new Set(q.options).size===4,lesson+" has ambiguous choices");
    check(q.answer===0&&!!q.explanation,lesson+" requires correct answer and explanation");
  }
 }
}
const storage=new Map(),store={getItem:k=>storage.has(k)?storage.get(k):null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
const env={window:{},localStorage:store,Number,Math,JSON,Set,encodeURIComponent};vm.runInNewContext(read("assets/calculus1-progress-gates-v1.js"),env);
const g=env.window.CALC1_PROGRESS_GATES;
check(g.threshold===80,"Course policy cannot be lowered");
check(g.canOpenLesson("u01-l01").ok,"First lesson may open");
check(!g.canOpenLesson("u01-l02").ok,"Second lesson must begin locked");
storage.set("khaemenes-calculus1-course-v1",JSON.stringify({activeId:"scholar-a",students:[{id:"scholar-a"},{id:"scholar-b"}]}));
const evidence=(id,score)=>({source:"calc1-lesson-practice-v1",learnerId:"scholar-a",lessonId:id,score,passed:score>=80,total:10,items:Array.from({length:10},(_,i)=>({id:id+"-q"+i,options:["A","B","C","D"],selectedIndex:0,correctIndex:0}))});
check(g.saveLessonAttempt("u01-l01",evidence("u01-l01",70)),"Failed attempts retained");
check(!g.canOpenLesson("u01-l02").ok,"70 percent cannot unlock next lesson");
check(g.saveLessonAttempt("u01-l01",evidence("u01-l01",80)),"80 percent retained");
check(g.canOpenLesson("u01-l02").ok,"80 percent unlocks next lesson");
for(const id of g.unitOne.slice(1))check(g.saveLessonAttempt(id,evidence(id,80)),"Lesson score saved");
check(!g.canOpenUnit(2).ok,"All lesson scores alone do not bypass unit assessment");
const a={source:"public-formative-practice",learnerId:"scholar-a",score:80,practicePassed:true,total:21,items:Array.from({length:21},(_,i)=>({id:"unit-q"+i}))};
storage.set("khaemenes-calculus1-assessment-records-v2:scholar-a",JSON.stringify({"unit-01-mastery":{attempts:[a]}}));
check(g.canOpenUnit(2).ok,"80 percent unit assessment unlocks next unit");
storage.set("khaemenes-calculus1-course-v1",JSON.stringify({activeId:"scholar-b",students:[{id:"scholar-a"},{id:"scholar-b"}]}));
check(!g.canOpenLesson("u01-l02").ok,"Other student must not inherit mastery");
check(!g.canOpenUnit(2).ok,"Other student must not inherit unit gate");
const src=read("units/unit-01/assessment/mastery-check.html");
check(src.includes('"count": 21')&&src.includes('"requireUnitOneLessons": true'),"Unit 01 cumulative assessment must be 21-question and prerequisite-gated");
for(let u=1;u<=13;u++){
 const unit="unit-"+String(u).padStart(2,"0");
 const page=read("units/"+unit+"/index.html");
 check(page.includes("calculus1-unit-route-gates-v1.js"),unit+" home requires live 80 percent gate");
 const dir="units/"+unit+"/lessons";
 const lessons=fs.readdirSync(path.join(ROOT,dir)).filter(p=>/^u\d{2}-l\d{2}\.html$/.test(p));
 check(lessons.length>=6,unit+" lesson count");
 for(const p of lessons){
  const html=read(dir+"/"+p);
  if(u===1){
   check(html.includes("calculus1-lesson-mastery-ui-v1.js"),p+" requires a specific scored assessment");
   check(html.includes("data-lesson-id="),p+" requires lesson ID");
  }else check(html.includes("calculus1-direct-lesson-guard-v1.js"),p+" requires direct-entry prerequisite guard");
 }
}
check(read("index.html").includes("calculus1-course-navigation-gates-v1.js"),"Course front door must decorate locked navigation");
console.log("PASS Calculus I Pre-Algebra parity: "+checks+" checks · 80% sequential lesson → unit gates · no cross-learner unlock");
