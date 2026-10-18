/* Khaemenes Higher Learning — federated directory + career learning bridge.
   No telemetry, external libraries, direct enrollment or assessment mutation. */
(() => {
  "use strict";
  const $=id=>document.getElementById(id);
  const DATA_URL="./catalog.json", MAP_URL="./career-map.json";
  const ASSESSMENT_KEY="khaeCareerAssessmentBundle_v1";
  const SHORTLIST_KEY="khaemenes.higher.directory.shortlist.v1";
  const LABEL={instructional:"Instructional portal",pathway:"Hall course pathway",outline:"Catalog outline",bridge:"Foundation bridge",resource:"Research / resource hall"};
  const STATUS_ORDER={instructional:0,pathway:1,bridge:2,outline:3,resource:4};
  let entries=[], careerPaths=[], learner=null, bundle=null, chosenPath="", view="all", limit=24;
  let shortlist=[], ready=false;
  const rememberedView=new URLSearchParams(location.search).get("view")==="career"?"career":"all";
  const safeStr=value=>typeof value==="string"?value:"";
  function make(tag,cls,text){
    const n=document.createElement(tag);
    if(cls)n.className=cls;
    if(text!==undefined)n.textContent=String(text);
    return n;
  }
  function safeLink(href){
    try {
      const url=new URL(href,location.href);
      return url.protocol==="https:"&&["vervenveda.com","github.com"].includes(url.hostname)?url.href:null;
    }catch{return null;}
  }
  function addLink(host,href,label,primary=false){
    const url=safeLink(href);if(!url)return;
    const a=make("a",primary?"primary":"",label);
    a.href=url;a.target="_blank";a.rel="noopener noreferrer";host.appendChild(a);
  }
  function rawJSON(key){
    try {const value=localStorage.getItem(key);return value?JSON.parse(value):null;}
    catch{return null;}
  }
  function getLearner(){
    try {
      const R=window.KhaemenesFamilyRegistry;if(!R)return null;
      const ids=R.activeIds?.()||{};
      const adult=R.getAdult?.(ids.adultId)||null;
      let who=R.getLearner?.(ids.learnerId)||null;
      if(!who&&adult)who=R.getAdultLearner?.(adult.adultId)||null;
      const stage=R.normalizeStage?R.normalizeStage(who?.stage):who?.stage;
      if(stage!=="higher"||!who||typeof who.learnerId!=="string"||!who.learnerId)return null;
      return {learnerId:who.learnerId,displayName:safeStr(who.nickname||who.displayName||who.name||"Scholar").slice(0,80)};
    }catch{return null;}
  }
  function storageKey(){
    return learner?`khaemenes.higher.app:${learner.learnerId}:${ASSESSMENT_KEY}`:null;
  }
  function shortlistKey(){
    return learner?`${SHORTLIST_KEY}:${learner.learnerId}`:null;
  }
  function loadShortlist(){
    const key=shortlistKey(),value=key?rawJSON(key):null;
    shortlist=Array.isArray(value)?[...new Set(value.filter(x=>typeof x==="string"))].slice(0,200):[];
  }
  function saveShortlist(){
    const key=shortlistKey();if(!key)return false;
    try{localStorage.setItem(key,JSON.stringify(shortlist));return true;}
    catch{$("directoryMessage").textContent="Could not save this shortlist. Check browser storage settings.";return false;}
  }
  function loadBundle(){
    bundle=null;
    const key=storageKey();
    const data=key?rawJSON(key):null;
    // Career Assessment v2 writes this record only after finishing the 300-item instrument.
    // Never read unscoped/guest data; never infer results from partial answers.
    if(data?.schemaVersion!==2||!Array.isArray(data.pathways)||!data.pathways.length)return;
    if(data.engine?.name!=="Khaemenes Career Assessment Optimizer")return;
    if(!data.responses||Object.keys(data.responses).length!==300)return;
    const allowed=new Set(careerPaths.map(p=>p.code));
    const paths=data.pathways.filter(p=>p&&allowed.has(p.code)&&Number.isFinite(Number(p.scorePercent)));
    if(!paths.length)return;
    bundle={pathways:paths.slice().sort((a,b)=>Number(b.scorePercent)-Number(a.scorePercent)),generatedAt:safeStr(data.generatedAt),flat:data.profileDifferentiation?.flat===true};
  }
  function showProfile(){
    const p=$("profileStatus"),c=$("careerStatus"),d=$("directoryMessage");
    p.replaceChildren();
    if(!learner){
      p.textContent="Guest browsing · select an active Higher Learning scholar to use saved career results or a persistent shortlist.";
      c.textContent="Browse every subject freely. Select a scholar and finish the Career Assessment for personal exploration suggestions.";
      d.textContent="Course saving is available to a selected Higher Learning scholar. Guest browsing does not create student records.";
    }else{
      p.textContent="Active scholar: "+(learner.displayName||"Higher Learning scholar");
      if(bundle){
        const top=bundle.pathways.slice(0,3).map(x=>safeStr(x.name)).join(" · ");
        c.textContent="Your assessment's leading interest areas: "+top+". "+(bundle.flat?"Your interests are broadly spread; explore widely.":"Compare subjects freely; this does not measure course readiness.");
        d.textContent="Your shortlist stays in this scholar's local browser record. No enrollment or grades are changed.";
      }else{
        c.textContent="No completed Optimized v2 assessment found for this scholar in this browser. Take or finish the assessment to see suggested subjects, or choose an interest area manually.";
        d.textContent="Shortlist saved for the active scholar in this browser. Learning records remain in the owning source hub.";
      }
    }
    $("savedBtn").textContent="My shortlist ("+shortlist.length+")";
  }
  function selectedCareers(){
    if(chosenPath){const p=careerPaths.find(x=>x.code===chosenPath);return p?[{code:p.code,name:p.name}]:[];}
    return bundle?.pathways.slice(0,3)||[];
  }
  function matchInfo(item){
    const matches=[];
    for(const [i,p] of selectedCareers().entries()){
      const mapping=careerPaths.find(x=>x.code===p.code);
      if(mapping?.schools.includes(item.school))matches.push({rank:i,code:p.code,name:mapping.name});
    }
    return matches;
  }
  function populateSelects(){
    const school=$("school");school.replaceChildren(new Option("All schools",""));
    [...new Set(entries.map(x=>x.school))].sort().forEach(name=>school.add(new Option(name,name)));
    const select=$("careerPath");select.replaceChildren(new Option(bundle?"Use my top three assessment interests":"Choose an interest area",""));
    careerPaths.forEach(p=>select.add(new Option(p.name,p.code)));
  }
  function levelMatches(level,filter){
    if(!filter)return true;
    const s=safeStr(level).toLowerCase();
    if(filter==="foundation")return /foundation|introductory|bridge/.test(s);
    if(filter==="undergraduate")return /undergraduate/.test(s);
    if(filter==="advanced")return /advanced|graduate|research/.test(s);
    if(filter==="professional")return /professional|applied/.test(s);
    return true;
  }
  function createCard(item,matches){
    const box=make("article","course");
    box.appendChild(make("span","flag "+item.status,LABEL[item.status]||item.status));
    if(view==="career"&&matches.length){
      const why=make("div","matchline","Interest connection: "+matches.map(m=>m.name).join(" · "));
      box.appendChild(why);
    }
    box.appendChild(make("h3","",item.title));
    box.appendChild(make("p","",item.school));
    box.appendChild(make("div","meta",[item.level,item.kind,item.duration].filter(Boolean).join(" · ")));
    const summary=make("p","",item.notes||"Further academic and technical QA pending.");
    summary.style.marginTop="11px";box.appendChild(summary);
    box.appendChild(make("div","meta","Source: "+item.sourceRepo));
    const links=make("div","links");
    addLink(links,item.sourceUrl,item.status==="outline"?"Visit owning Hall":"Explore source",true);
    addLink(links,item.catalogUrl,"View outline");
    box.appendChild(links);
    const row=make("div","savebar");
    const btn=make("button","savebtn",shortlist.includes(item.id)?"Saved ✓":"Save to shortlist");
    btn.type="button";
    btn.disabled=!learner;
    btn.title=learner?"Save or remove this course from your scholar's local shortlist":"Choose a Higher Learning scholar to save courses";
    btn.setAttribute("aria-pressed",String(shortlist.includes(item.id)));
    btn.addEventListener("click",()=>{
      if(!learner)return;
      const before=shortlist.slice();
      if(shortlist.includes(item.id))shortlist=shortlist.filter(id=>id!==item.id);
      else shortlist=[...shortlist,item.id].slice(0,200);
      if(!saveShortlist()){shortlist=before;return;}
      showProfile();draw();
    });
    row.appendChild(btn);box.appendChild(row);
    return box;
  }
  function draw(){
    if(!ready)return;
    const query=$("search").value.trim().toLocaleLowerCase(),school=$("school").value,status=$("status").value,level=$("level").value;
    let shown=entries.map(item=>({item,matches:matchInfo(item)})).filter(({item,matches})=>{
      if(view==="career"&&!matches.length)return false;
      if(view==="saved"&&!shortlist.includes(item.id))return false;
      if(school&&school!==item.school)return false;
      if(status&&status!==item.status)return false;
      if(level&&!levelMatches(item.level,level))return false;
      return !query||[item.title,item.school,item.subject,item.kind,item.sourceRepo,item.notes].join(" ").toLocaleLowerCase().includes(query);
    });
    if(view==="career")shown.sort((a,b)=>{
      const ar=Math.min(...a.matches.map(m=>m.rank)),br=Math.min(...b.matches.map(m=>m.rank));
      return ar-br||(STATUS_ORDER[a.item.status]??9)-(STATUS_ORDER[b.item.status]??9)||a.item.school.localeCompare(b.item.school)||a.item.title.localeCompare(b.item.title);
    });
    else shown.sort((a,b)=>a.item.school.localeCompare(b.item.school)||a.item.title.localeCompare(b.item.title));
    const host=$("results");host.replaceChildren();
    for(const obj of shown.slice(0,limit))host.appendChild(createCard(obj.item,obj.matches));
    if(!shown.length)host.appendChild(make("div","empty",view==="career"&&!selectedCareers().length?"Finish the Career Assessment or select an interest area to view connected courses.":"No matching entries. Try adjusting your filters."));
    $("filteredCount").textContent=shown.length+" of "+entries.length+" entries in this view";
    $("more").hidden=limit>=shown.length;
    $("more").textContent="Show more results ("+Math.max(0,shown.length-limit)+" remaining)";
    for(const [button,state] of [["allBtn","all"],["careerBtn","career"],["savedBtn","saved"]]){
      $(""+button).setAttribute("aria-pressed",String(view===state));
    }
    const h=$("viewHeading");
    h.textContent=view==="career"?"Courses connected to career interests":view==="saved"?"My course shortlist":"Discovered programs and pathways";
  }
  function setView(next){
    view=next;limit=24;
    if(view==="career"&&!selectedCareers().length){
      $("directoryMessage").textContent="Complete the Career Assessment, or select any interest area from the selector. You can still browse all courses.";
    }else showProfile();
    draw();
  }
  async function initialize(){
    let catalog, map;
    try{
      const res=await Promise.all([fetch(DATA_URL,{cache:"no-store"}),fetch(MAP_URL,{cache:"no-store"})]);
      if(res.some(r=>!r.ok))throw Error("Could not load course data");
      [catalog,map]=await Promise.all(res.map(r=>r.json()));
      if(!Array.isArray(catalog.entries)||!Array.isArray(map.pathways))throw Error("Invalid course data");
    }catch(error){
      console.error("Higher Learning directory unavailable",error);
      $("filteredCount").textContent="Directory data is unavailable.";
      $("results").appendChild(make("p","empty","The course catalog could not be loaded. Return to Higher Learning campus or open the verified source records."));
      return;
    }
    entries=catalog.entries.filter(x=>x&&typeof x.id==="string"&&typeof x.title==="string");
    careerPaths=map.pathways.filter(x=>x&&typeof x.code==="string"&&typeof x.name==="string"&&Array.isArray(x.schools));
    learner=getLearner();
    loadShortlist();loadBundle();populateSelects();showProfile();
    $("totalCount").textContent=entries.length;
    $("instructionalCount").textContent=entries.filter(x=>x.status==="instructional").length;
    $("pathwayCount").textContent=entries.filter(x=>x.status==="pathway").length;
    $("outlineCount").textContent=entries.filter(x=>x.status==="outline").length;
    $("dateLine").textContent="Source inventory · "+safeStr(catalog.inventoryDate);
    for(const id of ["search","school","status","level"]){
      $(id).addEventListener(id==="search"?"input":"change",()=>{limit=24;draw()});
    }
    $("careerPath").addEventListener("change",()=>{chosenPath=$("careerPath").value;setView("career")});
    $("allBtn").addEventListener("click",()=>setView("all"));
    $("careerBtn").addEventListener("click",()=>setView("career"));
    $("savedBtn").addEventListener("click",()=>setView("saved"));
    $("clear").addEventListener("click",()=>{
      for(const id of ["search","school","status","level"])$(id).value="";
      $("careerPath").value="";chosenPath="";setView("all");
    });
    $("more").addEventListener("click",()=>{limit+=24;draw()});
    window.addEventListener("khaemenes-family-changed",()=>location.reload());
    // A profile selected in a different tab should not leave another learner's cards visible.
    window.addEventListener("storage",e=>{
      if(e.key&&(/khaemenes.*family|khaemenes.*active/i.test(e.key)))location.reload();
      else if(learner&&e.key===shortlistKey()){loadShortlist();showProfile();draw();}
      else if(learner&&e.key===storageKey()){loadBundle();populateSelects();showProfile();draw();}
    });
    ready=true;
    setView(rememberedView==="career"&&bundle?"career":"all");
  }
  initialize();
})();
