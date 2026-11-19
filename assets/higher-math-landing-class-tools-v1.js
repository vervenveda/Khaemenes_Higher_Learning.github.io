(()=>{"use strict";
if(window.__KHAE_HIGHER_MATH_CLASS_TOOLS_V1__)return;
window.__KHAE_HIGHER_MATH_CLASS_TOOLS_V1__=true;

function ensureTranslatorMount(){
 if(document.querySelector("[data-vnv-language-mount]"))return;
 const mount=document.createElement("div");
 mount.id="khaeHigherMathTranslatorMount";
 mount.hidden=true;
 mount.setAttribute("data-vnv-language-mount","");
 mount.setAttribute("data-i18n-ignore","");
 document.body.append(mount);
}
function openTranslator({root}){
 root.querySelectorAll(".vct-pop").forEach(p=>p.hidden=true);
 let panel=root.querySelector("[data-vct-translator-panel]");
 if(!panel){
   panel=document.createElement("div");
   panel.className="vct-pop";
   panel.setAttribute("data-vct-translator-panel","");
   const h=document.createElement("h2");h.textContent="Translate";
   const p=document.createElement("p");p.textContent="Choose the interface language for this Higher Learning mathematics page.";
   panel.append(h,p);
   root.querySelector("#vnvClassToolsPanel")?.append(panel);
 }
 const mount=document.getElementById("khaeHigherMathTranslatorMount")||document.querySelector("[data-vnv-language-mount]");
 if(mount){mount.hidden=false;panel.append(mount)}
 panel.hidden=false;
 window.VNVLanguage?.refresh?.();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ensureTranslatorMount,{once:true});else ensureTranslatorMount();

window.KhaemenesClassToolsConfigV1={
 id:"higher-learning-math-landing",
 match:()=>/\/Khaemenes_Higher_Learning\.github\.io\/courses\/(?:mathematics\/(?:precalculus-trigonometry|calculus-1)|calculus-ii|linear-algebra|differential-equations|statistics|discrete-mathematics|introduction-to-proofs|real-complex-analysis|abstract-algebra|topology-differential-geometry|advanced-geometric-topology)\/(?:index\.html)?$/i.test(location.pathname),
 toggleLabel:"Tools",
 ariaLabel:"Higher Learning mathematics tools",
 tools:[
   {type:"link",label:"Calculator",sub:"Scientific calculator",href:"https://vervenveda.com/proresource_hub.github.io/Protools/Khaemenes_Scientific_Calculator/"},
   {type:"link",label:"Research",sub:"Academic research",href:"https://vervenveda.com/PLERASearch.github.io/"},
   {type:"link",label:"Library",sub:"Arshif Archives",href:"https://vervenveda.com/arshif_archives.github.io/"},
   {type:"link",label:"Search",sub:"Search ecosystem",href:"https://vervenveda.com/PLERASearch.github.io/"},
   {type:"action",label:"Translate",sub:"Change language",action:"translate"},
   {type:"link",label:"Parent",sub:"Family support",href:"https://vervenveda.com/Khaemenes_Academy.github.io/family/"}
 ],
 actions:{translate:openTranslator}
};
})();