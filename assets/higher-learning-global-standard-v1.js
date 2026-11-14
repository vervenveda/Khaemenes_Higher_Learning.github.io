/* Khaemenes Higher Learning · canonical global standard v1.0.0
   Typography: 16px floor · 33px titles · one 66px primary title.
   Chrome: 333 ticker -> AutoPopulate ticker -> official header/menu -> lower-right 3x2 ecosystem toolbar.
*/
(()=>{"use strict";
if(window.__KHAEMENES_HIGHER_GLOBAL_STANDARD_V1__)return;
window.__KHAEMENES_HIGHER_GLOBAL_STANDARD_V1__=true;

const VNV="https://vervenveda.com/assets/";
const ROOT="https://vervenveda.com/Khaemenes_Higher_Learning.github.io/";
const STYLE_ID="khaemenesHigherTypographyStandardV1";
const PRIMARY_ATTR="data-khaemenes-primary-title";
const SCRIPTS={
  ticker333:VNV+"vnv-333-ticker.js",
  tickerAuto:VNV+"vnv-ticker-autopopulate.js",
  header:VNV+"vnv-header-autopopulate.js",
  toolbar:VNV+"vnv-ecosystem-toolbar.js"
};

function hasScript(pathname){
  return [...document.scripts].some(s=>{
    try{return new URL(s.src,location.href).pathname===pathname}catch{return false}
  });
}
function load(src,key){
  const url=new URL(src,location.href);
  if(hasScript(url.pathname))return Promise.resolve();
  return new Promise(resolve=>{
    const s=document.createElement("script");
    s.src=url.href;s.defer=true;s.dataset[key]="true";
    s.addEventListener("load",resolve,{once:true});
    s.addEventListener("error",resolve,{once:true});
    (document.head||document.documentElement).append(s);
  });
}
function visible(el){
  if(!el||!el.isConnected||el.hidden||el.getAttribute("aria-hidden")==="true")return false;
  const cs=getComputedStyle(el);
  return cs.display!=="none"&&cs.visibility!=="hidden";
}
function markPrimary(){
  const current=document.querySelector('['+PRIMARY_ATTR+'="true"]');
  if(current&&visible(current))return current;
  document.querySelectorAll('['+PRIMARY_ATTR+']').forEach(el=>el.removeAttribute(PRIMARY_ATTR));
  const chosen=[...document.querySelectorAll(
    'main .hero h1,main h1,.hero h1,[data-hero] h1,[data-page-hero] h1,h1,.hero-title,.main-title,.page-title'
  )].find(visible)||null;
  if(chosen)chosen.setAttribute(PRIMARY_ATTR,"true");
  return chosen;
}
function hasReadableText(el){
  if(!el||el.nodeType!==1)return false;
  if(el.matches("script,style,noscript,template,svg,svg *,canvas,iframe,br,hr,source,track,meta,link"))return false;
  return [...el.childNodes].some(n=>n.nodeType===Node.TEXT_NODE&&String(n.nodeValue||"").trim())||
    el.matches("input,select,textarea,button,option");
}
function enforceFloor(root=document.body){
  if(!root)return;
  const nodes=[];
  if(root.nodeType===1)nodes.push(root);
  if(root.querySelectorAll)nodes.push(...root.querySelectorAll("*"));
  for(const el of nodes){
    if(!hasReadableText(el))continue;
    if(el.matches("h1,h2,h3,h4,h5,h6,[role=heading],["+PRIMARY_ATTR+"]"))continue;
    const size=parseFloat(getComputedStyle(el).fontSize||"0");
    if(size>0&&size<16){
      el.style.setProperty("font-size","16px","important");
      el.dataset.khaemenesMinText="16";
    }
  }
}
function installTypography(){
  if(!document.head||!document.body)return;
  if(!document.getElementById(STYLE_ID)){
    const style=document.createElement("style");
    style.id=STYLE_ID;
    style.textContent=`
html:root body{font-size:16px!important}
html:root body :is(
  p,li,dt,dd,blockquote,figcaption,caption,legend,label,
  a,button,input,select,textarea,option,output,
  td,th,summary,small,strong,em,b,i,u,s,mark,time,
  .eyebrow,.kicker,.subtitle,.subheading,.lead,.description,
  .breadcrumbs,.breadcrumb,.badge,.chip,.pill,.status,.meta,
  .caption,.note,.helper,.hint,.message,.toast,
  .brand-name,.brand-sub,.menu-group,.menu-link,.menu-link small,.menu-link strong
){font-size:max(16px,1em)!important}
html:root body :is(
  h1,h2,h3,h4,h5,h6,[role="heading"],
  .page-title,.hero-title,.main-title,.section-title,.card-title,
  .display-title,.site-title,.brand-title,.modal-title,.dialog-title
){
  font-size:33px!important;
  line-height:1.2!important;
  font-weight:400!important;
  overflow-wrap:anywhere;
  text-wrap:balance
}
html:root body [${PRIMARY_ATTR}="true"]{
  font-size:66px!important;
  line-height:1.05!important;
  font-weight:400!important;
  overflow-wrap:anywhere;
  text-wrap:balance
}
@media(max-width:560px){
  html:root body [${PRIMARY_ATTR}="true"]{font-size:66px!important}
}
@media print{html:root body{font-size:16px!important}}
`;
    document.head.append(style);
  }
  markPrimary();
  enforceFloor();
  document.documentElement.dataset.khaemenesHigherTypography="16-33-66";
}
function mount333(){try{window.VNV333Ticker?.mount?.()}catch{}}
function mountAuto(){
  try{
    if(!document.getElementById("vnvTickerAutoPopulate"))window.VNV_TICKER?.autoPopulate?.({mode:"auto"});
  }catch{}
  mount333();
}
function mountHeader(){
  try{
    window.VNV_HEADER?.mount?.({
      replaceLegacy:true,
      title:"Khaemenes Higher Learning",
      subtitle:"Collegiate Campus · Undergraduate · Advanced · Research",
      icon:"K",
      home:"https://vervenveda.com/KhaemenesAcademy_Home.github.io/",
      actions:[
        {label:"Student",href:ROOT+"#student-portal"},
        {label:"Departments",href:ROOT+"#departments"},
        {label:"Courses",href:ROOT+"courses/"},
        {label:"Ecosystem",href:"https://vervenveda.com/#directory"},
        {label:"Family",href:"https://vervenveda.com/Khaemenes_Academy.github.io/family/"}
      ]
    });
  }catch{}
}
function mountToolbar(){
  try{window.VNVEcosystemToolbar?.mount?.()}catch{}
  const dock=document.getElementById("vnvEcosystemUtilityDock");
  if(dock){
    dock.style.setProperty("left","auto","important");
    dock.style.setProperty("right","max(12px, env(safe-area-inset-right))","important");
    dock.dataset.khaemenesHigherCanonicalToolbar="true";
  }
}
let pending=false;
function schedule(){
  if(pending)return;
  pending=true;
  requestAnimationFrame(()=>{
    pending=false;
    installTypography();mount333();mountAuto();mountHeader();mountToolbar();
  });
}
async function start(){
  if(!document.body)return;
  installTypography();

  await load(SCRIPTS.ticker333,"khaemenesHigher333");mount333();
  await load(SCRIPTS.tickerAuto,"khaemenesHigherAutoTicker");mountAuto();
  await load(SCRIPTS.header,"khaemenesHigherHeader");mountHeader();
  await load(SCRIPTS.toolbar,"khaemenesHigherToolbar");mountToolbar();

  document.documentElement.dataset.khaemenesHigherChrome="333-auto-header-menu-toolbar";

  if(typeof MutationObserver==="function"){
    new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  }
  window.addEventListener("resize",schedule,{passive:true});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
else start();
})();