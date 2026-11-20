import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
const root=path.resolve(process.cwd());
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));
const normalize=s=>String(s||"")
 .replaceAll("&amp;","&")
 .replaceAll("&#x27;","'")
 .replaceAll("&#39;","'")
 .replaceAll("&quot;",'"')
 .replaceAll("&lt;","<")
 .replaceAll("&gt;",">")
 .replaceAll("&ndash;","–")
 .replaceAll("&mdash;","—");
const base="courses/introduction-to-proofs/";
const map=JSON.parse(read(base+"course-map.json"));
const lessons=(map.units||[]).flatMap(u=>(u.lessons||[]).map(l=>({...l,unitMeta:u})));

assert.equal(map.course?.profile_course_id,"introduction-to-proofs");
assert.equal(map.course?.lesson_count,92);
assert.equal(lessons.length,92);
assert.equal((map.units||[]).length,13);
assert.equal(map.course?.duration_weeks,36);
assert.equal(map.course?.mastery_target,80);
assert.equal(map.course?.proof_mastery_contract?.required,true);
assert.equal(map.course?.proof_mastery_contract?.written_proof_review,"required-evaluator-review");
assert.equal(map.course?.proof_mastery_contract?.noncompensatory,true);

const ids=new Set(),mappedFiles=new Set();
for(const l of lessons){
 assert(!ids.has(l.id),"duplicate lesson id "+l.id); ids.add(l.id);
 const unit=String(l.unit).padStart(2,"0"),rel="units/unit-"+unit+"/lessons/"+l.id+".html",p=base+rel;
 mappedFiles.add(rel);
 assert(exists(p),"missing mapped lesson "+p);
 const html=read(p);
 const bodyId=(html.match(/data-lesson-id=["']([^"']+)["']/i)||[])[1]||"";
 if(bodyId)assert.equal(bodyId,l.id,l.id+" body lesson id mismatch");
 assert(/class=["'][^"']*\blesson-layout\b/i.test(html) || /class=["'][^"']*\blesson-main\b/i.test(html),l.id+" missing compatible authoritative lesson content container");
 const title=(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||[])[1]||"";
 assert.equal(normalize(title.replace(/<[^>]+>/g,"")).trim(),normalize(l.title).trim(),l.id+" source title/content mismatch");
 assert(html.includes("../../../assets/styles.css"),l.id+" source lesson stylesheet contract missing");
}
assert.equal(ids.size,92);

const actualFiles=[];
for(const u of map.units||[]){
 const unit=String(u.number).padStart(2,"0");
 const dir=path.join(root,base,"units","unit-"+unit,"lessons");
 for(const name of fs.readdirSync(dir))if(/^u\d\d-l\d\d\.html$/.test(name))actualFiles.push("units/unit-"+unit+"/lessons/"+name);
}
assert.equal(actualFiles.length,92,"unexpected Introduction to Proofs lesson-file count");
for(const rel of actualFiles)assert(mappedFiles.has(rel),"unmapped Introduction to Proofs lesson file "+rel);

const landing=read(base+"index.html");
assert(landing.includes('href="math-lesson.html" data-higher-math-enter-class'),"Introduction to Proofs Enter Class is not enrollment-gated");
assert(landing.includes("higher-math-class-entry-v1.js"),"Introduction to Proofs landing missing enrollment gate");

const doorway=read(base+"math-lesson.html");
for(const required of [
 "../shared/higher-math-minimal-v1.css",
 "../shared/higher-math-source-content-v1.css",
 "../shared/higher-math-class-entry-v1.js",
 "../shared/higher-math-lesson-engine-v1.js",
 'data-course-id="introduction-to-proofs"',
 'id="higherMathEngine"'
])assert(doorway.includes(required),"Introduction to Proofs lesson doorway missing "+required);

const engine=read("courses/shared/higher-math-lesson-engine-v1.js");
assert(engine.includes('fetch("course-map.json"'),"engine must resolve course map");
assert(engine.includes("units/unit-"),"engine must resolve unit lesson source path");
assert(engine.includes('KhaemenesHigherMathClassEntry?.requireAccess'),"engine must fail closed through learner gate");
assert(engine.includes('activeLearnerId=access.learner?.learnerId'),"engine must bind learner before learner-owned state");
assert(engine.includes('khaemenes-higher-math-engine-note:v2:'),"reflection must use learner-scoped v2 key");
assert(engine.includes('doc.querySelector(".lesson-main")||doc.querySelector(".lesson-layout")||doc.querySelector("main")'),"engine must preserve proof-course lesson-layout fallback");
assert(engine.includes('function navUrl(item){return "math-lesson.html?lesson="+encodeURIComponent(item.id)}'),"engine prev/next/selector URL contract missing");

assert.equal(lessons[0].id,"u01-l01","unexpected first Introduction to Proofs lesson");
assert.equal(lessons.at(-1).id,"u13-l08","unexpected final Introduction to Proofs lesson");

const sourceCss=read("courses/shared/higher-math-source-content-v1.css");
for(const selector of [
 ".khm-source .lesson-layout",
 ".khm-source .proof-step",
 ".khm-source .question-card",
 ".khm-source .answer-list",
 ".khm-source .answer-option",
 ".khm-source .explanation",
 ".khm-source .lesson-record",
 ".khm-source .worksheet",
 ".khm-source .worked-example",
 ".khm-source .quick-check-grid",
 ".khm-source .work-lines"
])assert(sourceCss.includes(selector),"source-style bridge missing "+selector);

console.log("PASS Introduction to Proofs wiring: landing -> enrollment gate -> math lesson doorway -> shared Higher Math engine -> 13 units / 92 mapped authoritative lesson files; lesson-layout fallback, proof presentation, learner-scoped reflection, and noncompensatory proof mastery contract preserved.");
