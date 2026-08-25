(() => {
  "use strict";

  const FAMILY_REGISTRY="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-family-registry.js";
  const PROFILE_ADAPTER="./assets/khaemenes-higher-learning-profile-adapter.js";
  const NETWORK_CORE="./data/university-network-core.js";

  function guardLegacyProfileDoorway(event){
    if(window.KhaemenesHigherLearningProfileAdapter)return;
    const target=event.target;
    if(event.type==="submit"&&target?.id==="profileForm"){
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if(event.type==="click"&&target?.closest?.("#clearProfileButton,#exportProfileButton")){
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  document.addEventListener("submit",guardLegacyProfileDoorway,true);
  document.addEventListener("click",guardLegacyProfileDoorway,true);

  function loadScript(src,marker){
    return new Promise((resolve,reject)=>{
      const existing=document.querySelector(`script[data-${marker}],script[src="${src}"]`);
      if(existing){
        if(existing.dataset.loaded==="1"||existing.readyState==="complete")return resolve(existing);
        existing.addEventListener("load",()=>resolve(existing),{once:true});
        existing.addEventListener("error",()=>reject(new Error(`Unable to load ${src}`)),{once:true});
        return;
      }
      const script=document.createElement("script");
      script.src=src;
      script.async=false;
      script.dataset[marker.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]="1";
      script.addEventListener("load",()=>{script.dataset.loaded="1";resolve(script)},{once:true});
      script.addEventListener("error",()=>reject(new Error(`Unable to load ${src}`)),{once:true});
      document.head.appendChild(script);
    });
  }

  function failClosed(){
    const form=document.getElementById("profileForm");
    const name=document.getElementById("studentName");
    const level=document.getElementById("studentLevel");
    const field=document.getElementById("studentField");
    const term=document.getElementById("studentTerm");
    const summary=document.getElementById("profileSummary");
    const submit=form?.querySelector('button[type="submit"]');
    if(name){name.readOnly=true;name.value="";name.placeholder="Academy learner required"}
    if(level)level.disabled=true;
    if(field)field.disabled=true;
    if(term)term.disabled=true;
    if(submit){submit.type="button";submit.textContent="Open Scholar Entry";submit.onclick=()=>location.assign("./start/")}
    if(summary)summary.innerHTML="<strong>Academy learner identity required.</strong> The canonical Family Registry could not be loaded, so this page has disabled local profile creation rather than creating a duplicate account.";
  }

  async function boot(){
    try{
      if(!window.KhaemenesFamilyRegistry)await loadScript(FAMILY_REGISTRY,"khaemenes-family-registry");
      if(!window.KhaemenesHigherLearningProfileAdapter)await loadScript(PROFILE_ADAPTER,"khaemenes-higher-profile-adapter");
      window.KhaemenesHigherLearningProfileAdapter?.render?.();
    }catch(error){
      console.error("Higher Learning identity authority failed closed.",error);
      failClosed();
    }

    try{
      await loadScript(NETWORK_CORE,"khaemenes-university-network-core");
    }catch(error){
      console.error("Higher Learning university network extension could not load.",error);
    }
  }

  boot();
})();
