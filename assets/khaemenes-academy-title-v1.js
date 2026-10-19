/* Khaemenes Academy · institutional heading hierarchy v1
   Accessible DOM headings; does not alter course data, forms, mastery or navigation. */
(function(){
"use strict";
if(window.__khaeAcademyTitleInstalled)return;
window.__khaeAcademyTitleInstalled=true;
function run(){
 if(document.querySelector('[data-khae-academy-heading="v1"]'))return;
 const style=document.createElement("style");style.id="khaeAcademyTitleStyles";
 style.textContent=[
 '.khae-academy-main-title{display:block!important;font-family:Cinzel,Georgia,"Palatino Linotype",serif!important;font-size:clamp(27px,3.4vw,33px)!important;line-height:1.25!important;letter-spacing:.025em!important;font-weight:400!important;text-align:center!important;margin:7px 0 5px!important}',
 '.khae-academy-page-subtitle{font-family:Georgia,"Palatino Linotype",serif!important;font-size:clamp(18px,2.4vw,24px)!important;line-height:1.35!important;font-weight:400!important;letter-spacing:0!important;text-align:center!important;margin:4px 0 14px!important}',
 '.brand-copy strong.khae-academy-brand{font-family:Cinzel,Georgia,serif;font-size:clamp(16px,2vw,21px);font-weight:400;letter-spacing:.015em}',
 '.brand-copy small.khae-academy-brand-subtitle{font-size:clamp(11px,1.3vw,13px);font-weight:400}',
 '@media print{.khae-academy-main-title{font-size:24pt!important;color:#111!important}.khae-academy-page-subtitle{font-size:17pt!important;color:#111!important}}'
 ].join("");
 (document.head||document.documentElement).appendChild(style);
 const brand=document.querySelector(".site-header .brand-copy,.top .brand");
 if(brand){
   const strong=brand.querySelector("strong");
   const small=brand.querySelector("small");
   if(strong&&small&&strong.textContent.trim()!=="Khaemenes Academy"){
     const prior=strong.textContent.trim();
     strong.textContent="Khaemenes Academy";strong.classList.add("khae-academy-brand");
     small.textContent=prior.replace(/^Khaemenes (Higher Learning|Academy)\s*[·:|-]?\s*/i,"")||"Higher Learning";
     small.classList.add("khae-academy-brand-subtitle");
   }
 }
 const first=document.querySelector("main .lesson-header h1,main .section-head h1,main h1,.hero h1,header h1") ||
             document.querySelector("main .lesson-header h2,main .section-head h2,main h2,.hero h2,header h2");
 if(!first)return;
 const existing=first.textContent.trim();
 if(!existing)return;
 if(/^Khaemenes Academy$/i.test(existing)){
   first.classList.add("khae-academy-main-title");first.dataset.khaeAcademyHeading="v1";
   const subtitle=first.nextElementSibling;
   if(subtitle&&/^H[2-6]$/.test(subtitle.tagName))subtitle.classList.add("khae-academy-page-subtitle");
   return;
 }
 const h1=document.createElement("h1");h1.textContent="Khaemenes Academy";
 h1.className="khae-academy-main-title";h1.dataset.khaeAcademyHeading="v1";
 if(first.tagName==="H1"){
   const second=document.createElement("h2");
   for(const a of Array.from(first.attributes)){if(a.name!=="id")second.setAttribute(a.name,a.value)}
   second.classList.add("khae-academy-page-subtitle");second.append(...Array.from(first.childNodes));
   first.replaceWith(h1,second);
 }else{
   first.classList.add("khae-academy-page-subtitle");first.before(h1);
 }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run,{once:true});
else run();
})();
