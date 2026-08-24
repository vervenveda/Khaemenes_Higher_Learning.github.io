(function attachKhaemenesHigherLearningBridge(global){
  "use strict";

  const VERSION="1.3.0";
  const EXPECTED_STAGE="higher";
  const COURSE_PREFIX="higher";
  const ACADEMY_BASE="https://vervenveda.com/Khaemenes_Academy.github.io";
  const MENTOR_URL=`${ACADEMY_BASE}/mentor/`;

  function registry(){return global.KhaemenesFamilyRegistry||null}
  function clean(value,max=160){return String(value??"").replace(/[\u0000-\u001f\u007f]/g,"").trim().slice(0,max)}

  function ensureScript(src,marker){
    if(!global.document)return null;
    const existing=global.document.querySelector(`script[data-khaemenes-${marker}],script[src="${src}"]`);
    if(existing)return existing;
    const script=global.document.createElement("script");
    script.src=src;
    script.defer=true;
    script.dataset[`khaemenes${marker.replace(/(^|-)([a-z])/g,(_,a,b)=>b.toUpperCase())}`]="1";
    (global.document.head||global.document.documentElement).appendChild(script);
    return script;
  }

  function ensureAcademyFamilyRegistry(){
    if(global.KhaemenesFamilyRegistry)return null;
    return ensureScript(`${ACADEMY_BASE}/assets/khaemenes-family-registry.js`,"family-registry");
  }

  function ensureAcademyMentorRouter(){
    if(global.KhaemenesNAIB)return null;
    return ensureScript(`${ACADEMY_BASE}/assets/khaemenes-naib-mentor-router.js`,"naib-mentor-router");
  }

  function ensureBetaProgramLink(){
    if(!global.document)return;
    if(global.document.querySelector('script[data-vnv-beta-link],script[src="https://vervenveda.com/assets/vnv-beta-link.js"]'))return;
    const script=global.document.createElement("script");
    script.src="https://vervenveda.com/assets/vnv-beta-link.js";
    script.defer=true;
    script.dataset.vnvBetaLink="higher-learning";
    global.document.head.appendChild(script);
  }

  function status(){
    const R=registry();
    if(!R)return Object.freeze({version:VERSION,status:"registry-unavailable",stage:EXPECTED_STAGE,scholar:null,adult:null,recommendedSharedOrigin:false});
    const ids=R.activeIds?.()||{};
    const adult=R.getAdult?.(ids.adultId)||null;
    let scholar=R.getLearner?.(ids.learnerId)||null;
    if(!scholar&&adult)scholar=R.getAdultLearner?.(adult.adultId)||null;
    if(scholar&&scholar.stage!==EXPECTED_STAGE)return Object.freeze({version:VERSION,status:"other-stage",stage:EXPECTED_STAGE,scholar,adult,recommendedSharedOrigin:R.status?.().recommendedSharedOrigin===true});
    if(!scholar)return Object.freeze({version:VERSION,status:"no-higher-scholar",stage:EXPECTED_STAGE,scholar:null,adult,recommendedSharedOrigin:R.status?.().recommendedSharedOrigin===true});
    if(scholar.selfDirectedAdult&&adult&&scholar.linkedAdultId===adult.adultId){
      return Object.freeze({version:VERSION,status:"adult-scholar-ready",stage:EXPECTED_STAGE,scholar,adult,recommendedSharedOrigin:R.status?.().recommendedSharedOrigin===true});
    }
    return Object.freeze({version:VERSION,status:"higher-scholar-ready",stage:EXPECTED_STAGE,scholar,adult,recommendedSharedOrigin:R.status?.().recommendedSharedOrigin===true});
  }

  function mentorAssignment(context={}){
    const s=status();
    const router=global.KhaemenesNAIB;
    if(!router?.assignMentor)return Object.freeze({status:"router-unavailable",stage:EXPECTED_STAGE,mentor:null,masteryThresholdMinimum:80});
    return router.assignMentor({
      role:"student",
      stage:EXPECTED_STAGE,
      learnerId:s.scholar?.learnerId||null,
      personId:s.scholar?.learnerId||null,
      ageBand:s.scholar?.ageBand||"adult",
      interests:Array.isArray(s.scholar?.interests)?s.scholar.interests:[],
      surface:clean(context.surface||global.location?.pathname||"higher-learning",160),
      subject:clean(context.subject||"",80),
      courseId:clean(context.courseId||"",100),
      intent:clean(context.intent||"advanced-study",80)
    });
  }

  function mentorHref(context={}){
    const params=new URLSearchParams();
    params.set("stage","higher");
    const subject=clean(context.subject||"",80),courseId=clean(context.courseId||"",100),source=clean(context.surface||global.location?.pathname||"/Khaemenes_Higher_Learning.github.io/",240);
    if(subject)params.set("subject",subject);
    if(courseId)params.set("course",courseId);
    params.set("source",source);
    return `${MENTOR_URL}?${params.toString()}`;
  }

  function activate(){
    ensureAcademyFamilyRegistry();
    ensureAcademyMentorRouter();
    ensureBetaProgramLink();
    const R=registry(),s=status();
    if(R&&s.scholar?.learnerId)R.setActive?.({familyId:s.scholar.familyId,adultId:s.adult?.adultId||undefined,learnerId:s.scholar.learnerId});
    global.dispatchEvent(new CustomEvent("khaemenes-higher-learning-ready",{detail:{...s,mentor:mentorAssignment()}}));
    return s;
  }

  function scopedCourseKey(courseId){
    const s=status(),id=String(courseId||"").trim();
    if(!id||!s.scholar?.learnerId)return null;
    return `khaemenes.course:${s.scholar.learnerId}:${COURSE_PREFIX}:${id}`;
  }

  function makeCourseContext(courseId){
    const s=status();
    return Object.freeze({
      contract:"khaemenes.higher-learning-context",
      contractVersion:2,
      bridgeVersion:VERSION,
      courseId:String(courseId||"").trim()||null,
      stage:EXPECTED_STAGE,
      learnerId:s.scholar?.learnerId||null,
      learnerType:s.scholar?.selfDirectedAdult?"adult-self-directed":"higher-learning-scholar",
      displayName:s.scholar?.nickname||null,
      mentorId:"archaemenes",
      mentorExpression:"scholar",
      mentorAuthority:"academy-archaemenes",
      masteryThresholdMinimum:80,
      authority:Object.freeze({
        changesPlacement:false,
        changesIdentity:false,
        awardsMastery:false,
        silentlyChangesGrade:false,
        bypassesPrerequisites:false,
        revealsLockedAssessments:false
      })
    });
  }

  global.KhaemenesHigherLearningBridge=Object.freeze({
    version:VERSION,
    expectedStage:EXPECTED_STAGE,
    mentorId:"archaemenes",
    mentorAuthority:"academy-archaemenes",
    mentorUrl:MENTOR_URL,
    status,
    activate,
    scopedCourseKey,
    makeCourseContext,
    mentorAssignment,
    mentorHref,
    ensureAcademyFamilyRegistry,
    ensureAcademyMentorRouter,
    ensureBetaProgramLink
  });

  ensureAcademyFamilyRegistry();
  ensureAcademyMentorRouter();
  if(global.document?.readyState==="loading")global.document.addEventListener("DOMContentLoaded",ensureBetaProgramLink,{once:true});else ensureBetaProgramLink();
})(window);
