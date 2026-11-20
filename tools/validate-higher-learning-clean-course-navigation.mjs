import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
const root=path.resolve(process.cwd());
const read=p=>fs.readFileSync(path.join(root,p),"utf8");

const courses=[
 ["precalculus-trigonometry","courses/mathematics/precalculus-trigonometry/","./courses/mathematics/precalculus-trigonometry/index.html","./mathematics/precalculus-trigonometry/"],
 ["calculus-i","courses/mathematics/calculus-1/","./courses/mathematics/calculus-1/index.html","./mathematics/calculus-1/"],
 ["calculus-ii","courses/calculus-ii/","./courses/calculus-ii/index.html","./calculus-ii/"],
 ["linear-algebra","courses/linear-algebra/","./courses/linear-algebra/index.html","./linear-algebra/"],
 ["differential-equations","courses/differential-equations/","./courses/differential-equations/index.html","./differential-equations/"],
 ["statistics","courses/statistics/","./courses/statistics/index.html","./statistics/"],
 ["discrete-mathematics","courses/discrete-mathematics/","./courses/discrete-mathematics/index.html","./discrete-mathematics/"],
 ["introduction-to-proofs","courses/introduction-to-proofs/","./courses/introduction-to-proofs/index.html","./introduction-to-proofs/"],
 ["real-complex-analysis","courses/real-complex-analysis/","./courses/real-complex-analysis/index.html","./real-complex-analysis/"],
 ["abstract-algebra","courses/abstract-algebra/","./courses/abstract-algebra/index.html","./abstract-algebra/"],
 ["topology-differential-geometry","courses/topology-differential-geometry/","./courses/topology-differential-geometry/index.html","./topology-differential-geometry/"],
 ["advanced-geometric-topology","courses/advanced-geometric-topology/","./courses/advanced-geometric-topology/index.html","./advanced-geometric-topology/"]
];
const campus=read("index-core.txt");
assert(campus.includes('id="campus-tour"'),"main Higher Learning page must expose stable campus-tour anchor");
const department=read("courses/index-core.txt");

for(const [id,base,campusUrl,deptUrl] of courses){
 assert(campus.includes('"'+id+'": {title:')||campus.includes('"'+id+'":{title:'),id+" missing from main Higher Learning course registry");
 assert(campus.includes('url:"'+campusUrl+'"'),id+" main Higher Learning registry must terminate at course landing");
 assert(department.includes('"'+id+'":"'+deptUrl+'"'),id+" Mathematics Department registry must terminate at course landing");
 const landing=read(base+"index.html");
 const links=[...landing.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)].map(m=>m[1]);
 assert.deepEqual(links,[
  "https://vervenveda.com/Khaemenes_Higher_Learning.github.io/#campus-tour",
  "https://vervenveda.com/Khaemenes_Academy.github.io/family/enroll/",
  "math-lesson.html"
 ],id+" landing navigation topology");
 assert(landing.includes("higher-math-class-entry-v1.js"),id+" landing must load class enrollment gate");
 assert(landing.includes("data-higher-math-enter-class"),id+" Enter Class must be account-gated");
 const lesson=read(base+"math-lesson.html");
 assert(lesson.includes("higher-math-class-entry-v1.js"),id+" lesson doorway must load class enrollment gate");
 assert(!/(?:href|url)=?["']?[^"'\s]*(?:course-console|assessments\/|diagnostic\/|records\/|labs\/)/i.test(landing),id+" public landing exposes internal route");
}
for(const forbidden of ["math-lesson.html","course-console.html","/assessments/","/diagnostic/"]){
 assert(!campus.includes('url:"'+forbidden), "main campus must not register direct internal course route "+forbidden);
}
const gate=read("courses/shared/higher-math-class-entry-v1.js");
assert(gate.includes("academy-family-registry"),"class gate identity authority");
assert(gate.includes("family/enroll/"),"class gate enrollment destination");
assert(gate.includes("failClosedWithoutLearner:true"),"class gate must fail closed without learner");
assert(gate.includes("getLearner"),"class gate must resolve a real Academy learner");
const engine=read("courses/shared/higher-math-lesson-engine-v1.js");
assert(engine.includes("KhaemenesHigherMathClassEntry?.requireAccess"),"lesson engine must verify enrollment before rendering");
console.log("PASS clean Higher Learning course topology: campus -> landing -> Tour/Enrollment/Class; Enter Class and direct lesson doorways fail closed to enrollment without an Academy learner account.");
