/* Higher Learning opt-in forensic toolbar lifecycle diagnostics v1.0.0.
   Enabled only with ?chrome_audit=1. No learner data, storage, cookies or reporting.
   Observes DOM mutations, geometry and computed styles. Never modifies the toolbar.
*/
(()=>{"use strict";
if(new URLSearchParams(location.search).get("chrome_audit")!=="1"||window.KhaemenesHigherToolbarAudit)return;
const ID="vnvEcosystemUtilityDock",STYLE="vnvEcosystemUtilityStyles";
const events=[],samples=[];let panel=null,pre=null,closed=false,last="",timer=null;
const now=()=>Math.round(performance.now())+"ms";
const push=x=>{events.push(now()+" "+x);if(events.length>100)events.shift();draw()};
const qs=sel=>document.querySelectorAll(sel);
const rect=el=>{const r=el.getBoundingClientRect();return [r.x,r.y,r.width,r.height].map(Math.round).join(",")};
function state(){
 const root=document.getElementById(ID),styles=qs("#"+STYLE),roots=qs('[id="'+ID+'"]');
 if(!root)return "MISSING · canonical roots=0 · toolbar style blocks="+styles.length;
 const s=getComputedStyle(root),r=root.getBoundingClientRect();
 const parents=[];for(let e=root,p=0;e&&p<6;e=e.parentElement,p++){let c=getComputedStyle(e);parents.push((e.id?"#"+e.id:e.tagName.toLowerCase())+"("+c.display+","+c.visibility+","+c.opacity+")")}
 const centerX=Math.max(0,Math.min(innerWidth-1,r.left+r.width/2));
 const centerY=Math.max(0,Math.min(innerHeight-1,r.top+r.height/2));
 const hit=document.elementFromPoint(centerX,centerY);
 const inside=Boolean(hit&&(root===hit||root.contains(hit)));
 return "count="+roots.length+" · isConnected="+root.isConnected+" · children="+root.children.length+
 " · display="+s.display+" · visibility="+s.visibility+" · opacity="+s.opacity+
 " · position="+s.position+" · z="+s.zIndex+" · pointer-events="+s.pointerEvents+
 " · rect(x,y,w,h)="+rect(root)+" · hit-test="+(hit?.id||hit?.tagName?.toLowerCase()||"none")+" inside="+inside+
 " · styles="+styles.length+" · ancestors="+parents.join(" > ");
}
function report(){
 const root=document.getElementById(ID),s=root?getComputedStyle(root):null;
 const legacy=["#khaeLandingUtilityDock","#khaemenesHomeUtilityDock","#khaemenesLearnerUtilityToolbar"];
 const result=[
 "HIGHER LEARNING / TOOLBAR FORENSIC REPORT v1.0.0",
 "Opt-in observation only; no learner data, storage or external reporting.",
 "",
 "[PAGE]", "URL path="+location.pathname+" · viewport="+innerWidth+"x"+innerHeight+
 " · scrollY="+Math.round(scrollY)+" · readyState="+document.readyState,
 "body children="+(document.body?.children.length??0)+" · root style count="+qs("#"+STYLE).length,
 "",
 "[CANONICAL TOOLBAR]",state(),
 "controller="+(typeof window.VNVEcosystemToolbar?.mount==="function"?"AVAILABLE":"MISSING")+
 " · version="+(window.VNVEcosystemToolbar?.version||"unknown"),
 "expected six controls="+(root?qs("#"+ID+">a,#"+ID+">button").length:0),
 "dock CSS background="+(s?.backgroundColor||"n/a")+" · cssText="+(root?.getAttribute("style")||"none").slice(0,160),
 "",
 "[LEGACY UTILITY COMPONENTS]",...legacy.map(sel=>{let e=document.querySelector(sel);return sel+": "+(e?("present · "+getComputedStyle(e).display+" · "+rect(e)):"absent")}),
 "",
 "[CHROME SCRIPT INVENTORY]",
 ...[...document.scripts].filter(s=>/vnv-ecosystem-toolbar|khaemenes-landing-toolbar|vnv-header|vnv-333|vnv-ticker|core-page-loader/i.test(s.src||"")).map(s=>(s.src||"").split("/").pop().split("?")[0]+" · "+(s.async?"async ":"")+(s.defer?"defer":"sync")),
 "",
 "[EVENTS / LAST 45]",...events.slice(-45),
 "",
 "[SAMPLED STATES / LAST 20]",...samples.slice(-20)
 ];
 return result.join("\n");
}
function draw(){if(pre&&!closed){last=report();pre.textContent=last}}
function initPanel(){
 if(closed||panel||!document.body)return;
 panel=document.createElement("aside");panel.id="higherToolbarForensicPanel";panel.setAttribute("aria-label","Higher Learning opt-in toolbar forensic diagnostic");
 panel.style.cssText="position:fixed!important;z-index:2147483647!important;left:8px;bottom:8px;width:min(760px,calc(100vw - 16px));max-height:60vh;overflow:auto;padding:14px;border:2px solid #b48b45;border-radius:7px;background:#243038!important;color:#fff8e9!important;font:400 13px/1.45 ui-monospace,monospace!important;box-shadow:0 12px 40px #0009";
 const title=document.createElement("strong");title.textContent="Higher Learning · Toolbar Lifecycle Forensics";title.style.cssText="display:block;color:#fff8e9!important;font-size:16px!important;margin-bottom:8px";
 const nav=document.createElement("div");nav.style.cssText="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:8px";
 for(const [label,cb] of [["Refresh report",()=>{last=report();draw()}],["Copy report",()=>{last=report();navigator.clipboard?.writeText(last).catch(()=>{})}],["Close",()=>{closed=true;observer.disconnect();if(timer)clearInterval(timer);panel.remove();panel=null;pre=null}]]){
  const b=document.createElement("button");b.type="button";b.textContent=label;b.style.cssText="font:400 14px/1.3 ui-monospace,monospace;padding:7px 10px;border:0;border-radius:7px;background:#fff8e9;color:#243038;cursor:pointer";b.addEventListener("click",cb);nav.append(b);
 }
 pre=document.createElement("pre");pre.style.cssText="font:inherit!important;white-space:pre-wrap;overflow-wrap:anywhere;margin:0;color:#fff8e9!important;background:transparent!important";
 panel.append(title,nav,pre);document.body.append(panel);draw();
}
let prev="";
function sample(tag){
 const s=state();
 if(s!==prev){prev=s;samples.push(now()+" ["+tag+"] "+s);if(samples.length>65)samples.shift();draw()}
}
const observer=new MutationObserver(records=>{
 let flags=[];
 for(const r of records){
  if(r.target===panel||panel?.contains(r.target))continue;
  if(r.type==="childList"){
   for(const [nodes,verb] of [[r.addedNodes,"ADDED"],[r.removedNodes,"REMOVED"]]){
    for(const node of nodes){
     if(node.nodeType!==1||node===panel)continue;
     if(node.id===ID||node.id===STYLE||node.querySelector?.("#"+ID)||node.querySelector?.("#"+STYLE))flags.push(verb+" "+(node.id||node.tagName));
    }
   }
  }else if(r.type==="attributes"&&[ID,STYLE].includes(r.target.id)){flags.push("ATTRIBUTE "+r.target.id+" "+r.attributeName)}
 }
 if(flags.length){events.push(now()+" "+[...new Set(flags)].join("; "));if(events.length>100)events.shift();sample("mutation")}
});
function start(){
 if(!document.body)return;
 initPanel();
 observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:["style","class","hidden","aria-hidden"]});
 push("observer armed");
 sample("initial");
 const started=performance.now();
 timer=setInterval(()=>{sample("250ms");if(performance.now()-started>12000){clearInterval(timer);timer=null;push("12s observation window ended; manual refresh remains available")}},250);
}
if(document.body)start();else document.addEventListener("DOMContentLoaded",start,{once:true});
window.addEventListener("load",()=>{push("window load");sample("load")},{once:true});
window.addEventListener("pageshow",()=>{push("pageshow");sample("pageshow")});
window.addEventListener("error",e=>{if(e.target?.tagName==="SCRIPT")push("SCRIPT ERROR "+(e.target.src||"").split("/").pop());else if(e.message)push("JS ERROR "+String(e.message).slice(0,160))},true);
window.addEventListener("unhandledrejection",e=>push("PROMISE REJECTION "+String(e.reason?.message||"unknown").slice(0,160)));
window.KhaemenesHigherToolbarAudit=Object.freeze({version:"1.0.0",snapshot:()=>report(),events:()=>events.slice()});
})();