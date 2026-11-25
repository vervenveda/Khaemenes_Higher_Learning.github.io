#!/usr/bin/env node
import {createServer} from "node:http";
import {readFile,stat} from "node:fs/promises";
import {extname,join,normalize} from "node:path";
import {chromium} from "playwright";

const root=process.cwd();
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg"};
const server=createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,"http://127.0.0.1");
    let rel=decodeURIComponent(url.pathname).replace(/^\/+/, "");
    if(!rel)rel="index.html";
    let file=normalize(join(root,rel));
    if(!file.startsWith(root)){res.writeHead(403);return res.end("forbidden");}
    try{if((await stat(file)).isDirectory())file=join(file,"index.html");}catch{}
    const body=await readFile(file);
    res.writeHead(200,{"content-type":mime[extname(file).toLowerCase()]||"application/octet-stream","cache-control":"no-store"});
    res.end(body);
  }catch{res.writeHead(404);res.end("not found");}
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const {port}=server.address();
const origin=`http://127.0.0.1:${port}`;

const courses=[
  {id:"precalculus-trigonometry",routes:[
    "courses/mathematics/precalculus-trigonometry/index.html",
    "courses/mathematics/precalculus-trigonometry/math-lesson.html",
    "courses/mathematics/precalculus-trigonometry/assessments/index.html",
    "courses/mathematics/precalculus-trigonometry/records/course-completion-certificate.html"
  ]},
  {id:"calculus-1",routes:[
    "courses/mathematics/calculus-1/index.html",
    "courses/mathematics/calculus-1/math-lesson.html",
    "courses/mathematics/calculus-1/assessments/index.html",
    "courses/mathematics/calculus-1/records/course-completion-certificate.html"
  ]},
  {id:"linear-algebra",routes:[
    "courses/linear-algebra/index.html",
    "courses/linear-algebra/math-lesson.html",
    "courses/linear-algebra/assessments/index.html",
    "courses/linear-algebra/records/course-completion-certificate.html"
  ]},
  {id:"differential-equations",routes:[
    "courses/differential-equations/index.html",
    "courses/differential-equations/math-lesson.html",
    "courses/differential-equations/assessments/index.html",
    "courses/differential-equations/records/course-completion-certificate.html"
  ]},
  {id:"advanced-geometric-topology",routes:[
    "courses/advanced-geometric-topology/index.html",
    "courses/advanced-geometric-topology/lesson.html",
    "courses/advanced-geometric-topology/assessments/index.html"
  ]}
];

const browser=await chromium.launch({headless:true});
const context=await browser.newContext();
const failures=[];
for(const course of courses){
  const page=await context.newPage();
  for(const route of course.routes){
    const response=await page.goto(`${origin}/${route}`,{waitUntil:"domcontentloaded",timeout:30000});
    if(!response||response.status()!==200)failures.push(`${course.id}: HTTP failure ${route}`);
    const text=(await page.locator("body").innerText()).trim();
    if(text.length<100)failures.push(`${course.id}: blank/shallow render ${route}`);
  }
  await page.close();
}
await context.close();await browser.close();await new Promise(resolve=>server.close(resolve));
if(failures.length){console.error(failures.map(x=>"FAIL: "+x).join("\n"));process.exit(1);}
console.log("PASS: Higher Learning Mathematics continuum renders Precalculus through Advanced Geometric Topology in Chromium.");
