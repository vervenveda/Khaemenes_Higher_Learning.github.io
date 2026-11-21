import fs from "node:fs";
import assert from "node:assert/strict";
const read=p=>fs.readFileSync(p,"utf8");
const catalog=JSON.parse(read("associate-certificate/catalog-v1.json"));
assert.equal(catalog.credential.total_learning_units,60);
assert.equal(catalog.credential.type,"free non-accredited educational certificate");
assert.match(catalog.credential.transfer_statement,/not an accredited degree/i);
assert.match(catalog.credential.learning_unit_definition,/not institutional college credits/i);
assert.equal(catalog.structure.shared_collegiate_core,24);
assert.equal(catalog.structure.concentration_study,30);
assert.equal(catalog.structure.integrative_capstone,6);
assert.equal(catalog.structure.shared_collegiate_core+catalog.structure.concentration_study+catalog.structure.integrative_capstone,60);
assert.equal(catalog.shared_core.length,8);
assert.equal(catalog.shared_core.reduce((n,c)=>n+c.units,0),24);
const names=["arts","sciences","civics","health","business"];
assert.deepEqual(Object.keys(catalog.concentrations).sort(),names.sort());
for(const [id,t] of Object.entries(catalog.concentrations)){
 assert.equal(t.concentration_units,30,id+" concentration units");
 assert.equal(t.capstone_units,6,id+" capstone units");
 assert.equal(t.courses.reduce((n,c)=>n+c.units,0),30,id+" course-unit total");
 assert.equal(t.capstone.units,6,id+" capstone");
 assert.equal(24+30+6,60);
 assert(t.certificate_title.includes("Associate-Level Certificate"),id+" title boundary");
 for(const c of t.courses){
   assert(c.code&&c.title&&c.status,id+" malformed course");
   assert(Array.isArray(c.sources)&&c.sources.length,id+" "+c.code+" missing sources");
 }
}
assert.match(catalog.concentrations.health.capstone.safety,/does not qualify.*diagnose.*treat.*prescribe/i);
const html=read("associate-certificate/index.html");
for(const phrase of ["not accredited","60 Khaemenes learning units","Arts, Sciences, Civics, Health, and Business"])assert(html.toLowerCase().includes(phrase.toLowerCase()),"landing missing "+phrase);
console.log("PASS Associate-Level Certificate catalog: 60 units = 24 core + 30 concentration + 6 capstone across Arts, Sciences, Civics, Health and Business; non-accredited/credit-transfer boundaries preserved.");
