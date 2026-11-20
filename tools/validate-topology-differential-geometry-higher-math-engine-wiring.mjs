import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
const root=path.resolve(process.cwd());
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));
const normalize=s=>String(s||"").replaceAll("&amp;","&").replaceAll("&#x27;","'").replaceAll("&#39;","'").replaceAll("&quot;",'"').replaceAll("&lt;","<").replaceAll("&gt;",">").replaceAll("&ndash;","–").replaceAll("&mdash;","—");
const base="courses/topology-differential-geometry/";
const map=JSON.parse(read(base+"course-map.json"));
const lessons=(map.units||[]).flatMap(u=>(u.lessons||[]).map(l=>({...l,unitMeta:u})));

assert.equal(map.course?.profile_course_id,"topology-differential-geometry");
assert.equal(map.course?.lesson_count,92);
assert.equal(lessons.length,92);
assert.equal((map.units||[]).length,13);
assert.equal(map.course?.duration_weeks,36);
assert.equal(map.course?.sessions,180);
assert.equal(map.course?.mastery_target,80);
assert.equal(map.course?.proof_mastery_contract?.required,true);
assert.equal(map.course?.proof_mastery_contract?.written_proof_review,"required-evaluator-review");
assert.equal(map.course?.proof_mastery_contract?.lab_evidence,"required-where-assigned");
assert.equal(map.course?.proof_mastery_contract?.defense_review,"required-for-completion");
assert.equal(map.course?.proof_mastery_contract?.noncompensatory,true);

const ids=new Set(),mappedFiles=new Set();
for(const l of lessons){
 assert(!ids.has(l.id),"duplicate lesson id "+l.id); ids.add(l.id);
 const unit=String(l.unit).padStart(2,"0"),rel="units/unit-"+unit+"/lessons/"+l.id+".html",p=base+rel;
 mappedFiles.add(rel); assert(exists(p),"missing mapped lesson "+p);
 const html=read(p);
 assert(/class=["'][^"']*\blesson-layout\b/i.test(html)||/class=["'][^"']*\blesson-main\b/i.test(html),l.id+" missing compatible lesson content container");
 const title=(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||[])[1]||"";
 assert.equal(normalize(title.replace(/<[^>]+>/g,"")).trim(),normalize(l.title).trim(),l.id+" source title/content mismatch");
 assert(html.includes("../../../assets/styles.css"),l.id+" source stylesheet contract missing");
}
assert.equal(ids.size,92);

const officialActual=[];
for(const u of map.units||[]){
 const unit=String(u.number).padStart(2,"0");
 const dir=path.join(root,base,"units","unit-"+unit,"lessons");
 for(const name of fs.readdirSync(dir)) if(/^u\d\d-l\d\d\.html$/.test(name)) officialActual.push("units/unit-"+unit+"/lessons/"+name);
}
assert.equal(officialActual.length,92,"unexpected official topology/geometry lesson-file count");
for(const rel of officialActual) assert(mappedFiles.has(rel),"unmapped official topology/geometry lesson file "+rel);

const bridgeDir=path.join(root,base,"units","unit-00","lessons");
const bridgeFiles=fs.readdirSync(bridgeDir).filter(n=>/^u00-l0[1-6]\.html$/.test(n));
assert.equal(bridgeFiles.length,6,"optional Unit 00 readiness bridge must contain six lessons");
const readme=read(base+"README.md");
assert(readme.includes("optional six-lesson Unit 00 proof and calculus bridge"),"README must preserve Unit 00 as optional prerequisite bridge");
assert(readme.includes("do not count against the 36 official weeks")||readme.includes("do not count against the 36 official weeks".replace("do not","does not")),"README must keep Unit 00 outside official 36-week sequence");

const landing=read(base+"index.html");
assert(landing.includes('href="math-lesson.html" data-higher-math-enter-class'),"Topology & Differential Geometry Enter Class is not enrollment-gated");
assert(landing.includes("higher-math-class-entry-v1.js"),"landing missing enrollment gate");

const doorway=read(base+"math-lesson.html");
for(const required of ["../shared/higher-math-minimal-v1.css","../shared/higher-math-source-content-v1.css","../shared/higher-math-class-entry-v1.js","../shared/higher-math-lesson-engine-v1.js",'data-course-id="topology-differential-geometry"','id="higherMathEngine"'])
 assert(doorway.includes(required),"lesson doorway missing "+required);

const engine=read("courses/shared/higher-math-lesson-engine-v1.js");
assert(engine.includes('fetch("course-map.json"'),"engine must resolve course map");
assert(engine.includes("units/unit-"),"engine must resolve lesson paths");
assert(engine.includes('KhaemenesHigherMathClassEntry?.requireAccess'),"engine must fail closed through learner gate");
assert(engine.includes('activeLearnerId=access.learner?.learnerId'),"engine must bind learner identity");
assert(engine.includes('khaemenes-higher-math-engine-note:v2:'),"reflection must use learner-scoped v2 key");
assert(engine.includes('doc.querySelector(".lesson-main")||doc.querySelector(".lesson-layout")||doc.querySelector("main")'),"engine must preserve lesson-layout fallback");
assert.equal(lessons[0].id,"u01-l01");
assert.equal(lessons.at(-1).id,"u13-l07");

const sourceCss=read("courses/shared/higher-math-source-content-v1.css");
for(const selector of [".khm-source .lesson-layout",".khm-source .proof-step",".khm-source .question-card",".khm-source .answer-list",".khm-source .explanation",".khm-source .lesson-record",".khm-source .worksheet",".khm-source .worked-example",".khm-source .quick-check-grid",".khm-source .work-lines"])
 assert(sourceCss.includes(selector),"source-style bridge missing "+selector);

console.log("PASS Topology & Differential Geometry wiring: 13 official units / 92 mapped lessons plus preserved optional six-lesson Unit 00 readiness bridge; shared engine, learner gate, proof/lab/defense mastery boundaries preserved.");
