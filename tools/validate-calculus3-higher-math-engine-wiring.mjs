import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
const root=path.resolve(process.cwd());
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));
const norm=s=>String(s||"").replaceAll("&amp;","&").replaceAll("&#39;","'").replaceAll("&#x27;","'").replaceAll("&quot;",'"').replace(/<[^>]+>/g,"").trim();
const base="courses/calculus-iii-multivariable/";
const map=JSON.parse(read(base+"course-map.json"));
const lessons=(map.units||[]).flatMap(u=>(u.lessons||[]).map(l=>({...l,unitMeta:u})));
assert.equal(map.course?.profile_course_id,"calculus-iii-multivariable");
assert.equal(map.course?.duration_weeks,36);
assert.equal(map.course?.sessions,180);
assert.equal(map.course?.lesson_count,92);
assert.equal(map.course?.mastery_target,80);
assert.equal((map.units||[]).length,13);
assert.equal((map.units||[]).reduce((n,u)=>n+Number(u.weeks||0),0),36);
assert.equal(lessons.length,92);
assert.equal(lessons[0].id,"u01-l01");
assert.equal(lessons.at(-1).id,"u13-l08");

const ids=new Set(),mapped=new Set();
for(const l of lessons){
 assert(!ids.has(l.id),"duplicate lesson "+l.id);ids.add(l.id);
 const unit=String(l.unit).padStart(2,"0");
 const rel="units/unit-"+unit+"/lessons/"+l.id+".html",p=base+rel;mapped.add(rel);
 assert(exists(p),"missing "+p);
 const html=read(p);
 assert(html.includes('class="lesson-main"'),l.id+" missing lesson-main");
 assert(html.includes('class="lesson-layout"'),l.id+" missing lesson-layout");
 assert(html.includes('../../../assets/styles.css'),l.id+" source stylesheet missing");
 assert((html.match(/class="question-card"/g)||[]).length>=6,l.id+" insufficient guided/transfer prompts");
 assert((html.match(/<li>/g)||[]).length>=10,l.id+" insufficient structured practice/reasoning");
 const h1=(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||[])[1]||"";
 assert.equal(norm(h1),norm(l.title),l.id+" source title mismatch");
}
const actual=[];
for(const u of map.units){
 const dir=path.join(root,base,"units","unit-"+String(u.number).padStart(2,"0"),"lessons");
 for(const f of fs.readdirSync(dir))if(/^u\d{2}-l\d{2}\.html$/.test(f))actual.push("units/unit-"+String(u.number).padStart(2,"0")+"/lessons/"+f);
}
assert.equal(actual.length,92);
for(const rel of actual)assert(mapped.has(rel),"unmapped lesson "+rel);

function questionCount(p){return (read(p).match(/class="lesson-section question-card"/g)||[]).length}
assert.equal(questionCount(base+"diagnostic/index.html"),40,"diagnostic count");
assert.equal(questionCount(base+"assessments/midterm.html"),60,"midterm count");
assert.equal(questionCount(base+"assessments/final.html"),100,"final count");
for(const u of map.units){
 const p=base+"units/unit-"+String(u.number).padStart(2,"0")+"/mastery-check.html";
 assert(exists(p),"missing unit mastery "+u.number);
 assert.equal(questionCount(p),10,"unit "+u.number+" mastery count");
 assert(read(p).includes("../../assets/styles.css"),"unit "+u.number+" mastery stylesheet");
}
assert(read(base+"assessments/midterm.html").includes("Closed-book"),"midterm must declare closed-book");
assert(read(base+"assessments/final.html").includes("Closed-book"),"final must declare closed-book");

const landing=read(base+"index.html");
assert(landing.includes('data-higher-math-enter-class'),"landing gate missing");
assert(landing.includes("../shared/higher-math-class-entry-v1.js"),"class-entry script missing");
const doorway=read(base+"math-lesson.html");
for(const x of ["../shared/higher-math-minimal-v1.css","../shared/higher-math-source-content-v1.css","../shared/higher-math-class-entry-v1.js","../shared/higher-math-lesson-engine-v1.js",'data-course-id="calculus-iii-multivariable"',"assets/calculus3-progress-adapter-v1.js"])assert(doorway.includes(x),"doorway missing "+x);
const progress=read(base+"assets/calculus3-progress-adapter-v1.js");
for(const x of ["THRESHOLD=80","khaemenes-calculus3-mastery-v1:","KhaemenesHigherMathProgression","score)>=THRESHOLD","learnerId"])assert(progress.includes(x),"progression adapter missing "+x);

const record=read(base+"assets/app-core.js");
assert(record.includes("khaemenes-calculus3-multivariable-course-v1"),"record root missing");
assert(record.includes("khaemenes_active_learner_v1"),"Academy learner binding missing");
assert(record.includes("data-higher-math-evidence-receipt"),"evidence receipt control missing");
assert(exists(base+"records/course-completion-certificate.html"),"completion record missing");

const receipt=read("courses/shared/higher-math-evidence-receipt-v1.js");
assert(receipt.includes('"calculus-iii-multivariable":{'),"shared evidence receipt config missing calc3");
assert(receipt.includes("calculus-iii-multivariable|differential-equations"),"receipt route matcher missing calc3");

const matrix=JSON.parse(read("courses/mathematics-execution-matrix-v1.json"));
const c3=matrix.courses.find(x=>x.id==="calculus-iii-multivariable");
assert(c3,"matrix calc3 missing");
assert.equal(c3.architecture,"full-map");
assert.deepEqual(c3.progression.prerequisite_courses,["calculus-ii"]);
const topo=matrix.courses.find(x=>x.id==="topology-differential-geometry");
assert(topo.progression.prerequisite_courses.includes("calculus-iii-multivariable"),"Topology calc3 prerequisite missing");

const graph=JSON.parse(read("courses/mathematics-progression-graph-v1.json"));
const node=graph.branch_nodes.find(x=>x.id==="calculus-iii-multivariable");
assert.equal(node?.status,"active");
assert.equal(graph.unresolved_gaps.find(x=>x.id==="gap-calculus-iii")?.status,"resolved");

console.log("PASS Calculus III release: 13 units / 36 weeks / 180 sessions / 92 lessons, 40 readiness prompts, 13x10 unit mastery reviews, 60 midterm, 100 final, learner-scoped records/progression, shared engine/evidence receipt, and Topology prerequisite integration.");
