/* Genreactrix Housekeeping Engine v2 — v0.9.40.73 Purgatory daily-retry diagnostic
   Scheduled local non-AI operational recovery and retention.
   Housekeeping never launches/retries AI and never retries Quarantine.
   Temporary diagnostic is query-gated and hard-scoped to one known throwaway Image ID. */
(()=>{'use strict';
const MARKER_PREFIX='genreactrix-housekeeping-last-daily-v2';
const PURGATORY_DIAGNOSTIC_PARAM='housekeepingPurgatoryTest';
const PURGATORY_DIAGNOSTIC_IMAGE_ID='local-4d42e378-25ce-4654-a7e3-12497e01665b';
const PURGATORY_DIAGNOSTIC_FILENAME_PREFIX='PURGATORY_TEST_';
const PURGATORY_DIAGNOSTIC_TOKEN_PREFIX='diagnostic-housekeeping-purgatory-v0.9.40.73';
const POST_DB='genreactrix-post-processing-engine-v1',POST_STORE='plans';
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
function diagnosticRequested(){try{return new URLSearchParams(location.search).get(PURGATORY_DIAGNOSTIC_PARAM)==='1'}catch{return false}}
function clearDiagnosticParam(){try{const url=new URL(location.href);url.searchParams.delete(PURGATORY_DIAGNOSTIC_PARAM);history.replaceState(history.state,'',url.pathname+(url.searchParams.toString()?`?${url.searchParams.toString()}`:'')+url.hash)}catch{}}
function diagnosticFilename(record){return String(record?.source?.originalFilename||record?.source?.originalLocation||record?.name||'')}
async function deleteDiagnosticPlans(token){
  const db=await new Promise((resolve,reject)=>{const r=indexedDB.open(POST_DB);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||new Error('Could not open Post-processing journal for diagnostic cleanup'))});
  try{
    if(!db.objectStoreNames.contains(POST_STORE))return 0;
    const rows=await new Promise((resolve,reject)=>{const tx=db.transaction(POST_STORE,'readonly'),r=tx.objectStore(POST_STORE).getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error);tx.onerror=()=>reject(tx.error)}),ids=rows.filter(p=>String(p.submissionToken||'')===String(token)).map(p=>p.id);
    if(!ids.length)return 0;
    await new Promise((resolve,reject)=>{const tx=db.transaction(POST_STORE,'readwrite'),store=tx.objectStore(POST_STORE);ids.forEach(id=>store.delete(id));tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)});return ids.length;
  }finally{db.close()}
}
function showDiagnosticResult({passed,title,lines=[]}){
  const old=document.getElementById('housekeepingPurgatoryDiagnosticResult');if(old)old.remove();
  const dialog=document.createElement('dialog');dialog.id='housekeepingPurgatoryDiagnosticResult';dialog.setAttribute('aria-label',title);
  Object.assign(dialog.style,{maxWidth:'min(92vw,620px)',width:'min(92vw,620px)',padding:'22px',borderRadius:'18px',border:'1px solid #75677f',background:'#09070d',color:'#f7f2fa',font:'16px system-ui,sans-serif',lineHeight:'1.45'});
  const h=document.createElement('h2');h.textContent=`${passed?'PASS':'INCOMPLETE'} — ${title}`;h.style.margin='0 0 16px';dialog.append(h);
  for(const line of lines){const p=document.createElement('p');p.textContent=String(line);p.style.margin='9px 0';dialog.append(p)}
  const button=document.createElement('button');button.type='button';button.textContent='Close';Object.assign(button.style,{marginTop:'18px',padding:'10px 20px',font:'inherit'});button.addEventListener('click',()=>dialog.close());dialog.append(button);dialog.addEventListener('close',()=>dialog.remove());document.body.append(dialog);dialog.showModal();
}
async function appendDiagnosticHistory(eventType,summary,payload){try{return await window.genreactrixHistoryEngine?.append?.({imageId:PURGATORY_DIAGNOSTIC_IMAGE_ID,eventType,actor:'system',sourceEngine:'housekeeping',summary,payload})}catch(error){console.warn('Housekeeping diagnostic history append failed',error);return null}}
async function runPurgatoryDailyDiagnostic(){
  const records=window.genreactrixImageRecordEngine,images=window.genreactrixImagesEngine,post=window.genreactrixPostProcessingEngine,origin=window.genreactrixOriginGateEngine,settings=window.genreactrixSettingsEngine;
  let submissionToken='',original=null,seeded=false,report=null;
  try{
    const prep=window.genreactrixImagesStartupReady;if(prep&&typeof prep.then==='function')await prep;
    if(!records?.get||!records?.update||!images?.displayFile||!post?.freezeBatchPlans||!post?.processSubmission||!post?.plansForSubmission||!post?.purgatoryPlans)throw new Error('Purgatory diagnostic dependencies are unavailable.');
    original=records.get(PURGATORY_DIAGNOSTIC_IMAGE_ID,{touch:false});if(!original)throw new Error('The designated throwaway test image is not present in this browser data.');
    const filename=diagnosticFilename(original);if(!filename.startsWith(PURGATORY_DIAGNOSTIC_FILENAME_PREFIX))throw new Error('Safety gate refused the diagnostic because the designated Image ID no longer has a PURGATORY_TEST_ filename.');
    if(original.attributes?.locked||original.attributes?.saved||original.attributes?.inRecycleBin||String(original.workflow?.stage)!=='staged')throw new Error(`Safety gate expected the throwaway record to be unlocked, not Keep, not Recycle, and staged. Current stage: ${original.workflow?.stage||'unknown'}.`);
    if(original.storage?.hyperlink||original.source?.originalUrl)throw new Error('Safety gate requires a local-file throwaway with no recoverable remote source.');
    const display=await images.displayFile(PURGATORY_DIAGNOSTIC_IMAGE_ID,{allowRecovery:false,reuseCached:false});if(!display?.isThumbnail||!display?.fullResolutionUnavailable)throw new Error('Safety gate requires the throwaway full-resolution asset to be absent while its permanent thumbnail remains.');const staleKept=images.keptBlobGet?await images.keptBlobGet(PURGATORY_DIAGNOSTIC_IMAGE_ID).catch(()=>null):null;if(staleKept)throw new Error('Safety gate found a retained Keep copy for the throwaway image; the controlled failure would not be deterministic.');
    const existingPurgatory=await post.purgatoryPlans();if(existingPurgatory.length)throw new Error(`Safety stop: ${existingPurgatory.length} existing Purgatory item${existingPurgatory.length===1?' is':'s are'} already present.`);
    const sourceSnapshot=origin?.snapshot?await origin.snapshot():{sourceRetry:0};if(Number(sourceSnapshot?.sourceRetry)||0)throw new Error(`Safety stop: ${sourceSnapshot.sourceRetry} Origin source-retry case${sourceSnapshot.sourceRetry===1?' is':'s are'} pending.`);
    const retentionDays=Number(settings?.get?.('recycle.retentionDays',30));if(Number.isFinite(retentionDays)&&retentionDays>0){const cutoff=Date.now()-retentionDays*86400000,near=images.allRecords?.().filter(r=>r.attributes?.inRecycleBin&&!r.attributes?.saved&&r.storage?.recycle?.deletedAt&&Date.parse(r.storage.recycle.deletedAt)<cutoff+5*60000)||[];if(near.length)throw new Error(`Safety stop: ${near.length} Recycle item${near.length===1?' is':'s are'} expired or within five minutes of expiry.`)}
    const approved=confirm(`Controlled Daily Housekeeping / Purgatory test\n\nTarget only: ${filename}\n${PURGATORY_DIAGNOSTIC_IMAGE_ID}\n\nThis will create a temporary Post-processing Purgatory plan for this already-purged throwaway image, generate the normal 3 automatic failures, run Daily Housekeeping twice, and verify that only the first run adds one DAILY retry.\n\nThe temporary plan and Purgatory state are removed after the test.\n\nRun test?`);if(!approved)return{cancelled:true};
    submissionToken=`${PURGATORY_DIAGNOSTIC_TOKEN_PREFIX}:${Date.now()}`;await deleteDiagnosticPlans(submissionToken);
    const batchId=`diagnostic-housekeeping-purgatory-${Date.now()}`;
    await post.freezeBatchPlans({batchId,submissionToken,submissionVersion:1,items:[{imageId:PURGATORY_DIAGNOSTIC_IMAGE_ID,terminal:'depot',keep:true,route:'keep',finalStage:'batched',sourceStorageMode:original.storage?.mode||'none',recordUpdatedAt:original.updatedAt||null,evaluationVersion:original.analysis?.evaluationVersion||null}]});seeded=true;
    await post.processSubmission(submissionToken);
    let plan=(await post.plansForSubmission(submissionToken))[0];const automaticCount=(plan?.attempts||[]).filter(a=>a.kind==='automatic').length;
    if(plan?.status!=='purgatory'||automaticCount!==3)throw new Error(`Controlled Purgatory seed did not reach exactly 3 automatic failures (status ${plan?.status||'missing'}, automatic ${automaticCount}).`);
    const first=await runDaily({force:true});plan=(await post.plansForSubmission(submissionToken))[0];const day=String(first?.day||localDay()),dailyAfterFirst=(plan?.attempts||[]).filter(a=>a.kind==='daily'&&String(a.dailyDate||'')===day).length,attemptsAfterFirst=plan?.attempts?.length||0;
    const second=await runDaily({force:true});plan=(await post.plansForSubmission(submissionToken))[0];const dailyAfterSecond=(plan?.attempts||[]).filter(a=>a.kind==='daily'&&String(a.dailyDate||'')===day).length,attemptsAfterSecond=plan?.attempts?.length||0;
    const passed=Boolean(first?.purgatory?.eligible===1&&dailyAfterFirst===1&&attemptsAfterFirst===4&&second?.purgatory?.eligible===0&&dailyAfterSecond===1&&attemptsAfterSecond===4&&plan?.status==='purgatory'&&!first?.errors?.length&&!second?.errors?.length);
    report={passed,day,automaticCount,firstEligible:Number(first?.purgatory?.eligible)||0,dailyAfterFirst,attemptsAfterFirst,secondEligible:Number(second?.purgatory?.eligible)||0,dailyAfterSecond,attemptsAfterSecond,status:plan?.status||'missing'};
    await appendDiagnosticHistory(passed?'diagnostic-housekeeping-purgatory-pass':'diagnostic-housekeeping-purgatory-incomplete',passed?'Daily Housekeeping Purgatory retry diagnostic passed':'Daily Housekeeping Purgatory retry diagnostic incomplete',clone(report));
    return report;
  }catch(error){report={passed:false,error:String(error?.message||error)};await appendDiagnosticHistory('diagnostic-housekeeping-purgatory-stopped','Daily Housekeeping Purgatory diagnostic stopped',clone(report));return report}
  finally{
    try{if(seeded&&submissionToken)await deleteDiagnosticPlans(submissionToken)}catch(error){console.warn('Diagnostic Post-processing plan cleanup failed',error)}
    try{if(seeded&&original)records?.update?.(PURGATORY_DIAGNOSTIC_IMAGE_ID,{workflow:{stage:original.workflow?.stage||'staged'},metadata:{extended:{activeBatchId:original.metadata?.extended?.activeBatchId||null}}},'diagnostic-housekeeping-purgatory-cleanup')}catch(error){console.warn('Diagnostic lifecycle cleanup failed',error)}
    clearDiagnosticParam();
    if(report){const lines=report.error?[report.error,'The test was stopped and cleanup was attempted. Do not rerun it; show this screen.']:[`Automatic seed attempts: ${report.automaticCount} (expected 3)`,`First Daily Housekeeping run: eligible ${report.firstEligible}; daily attempts ${report.dailyAfterFirst}; total attempts ${report.attemptsAfterFirst} (expected 4)`,`Second same-day Housekeeping run: eligible ${report.secondEligible}; daily attempts still ${report.dailyAfterSecond}; total attempts still ${report.attemptsAfterSecond} (expected unchanged)`,`Temporary Purgatory plan/state: cleaned up`,`AI/Quarantine: not invoked by Housekeeping`];setTimeout(()=>showDiagnosticResult({passed:Boolean(report.passed),title:'Daily Housekeeping Purgatory retry',lines}),0)}
  }
}
const api={runDaily,lastDaily,verify,markerKey};window.genreactrixHousekeepingEngine=api;
window.addEventListener('DOMContentLoaded',()=>window.genreactrixMaintenanceEngine?.registerChecker?.('housekeeping',verify,{quick:true,label:'Daily Housekeeping'}));
window.addEventListener('load',()=>{setTimeout(()=>{if(diagnosticRequested())runPurgatoryDailyDiagnostic().catch(error=>console.warn('Purgatory daily diagnostic failed',error));else runDaily().catch(error=>console.warn('Daily Housekeeping failed',error))},0)});
})();
