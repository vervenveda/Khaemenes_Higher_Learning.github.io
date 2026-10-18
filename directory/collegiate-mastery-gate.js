/* Khaemenes Higher Learning | proposed collegiate mastery-gate evaluator v1
 * Education-only, public code; never a credential, grade authority, or secure examination verifier.
 * No network requests; no storage; no external libraries; no private signing keys.
 * Public API: KhaemenesCollegiateMastery.evaluate(plan,evidence).
 */
(function(factory){
  "use strict";
  const api=Object.freeze(factory());
  if(typeof module==="object"&&module.exports)module.exports=api;
  else if(typeof window!=="undefined")window.KhaemenesCollegiateMastery=api;
})(function(){
  "use strict";
  const FLOOR=80;
  const TYPES=new Set(["unit","quiz","lab","project","portfolio","midterm","final","capstone","oral","other"]);
  function isId(s){return typeof s==="string"&&/^[a-zA-Z0-9][a-zA-Z0-9:_-]{0,79}$/.test(s)}
  function percent(n){return typeof n==="number"&&Number.isFinite(n)&&n>=0&&n<=100}
  function evaluate(plan,evidence){
    const req=Array.isArray(plan?.requirements)?plan.requirements:[];
    const got=Array.isArray(evidence?.attempts)?evidence.attempts:[];
    if(plan?.thresholdPercent!==FLOOR)return {ok:false,reason:"policy-threshold-must-be-80",thresholdPercent:FLOOR,complete:false,gates:[]};
    if(!isId(plan?.courseId)||!req.length)return {ok:false,reason:"invalid-or-empty-required-gates",thresholdPercent:FLOOR,complete:false,gates:[]};
    const ids=new Set();
    const requirements=[];
    for(const item of req){
      if(!isId(item?.id)||!TYPES.has(item?.type)||ids.has(item.id)||item.required!==true||typeof item.reviewRequired!=="boolean"){
        return {ok:false,reason:"invalid-requirement-manifest",thresholdPercent:FLOOR,complete:false,gates:[]};
      }
      ids.add(item.id);requirements.push(item);
    }
    const attempts=new Map();
    for(const a of got){
      if(!isId(a?.gateId)||!ids.has(a.gateId)||attempts.has(a.gateId)){
        return {ok:false,reason:"invalid-or-duplicate-gate-evidence",thresholdPercent:FLOOR,complete:false,gates:[]};
      }
      attempts.set(a.gateId,a);
    }
    const gates=requirements.map(r=>{
      const a=attempts.get(r.id),s=a?.scorePercent,validScore=percent(s);
      const reviewed=r.reviewRequired?a?.reviewed===true:true;
      const safetyOk=a?.safetyPassed!==false&&a?.ethicsPassed!==false;
      const state=!a||!validScore||!reviewed?"pending":s<FLOOR||!safetyOk?"not_mastered":"mastered";
      return {gateId:r.id,type:r.type,scorePercent:validScore?s:null,state,reviewRequired:r.reviewRequired};
    });
    const count={mastered:gates.filter(g=>g.state==="mastered").length,notMastered:gates.filter(g=>g.state==="not_mastered").length,pending:gates.filter(g=>g.state==="pending").length};
    const allRequiredMastered=gates.length>0&&count.mastered===gates.length;
    return {ok:true,thresholdPercent:FLOOR,courseId:plan.courseId,gates,count,complete:allRequiredMastered,academicReviewRequired:true,credentialAwarded:false,notice:"Local mastery calculation only. Independent faculty, registrar and legal authorization are required before formal completion records or certificates."};
  }
  return {version:"1.0.0",thresholdPercent:FLOOR,evaluate};
});
