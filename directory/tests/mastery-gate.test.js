"use strict";
const assert=require("node:assert/strict");
const mastery=require("../collegiate-mastery-gate.js");
const p={courseId:"sample-collegiate-course",thresholdPercent:80,requirements:[
{id:"unit-01",type:"unit",required:true,reviewRequired:false},
{id:"midterm",type:"midterm",required:true,reviewRequired:true},
{id:"final",type:"final",required:true,reviewRequired:true}
]};
function run(attempts,plan=p){return mastery.evaluate(plan,{attempts})}
const passed=[
{gateId:"unit-01",scorePercent:85},
{gateId:"midterm",scorePercent:80,reviewed:true},
{gateId:"final",scorePercent:93,reviewed:true}
];
assert.equal(run(passed).complete,true,"80 percent threshold passes separately");
assert.equal(run([{...passed[0],scorePercent:79},...passed.slice(1)]).complete,false,"a failed required unit cannot be offset");
assert.equal(run([{...passed[0]}, {...passed[1],reviewed:false},passed[2]]).count.pending,1,"unreviewed high-stakes exam remains pending");
assert.equal(run([passed[0],passed[0]]).ok,false,"duplicate gate evidence fails closed");
assert.equal(run(passed.slice(0,2)).complete,false,"missing final cannot be bypassed");
assert.equal(run([{gateId:"unit-01",scorePercent:101}]).gates[0].state,"pending","invalid scores never satisfy a gate");
assert.equal(run([], {...p,thresholdPercent:70}).ok,false,"threshold cannot be lowered");
assert.equal(run(passed).credentialAwarded,false,"browser never awards a formal credential");
assert.equal(run([{...passed[0],safetyPassed:false},passed[1],passed[2]]).complete,false,"failed safety criteria cannot be compensated");
console.log("Khaemenes mastery-gate regression: 9/9 assertions passed");
