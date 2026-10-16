(function attachKhaemenesCourseIdentityAdapter(global){
  "use strict";

  const VERSION="1.1.0";
  const REGISTRY_URL="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-family-registry.js";
  const CONTINUATION_URL="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-learning-continuation.js";
  const DATA_GLOBALS=Object.freeze({
    "calculus-ii":"CALCULUS2_DATA",
    "linear-algebra":"LINEAR_ALGEBRA_DATA",
    "differential-equations":"DIFFERENTIAL_EQUATIONS_DATA",
    "statistics":"STATISTICS_DATA",
    "discrete-mathematics":"DISCRETE_MATHEMATICS_DATA",
    "introduction-to-proofs":"INTRODUCTION_TO_PROOFS_DATA",
    "real-complex-analysis":"REAL_COMPLEX_ANALYSIS_DATA",
    "abstract-algebra":"ABSTRACT_ALGEBRA_DATA",
    "topology-differential-geometry":"TOPOLOGY_DIFFERENTIAL_GEOMETRY_DATA"
  });

  const original=Object.freeze({
    getItem:Storage.prototype.getItem,
    setItem:Storage.prototype.setItem,
    removeItem:Storage.prototype.removeItem
  });

  function loadScript(src){return new Promise((resolve,reject)=>{const existing=document.querySelector(`script[src="${src}"]`);if(existing){if(existing.dataset.loaded==="1")return resolve(existing);existing.addEventListener("load",()=>resolve(existing),{once:true});existing.addEventListener("error",reject,{once:true});return}const s=document.createElement("script");s.src=src;s.async=false;s.addEventListener("load",()=>{s.dataset.loaded="1";resolve(s)},{once:true});s.addEventListener("error",reject,{once:true});document.head.appendChild(s)})}
  function rawGet(key){try{return original.getItem.call(global.localStorage,key)}catch{return null}}
  function rawSet(key,value){try{original.setItem.call(global.localStorage,key,value);return true}catch{return false}}
  function clean(value,max=120){return String(value??"").replace(/[\u0000-\u001f\u007f]/g,"").trim().slice(0,max)}
  function parse(raw){try{return raw?JSON.parse(raw):null}catch{return null}}
  function cloneJSON(value){try{return JSON.parse(JSON.stringify(value))}catch{return null}}
  function courseIdFromPath(){const m=global.location?.pathname?.match(/\/courses\/([^/]+)\//);return m?decodeURIComponent(m[1]):""}

  function scholar(){
    const R=global.KhaemenesFamilyRegistry;if(!R)return null;
    const ids=R.activeIds?.()||{};const adult=R.getAdult?.(ids.adultId)||null;
    let learner=R.getLearner?.(ids.learnerId)||null;
    if(!learner&&adult)learner=R.getAdultLearner?.(adult.adultId)||null;
    const stage=R.normalizeStage?R.normalizeStage(learner?.stage):learner?.stage;
    return stage==="higher"?learner:null;
  }

  function freshState(s){return {version:1,activeId:s.learnerId,selectedWeek:1,students:[{id:s.learnerId,name:s.nickname||"Scholar",pathway:"Core",weeks:{},formal:{diagnostic:null,midterm:null,final:null,capstone:null},notes:""}]}}
  function canonicalize(raw,s){
    if(!s?.learnerId)return null;
    const cloned=raw&&typeof raw==="object"?cloneJSON(raw):null;
    const state=cloned||freshState(s);
    const list=Array.isArray(state.students)?state.students:[];
    let student=list.find(x=>x?.id===s.learnerId)||list[0]||freshState(s).students[0];
    student={...student,id:s.learnerId,name:s.nickname||student.name||"Scholar"};
    state.version=Number(state.version)||1;
    state.selectedWeek=Math.min(36,Math.max(1,Number(state.selectedWeek)||1));
    state.students=[student];
    state.activeId=s.learnerId;
    return state;
  }

  function installStorageBoundary(courseId,legacyKey,s){
    const scopedKey=s?.learnerId?`khaemenes.course:${s.learnerId}:higher:${courseId}`:null;
    const legacy=rawGet(legacyKey);
    let seeded=false;

    function seed(){
      if(seeded||!s||!scopedKey)return;seeded=true;
      const existing=parse(rawGet(scopedKey));if(existing){rawSet(scopedKey,JSON.stringify(canonicalize(existing,s)));return}
      const old=parse(legacy);
      const source=old&&Array.isArray(old.students)&&old.students.length===1?old:null;
      rawSet(scopedKey,JSON.stringify(canonicalize(source,s)));
    }
    seed();

    Storage.prototype.getItem=function(key){
      if(this===global.localStorage&&key===legacyKey){if(!s||!scopedKey)return null;seed();return rawGet(scopedKey)}
      return original.getItem.call(this,key)
    };
    Storage.prototype.setItem=function(key,value){
      if(this===global.localStorage&&key===legacyKey){
        if(!s||!scopedKey)return;
        const normalized=canonicalize(parse(value),s);if(normalized){rawSet(scopedKey,JSON.stringify(normalized));global.dispatchEvent(new CustomEvent("khaemenes-higher-course-state-changed",{detail:{courseId,learnerId:s.learnerId,scopedKey}}))}return
      }
      return original.setItem.call(this,key,value)
    };
    Storage.prototype.removeItem=function(key){
      if(this===global.localStorage&&key===legacyKey){if(s&&scopedKey){original.removeItem.call(this,scopedKey);global.dispatchEvent(new CustomEvent("khaemenes-higher-course-state-changed",{detail:{courseId,learnerId:s.learnerId,scopedKey,cleared:true}}))}return}
      return original.removeItem.call(this,key)
    };
    return scopedKey;
  }

  function publishContinuation(courseId,data,s,scopedKey){
    const C=global.KhaemenesLearningContinuation;
    if(!C?.publish||!s?.learnerId||!scopedKey||!data?.course)return false;
    const state=canonicalize(parse(rawGet(scopedKey)),s)||freshState(s);
    const student=state.students?.[0]||freshState(s).students[0];
    const weeks=Array.isArray(data.weeks)?data.weeks:[];
    const total=Number(data.course.duration_weeks)||weeks.length||36;
    const target=Number(data.course.mastery_target)||80;
    const weekRecord=n=>student.weeks?.[n]||student.weeks?.[String(n)]||{};
    const dayCount=r=>Object.values(r?.days||{}).filter(Boolean).length;
    const completed=weeks.filter(w=>dayCount(weekRecord(w.week))>=5).length;
    const next=weeks.find(w=>dayCount(weekRecord(w.week))<5)||null;
    const formal=student.formal||{};
    let status="continue",nextLabel="Continue Study",nextTitle="",nextHref="",summary="",best=null;

    if(completed===0&&(formal.diagnostic===null||formal.diagnostic===undefined)){
      status="assessment";nextLabel="Begin Diagnostic";nextTitle="Readiness Diagnostic";nextHref="diagnostic/";
      summary="Begin with the course readiness diagnostic, then continue into the 36-week scholar pathway.";
    }else if(next&&Number(next.week)>18&&completed>=18&&(formal.midterm===null||Number(formal.midterm)<target)){
      best=formal.midterm===null||formal.midterm===undefined?null:Number(formal.midterm);
      status=best!==null&&best>0?"corrections":"assessment";nextLabel=status==="corrections"?"Review Midterm":"Open Midterm";
      nextTitle="Midterm Examination";nextHref="assessments/midterm.html";
      summary=best!==null&&best>0?`Midterm recorded at ${Math.round(best)}%. Review before the next formal attempt.`:"The first half of the course is complete. The Midterm is the next formal evidence.";
    }else if(next){
      const rec=weekRecord(next.week),mastery=Number(rec.masteryBest);
      best=Number.isFinite(mastery)?mastery:null;
      status="continue";nextLabel="Continue Study";nextTitle=`Week ${String(next.week).padStart(2,"0")} · ${next.title||"Course Study"}`;
      nextHref=next.unit_path||"./";
      summary=`${dayCount(rec)}/5 weekly sessions recorded${best!==null?` · best practice mastery ${Math.round(best)}%`:""}.`;
    }else if(formal.final===null||formal.final===undefined||Number(formal.final)<target){
      best=formal.final===null||formal.final===undefined?null:Number(formal.final);
      status=best!==null&&best>0?"corrections":"assessment";nextLabel=status==="corrections"?"Review Final":"Open Final";
      nextTitle="Comprehensive Final";nextHref="assessments/final.html";
      summary=best!==null&&best>0?`Final recorded at ${Math.round(best)}%. Review and prepare for the next attempt.`:"The 36-week study sequence is complete. The comprehensive final is the next formal evidence.";
    }else if(formal.capstone===null||formal.capstone===undefined||Number(formal.capstone)<target){
      best=formal.capstone===null||formal.capstone===undefined?null:Number(formal.capstone);
      status=best!==null&&best>0?"corrections":"assessment";nextLabel=status==="corrections"?"Revise Capstone":"Complete Capstone";
      nextTitle="Capstone / Oral Defense";nextHref="#portfolio";
      summary="Complete or revise the capstone and defense evidence at the course mastery target.";
    }else{
      status="complete";nextLabel="Review Course Record";nextTitle=`${data.course.short_title||data.course.title||courseId} Complete`;nextHref="#gradebook";
      summary="All locally recorded course study and formal evidence categories are complete.";best=100;
    }

    try{
      C.publish({
        learnerId:s.learnerId,courseId:`higher:${courseId}`,school:"Khaemenes Higher Learning",stage:"higher",grade:"Adult / Higher Learning",
        subject:data.course.department||"Higher Learning",courseTitle:data.course.short_title||data.course.title||courseId,
        status,nextLabel,nextTitle,nextHref,summary,
        progress:{completed,total,percent:Math.round(completed/Math.max(1,total)*100)},
        mastery:{best:Number.isFinite(best)?best:null,threshold:target,mastered:status==="complete"},
        family:{needsAction:false,label:"",summary:"",href:""},
        source:`higher-course:${courseId}`
      });
      return true;
    }catch{return false}
  }

  function installContinuationPublisher(courseId,data,s,scopedKey){
    let timer=0;
    const publish=()=>publishContinuation(courseId,data,s,scopedKey);
    const schedule=()=>{clearTimeout(timer);timer=setTimeout(publish,80)};
    global.addEventListener("khaemenes-higher-course-state-changed",event=>{if(event.detail?.courseId===courseId)schedule()});
    global.addEventListener("khaemenes-learning-continuation-ready",schedule);
    global.addEventListener("pageshow",schedule);
    document.addEventListener("change",schedule,true);
    document.addEventListener("click",event=>{if(event.target?.closest?.("#saveWeek,#saveFormal,#generate,[data-day]"))schedule()},true);
    publish();
    return Object.freeze({publish});
  }

  function lockIdentityControls(s){
    const reason=s?"Learner identity is managed by the Khaemenes Academy Family Registry.":"Select or create the Higher Learning scholar through Scholar Entry before saving formal course records.";
    function apply(){
      const select=document.getElementById("studentSelect");if(select){select.disabled=true;select.title=reason}
      ["addLearner","renameLearner","deleteLearner"].forEach(id=>{const b=document.getElementById(id);if(b){b.disabled=true;b.title=reason;b.setAttribute("aria-disabled","true")}});
    }
    document.addEventListener("click",e=>{if(e.target?.closest?.("#addLearner,#renameLearner,#deleteLearner")){e.preventDefault();e.stopImmediatePropagation()}},true);
    document.addEventListener("change",e=>{if(e.target?.id==="studentSelect"){e.preventDefault();e.stopImmediatePropagation()}},true);
    const observer=new MutationObserver(apply);observer.observe(document.documentElement,{childList:true,subtree:true});apply();
  }

  async function boot({coreSrc,courseId}={}){
    courseId=clean(courseId||courseIdFromPath(),100);
    const dataName=DATA_GLOBALS[courseId];const data=dataName?global[dataName]:null;
    const legacyKey=clean(data?.course?.storage_key||"",180);
    if(!legacyKey){console.error("Khaemenes course identity boundary: course storage key unavailable; formal course engine not started.");return Object.freeze({status:"failed-closed",courseId})}
    try{if(!global.KhaemenesFamilyRegistry)await loadScript(REGISTRY_URL)}catch(error){console.error("Khaemenes Family Registry unavailable; course records will remain transient.",error)}
    const s=scholar();const scopedKey=installStorageBoundary(courseId,legacyKey,s);lockIdentityControls(s);
    try{if(!global.KhaemenesLearningContinuation)await loadScript(CONTINUATION_URL)}catch(error){console.warn("Khaemenes continuation contract unavailable; course study remains functional.",error)}
    if(coreSrc)await loadScript(coreSrc);
    if(s&&scopedKey)installContinuationPublisher(courseId,data,s,scopedKey);
    global.addEventListener("khaemenes-family-changed",()=>global.location.reload());
    const detail={version:VERSION,status:s?"canonical-scholar":"transient-no-scholar",courseId,learnerId:s?.learnerId||null,scopedKey,legacyKeyPreserved:true,duplicateLearnerCreation:false};
    global.dispatchEvent(new CustomEvent("khaemenes-course-identity-ready",{detail}));return Object.freeze(detail)
  }

  global.KhaemenesCourseIdentityAdapter=Object.freeze({version:VERSION,boot,courseIdFromPath,currentScholar:scholar,policy:Object.freeze({identityAuthority:"academy-family-registry",legacyKeysPreserved:true,duplicateLearnerCreation:false,multiLearnerCourseAccounts:false,noScholarPersistence:"fail-closed"})});
})(window);
