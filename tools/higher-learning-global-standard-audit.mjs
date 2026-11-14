#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const WRITE=process.argv.includes("--write");
const TAG='  <script src="/Khaemenes_Higher_Learning.github.io/assets/higher-learning-global-standard-v1.js" defer data-higher-global-standard="16-33-66-chrome"></script>\n';
const LOADER=/higher-learning-global-standard-v1\.js/i;

function walk(dir){
  const out=[];
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if([".git","node_modules"].includes(e.name))continue;
    const full=path.join(dir,e.name);
    if(e.isDirectory())out.push(...walk(full));
    else out.push(path.relative(ROOT,full).split(path.sep).join("/"));
  }
  return out;
}
function inject(source){
  if(LOADER.test(source))return source;
  if(/<\/head>/i.test(source))return source.replace(/<\/head>/i,TAG+"</head>");
  if(/<body\b/i.test(source))return source.replace(/<body\b/i,TAG+"<body");
  return TAG+source;
}

const all=walk(ROOT);
const html=all.filter(f=>/\.html?$/i.test(f)).sort();
const protectedCores=all.filter(f=>/(^|\/)index-core\.txt$/i.test(f)).sort();
const targets=[...html,...protectedCores];
let covered=0,changed=0;
for(const file of targets){
  const abs=path.join(ROOT,file);
  let s=fs.readFileSync(abs,"utf8");
  if(LOADER.test(s)){covered++;continue}
  if(WRITE){
    s=inject(s);fs.writeFileSync(abs,s);covered++;changed++;
  }
}
const guard=fs.readFileSync(path.join(ROOT,"assets/higher-learning-global-standard-v1.js"),"utf8");
const checks=[
 ["16px readable floor",/size<16[\s\S]{0,180}font-size","16px","important"/],
 ["33px heading rule",/font-size:33px!important/],
 ["66px primary-title rule",/font-size:66px!important/],
 ["333 ticker loader",/vnv-333-ticker\.js/],
 ["AutoPopulate ticker loader",/vnv-ticker-autopopulate\.js/],
 ["official header loader",/vnv-header-autopopulate\.js/],
 ["official header controller",/VNV_HEADER/],
 ["official lower-right toolbar loader",/vnv-ecosystem-toolbar\.js/],
 ["official toolbar dock",/vnvEcosystemUtilityDock/],
 ["typography marker",/khaemenesHigherTypography="16-33-66"/],
 ["chrome marker",/khaemenesHigherChrome="333-auto-header-menu-toolbar"/]
];
const failures=checks.filter(([,re])=>!re.test(guard)).map(([n])=>n);

console.log(JSON.stringify({
  mode:WRITE?"write":"check",
  htmlFiles:html.length,
  protectedIndexCores:protectedCores.length,
  totalTargets:targets.length,
  covered,
  changed,
  missing:targets.length-covered,
  assertionFailures:failures,
  typography:{minimumReadableTextPx:16,ordinaryTitlePx:33,primaryHeroTitlePx:66},
  chrome:[
    "333 ticker",
    "AutoPopulate ticker",
    "official VNV header",
    "hamburger/enriched ecosystem menu",
    "official 3x2 lower-right ecosystem toolbar"
  ]
},null,2));

if(targets.length!==covered||failures.length)process.exitCode=1;
