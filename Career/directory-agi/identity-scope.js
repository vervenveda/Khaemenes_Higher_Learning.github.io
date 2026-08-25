(function attachCareerDirectoryScholarScope(global){
  "use strict";
  const VERSION="1.0.0";
  const KEYS=new Set(["KHAEMENES_CAREER_DIRECTORY_AGI_NOTES_V2","KHAEMENES_CAREER_DIRECTORY_AGI_STATE_V2"]);
  const native=Object.freeze({getItem:Storage.prototype.getItem,setItem:Storage.prototype.setItem,removeItem:Storage.prototype.removeItem});
  function rawGet(key){try{return native.getItem.call(global.localStorage,key)}catch{return null}}
  function rawSet(key,value){try{native.setItem.call(global.localStorage,key,String(value));return true}catch{return false}}
  function stageOf(R,learner){return R?.normalizeStage?R.normalizeStage(learner?.stage):learner?.stage}
  function scholar(){
    const R=global.KhaemenesFamilyRegistry;if(!R)return null;
    const ids=R.activeIds?.()||{},adult=R.getAdult?.(ids.adultId)||null;
    let learner=R.getLearner?.(ids.learnerId)||null;if(!learner&&adult)learner=R.getAdultLearner?.(adult.adultId)||null;
    return stageOf(R,learner)==="higher"?learner:null;
  }
  function soleHigherScholar(current){
    const R=global.KhaemenesFamilyRegistry,family=R?.getFamily?.();if(!current||!family)return false;
    const higher=(family.learners||[]).filter(item=>stageOf(R,item)==="higher");
    return higher.length===1&&higher[0]?.learnerId===current.learnerId;
  }
  const active=scholar();
  const owns=key=>KEYS.has(String(key||""));
  const physical=key=>active?.learnerId?`khaemenes.higher.app:${active.learnerId}:${key}`:null;
  function read(key){
    if(!active)return null;
    const scoped=physical(key),existing=rawGet(scoped);if(existing!==null)return existing;
    if(soleHigherScholar(active)){const legacy=rawGet(key);if(legacy!==null){rawSet(scoped,legacy);return legacy}}
    return null;
  }
  Storage.prototype.getItem=function(key){if(this===global.localStorage&&owns(key))return read(String(key));return native.getItem.call(this,key)};
  Storage.prototype.setItem=function(key,value){if(this===global.localStorage&&owns(key)){const scoped=physical(String(key));if(scoped)rawSet(scoped,String(value));return}return native.setItem.call(this,key,value)};
  Storage.prototype.removeItem=function(key){if(this===global.localStorage&&owns(key)){const scoped=physical(String(key));if(scoped)native.removeItem.call(this,scoped);return}return native.removeItem.call(this,key)};
  global.addEventListener("khaemenes-family-changed",()=>global.location.reload());
  global.KhaemenesCareerDirectoryScholarScope=Object.freeze({version:VERSION,currentScholar:()=>active,policy:Object.freeze({identityAuthority:"academy-family-registry",learnerScopedNotes:true,legacyKeysPreserved:true,legacyMigration:"only-when-sole-higher-scholar",noScholarPersistence:"fail-closed"})});
})(window);
