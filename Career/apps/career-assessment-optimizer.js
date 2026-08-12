/*
  Khaemenes Academy Career Assessment Optimizer v2.0
  Drop-in enhancement for Career/apps/career-assessment_index.html

  Purpose
  -------
  - Preserves the existing 300-question bank and original UI/state machine.
  - Recalculates career alignment on a true 0–100 Likert scale:
      1=0, 2=25, 3=50, 4=75, 5=100.
  - Keeps evidence coverage separate from alignment.
  - Adds response-quality checks and profile-differentiation checks.
  - Removes bipolar "anchor" domains from pathway formulas where the
    original same-direction scoring could blur opposing preferences.
  - Replaces the original weighted-random "collapse" display with a
    transparent probability-weighted exploratory draw.
  - Writes a backward-friendly v2 bundle to the existing
    khaeCareerAssessmentBundle_v1 localStorage key.
  - Does not claim clinical, psychometric, diagnostic, employment, or
    predictive validity.

  Install
  -------
  Add this immediately before </body> in career-assessment_index.html:
    <script src="./career-assessment-optimizer.js"></script>
*/
(() => {
  "use strict";

  const ENGINE_VERSION = "2.0.0";
  const BUNDLE_KEY = "khaeCareerAssessmentBundle_v1";
  const ORIGINAL_PROGRESS_KEY = "khaeCareerProgress_v1";
  const QUANTUM_LOG_KEY = "khaeCareerQuantumLog_v1";
  const V2_META_KEY = "khaeCareerAssessmentOptimizer_v2";

  const EXCLUDED_PATHWAY_DOMAINS = new Set([
    "arts_vs_stem_anchor",
    "people_vs_things_anchor",
    "indoor_vs_outdoor_anchor"
  ]);

  const CAREER_PATHWAYS = [
    {
      id:1, code:"arts_entertainment", name:"Arts & Entertainment",
      blurb:"Creative expression, performance, design, media, and storytelling.",
      weights:{creative_arts:1.4,writing_communication:0.7,pref_people_facing:0.6,pref_variety:0.7,arts_vs_stem_anchor:1.0,pref_fast_paced:0.4}
    },
    {
      id:2, code:"architecture_engineering", name:"Architecture & Engineering",
      blurb:"Designing and improving physical structures, systems, and technologies.",
      weights:{design_engineering:1.4,numeracy:0.8,science_analysis:1.0,technical_trades:0.6,indoor_vs_outdoor_anchor:0.3}
    },
    {
      id:3, code:"business_admin", name:"Business Management & Administration",
      blurb:"Organizing people, systems, finances, and operations.",
      weights:{business_ops:1.4,pref_leadership:0.8,numeracy:0.6,pref_detail_work:0.6,communication_clarity:0.6}
    },
    {
      id:4, code:"communications", name:"Communications",
      blurb:"Writing, media, public relations, storytelling, and messaging.",
      weights:{writing_communication:1.4,communication_clarity:1.0,pref_people_facing:0.7,creative_arts:0.5}
    },
    {
      id:5, code:"community_social", name:"Community & Social Services",
      blurb:"Support, counseling, social work, and community programs.",
      weights:{empathy:1.4,community_support:1.2,ethical_judgment:0.7,pref_people_facing:0.7,pref_meaning_impact:0.8}
    },
    {
      id:6, code:"education", name:"Education",
      blurb:"Teaching, training, tutoring, curriculum support.",
      weights:{teaching_training:1.4,empathy:0.8,communication_clarity:0.8,patience:0.8,pref_people_facing:0.7}
    },
    {
      id:7, code:"science_tech", name:"Science & Technology",
      blurb:"Research, analysis, labs, coding, and technical innovation.",
      weights:{science_analysis:1.4,numeracy:0.8,pref_digital:0.9,arts_vs_stem_anchor:0.7,pref_quiet_focus:0.6}
    },
    {
      id:8, code:"maintenance_repair", name:"Installation, Repair & Maintenance",
      blurb:"Hands-on technical roles that keep systems running.",
      weights:{technical_trades:1.4,pref_hands_on:1.1,outdoors_work:0.6,stress_tolerance:0.5}
    },
    {
      id:9, code:"farming_forestry", name:"Farming, Fishing & Forestry",
      blurb:"Outdoor, land-based, and resource-focused work.",
      weights:{outdoors_work:1.4,pref_outdoors_env:1.2,pref_hands_on:0.8,pref_variety:0.5}
    },
    {
      id:10, code:"government", name:"Government",
      blurb:"Public administration, civic programs, and public service roles.",
      weights:{public_service:1.4,fairness:0.8,ethical_judgment:0.8,communication_clarity:0.5}
    },
    {
      id:11, code:"health_medicine", name:"Health & Medicine",
      blurb:"Clinical, allied health, and wellness professions.",
      weights:{health_care:1.4,empathy:1.0,stress_tolerance:0.7,community_support:0.6,science_analysis:0.6}
    },
    {
      id:12, code:"law_policy", name:"Law & Public Policy",
      blurb:"Legal work, advocacy, policy-making, and justice systems.",
      weights:{law_policy_interest:1.4,ethical_judgment:1.0,fairness:1.0,communication_clarity:0.6,public_service:0.6}
    },
    {
      id:13, code:"sales_customer", name:"Sales & Customer Service",
      blurb:"Customer-facing, negotiation, retail, and client care roles.",
      weights:{sales_persuasion:1.4,pref_people_facing:1.1,communication_clarity:0.7,stress_tolerance:0.6,pref_fast_paced:0.4}
    }
  ];

  const $ = id => document.getElementById(id);

  function clamp(n, lo, hi){ return Math.max(lo, Math.min(hi, n)); }
  function round(n, places=1){
    const p = 10 ** places;
    return Math.round((Number(n) + Number.EPSILON) * p) / p;
  }
  function escapeHtml(value){
    return String(value).replace(/[&<>"']/g, ch => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    })[ch]);
  }
  function readJSON(key, fallback=null){
    try{
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    }catch{
      return fallback;
    }
  }
  function writeJSON(key, value){
    try{
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    }catch(err){
      console.warn("[Career Assessment v2] Could not save", key, err);
      return false;
    }
  }

  /* -------------------------------------------------------
     Read the existing 300-question bank from the page source.
     No dynamic code evaluation is used.
  -------------------------------------------------------- */
  function findQuestionSource(){
    return Array.from(document.scripts)
      .map(s => s.textContent || "")
      .find(src => src.includes("SECTION1_QUESTIONS") &&
                   src.includes("SECTION2_QUESTIONS") &&
                   src.includes("SECTION3_QUESTIONS") &&
                   src.includes("function qw")) || "";
  }

  function parseQuestionBank(){
    const src = findQuestionSource();
    if(!src) return {questions:[], byId:{}, parseError:"Question-bank source was not found."};

    const questions = [];
    const re = /qw\(\s*'([^']+)'\s*,\s*(\d+)\s*,\s*'((?:\\.|[^'\\])*)'\s*,\s*\[([^\]]*)\]\s*\)/g;
    let m;

    while((m = re.exec(src))){
      const id = m[1];
      const section = Number(m[2]);
      const text = m[3].replace(/\\'/g, "'").replace(/\\\\/g, "\\");
      const domainBlock = m[4];
      const domains = [];
      const dre = /'([^']+)'/g;
      let dm;
      while((dm = dre.exec(domainBlock))) domains.push(dm[1]);
      questions.push({id, section, text, domains});
    }

    const byId = Object.fromEntries(questions.map(q => [q.id, q]));
    return {
      questions,
      byId,
      parseError: questions.length === 300 ? null :
        `Expected 300 questions but parsed ${questions.length}.`
    };
  }

  const BANK = parseQuestionBank();

  function normalizedLikert(answer){
    // 1..5 -> 0..100. Neutral is exactly 50.
    return clamp(((Number(answer) - 1) / 4) * 100, 0, 100);
  }

  function mean(values){
    return values.length ? values.reduce((a,b)=>a+b,0) / values.length : 0;
  }

  function sampleSD(values){
    if(values.length < 2) return 0;
    const m = mean(values);
    const variance = values.reduce((s,v)=>s + (v-m)**2, 0) / (values.length - 1);
    return Math.sqrt(variance);
  }

  /* -------------------------------------------------------
     Domain scoring
     - alignmentPercent is 0..100
     - neutral = 50
     - count/coverage remain separate from alignment
  -------------------------------------------------------- */
  function computeDomainScores(responses){
    const buckets = {};

    for(const q of BANK.questions){
      const ans = Number(responses[q.id]);
      if(!Number.isFinite(ans) || ans < 1 || ans > 5) continue;
      const value = normalizedLikert(ans);

      for(const domain of q.domains){
        buckets[domain] ??= [];
        buckets[domain].push({questionId:q.id, value, raw:ans});
      }
    }

    const out = {};
    for(const [domain, items] of Object.entries(buckets)){
      const values = items.map(x=>x.value);
      const rawValues = items.map(x=>x.raw);
      const alignmentPercent = round(mean(values), 1);
      const count = items.length;

      // Coverage is descriptive, not psychometric confidence.
      // Four or more direct observations is treated as full basic coverage.
      const coveragePercent = round(clamp(count / 4, 0, 1) * 100, 0);

      out[domain] = {
        alignmentPercent,
        mean: round(1 + 4 * alignmentPercent / 100, 3), // backward-friendly 1..5 equivalent
        count,
        weightSum: count,
        coveragePercent,
        responseSD: round(sampleSD(rawValues), 3),
        questionIds: items.map(x=>x.questionId)
      };
    }
    return out;
  }

  /* -------------------------------------------------------
     Pathway scoring
     - excludes the original bipolar anchor fields from pathway
       formulas because opposite statements were fed to the same
       positive domain.
     - coverage remains separate from alignment.
  -------------------------------------------------------- */
  function computePathwayResults(domainScores){
    const results = CAREER_PATHWAYS.map(pathway => {
      let sum = 0;
      let weightSum = 0;
      let coverageSum = 0;
      let coverageWeight = 0;
      let evidenceItems = 0;
      const usedDomains = [];

      for(const [domain, weight] of Object.entries(pathway.weights)){
        if(EXCLUDED_PATHWAY_DOMAINS.has(domain)) continue;
        const d = domainScores[domain];
        if(!d) continue;

        const absW = Math.abs(weight);
        sum += d.alignmentPercent * weight;
        weightSum += absW;
        coverageSum += d.coveragePercent * absW;
        coverageWeight += absW;
        evidenceItems += d.count;
        usedDomains.push(domain);
      }

      const scorePercent = weightSum ? clamp(sum / weightSum, 0, 100) : 50;
      const coveragePercent = coverageWeight ? coverageSum / coverageWeight : 0;

      return {
        id:pathway.id,
        code:pathway.code,
        name:pathway.name,
        blurb:pathway.blurb,
        score: round(1 + 4 * scorePercent / 100, 3),
        scorePercent: round(scorePercent, 1),
        alignmentPercent: round(scorePercent, 1),
        coveragePercent: round(coveragePercent, 0),
        evidenceItems,
        usedDomains,
        weights:pathway.weights
      };
    });

    results.sort((a,b) =>
      (b.scorePercent - a.scorePercent) ||
      (b.coveragePercent - a.coveragePercent) ||
      a.id - b.id
    );

    return results;
  }

  /* -------------------------------------------------------
     Directional orientation diagnostics
     These are descriptive orientation signals only and are NOT
     used to determine the 13 pathway scores.
  -------------------------------------------------------- */
  function computeOrientations(responses){
    const get = id => {
      const v = Number(responses[id]);
      return Number.isFinite(v) ? normalizedLikert(v) : null;
    };
    const reverse = value => value == null ? null : 100 - value;
    const avgPresent = values => {
      const ok = values.filter(v => v != null);
      return ok.length ? round(mean(ok), 1) : null;
    };

    // Positive end named second in each label.
    const artsStem = avgPresent([
      get("S1_Q076"),          // STEM more than arts
      reverse(get("S1_Q077"))  // arts more than math -> reverse
    ]);

    const peopleThings = avgPresent([
      get("S1_Q078"),          // tools/things over support
      reverse(get("S1_Q079"))  // people over equipment -> reverse
    ]);

    const indoorOutdoor = avgPresent([
      reverse(get("S1_Q080")), // indoor preference -> reverse
      get("S1_Q081"),          // outdoor/field
      reverse(get("S3_Q052")), // climate-controlled indoor -> reverse
      get("S3_Q051"),          // part of day outdoors
      get("S3_Q072")           // nature
    ]);

    return {
      artsToStem:{score:artsStem, lowLabel:"Arts", highLabel:"STEM"},
      peopleToThings:{score:peopleThings, lowLabel:"People", highLabel:"Things / Systems"},
      indoorToOutdoor:{score:indoorOutdoor, lowLabel:"Indoor", highLabel:"Outdoor / Field"}
    };
  }

  /* -------------------------------------------------------
     Response quality
     Descriptive only. These flags never change pathway scores.
  -------------------------------------------------------- */
  function assessmentSequence(){
    const state = readJSON(ORIGINAL_PROGRESS_KEY, {});
    const ids = [];
    for(const section of [1,2,3]){
      const active = state?.activeSectionIds?.[section];
      if(Array.isArray(active) && active.length) ids.push(...active);
    }
    if(ids.length === 300) return ids;
    return BANK.questions.map(q=>q.id);
  }

  function longestIdenticalRun(values){
    let best = 0, run = 0, prev;
    for(const v of values){
      if(v === prev) run += 1;
      else { prev = v; run = 1; }
      best = Math.max(best, run);
    }
    return best;
  }

  function computeResponseQuality(responses){
    const sequence = assessmentSequence();
    const values = sequence
      .map(id => Number(responses[id]))
      .filter(v => Number.isFinite(v) && v >= 1 && v <= 5);

    const count = values.length;
    const m = mean(values);
    const sd = sampleSD(values);
    const neutralRate = count ? values.filter(v=>v===3).length / count : 0;
    const extremeRate = count ? values.filter(v=>v===1 || v===5).length / count : 0;
    const positiveRate = count ? values.filter(v=>v>=4).length / count : 0;
    const negativeRate = count ? values.filter(v=>v<=2).length / count : 0;
    const longestRun = longestIdenticalRun(values);

    const flags = [];
    if(sd < 0.35) flags.push({
      code:"low_variance",
      level:"review",
      message:"Very little response variation was detected. Review whether the scale was used thoughtfully."
    });
    if(neutralRate > 0.60) flags.push({
      code:"high_neutral_rate",
      level:"review",
      message:"More than 60% of responses were neutral. Results may be less differentiated."
    });
    if(longestRun >= 30) flags.push({
      code:"long_string",
      level:"review",
      message:`A run of ${longestRun} identical responses was detected. Consider checking for straight-line responding.`
    });
    if(positiveRate > 0.88) flags.push({
      code:"uniform_endorsement",
      level:"review",
      message:"Very high endorsement across most items can make many pathways look equally strong."
    });
    if(negativeRate > 0.88) flags.push({
      code:"uniform_rejection",
      level:"review",
      message:"Very high rejection across most items can make pathway distinctions less informative."
    });

    return {
      completedResponses: count,
      expectedResponses: BANK.questions.length || 300,
      complete: count === (BANK.questions.length || 300),
      meanResponse: round(m, 3),
      responseSD: round(sd, 3),
      neutralRate: round(neutralRate * 100, 1),
      extremeRate: round(extremeRate * 100, 1),
      positiveRate: round(positiveRate * 100, 1),
      negativeRate: round(negativeRate * 100, 1),
      longestIdenticalRun: longestRun,
      flags,
      interpretation: flags.length ? "review" : "no_obvious_pattern_flag"
    };
  }

  function computeProfileDifferentiation(pathways){
    const scores = pathways.map(p=>p.scorePercent);
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    const sd = sampleSD(scores);
    const range = max - min;
    const topGap = pathways.length > 1 ? pathways[0].scorePercent - pathways[1].scorePercent : 0;

    let level = "low";
    if(range >= 25 && sd >= 8) level = "high";
    else if(range >= 15 && sd >= 5) level = "moderate";

    const flat = range < 10 || sd < 4;

    return {
      level,
      flat,
      range:round(range,1),
      standardDeviation:round(sd,1),
      topTwoGap:round(topGap,1),
      message: flat
        ? "This profile is relatively flat. Treat the ranking as exploratory rather than as a strong preference hierarchy."
        : level === "high"
          ? "The responses create a clearly differentiated pathway profile."
          : "The responses create some pathway differentiation, but nearby pathways should still be explored."
    };
  }

  /* -------------------------------------------------------
     Probability-weighted exploratory draw
     Softmax is used to turn relative pathway scores into a
     transparent exploration distribution.
  -------------------------------------------------------- */
  function addExplorationProbabilities(pathways, profile){
    if(!pathways.length) return pathways;
    const maxScore = Math.max(...pathways.map(p=>p.scorePercent));
    const temperature = profile.flat ? 18 : 11;
    const raw = pathways.map(p => Math.exp((p.scorePercent - maxScore) / temperature));
    const total = raw.reduce((a,b)=>a+b,0) || 1;

    return pathways.map((p,i)=>({
      ...p,
      explorationProbability: round(raw[i] / total * 100, 2)
    }));
  }

  function buildV2Bundle(originalBundle){
    const responses = originalBundle?.responses || readJSON(ORIGINAL_PROGRESS_KEY, {})?.answers || {};
    const domainScores = computeDomainScores(responses);
    let pathways = computePathwayResults(domainScores);
    const profile = computeProfileDifferentiation(pathways);
    pathways = addExplorationProbabilities(pathways, profile);
    const quality = computeResponseQuality(responses);
    const orientations = computeOrientations(responses);

    return {
      // Backward-friendly fields first.
      pathways,
      domainScores,
      responses,
      generatedAt:new Date().toISOString(),

      schemaVersion:2,
      engine:{
        name:"Khaemenes Career Assessment Optimizer",
        version:ENGINE_VERSION,
        scoringScale:"Likert 1–5 normalized to 0–100; neutral=50",
        pathwayMethod:"weighted mean of direct positive domains",
        excludedPathwayDomains:Array.from(EXCLUDED_PATHWAY_DOMAINS),
        explorationMethod:"softmax probability-weighted exploratory draw",
        validityNotice:"Educational career exploration only; not a validated clinical, diagnostic, employment-selection, or psychometric instrument."
      },
      responseQuality:quality,
      profileDifferentiation:profile,
      orientations,
      originalBundleGeneratedAt:originalBundle?.generatedAt || null
    };
  }

  function maybeUpgradeBundle(){
    const original = readJSON(BUNDLE_KEY, null);
    if(!original || !original.responses) return null;

    // Avoid continuously rewriting an already-current v2 bundle.
    if(original.schemaVersion === 2 &&
       original.engine?.version === ENGINE_VERSION){
      return original;
    }

    const upgraded = buildV2Bundle(original);
    writeJSON(BUNDLE_KEY, upgraded);
    writeJSON(V2_META_KEY, {
      version:ENGINE_VERSION,
      upgradedAt:new Date().toISOString(),
      parsedQuestions:BANK.questions.length,
      parserStatus:BANK.parseError || "ok"
    });
    return upgraded;
  }

  function drawPathway(bundle){
    const pathways = bundle?.pathways || [];
    if(!pathways.length) return null;

    // If the profile is very flat, still allow exploration, but make
    // the interface explicitly state that the draw is weakly differentiated.
    const weights = pathways.map(p => Math.max(0, Number(p.explorationProbability) || 0));
    const total = weights.reduce((a,b)=>a+b,0);
    if(total <= 0) return pathways[0];

    let r = Math.random() * total;
    for(let i=0;i<pathways.length;i++){
      r -= weights[i];
      if(r <= 0) return pathways[i];
    }
    return pathways[pathways.length - 1];
  }

  function readQuantumLog(){
    const log = readJSON(QUANTUM_LOG_KEY, []);
    return Array.isArray(log) ? log : [];
  }

  function saveExplorationEvent(pathway, bundle){
    const log = readQuantumLog();
    log.push({
      ts:new Date().toISOString(),
      code:pathway.code,
      name:pathway.name,
      scorePercent:pathway.scorePercent,
      explorationProbability:pathway.explorationProbability,
      engineVersion:ENGINE_VERSION,
      profileDifferentiation:bundle.profileDifferentiation?.level || null
    });
    writeJSON(QUANTUM_LOG_KEY, log.slice(-250));
    return log;
  }

  function qualityList(bundle){
    const q = bundle.responseQuality;
    if(!q) return "";
    if(!q.flags.length){
      return `<li>No obvious straight-line, low-variance, or extreme endorsement pattern was flagged.</li>`;
    }
    return q.flags.map(f=>`<li>${escapeHtml(f.message)}</li>`).join("");
  }

  function coverageLabel(n){
    return n >= 85 ? "broad" : n >= 65 ? "moderate" : "limited";
  }

  function renderOptimizedResults(bundle){
    const summary = $("khaeAssessmentSummary");
    const panel = $("khaeQuantumPanel");
    if(!summary || !panel || !bundle?.pathways?.length) return;

    const renderToken = bundle.generatedAt || bundle.originalBundleGeneratedAt || "v2";
    summary.dataset.khaeV2Rendered = renderToken;
    panel.dataset.khaeV2Rendered = renderToken;

    const top3 = bundle.pathways.slice(0,3);
    const profile = bundle.profileDifferentiation;
    const q = bundle.responseQuality;

    summary.innerHTML = `
      <h2>Career Snapshot · Optimized v2</h2>
      <p>
        Alignment is now reported on a true <strong>0–100 scale</strong>:
        Strongly Disagree = 0, Neutral = 50, Strongly Agree = 100.
        Coverage is shown separately from alignment.
      </p>
      <ul>
        ${top3.map(p => `
          <li>
            <strong>${escapeHtml(p.name)}</strong> —
            ${p.scorePercent}% alignment ·
            ${p.coveragePercent}% evidence coverage (${coverageLabel(p.coveragePercent)})
          </li>`).join("")}
      </ul>
      <p>
        <strong>Profile differentiation:</strong>
        ${escapeHtml(profile.level)} · range ${profile.range} points ·
        top-two gap ${profile.topTwoGap} points.
      </p>
      <p>${escapeHtml(profile.message)}</p>
      <details>
        <summary>Response-quality review</summary>
        <ul>${qualityList(bundle)}</ul>
        <p style="font-size:11px;color:#d0c8bc;">
          Response-pattern flags do not alter scores. They are prompts for review,
          not evidence of dishonesty or invalid participation.
        </p>
      </details>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">
        <button type="button" class="khae-btn" id="khaeV2ExportBtn">Export Optimized JSON</button>
        <button type="button" class="khae-btn" id="khaeV2RecalcBtn">Recalculate v2</button>
      </div>
      <p style="margin-top:8px;font-size:11px;color:#d0c8bc;">
        Educational exploration only. This assessment is not a psychological,
        clinical, employment-selection, or diagnostic instrument.
      </p>
    `;
    summary.style.display = "block";

    const top = bundle.pathways[0];
    const log = readQuantumLog();
    const recent = log.slice(-5).reverse();

    panel.innerHTML = `
      <h2>Quantum Career Lens · Probability-Weighted Exploration</h2>
      <p>
        The Career Lens now samples from a transparent probability distribution
        derived from the relative 13-pathway alignment scores. It is an
        <strong>exploration tool</strong>, not quantum computing and not a prediction.
      </p>
      <p>
        Current strongest alignment:
        <strong>${escapeHtml(top.name)}</strong> (${top.scorePercent}%).
        Current exploratory draw probability: ${top.explorationProbability}%.
      </p>
      ${profile.flat ? `
        <p style="color:#f0e9dc;">
          Your pathway profile is relatively flat, so any single draw should be
          treated as a prompt to explore—not as a recommendation hierarchy.
        </p>` : ""}
      <div style="margin:8px 0 6px;">
        <button type="button" class="khae-btn khae-btn-primary" id="khaeV2DrawBtn">
          Explore One Path 🔮
        </button>
      </div>
      <p class="khae-quantum-log-title">
        Exploration log: <strong>${log.length}</strong> event(s) stored on this device.
      </p>
      ${recent.length ? `
        <ul class="khae-quantum-log-list">
          ${recent.map(e => {
            const date = e.ts ? e.ts.replace("T"," · ").slice(0,16) : "";
            return `<li>${escapeHtml(date)} — <strong>${escapeHtml(e.name)}</strong>
              (${Number(e.scorePercent)||0}% alignment)</li>`;
          }).join("")}
        </ul>` : ""}
    `;
    panel.style.display = "block";

    $("khaeV2ExportBtn")?.addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(bundle,null,2)], {type:"application/json"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "khaemenes-career-assessment-v2.json";
      a.click();
      setTimeout(()=>URL.revokeObjectURL(url),500);
    });

    $("khaeV2RecalcBtn")?.addEventListener("click", () => {
      const current = readJSON(BUNDLE_KEY, {});
      const fresh = buildV2Bundle(current);
      writeJSON(BUNDLE_KEY, fresh);
      renderOptimizedResults(fresh);
    });

    $("khaeV2DrawBtn")?.addEventListener("click", () => {
      const chosen = drawPathway(bundle);
      if(!chosen) return;
      saveExplorationEvent(chosen, bundle);

      summary.innerHTML = `
        <h2>Exploratory Path Draw</h2>
        <p>
          This draw surfaced <strong>${escapeHtml(chosen.name)}</strong>.
          Its current alignment is ${chosen.scorePercent}% and its draw probability
          was ${chosen.explorationProbability}%.
        </p>
        <p>
          Use this as a prompt for a small experiment: read about the field,
          interview someone, try a short project, or compare it with your other
          high-alignment pathways.
        </p>
        <p style="font-size:11px;color:#d0c8bc;">
          This does not decide a career and is not a prediction.
        </p>
      `;
      summary.style.display = "block";
      window.scrollTo({top:0,behavior:"smooth"});

      // Refresh log while preserving v2 panel.
      setTimeout(()=>renderOptimizedResults(bundle), 50);
    });
  }

  function tagInterface(){
    const tag = document.querySelector(".khae-tag");
    if(tag && !tag.dataset.v2Tagged){
      tag.dataset.v2Tagged = "true";
      tag.textContent = `${tag.textContent} · Optimized Scoring v2`;
    }
  }

  function duplicatePromptAudit(){
    const normalized = new Map();
    const duplicates = [];
    for(const q of BANK.questions){
      const key = q.text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu," ").trim();
      if(normalized.has(key)){
        duplicates.push([normalized.get(key), q.id, q.text]);
      }else{
        normalized.set(key,q.id);
      }
    }
    if(duplicates.length){
      console.warn("[Career Assessment v2] Exact normalized duplicate prompts:", duplicates);
    }
    return duplicates;
  }

  function bootstrap(){
    tagInterface();

    if(BANK.parseError){
      console.warn("[Career Assessment v2]", BANK.parseError);
    }else{
      console.info(`[Career Assessment v2] Parsed ${BANK.questions.length} questions.`);
    }
    duplicatePromptAudit();

    const existing = maybeUpgradeBundle();
    if(existing?.schemaVersion === 2){
      renderOptimizedResults(existing);
    }

    const summary = $("khaeAssessmentSummary");
    const panel = $("khaeQuantumPanel");
    let renderLock = false;

    const observer = new MutationObserver(() => {
      if(renderLock) return;
      const raw = readJSON(BUNDLE_KEY, null);
      if(!raw?.responses) return;

      const token = raw.generatedAt || raw.originalBundleGeneratedAt || "v2";
      if(raw.schemaVersion === 2 &&
         raw.engine?.version === ENGINE_VERSION &&
         summary?.dataset.khaeV2Rendered === token &&
         panel?.dataset.khaeV2Rendered === token){
        return;
      }

      // Original finalization writes the bundle and then renders its old summary.
      // Upgrade immediately afterward.
      const upgraded = raw.schemaVersion === 2 &&
                       raw.engine?.version === ENGINE_VERSION
        ? raw
        : buildV2Bundle(raw);

      writeJSON(BUNDLE_KEY, upgraded);

      renderLock = true;
      try{
        renderOptimizedResults(upgraded);
      }finally{
        queueMicrotask(()=>{ renderLock = false; });
      }
    });

    if(summary) observer.observe(summary, {childList:true,subtree:true,attributes:true});
    if(panel) observer.observe(panel, {childList:true,subtree:true,attributes:true});

    writeJSON(V2_META_KEY, {
      version:ENGINE_VERSION,
      loadedAt:new Date().toISOString(),
      parsedQuestions:BANK.questions.length,
      parserStatus:BANK.parseError || "ok"
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", bootstrap, {once:true});
  }else{
    bootstrap();
  }

  // Expose read-only-ish helpers for QA and future Academy integration.
  window.KhaeCareerAssessmentV2 = Object.freeze({
    version:ENGINE_VERSION,
    parsedQuestionCount:()=>BANK.questions.length,
    parserStatus:()=>BANK.parseError || "ok",
    buildBundle:()=>buildV2Bundle(readJSON(BUNDLE_KEY, {})),
    auditDuplicates:duplicatePromptAudit
  });
})();
