(()=>{"use strict";
const COURSE="calculus-iii-multivariable",THRESHOLD=80,PREFIX="khaemenes-calculus3-mastery-v1:";
function parse(k){try{return JSON.parse(localStorage.getItem(k)||"null")}catch{return null}}
function learnerId(){try{const a=parse("khaemenes_active_learner_v1"),r=parse("khaemenes_family_registry_v1"),id=typeof a==="string"?a:a?.learnerId;return id&&r?.learners?.[id]?String(id):null}catch{return null}}
function key(){const id=learnerId();return id?PREFIX+encodeURIComponent(id):null}
function store(){const k=key();return k?(parse(k)||{schema:"khaemenes-calculus3-mastery-v1",lessons:{},units:{}}):{lessons:{},units:{}}}
function mastered(id){const r=store().lessons?.[id];return r?.passed===true&&Number(r.score)>=THRESHOLD&&r?.learnerId===learnerId()}
async function canOpenLesson(nextId,ctx={}){
 const current=String(ctx.currentLessonId||"");
 if(!learnerId())return{ok:false,verified:false,reason:"No Academy learner is bound to this course."};
 if(!/^u\d{2}-l\d{2}$/.test(nextId))return{ok:false,verified:false,reason:"Unknown Calculus III lesson identifier."};
 if(!current)return{ok:nextId==="u01-l01",verified:true,reason:nextId==="u01-l01"?"Course entry verified.":"A current lesson is required before official progression."};
 if(mastered(current))return{ok:true,verified:true,required:current,reason:"Prior lesson has learner-scoped 80%+ mastery evidence."};
 return{ok:false,verified:true,required:current,reason:"Official progression requires learner-scoped 80%+ mastery evidence for "+current+". Preview remains available for study."};
}
window.KhaemenesHigherMathProgression=Object.freeze({version:"1.0.0",courseId:COURSE,threshold:THRESHOLD,canOpenLesson,mastered,learnerId});
})();