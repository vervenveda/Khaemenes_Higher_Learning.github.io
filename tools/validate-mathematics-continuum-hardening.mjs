import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
const root=path.resolve(process.cwd());
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));

const graph=JSON.parse(read("courses/mathematics-progression-graph-v1.json"));
assert.equal(graph.policy.mastery_floor_percent,80);
assert.equal(graph.policy.architecture,"foundation-trunk-then-branch");
const calc3=graph.branch_nodes.find(x=>x.id==="calculus-iii-multivariable");
assert(calc3,"Calculus III node missing");
assert.equal(calc3.status,"active");
assert(calc3.supports.includes("topology-differential-geometry"));

assert(exists("courses/calculus-iii-multivariable/CURRICULUM_BLUEPRINT.json"));
const blueprint=JSON.parse(read("courses/calculus-iii-multivariable/CURRICULUM_BLUEPRINT.json"));
assert.equal(blueprint.status,"released");
assert.equal(blueprint.course.target_units,13);
assert.equal(blueprint.course.duration_weeks,36);
assert.equal(blueprint.course.sessions,180);
assert.equal(blueprint.course.target_lesson_count,92);
assert.equal((blueprint.units||[]).length,13);
assert.equal((blueprint.units||[]).reduce((n,u)=>n+(u.target_lessons||0),0),92);

const matrix=JSON.parse(read("courses/mathematics-execution-matrix-v1.json"));
const topo=matrix.courses.find(x=>x.id==="topology-differential-geometry");
assert(topo,"Topology matrix entry missing");
assert(topo.progression.prerequisite_courses.includes("calculus-iii-multivariable"),"Topology must declare Calculus III prerequisite");
assert.equal(topo.progression.planned_gap_courses,undefined);

const de=matrix.courses.find(x=>x.id==="differential-equations");
assert.deepEqual(de.progression.preferred_route,["calculus-ii","linear-algebra","differential-equations"]);
const proofs=matrix.courses.find(x=>x.id==="introduction-to-proofs");
assert(proofs.progression.earliest_recommended_entry.includes("algebra-2"));
assert(proofs.progression.earliest_recommended_entry.includes("geometry"));

const engine=read("courses/shared/higher-math-lesson-engine-v1.js");
assert(engine.includes("Preview Next →"),"shared engine must distinguish preview navigation");
assert(engine.includes("Official Continue →"),"shared engine must expose separate verified progression action");
assert(engine.includes("Official progression is not yet backed by a reviewed lesson-level mastery adapter"),"shared engine must fail closed for official progression when no authority exists");
assert(engine.includes("KhaemenesHigherMathProgression?.canOpenLesson"),"shared engine progression authority hook missing");

console.log("PASS mathematics continuum hardening: branching graph, active Calculus III bridge, Topology prerequisite alignment, preferred Linear Algebra→Differential Equations route, earlier proof entry, and preview-vs-official progression separation.");
