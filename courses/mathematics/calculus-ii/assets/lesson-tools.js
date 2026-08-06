(() => {
"use strict";
const id=document.body.dataset.lessonId;
if(!id)return;
const KEY="khaemenes-calculus2-lesson-progress-v1";
function load(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch{return {}}}
function save(data){try{localStorage.setItem(KEY,JSON.stringify(data))}catch{}}
let data=load(),rec=data[id]||{complete:false,note:"",updated:null};
const box=document.getElementById("lessonComplete");
const note=document.getElementById("lessonNote");
const status=document.getElementById("lessonStatus");
if(box)box.checked=!!rec.complete;
if(note)note.value=rec.note||"";
function updateStatus(){if(status)status.textContent=rec.complete?"Marked complete on this device.":"Not yet marked complete."}
box?.addEventListener("change",()=>{rec.complete=box.checked;rec.updated=new Date().toISOString();data[id]=rec;save(data);updateStatus()});
document.getElementById("saveLessonNote")?.addEventListener("click",()=>{rec.note=note.value.trim();rec.updated=new Date().toISOString();data[id]=rec;save(data);alert("Lesson note saved locally.")});
document.getElementById("printLesson")?.addEventListener("click",()=>print());
updateStatus();
})();