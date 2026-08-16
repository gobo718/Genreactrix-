/* Genreactrix Housekeeping Engine v2 — v0.9.40.71 recycle-expiry diagnostic
   Scheduled local non-AI operational recovery and retention.
   Housekeeping never launches/retries AI and never retries Quarantine.
   Temporary diagnostic is query-gated and hard-scoped to one known throwaway Image ID. */
(()=>{'use strict';
const MARKER_PREFIX='genreactrix-housekeeping-last-daily-v2';
const RECYCLE_DIAGNOSTIC_PARAM='recycleExpiryTest';
const RECYCLE_DIAGNOSTIC_IMAGE_ID='local-4d42e378-25ce-4654-a7e3-12497e01665b';
const RECYCLE_DIAGNOSTIC_FILENAME_PREFIX='PURGATORY_TEST_';
const now=()=>new Date().toISOString();
const clone=v=>v==null?v:structuredClone(v);
function localDay(){const d=new Date(),y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return`${y}-${m}-${day}`}
async function context(){const ctx=window.genreactrixProjectRuntimeEngine;if(ctx?.ready)await ctx.ready;return{projectId:String(ctx?.projectId?.()||window.genreactrixSettingsEngine?.get?.('project.id')||'project-local'),runtimeId:String(ctx?.runtimeId?.()||'runtime-local')}}
function markerKey({projectId,runtimeId}){return`${MARKER_PREFIX}:${projectId}:${runtimeId}`}
async function lastDaily(){const scope=await context();try{return localStorage.getItem(markerKey(scope))||null}catch{return null}}
async function runDaily({force=false}={}){
  const day=localDay(),scope=await context(),key=markerKey(scope),last=(()=>{try{return localStorage.getItem(key)||''}catch{return''}})();
  if(!force&&last===day)return{day,projectId:scope.projectId,runtimeId:scope.runtimeId,skipped:true,reason:'already-run'};
  const result={day,projectId:scope.projectId,runtimeId:scope.runtimeId,startedAt:now(),purgatory:null,originSource:null,recycle:null,errors:[]};
  try{const batchReady=window.genreactrixBatchEngine?.ready;if(batchReady&&typeof batchReady.then==='function')await batchReady}catch(error){result.errors.push({engine:'batch-recovery',message:String(error?.message||error)})}
  try{result.purgatory=await window.genreactrixPostProcessingEngine?.retryDaily?.({date:day})||{eligible:0,results:[]}}catch(error){result.errors.push({engine:'post-processing',message:String(error?.message||error)})}
  try{result.originSource=await window.genreactrixOriginGateEngine?.retryDailySourceCases?.({date:day})||{eligible:0,results:[]}}catch(error){result.errors.push({engine:'origin-source',message:String(error?.message||error)})}
  let imagePreparationOk=true;try{const prep=window.genreactrixImagesStartupReady;if(prep&&typeof prep.then==='function')await prep}catch(error){imagePreparationOk=false;result.errors.push({engine:'image-startup-preparation',message:String(error?.message||error)})}
  if(imagePreparationOk)try{result.recycle=await window.genreactrixImagesEngine?.purgeExpired?.()||{purged:0,freed:0}}catch(error){result.errors.push({engine:'recycle',message:String(error?.message||error)})}else result.recycle={skipped:true,reason:'image-startup-preparation-failed'};
  result.completedAt=now();
  if(!result.errors.length)try{localStorage.setItem(key,day)}catch{}
  window.dispatchEvent(new CustomEvent('genreactrix:housekeeping',{detail:clone(result)}));return result;
}
async function verify(){const scope=await context(),issues=[];if(!scope.projectId)issues.push({type:'housekeeping-missing-project',severity:'attention'});if(!scope.runtimeId)issues.push({type:'housekeeping-missing-runtime',severity:'attention'});return{checkedAt:now(),projectId:scope.projectId,runtimeId:scope.runtimeId,lastDaily:await lastDaily(),issueCount:issues.length,issues}}
function recycleDiagnosticRequested(){try{return new URLSearchParams(location.search).get(RECYCLE_DIAGNOSTIC_PARAM)==='1'}catch{return false}}
function clearRecycleDiagnosticParam(){try{const url=new URL(location.href);url.searchParams.delete(RECYCLE_DIAGNOSTIC_PARAM);history.replaceState(history.state,'',url.pathname+(url.searchParams.toString()?`?${url.searchParams.toString()}`:'')+url.hash)}catch{}}
function diagnosticFilename(record){return String(record?.source?.originalFilename||record?.source?.originalLocation||record?.name||'')}
async function runRecycleExpiryDiagnostic(){
  const records=window.genreactrixImageRecordEngine,images=window.genreactrixImagesEngine,post=window.genreactrixPostProcessingEngine,origin=window.genreactrixOriginGateEngine,settings=window.genreactrixSettingsEngine;
  try{
    const prep=window.genreactrixImagesStartupReady;if(prep&&typeof prep.then==='function')await prep;
    if(!records?.get||!records?.update||!images?.allRecords||!images?.moveToRecycle||!images?.purgeExpired)throw new Error('Recycle diagnostic dependencies are unavailable.');
    let record=records.get(RECYCLE_DIAGNOSTIC_IMAGE_ID,{touch:false});
    if(!record)throw new Error('The designated throwaway test image is not present in this browser data.');
    const filename=diagnosticFilename(record);
    if(!filename.startsWith(RECYCLE_DIAGNOSTIC_FILENAME_PREFIX))throw new Error('Safety gate refused the diagnostic because the designated Image ID no longer has a PURGATORY_TEST_ filename.');
    const approved=confirm(`Controlled Recycle expiry test\n\nTarget only: ${filename}\n${RECYCLE_DIAGNOSTIC_IMAGE_ID}\n\nThis will place only this throwaway image in Recycle if needed, backdate only its Recycle timestamp past the configured retention period, and force one normal Daily Housekeeping run.\n\nThe test aborts before changing anything if Purgatory/source-retry work exists or another Recycle item is already expired.\n\nRun test?`);
    if(!approved)return{cancelled:true};
    const purgatory=post?.purgatoryPlans?await post.purgatoryPlans():[];
    if(purgatory.length)throw new Error(`Safety stop: ${purgatory.length} unresolved Purgatory item${purgatory.length===1?'':'s'} would also be eligible for Daily Housekeeping.`);
    const originSnapshot=origin?.snapshot?await origin.snapshot():{sourceRetry:0};
    if(Number(originSnapshot?.sourceRetry)||0)throw new Error(`Safety stop: ${originSnapshot.sourceRetry} Origin source-retry case${originSnapshot.sourceRetry===1?' is':'s are'} pending and would also be eligible for Daily Housekeeping.`);
    const retentionDays=Number(settings?.get?.('recycle.retentionDays',30));
    if(!Number.isFinite(retentionDays)||retentionDays<=0)throw new Error('Recycle retention is disabled or invalid; set it above 0 days before this test.');
    const cutoffMs=Date.now()-retentionDays*86400000,safetyMs=5*60000;
    const otherNearExpiry=images.allRecords().filter(r=>String(r.id)!==RECYCLE_DIAGNOSTIC_IMAGE_ID&&r.attributes?.inRecycleBin&&!r.attributes?.saved&&r.storage?.recycle?.deletedAt&&Date.parse(r.storage.recycle.deletedAt)<cutoffMs+safetyMs);
    if(otherNearExpiry.length)throw new Error(`Safety stop: ${otherNearExpiry.length} other Recycle item${otherNearExpiry.length===1?' is':'s are'} already expired or within five minutes of expiry.`);
    if(!record.attributes?.inRecycleBin){
      await images.moveToRecycle(RECYCLE_DIAGNOSTIC_IMAGE_ID);
      record=records.get(RECYCLE_DIAGNOSTIC_IMAGE_ID,{touch:false});
      if(!record?.attributes?.inRecycleBin)throw new Error('The throwaway image could not be placed in Recycle.');
    }
    const agedAt=new Date(cutoffMs-86400000).toISOString();
    records.update(RECYCLE_DIAGNOSTIC_IMAGE_ID,{storage:{recycle:{deletedAt:agedAt}}},'diagnostic-recycle-expiry-aged');
    const result=await runDaily({force:true}),after=records.get(RECYCLE_DIAGNOSTIC_IMAGE_ID,{touch:false});
    const thumbnail=images.thumbnailBlobGet?await images.thumbnailBlobGet(RECYCLE_DIAGNOSTIC_IMAGE_ID).catch(()=>null):null;
    const purged=Number(result?.recycle?.purged)||0,passed=Boolean(after&&!after.attributes?.inRecycleBin&&after.storage?.mode!=='recycle'&&purged>=1&&thumbnail);
    const message=passed
      ?`PASS — Daily Housekeeping purged the expired full-resolution throwaway image.\n\nRecycle purged: ${purged}\nPermanent Image Record: present\n64×64 thumbnail: present\nAI/Quarantine: not invoked`
      :`INCOMPLETE — controlled Recycle expiry test did not meet every acceptance condition.\n\nRecycle purged: ${purged}\nStill in Recycle: ${Boolean(after?.attributes?.inRecycleBin)}\nThumbnail present: ${Boolean(thumbnail)}\n\nDo not repeat the test; show this message.`;
    alert(message);
    return{passed,purged,thumbnailPresent:Boolean(thumbnail),recordPresent:Boolean(after),stillInRecycle:Boolean(after?.attributes?.inRecycleBin),result};
  }catch(error){alert(`Recycle expiry diagnostic stopped safely.\n\n${String(error?.message||error)}\n\nNo broad Recycle purge was intentionally started.`);throw error}
  finally{clearRecycleDiagnosticParam()}
}
const api={runDaily,lastDaily,verify,markerKey};window.genreactrixHousekeepingEngine=api;
window.addEventListener('DOMContentLoaded',()=>window.genreactrixMaintenanceEngine?.registerChecker?.('housekeeping',verify,{quick:true,label:'Daily Housekeeping'}));
window.addEventListener('load',()=>{setTimeout(()=>{if(recycleDiagnosticRequested())runRecycleExpiryDiagnostic().catch(error=>console.warn('Recycle expiry diagnostic failed',error));else runDaily().catch(error=>console.warn('Daily Housekeeping failed',error))},0)});
})();
