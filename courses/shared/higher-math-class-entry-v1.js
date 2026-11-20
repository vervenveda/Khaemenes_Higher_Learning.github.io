(()=>{"use strict";
const ENROLL="https://vervenveda.com/Khaemenes_Academy.github.io/family/enroll/";
const REGISTRY="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-family-registry.js";
let registryPromise=null;
function loadRegistry(){
 if(window.KhaemenesFamilyRegistry)return Promise.resolve(window.KhaemenesFamilyRegistry);
 if(registryPromise)return registryPromise;
 registryPromise=new Promise(resolve=>{
  const prior=[...document.scripts].find(s=>s.src===REGISTRY);
  if(prior){
   prior.addEventListener("load",()=>resolve(window.KhaemenesFamilyRegistry||null),{once:true});
   prior.addEventListener("error",()=>resolve(null),{once:true});
   setTimeout(()=>resolve(window.KhaemenesFamilyRegistry||null),2500);
   return;
  }
  const s=document.createElement("script");
  s.src=REGISTRY;s.async=true;
  s.onload=()=>resolve(window.KhaemenesFamilyRegistry||null);
  s.onerror=()=>resolve(null);
  document.head.append(s);
 });
 return registryPromise;
}
function registeredLearner(R){
 try{
  const ids=R?.activeIds?.()||{};
  const learner=ids.learnerId?R?.getLearner?.(ids.learnerId):null;
  if(!learner?.learnerId)return null;
  if(!learner?.accountId&&!learner?.accountState)return null;
  return learner;
 }catch{return null}
}
async function access(){
 const R=await loadRegistry(),learner=registeredLearner(R);
 return {allowed:Boolean(learner),learner,reason:learner?"registered-academy-learner":"enrollment-required"};
}
function enroll(){location.replace(ENROLL)}
async function requireAccess(){
 const result=await access();
 if(!result.allowed){enroll();return null}
 return result;
}
document.addEventListener("click",async event=>{
 const link=event.target.closest?.('a[data-higher-math-enter-class]');
 if(!link)return;
 event.preventDefault();
 const destination=link.href;
 const result=await access();
 if(!result.allowed){enroll();return}
 location.href=destination;
},true);
window.KhaemenesHigherMathClassEntry=Object.freeze({version:"1.0.0",enrollmentUrl:ENROLL,access,requireAccess,registeredLearner,identityAuthority:"academy-family-registry",policy:Object.freeze({failClosedWithoutLearner:true,nameMatching:false,allowsRegisteredHighSchoolBridgeLearner:true})});
})();