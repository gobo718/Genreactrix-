/* Genreactrix Housekeeping Engine v1
   Local non-AI operational recovery. It never launches or retries AI work. */
(()=>{'use strict';
const LAST_DAILY='genreactrix-housekeeping-last-daily-v1';
const now=()=>new Date().toISOString();
function localDay(){const d=new Date(),y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return`${y}-${m}-${day}`}
async function runDaily({force=false}={}){
  const day=localDay(),last=localStorage.getItem(LAST_DAILY)||'';if(!force&&last===day)return{day,skipped:true,reason:'already-run'};
  const result={day,startedAt:now(),purgatory:null,recycle:null,errors:[]};
  try{const batchReady=window.genreactrixBatchEngine?.ready;if(batchReady&&typeof batchReady.then==='function')await batchReady}catch(error){result.errors.push({engine:'batch-recovery',message:String(error?.message||error)})}
  try{result.purgatory=await window.genreactrixPostProcessingEngine?.retryDaily?.({date:day})||{eligible:0,results:[]}}catch(error){result.errors.push({engine:'post-processing',message:String(error?.message||error)})}
  try{result.recycle=await window.genreactrixImagesEngine?.purgeExpired?.()||{purged:0,freed:0}}catch(error){result.errors.push({engine:'recycle',message:String(error?.message||error)})}
  result.completedAt=now();
  if(!result.errors.length)localStorage.setItem(LAST_DAILY,day);
  window.dispatchEvent(new CustomEvent('genreactrix:housekeeping',{detail:structuredClone(result)}));return result;
}
const api={runDaily,lastDaily:()=>localStorage.getItem(LAST_DAILY)||null};window.genreactrixHousekeepingEngine=api;
window.addEventListener('load',()=>{setTimeout(()=>runDaily().catch(error=>console.warn('Daily Housekeeping failed',error)),0)});
})();
