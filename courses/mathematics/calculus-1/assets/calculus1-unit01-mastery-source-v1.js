(function(){
"use strict";
const bank=window.CALC1_LESSON_MASTERY_BANK;
if(!bank||!Array.isArray(bank.lessonIds))return;
function shuffled(a){
 const out=[...a];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out;
}
const all=[];
for(const id of bank.lessonIds){
 const generated=bank.generate(id);
 if(generated.length<15){console.error("Unit 01 mastery source incomplete:",id);return}
 for(const item of shuffled(generated).slice(0,15)){
  all.push({id:item.id,unit:1,lesson:id,skill:id,
   prompt:item.prompt,options:item.options.slice(),answer:item.answer,answer_text:item.options[item.answer],explanation:item.explanation});
 }
}
window.CALCULUS1_QUESTIONS=all;
})();