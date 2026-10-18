window.CALC1_LESSON_MASTERY_BANK=(function bankFactory(){
"use strict";
const pick=a=>a[Math.floor(Math.random()*a.length)];
const r=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const f=x=>String(x).replace(/-/g,"−");
function q(prompt,correct,wrong,explanation){
  const answer=String(correct), opts=[answer,...wrong.map(String)].filter((x,i,a)=>a.indexOf(x)===i);
  if(opts.length!==4)throw Error("Question generator produced duplicate options: "+prompt+" "+opts.join(", "));
  return {prompt,options:opts,answer:0,explanation};
}
const topics={
"u01-l01":[
 ()=>{let a=r(1,4),b=r(1,5),c=r(1,9),x=r(2,7),z=a*x*x+b*x+c;return q(`For f(x)=${a}x²+${b}x+${c}, evaluate f(${x}).`,z,[a*x+b*x+c,z+c,a*x*x+b+c],`Substitute ${x} for x, then calculate the square, products, and sum.`)},
 ()=>{let m=r(3,8),b=r(2,9),x=r(3,8),z=m*x+b;return q(`The rule is f(x)=${m}x+${b}. What is f(${x})?`,z,[m*x-b,m+x+b,m*x],`Multiply the input by ${m}, then add ${b}.`)},
 ()=>{let m=r(2,7),dx=r(2,5),y=r(3,9);return q(`A graph rises from (${r(0,2)},${y}) by ${m*dx} output units over ${dx} input units. What is its slope?`,m,[m*dx,dx, m+dx],`Slope is change in output divided by change in input.`)},
 ()=>{let v=r(3,9),t=r(2,7);return q(`A table follows f(t)=${v}t+2. What output belongs to input t=${t}?`,v*t+2,[v+t+2,v*t,v*(t+1)+2],`Use the function rule to connect the table input to its output.`)},
 ()=>{let meters=r(3,9)*10,mins=r(2,5);return q(`A walker travels ${meters} meters in ${mins} minutes. What units describe average speed?`,"meters per minute",["minutes per meter","meters times minutes","meters squared per minute"],"Distance divided by elapsed time produces meters per minute.")}
],
"u01-l02":[
 ()=>{let a=r(2,12);return q(`What is the real domain of g(x)=√(x−${a})?`,`[${a},∞)`,[`(−∞,${a}]`,`(${a},∞)`,"all real numbers"],`Require x−${a}≥0, so x≥${a}.`)},
 ()=>{let k=r(2,12);return q(`Which input must be excluded from h(x)=1/(x−${k})?`,`x=${k}`,[`x=−${k}`,"x=0","no input is excluded"],`The denominator cannot be zero; solve x−${k}=0.`)},
 ()=>{let k=r(2,10);return q(`The function g(x)=√(x+${k}) starts at which x-value?`,-k,[k,0,k+1],`The radicand requires x+${k}≥0; the smallest allowed input is −${k}.`)},
 ()=>{let m=r(2,8),t=r(2,7);return q(`Find the x-intercept of y=${m}x−${m*t}.`,`(${t},0)`,[`(0,${t})`,`(−${t},0)`,`(${m*t},0)`],`At the x-intercept, y=0. Solve 0=${m}x−${m*t}.`)},
 ()=>{let k=r(2,9);return q(`For f(x)=−${k}x+3, what happens as x→+∞?`,"f(x)→−∞",["f(x)→+∞","f(x)→3","f(x)→0"],"A linear function with negative slope falls without bound as x increases.")}
],
"u01-l03":[
 ()=>{let m=r(2,6),b=r(2,7),x=r(2,5),z=m*x*x+b;return q(`Given f(x)=${m}x+${b} and g(x)=x², calculate f(g(${x})).`,z,[m*x+b,m*(x+b)*(x+b),x*x+b],`Evaluate g(${x})=${x*x}, then substitute into f.`)},
 ()=>{let m=r(2,5),b=r(2,6),x=r(2,4),z=(m*x+b)**2;return q(`For f(x)=${m}x+${b} and g(x)=x², find g(f(${x})).`,z,[m*x*x+b,(m*x+b)*2,x*x+b],`Calculate f(${x}) first, then square that result.`)},
 ()=>{let h=r(2,9);return q(`What is the vertex of y=(x−${h})²?`,`(${h},0)`,[`(−${h},0)`,`(0,${h})`,`(0,−${h})`],`The parent parabola y=x² moves ${h} units to the right.`)},
 ()=>{let m=r(2,6),b=r(2,8),x=r(2,6);return q(`If f(x)=${m}x+${b}, evaluate f⁻¹(${m*x+b}).`,x,[m*x+b,x+b,m*x],`Solve y=${m}x+${b} for x, then substitute the stated y-value.`)},
 ()=>{let k=r(3,9),n=r(2,7);return q(`For h(x)=x²+${k}, what is h(${n})?`,n*n+k,[n+k,n*n-k,(n+k)*(n+k)],`Square the input first, then add the vertical shift ${k}.`)}
],
"u01-l04":[
 ()=>{let a=r(2,5),u=r(1,4),v=u+r(2,5),z=a*(u+v);return q(`What is the average rate of change of f(x)=${a}x² on [${u},${v}]?`,z,[a*(v-u),a*(v+u)*(v-u),a*(v*v+u*u)],`Compute [f(${v})−f(${u})]/(${v}−${u})=${a}(${u}+${v}).`)},
 ()=>{let m=r(3,11),b=r(2,8),u=r(1,3),v=u+r(2,5);return q(`Find the average rate of change of f(x)=${m}x+${b} on [${u},${v}].`,m,[b,m+b,m*(v-u)],"For a linear function, the average rate of change equals its constant slope.")},
 ()=>{let a=r(2,6),b=r(2,9),x=r(2,6),z=2*a*x+b;return q(`For f(x)=${a}x²+${b}x, what is its instantaneous rate of change at x=${x}?`,z,[a*x+b,a*x*x+b,2*a+b],`Differentiate to obtain f′(x)=${2*a}x+${b}, then evaluate at ${x}.`)},
 ()=>{let k=r(2,6);return q(`Which formula is the difference quotient [f(x+h)−f(x)]/h for f(x)=${k}x², h≠0?`,`${2*k}x+${k}h`,[`${k}x²+${k}h`,`${2*k}x`,`2x+${k}h`],`Expand ${k}(x+h)²−${k}x² and divide by h, with h≠0.`)},
 ()=>{let d=r(20,90),t=r(2,9);return q(`A vehicle covers ${d*t} kilometers in ${t} hours at a constant rate. What is average speed in km/h?`,d,[d*t,t,d+t],"Average speed is distance divided by elapsed time.")}
],
"u01-l05":[
 ()=>{let a=r(3,11);return q(`Simplify (x²−${a*a})/(x−${a}) for x≠${a}.`,`x+${a}`,[`x−${a}`,`x²+${a}`,`x+${a*a}`],`Factor x²−${a*a}=(x−${a})(x+${a}), then cancel only where x≠${a}.`)},
 ()=>{let m=r(3,8),b=r(2,9),x=r(2,8),z=m*x+b;return q(`Solve ${m}x+${b}=${z}.`,x,[x+1,x-1,z-b],`Subtract ${b} and divide by ${m}.`)},
 ()=>{let a=r(2,5),b=r(2,6);return q(`Simplify 2^${a} × 2^${b}.`,`2^${a+b}`,[`2^${a*b}`,`4^${a+b}`,`2^${a-b}`],"When multiplying equal bases, add exponents, not bases.")},
 ()=>{let a=r(3,10);return q(`Factor x²−${a*a}.`,`(x−${a})(x+${a})`,[`(x−${a})²`,`(x+${a})²`,`(x−${a*a})(x+1)`],`Apply the difference-of-squares identity a²−b²=(a−b)(a+b).`)},
 ()=>{let k=r(2,7),b=r(2,8);return q(`Simplify ${k}(x+${b})−${k-1}x.`,`x+${k*b}`,[`${k}x+${b}`,`x+${b}`,`${2*k-1}x+${k*b}`],`Distribute ${k}; combine like x terms while keeping the constant ${k*b}.`)}
],
"u01-l06":[
 ()=>{const choices=[[30,"π/6"],[45,"π/4"],[60,"π/3"],[90,"π/2"],[120,"2π/3"],[135,"3π/4"],[150,"5π/6"],[180,"π"],[270,"3π/2"]],p=pick(choices),other=choices.filter(x=>x[1]!==p[1]).sort(()=>Math.random()-.5).slice(0,3);return q(`Convert ${p[0]}° to radians.`,p[1],other.map(x=>x[1]),"Multiply the degree measure by π/180 and simplify.")},
 ()=>{let n=r(3,9);return q(`Evaluate log₂(2^${n}).`,n,[n+1,n-1,2*n],"Logarithm and exponentiation with the same base undo one another.")},
 ()=>{let a=r(2,6),b=r(2,7);return q(`Simplify 3^${a} × 3^${b}.`,`3^${a+b}`,[`3^${a*b}`,`9^${a+b}`,`3^${a-b}`],"Keep the common base 3 and add its exponents.")},
 ()=>{const pairs=[["sin 30°","1/2",["√3/2","1","0"]],["cos 60°","1/2",["√3/2","0","−1"]],["sin 90°","1",["0","1/2","−1"]],["cos 180°","−1",["1","0","−1/2"]]],p=pick(pairs);return q(`Evaluate ${p[0]} exactly.`,p[1],p[2],"Use the unit circle or a special-angle reference triangle, with correct signs.")},
 ()=>{let n=r(2,9);return q(`Evaluate ln(e^${n}).`,n,[n+1,n-1,n*n],"The natural logarithm and base-e exponential are inverse functions.")}
],
"u01-l07":[
 ()=>{const p=pick([["kilometers","hours","km/h","h/km","km·h","km²/h"],["meters","seconds","m/s","s/m","m·s","m²/s"],["dollars","items","$/item","items/$","$·item","$/item²"]]);return q(`A model predicts ${p[0]} as a function of ${p[1]}. What units describe its average rate of change?`,p[2],p.slice(3),"A rate of change has output units divided by input units.")},
 ()=>{let actual=r(40,90),err=r(2,9),pred=actual+err;return q(`A model predicts ${pred} but measurement gives ${actual}. What is actual minus predicted?`,-err,[err,pred,actual],"Signed prediction error is observed value minus the modeled value.")},
 ()=>{let err=r(2,12);return q(`Observed value is 100; the model predicts ${100-err}. What is the absolute percentage error?`,`${err}%`,[`${100-err}%`,`${100+err}%`,`${err/2}%`],"Absolute percentage error is |observed−predicted|/|observed| × 100%.")},
 ()=>{let v=r(25,70);return q(`A distance model d(t)=${v}t+5 uses kilometers and hours. Which interpretation of ${v} is correct?`,`${v} kilometers per hour`,[`${v} hours per kilometer`,`${v} kilometers total`,`${v} hours elapsed`],"The coefficient multiplying time measures change in distance per hour.")},
 ()=>{let t=r(3,8);return q(`A linear model was calibrated only for 0≤t≤${t}. Which input is inside its tested domain?`,t-1,[t+1,-1,t+4],`The validated domain is the closed interval [0,${t}]; outside it the extrapolation has not been tested.`)}
]};
function generate(id){
 const gs=topics[id];if(!gs)return[];
 const arr=[],seen=new Set();
 for(let round=0;round<12&&arr.length<48;round++){
   for(let i=0;i<gs.length;i++){
    let item;try{item=gs[i]()}catch(e){continue}
    if(!seen.has(item.prompt)){seen.add(item.prompt);arr.push({...item,id:id+"-t"+(i+1)+"-v"+round,lesson:id})}
   }
 }
 return arr;
}
return Object.freeze({version:"1.0.0",generate,lessonIds:Object.keys(topics)});
})();
