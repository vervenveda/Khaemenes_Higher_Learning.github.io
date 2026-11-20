#!/usr/bin/env node
import fs from "node:fs";
const bootstrap=fs.readFileSync("index.html","utf8");
const core=fs.readFileSync("index-core.txt","utf8");
const tools=fs.readFileSync("assets/higher-learning-landing-class-tools-v1.js","utf8");
const count=(s,re)=>(s.match(re)||[]).length;
const problems=[];
for(const [name,got,want] of [
 ["bootstrap universal component loaders",count(bootstrap,/vnv-(?:333-ticker|ticker-autopopulate|header-autopopulate|ecosystem-toolbar|class-tools-toolbar|language)\.js/g),0],
 ["333 ticker loader",count(core,/vnv-333-ticker\.js/g),1],
 ["auto ticker loader",count(core,/vnv-ticker-autopopulate\.js/g),1],
 ["auto ticker invocation",count(core,/VNV_TICKER(?:\?*\.)?autoPopulate\s*\(/g),1],
 ["official header loader",count(core,/vnv-header-autopopulate\.js/g),1],
 ["official header mount",count(core,/VNV_HEADER(?:\?*\.)?mount\s*\(/g),1],
 ["lower-left class tools",count(core,/vnv-class-tools-toolbar\.js/g),1],
 ["lower-right ecosystem toolbar",count(core,/vnv-ecosystem-toolbar\.js/g),1],
 ["canonical language engine",count(core,/vnv-language\.js/g),1],
 ["Linguistics translator loader",count(core,/khaemenes-translator-loader\.js/g),1],
 ["phrase bank",count(core,/khaemenes-campus-phrases\.js/g),1],
 ["interlingual core",count(core,/khaemenes-interlingual-core\.js/g),1],
 ["site footer",count(core,/<footer>/g),1],
 ["feature cards",count(core,/class="higher-feature-card"/g),4]
])if(got!==want)problems.push(name+": expected "+want+", found "+got);
if(!/"actions":\[\]/.test(core))problems.push("official header must be hamburger-only");
if(/higher-learning-global-standard-v1\.js/.test(core))problems.push("retired global-standard shim must not be loaded by authoritative core");
if(/khaemenes-landing-toolbar\.js|vnv-ecosystem-menu\.js/.test(core))problems.push("legacy landing toolbar/menu must not be loaded by authoritative core");
if(/MutationObserver/.test(core+tools))problems.push("landing shell must not use MutationObserver regulator behavior");
for(const label of ["Learner Profile","Parent Profile","Enrollment"])if(!core.includes(">"+label+"<"))problems.push("missing access button: "+label);
for(const token of [
 "font:400 33px/1.15 Cinzel",
 "font:400 66px/1.05 Cinzel",
 'font:400 24px/1.35 "Brandon Grotesque"',
 "grid-template-columns:repeat(2,minmax(0,1fr))",
 "border-radius:7px",
 "background:#243038!important"
])if(!core.includes(token))problems.push("landing geometry token missing: "+token);
if(!/label:"Translate"/.test(tools)||!tools.includes("vnv-language-switch"))problems.push("canonical translator must be exposed inside lower-left tools");
if(!core.includes('id="higher-learning-canonical-landing-contract"'))problems.push("canonical landing contract style missing");
if(problems.length){console.error(JSON.stringify({status:"FAIL",problems},null,2));process.exit(1)}
console.log(JSON.stringify({status:"PASS",scope:"Higher Learning authoritative landing",contract:"bootstrap owns no chrome; core owns one canonical component each; hamburger-only header; translator in lower-left tools; 33/66/24 charcoal hierarchy"},null,2));
