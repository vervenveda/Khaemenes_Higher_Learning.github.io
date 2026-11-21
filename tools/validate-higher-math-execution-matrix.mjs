import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
const root=path.resolve(process.cwd());
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));
const matrix=JSON.parse(read("courses/mathematics-execution-matrix-v1.json"));
assert.equal(matrix.policy.mastery_floor_percent,80);
assert.equal(matrix.courses.length,13);
const ids=new Set();
let full=0,hybrid=0;
for(const c of matrix.courses){
 assert(!ids.has(c.id),"duplicate course id "+c.id);ids.add(c.id);
 assert(exists(c.entry),c.id+" entry missing");
 assert(exists(c.source),c.id+" source missing");
 for(const key of ["diagnostic","weekly","midterm","final","persistence","completion"]){
  assert(c.authority?.[key]?.owner,c.id+" authority missing "+key);
 }
 if(c.architecture==="full-map"){
  full++;
  const map=JSON.parse(read(c.source));
  const lessons=(map.units||[]).reduce((n,u)=>n+(u.lessons?.length||0),0);
  assert.equal(map.course?.duration_weeks,36,c.id+" weeks");
  assert.equal(map.course?.sessions,180,c.id+" sessions");
  assert.equal(map.course?.lesson_count,92,c.id+" declared lessons");
  assert.equal(lessons,92,c.id+" actual lessons");
  assert.equal((map.units||[]).length,13,c.id+" units");
  assert.equal(map.course?.mastery_target,80,c.id+" mastery");
 }else if(c.architecture==="hybrid-legacy-v2"){
  hybrid++;
  assert.equal(c.id,"advanced-geometric-topology");
  const manifest=JSON.parse(read(c.source));
  assert.equal(manifest.architecture,"hybrid-legacy-v2");
  assert.equal(manifest.curriculum?.weeks,36);
  assert.equal(manifest.curriculum?.sessions,180);
  assert.deepEqual(manifest.curriculum?.migrated_rich_modules,["W01D1"]);
  assert.equal(manifest.release_boundary?.current_v2_rich_session_count,1);
  assert.equal(manifest.release_boundary?.current_legacy_fallback_session_count,179);
  assert.equal(manifest.release_boundary?.full_v2_migration,false);
  assert.match(manifest.curriculum?.retirement_rule||"",/course-data\.js/);
 }
}
assert.equal(full,12);
assert.equal(hybrid,1);
console.log("PASS Higher Learning math matrix: 13 courses, 12 full 36x180x92 maps, 1 explicit hybrid legacy/V2 course.");
