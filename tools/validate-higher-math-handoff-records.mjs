import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
const root=path.resolve(process.cwd());
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const pct=JSON.parse(read("courses/mathematics/precalculus-trigonometry/course-map.json")).course;
const calc=JSON.parse(read("courses/mathematics/calculus-1/course-map.json")).course;
assert.equal(pct.profile_course_id,"precalculus-trigonometry");
assert.equal(pct.assessment_key,"khaemenes-precalculus-trigonometry-assessment-records-v2");
assert.equal(pct.legacy_assessment_key,"khaemenes-precalculus-trigonometry-assessment-records-v1");
assert.equal(pct.assessment_scope,"local-course-learner");
assert.equal(calc.profile_course_id,"calculus-i");
assert.deepEqual(calc.profile_course_aliases,["calculus-1"]);
assert.equal(calc.assessment_key,"khaemenes-calculus1-assessment-records-v2");
assert.equal(calc.assessment_scope,"local-course-learner");
const receipt=read("courses/shared/higher-math-evidence-receipt-v1.js");
assert(receipt.includes('courseId:"precalculus-trigonometry"'));
assert(receipt.includes('courseId:"calculus-i"'));
assert(receipt.includes('aliases:["calculus-1"]'));
assert(receipt.includes("bindingStatus:binding"));
assert(receipt.includes("includesAssessmentAnswers:false"));
assert(receipt.includes("highSchoolImportCertified:false"));
assert(!receipt.includes("localStorage.setItem("),"receipt exporter must remain read-only");
for(const p of [
 "courses/mathematics/precalculus-trigonometry/course-console.html",
 "courses/mathematics/calculus-1/course-console.html"
]){
 const html=read(p);assert(html.includes("higher-math-evidence-receipt-v1.js"),p+" missing receipt exporter");
}
for(const p of [
 "courses/mathematics/precalculus-trigonometry/assets/app.js",
 "courses/mathematics/calculus-1/assets/app.js"
]){
 assert(read(p).includes("data-higher-math-evidence-receipt"),p+" missing evidence receipt button");
}
const pctEngine=read("courses/mathematics/precalculus-trigonometry/assets/assessment-engine.js");
const calcEngine=read("courses/mathematics/calculus-1/assets/assessment-engine.js");
assert(pctEngine.includes("HISTORY_PREFIX=\"khaemenes-precalculus-trigonometry-assessment-records-v2\""));
assert(pctEngine.includes("publishReadinessCompatibility"));
assert(calcEngine.includes("HISTORY_PREFIX=\"khaemenes-calculus1-assessment-records-v2\""));
assert(calcEngine.includes("publishReadinessCompatibility"));
assert(pctEngine.includes('source:"readiness-compatibility-summary-v1"'));
assert(calcEngine.includes('source:"readiness-compatibility-summary-v1"'));
console.log("PASS Precalculus/Calculus I identity, assessment scope, readiness compatibility, and read-only return receipt contracts.");
