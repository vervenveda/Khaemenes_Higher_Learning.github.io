(function attachHigherAppScope(global){
  "use strict";
  const VERSION="1.1.0";
  const path=(global.location?.pathname||"").toLowerCase();
  const mode=path.includes("/career/")?"career":path.includes("/ged/")?"ged":path.includes("/science/")?"science":null;
  if(!mode)return;

  const original=Object.freeze({getItem:Storage.prototype.getItem,setItem:Storage.prototype.setItem,removeItem:Storage.prototype.removeItem});
  function rawGet(key){try{return original.getItem.call(global.localStorage,key)}catch{return null}}
  function rawSet(key,value){try{original.setItem.call(global.localStorage,key,value);return true}catch{return false}}
  function clean(value,max=120){return String(value??"").replace(/[\u0000-\u001f\u007f]/g,"").trim().slice(0,max)}
  function stageOf(R,learner){return R?.normalizeStage?R.normalizeStage(learner?.stage):learner?.stage}
  function scholar(){
    const R=global.KhaemenesFamilyRegistry;if(!R)return null;
    const ids=R.activeIds?.()||{};const adult=R.getAdult?.(ids.adultId)||null;
    let learner=R.getLearner?.(ids.learnerId)||null;if(!learner&&adult)learner=R.getAdultLearner?.(adult.adultId)||null;
    return stageOf(R,learner)==="higher"?learner:null;
  }
  function soleHigherScholar(s){
    const R=global.KhaemenesFamilyRegistry,family=R?.getFamily?.();if(!s||!family)return false;
    const higher=(family.learners||[]).filter(x=>stageOf(R,x)==="higher");return higher.length===1&&higher[0]?.learnerId===s.learnerId;
  }
  function shouldScope(key){
    key=String(key||"");
    if(mode==="career")return /^(khaecareer|caa_|khae_career|career_|khaemenes_mentor_review|mentor_review)/i.test(key);
    if(mode==="ged")return /^ged/i.test(key);
    if(mode==="science")return key==="arshif_science_hall_v1"||key==="arshif_science_institute_v2";
    return false;
  }
  const s=scholar();
  function scopedKey(key){return s?.learnerId?`khaemenes.higher.app:${s.learnerId}:${key}`:null}
  function scopedRead(key){
    if(!s)return null;const sk=scopedKey(key),saved=rawGet(sk);if(saved!==null)return saved;
    if(soleHigherScholar(s)){const legacy=rawGet(key);if(legacy!==null){rawSet(sk,legacy);return legacy}}
    return null;
  }
  Storage.prototype.getItem=function(key){if(this===global.localStorage&&shouldScope(key))return scopedRead(key);return original.getItem.call(this,key)};
  Storage.prototype.setItem=function(key,value){if(this===global.localStorage&&shouldScope(key)){const sk=scopedKey(key);if(sk)rawSet(sk,String(value));return}return original.setItem.call(this,key,value)};
  Storage.prototype.removeItem=function(key){if(this===global.localStorage&&shouldScope(key)){const sk=scopedKey(key);if(sk)original.removeItem.call(this,sk);return}return original.removeItem.call(this,key)};

  function enforceAssessmentMentorIdentity(){
    if(!path.endsWith("/assessment-mentor_index.html"))return;
    const input=document.getElementById("studentName");if(!input)return;
    if(s){input.value=clean(s.nickname||"Scholar",60);input.readOnly=true;input.setAttribute("aria-readonly","true");input.title="Student identity comes from the Khaemenes Academy Family Registry."}
    else{input.value="";input.disabled=true;input.placeholder="Academy scholar required";input.title="Open Scholar Entry to select the canonical learner."}
  }
  function enforceScienceIdentity(){
    if(mode!=="science")return;
    const input=document.getElementById("studentName");if(!input)return;
    if(s){
      const canonical=clean(s.nickname||"Scholar",80);
      if(input.value!==canonical){input.value=canonical;input.dispatchEvent(new Event("input",{bubbles:true}))}
      input.readOnly=true;input.setAttribute("aria-readonly","true");input.title="Learner identity comes from the Khaemenes Academy Family Registry.";
    }else{
      input.value="";input.disabled=true;input.placeholder="Academy scholar required";input.title="Use Scholar Entry to select the canonical Higher Learning learner before creating completion records.";
      ["seniorName","associateName"].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent="Academy scholar required"});
    }
  }
  function enforceGEDCertificateIdentity(){
    if(!path.endsWith("/portal_index.html"))return;
    const nativePrompt=global.prompt.bind(global);
    global.prompt=(message,defaultValue)=>/student\s*name/i.test(String(message||""))?(s?clean(s.nickname||"Scholar",80):null):nativePrompt(message,defaultValue);
    document.addEventListener("click",event=>{
      const button=event.target?.closest?.('[onclick*="generateCertificate"]');
      if(button&&!s){event.preventDefault();event.stopImmediatePropagation();global.alert("Select or create the canonical Higher Learning scholar through Scholar Entry before generating a certificate.")}
    },true);
  }
  function applyIdentity(){enforceAssessmentMentorIdentity();enforceScienceIdentity()}
  document.addEventListener("DOMContentLoaded",applyIdentity,{once:true});
  document.addEventListener("click",event=>{if(path.endsWith("/assessment-mentor_index.html")&&event.target?.closest?.("#clearFormBtn"))setTimeout(applyIdentity,0)},true);
  enforceGEDCertificateIdentity();
  global.addEventListener("khaemenes-family-changed",()=>global.location.reload());
  global.KhaemenesHigherAppScope=Object.freeze({version:VERSION,mode,currentScholar:()=>s,policy:Object.freeze({identityAuthority:"academy-family-registry",legacyKeysPreserved:true,learnerScopedStorage:true,noScholarPersistence:"fail-closed",masterDirectoryNamesStable:true})});
})(window);
