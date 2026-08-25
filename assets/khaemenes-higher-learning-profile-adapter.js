(function attachKhaemenesHigherLearningProfileAdapter(global){
  "use strict";

  const VERSION="1.0.0";
  const EXPECTED_STAGE="higher";
  const LEGACY_PROFILE_KEY="khaemenes-higher-learning-profile-v1";
  const PINNED_KEY="khaemenes-higher-learning-pinned-courses-v1";
  const PREFERENCE_PREFIX="khaemenes.higher.preferences:";
  const SCHOLAR_ENTRY_URL="./start/";
  const FAMILY_URL="https://vervenveda.com/Khaemenes_Academy.github.io/family/";
  const COURSE_MAP=Object.freeze({
    "calculus-ii":Object.freeze({title:"Calculus II",url:"./courses/calculus-ii/index.html"}),
    "linear-algebra":Object.freeze({title:"Linear Algebra",url:"./courses/linear-algebra/index.html"}),
    "differential-equations":Object.freeze({title:"Differential Equations",url:"./courses/differential-equations/index.html"}),
    "statistics":Object.freeze({title:"Statistics",url:"./courses/statistics/index.html"}),
    "discrete-mathematics":Object.freeze({title:"Discrete Mathematics",url:"./courses/discrete-mathematics/index.html"}),
    "introduction-to-proofs":Object.freeze({title:"Introduction to Proofs",url:"./courses/introduction-to-proofs/index.html"}),
    "real-complex-analysis":Object.freeze({title:"Real & Complex Analysis",url:"./courses/real-complex-analysis/index.html"}),
    "abstract-algebra":Object.freeze({title:"Abstract Algebra",url:"./courses/abstract-algebra/index.html"}),
    "topology-differential-geometry":Object.freeze({title:"Topology & Differential Geometry",url:"./courses/topology-differential-geometry/index.html"})
  });

  function registry(){return global.KhaemenesFamilyRegistry||null}
  function clean(value,max=120){return String(value??"").replace(/[\u0000-\u001f\u007f]/g,"").trim().slice(0,max)}
  function escapeHTML(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c])}
  function readJSON(key,fallback=null){try{const raw=global.localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
  function writeJSON(key,value){try{global.localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
  function normalizeLevel(value){const allowed=["Undergraduate","Advanced Study","Graduate-Preparatory / Research","Independent Research","Continuing / Professional"];const aliases={"Advanced Undergraduate":"Advanced Study","Graduate-Preparatory":"Graduate-Preparatory / Research","Professional / Lifelong Study":"Continuing / Professional"};const normalized=aliases[value]||value;return allowed.includes(normalized)?normalized:"Undergraduate"}
  function normalizeTerm(value){const allowed=["Current Term","Fall","Spring","Summer","Independent Study"];return allowed.includes(value)?value:"Current Term"}
  function navigate(url){try{global.location.assign(url)}catch{global.location.href=url}}

  function currentScholar(){
    const R=registry();
    if(!R)return null;
    const ids=R.activeIds?.()||{};
    const adult=R.getAdult?.(ids.adultId)||null;
    let learner=R.getLearner?.(ids.learnerId)||null;
    if(!learner&&adult)learner=R.getAdultLearner?.(adult.adultId)||null;
    const stage=R.normalizeStage?R.normalizeStage(learner?.stage):learner?.stage;
    return stage===EXPECTED_STAGE?learner:null;
  }

  function preferenceKey(learnerId){return learnerId?`${PREFERENCE_PREFIX}${learnerId}`:null}
  function defaultPreferences(){return {version:1,level:"Undergraduate",field:"Undeclared / Interdisciplinary",term:"Current Term",source:"higher-learning-preferences",updatedAt:new Date().toISOString()}}
  function preferencesFor(scholar){
    if(!scholar?.learnerId)return null;
    const key=preferenceKey(scholar.learnerId);
    const existing=readJSON(key,null);
    if(existing&&typeof existing==="object")return {...defaultPreferences(),...existing,level:normalizeLevel(existing.level),field:clean(existing.field||existing.focus||"Undeclared / Interdisciplinary",80)||"Undeclared / Interdisciplinary",term:normalizeTerm(existing.term)};

    const legacy=readJSON(LEGACY_PROFILE_KEY,null);
    const migrated={
      ...defaultPreferences(),
      level:normalizeLevel(legacy?.level),
      field:clean(legacy?.field||legacy?.focus||"Undeclared / Interdisciplinary",80)||"Undeclared / Interdisciplinary",
      term:normalizeTerm(legacy?.term),
      source:legacy?"legacy-profile-preferences-only":"higher-learning-preferences",
      legacyIdentityImported:false,
      migratedAt:legacy?new Date().toISOString():null
    };
    writeJSON(key,migrated);
    return migrated;
  }

  function pinnedIds(){const raw=readJSON(PINNED_KEY,[]);return Array.isArray(raw)?raw.filter(id=>COURSE_MAP[id]):[]}
  function pinMarkup(){
    const ids=pinnedIds();
    if(!ids.length)return '<div class="pinned-list"><span>No Higher Learning courses are pinned yet.</span></div>';
    return `<div class="pinned-list">${ids.map(id=>`<span class="pinned-chip"><a href="${COURSE_MAP[id].url}">${escapeHTML(COURSE_MAP[id].title)}</a><button type="button" data-remove-pin="${id}" aria-label="Remove ${escapeHTML(COURSE_MAP[id].title)} from pinned courses">×</button></span>`).join("")}</div>`;
  }

  function updateCopy(scholar){
    const section=document.getElementById("student-portal");
    const headingCopy=section?.querySelector(".heading p:last-child");
    const card=document.getElementById("profileForm")?.closest(".portal-card");
    const cardCopy=card?.querySelector(":scope > p");
    const note=card?.querySelector(".portal-note");
    if(headingCopy)headingCopy.textContent="Use the Academy learner identity already selected for Higher Learning, then keep study level, field, term, and pinned courses as learner-scoped preferences on this device.";
    if(cardCopy)cardCopy.textContent="Your Academy learner name remains the identity authority here. Study level, primary field, term, and course pins are local Higher Learning preferences—not a second account.";
    if(note)note.textContent=scholar?"The Khaemenes Academy Family Registry remains the learner identity authority. This campus stores only learner-scoped Higher Learning preferences and course pins.":"No Higher Learning account is created on this page. Use Scholar Entry or the Academy Family Profile to create or select the canonical learner record.";
  }

  function render(){
    const form=document.getElementById("profileForm");
    const name=document.getElementById("studentName");
    const level=document.getElementById("studentLevel");
    const field=document.getElementById("studentField");
    const term=document.getElementById("studentTerm");
    const summary=document.getElementById("profileSummary");
    const submit=form?.querySelector('button[type="submit"]');
    if(!form||!name||!level||!field||!term||!summary||!submit)return false;

    const scholar=currentScholar();
    name.readOnly=true;
    name.setAttribute("aria-readonly","true");
    updateCopy(scholar);

    if(!scholar){
      name.value="";
      name.placeholder="Academy learner required";
      level.disabled=true;field.disabled=true;term.disabled=true;
      submit.textContent="Open Scholar Entry";
      summary.innerHTML=`<strong>Academy learner identity required.</strong> This landing page cannot create a separate Higher Learning account. Select or create the canonical learner through Scholar Entry or the Academy Family Profile.${pinMarkup()}`;
    }else{
      const prefs=preferencesFor(scholar)||defaultPreferences();
      name.value=clean(scholar.nickname||"Scholar",60)||"Scholar";
      level.disabled=false;field.disabled=false;term.disabled=false;
      level.value=normalizeLevel(prefs.level);
      field.value=clean(prefs.field,80)||"Undeclared / Interdisciplinary";
      term.value=normalizeTerm(prefs.term);
      submit.textContent="Save Study Preferences";
      summary.innerHTML=`<strong>${escapeHTML(name.value)}</strong> · ${escapeHTML(level.value)} · ${escapeHTML(field.value||"Undeclared / Interdisciplinary")} · ${escapeHTML(term.value)}${pinMarkup()}`;
    }

    const clear=document.getElementById("clearProfileButton");
    if(clear)clear.textContent="Clear Study Preferences";
    const exportButton=document.getElementById("exportProfileButton");
    if(exportButton)exportButton.textContent="Export Scholar Preferences";
    return true;
  }

  function savePreferences(){
    const scholar=currentScholar();
    if(!scholar){navigate(SCHOLAR_ENTRY_URL);return}
    const level=document.getElementById("studentLevel")?.value;
    const field=document.getElementById("studentField")?.value;
    const term=document.getElementById("studentTerm")?.value;
    writeJSON(preferenceKey(scholar.learnerId),{
      version:1,
      level:normalizeLevel(level),
      field:clean(field,80)||"Undeclared / Interdisciplinary",
      term:normalizeTerm(term),
      source:"higher-learning-preferences",
      legacyIdentityImported:false,
      updatedAt:new Date().toISOString()
    });
    render();
    global.dispatchEvent(new CustomEvent("khaemenes-higher-learning-preferences-changed",{detail:{learnerId:scholar.learnerId}}));
  }

  function clearPreferences(){
    const scholar=currentScholar();
    if(!scholar){navigate(SCHOLAR_ENTRY_URL);return}
    writeJSON(preferenceKey(scholar.learnerId),{...defaultPreferences(),source:"cleared-by-learner",legacyIdentityImported:false});
    render();
  }

  function exportPreferences(){
    const scholar=currentScholar();
    if(!scholar){navigate(SCHOLAR_ENTRY_URL);return}
    const payload={
      format:"khaemenes-higher-learning-scholar-preferences-v1",
      exportedAt:new Date().toISOString(),
      campus:"Khaemenes Higher Learning",
      learner:{learnerId:scholar.learnerId,nickname:scholar.nickname||"Scholar",stage:"higher",mentorId:"archaemenes"},
      preferences:preferencesFor(scholar),
      pinnedCourses:pinnedIds().map(id=>({id,title:COURSE_MAP[id].title,url:COURSE_MAP[id].url})),
      authority:{identity:"Khaemenes Academy Family Registry",placement:"Academy / responsible faculty",preferences:"learner-local"}
    };
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download="khaemenes-higher-learning-scholar-preferences.json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  function bind(){
    if(document.documentElement.dataset.khaemenesHigherProfileAuthority==="1")return;
    document.documentElement.dataset.khaemenesHigherProfileAuthority="1";

    document.addEventListener("submit",event=>{
      if(event.target?.id!=="profileForm")return;
      event.preventDefault();event.stopImmediatePropagation();savePreferences();
    },true);

    document.addEventListener("click",event=>{
      const target=event.target;
      if(!target?.closest)return;
      if(target.closest("#clearProfileButton")){event.preventDefault();event.stopImmediatePropagation();clearPreferences();return}
      if(target.closest("#exportProfileButton")){event.preventDefault();event.stopImmediatePropagation();exportPreferences();return}
      if(target.closest("[data-remove-pin]"))setTimeout(render,0);
    },true);

    global.addEventListener("khaemenes-family-changed",()=>setTimeout(render,0));
    global.addEventListener("khaemenes-learner-placement-changed",()=>setTimeout(render,0));
    global.addEventListener("storage",event=>{if(event.key===PINNED_KEY||event.key===LEGACY_PROFILE_KEY||event.key?.startsWith(PREFERENCE_PREFIX))setTimeout(render,0)});
    setTimeout(render,0);
    global.addEventListener("load",render,{once:true});
  }

  global.KhaemenesHigherLearningProfileAdapter=Object.freeze({
    version:VERSION,
    identityAuthority:"academy-family-registry",
    expectedStage:EXPECTED_STAGE,
    legacyProfileKey:LEGACY_PROFILE_KEY,
    preferencePrefix:PREFERENCE_PREFIX,
    scholarEntryUrl:SCHOLAR_ENTRY_URL,
    familyUrl:FAMILY_URL,
    currentScholar,
    preferencesFor,
    render,
    bind,
    policy:Object.freeze({duplicateAccountCreation:false,legacyIdentityImported:false,masterDirectoryNamesUnchanged:true,landingStructureUnchanged:true,landingStylesUnchanged:true})
  });

  bind();
})(window);
