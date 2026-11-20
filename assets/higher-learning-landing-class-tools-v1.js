(()=>{"use strict";
if(window.__KHAE_HIGHER_LANDING_TOOLS_V1__)return;
window.__KHAE_HIGHER_LANDING_TOOLS_V1__=true;

function ensureTranslatorPanel(root){
 let panel=root?.querySelector("[data-vct-translator-panel]");
 if(panel)return panel;
 panel=document.createElement("div");
 panel.className="vct-pop";
 panel.setAttribute("data-vct-translator-panel","");
 panel.hidden=true;
 panel.innerHTML='<h2>Translate</h2><p>Choose the interface language for this Higher Learning page.</p><div data-vnv-language-mount></div>';
 root?.querySelector("#vnvClassToolsPanel")?.append(panel);
 return panel;
}
function moveCanonicalTranslator(panel){
 const mount=panel?.querySelector("[data-vnv-language-mount]");
 const switcher=document.getElementById("vnv-language-switch");
 if(mount&&switcher&&switcher.parentElement!==mount)mount.append(switcher);
 document.getElementById("vnv-language-rail")?.remove();
}
function openTranslator({root}){
 root.querySelectorAll(".vct-pop").forEach(p=>p.hidden=true);
 const panel=ensureTranslatorPanel(root);
 if(!panel)return;
 moveCanonicalTranslator(panel);
 panel.hidden=false;
 window.VNVLanguage?.refresh?.();
}
window.KhaemenesClassToolsConfigV1=Object.freeze({
 id:"higher-learning-landing",
 match:()=>/\/Khaemenes_Higher_Learning\.github\.io\/(?:index\.html)?$/i.test(location.pathname),
 toggleLabel:"Tools",
 ariaLabel:"Higher Learning tools",
 tools:[
  {type:"link",label:"Student",sub:"Learner profile",href:"https://vervenveda.com/Khaemenes_Academy.github.io/student/"},
  {type:"link",label:"Courses",sub:"Course directory",href:"./directory/"},
  {type:"ecosystem-list",label:"Research",sub:"Research resources",filter:{category:"research",limit:12}},
  {type:"action",label:"Translate",sub:"Change language",action:"translate"},
  {type:"link",label:"Career",sub:"Career portal",href:"./Career/index.html"},
  {type:"help",label:"Instructions",sub:"How to use tools"}
 ],
 actions:{translate:openTranslator},
 help:{title:"Higher Learning Tools",paragraphs:["Student opens the canonical Academy learner profile. Courses and Career stay inside Higher Learning.","Research uses approved public ecosystem resources. Translate uses the canonical Verve N Veda language system.","These controls do not alter course mastery, assessments, or learner records."]}
});
document.addEventListener("DOMContentLoaded",()=>{
 setTimeout(()=>{
  const root=document.getElementById("vnvClassToolsToolbar");
  if(!root)return;
  const panel=ensureTranslatorPanel(root);
  moveCanonicalTranslator(panel);
 },120);
},{once:true});
})();