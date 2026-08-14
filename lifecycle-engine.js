/* Genreactrix Lifecycle Engine v1
   Canonical image lifecycle/state spine. Places own images; engines perform work. */
(()=>{'use strict';
 const STAGES=Object.freeze({
  IMPORT_FAILED:'import-failed',
  SOURCE_RETRY:'origin-source-retry',
  QUEUE_WAITING:'queued',
  AI_PROCESSING:'ai-processing',
  AI_PARTIAL:'ai-partial',
  STAGED:'staged',
  INBOX_WORKING:'inbox-working',
  POST_PROCESSING:'post-processing',
  PURGATORY:'purgatory',
  QUARANTINE:'quarantine',
  BATCHED:'batched',
  RED_EXCLUDED:'red-excluded',
  HOT_EXCLUDED:'hot-magenta-excluded',
  ARCHIVED:'archived'
 });
 const PRIMARY=['aiReactions','aiThemes','aiDescription'];
 const now=()=>new Date().toISOString();
 const clone=v=>v==null?v:structuredClone(v);
 function records(){return window.genreactrixImageRecordEngine?.all?.()||[];}
 function get(id){return window.genreactrixImageRecordEngine?.get?.(String(id),{touch:false})||null;}
 function membershipIds(record){
  const ext=record?.metadata?.extended||{};
  const current=[...(Array.isArray(ext.inboxBundleIds)?ext.inboxBundleIds:[]),...(Array.isArray(ext.inboxPackIds)?ext.inboxPackIds:[])];
  const history=[...(Array.isArray(ext.inboxHistoryBundleIds)?ext.inboxHistoryBundleIds:[]),...(Array.isArray(ext.inboxHistoryPackIds)?ext.inboxHistoryPackIds:[])];
  return {current:[...new Set(current.map(String))],history:[...new Set(history.map(String))]};
 }
 function inInbox(record){return membershipIds(record).current.length>0||record?.workflow?.stage===STAGES.INBOX_WORKING;}
 function primaryState(record){
  const statuses=PRIMARY.map(key=>record?.components?.[key]||'missing');
  const current=statuses.filter(v=>v==='current').length;
  const processing=statuses.filter(v=>v==='processing').length;
  const failed=statuses.filter(v=>['failed','partial','stale'].includes(v)).length;
  const complete=current===PRIMARY.length;
  return {statuses,current,processing,failed,complete,hasData:current>0};
 }
 function stageAfterAi(record){
  if(inInbox(record))return STAGES.INBOX_WORKING;
  const p=primaryState(record);
  if(p.complete)return STAGES.STAGED;
  if(p.processing)return STAGES.AI_PROCESSING;
  if(p.hasData)return STAGES.AI_PARTIAL;
  return STAGES.QUEUE_WAITING;
 }
 function update(id,patch,reason){return window.genreactrixImageRecordEngine?.update?.(String(id),patch,reason)||null;}
 function setStage(id,stage,reason='lifecycle-stage-changed',extra={}){
  const record=get(id);if(!record)return null;
  const previous=record.workflow?.stage||null;
  if(previous===stage&&!Object.keys(extra).length)return record;
  const next=update(id,{workflow:{stage},metadata:{extended:{...extra,lifecycleStageChangedAt:now(),lifecyclePriorStage:previous}}},reason);
  window.dispatchEvent(new CustomEvent('genreactrix:lifecycle',{detail:{imageId:String(id),previous,stage,reason,record:clone(next)}}));
  return next;
 }
 function markQueueWaiting(id,reason='queue-waiting'){return setStage(id,STAGES.QUEUE_WAITING,reason);}
 function markAiProcessing(id,{jobId=null,attemptId=null}={}){return setStage(id,STAGES.AI_PROCESSING,'ai-processing-started',{activeAiJobId:jobId,activeAiAttemptId:attemptId});}
 function neighboringRecords(record){const rows=records().filter(r=>!r.attributes?.archived).sort((a,b)=>String(a.createdAt||'').localeCompare(String(b.createdAt||''))||String(a.id).localeCompare(String(b.id))),index=rows.findIndex(r=>String(r.id)===String(record.id));return{previous:index>0?rows[index-1]:null,next:index>=0&&index<rows.length-1?rows[index+1]:null};}
 function evaluateIsolatedFailure(id){
  let record=get(id);if(!record)return null;const p=primaryState(record),ext=record.metadata?.extended||{};
  if(p.complete){if(Number(ext.isolatedAiFailureStreak)||0)record=update(id,{metadata:{extended:{isolatedAiFailureStreak:0}}},'ai-isolated-failure-streak-reset')||record;return record;}
  const failed=PRIMARY.some(key=>record.components?.[key]==='failed');if(!failed)return record;
  const attemptId=ext.lastAiAttemptId||null;if(!attemptId||ext.lastIsolationCountedAttemptId===attemptId)return record;
  const neighbors=neighboringRecords(record);if(!neighbors.previous||!neighbors.next||!primaryState(neighbors.previous).complete||!primaryState(neighbors.next).complete)return record;
  const streak=(Number(ext.isolatedAiFailureStreak)||0)+1;record=update(id,{metadata:{extended:{isolatedAiFailureStreak:streak,lastIsolationCountedAttemptId:attemptId,lastIsolatedAiFailureAt:now(),problemImage:streak>=3}}},'ai-isolated-failure-recorded')||record;
  if(streak>=3)record=setStage(id,STAGES.QUARANTINE,'ai-quarantined',{quarantineReason:'three-isolated-ai-failures',quarantinedAt:now(),problemImage:true})||record;
  return record;
 }
 function reevaluateNeighborFailures(id){const current=get(id);if(!current)return;const rows=records().filter(r=>!r.attributes?.archived).sort((a,b)=>String(a.createdAt||'').localeCompare(String(b.createdAt||''))||String(a.id).localeCompare(String(b.id))),index=rows.findIndex(r=>String(r.id)===String(id));for(const candidate of [rows[index-1],rows[index+1]])if(candidate)evaluateIsolatedFailure(candidate.id);}
 function reconcileAfterAi(id,{jobId=null,attemptId=null}={}){
  const record=get(id);if(!record)return null;
  const stage=stageAfterAi(record),reason=stage===STAGES.STAGED?'ai-staged':stage===STAGES.AI_PARTIAL?'ai-partial':'ai-returned-to-queue';
  let next=setStage(id,stage,reason,{activeAiJobId:null,activeAiAttemptId:null,lastAiJobId:jobId||record.metadata?.extended?.lastAiJobId||null,lastAiAttemptId:attemptId||record.metadata?.extended?.lastAiAttemptId||null});
  next=evaluateIsolatedFailure(id)||next;reevaluateNeighborFailures(id);return next;
 }
 function markInbox(id,bundleId){return setStage(id,STAGES.INBOX_WORKING,'bundle-entered-inbox',{lastInboxBundleId:bundleId||null});}
 function markPostProcessing(id,batchId){return setStage(id,STAGES.POST_PROCESSING,'post-processing-started',{activeBatchId:batchId||null});}
 function markPurgatory(id,batchId){return setStage(id,STAGES.PURGATORY,'post-processing-purgatory',{activeBatchId:batchId||null});}
 function migrateRecord(record){
  const ext=record?.metadata?.extended||{},members=membershipIds(record),raw=String(record?.workflow?.stage||'imported');
  const patch={metadata:{extended:{lifecycleSchemaVersion:1}}};
  let changed=false;
  if(!Array.isArray(ext.inboxBundleIds)&&members.current.length){patch.metadata.extended.inboxBundleIds=members.current;changed=true;}
  if(!Array.isArray(ext.inboxHistoryBundleIds)&&members.history.length){patch.metadata.extended.inboxHistoryBundleIds=members.history;changed=true;}
  if(!ext.lastInboxBundleId&&ext.lastInboxPackId){patch.metadata.extended.lastInboxBundleId=String(ext.lastInboxPackId);changed=true;}
  let stage=raw;
  if(['available','imported'].includes(raw))stage=STAGES.QUEUE_WAITING;
  else if(['ready-for-director','ready-director','ai-complete'].includes(raw))stage=members.current.length?STAGES.INBOX_WORKING:stageAfterAi(record);
  else if(raw==='queued'&&primaryState(record).complete&&!members.current.length)stage=STAGES.STAGED;
  if(members.current.length&&![STAGES.POST_PROCESSING,STAGES.PURGATORY,STAGES.BATCHED,STAGES.RED_EXCLUDED,STAGES.HOT_EXCLUDED,STAGES.ARCHIVED].includes(stage))stage=STAGES.INBOX_WORKING;
  if(stage!==raw){patch.workflow={stage};patch.metadata.extended.preLifecycleV1Stage=ext.preLifecycleV1Stage||raw;changed=true;}
  if(Number(ext.lifecycleSchemaVersion||0)!==1)changed=true;
  if(!changed)return null;
  return update(record.id,patch,'lifecycle-v1-migration');
 }
 function migrateAll(){let changed=0;for(const record of records())if(migrateRecord(record))changed++;window.dispatchEvent(new CustomEvent('genreactrix:lifecycle-migrated',{detail:{changed}}));return changed;}
 function snapshot(){
  const rows=records(),count=stage=>rows.filter(r=>r.workflow?.stage===stage).length;
  return {total:rows.length,queueWaiting:count(STAGES.QUEUE_WAITING),aiProcessing:count(STAGES.AI_PROCESSING),partial:count(STAGES.AI_PARTIAL),staged:count(STAGES.STAGED),inbox:count(STAGES.INBOX_WORKING),quarantine:count(STAGES.QUARANTINE),postProcessing:count(STAGES.POST_PROCESSING),purgatory:count(STAGES.PURGATORY)};
 }
 const api={STAGES,PRIMARY,membershipIds,inInbox,primaryState,stageAfterAi,setStage,markQueueWaiting,markAiProcessing,reconcileAfterAi,evaluateIsolatedFailure,markInbox,markPostProcessing,markPurgatory,migrateAll,snapshot};
 window.genreactrixLifecycleEngine=api;
 window.addEventListener('DOMContentLoaded',()=>{try{migrateAll()}catch(error){console.error('Lifecycle migration failed',error)}});
})();
