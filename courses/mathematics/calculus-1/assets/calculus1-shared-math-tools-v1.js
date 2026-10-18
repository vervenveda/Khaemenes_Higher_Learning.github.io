/* Khaemenes Calculus I · Federated High School Mathematics Tools
 * Source-owner links only, never copied assessment records or credential gates.
 * No network requests, dependencies, tracking, or course-grade mutations.
 */
(function(){
"use strict";
if(window.__calc1HighMathToolsRendered)return;
window.__calc1HighMathToolsRendered=true;
const BASE="https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/";
const ROOT="assets/learning-games/";
const TOOLS=Object.freeze({
 calculator:{name:"Scientific Calculator v4",kind:"Investigation tool",path:"tools/calculator/",why:"Verify tables, graphs, numerical results and units after written setup."},
 slope:{name:"Slope & Rate Studio",kind:"Bridge practice",path:ROOT+"slope-and-rate-studio/",why:"Practice slope and average rate before derivatives and secant limits."},
 functions:{name:"Function Transformation Studio",kind:"Bridge practice",path:ROOT+"function-transformation-studio/",why:"Explore function families, composition, inverses and graph shifts."},
 quadratic:{name:"Quadratic Graph Lab",kind:"Bridge practice",path:ROOT+"quadratic-graph-lab/",why:"Review parabolas, zeros, vertex models and graph interpretation."},
 polynomial:{name:"Polynomial Zeros Explorer",kind:"Bridge practice",path:ROOT+"polynomial-zeros-explorer/",why:"Investigate factorization, end behavior and zero structure."},
 circle:{name:"Unit Circle Navigator",kind:"Bridge practice",path:ROOT+"unit-circle-navigator/",why:"Practice radians, signs, exact trigonometric values and rotations."},
 wave:{name:"Trigonometric Wave Studio",kind:"Bridge practice",path:ROOT+"trigonometric-wave-studio/",why:"Explore sine/cosine models, period, amplitude and phase."},
 trig:{name:"Trigonometric Identity Forge",kind:"Bridge practice",path:ROOT+"trigonometric-identity-forge/",why:"Practice valid symbolic trigonometric identities and equations."},
 exp:{name:"Exponential & Logarithm Lab",kind:"Bridge practice",path:ROOT+"exponential-logarithm-lab/",why:"Explore exponential growth, decay, logarithms and inverse relationships."},
 sequence:{name:"Sequence & Series Studio",kind:"Bridge practice",path:ROOT+"sequence-series-studio/",why:"Review partial sums and sigma notation prior to integral approximations."},
 stats:{name:"Statistics Detective",kind:"Data reasoning",path:ROOT+"statistics-detective/",why:"Practice interpreting data, predictions, error and model limitations."},
 systems:{name:"Functions & Systems Challenge",kind:"Bridge practice",path:ROOT+"algebra-functions-systems-challenge/",why:"Reinforce algebraic structure, functions and constraints."},
 intervals:{name:"Evidence & Interval Studio",kind:"Bridge practice",path:ROOT+"algebra-evidence-interval-lab/",why:"Review interval notation and mathematical justification."},
 triangle:{name:"Right Triangle Trigonometry",kind:"Bridge practice",path:ROOT+"right-triangle-trig/",why:"Review measurement, ratios and geometry used in rates and optimization."}
});
const UNITS=Object.freeze({
 1:["functions","slope","circle","exp"],
 2:["functions","polynomial","intervals"],
 3:["functions","polynomial","intervals"],
 4:["slope","functions","quadratic"],
 5:["polynomial","wave","exp","trig"],
 6:["functions","exp","trig","wave"],
 7:["slope","triangle","stats"],
 8:["quadratic","polynomial","functions"],
 9:["sequence","slope","stats"],
 10:["slope","sequence","functions"],
 11:["sequence","exp","trig"],
 12:["exp","stats","sequence"],
 13:["quadratic","stats","triangle","systems"]
});
const LESSONS=Object.freeze({
 "u01-l01":["functions","slope"],"u01-l02":["polynomial","functions"],
 "u01-l03":["functions","systems"],"u01-l04":["slope","functions"],
 "u01-l05":["polynomial","systems"],"u01-l06":["circle","exp","trig"],"u01-l07":["stats","functions"],
 "u02-l01":["functions","slope"],"u02-l03":["functions","polynomial"],
 "u02-l05":["polynomial","systems"],"u02-l06":["polynomial","functions"],"u02-l07":["polynomial","intervals"],
 "u03-l03":["functions","intervals"],"u03-l04":["functions","polynomial"],
 "u04-l01":["slope","functions"],"u04-l02":["slope","quadratic"],
 "u04-l04":["slope","quadratic"],"u04-l07":["slope","functions"],
 "u05-l04":["circle","wave"],"u05-l05":["circle","trig"],
 "u05-l06":["exp","functions"],"u05-l07":["exp","functions"],"u05-l08":["slope","stats"],
 "u06-l01":["functions","polynomial"],"u06-l03":["trig","wave"],
 "u06-l04":["exp","functions"],"u06-l07":["functions","circle"],
 "u07-l01":["slope","stats"],"u07-l03":["triangle","slope"],
 "u07-l04":["triangle","slope"],"u07-l07":["stats","slope"],
 "u08-l01":["quadratic","polynomial"],"u08-l03":["polynomial","functions"],
 "u08-l05":["quadratic","functions"],"u08-l07":["quadratic","triangle"],
 "u09-l01":["sequence","slope"],"u09-l02":["sequence","slope"],
 "u09-l03":["sequence","stats"],"u09-l04":["sequence","stats"],
 "u09-l07":["stats","slope"],
 "u10-l02":["sequence","functions"],"u10-l06":["functions","systems"],
 "u11-l04":["trig","circle"],"u11-l06":["sequence","stats"],
 "u12-l01":["exp","slope"],"u12-l04":["exp","stats"],
 "u12-l05":["stats","sequence"],"u13-l03":["quadratic","triangle"],
 "u13-l05":["stats","quadratic"],"u13-l06":["stats","systems"]
});
function item(id){const t=TOOLS[id];return t?{id:id,name:t.name,kind:t.kind,why:t.why,url:BASE+t.path}:null}
function idsForLesson(id){
 const n=Number(id?.match(/^u(\d{2})-l\d{2}$/)?.[1]);
 const primary=LESSONS[id]||[],fallback=UNITS[n]||[];
 return [...new Set(["calculator",...primary,...fallback])].slice(0,4);
}
function idsForUnit(n){return ["calculator",...(UNITS[n]||[])];}
function node(tag,cls,value){const x=document.createElement(tag);if(cls)x.className=cls;if(value!==undefined)x.textContent=value;return x}
function openLink(tool){const a=node("a","btn",tool.name+" ↗");a.href=tool.url;a.target="_blank";a.rel="noopener noreferrer";a.title=tool.why+" External Academy tool; independent practice.";return a}
function intro(){
 const p=node("p","", "These are shared High School mathematics studios supporting the current Calculus I topic. They are optional, free bridge practice—not reviewed calculus examinations. Scores never unlock lessons, units, or certificates. Return here to complete the required 80% mastery check.");
 p.style.fontSize=".88rem";return p;
}
function lessonUI(id){
 const side=document.querySelector("main#lessonMain aside.lesson-side");
 if(!side||document.getElementById("calc1SharedMathTools"))return;
 const article=node("article","card");article.id="calc1SharedMathTools";
 article.appendChild(node("h3","","Related Math Studios"));
 article.appendChild(intro());
 const list=node("div","actions");list.style.cssText="display:flex;gap:7px;flex-wrap:wrap;align-items:center";
 idsForLesson(id).map(item).filter(Boolean).forEach(t=>{
   const a=openLink(t);a.style.cssText="font-size:.78rem;min-height:38px;padding:7px 9px";
   list.appendChild(a);
 });
 article.appendChild(list);side.appendChild(article);
}
function unitUI(n){
 const parent=document.querySelector("main#main .wrap");
 if(!parent||document.getElementById("calc1SharedMathTools"))return;
 const section=node("section","card");section.id="calc1SharedMathTools";
 section.style.cssText="margin:18px 0;padding:18px;border-radius:7px";
 section.appendChild(node("h3","","Unit "+String(n).padStart(2,"0")+" · Shared Math Studios"));
 section.appendChild(intro());
 const list=node("div","actions");list.style.cssText="display:flex;flex-wrap:wrap;gap:8px";
 idsForUnit(n).map(item).filter(Boolean).forEach(t=>list.appendChild(openLink(t)));
 section.appendChild(list);
 const grid=parent.querySelector(".grid");
 if(grid)grid.insertAdjacentElement("afterend",section);else parent.appendChild(section);
}
function campusUI(){
 const page=document.getElementById("calculusGamesPage");
 const wrap=page?.querySelector(".wrap");
 if(!wrap||document.getElementById("calc1SharedMathTools"))return;
 const section=node("section","");section.id="calc1SharedMathTools";section.style.cssText="padding:22px 0 26px";
 section.appendChild(node("h3","","Calculus I · Shared High School Math Studios"));
 section.appendChild(intro());
 const row=node("div","actions");
 const label=node("label","","Show studios for Unit ");
 const select=node("select");select.id="calc1SharedMathUnit";select.style.cssText="min-height:40px;max-width:260px;padding:8px;color:inherit;background:var(--panel);border:1px solid var(--line);border-radius:7px";
 for(let n=0;n<=13;n++){const op=document.createElement("option");op.value=String(n);op.textContent=n?"Unit "+String(n).padStart(2,"0"):"All course studios";select.appendChild(op)}
 label.appendChild(select);row.appendChild(label);section.appendChild(row);
 const grid=node("div","games-grid");grid.id="calc1SharedMathGrid";section.appendChild(grid);
 const foot=node("p","","These High School games remain owned and maintained by their source repository. Launching them does not import their local scores into a Higher Learning transcript.");foot.style.fontSize=".81rem";section.appendChild(foot);
 wrap.appendChild(section);
 function paint(){
  const n=Number(select.value);
  const ids=n?idsForUnit(n):Object.keys(TOOLS);
  grid.replaceChildren();
  ids.map(item).filter(Boolean).forEach(t=>{
   const card=node("article","card game-card");
   const badge=node("span","pill",t.kind);card.appendChild(badge);
   card.appendChild(node("h3","",t.name));
   card.appendChild(node("p","",t.why));
   // The existing course event delegation opens this in the activity dialog.
   const button=node("button","btn primary","Open studio");button.type="button";button.dataset.launchTitle=t.name;button.dataset.launchUrl=t.url;
   card.appendChild(button);card.appendChild(openLink(t));grid.appendChild(card);
  });
 }
 select.addEventListener("change",paint);paint();
}
const id=document.body?.dataset?.lessonId;
if(/^u\d{2}-l\d{2}$/.test(id||""))lessonUI(id);
else{
 const unit=Number(location.pathname.match(/\/units\/unit-(\d{2})\/(?:index\.html)?$/)?.[1]||0);
 if(unit>=1&&unit<=13)unitUI(unit);
 else campusUI();
}
window.CALC1_SHARED_MATH_TOOLS=Object.freeze({sourceRepo:"vervenveda/Khaemenes_High.github.io",tools:TOOLS,units:UNITS,lessons:LESSONS,idsForLesson,idsForUnit});
})();
