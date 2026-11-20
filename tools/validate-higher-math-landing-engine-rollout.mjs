import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
const root=path.resolve(process.cwd());
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));
const courses=[
 ["precalculus-trigonometry","courses/mathematics/precalculus-trigonometry",false],
 ["calculus-i","courses/mathematics/calculus-1",false],
 ["calculus-ii","courses/calculus-ii",false],
 ["differential-equations","courses/differential-equations",false],
 ["linear-algebra","courses/linear-algebra",false],
 ["statistics","courses/statistics",false],
 ["discrete-mathematics","courses/discrete-mathematics",false],
 ["introduction-to-proofs","courses/introduction-to-proofs",false],
 ["abstract-algebra","courses/abstract-algebra",false],
 ["real-complex-analysis","courses/real-complex-analysis",false],
 ["topology-differential-geometry","courses/topology-differential-geometry",false],
 ["advanced-geometric-topology","courses/advanced-geometric-topology",true]
];
const canonical=[
 "https://vervenveda.com/assets/vnv-333-ticker.js",
 "https://vervenveda.com/assets/vnv-ticker-autopopulate.js",
 "https://vervenveda.com/assets/vnv-header-autopopulate.js",
 "https://vervenveda.com/assets/vnv-ecosystem-menu.js",
 "https://vervenveda.com/Khaemenes_Linguistics.github.io/assets/khaemenes-translator-loader.js?v=1.1.1",
 "https://vervenveda.com/assets/vnv-language.js?v=20261108-cream-buttons",
 "https://vervenveda.com/assets/vnv-class-tools-toolbar.js?v=1.6.1",
 "https://vervenveda.com/assets/vnv-ecosystem-toolbar.js"
];
for(const [id,base,hybrid] of courses){
 for(const f of ["index.html","course-console.html","math-lesson.html"])assert(exists(base+"/"+f),id+" missing "+f);
 const landing=read(base+"/index.html"), lesson=read(base+"/math-lesson.html");
 for(const src of canonical){
  assert(landing.includes(src),id+" landing missing canonical "+src);
  assert(lesson.includes(src),id+" lesson missing canonical "+src);
 }
 assert(!landing.includes("high-school-global-chrome-v2.js"),id+" must not load global chrome bug");
 assert.equal((landing.match(/class="khm-academy"/g)||[]).length,1,id+" academy hero");
 assert.equal((landing.match(/class="khm-title"/g)||[]).length,1,id+" course title");
 assert.equal((landing.match(/class="khm-descriptor"/g)||[]).length,1,id+" descriptor");
 for(const label of ["Campus Tour","Enrollment","Enter Class","About ","Lessons","Assessments &amp; Mastery","Math Labs &amp; Tools","Course Records"])assert(landing.includes(label),id+" missing landing element "+label);
 assert.equal((landing.match(/class="khm-card"/g)||[]).length,4,id+" must have one 2x2 four-card feature grid");
 const landingLinks=[...landing.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)].map(m=>m[1]);
 assert.deepEqual(landingLinks,[
  "https://vervenveda.com/Khaemenes_Higher_Learning.github.io/#campus-tour",
  "https://vervenveda.com/Khaemenes_Academy.github.io/family/enroll/",
  "math-lesson.html"
 ],id+" landing must expose exactly Campus Tour, Enrollment, Enter Class");
 assert(lesson.includes('id="higherMathEngine"'),id+" lesson engine mount missing");
 assert(lesson.includes("higher-math-lesson-engine-v1.js"),id+" shared lesson engine missing");
 if(!hybrid){
  const map=JSON.parse(read(base+"/course-map.json"));
  const lessons=(map.units||[]).flatMap(u=>u.lessons||[]);
  assert.equal(lessons.length,92,id+" mapped lesson count");
  for(const l of lessons){
   const unit=String(l.unit).padStart(2,"0");
   assert(exists(base+"/units/unit-"+unit+"/lessons/"+l.id+".html"),id+" missing authoritative lesson source "+l.id);
  }
  assert(!/href="(?:assessments\/|course-console\.html|diagnostic\/|labs\/)/.test(landing),id+" landing must not bypass clean navigation");
 }else{
  assert(!/href="(?:assessments\/|course-console\.html|diagnostic\/|labs\/)/.test(landing),"advanced topology landing must not bypass clean navigation");
  assert(lesson.includes('data-hybrid="true"'),"advanced topology engine must declare hybrid");
  assert(exists(base+"/lesson.html"),"advanced topology protected hybrid runtime missing");
  const manifest=JSON.parse(read(base+"/hybrid-runtime-contract-v1.json"));
  assert.equal(manifest.release_boundary.current_v2_rich_session_count,1);
  assert.equal(manifest.release_boundary.current_legacy_fallback_session_count,179);
 }
}
const css=read("courses/shared/higher-math-minimal-v1.css");
assert(css.includes(".khm-academy{margin:0;font:400 33px"));
assert(css.includes(".khm-title{max-width:1100px;margin:11px auto 0;font:400 66px"));
assert(css.includes(".khm-descriptor{max-width:920px;margin:14px auto 0;font-size:24px"));
assert(css.includes("border-radius:7px"));
const shell=read("courses/shared/higher-math-shell-v1.js");
assert(shell.includes('id:"higher-learning-math-landing"'));
assert(shell.includes('action:"translate"'));
assert(shell.includes("[data-vct-translator-panel]"));
const engine=read("courses/shared/higher-math-lesson-engine-v1.js");
for(const step of ["01 · Orient","02 · Recall","03–08 · Learn · Worked · Guided · Independent · Error · Transfer","09 · Feedback","10 · Reflect"])assert(engine.includes(step),step+" missing from engine");
console.log("PASS Higher Learning mathematics landing + engine rollout: 12 minimal landings, 12 preserved consoles, 12 engine doorways, 11x92 mapped lesson sources, 1 protected hybrid course.");
