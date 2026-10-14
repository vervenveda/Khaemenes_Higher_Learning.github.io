import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import {fileURLToPath} from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
let failed=false;
const ok=(v,m)=>{if(v)console.log("OK "+m);else{failed=true;console.error("FAIL "+m)}};

const shared=read("assets/applied-mission-studio-v1.js");
const manifest=JSON.parse(read("APPLIED_MISSION_STUDIO_RELEASE.json"));
const blobSha=crypto.createHash("sha1").update("blob "+Buffer.byteLength(shared)+"\0").update(shared).digest("hex");
ok(manifest.version==="1.5.0","release manifest pins Applied Mission Studio v1.5.0");
const offlineRelease="ams-v1.5.0-recovery-r1-20261014";
ok(manifest.offline_release===offlineRelease,"release manifest pins the atomic Mission Studio offline release");
ok(blobSha===manifest.git_blob_sha,"shared Applied Mission Studio matches pinned Git blob");
ok(shared.includes('const V="1.5.0"'),"runtime reports v1.5.0");
ok(shared.includes("pageOwnerId")&&shared.includes("ownerOk"),"Mission Studio binds writes to the active Academy learner");
ok(shared.includes("Review & Replace Newer Version")&&shared.includes("competing-tab"),"Mission Studio protects competing tabs");
ok(shared.includes("importBytes:524288")&&shared.includes("verifiedWrite"),"Mission Studio bounds imports and verifies writes");
ok(shared.includes("khaemenes-evidence-integrity-v1")&&shared.includes("sealEnvelope")&&shared.includes("verifyEnvelope"),"runtime seals and verifies portable evidence with SHA-256");
ok(shared.includes("course_progression_authority:false"),"mission evidence remains outside mastery authority");
ok(shared.includes("RECOVERY_JOURNAL")&&shared.includes("Evidence Recovery"),"runtime exposes learner-scoped Evidence Recovery");
ok(shared.includes("Restore as New Revision")&&shared.includes("recovery-restore"),"recovery restores evidence as a new revision");
ok(shared.includes("khaemenes-math-applied-mission-recovery-export-v1"),"recovery exports are integrity-sealed first-party evidence packages");
ok(!shared.includes("limits.text+' data-as-field")&&!shared.includes("limits.evaluator+' value="),"Mission Studio bounded-field markup is well formed");

