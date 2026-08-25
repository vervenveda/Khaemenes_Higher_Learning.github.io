(()=>{
  "use strict";
  const script=document.currentScript;
  const core=script?.dataset?.core;
  const scope=script?.dataset?.scope;
  const registry="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-family-registry.js";
  if(!core||!scope)return;
  const pageBase=document.baseURI||location.href;
  const coreURL=new URL(core,pageBase).href;
  const scopeURL=new URL(scope,pageBase).href;
  fetch(coreURL,{cache:"no-store",credentials:"same-origin"}).then(r=>{if(!r.ok)throw new Error(`core ${r.status}`);return r.text()}).then(html=>{
    const injection=`<script src="${registry}"><\/script><script src="${scopeURL}"><\/script>`;
    html=/<head(?:\s[^>]*)?>/i.test(html)?html.replace(/<head(?:\s[^>]*)?>/i,m=>m+injection):injection+html;
    document.open();document.write(html);document.close();
  }).catch(error=>{
    console.error("Khaemenes protected page core could not load.",error);
    document.body.innerHTML='<main style="max-width:720px;margin:12vh auto;padding:24px;font-family:system-ui;text-align:center"><h1>Page unavailable</h1><p>The protected application could not be initialized. No local learner record was created.</p></main>';
  });
})();
