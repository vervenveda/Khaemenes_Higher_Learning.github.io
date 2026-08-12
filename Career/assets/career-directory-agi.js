(() => {
  "use strict";

  const VERSION = "2.0.0";
  const SCRIPT_URL = document.currentScript?.src || location.href;
  const CAREER_ROOT = new URL("../", SCRIPT_URL);
  const REGISTRY_URL =
    "https://vervenveda.com/assessment-engine/mentor/registry/ecosystem-resources.json";

  const KEYS = Object.freeze({
    notes: "KHAEMENES_CAREER_DIRECTORY_AGI_NOTES_V2",
    state: "KHAEMENES_CAREER_DIRECTORY_AGI_STATE_V2"
  });

  const CORE_TOOLS = Object.freeze([
    {
      id:"career-assessment",
      title:"Career Assessment",
      description:"300-question career assessment with optimized v2 scoring.",
      url:"apps/career-assessment_index.html",
      source:"career-core",
      repository:"vervenveda/Khaemenes_Higher_Learning.github.io",
      category:"Career Discovery",
      domains:["career","assessment"],
      skills:["self-reflection","career-exploration"],
      tags:["career","assessment","core"],
      featured:true,
      local:true
    },
    {
      id:"career-mentor-hub",
      title:"Career Mentor Hub",
      description:"Interpret saved career assessment results and pathway evidence.",
      url:"apps/career-mentor-hub_index.html",
      source:"career-core",
      repository:"vervenveda/Khaemenes_Higher_Learning.github.io",
      category:"Career Discovery",
      domains:["career","mentoring"],
      skills:["reflection","planning"],
      tags:["career","mentor","results","core"],
      featured:true,
      local:true
    },
    {
      id:"career-star",
      title:"Career Star",
      description:"Reflective shortlisting through interest, readiness, and work-values fit.",
      url:"apps/career-star_index.html",
      source:"career-core",
      repository:"vervenveda/Khaemenes_Higher_Learning.github.io",
      category:"Career Discovery",
      domains:["career","reflection"],
      skills:["self-reflection","experimentation"],
      tags:["career","reflection","core"],
      featured:true,
      local:true
    },
    {
      id:"mentor-review",
      title:"Mentor Review",
      description:"Document strengths, growth targets, experiments, and next steps.",
      url:"apps/assessment-mentor_index.html",
      source:"career-core",
      repository:"vervenveda/Khaemenes_Higher_Learning.github.io",
      category:"Career Discovery",
      domains:["career","mentoring"],
      skills:["planning","reflection"],
      tags:["career","mentor","review","core"],
      featured:true,
      local:true
    }
  ]);

  const CATEGORY_RULES = Object.freeze([
    {
      id:"professional-writing",
      label:"Professional Writing & Communication",
      terms:[
        "prose","writing","editorial","editing","editor","communication","resume","cover letter",
        "curriculum vitae","cv","professional bio","letter","memo","report","proposal","press release",
        "newsletter","speech","script","portfolio narrative","interview","job description",
        "case study","annual report","grant","bibliography","research paper","literature review"
      ]
    },
    {
      id:"business",
      label:"Business & Entrepreneurship",
      terms:[
        "business","entrepreneur","enterprise","startup","management","operations","project",
        "strategic plan","implementation plan","program plan","board","nonprofit","sponsorship",
        "fundraising","donor","marketing","sales","customer","commerce","workflow"
      ]
    },
    {
      id:"finance",
      label:"Finance & Quantitative Skills",
      terms:[
        "finance","financial","budget","investment","stock","tax","credit","debit","calculator",
        "numeracy","quantitative","accounting","economics","money","market"
      ]
    },
    {
      id:"technology",
      label:"Technology & Coding",
      terms:[
        "coding","code","programming","developer","software","technology","digital","web","computer",
        "python","javascript","html","css","data","ai","artificial intelligence","network","cyber"
      ]
    },
    {
      id:"engineering-design",
      label:"Engineering & Design",
      terms:[
        "engineering","engineer","cad","design","ohmic","architecture","technical","maker",
        "construction","geometry","drafting","prototype","fabrication","3d"
      ]
    },
    {
      id:"research",
      label:"Research & Information",
      terms:[
        "research","evidence","citation","source","search","plera","library","archive","analysis",
        "fact","verifier","bibliography","information","field lab"
      ]
    },
    {
      id:"creative",
      label:"Art, Media & Creative Careers",
      terms:[
        "art","artist","creative","music","audio","media","studio","video","podcast","gallery",
        "exhibition","design","writing","story","book","film","performance","harmony"
      ]
    },
    {
      id:"health-human",
      label:"Health & Human Services",
      terms:[
        "health","medicine","medical","wellness","care","counsel","social service","community support",
        "human services","nutrition","psychology","therapy","public health"
      ]
    },
    {
      id:"public-law",
      label:"Public Service & Law",
      terms:[
        "law","legal","policy","public service","government","civic","evidence","petition",
        "public records","representative","testimony","community proposal","firmament"
      ]
    },
    {
      id:"education",
      label:"Education & Teaching",
      terms:[
        "education","teaching","teacher","lesson","curriculum","course","syllabus","academy",
        "training","tutor","learning"
      ]
    },
    {
      id:"productivity",
      label:"Productivity & Workplace Skills",
      terms:[
        "productivity","task","daily spark","planning","checklist","meeting","handoff","issue log",
        "change request","incident report","performance review","risk assessment","standard operating",
        "workflow","organize","clean","zip","office"
      ]
    },
    {
      id:"logic-strategy",
      label:"Logic, Strategy & Problem Solving",
      terms:[
        "chess","sudoku","checkers","connect four","sixbysix","six by six","iq","logic","strategy",
        "puzzle","reasoning","trivia","affix","problem solving","simulation","game","arcade"
      ]
    }
  ]);

  const FALLBACK_CATEGORY = Object.freeze({
    id:"other-career",
    label:"Other Career Resources"
  });

  const BLOCKED_CLASSIFICATIONS = new Set([
    "admin-only","restricted","archived","campaign","unclassified"
  ]);

  const CAREER_AUDIENCES = new Set([
    "higher-learning","adult","high","high-school","student","educator","parent"
  ]);

  const normalize = value => String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu," ")
    .trim();

  const unique = arr => [...new Set((arr || []).filter(Boolean))];

  function absoluteUrl(resource){
    const url = String(resource?.url || "");
    if(!url) return "";
    if(/^https?:\/\//i.test(url)) return url;
    return new URL(url, resource?.local ? CAREER_ROOT : location.href).href;
  }

  function combinedText(resource){
    return normalize([
      resource.title,
      resource.description,
      resource.repository,
      resource.classification,
      ...(resource.domains || []),
      ...(resource.skills || []),
      ...(resource.tags || []),
      ...(resource.subjects || []),
      resource.resourceType,
      resource.learningValue,
      resource.sourcePath
    ].filter(Boolean).join(" "));
  }

  function categoryFor(resource){
    if(resource.category) return {id:normalize(resource.category).replace(/\s+/g,"-"), label:resource.category};

    const text = combinedText(resource);
    let best = null;

    for(const rule of CATEGORY_RULES){
      let score = 0;
      for(const term of rule.terms){
        const t = normalize(term);
        if(t && text.includes(t)) score += Math.max(1, t.split(" ").length);
      }
      if(!best || score > best.score) best = {...rule, score};
    }

    return best && best.score > 0
      ? {id:best.id,label:best.label}
      : {...FALLBACK_CATEGORY};
  }

  function categoryScores(resource){
    const text = combinedText(resource);
    return CATEGORY_RULES
      .map(rule => ({
        id:rule.id,
        label:rule.label,
        score:rule.terms.reduce((n,term) => {
          const t = normalize(term);
          return n + (t && text.includes(t) ? Math.max(1,t.split(" ").length) : 0);
        },0)
      }))
      .filter(x=>x.score>0)
      .sort((a,b)=>b.score-a.score || a.label.localeCompare(b.label));
  }

  function audienceAllowed(resource){
    const audiences = Array.isArray(resource.audiences) ? resource.audiences.map(normalize) : [];
    if(!audiences.length) return true;
    return audiences.some(a => CAREER_AUDIENCES.has(a));
  }

  function safeForCareer(resource){
    if(!resource || typeof resource !== "object") return false;
    if(resource.recommendable === false || resource.mentorEligible === false) return false;
    if(BLOCKED_CLASSIFICATIONS.has(normalize(resource.classification))) return false;
    if(!audienceAllowed(resource)) return false;

    const url = absoluteUrl(resource);
    if(!url || !/^https:\/\//i.test(url)) return false;

    // Career portal only auto-presents Verve N Veda ecosystem pages.
    try{
      const host = new URL(url).hostname.toLowerCase();
      const allowed =
        host === "vervenveda.com" ||
        host.endsWith(".vervenveda.com") ||
        host === "vervenveda.github.io" ||
        host.endsWith(".github.io");
      if(!allowed) return false;
    }catch{
      return false;
    }
    return true;
  }

  function canonicalKey(resource){
    const url = absoluteUrl(resource)
      .replace(/^https:\/\/vervenveda\.github\.io\//i,"https://vervenveda.com/")
      .replace(/\/+$/,"");
    return normalize(url);
  }

  function dedupe(resources){
    const byKey = new Map();
    for(const resource of resources){
      const key = canonicalKey(resource);
      if(!key) continue;
      const existing = byKey.get(key);
      if(!existing){
        byKey.set(key,resource);
        continue;
      }
      // Explicit manifest records outrank supplemental file discovery.
      if(existing.local || existing.source === "career-core") continue;
      const existingManifest = Boolean(existing.manifestPath);
      const nextManifest = Boolean(resource.manifestPath);
      if(nextManifest && !existingManifest) byKey.set(key,resource);
    }
    return [...byKey.values()];
  }

  function enrich(resource){
    const cat = categoryFor(resource);
    const scores = categoryScores(resource);
    return {
      ...resource,
      url:absoluteUrl(resource),
      category:cat.label,
      categoryId:cat.id,
      careerCategoryScores:scores,
      aliases:unique([
        ...(resource.aliases || []),
        ...(resource.skills || []),
        ...(resource.tags || []),
        ...(resource.domains || [])
      ]),
      source:resource.discoveryMethod || resource.sourceId || "federation",
      local:false
    };
  }

  async function fetchFederation(){
    const response = await fetch(REGISTRY_URL,{cache:"no-store"});
    if(!response.ok) throw new Error(`Career federation request failed: ${response.status}`);
    const payload = await response.json();
    const rows = Array.isArray(payload.resources) ? payload.resources : [];
    return {
      generatedAt:payload.generatedAt || null,
      sourceLatestRepositoryTimestamp:payload.sourceLatestRepositoryTimestamp || null,
      resources:rows
    };
  }

  function getNotes(){
    try{
      const value = JSON.parse(localStorage.getItem(KEYS.notes) || "[]");
      return Array.isArray(value) ? value : [];
    }catch{return []}
  }

  function setNotes(notes){
    localStorage.setItem(KEYS.notes,JSON.stringify(notes));
  }

  function flatten(categories){
    return categories.flatMap(category =>
      category.items.map(item => ({
        ...item,
        category:category.label,
        categoryId:category.id
      }))
    );
  }

  function matchesResource(resource, term){
    const q = normalize(term);
    if(!q) return true;
    const haystack = normalize([
      resource.title,
      resource.description,
      resource.category,
      resource.repository,
      ...(resource.aliases || []),
      ...(resource.tags || []),
      ...(resource.skills || []),
      ...(resource.domains || [])
    ].join(" "));
    return haystack.includes(q);
  }

  function buildCategories(resources){
    const map = new Map();
    for(const resource of resources){
      const id = resource.categoryId || FALLBACK_CATEGORY.id;
      const label = resource.category || FALLBACK_CATEGORY.label;
      if(!map.has(id)) map.set(id,{id,label,items:[]});
      map.get(id).items.push(resource);
    }
    const preferredOrder = [
      "career-discovery","professional-writing","business","finance","technology",
      "engineering-design","research","creative","health-human","public-law","education",
      "productivity","logic-strategy","other-career"
    ];
    return [...map.values()]
      .map(category => ({
        ...category,
        items:category.items.sort((a,b)=>
          Number(Boolean(b.featured))-Number(Boolean(a.featured)) ||
          String(a.title).localeCompare(String(b.title))
        )
      }))
      .sort((a,b)=>{
        const ai = preferredOrder.indexOf(a.id);
        const bi = preferredOrder.indexOf(b.id);
        const ax = ai < 0 ? 999 : ai;
        const bx = bi < 0 ? 999 : bi;
        return ax-bx || a.label.localeCompare(b.label);
      });
  }

  let snapshot = {
    version:VERSION,
    loadedAt:null,
    generatedAt:null,
    sourceLatestRepositoryTimestamp:null,
    categories:buildCategories(CORE_TOOLS.map(r=>({...r,categoryId:"career-discovery"}))),
    resources:[...CORE_TOOLS],
    error:null
  };

  async function refresh(){
    const core = CORE_TOOLS.map(r=>({...r,categoryId:"career-discovery"}));
    try{
      const federation = await fetchFederation();
      const dynamic = federation.resources
        .filter(safeForCareer)
        .map(enrich);

      const merged = dedupe([...core,...dynamic]);
      snapshot = {
        version:VERSION,
        loadedAt:new Date().toISOString(),
        generatedAt:federation.generatedAt,
        sourceLatestRepositoryTimestamp:federation.sourceLatestRepositoryTimestamp,
        resources:merged,
        categories:buildCategories(merged),
        error:null
      };
    }catch(error){
      snapshot = {
        ...snapshot,
        loadedAt:new Date().toISOString(),
        error:String(error?.message || error)
      };
    }
    window.dispatchEvent(new CustomEvent("career-directory-ready",{detail:summary()}));
    return snapshot;
  }

  function all(){
    return [...snapshot.resources];
  }

  function categories(){
    return snapshot.categories.map(c=>({id:c.id,label:c.label,count:c.items.length}));
  }

  function find(term){
    return all().filter(resource=>matchesResource(resource,term));
  }

  function resolve(name){
    const q = normalize(name);
    if(!q) return null;
    const rows = all();

    const exact = rows.find(r =>
      normalize(r.title) === q ||
      normalize(r.id) === q ||
      (r.aliases || []).some(a=>normalize(a)===q)
    );
    if(exact) return exact;

    const partial = rows
      .map(r=>({
        r,
        score:
          (normalize(r.title).includes(q) ? 5 : 0) +
          ((r.aliases || []).some(a=>normalize(a).includes(q)) ? 3 : 0) +
          (combinedText(r).includes(q) ? 1 : 0)
      }))
      .filter(x=>x.score>0)
      .sort((a,b)=>b.score-a.score || a.r.title.localeCompare(b.r.title));
    return partial[0]?.r || null;
  }

  function validate(){
    const problems = [];
    const ids = new Set();
    const urls = new Set();

    for(const r of all()){
      if(!r.id) problems.push(`Missing ID: ${r.title || "untitled"}`);
      if(ids.has(r.id)) problems.push(`Duplicate ID: ${r.id}`);
      ids.add(r.id);

      if(!r.title) problems.push(`Missing title: ${r.id || "unknown"}`);
      if(!r.url) problems.push(`Missing URL: ${r.id || r.title || "unknown"}`);
      else{
        try{
          const url = new URL(r.url,location.href);
          if(url.protocol !== "https:" && !r.local) problems.push(`Non-HTTPS URL: ${r.url}`);
          const key = canonicalKey(r);
          if(urls.has(key)) problems.push(`Duplicate URL: ${r.url}`);
          urls.add(key);
        }catch{
          problems.push(`Invalid URL: ${r.url}`);
        }
      }
    }
    return problems;
  }

  function summary(){
    const records = all();
    return {
      version:VERSION,
      records:records.length,
      categories:snapshot.categories.length,
      aliases:records.reduce((n,r)=>n+(r.aliases || []).length,0),
      generatedAt:snapshot.generatedAt,
      loadedAt:snapshot.loadedAt,
      sourceLatestRepositoryTimestamp:snapshot.sourceLatestRepositoryTimestamp,
      error:snapshot.error,
      validationIssues:validate().length
    };
  }

  function note(text){
    const clean = String(text || "").trim();
    if(!clean) return false;
    const notes = getNotes();
    notes.push({id:`career-note-${Date.now()}`,createdAt:new Date().toISOString(),text:clean});
    setNotes(notes.slice(-250));
    return true;
  }

  function clearNotes(){
    setNotes([]);
    return true;
  }

  function launch(resourceOrName){
    const resource = typeof resourceOrName === "string"
      ? resolve(resourceOrName)
      : resourceOrName;
    if(!resource) return false;

    window.dispatchEvent(new CustomEvent("career-directory-launch",{detail:{resource}}));
    return true;
  }

  Object.defineProperty(window,"CareerDirectoryAGI",{
    value:Object.freeze({
      version:VERSION,
      refresh,
      all,
      categories,
      find,
      resolve,
      validate,
      summary,
      notes:getNotes,
      note,
      clearNotes,
      launch,
      categoryFor
    }),
    enumerable:false,
    configurable:false,
    writable:false
  });

  refresh();
})();
