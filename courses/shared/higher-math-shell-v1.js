(()=>{"use strict";
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function translatorIntoTools(){
 const tools=document.getElementById("vnvClassToolsToolbar"),panel=tools?.querySelector("#vnvClassToolsPanel"),switcher=document.getElementById("vnv-language-switch");
 if(!tools||!panel||!switcher)return false;
 let pop=panel.querySelector("[data-vct-translator-panel]");
 if(!pop){pop=document.createElement("div");pop.className="vct-pop";pop.hidden=true;pop.setAttribute("data-vct-translator-panel","");pop.innerHTML='<h2>Translate</h2><p>Translate this learning page locally.</p><div data-vnv-language-mount></div>';panel.append(pop)}
 pop.querySelector("[data-vnv-language-mount]")?.append(switcher);
 return true;
}
function configureTools(){
 window.KhaemenesClassToolsConfigV1={
  id:"higher-learning-math-landing",match:()=>true,toggleLabel:"Tools",ariaLabel:"Higher Learning mathematics tools",
  tools:[
   {type:"materials",label:"Materials",sub:"Course resources"},
   {type:"action",action:"translate",label:"Translate",sub:"Page language"},
   {type:"link",label:"Profile",sub:"Learner profile",href:"https://vervenveda.com/Khaemenes_Academy.github.io/student/"},
   {type:"link",label:"Parent",sub:"Family support",href:"https://vervenveda.com/Khaemenes_Academy.github.io/family/"},
   {type:"ecosystem-link",label:"Search",sub:"Search ecosystem",ecosystemId:"plera",fallbackHref:"https://vervenveda.com/PLERASearch.github.io/"},
   {type:"help",label:"Instructions",sub:"How tools work"}
  ],
  materials:{title:"Mathematics Materials",intro:"Lessons remain primary. Use approved tools for practice and verification.",links:[
   {label:"Scientific Calculator",href:"https://vervenveda.com/proresource_hub.github.io/Protools/Khaemenes_Scientific_Calculator_index.html"}
  ]},
  actions:{translate:({root})=>{translatorIntoTools();const p=root.querySelector("[data-vct-translator-panel]");if(p){root.querySelectorAll(".vct-pop").forEach(x=>{if(x!==p)x.hidden=true});p.hidden=!p.hidden}}},
  help:{title:"Higher Learning Mathematics Tools",paragraphs:["<strong>Lessons stay primary.</strong> Tools support mathematics; they do not replace proof, written work or mastery evidence.","<strong>Translator stays inside this dock.</strong> No separate translator bar is added to the course layout."]}
 };
}
configureTools();
addEventListener("DOMContentLoaded",()=>{let n=0;const t=setInterval(()=>{n++;translatorIntoTools();if(n>30||document.querySelector("#vnvClassToolsToolbar [data-vct-translator-panel] #vnv-language-switch"))clearInterval(t)},120)}, {once:true});
})();