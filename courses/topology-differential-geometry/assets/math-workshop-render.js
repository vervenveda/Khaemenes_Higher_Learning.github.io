/* Supplementary theorem/proof workshops for Units 02–13, lessons 02 onward.
   Data stays local; course lesson records are saved through the learner-scoped engine. */
(() => {
"use strict";
const id=document.body.dataset.lessonId;
const entries=window.KHAEMENES_TOPOLOGY_WORKSHOPS||{};
const work=entries[id], api=window.KHAEMENES_TOPOLOGY_WORKSHOP_EVIDENCE;
const pathways=document.getElementById("pathways");
if(!work||!api||!pathways)return;
const section=document.createElement("section");
section.className="section math-workshop";
section.id="rigor-workshop";
section.setAttribute("aria-labelledby","mathWorkshopTitle");
const wrap=document.createElement("div");wrap.className="wrap";section.append(wrap);
const heading=document.createElement("div");heading.className="section-head";wrap.append(heading);
function textNode(parent,tag,content,cls){
 const node=document.createElement(tag);node.textContent=content;if(cls)node.className=cls;parent.append(node);return node;
}
textNode(heading,"p","Higher Learning · Mathematical proof and transfer","eyebrow");
textNode(heading,"h2","Worked mathematical investigation","math-workshop-title").id="mathWorkshopTitle";
const article=document.createElement("article");article.className="lesson-section";wrap.append(article);
textNode(article,"h3","Statement and verified reasoning");
textNode(article,"p",work.example);
textNode(article,"h3","Independent proof / transfer");
textNode(article,"p",work.proof);
textNode(article,"h3","Counterexample and hypothesis clinic");
textNode(article,"p",work.pitfall);
const label1=document.createElement("label");label1.setAttribute("for","mathWorkshopProof");label1.textContent="Your independent proof or complete calculation";article.append(label1);
const proof=document.createElement("textarea");proof.id="mathWorkshopProof";proof.rows=6;proof.placeholder="State hypotheses, work through every inference, and justify your conclusion in your own words.";proof.style.cssText="width:100%;min-height:140px;box-sizing:border-box";article.append(proof);
const label2=document.createElement("label");label2.setAttribute("for","mathWorkshopReflection");label2.textContent="Counterexample, limitation, or correction";article.append(label2);
const reflection=document.createElement("textarea");reflection.id="mathWorkshopReflection";reflection.rows=4;reflection.placeholder="Show what would fail without a hypothesis, or explain the corrected reasoning.";reflection.style.cssText="width:100%;min-height:96px;box-sizing:border-box";article.append(reflection);
textNode(article,"h3","Faculty / mentor review rubric");
textNode(article,"p","Definitions and stated hypotheses 20% · complete mathematical derivation 40% · counterexample and transfer 20% · clarity and interpretation 20%. A local saved response does not certify academic mastery. An evaluator must review the proof independently.");
const actions=document.createElement("div");actions.className="actions";article.append(actions);
const save=document.createElement("button");save.type="button";save.className="btn primary";save.id="saveMathWorkshop";save.textContent="Save Proof Evidence";actions.append(save);
const print=document.createElement("button");print.type="button";print.className="btn";print.textContent="Print Evidence";actions.append(print);
const status=textNode(article,"p","","math-workshop-status");status.id="mathWorkshopStatus";status.setAttribute("role","status");status.setAttribute("aria-live","polite");
const data=api.get();proof.value=data.proof||"";reflection.value=data.reflection||"";
if(proof.value||reflection.value)status.textContent="Saved evidence loaded for this learner. Not independently verified.";
save.addEventListener("click",()=>{
 api.save(proof.value,reflection.value);
 status.textContent="Proof and limitation saved locally for this learner. Faculty review remains required.";
});
print.addEventListener("click",()=>window.print());
pathways.before(section);
const nav=document.querySelector('.stage-nav a[href="#pathways"]');
if(nav){
 const link=document.createElement("a");link.href="#rigor-workshop";link.textContent="Proof Workshop";nav.before(link);
}
if(!document.getElementById("mathWorkshopPrintRules")){
 const style=document.createElement("style");style.id="mathWorkshopPrintRules";
 style.textContent="@media print{.math-workshop{display:block!important;break-before:page;padding:0!important}.math-workshop .lesson-section{display:block!important;background:#fff!important;color:#111!important;border:1px solid #777!important}.math-workshop textarea{color:#111!important;background:#fff!important;white-space:pre-wrap}.math-workshop .actions{display:none!important}}@media(max-width:300px){.math-workshop textarea{max-width:100%}.math-workshop .lesson-section{padding:12px!important;overflow-wrap:anywhere}}";
 document.head.append(style);
}
})();
