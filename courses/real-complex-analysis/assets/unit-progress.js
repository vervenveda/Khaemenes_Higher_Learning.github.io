(() => {
"use strict";
const unit=Number(document.body.dataset.unit);
if(!unit)return;
const KEY="khaemenes-real-complex-analysis-lessons-v1";
let data={};try{data=JSON.parse(localStorage.getItem(KEY)||"{}")}catch{}
const cards=[...document.querySelectorAll("[data-lesson-id]")];
let done=0;
cards.forEach(card=>{
 const id=card.dataset.lessonId,on=!!data[id]?.complete;
 if(on){done++;card.classList.add("completed");const p=card.querySelector(".lesson-state");if(p)p.textContent="Completed on this device";}
});
const out=document.getElementById("unitProgress");
if(out)out.textContent=`${done}/${cards.length} detailed lessons marked complete`;
})();