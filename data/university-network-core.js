(() => {
  "use strict";

  const REGISTRY_URLS = [
    "https://vervenveda.com/assessment-engine/mentor/registry/ecosystem-repositories.json",
    "https://vervenveda.github.io/assessment-engine/mentor/registry/ecosystem-repositories.json"
  ];

  const FEDERATION_URL = "./data/university-federation.json";

  const style = document.createElement("style");
  style.textContent = `
    .uni-fed-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
    .uni-fed-card{min-height:280px;display:flex;flex-direction:column;padding:22px;border:1px solid var(--line-dark,rgba(255,255,255,.13));border-top:3px solid var(--bronze,#b18d59);border-radius:var(--radius,21px);background:rgba(255,255,255,.035);text-align:left}
    html[data-theme="light"] .uni-fed-card{border-color:var(--line-light,rgba(24,37,55,.14));background:#fff}
    .uni-fed-card small,.uni-repo-card small{color:var(--muted,#8b98a5);font-size:.72rem;letter-spacing:.07em;text-transform:uppercase}
    .uni-fed-card h3,.uni-repo-card h3{margin:10px 0 8px;font-family:var(--serif,Georgia,serif);font-weight:500}
    .uni-fed-card p,.uni-repo-card p{color:var(--muted,#8b98a5);font-size:.84rem}
    .uni-fed-card a,.uni-repo-card a{margin-top:auto;display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:8px 11px;border:1px solid rgba(220,199,160,.34);border-radius:var(--control,7px);text-decoration:none;font-size:.72rem;letter-spacing:.05em;text-transform:uppercase}
    .uni-halls{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:22px}
    .uni-hall{padding:15px;border:1px solid rgba(220,199,160,.19);border-radius:var(--control,7px);background:rgba(255,255,255,.025);text-align:left}
    html[data-theme="light"] .uni-hall{background:#fff;border-color:rgba(24,37,55,.14)}
    .uni-hall strong{display:block;font-family:var(--serif,Georgia,serif);font-weight:500}.uni-hall span{display:block;margin-top:5px;color:var(--muted,#8b98a5);font-size:.76rem}
    .uni-network-controls{display:grid;grid-template-columns:minmax(220px,1fr) 190px 190px;gap:9px;margin:0 0 18px;padding:16px;border:1px solid rgba(220,199,160,.19);border-radius:var(--radius,21px);background:rgba(255,255,255,.025)}
    html[data-theme="light"] .uni-network-controls{background:#fff;border-color:rgba(24,37,55,.14)}
    .uni-network-controls input,.uni-network-controls select{min-height:44px;padding:9px 11px;border:1px solid rgba(220,199,160,.26);border-radius:var(--control,7px);color:inherit;background:rgba(255,255,255,.04)}
    html[data-theme="light"] .uni-network-controls input,html[data-theme="light"] .uni-network-controls select{background:#fff;border-color:rgba(24,37,55,.2)}
    .uni-repo-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
    .uni-repo-card{min-height:225px;display:flex;flex-direction:column;padding:18px;border:1px solid rgba(220,199,160,.16);border-radius:var(--radius,21px);background:rgba(255,255,255,.025);text-align:left}
    html[data-theme="light"] .uni-repo-card{background:#fff;border-color:rgba(24,37,55,.14)}
    .uni-badges{display:flex;gap:5px;flex-wrap:wrap}.uni-badge{padding:4px 6px;border:1px solid rgba(220,199,160,.23);border-radius:var(--control,7px);font-size:.62rem;letter-spacing:.05em;text-transform:uppercase}
    .uni-status{margin:0 0 17px;color:var(--muted,#8b98a5);font-size:.8rem}
    .uni-registry-note{margin-top:20px;padding:15px;border:1px solid rgba(220,199,160,.19);border-radius:var(--control,7px);color:var(--muted,#8b98a5);font-size:.78rem}
    @media(max-width:980px){.uni-fed-grid,.uni-repo-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.uni-network-controls{grid-template-columns:1fr 1fr}.uni-network-controls input{grid-column:1/-1}}
    @media(max-width:680px){.uni-fed-grid,.uni-repo-grid,.uni-halls,.uni-network-controls{grid-template-columns:1fr}.uni-network-controls input{grid-column:auto}}
  `;
  document.head.appendChild(style);

  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));

  async function firstJSON(urls){
    let lastError;
    for(const url of urls){
      try{
        const response = await fetch(url,{cache:"no-store",credentials:"omit"});
        if(!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        return {data:await response.json(),url};
      }catch(error){ lastError = error; }
    }
    throw lastError || new Error("No registry source available.");
  }

  function pageURL(repo){
    if(repo.homepage && /^https?:/i.test(repo.homepage)) return repo.homepage;
    if(repo.hasPages){
      const owner = repo.owner || "";
      const name = repo.name || "";
      if(name.toLowerCase() === `${owner}.github.io`.toLowerCase()) return `https://${owner}.github.io/`;
      return `https://${owner}.github.io/${encodeURIComponent(name)}/`;
    }
    return repo.htmlUrl || `https://github.com/${repo.fullName || ""}`;
  }

  function roleFor(repo){
    const name = (repo.name || "").toLowerCase();
    const full = (repo.fullName || "").toLowerCase();
    const owner = (repo.owner || "").toLowerCase();
    if(name === "khaemenes_higher_learning.github.io") return "Central University";
    if(["solanar.github.io","firmament.github.io","bazaarart.github.io","the_refrain.github.io","khaemenes_linguistics.github.io","medicament-hub.github.io","finance.github.io"].includes(name)) return "University School / Specialist Campus";
    if(["arshif.github.io","plerasearch.github.io","theverifier.github.io"].includes(name)) return "Library / Research";
    if(name === "proresource_hub.github.io") return "Technical / Professional Laboratory";
    if(["khaemenes_preschool.github.io","khaemenes_kindergarden.github.io","khaemenes_elementary.github.io","khaemenes_middle.github.io","khaemenes_high.github.io","khaemenes_academy.github.io"].includes(name)) return "Feeder / Prerequisite Campus";
    if(["river_to_road.github.io","onenationforall.github.io","veterans.github.io","homeless.github.io"].includes(name)) return "Civic / Public Service Institute";
    if(["arcade.github.io","aurora.github.io","myartgallery.github.io"].includes(name)) return "Creative / Learning Support";
    if(name === "333.github.io") return "Network / Technology";
    if((repo.classification || "") === "campaign" || owner === "jenniferpearl2028") return "Public / Civic Branch — Academically Segregated";
    if(owner === "artist1970") return "R&D / Incubator / Legacy Source";
    if(full.includes("jenniferpearl2028")) return "Public / Civic Branch — Academically Segregated";
    return "Network Repository";
  }

  function insertAfterDepartments(section){
    const departments = document.getElementById("departments");
    if(departments && departments.parentNode){
      departments.parentNode.insertBefore(section,departments.nextSibling);
      return;
    }
    document.querySelector("main")?.appendChild(section);
  }

  async function renderFederation(){
    let data;
    try{
      data = await fetch(FEDERATION_URL,{cache:"no-store"}).then(r => {
        if(!r.ok) throw new Error("Federation map unavailable.");
        return r.json();
      });
    }catch{
      return;
    }

    const section = document.createElement("section");
    section.className = "section section-alt";
    section.id = "federated-schools";
    section.innerHTML = `
      <div class="section-inner">
        <div class="heading">
          <p class="kicker">Federated University</p>
          <h2>One university. Many source-owned campuses.</h2>
          <p>Higher Learning is an ever-expanding university. Schools, conservatories, course halls, libraries, laboratories, and institutes may remain in their original repositories while belonging to one academic catalog.</p>
        </div>
        <div class="uni-fed-grid">
          ${(data.academicUnits || []).map(unit => `
            <article class="uni-fed-card">
              <small>${esc(unit.status)} · ${esc(unit.kind)}</small>
              <h3>${esc(unit.name)}</h3>
              <p>${esc(unit.description)}</p>
              <small>${esc(unit.repository)}</small>
              <a href="${esc(unit.url)}">Open Academic Campus</a>
            </article>`).join("")}
        </div>
        <div class="heading" style="margin-top:44px">
          <p class="kicker">Course-Bearing Halls</p>
          <h2>Halls belong in the academic catalog.</h2>
          <p>A Hall that carries modules, courses, assessments, research studios, projects, or mastery pathways is treated as an academic container while its original repository remains authoritative.</p>
        </div>
        <div class="uni-halls">
          ${(data.courseHalls || []).map(hall => `
            <a class="uni-hall" href="${esc(hall.url)}">
              <strong>${esc(hall.name)}</strong>
              <span>${esc(hall.school)} · ${esc(hall.repository)}</span>
            </a>`).join("")}
        </div>
      </div>`;
    insertAfterDepartments(section);

    const heroLead = document.querySelector(".hero .lead");
    if(heroLead) heroLead.textContent = "An ever-expanding federated university connecting rigorous courses, course-bearing halls, specialist schools, conservatories, research libraries, laboratories, student records, and advanced pathways across the Verve N Veda educational network.";

    const depHeading = document.querySelector("#departments .heading p:last-child");
    if(depHeading) depHeading.textContent = "Mathematics is currently housed directly in Higher Learning. Other active schools and course halls may remain in specialist repositories and are federated into the university catalog below.";

    const heroActions = document.querySelector(".hero .actions");
    if(heroActions && !heroActions.querySelector('[href="#federated-schools"]')){
      const a = document.createElement("a");
      a.className = "btn";
      a.href = "#federated-schools";
      a.textContent = "University Network";
      heroActions.appendChild(a);
    }
  }

  async function renderRegistry(){
    const anchor = document.getElementById("network") || document.querySelector("footer");
    if(!anchor || !anchor.parentNode) return;

    const section = document.createElement("section");
    section.className = "section";
    section.id = "repository-network";
    section.innerHTML = `
      <div class="section-inner">
        <div class="heading">
          <p class="kicker">Complete University Network Registry</p>
          <h2>Every public repository has a place.</h2>
          <p>This directory is the institutional map of the public Matrix. Listing a repository here does not automatically make it a degree program or Mentor recommendation; it preserves visibility, provenance, and cross-campus discovery.</p>
        </div>
        <div class="uni-network-controls">
          <input id="uniRepoSearch" type="search" placeholder="Search repositories, roles, classifications…">
          <select id="uniOwnerFilter"><option value="">All accounts</option></select>
          <select id="uniClassFilter"><option value="">All classifications</option></select>
        </div>
        <p class="uni-status" id="uniRepoStatus">Loading the central ecosystem registry…</p>
        <div class="uni-repo-grid" id="uniRepoGrid"></div>
        <div class="uni-registry-note" id="uniRegistryNote">The university directory lists public repositories discovered by the central Matrix registry. Private repositories are not intentionally exposed here.</div>
      </div>`;
    anchor.parentNode.insertBefore(section,anchor);

    try{
      const {data,url} = await firstJSON(REGISTRY_URLS);
      const repos = Array.isArray(data.repositories) ? data.repositories : [];
      const ownerSelect = section.querySelector("#uniOwnerFilter");
      const classSelect = section.querySelector("#uniClassFilter");
      const search = section.querySelector("#uniRepoSearch");
      const grid = section.querySelector("#uniRepoGrid");
      const status = section.querySelector("#uniRepoStatus");
      const note = section.querySelector("#uniRegistryNote");

      [...new Set(repos.map(r => r.owner).filter(Boolean))].sort().forEach(owner => {
        const o=document.createElement("option");o.value=owner;o.textContent=owner;ownerSelect.appendChild(o);
      });
      [...new Set(repos.map(r => r.classification || "unclassified"))].sort().forEach(value => {
        const o=document.createElement("option");o.value=value;o.textContent=value;classSelect.appendChild(o);
      });

      function draw(){
        const q=search.value.trim().toLowerCase(), owner=ownerSelect.value, cls=classSelect.value;
        const filtered=repos.filter(repo=>{
          const role=roleFor(repo);
          const hay=[repo.fullName,repo.name,repo.description,repo.classification,repo.discoveryStatus,role].join(" ").toLowerCase();
          return (!q||hay.includes(q)) && (!owner||repo.owner===owner) && (!cls||(repo.classification||"unclassified")===cls);
        });
        grid.innerHTML=filtered.map(repo=>{
          const role=roleFor(repo);
          const destination=pageURL(repo);
          return `<article class="uni-repo-card">
            <div class="uni-badges">
              <span class="uni-badge">${esc(repo.owner)}</span>
              <span class="uni-badge">${esc(repo.classification || "unclassified")}</span>
              <span class="uni-badge">${esc(repo.discoveryStatus || "discovered")}</span>
            </div>
            <h3>${esc(repo.name)}</h3>
            <p>${esc(repo.description || role)}</p>
            <small>${esc(role)}</small>
            <a href="${esc(destination)}">Open Repository / Site</a>
          </article>`;
        }).join("");
        status.textContent=`Showing ${filtered.length} of ${repos.length} public repositories in the current Matrix registry.`;
      }

      search.addEventListener("input",draw);
      ownerSelect.addEventListener("change",draw);
      classSelect.addEventListener("change",draw);
      draw();
      note.textContent=`Registry source: ${url} · Generated ${data.generatedAt || "date unavailable"}. The catalog refreshes from the central registry and can expand as new public repositories are discovered.`;
    }catch(error){
      section.querySelector("#uniRepoStatus").textContent="The central repository registry could not be loaded in this browser session.";
      section.querySelector("#uniRepoGrid").innerHTML=`<article class="uni-repo-card"><h3>Registry unavailable</h3><p>The academic federation above remains available. The complete repository list will return when the central static registry is reachable.</p></article>`;
    }
  }

  function addFooterLinks(){
    const footer = document.querySelector(".footer-links");
    if(!footer) return;
    if(!footer.querySelector('[href="#federated-schools"]')){
      const a=document.createElement("a");a.href="#federated-schools";a.textContent="Federated Schools";footer.appendChild(a);
    }
    if(!footer.querySelector('[href="#repository-network"]')){
      const a=document.createElement("a");a.href="#repository-network";a.textContent="Network Registry";footer.appendChild(a);
    }
  }

  async function boot(){
    await renderFederation();
    await renderRegistry();
    addFooterLinks();
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",boot,{once:true});
  else boot();
})();