const coreMatch=shared.match(/\/\*__AMS_CORE_BEGIN__\*\/([\s\S]*?)\/\*__AMS_CORE_END__\*\//);
ok(!!coreMatch,"testable persistence core is embedded in the runtime");
let core=null;
if(coreMatch){
 const box={TextEncoder,Uint8Array,crypto:crypto.webcrypto};vm.createContext(box);vm.runInContext(coreMatch[1]+";globalThis.__AMSCore=AMSCore;",box);core=box.__AMSCore;
}
if(core){
 ok(core.scopeKey("mission","learner-a")!==core.scopeKey("mission","learner-b"),"learner storage keys are isolated");
 const dirty={mission_id:"m1",custom:"x".repeat(500),fields:{question:"q".repeat(core.limits.text+50),extra:"drop"},checks:{0:true,8:true},review:{scores:["4","8"],feedback:"f".repeat(core.limits.feedback+50),attempts:Array.from({length:40},(_,i)=>({score:i,target:80,evaluator:"Teacher"}))}};
 const clean=core.sanitizeRecord(dirty,{course:"calculus-1",unit:1,project:"Test",fieldKeys:["question"],legacyKeys:[],checkCount:1,rubricCount:2,recordId:"r1"});
 ok(clean.fields.question.length===core.limits.text&&!Object.hasOwn(clean.fields,"extra"),"sanitizer caps evidence and drops unknown fields");
 ok(clean.custom.length===core.limits.custom&&clean.review.feedback.length===core.limits.feedback,"sanitizer enforces text bounds");
 ok(clean.review.attempts.length===core.limits.attempts,"review history is bounded");
 class MemoryStorage{constructor(){this.m=new Map()}getItem(k){return this.m.has(k)?this.m.get(k):null}setItem(k,v){this.m.set(k,String(v))}removeItem(k){this.m.delete(k)}}
 const st=new MemoryStorage(),key="store:learner:a",unit="unit-01",base=core.sanitizeRecord({mission_id:"m1"},{course:"calculus-1",unit:1,project:"Test",fieldKeys:[],legacyKeys:[],checkCount:0,rubricCount:0,recordId:"r1"});
 const first=core.commitUnit(st,key,unit,base,0,"tab-a");
 const stale=core.commitUnit(st,key,unit,{...base,mission_id:"m2"},0,"tab-b");
 const forced=core.commitUnit(st,key,unit,{...base,mission_id:"m2"},first.revision,"tab-b",{force:true});
 ok(first.ok&&first.revision===1,"first verified mission commit creates revision 1");
 ok(stale.conflict===true,"stale competing-tab commit is refused");
 ok(forced.ok&&forced.revision===2,"explicit replacement advances revision after preserving recovery evidence");
 const recoveryKey="recovery:learner:a:unit-01";
 for(let i=1;i<=9;i++)core.appendRecovery(st,recoveryKey,{course:"calculus-1",unit:1,reason:"test-"+i,record:{...base,revision:i,record_id:"r1"}},7);
 const recovery=core.recoveryPoints(st,recoveryKey);
 ok(recovery.length===7&&recovery[0].revision===3&&recovery.at(-1).revision===9,"recovery journal retains the newest seven restore points");
 const deterministicA=core.canonicalize({b:2,a:{z:1,y:[3,2]}});
 const deterministicB=core.canonicalize({a:{y:[3,2],z:1},b:2});
 ok(deterministicA===deterministicB,"integrity canonicalization is deterministic across object key order");
 const sealedEvidence=await core.sealEnvelope({schema:"mission-test",course:"geometry",unit:1,record:{mission_id:"m1",fields:{question:"test"}}});
 ok(await core.verifyEnvelope(sealedEvidence),"SHA-256 evidence seal verifies unchanged payload");
 ok(!(await core.verifyEnvelope({...sealedEvidence,unit:2})),"SHA-256 evidence seal rejects changed payload");
}

for(const course of ["precalculus-trigonometry","calculus-1"]){
 const sw=read(course+"/service-worker.js"),lessonTools=read(course+"/assets/lesson-tools.js"),app=read(course+"/assets/app.js");
 ok(sw.includes('MISSION_OFFLINE_RELEASE="'+offlineRelease+'"'),course+" service worker pins the atomic offline release");
 ok(sw.includes("const MISSION_CRITICAL=")&&sw.includes("cache.addAll(MISSION_CRITICAL"),course+" mission-critical offline routes install atomically");
 ok(sw.includes("await caches.delete("),course+" failed mission-critical install removes its incomplete candidate cache");
 ok(sw.includes("startsWith(CACHE_PREFIX)")&&!sw.includes("keys.filter(k=>k!==CACHE)"),course+" retires only its own cache family");

 ok(sw.includes("../assets/applied-mission-studio-v1.js"),course+" caches shared Mission Studio");
 ok(lessonTools.includes(":learner:")&&lessonTools.includes("ownerOk()")&&lessonTools.includes("verification-failed"),course+" lesson records are learner-scoped and verified");
 ok(lessonTools.includes("active Academy learner changed")||lessonTools.includes("active Academy learner changed".replace("active","The active")),course+" lesson saving pauses when learner ownership changes");
 ok(app.includes("applied-mission-portfolio-v1"),course+" portfolio surfaces Applied Mission evidence");
 for(let u=1;u<=13;u++){
  const n=String(u).padStart(2,"0"),route=`./units/unit-${n}/projects/${n}-project.html`,project=`${course}/units/unit-${n}/projects/${n}-project.html`;
  ok(sw.includes(route),course+" first-use offline cache includes "+route);
  ok(fs.existsSync(path.join(ROOT,project)),course+" canonical project exists: "+project);
  ok(read(project).includes("../../../../assets/applied-mission-studio-v1.js"),project+" loads the shared Mission Studio");
 }
 let lessons=0;
 for(let u=1;u<=13;u++){
  const n=String(u).padStart(2,"0"),dir=path.join(ROOT,course,"units","unit-"+n,"lessons");
  if(!fs.existsSync(dir))continue;
  for(const name of fs.readdirSync(dir).filter(x=>x.endsWith(".html"))){
   const html=fs.readFileSync(path.join(dir,name),"utf8");lessons++;
   ok(html.includes("assets/lesson-tools.js"),course+" "+n+"/"+name+" loads learner-safe lesson tools");
  }
 }
 ok(lessons>0,course+" lesson inventory is present");
}
if(failed)process.exit(1);
console.log("\nPASS Higher Learning mathematics Applied Mission Studio hardened contract.");
