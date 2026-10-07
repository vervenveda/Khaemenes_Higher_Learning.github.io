import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const COURSES=[
  "courses/mathematics/precalculus-trigonometry",
  "courses/mathematics/calculus-1"
];
const REQUIRED=[
  "index.html",
  "course-data.js",
  "course-map.json",
  "diagnostic/index.html",
  "assessments/index.html",
  "manifest.webmanifest",
  "service-worker.js",
  "records/README.md",
  "teacher-keys/index.html"
];

function walk(dir,relative=""){
  const output=[];
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(entry.name===".git"||entry.name==="node_modules")continue;
    const rel=relative?path.posix.join(relative,entry.name):entry.name;
    const absolute=path.join(dir,entry.name);
    if(entry.isDirectory())output.push(...walk(absolute,rel));
    else output.push(rel);
  }
  return output;
}
const files=new Set(walk(ROOT));
const failures=[];
function exists(rel){return files.has(rel)}
function isExternal(raw){return !raw||raw.startsWith("#")||raw.startsWith("//")||raw.includes("$"+"{")||/^(?:[a-z][a-z0-9+.-]*:)/i.test(raw)}
function resolve(source,raw){
  const stripped=raw.split("#",1)[0].split("?",1)[0];
  if(!stripped)return null;
  const decoded=decodeURIComponent(stripped);
  const base=decoded.startsWith("/")?"":path.posix.dirname(source);
  return path.posix.normalize(path.posix.join(base,decoded.replace(/^\/+/,"")));
}
function targetExists(target){return exists(target)||exists(path.posix.join(target,"index.html"))||(!path.posix.extname(target)&&exists(target+".html"))}
for(const root of COURSES){
  const members=[...files].filter(p=>p.startsWith(root+"/"));
  if(!members.length){failures.push(root+": directory missing");continue}
  if(members.length!==384)failures.push(root+": expected 384 files, found "+members.length);
  for(const required of REQUIRED)if(!exists(root+"/"+required))failures.push(root+"/"+required+": required file missing");
  for(const member of members){
    const text=fs.readFileSync(path.join(ROOT,member),"utf8");
    if(text.includes("../tools/calculator"))failures.push(member+": stale relative calculator link remains");
    if(text.includes("https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/calculus-1/"))failures.push(member+": stale High Calculus I URL remains");
  }
  const entry=root+"/index.html";
  const html=fs.readFileSync(path.join(ROOT,entry),"utf8");
  if(!html.includes("https://vervenveda.com/Khaemenes_Higher_Learning.github.io/"))failures.push(entry+": Higher Learning canonical host missing");
  if(html.includes("https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/"+path.posix.basename(root)+"/"))failures.push(entry+": stale High course URL remains");
  for(const match of html.matchAll(/\b(?:href|src|data-launch-url)\s*=\s*(["'])(.*?)\1/gi)){
    const raw=match[2].trim();
    if(isExternal(raw))continue;
    const target=resolve(entry,raw);
    if(target&&!targetExists(target))failures.push(entry+": "+raw+" -> "+target);
  }
}
for(const required of ["courses/mathematics/index.html","courses/shared/course-entry-contract.js","courses/shared/math-entry-gate.js"]){
  if(!exists(required))failures.push(required+": shared migration dependency missing");
}
if(failures.length){
  console.error("Higher Learning advanced-math migration validation FAILED ("+failures.length+" issue"+(failures.length===1?"":"s")+"):");
  failures.forEach(x=>console.error("- "+x));
  process.exit(1);
}
console.log("Higher Learning advanced-math migration validation: PASS (Calculus I + Precalculus/Trigonometry, full trees, required routes, and local entry references).");
