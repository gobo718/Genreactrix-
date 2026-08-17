/* Genreactrix Housekeeping Engine v2 — v0.9.40.76 Retry Import Source diagnostic
   Scheduled local non-AI operational recovery and retention.
   Housekeeping never launches/retries AI and never retries Quarantine.
   Temporary diagnostic tests only Retry Import Source versus true Import Failure. */
(()=>{'use strict';
const MARKER_PREFIX='genreactrix-housekeeping-last-daily-v2';
const ORIGIN_DIAGNOSTIC_PARAM='housekeepingOriginSourceTest';
const ORIGIN_DIAGNOSTIC_IMAGE_ID='local-4d42e378-25ce-4654-a7e3-12497e01665b';
const ORIGIN_DIAGNOSTIC_FILENAME='PURGATORY_TEST_picture0251125_162310.jpg';
const ORIGIN_DB='genreactrix-origin-gates',ORIGIN_STORE='cases';
const IMAGE_DB='genreactrix-image-engine',IMAGE_BLOB_STORE='image-blobs',IMAGE_HISTORY_STORE='history-events';
const IMAGE_RECORDS_KEY='genreactrix-image-records-v1';
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
function diagnosticRequested(){try{return new URLSearchParams(location.search).get(ORIGIN_DIAGNOSTIC_PARAM)==='1'}catch{return false}}
function clearDiagnosticParam(){try{const url=new URL(location.href);url.searchParams.delete(ORIGIN_DIAGNOSTIC_PARAM);history.replaceState(history.state,'',url.pathname+(url.searchParams.toString()?`?${url.searchParams.toString()}`:'')+url.hash);if(window.parent&&window.parent!==window)window.parent.postMessage({type:'genreactrix:clear-query-param',param:ORIGIN_DIAGNOSTIC_PARAM},location.origin)}catch{}}
function diagnosticFilename(record){return String(record?.source?.originalFilename||record?.source?.originalLocation||record?.name||'')}
function diagnosticPanel(){
  let panel=document.getElementById('housekeepingOriginSourceDiagnosticPanel');
  if(panel)return panel;
  panel=document.createElement('div');panel.id='housekeepingOriginSourceDiagnosticPanel';
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
    const h=document.createElement('h2');h.textContent='READY — Housekeeping test #4';h.style.margin='0 0 16px';panel.append(h);
    for(const line of [`Target: ${filename}`,'Diagnostic trigger reached the Genreactrix app.','This will seed one temporary Retry Import Source case and one temporary true Import Failure case, run real Daily Housekeeping once, verify only Retry Import Source was retried, then clean all temporary state.','Expected: Retry Import Source resolves with one Housekeeping retry. True Import Failure remains blocked with no new retry. AI and Quarantine are outside the Daily Housekeeping call path.']){const p=document.createElement('p');p.textContent=line;p.style.margin='10px 0';panel.append(p)}
    const row=document.createElement('div');Object.assign(row.style,{display:'flex',gap:'10px',flexWrap:'wrap',marginTop:'18px'});
    const run=document.createElement('button');run.type='button';run.textContent='Run test #4';Object.assign(run.style,{padding:'11px 22px',font:'inherit',fontWeight:'700'});
    const cancel=document.createElement('button');cancel.type='button';cancel.textContent='Cancel';Object.assign(cancel.style,{padding:'11px 22px',font:'inherit'});
    const finish=value=>{run.disabled=true;cancel.disabled=true;resolve(value)};
    run.onclick=()=>finish(true);cancel.onclick=()=>finish(false);row.append(run,cancel);panel.append(row);
  });
}
function openDb(name,version){return new Promise((resolve,reject)=>{const r=version?indexedDB.open(name,version):indexedDB.open(name);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||new Error(`Could not open ${name}`))})}
async function dbGet(dbName,store,id){const db=await openDb(dbName);try{return await new Promise((resolve,reject)=>{if(!db.objectStoreNames.contains(store)){resolve(null);return}const tx=db.transaction(store),r=tx.objectStore(store).get(id);r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error)})}finally{db.close()}}
async function dbPut(dbName,store,value){const db=await openDb(dbName);try{if(!db.objectStoreNames.contains(store))throw new Error(`${store} store is unavailable`);await new Promise((resolve,reject)=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).put(clone(value));tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}finally{db.close()}}
async function dbDelete(dbName,store,id){const db=await openDb(dbName);try{if(!db.objectStoreNames.contains(store))return;await new Promise((resolve,reject)=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).delete(String(id));tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}finally{db.close()}}
async function deleteHistoryEntries(ids=[]){if(!ids.length)return;const db=await openDb(IMAGE_DB);try{if(!db.objectStoreNames.contains(IMAGE_HISTORY_STORE))return;await new Promise((resolve,reject)=>{const tx=db.transaction(IMAGE_HISTORY_STORE,'readwrite'),store=tx.objectStore(IMAGE_HISTORY_STORE);for(const id of ids)store.delete(String(id));tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}finally{db.close()}}
function persistMutableRecord(records,snapshot){const live=records?._mutable?.(snapshot.id);if(!live)throw new Error('Diagnostic target Image Record disappeared during cleanup');for(const key of Object.keys(live))delete live[key];Object.assign(live,clone(snapshot));try{localStorage.setItem(IMAGE_RECORDS_KEY,JSON.stringify(records.all()))}catch(error){throw new Error(`Could not restore Image Record persistence: ${error?.message||error}`)}}
function seedMutableStage(records,original){const live=records?._mutable?.(original.id);if(!live)throw new Error('Diagnostic target Image Record is unavailable');live.workflow={...live.workflow,stage:'origin-source-retry'};live.metadata={...live.metadata,extended:{...(live.metadata?.extended||{}),sourceRetryPriorStage:original.workflow?.stage||'staged',sourceRetryStartedAt:now()}};live.updatedAt=now();localStorage.setItem(IMAGE_RECORDS_KEY,JSON.stringify(records.all()))}
function originCaseBase({id,type,status,source,candidate,matchedImageId=null,evidence={},error='',scope}){const at=now();return{id,schemaVersion:2,projectId:scope.projectId,runtimeId:scope.runtimeId,type,status,createdAt:at,updatedAt:at,sourceKey:source.originalUrl?`url:${String(source.originalUrl).trim()}`:`file:${source.originalFilename||source.originalLocation||''}|${Number(source.size)||0}|${Number(source.lastModified)||0}`,source:clone(source),candidate:{id:`candidate_${id}`,...clone(candidate)},matchedImageId:matchedImageId?String(matchedImageId):null,evidence:clone(evidence),error:String(error||''),importJobId:null,packId:null,attempts:[{at,kind:'initial',success:false,error:String(error||'Initial diagnostic failure')}],resolution:null}}
async function runOriginSourceDiagnostic(){
  const records=window.genreactrixImageRecordEngine,images=window.genreactrixImagesEngine,origin=window.genreactrixOriginGateEngine,post=window.genreactrixPostProcessingEngine,historyEngine=window.genreactrixHistoryEngine,settings=window.genreactrixSettingsEngine;
  let original=null,sourceCaseId='',failureCaseId='',recoveryUrl='',marker='',priorMarker=null,sourceSeeded=false,failureSeeded=false,recordSeeded=false,report=null,cleanupErrors=[],historyBefore=new Set();
  try{
    const prep=window.genreactrixImagesStartupReady;if(prep&&typeof prep.then==='function')await prep;
    if(!records?.get||!records?._mutable||!images?.thumbnailBlobGet||!origin?.get||!origin?.snapshot||!post?.purgatoryPlans||!historyEngine?.timeline)throw new Error('Housekeeping test #4 dependencies are unavailable.');
    original=records.get(ORIGIN_DIAGNOSTIC_IMAGE_ID,{touch:false});if(!original)throw new Error('The designated dated throwaway image is not present in this browser data.');
    const filename=diagnosticFilename(original);if(filename!==ORIGIN_DIAGNOSTIC_FILENAME)throw new Error(`Safety gate refused the test. Expected ${ORIGIN_DIAGNOSTIC_FILENAME}; found ${filename||'no filename'}.`);
    if(original.attributes?.locked||original.attributes?.saved||original.attributes?.inRecycleBin||String(original.workflow?.stage)!=='staged')throw new Error(`Safety gate expected the dated throwaway record to be unlocked, not Keep, not Recycle, and staged. Current stage: ${original.workflow?.stage||'unknown'}.`);
    if(original.storage?.hyperlink||original.source?.originalUrl)throw new Error('Safety gate requires the local-file throwaway to have no recoverable remote source.');
    const existingBlob=await dbGet(IMAGE_DB,IMAGE_BLOB_STORE,ORIGIN_DIAGNOSTIC_IMAGE_ID);if(existingBlob)throw new Error('Safety gate expected the dated throwaway full-resolution asset to remain purged before this test.');
    const thumbnail=await images.thumbnailBlobGet(original.storage?.thumbnailKey||original.id).catch(()=>null);if(!thumbnail)throw new Error('Safety gate requires the dated throwaway 64×64 thumbnail.');
    const existingPurgatory=await post.purgatoryPlans();if(existingPurgatory.length)throw new Error(`Safety stop: ${existingPurgatory.length} real Purgatory item${existingPurgatory.length===1?' is':'s are'} already present.`);
    const sourceSnapshot=await origin.snapshot();if(Number(sourceSnapshot?.sourceRetry)||0)throw new Error(`Safety stop: ${sourceSnapshot.sourceRetry} real Retry Import Source case${sourceSnapshot.sourceRetry===1?' is':'s are'} already pending.`);
    const retentionDays=Number(settings?.get?.('recycle.retentionDays',30));if(Number.isFinite(retentionDays)&&retentionDays>0){const cutoff=Date.now()-retentionDays*86400000,near=images.allRecords?.().filter(r=>r.attributes?.inRecycleBin&&!r.attributes?.saved&&r.storage?.recycle?.deletedAt&&Date.parse(r.storage.recycle.deletedAt)<cutoff+5*60000)||[];if(near.length)throw new Error(`Safety stop: ${near.length} other Recycle item${near.length===1?' is':'s are'} expired or within five minutes of expiry.`)}
    const approved=await requestDiagnosticApproval(filename);if(!approved){clearDiagnosticParam();renderDiagnosticPanel('INCOMPLETE','Daily Housekeeping Retry Import Source',['Test cancelled before any temporary Origin case was created.']);return}
    renderDiagnosticPanel('RUNNING','Housekeeping test #4',[`Target: ${filename}`,'Step 1/3: preparing one Retry Import Source case and one true Import Failure case…']);
    const scope=await context();marker=markerKey(scope);try{priorMarker=localStorage.getItem(marker)}catch{}
    const timeline=await historyEngine.timeline(original.id);historyBefore=new Set(timeline.map(x=>String(x.entryId)));
    recoveryUrl=URL.createObjectURL(thumbnail);
    const stamp=Date.now();sourceCaseId=`origin_diagnostic_source_${stamp}`,failureCaseId=`origin_diagnostic_failure_${stamp}`;
    const source={type:'url',originalLocation:recoveryUrl,originalUrl:recoveryUrl,originalFilename:filename,importMethod:'diagnostic-source-recovery',size:thumbnail.size||0,mimeType:thumbnail.type||'image/webp'};
    const sourceCase=originCaseBase({id:sourceCaseId,type:'source-retry',status:'retry-pending',source,candidate:{name:filename,mode:'temporary'},matchedImageId:original.id,evidence:{kind:'diagnostic-housekeeping-source-retry',priorStage:original.workflow?.stage||'staged'},error:'Controlled diagnostic: full-resolution source unavailable.',scope});
    const failureSource={type:'file',originalLocation:'HOUSEKEEPING_TEST_TRUE_IMPORT_FAILURE.jpg',originalFilename:'HOUSEKEEPING_TEST_TRUE_IMPORT_FAILURE.jpg',importMethod:'diagnostic',size:12345,lastModified:stamp,mimeType:'image/jpeg'};
    const failureCase=originCaseBase({id:failureCaseId,type:'import-failure',status:'blocked',source:failureSource,candidate:{name:failureSource.originalFilename,mode:'origin-only'},error:'Controlled diagnostic: true Import Failure must remain manual-only.',scope});
    await dbPut(ORIGIN_DB,ORIGIN_STORE,sourceCase);sourceSeeded=true;await dbPut(ORIGIN_DB,ORIGIN_STORE,failureCase);failureSeeded=true;seedMutableStage(records,original);recordSeeded=true;
    renderDiagnosticPanel('RUNNING','Housekeeping test #4',[`Target: ${filename}`,'Step 2/3: running real Daily Housekeeping once…']);
    const result=await runDaily({force:true});await new Promise(resolve=>setTimeout(resolve,120));
    const sourceAfter=await origin.get(sourceCaseId),failureAfter=await origin.get(failureCaseId),workingAfter=await dbGet(IMAGE_DB,IMAGE_BLOB_STORE,original.id),recordAfter=records.get(original.id,{touch:false});
    const sourceRetryRows=(sourceAfter?.attempts||[]).filter(a=>a.kind==='retry');
    const failureRetryRows=(failureAfter?.attempts||[]).filter(a=>a.kind==='retry');
    const callPath=Function.prototype.toString.call(runDaily),noAiCall=!/genreactrix(?:AI|Ai)AnalysisEngine|GenreactrixCloudApi/.test(callPath),noQuarantineCall=!/genreactrixQuarantineEngine|quarantine/i.test(callPath);
    const passed=Boolean(
      Number(result?.originSource?.eligible)===1&&result?.originSource?.results?.length===1&&result.originSource.results[0]?.id===sourceCaseId&&result.originSource.results[0]?.ok===true&&
      sourceAfter?.status==='resolved'&&sourceRetryRows.length===1&&sourceRetryRows[0]?.success===true&&sourceRetryRows[0]?.resultType==='source-recovered'&&
      failureAfter?.status==='blocked'&&failureRetryRows.length===0&&(failureAfter?.attempts||[]).length===1&&!failureAfter?.resolution&&
      Boolean(workingAfter)&&String(recordAfter?.workflow?.stage||'')===String(original.workflow?.stage||'staged')&&
      !result?.errors?.length&&noAiCall&&noQuarantineCall
    );
    report={passed,eligible:Number(result?.originSource?.eligible)||0,sourceStatus:sourceAfter?.status||'missing',sourceRetries:sourceRetryRows.length,failureStatus:failureAfter?.status||'missing',failureRetries:failureRetryRows.length,workingRecovered:Boolean(workingAfter),recordStage:recordAfter?.workflow?.stage||'missing',noAiCall,noQuarantineCall};
    renderDiagnosticPanel('RUNNING','Housekeeping test #4',['Step 3/3: test finished; cleaning all temporary Origin and working-asset state…']);
  }catch(error){report={passed:false,error:String(error?.message||error)}}
  finally{
    if(sourceSeeded)try{await dbDelete(ORIGIN_DB,ORIGIN_STORE,sourceCaseId)}catch(error){cleanupErrors.push(`Retry Import Source case cleanup: ${error?.message||error}`)}
    if(failureSeeded)try{await dbDelete(ORIGIN_DB,ORIGIN_STORE,failureCaseId)}catch(error){cleanupErrors.push(`Import Failure case cleanup: ${error?.message||error}`)}
    if(recordSeeded){
      try{await dbDelete(IMAGE_DB,IMAGE_BLOB_STORE,ORIGIN_DIAGNOSTIC_IMAGE_ID);await window.genreactrixProjectRuntimeEngine?.markAsset?.(ORIGIN_DIAGNOSTIC_IMAGE_ID,'working-fullres','deleted',{database:IMAGE_DB,store:IMAGE_BLOB_STORE,storageKey:ORIGIN_DIAGNOSTIC_IMAGE_ID})}catch(error){cleanupErrors.push(`working asset cleanup: ${error?.message||error}`)}
      if(original)try{persistMutableRecord(records,original);window.dispatchEvent(new CustomEvent('genreactrix:image-record',{detail:{type:'external-refresh',imageId:original.id,record:clone(original)}}))}catch(error){cleanupErrors.push(`Image Record cleanup: ${error?.message||error}`)}
      if(original)try{await new Promise(resolve=>setTimeout(resolve,120));const after=await historyEngine.timeline(original.id),newIds=after.map(x=>String(x.entryId)).filter(id=>!historyBefore.has(id));await deleteHistoryEntries(newIds)}catch(error){cleanupErrors.push(`history cleanup: ${error?.message||error}`)}
    }
    if(recoveryUrl)try{URL.revokeObjectURL(recoveryUrl)}catch{}
    if(marker)try{priorMarker==null?localStorage.removeItem(marker):localStorage.setItem(marker,priorMarker)}catch(error){cleanupErrors.push(`daily marker restore: ${error?.message||error}`)}
    clearDiagnosticParam();
    if(report){
      const passed=Boolean(report.passed&&!cleanupErrors.length),lines=report.error?[report.error]:[
        `Retry Import Source: Housekeeping eligible ${report.eligible}; case ${report.sourceStatus}; retry attempts ${report.sourceRetries} (expected 1 successful retry).`,
        `True Import Failure: case ${report.failureStatus}; retry attempts ${report.failureRetries} (expected 0).`,
        `Recovered working source during test: ${report.workingRecovered?'yes':'no'}; Image Record returned to ${report.recordStage}.`,
        `Daily Housekeeping AI call path: ${report.noAiCall?'absent':'FOUND'}.`,
        `Daily Housekeeping Quarantine call path: ${report.noQuarantineCall?'absent':'FOUND'}.`,
        'Temporary Origin cases, recovered working asset, Image Record changes, and diagnostic history: cleaned up.'
      ];
      if(cleanupErrors.length)lines.push(`Cleanup warning: ${cleanupErrors.join(' | ')}`);
      renderDiagnosticPanel(passed?'PASS':'INCOMPLETE','Daily Housekeeping Retry Import Source',lines)
    }
  }
}
const api={runDaily,lastDaily,verify,markerKey};window.genreactrixHousekeepingEngine=api;
window.addEventListener('DOMContentLoaded',()=>window.genreactrixMaintenanceEngine?.registerChecker?.('housekeeping',verify,{quick:true,label:'Daily Housekeeping'}));
window.addEventListener('load',()=>{setTimeout(()=>{if(diagnosticRequested())runOriginSourceDiagnostic().catch(error=>renderDiagnosticPanel('INCOMPLETE','Daily Housekeeping Retry Import Source',[String(error?.message||error)]));else runDaily().catch(error=>console.warn('Daily Housekeeping failed',error))},0)});
})();
