(()=>{
  "use strict";
  const script=document.currentScript;
  const core=script?.dataset?.core;
  const scope=script?.dataset?.scope;
  if(!core||!scope)return;

  const pageBase=document.baseURI||location.href;
  const coreURL=new URL(core,pageBase).href;
  const scopeURL=new URL(scope,pageBase).href;
  const manifestURL=script.dataset.manifest?new URL(script.dataset.manifest,pageBase).href:null;
  const swURL=script.dataset.sw?new URL(script.dataset.sw,pageBase).href:null;
  const registryURL="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-family-registry.js";
  const fallbackURL=new URL(script.dataset.registryFallback||"assets/khaemenes-family-registry-fallback.js",pageBase).href;
  const CACHE="khaemenes-higher-core-loader-v2";

  async function cachePut(url,response){
    if(!("caches" in window)||!response?.ok)return;
    try{const cache=await caches.open(CACHE);await cache.put(url,response.clone())}catch{}
  }
  async function textNetworkThenCache(url,options={}){
    try{
      const response=await fetch(url,{cache:"no-store",credentials:"same-origin",...options});
      if(!response.ok)throw new Error(`${url} ${response.status}`);
      await cachePut(url,response);
      return await response.text();
    }catch(networkError){
      if("caches" in window){
        try{const cached=await caches.match(url);if(cached)return await cached.text()}catch{}
      }
      throw networkError;
    }
  }
  async function registryText(){
    try{return await textNetworkThenCache(registryURL,{mode:"same-origin"})}
    catch{return await textNetworkThenCache(fallbackURL)}
  }
  function safeInline(code){return String(code||"").replace(/<\/script/gi,"<\\/script")}
  function showFallback(error){
    console.error("Khaemenes protected page core could not load.",error);
    const fallback=document.getElementById("coreFallback");
    if(fallback){
      fallback.hidden=false;
      const status=fallback.querySelector("[data-core-status]");
      if(status)status.textContent="The full campus interface could not load from either the network or its offline cache. Core navigation remains available below.";
      return;
    }
    document.body.innerHTML='<main style="max-width:720px;margin:12vh auto;padding:24px;font-family:system-ui;text-align:center"><h1>Page unavailable</h1><p>The protected application could not be initialized. No local learner record was created.</p></main>';
  }

  if(swURL&&"serviceWorker" in navigator){
    addEventListener("load",()=>navigator.serviceWorker.register(swURL,{updateViaCache:"none"}).then(r=>r.update()).catch(()=>{}),{once:true});
  }

  Promise.all([textNetworkThenCache(coreURL),registryText()]).then(([html,registryCode])=>{
    const manifest=manifestURL?`<link rel="manifest" href="${manifestURL}">`:"";
    const injection=`${manifest}<script>${safeInline(registryCode)}<\/script><script src="${scopeURL}"><\/script><script src="https://vervenveda.com/assets/vnv-ecosystem-toolbar.js"><\/script>`;
    html=/<head(?:\s[^>]*)?>/i.test(html)
      ? html.replace(/<head(?:\s[^>]*)?>/i,m=>m+injection)
      : injection+html;
    document.open();document.write(html);document.close();
  }).catch(showFallback);
})();