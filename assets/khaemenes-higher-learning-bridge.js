(function attachKhaemenesHigherLearningBridge(global){
  "use strict";

  const VERSION="1.0.0";
  const EXPECTED_STAGE="higher";
  const COURSE_PREFIX="higher";

  function registry(){return global.KhaemenesFamilyRegistry||null}
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

  function activate(){
    const R=registry(),s=status();
    if(R&&s.scholar?.learnerId)R.setActive?.({familyId:s.scholar.familyId,adultId:s.adult?.adultId||undefined,learnerId:s.scholar.learnerId});
    global.dispatchEvent(new CustomEvent("khaemenes-higher-learning-ready",{detail:s}));
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
      contractVersion:1,
      bridgeVersion:VERSION,
      courseId:String(courseId||"").trim()||null,
      stage:EXPECTED_STAGE,
      learnerId:s.scholar?.learnerId||null,
      learnerType:s.scholar?.selfDirectedAdult?"adult-self-directed":"higher-learning-scholar",
      displayName:s.scholar?.nickname||null,
      authority:Object.freeze({changesPlacement:false,changesIdentity:false,awardsMastery:false,silentlyChangesGrade:false})
    });
  }

  global.KhaemenesHigherLearningBridge=Object.freeze({version:VERSION,expectedStage:EXPECTED_STAGE,status,activate,scopedCourseKey,makeCourseContext});
})(window);
