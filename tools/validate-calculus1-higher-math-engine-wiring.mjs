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
 .replaceAll("&gt;",">");
const base="courses/mathematics/calculus-1/";
const map=JSON.parse(read(base+"course-map.json"));
const lessons=(map.units||[]).flatMap(u=>(u.lessons||[]).map(l=>({...l,unitMeta:u})));

assert.equal(map.course?.profile_course_id,"calculus-i");
assert.deepEqual(map.course?.profile_course_aliases,["calculus-1"]);
assert.equal(map.course?.lesson_count,92);
assert.equal(lessons.length,92);
assert.equal((map.units||[]).length,13);
assert.equal(map.course?.duration_weeks,36);
assert.equal(map.course?.mastery_target,80);

const ids=new Set();
for(const l of lessons){
 assert(!ids.has(l.id),"duplicate lesson id "+l.id);ids.add(l.id);
 const unit=String(l.unit).padStart(2,"0");
 const p=base+"units/unit-"+unit+"/lessons/"+l.id+".html";
 assert(exists(p),"missing mapped lesson "+p);
 const html=read(p);
 const bodyId=(html.match(/data-lesson-id=["']([^"']+)["']/i)||[])[1]||"";
 if(bodyId)assert.equal(bodyId,l.id,l.id+" body lesson id mismatch");
 assert(html.includes('class="lesson-main"'),l.id+" missing authoritative lesson-main content container");
 const title=(html.match(/<h1>([\s\S]*?)<\/h1>/i)||[])[1]||"";
 assert.equal(normalize(title).trim(),normalize(l.title).trim(),l.id+" source title/content mismatch");
 assert(html.includes("../../../assets/styles.css"),l.id+" source lesson stylesheet contract missing");
}
assert.equal(ids.size,92);

const landing=read(base+"index.html");
assert(landing.includes('href="math-lesson.html" data-higher-math-enter-class'),"Calculus I Enter Class is not enrollment-gated");
assert(landing.includes("higher-math-class-entry-v1.js"),"Calculus I landing missing enrollment gate");

const doorway=read(base+"math-lesson.html");
for(const required of [
 "../../shared/higher-math-minimal-v1.css",
 "../../shared/higher-math-source-content-v1.css",
 "../../shared/higher-math-class-entry-v1.js",
 "../../shared/higher-math-lesson-engine-v1.js",
 'data-course-id="calculus-i"',
 'id="higherMathEngine"'
])assert(doorway.includes(required),"Calculus I lesson doorway missing "+required);

const engine=read("courses/shared/higher-math-lesson-engine-v1.js");
assert(engine.includes('fetch("course-map.json"'),"engine must resolve course map");
assert(engine.includes("units/unit-"),"engine must resolve unit lesson source path");
assert(engine.includes('KhaemenesHigherMathClassEntry?.requireAccess'),"engine must fail closed through learner gate");
assert(engine.includes('activeLearnerId=access.learner?.learnerId'),"engine must bind learner before learner-owned state");
assert(engine.includes('khaemenes-higher-math-engine-note:v2:'),"reflection must use learner-scoped v2 key");
assert(engine.includes('function navUrl(item){return "math-lesson.html?lesson="+encodeURIComponent(item.id)}'),"engine prev/next/selector URL contract missing");

const first=lessons[0],last=lessons.at(-1);
assert.equal(first.id,"u01-l01","unexpected first Calculus I lesson");
assert.equal(last.id,"u13-l06","unexpected final Calculus I lesson");
assert(exists(base+"units/unit-01/lessons/u01-l01.html"));
assert(exists(base+"units/unit-13/lessons/u13-l06.html"));

const sourceCss=read("courses/shared/higher-math-source-content-v1.css");
for(const selector of [
 ".khm-source .visual-card",
 ".khm-source .lesson-diagram",
 ".khm-source .formula-chip",
 ".khm-source .worksheet-grid",
 ".khm-source .problem-box",
 ".khm-source .grid",
 ".khm-source .col4",
 ".khm-source .card",
 ".khm-source .work-lines"
])assert(sourceCss.includes(selector),"source-style bridge missing "+selector);

console.log("PASS Calculus I wiring: landing -> enrollment gate -> math lesson doorway -> shared Higher Math engine -> 13 units / 92 mapped authoritative lesson files; source presentation and learner-scoped reflection preserved.");
