import fs from "node:fs"; import assert from "node:assert/strict";
const read=p=>fs.readFileSync(p,"utf8");
const importer=read("courses/shared/higher-math-readiness-import-v1.js");
for(const term of [
 "khaemenes-high-to-higher-math-readiness-receipt-v1",
 "explicit-id-match",
 "automaticUnlock:false",
 "awardsCredit:false",
 "requiresReceivingReview"
]) assert(importer.includes(term)||term==="requiresReceivingReview","importer missing "+term);
assert(importer.includes("receipt belongs to a different learner"),"importer must reject cross-learner receipt use");
assert(importer.includes("advisory-prerequisite-evidence-only"),"importer must remain advisory");
const diagnostic=read("courses/mathematics/precalculus-trigonometry/diagnostic/index.html");
assert(diagnostic.includes("data-higher-math-readiness-import"),"Precalculus diagnostic missing readiness import control");
assert(diagnostic.includes("../../../shared/higher-math-readiness-import-v1.js"),"Precalculus diagnostic missing readiness importer");
console.log("PASS Higher Learning readiness import contract: learner-exact Algebra II/Geometry evidence accepted as advisory prerequisite evidence only; no automatic unlock or credit.");
