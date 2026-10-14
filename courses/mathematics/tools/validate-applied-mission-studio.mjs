import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
let failed=false;const ok=(v,m)=>{if(v)console.log("OK "+m);else{failed=true;console.error("FAIL "+m)}};
const shared=read("assets/applied-mission-studio-v1.js");
for(const t of ["khaemenes-math-applied-mission-studio-v1","precalculus-trigonometry","calculus-1","course_progression_authority:false","Applied Mission Studio"])ok(shared.includes(t),"shared studio contains "+t);
for(const course of ["precalculus-trigonometry","calculus-1"]){
 for(let u=1;u<=13;u++){
  const n=String(u).padStart(2,"0"),p=`${course}/units/unit-${n}/projects/${n}-project.html`;
  ok(read(p).includes("../../../../assets/applied-mission-studio-v1.js"),p+" loads shared studio");
 }
 let lessonCount=0;
 for(let u=1;u<=13;u++){
  const n=String(u).padStart(2,"0"),dir=path.join(ROOT,course,"units","unit-"+n,"lessons");
  if(!fs.existsSync(dir))continue;
  for(const name of fs.readdirSync(dir).filter(x=>x.endsWith(".html"))){
   const html=fs.readFileSync(path.join(dir,name),"utf8");lessonCount++;
   ok(html.includes("assets/lesson-tools.js"),course+" "+n+"/"+name+" loads the lesson tool bridge");
  }
 }
 ok(lessonCount>0,course+" has lesson pages under the Applied Connection contract");
 const lesson=read(course+"/assets/lesson-tools.js");
 ok(lesson.includes("data-khae-applied-mission-studio"),course+" lesson tools load Applied Connection");
 const sw=read(course+"/service-worker.js");
 ok(sw.includes("../assets/applied-mission-studio-v1.js"),course+" offline release caches shared studio");
 const app=read(course+"/assets/app.js");
 ok(app.includes("applied-mission-portfolio-v1"),course+" portfolio surfaces mission evidence");
}
if(failed)process.exit(1);
console.log("\nPASS Higher Learning mathematics Applied Mission Studio contract across Precalculus & Trigonometry and Calculus I.");
