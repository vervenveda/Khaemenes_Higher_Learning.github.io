#!/usr/bin/env node
"use strict";
import fs from "node:fs";
import path from "node:path";
const ROOT=process.cwd(),errors=[],warnings=[],passes=[];
const exists=p=>fs.existsSync(path.join(ROOT,p));
const text=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
const pass=m=>passes.push(m),fail=m=>errors.push(m),warn=m=>warnings.push(m);
const check=(condition,message)=>condition?pass(message):fail(message);
const PIN_KEY="khaemenes-higher-learning-pinned-courses-v1";
const MATH=[
"courses/mathematics/precalculus-trigonometry","courses/mathematics/calculus-1","courses/calculus-ii","courses/linear-algebra","courses/differential-equations","courses/statistics","courses/discrete-mathematics","courses/introduction-to-proofs","courses/real-complex-analysis","courses/abstract-algebra","courses/topology-differential-geometry","courses/advanced-geometric-topology"];
const DEPARTMENTS=[
["active","courses/index.html"],["active","Science/index.html"],["developing","Technology/coding/coding-101/index.html"],["developing","courses/academic-language-and-lexicology/index.html"],["active","courses/constitutional-studies/index.html"],["active","Career/index.html"],["active","GED/index.html"],["developing","life-skills/index.html"]];

function walk(dir=""){
 const abs=path.join(ROOT,dir),out=[];
 for(const entry of fs.readdirSync(abs,{withFileTypes:true})){
  if(entry.name===".git"||entry.name==="node_modules")continue;
  const rel=path.join(dir,entry.name).replace(/\\/g,"/");
  if(entry.isDirectory())out.push(...walk(rel));else out.push(rel);
 }
 return out;
}
const all=walk();
for(const file of all.filter(p=>/index\.html$/i.test(p))){
 const html=text(file);if(!html.includes("khaemenes-core-page-loader.js"))continue;
 const m=html.match(/data-core=["']([^"']+)["']/i);
 check(Boolean(m),file+" declares loader core");
 if(m){const target=path.normalize(path.join(path.dirname(file),m[1])).replace(/\\/g,"/");check(exists(target),file+" loader core exists: "+target)}
}
for(const pair of [["index.html","index-core.txt","manifest.webmanifest","service-worker.js"],["courses/index.html","courses/index-core.txt","courses/manifest.webmanifest","courses/service-worker.js"]]){
 for(const p of pair)check(exists(p),"campus shell contract file exists: "+p);
 if(exists(pair[0])){const shell=text(pair[0]);check(shell.includes('rel="manifest"'),pair[0]+" declares manifest");check(shell.includes("data-sw="),pair[0]+" registers offline worker through loader");check(shell.includes("data-registry-fallback="),pair[0]+" declares Family Registry offline fallback")}
}
check(exists("assets/khaemenes-family-registry-fallback.js"),"offline Family Registry mirror exists");
check(text("assets/khaemenes-core-page-loader.js").includes("caches.match"),"core loader can recover cached protected core");
for(const [state,route] of DEPARTMENTS)check(exists(route),state+" department route exists: "+route);
for(const base of MATH){
 const idx=base+"/index.html";check(exists(idx),"mathematics entrance exists: "+idx);
 if(exists(idx)){const html=text(idx);check(/Mathematics Department|Khaemenes_Higher_Learning\.github\.io\/courses\//i.test(html),"mathematics return navigation present: "+idx)}
 check(exists(base+"/manifest.webmanifest"),"mathematics manifest present: "+base);
 check(exists(base+"/service-worker.js"),"mathematics service worker present: "+base);
}
for(const p of ["assets/khaemenes-higher-learning-profile-adapter.js","assets/khaemenes-course-identity-adapter.js","courses/advanced-geometric-topology/assets/department-integration.js"]){
 check(exists(p),"identity integration file exists: "+p);
 if(exists(p))check(text(p).includes(PIN_KEY),"common Higher Learning pin key is honored by "+p);
}
if(exists("assets/khaemenes-higher-learning-profile-adapter.js"))check(text("assets/khaemenes-higher-learning-profile-adapter.js").includes('identityAuthority:"academy-family-registry"'),"campus profile authority is Academy Family Registry");
if(exists("assets/khaemenes-course-identity-adapter.js"))check(text("assets/khaemenes-course-identity-adapter.js").includes('identityAuthority:"academy-family-registry"'),"course identity authority is Academy Family Registry");
const vaultPath="courses/mathematics/evidence-vault/index.html";
check(exists(vaultPath),"Mathematics Evidence Vault exists");
if(exists(vaultPath)){const vault=text(vaultPath);for(const id of ["calculus-ii","linear-algebra","differential-equations","statistics","discrete-mathematics","introduction-to-proofs","real-complex-analysis","abstract-algebra","topology-differential-geometry","advanced-geometric-topology"])check(vault.includes(id),"Evidence Vault covers "+id)}
const mathCore=text("courses/index-core.txt");
for(const base of MATH){const id=base.split("/").pop();check(mathCore.includes(id),"Mathematics directory registers "+id)}
const catalog=JSON.parse(text("directory/catalog.json"));
const catalogPaths=new Set((catalog.entries||[]).map(e=>e.sourcePath).filter(Boolean));
const required=[...MATH.map(base=>base+"/index.html"),"courses/constitutional-studies/index.html","courses/academic-language-and-lexicology/index.html"];
for(const p of required)check(catalogPaths.has(p),"federated catalog registers "+p);
const age=(Date.now()-Date.parse(catalog.inventoryDate+"T00:00:00Z"))/86400000;
if(Number.isFinite(age)&&age>45)fail("federated catalog inventoryDate is stale ("+catalog.inventoryDate+")");else pass("federated catalog date within drift window: "+catalog.inventoryDate);

function resolveRef(from,ref){
 if(!ref||ref.startsWith("#")||ref.includes("${")||/^(?:https?:|mailto:|tel:|data:|javascript:|blob:|about:)/i.test(ref))return null;
 const clean=ref.split("#")[0].split("?")[0];if(!clean)return null;
 if(clean.startsWith("/"))return decodeURIComponent(clean.slice(1));
 return path.normalize(path.join(path.dirname(from),decodeURIComponent(clean))).replace(/\\/g,"/");
}
const scan=["index-core.txt","courses/index-core.txt",...DEPARTMENTS.map(x=>x[1]),...MATH.map(x=>x+"/index.html")];
for(const file of [...new Set(scan)].filter(exists)){
 const src=text(file),re=/(?:href|src)=["']([^"']+)["']/gi;let m;
 while((m=re.exec(src))){const target=resolveRef(file,m[1]);if(target&&!exists(target)&&!exists(target+"/index.html"))fail("dead local reference: "+file+" -> "+m[1])}
}
console.log("Campus contract audit: "+passes.length+" PASS · "+warnings.length+" WARN · "+errors.length+" FAIL");
for(const m of warnings)console.warn("WARN:",m);
for(const m of errors)console.error("FAIL:",m);
if(errors.length)process.exit(1);
