/* Genreactrix Housekeeping Engine v2 — v0.9.40.75 Purgatory daily-retry diagnostic launcher repair
   Scheduled local non-AI operational recovery and retention.
   Housekeeping never launches/retries AI and never retries Quarantine.
   Temporary diagnostic seeds one isolated Purgatory journal row for the dated throwaway image. */
(()=>{'use strict';
const MARKER_PREFIX='genreactrix-housekeeping-last-daily-v2';
const PURGATORY_DIAGNOSTIC_PARAM='housekeepingPurgatoryTest';
const PURGATORY_DIAGNOSTIC_IMAGE_ID='local-4d42e378-25ce-4654-a7e3-12497e01665b';
const PURGATORY_DIAGNOSTIC_FILENAME='PURGATORY_TEST_picture0251125_162310.jpg';
const PURGATORY_DIAGNOSTIC_TOKEN_PREFIX='diagnostic-housekeeping-purgatory-v0.9.40.75';
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
function clearDiagnosticParam(){try{const url=new URL(location.href);url.searchParams.delete(PURGATORY_DIAGNOSTIC_PARAM);history.replaceState(history.state,'',url.pathname+(url.searchParams.toString()?`?${url.searchParams.toString()}`:'')+url.hash);if(window.parent&&window.parent!==window)window.parent.postMessage({type:'genreactrix:clear-query-param',param:PURGATORY_DIAGNOSTIC_PARAM},location.origin)}catch{}}
function diagnosticFilename(record){return String(record?.source?.originalFilename||record?.source?.originalLocation||record?.name||'')}
function diagnosticPanel(){
  let panel=document.getElementById('housekeepingPurgatoryDiagnosticPanel');
  if(panel)return panel;
  panel=document.createElement('div');panel.id='housekeepingPurgatoryDiagnosticPanel';
  Object.assign(panel.style,{position:'fixed',inset:'12px',zIndex:'2147483647',overflow:'auto',padding:'22px',borderRadius:'18px',border:'2px solid #75677f',background:'#09070d',color:'#f7f2fa',font:'16px system-ui,sans-serif',lineHeight:'1.45',boxShadow:'0 18px 60px rgba(0,0,0,.65)'});
  document.body.append(panel);return panel;
}
function renderDiagnosticPanel(state,title,lines=[]){
  const panel=diagnosticPanel();panel.replaceChildren();
  const h=document.createElement('h2');h.textContent=`${state} — ${title}`;h.style.margin='0 0 16px';panel.append(h);
  for(const line of lines){const p=document.createElement('p');p.textContent=String(line);p.style.margin='10px 0';panel.append(p)}
  if(state!=='RUNNING'){
    const b=document.createElement('button');b.type='button';b.textContent='Close';Object.assign(b.style,{marginTop:'18px',padding:'10px 22px',font:'inherit'});b.onclick=()=>panel.remove();panel.append(b);
  }
}
function requestDiagnosticApproval(filename){
  return new Promise(resolve=>{
    const panel=diagnosticPanel();panel.replaceChildren();
    const h=document.createElement('h2');h.textContent='READY — Housekeeping test #3';h.style.margin='0 0 16px';panel.append(h);
    for(const line of [`Target: ${filename}`,'Diagnostic trigger reached the Genreactrix app.','This will seed one temporary Purgatory journal entry, run real Daily Housekeeping twice, then clean the temporary state.','Expected: run 1 adds exactly one DAILY retry; run 2 on the same local day adds none.']){const p=document.createElement('p');p.textContent=line;p.style.margin='10px 0';panel.append(p)}
    const row=document.createElement('div');Object.assign(row.style,{display:'flex',gap:'10px',flexWrap:'wrap',marginTop:'18px'});
    const run=document.createElement('button');run.type='button';run.textContent='Run test #3';Object.assign(run.style,{padding:'11px 22px',font:'inherit',fontWeight:'700'});
    const cancel=document.createElement('button');cancel.type='button';cancel.textContent='Cancel';Object.assign(cancel.style,{padding:'11px 22px',font:'inherit'});
    const finish=value=>{run.disabled=true;cancel.disabled=true;resolve(value)};
    run.onclick=()=>finish(true);cancel.onclick=()=>finish(false);row.append(run,cancel);panel.append(row);
  });
}
async function openPostDb(){return new Promise((resolve,reject)=>{const r=indexedDB.open(POST_DB);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||new Error('Could not open Post-processing journal'))})}
async function postPut(row){const db=await openPostDb();try{if(!db.objectStoreNames.contains(POST_STORE))throw new Error('Post-processing plan store is unavailable');await new Promise((resolve,reject)=>{const tx=db.transaction(POST_STORE,'readwrite');tx.objectStore(POST_STORE).put(clone(row));tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}finally{db.close()}}
async function postDelete(id){const db=await openPostDb();try{if(!db.objectStoreNames.contains(POST_STORE))return;await new Promise((resolve,reject)=>{const tx=db.transaction(POST_STORE,'readwrite');tx.objectStore(POST_STORE).delete(String(id));tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}finally{db.close()}}
function seededAttempts(){const t=Date.now()-5000,error={message:'Controlled diagnostic seed: automatic Post-processing attempt failed.',name:'DiagnosticSeed',cleanupErrors:[],stack:''};return[1,2,3].map((attemptNumber,index)=>{const startedAt=new Date(t+index*1000).toISOString(),completedAt=new Date(t+index*1000+250).toISOString();return{attemptNumber,kind:'automatic',startedAt,completedAt,status:'failed',error:clone(error)}})}
async function runPurgatoryDailyDiagnostic(){
  const records=window.genreactrixImageRecordEngine,images=window.genreactrixImagesEngine,post=window.genreactrixPostProcessingEngine,origin=window.genreactrixOriginGateEngine,settings=window.genreactrixSettingsEngine;
  let original=null,planId='',marker='',priorMarker=null,seeded=false,report=null,cleanupErrors=[];
  try{
    const prep=window.genreactrixImagesStartupReady;if(prep&&typeof prep.then==='function')await prep;
    if(!records?.get||!records?.update||!images?.displayFile||!post?.plansForSubmission||!post?.purgatoryPlans||!post?.retryDaily)throw new Error('Purgatory diagnostic dependencies are unavailable.');
    original=records.get(PURGATORY_DIAGNOSTIC_IMAGE_ID,{touch:false});if(!original)throw new Error('The designated dated throwaway image is not present in this browser data.');
    const filename=diagnosticFilename(original);if(filename!==PURGATORY_DIAGNOSTIC_FILENAME)throw new Error(`Safety gate refused the test. Expected ${PURGATORY_DIAGNOSTIC_FILENAME}; found ${filename||'no filename'}.`);
    if(original.attributes?.locked||original.attributes?.saved||original.attributes?.inRecycleBin||String(original.workflow?.stage)!=='staged')throw new Error(`Safety gate expected the dated throwaway record to be unlocked, not Keep, not Recycle, and staged. Current stage: ${original.workflow?.stage||'unknown'}.`);
    if(original.storage?.hyperlink||original.source?.originalUrl)throw new Error('Safety gate requires the local-file throwaway to have no recoverable remote source.');
    const display=await images.displayFile(PURGATORY_DIAGNOSTIC_IMAGE_ID,{allowRecovery:false,reuseCached:false});if(!display?.isThumbnail||!display?.fullResolutionUnavailable)throw new Error('Safety gate expected the full-resolution ball image to be purged while its 64×64 thumbnail remains.');
    const existingPurgatory=await post.purgatoryPlans();if(existingPurgatory.length)throw new Error(`Safety stop: ${existingPurgatory.length} real Purgatory item${existingPurgatory.length===1?' is':'s are'} already present.`);
    const sourceSnapshot=origin?.snapshot?await origin.snapshot():{sourceRetry:0};if(Number(sourceSnapshot?.sourceRetry)||0)throw new Error(`Safety stop: ${sourceSnapshot.sourceRetry} Origin source-retry case${sourceSnapshot.sourceRetry===1?' is':'s are'} pending.`);
    const retentionDays=Number(settings?.get?.('recycle.retentionDays',30));if(Number.isFinite(retentionDays)&&retentionDays>0){const cutoff=Date.now()-retentionDays*86400000,near=images.allRecords?.().filter(r=>r.attributes?.inRecycleBin&&!r.attributes?.saved&&r.storage?.recycle?.deletedAt&&Date.parse(r.storage.recycle.deletedAt)<cutoff+5*60000)||[];if(near.length)throw new Error(`Safety stop: ${near.length} other Recycle item${near.length===1?' is':'s are'} expired or within five minutes of expiry.`)}
    const approved=await requestDiagnosticApproval(filename);if(!approved){clearDiagnosticParam();renderDiagnosticPanel('INCOMPLETE','Daily Housekeeping Purgatory retry',['Test cancelled before any temporary Purgatory state was created.']);return}
    renderDiagnosticPanel('RUNNING','Housekeeping test #3',[`Target: ${filename}`,'Step 1/4: preparing one temporary Purgatory journal entry…']);
    const scope=await context();marker=markerKey(scope);try{priorMarker=localStorage.getItem(marker)}catch{}
    const token=`${PURGATORY_DIAGNOSTIC_TOKEN_PREFIX}:${Date.now()}`,batchId=`diagnostic-housekeeping-purgatory-${Date.now()}`;planId=`post::${token}::${PURGATORY_DIAGNOSTIC_IMAGE_ID}`;
    const attempts=seededAttempts(),purgatoryAt=attempts.at(-1).completedAt,error=clone(attempts.at(-1).error);
    const plan={id:planId,schemaVersion:2,projectId:scope.projectId,runtimeId:scope.runtimeId,batchId,submissionToken:token,submissionVersion:1,imageId:PURGATORY_DIAGNOSTIC_IMAGE_ID,decision:{imageId:PURGATORY_DIAGNOSTIC_IMAGE_ID,terminal:'depot',keep:true,route:'keep',finalStage:'batched',sourceStorageMode:original.storage?.mode||'none',recordUpdatedAt:original.updatedAt||null,evaluationVersion:original.analysis?.evaluationVersion||null},status:'purgatory',createdAt:attempts[0].startedAt,updatedAt:purgatoryAt,completedAt:null,purgatoryAt,lastAttemptAt:purgatoryAt,lastSuccessAt:null,lastError:error,attempts,result:null};
    await postPut(plan);seeded=true;records.update(PURGATORY_DIAGNOSTIC_IMAGE_ID,{workflow:{stage:'purgatory'},metadata:{extended:{activeBatchId:batchId}}},'diagnostic-housekeeping-purgatory-seeded');
    renderDiagnosticPanel('RUNNING','Housekeeping test #3',[`Target: ${filename}`,'Step 2/4: running Daily Housekeeping once…']);
    const first=await runDaily({force:true});let current=(await post.plansForSubmission(token))[0];const day=String(first?.day||localDay()),dailyAfterFirst=(current?.attempts||[]).filter(a=>a.kind==='daily'&&String(a.dailyDate||'')===day).length,attemptsAfterFirst=current?.attempts?.length||0;
    renderDiagnosticPanel('RUNNING','Housekeeping test #3',[`Target: ${filename}`,`First run: eligible ${Number(first?.purgatory?.eligible)||0}; daily attempts ${dailyAfterFirst}; total attempts ${attemptsAfterFirst}.`,'Step 3/4: running Daily Housekeeping a second time on the same local day…']);
    const second=await runDaily({force:true});current=(await post.plansForSubmission(token))[0];const dailyAfterSecond=(current?.attempts||[]).filter(a=>a.kind==='daily'&&String(a.dailyDate||'')===day).length,attemptsAfterSecond=current?.attempts?.length||0;
    const passed=Boolean(first?.purgatory?.eligible===1&&dailyAfterFirst===1&&attemptsAfterFirst===4&&second?.purgatory?.eligible===0&&dailyAfterSecond===1&&attemptsAfterSecond===4&&current?.status==='purgatory'&&!first?.errors?.length&&!second?.errors?.length);
    report={passed,day,firstEligible:Number(first?.purgatory?.eligible)||0,dailyAfterFirst,attemptsAfterFirst,secondEligible:Number(second?.purgatory?.eligible)||0,dailyAfterSecond,attemptsAfterSecond,status:current?.status||'missing'};
    renderDiagnosticPanel('RUNNING','Housekeeping test #3',['Step 4/4: test finished; cleaning the temporary Purgatory entry…']);
  }catch(error){report={passed:false,error:String(error?.message||error)}}
  finally{
    if(seeded&&planId)try{await postDelete(planId)}catch(error){cleanupErrors.push(`plan cleanup: ${error?.message||error}`)}
    if(seeded&&original)try{records?.update?.(PURGATORY_DIAGNOSTIC_IMAGE_ID,{workflow:{stage:original.workflow?.stage||'staged'},metadata:{extended:{activeBatchId:original.metadata?.extended?.activeBatchId||null}}},'diagnostic-housekeeping-purgatory-cleanup')}catch(error){cleanupErrors.push(`record cleanup: ${error?.message||error}`)}
    if(marker)try{priorMarker==null?localStorage.removeItem(marker):localStorage.setItem(marker,priorMarker)}catch(error){cleanupErrors.push(`daily marker restore: ${error?.message||error}`)}
    clearDiagnosticParam();
    if(report){const passed=Boolean(report.passed&&!cleanupErrors.length),lines=report.error?[report.error]:[`First run: eligible ${report.firstEligible}; daily attempts ${report.dailyAfterFirst}; total attempts ${report.attemptsAfterFirst} (expected 4).`,`Second same-day run: eligible ${report.secondEligible}; daily attempts ${report.dailyAfterSecond}; total attempts ${report.attemptsAfterSecond} (expected unchanged).`,`Final temporary plan status before cleanup: ${report.status}.`,'Temporary Purgatory plan/state: cleaned up.','Normal Daily Housekeeping code: no AI or Quarantine calls.'];if(cleanupErrors.length)lines.push(`Cleanup warning: ${cleanupErrors.join(' | ')}`);renderDiagnosticPanel(passed?'PASS':'INCOMPLETE','Daily Housekeeping Purgatory retry',lines)}
  }
}
const api={runDaily,lastDaily,verify,markerKey};window.genreactrixHousekeepingEngine=api;
window.addEventListener('DOMContentLoaded',()=>window.genreactrixMaintenanceEngine?.registerChecker?.('housekeeping',verify,{quick:true,label:'Daily Housekeeping'}));
window.addEventListener('load',()=>{setTimeout(()=>{if(diagnosticRequested())runPurgatoryDailyDiagnostic().catch(error=>renderDiagnosticPanel('INCOMPLETE','Daily Housekeeping Purgatory retry',[String(error?.message||error)]));else runDaily().catch(error=>console.warn('Daily Housekeeping failed',error))},0)});
})();
