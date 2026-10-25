#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const base=path.join(root,"courses/science/bio-101");
const fail=[],pass=[];
const need=(ok,msg)=>(ok?pass:fail).push(msg);
const exists=p=>fs.existsSync(path.join(base,p));
const read=p=>fs.readFileSync(path.join(base,p),"utf8");
const json=p=>JSON.parse(read(p));

const required=[
"index.html","course-data.js","course-map.json","architecture-contract.json",
"manifest.webmanifest","service-worker.js","offline.html","README.md","FILE_MANIFEST.md",
"PROFILE_INTEGRATION_NOTES.md","UPDATE_NOTES.md","UPLOAD_MAP.md","VALIDATION_REPORT.md",
"assessments","assets","diagnostic","docs","records","teacher","teacher-keys","tools","units","labs","vocabulary"
];
for(const p of required)need(exists(p),"required package path: "+p);

let map,contract,diag,assess,labs,vocab;
try{map=json("course-map.json")}catch(e){fail.push("course-map parses: "+e.message)}
try{contract=json("architecture-contract.json")}catch(e){fail.push("architecture contract parses: "+e.message)}
try{diag=json("diagnostic/blueprint.json")}catch(e){fail.push("diagnostic blueprint parses: "+e.message)}
try{assess=json("assessments/assessment-map.json")}catch(e){fail.push("assessment map parses: "+e.message)}
try{labs=json("labs/laboratory-spine.json")}catch(e){fail.push("laboratory spine parses: "+e.message)}
try{vocab=json("vocabulary/weekly-map.json")}catch(e){fail.push("vocabulary weekly map parses: "+e.message)}

if(map){
 const units=Array.isArray(map.units)?map.units:[];
 const lessons=units.flatMap(u=>Array.isArray(u.lessons)?u.lessons:[]);
 const weeks=new Set(units.flatMap(u=>Array.isArray(u.week_numbers)?u.week_numbers:[]).map(Number));
 need(units.length===13,"13 units");
 need(lessons.length===92,"92 lesson records");
 need(weeks.size===36&&[...Array(36)].every((_,i)=>weeks.has(i+1)),"Weeks 1-36 covered exactly");
 need(Number(map.course?.duration_weeks)===36,"course map declares 36 weeks");
 need(Number(map.course?.sessions)===180,"course map declares 180 sessions");
 need(Number(map.course?.mastery_target)===80,"course map declares 80% mastery target");
 const ids=lessons.map(x=>x.id);
 need(new Set(ids).size===ids.length,"lesson IDs unique");
}

if(contract){
 need(contract.duration?.weeks===36,"contract weeks = 36");
 need(contract.duration?.sessions===180,"contract sessions = 180");
 need(contract.duration?.units===13,"contract units = 13");
 need(contract.duration?.lessons===92,"contract lessons = 92");
 need(contract.laboratories?.investigations===13,"contract labs = 13");
 need(contract.vocabulary?.total_placements===216,"contract vocabulary placements = 216");
 need(contract.diagnostic?.questions===40,"contract diagnostic = 40 questions");
 need(contract.assessments?.unit_mastery_checks===13,"contract unit mastery checks = 13");
 need(contract.assessments?.midterm_questions===60,"contract midterm = 60 questions");
 need(contract.assessments?.final_questions===100,"contract final = 100 questions");
}

if(diag)need(Number(diag.question_count||diag.questions||diag.total_questions)===40,"diagnostic blueprint specifies 40 questions");
if(assess){
 need(assess.unit_mastery?.count===13,"assessment map has 13 unit mastery checks");
 need(assess.unit_mastery?.questions_each===10,"unit mastery checks use 10 questions");
 need(assess.midterm?.questions===60,"midterm has 60 questions");
 need(assess.final?.questions===100,"final has 100 questions");
 need(assess.mastery_target===80,"assessment mastery target is 80%");
}
if(labs){
 need(labs.minimum_investigations===13,"laboratory spine requires 13 investigations");
 need(Array.isArray(labs.investigations)&&labs.investigations.length===13,"laboratory spine defines 13 investigations");
 const units=labs.investigations?.map(x=>Number(x.unit))||[];
 need(new Set(units).size===13&&[...Array(13)].every((_,i)=>units.includes(i+1)),"one investigation mapped to every unit");
}
if(vocab){
 need(vocab.weeks===36,"vocabulary map has 36 weeks");
 need(vocab.terms_per_week===6,"vocabulary target is 6 terms/week");
 need(vocab.total_placements===216,"vocabulary placements total 216");
 need(Array.isArray(vocab.placements)&&vocab.placements.length===36,"vocabulary defines 36 weekly placements");
 need(vocab.placements?.every(x=>Array.isArray(x.terms)&&x.terms.length===6),"every week has six vocabulary terms");
}

console.log("BIO 101 Architecture Validation");
console.log("PASS:",pass.length);
if(fail.length){
 console.error("FAIL:",fail.length);
 for(const f of fail)console.error("FAIL:",f);
 process.exit(1);
}
console.log("RESULT: PASS");
