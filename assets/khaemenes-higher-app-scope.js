(function attachHigherAppScope(global){
  "use strict";
  const VERSION="1.2.0";
  const path=(global.location?.pathname||"").toLowerCase();
  const mode=path.includes("/career/")?"career":path.includes("/ged/")?"ged":path.includes("/science/")?"science":path.includes("/technology/coding/")?"coding":null;
  if(!mode)return;

  const original=Object.freeze({
    getItem:Storage.prototype.getItem,
    setItem:Storage.prototype.setItem,
    removeItem:Storage.prototype.removeItem,
    key:Storage.prototype.key
  });
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
    if(mode==="coding")return /^(?:coding\d{3}_|khaemenes_coding\d{3}_v\d+$)/i.test(key);
    return false;
  }
  const s=scholar();
  function canonicalName(){return s?clean(s.nickname||s.displayName||s.name||"Scholar",80):""}
  function scopedKey(key){return s?.learnerId?`khaemenes.higher.app:${s.learnerId}:${key}`:null}
  function normalizeScopedValue(key,value){
    if(mode!=="coding"||value===null||!s)return value;
    key=String(key||"");
    if(/^coding\d{3}_studentname$/i.test(key))return canonicalName();
    if(/^khaemenes_coding\d{3}_v\d+$/i.test(key)){
      try{
        const parsed=JSON.parse(value);
        if(parsed&&typeof parsed==="object"&&!Array.isArray(parsed)){
          parsed.certName=canonicalName();
          return JSON.stringify(parsed);
        }
      }catch{}
    }
    return value;
  }
  function scopedRead(key){
    if(!s)return null;
    const sk=scopedKey(key),saved=rawGet(sk);
    if(saved!==null){
      const normalized=normalizeScopedValue(key,saved);
      if(normalized!==saved)rawSet(sk,normalized);
      return normalized;
    }
    if(soleHigherScholar(s)){
      const legacy=rawGet(key);
      if(legacy!==null){
        const normalized=normalizeScopedValue(key,legacy);
        rawSet(sk,normalized);
        return normalized;
      }
    }
    return null;
  }
  Storage.prototype.getItem=function(key){if(this===global.localStorage&&shouldScope(key))return scopedRead(key);return original.getItem.call(this,key)};
  Storage.prototype.setItem=function(key,value){
    if(this===global.localStorage&&shouldScope(key)){
      const sk=scopedKey(key);if(sk)rawSet(sk,normalizeScopedValue(key,String(value)));return;
    }
    return original.setItem.call(this,key,value);
  };
  Storage.prototype.removeItem=function(key){if(this===global.localStorage&&shouldScope(key)){const sk=scopedKey(key);if(sk)original.removeItem.call(this,sk);return}return original.removeItem.call(this,key)};

  function enforceAssessmentMentorIdentity(){
    if(!path.endsWith("/assessment-mentor_index.html"))return;
    const input=document.getElementById("studentName");if(!input)return;
    if(s){input.value=canonicalName();input.readOnly=true;input.setAttribute("aria-readonly","true");input.title="Student identity comes from the Khaemenes Academy Family Registry."}
    else{input.value="";input.disabled=true;input.placeholder="Academy scholar required";input.title="Open Scholar Entry to select the canonical learner."}
  }
  function enforceScienceIdentity(){
    if(mode!=="science")return;
    const input=document.getElementById("studentName");if(!input)return;
    if(s){
      const canonical=canonicalName();
      if(input.value!==canonical){input.value=canonical;input.dispatchEvent(new Event("input",{bubbles:true}))}
      input.readOnly=true;input.setAttribute("aria-readonly","true");input.title="Learner identity comes from the Khaemenes Academy Family Registry.";
    }else{
      input.value="";input.disabled=true;input.placeholder="Academy scholar required";input.title="Use Scholar Entry to select the canonical Higher Learning learner before creating completion records.";
      ["seniorName","associateName"].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent="Academy scholar required"});
    }
  }
  function enforceCodingIdentity(){
    if(mode!=="coding")return;
    const canonical=canonicalName();
    if(path.endsWith("/coding-201_index.html")){
      const input=document.getElementById("studentName");
      if(input){
        if(s){
          input.value=canonical;input.readOnly=true;input.setAttribute("aria-readonly","true");input.title="Student identity comes from the Khaemenes Academy Family Registry.";
          const key="coding201_studentName";if(global.localStorage.getItem(key)!==canonical)global.localStorage.setItem(key,canonical);
        }else{
          input.value="";input.disabled=true;input.placeholder="Academy scholar required";input.title="Use Scholar Entry to select the canonical Higher Learning learner.";
        }
      }
    }
    const certName=document.getElementById("certName");
    if(s&&certName&&certName.textContent!==canonical)certName.textContent=canonical;
  }
  function installPromptGuard(){
    const nativePrompt=global.prompt?.bind(global);if(!nativePrompt)return;
    global.prompt=(message,defaultValue)=>{
      const text=String(message||"");
      if(mode==="ged"&&/student\s*name/i.test(text))return s?canonicalName():null;
      if(mode==="coding"&&/(?:student|your)\s+name[^\n]*certificate|name\s+for\s+the\s+certificate/i.test(text))return s?canonicalName():null;
      return nativePrompt(message,defaultValue);
    };
  }
  function enforceGEDCertificateIdentity(){
    if(!path.endsWith("/portal_index.html"))return;
    document.addEventListener("click",event=>{
      const button=event.target?.closest?.('[onclick*="generateCertificate"]');
      if(button&&!s){event.preventDefault();event.stopImmediatePropagation();global.alert("Select or create the canonical Higher Learning scholar through Scholar Entry before generating a certificate.")}
    },true);
  }
  function codingLogicalKeys(){
    if(mode!=="coding"||!s)return [];
    const out=new Set(),prefix=`khaemenes.higher.app:${s.learnerId}:`,len=Number(global.localStorage.length)||0;
    for(let i=0;i<len;i++){
      const raw=original.key.call(global.localStorage,i);if(!raw)continue;
      if(raw.startsWith(prefix)){
        const logical=raw.slice(prefix.length);if(shouldScope(logical))out.add(logical);
      }else if(soleHigherScholar(s)&&shouldScope(raw))out.add(raw);
    }
    return [...out].sort();
  }
  function installCoding201ExportCompatibility(){
    if(mode!=="coding"||!path.endsWith("/coding-201_index.html")||typeof global.exportProgress!=="function")return;
    global.exportProgress=function(){
      if(!s){global.alert("Select the canonical Higher Learning scholar through Scholar Entry before exporting progress.");return}
      const data={};
      codingLogicalKeys().filter(k=>k.startsWith("coding201_")).forEach(k=>{const v=global.localStorage.getItem(k);if(v!==null)data[k]=v});
      const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
      const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="coding201_progress.json";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
    };
  }
  function guardCodingCertificate(){
    if(mode!=="coding")return;
    const cert=document.getElementById("certificate"),nameEl=document.getElementById("certName");if(!cert&&!nameEl)return;
    let warned=false;
    const enforce=()=>{
      if(s&&nameEl){const canonical=canonicalName();if(nameEl.textContent!==canonical)nameEl.textContent=canonical}
      if(!s&&cert&&!cert.classList.contains("hidden")){
        cert.classList.add("hidden");
        if(!warned){warned=true;setTimeout(()=>global.alert("Select the canonical Higher Learning scholar through Scholar Entry before generating a certificate."),0)}
      }
    };
    enforce();
    if(cert)new MutationObserver(enforce).observe(cert,{attributes:true,subtree:true,childList:true,characterData:true});
    document.addEventListener("click",event=>{
      if(s)return;
      const control=event.target?.closest?.("button,a");if(!control)return;
      if(/certificate/i.test(control.textContent||"")){event.preventDefault();event.stopImmediatePropagation();global.alert("Select the canonical Higher Learning scholar through Scholar Entry before generating a certificate.")}
    },true);
  }
  function applyIdentity(){enforceAssessmentMentorIdentity();enforceScienceIdentity();enforceCodingIdentity();guardCodingCertificate();installCoding201ExportCompatibility()}
  installPromptGuard();
  enforceGEDCertificateIdentity();
  document.addEventListener("DOMContentLoaded",applyIdentity,{once:true});
  document.addEventListener("click",event=>{
    if(path.endsWith("/assessment-mentor_index.html")&&event.target?.closest?.("#clearFormBtn"))setTimeout(applyIdentity,0);
    if(mode==="coding"&&path.endsWith("/coding-201_index.html")&&event.target?.closest?.('[onclick*="saveStudentName"]')&&!s){event.preventDefault();event.stopImmediatePropagation();global.alert("Use Scholar Entry to select the canonical Higher Learning learner before saving course identity.")}
  },true);
  global.addEventListener("khaemenes-family-changed",()=>global.location.reload());
  global.KhaemenesHigherAppScope=Object.freeze({version:VERSION,mode,currentScholar:()=>s,policy:Object.freeze({identityAuthority:"academy-family-registry",legacyKeysPreserved:true,legacyMigration:"only-when-sole-higher-scholar",learnerScopedStorage:true,noScholarPersistence:"fail-closed",canonicalCertificateIdentity:true,masterDirectoryNamesStable:true})});
})(window);
