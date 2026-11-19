import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const pages=[
"courses/mathematics/precalculus-trigonometry/index.html",
"courses/mathematics/calculus-1/index.html",
"courses/calculus-ii/index.html",
"courses/linear-algebra/index.html",
"courses/differential-equations/index.html",
"courses/statistics/index.html",
"courses/discrete-mathematics/index.html",
"courses/introduction-to-proofs/index.html",
"courses/real-complex-analysis/index.html",
"courses/abstract-algebra/index.html",
"courses/topology-differential-geometry/index.html",
"courses/advanced-geometric-topology/index.html"
];
const fail=[];
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const ok=(v,m)=>{if(!v)fail.push(m)};

for(const rel of pages){
 const html=read(rel);
 const scripts=[...html.matchAll(/<script\b[^>]*src=["']([^"']+)["'][^>]*>/gi)].map(m=>m[1]);
 const count=re=>scripts.filter(s=>re.test(s)).length;
 ok((html.match(/<section\b/gi)||[]).length===3,`${rel}: expected exactly 3 content sections`);
 ok((html.match(/<footer\b/gi)||[]).length===1,`${rel}: expected exactly 1 footer`);
 ok((html.match(/<header\b/gi)||[]).length===0,`${rel}: local header markup forbidden`);
 ok((html.match(/<aside\b/gi)||[]).length===0,`${rel}: aside markup forbidden`);
 ok((html.match(/<dialog\b/gi)||[]).length===0,`${rel}: dialog markup forbidden`);
 ok((html.match(/<form\b/gi)||[]).length===0,`${rel}: form markup forbidden`);
 ok(count(/vnv-333-ticker\.js/ )===1,`${rel}: expected one 333 ticker`);
 ok(count(/vnv-ticker-autopopulate\.js/ )===1,`${rel}: expected one AutoPopulate ticker`);
 ok(count(/vnv-header-autopopulate\.js/ )===1,`${rel}: expected one official VNV header asset`);
 ok(count(/higher-math-minimal-header-mount-v1\.js/ )===1,`${rel}: expected one minimal header mount`);
 ok(count(/vnv-class-tools-toolbar\.js/ )===1,`${rel}: expected one lower-left class tools toolbar`);
 ok(count(/vnv-ecosystem-toolbar\.js/ )===1,`${rel}: expected one lower-right ecosystem toolbar`);
 ok(count(/vnv-language\.js/ )===1,`${rel}: expected one translator engine`);
 ok(count(/higher-learning-global-standard-v1\.js/ )===0,`${rel}: retired global standard forbidden on math landing pages`);
 ok(!/course-entry-contract|math-entry-gate|course-data\.js|question-bank|assets\/app\.js|service-worker|quick-nav|sidebar|dashboard/i.test(html),
    `${rel}: dashboard/course-engine dependency detected`);
 ok(/class=["']eyebrow["'][^>]*>Khaemenes Higher Learning</i.test(html),
    `${rel}: eyebrow must read Khaemenes Higher Learning`);
 ok(/class=["']descriptor["']/i.test(html),`${rel}: missing 24px descriptor surface`);
 ok((html.match(/class=["']math-feature["']/g)||[]).length===4,`${rel}: expected four course feature cards`);
 ok((html.match(/class=["']math-action-grid["']/g)||[]).length===1,`${rel}: expected one access-button grid`);
 for(const label of ["Learner Profile","Parent Profile","Enrollment"]){
   ok(html.includes(`>${label}</a>`),`${rel}: missing ${label} access button`);
 }
}

const css=read("assets/higher-math-minimal-landing-v1.css");
ok(/\.math-hero \.eyebrow\{[^}]*font:400 33px/i.test(css),"shared CSS must enforce 33px eyebrow");
ok(/\.math-hero h1\{[^}]*font:400 66px/i.test(css),"shared CSS must enforce 66px course title");
ok(/\.math-hero \.descriptor\{[^}]*font:400 24px/i.test(css),"shared CSS must enforce 24px descriptor");
ok(!/font(?:-size)?\s*:\s*(?:[0-9]|1[0-5])px/i.test(css),"shared CSS must not define learner-facing text below 16px");

const header=read("assets/higher-math-minimal-header-mount-v1.js");
ok(header.includes("actions:[]"),"minimal header mount must have no shortcut actions");
ok(!/MutationObserver|setInterval|setTimeout/.test(header),"minimal header mount must not install mutation/polling loops");

const retired=read("assets/higher-learning-global-standard-v1.js");
ok(retired.includes("RETIRED COMPATIBILITY STUB"),"retired global standard must remain an inert compatibility stub");
ok(!/MutationObserver|VNV_HEADER|VNV333Ticker|VNVEcosystemToolbar/.test(retired),"retired global standard must not inject chrome");

if(fail.length){
 console.error("\nHigher Learning mathematics landing validation failed:");
 fail.forEach(x=>console.error(" - "+x));
 process.exit(1);
}
console.log("HIGHER_MATH_MINIMAL_LANDINGS=PASS · 12 course homes are minimal gateways with canonical tickers/header, paired corner toolbars, 33/66/24 hero typography, and no dashboard/global-standard dependencies.");
