(function attachAGTGMPIdentityScope(global){
  "use strict";
  const VERSION="1.0.0";
  const COURSE_ID="KH-HL-AGTGMP";
  const KEYS=new Set(["khaemenes-hl-agtgmp-progress-v1","khaemenes-hl-agtgmp-progress-v2"]);
  const original=Object.freeze({
    getItem:Storage.prototype.getItem,
    setItem:Storage.prototype.setItem,
    removeItem:Storage.prototype.removeItem
  });

  function rawGet(key){try{return original.getItem.call(global.localStorage,key)}catch{return null}}
  function rawSet(key,value){try{original.setItem.call(global.localStorage,key,String(value));return true}catch{return false}}
  function clean(value,max=80){return String(value??"").replace(/[\u0000-\u001f\u007f]/g,"").trim().slice(0,max)}
  function stageOf(R,learner){return R?.normalizeStage?R.normalizeStage(learner?.stage):learner?.stage}
  function scholar(){
    const R=global.KhaemenesFamilyRegistry;if(!R)return null;
    const ids=R.activeIds?.()||{};
    const adult=R.getAdult?.(ids.adultId)||null;
    let learner=R.getLearner?.(ids.learnerId)||null;
    if(!learner&&adult)learner=R.getAdultLearner?.(adult.adultId)||null;
    return stageOf(R,learner)==="higher"?learner:null;
  }
  function soleHigherScholar(current){
    const R=global.KhaemenesFamilyRegistry,family=R?.getFamily?.();
    if(!current||!family)return false;
    const higher=(family.learners||[]).filter(item=>stageOf(R,item)==="higher");
    return higher.length===1&&higher[0]?.learnerId===current.learnerId;
  }

  const active=scholar();
  const canonicalName=()=>active?clean(active.nickname||active.displayName||active.name||"Scholar"):"";
  const scopedKey=key=>active?.learnerId?`khaemenes.higher.app:${active.learnerId}:${key}`:null;
  const owns=key=>KEYS.has(String(key||""));

  function normalizeValue(key,value){
    if(!active||value===null||key!=="khaemenes-hl-agtgmp-progress-v2")return value;
    try{
      const parsed=JSON.parse(value);
      if(!parsed||typeof parsed!=="object"||Array.isArray(parsed))return value;
      parsed.learner={
        displayName:canonicalName(),
        stage:"higher",
        authority:"academy-family-registry"
      };
      return JSON.stringify(parsed);
    }catch{return value}
  }

  function scopedRead(key){
    if(!active)return null;
    const physical=scopedKey(key);
    const existing=rawGet(physical);
    if(existing!==null){
      const normalized=normalizeValue(key,existing);
      if(normalized!==existing)rawSet(physical,normalized);
      return normalized;
    }
    if(soleHigherScholar(active)){
      const legacy=rawGet(key);
      if(legacy!==null){
        const normalized=normalizeValue(key,legacy);
        rawSet(physical,normalized);
        return normalized;
      }
    }
    return null;
  }

  Storage.prototype.getItem=function(key){
    if(this===global.localStorage&&owns(key))return scopedRead(String(key));
    return original.getItem.call(this,key);
  };
  Storage.prototype.setItem=function(key,value){
    if(this===global.localStorage&&owns(key)){
      const physical=scopedKey(String(key));
      if(physical)rawSet(physical,normalizeValue(String(key),String(value)));
      return;
    }
    return original.setItem.call(this,key,value);
  };
  Storage.prototype.removeItem=function(key){
    if(this===global.localStorage&&owns(key)){
      const physical=scopedKey(String(key));
      if(physical)original.removeItem.call(this,physical);
      return;
    }
    return original.removeItem.call(this,key);
  };

  global.addEventListener("khaemenes-family-changed",()=>global.location.reload());
  global.KhaemenesAGTGMPIdentityScope=Object.freeze({
    version:VERSION,
    courseId:COURSE_ID,
    currentScholar:()=>active,
    policy:Object.freeze({
      identityAuthority:"academy-family-registry",
      learnerScopedStorage:true,
      legacyKeysPreserved:true,
      legacyMigration:"only-when-sole-higher-scholar",
      noScholarPersistence:"fail-closed",
      learnerMetadata:"canonical-summary-only"
    })
  });
})(window);
