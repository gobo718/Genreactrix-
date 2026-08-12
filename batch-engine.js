(()=>{
'use strict';
const DB='genreactrix-batch-engine-v1', STORE='batches', META='meta', REPORTS='reports', VERSION=2;
let snapshotCache={activeBatch:null,activeBatchId:null,counts:{total:0,ready:0,incomplete:0,flagged:0,saved:0,inaccessible:0,remaining:0},batches:[],reports:[]};
const now=()=>new Date().toISOString();
const uid=p=>`${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
function openDb(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB,VERSION);r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains(STORE)){const s=db.createObjectStore(STORE,{keyPath:'id'});s.createIndex('status','status');s.createIndex('createdAt','createdAt')}if(!db.objectStoreNames.contains(META))db.createObjectStore(META,{keyPath:'key'});if(!db.objectStoreNames.contains(REPORTS)){const s=db.createObjectStore(REPORTS,{keyPath:'id'});s.createIndex('batchId','batchId');s.createIndex('createdAt','createdAt')}};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function store(name,mode='readonly'){const db=await openDb();return db.transaction(name,mode).objectStore(name)}
async function getAll(name){const s=await store(name);return new Promise((res,rej)=>{const r=s.getAll();r.onsuccess=()=>res(r.result||[]);r.onerror=()=>rej(r.error)})}
async function get(name,key){const s=await store(name);return new Promise((res,rej)=>{const r=s.get(key);r.onsuccess=()=>res(r.result||null);r.onerror=()=>rej(r.error)})}
async function put(name,value){const s=await store(name,'readwrite');return new Promise((res,rej)=>{const r=s.put(value);r.onsuccess=()=>res(value);r.onerror=()=>rej(r.error)})}
async function activeId(){return (await get(META,'active'))?.value||null}
async function setActive(id){await put(META,{key:'active',value:id});engine.activeIdCached=id;emit();return id}
function recordEngine(){return window.genreactrixImageRecordEngine}
function history(){return window.genreactrixHistoryEngine}
function eligible(record){return record&&!record.attributes?.inRecycleBin&&!record.attributes?.failed&&Boolean(record.source?.originalLocation||record.source?.originalUrl||record.storage?.temporaryKey||record.storage?.referenceKey||record.storage?.hyperlink)}
function classified(record){if(record?.attributes?.rejected)return true;const d=record.analysis?.director;const reactions=Array.isArray(d?.selectedReactions)&&d.selectedReactions.length>0;const themes=Array.isArray(d?.themes)&&d.themes.some(Boolean);const primNeeded=(d?.selectedReactions?.length||0)>=2;const primOk=!primNeeded||record.components?.primFusion==='current';return reactions&&themes&&primOk}
function directorParts(record){const d=record?.analysis?.director||{};const reactions=Array.isArray(d.selectedReactions)&&d.selectedReactions.length>0;const themes=Array.isArray(d.themes)&&d.themes.some(Boolean);const primNeeded=(d.selectedReactions?.length||0)>=2;const primOk=!primNeeded||record?.components?.primFusion==='current';return{reactions,themes,primNeeded,primOk,done:reactions&&themes&&primOk,partial:reactions||themes||(!primOk&&primNeeded)}}
function recordState(record){const p=directorParts(record);if(!eligible(record))return'inaccessible';if(record?.attributes?.rejected)return'rejected';if(record?.workflow?.stage==='batched')return'submitted';if(record?.attributes?.flagged)return'flagged';if(p.done)return'ready';if(p.partial)return'partial';return'incomplete'}
function counts(batch){const records=(batch?.imageIds||[]).map(id=>recordEngine()?.get(id,{touch:false})).filter(Boolean);return{total:records.length,ready:records.filter(r=>recordState(r)==='ready').length,rejected:records.filter(r=>recordState(r)==='rejected').length,incomplete:records.filter(r=>recordState(r)==='incomplete').length,partial:records.filter(r=>recordState(r)==='partial').length,flagged:records.filter(r=>r.attributes?.flagged).length,saved:records.filter(r=>r.attributes?.saved).length,inaccessible:records.filter(r=>recordState(r)==='inaccessible').length,submitted:records.filter(r=>r.workflow?.stage==='batched').length,remaining:records.filter(r=>!classified(r)).length}}
function inboxRecord(record){return Array.isArray(record?.metadata?.extended?.inboxPackIds)&&record.metadata.extended.inboxPackIds.length>0}
function alreadyBatched(record){return record?.workflow?.stage==='batched'||Boolean(record?.timestamps?.batchedAt)||Boolean(record?.metadata?.extended?.lastBatchSubmissionId)}
function batchOutcome(record){
  if(!eligible(record))return'blocked';
  if(record?.attributes?.rejected)return'reject';
  if(!classified(record))return'unresolved';
  if(record?.attributes?.flagged)return'review';
  if(record?.attributes?.saved)return'keep';
  if(record?.storage?.mode==='temporary')return'recycle';
  if(record?.storage?.mode==='linked')return'linked';
  return'retain';
}
function outcomeCountsForRecords(records){
  const out={total:records.length,keep:0,review:0,recycle:0,reject:0,linked:0,retain:0,blocked:0,unresolved:0};
  for(const record of records){const key=batchOutcome(record);if(Object.prototype.hasOwnProperty.call(out,key))out[key]++}
  out.report=out.keep+out.review+out.recycle+out.linked+out.retain;
  return out;
}
function outcomeCounts(batch){return outcomeCountsForRecords((batch?.imageIds||[]).map(id=>recordEngine()?.get(id,{touch:false})).filter(Boolean))}
function pendingInboxRecords(){return (recordEngine()?.all?.()||[]).filter(record=>inboxRecord(record)&&!record?.attributes?.inRecycleBin&&!record?.attributes?.archived&&!record?.attributes?.parked&&!alreadyBatched(record)&&classified(record)&&eligible(record))}
function pendingInboxSnapshot(){const records=pendingInboxRecords();return{...outcomeCountsForRecords(records),imageIds:records.map(r=>r.id)}}
async function create({name='Imported Work',imageIds=[],activate=true}={}){const batch={id:uid('batch'),schemaVersion:1,name,status:'draft',imageIds:[...new Set(imageIds)],createdAt:now(),startedAt:null,completedAt:null,submittedAt:null,reopenedAt:null,archivedAt:null,submissionVersion:0,reportIds:[],notes:'',evaluationVersion:localStorage.getItem('genreactrix-evaluation-vocabulary-version-v1')||'0.0.0',reevaluationRequired:false};await put(STORE,batch);for(const id of batch.imageIds){const r=recordEngine()?.get(id,{touch:false});if(r)recordEngine().update(id,{batchIds:[...new Set([...(r.batchIds||[]),batch.id])],source:{firstBatchId:r.source?.firstBatchId==='current-import'?batch.id:r.source?.firstBatchId}},'batch-added')}await history()?.append?.({imageId:null,eventType:'batch-created',actor:'system',sourceEngine:'batch',batchId:batch.id,summary:`Batch created: ${batch.name}`,payload:{batch}}).catch(()=>{});if(activate)await setActive(batch.id);emit();return batch}
async function all(){return getAll(STORE)}
async function active(){const id=await activeId();return id?get(STORE,id):null}
async function update(id,patch,eventType='batch-updated'){const b=await get(STORE,id);if(!b)throw new Error('Batch not found');const next={...b,...patch,imageIds:patch.imageIds?[...new Set(patch.imageIds)]:b.imageIds,updatedAt:now()};await put(STORE,next);await history()?.append?.({imageId:null,eventType,actor:'director',sourceEngine:'batch',batchId:id,summary:eventType.replaceAll('-',' '),payload:{before:b,current:next}}).catch(()=>{});emit();return next}
async function addImages(id,imageIds){const b=await get(STORE,id);if(!b)throw new Error('Batch not found');const added=[...new Set(imageIds)].filter(x=>!b.imageIds.includes(x));for(const imageId of added){const r=recordEngine()?.get(imageId,{touch:false});if(r)recordEngine().update(imageId,{batchIds:[...new Set([...(r.batchIds||[]),id])]},'batch-added')}return update(id,{imageIds:[...b.imageIds,...added],status:b.status==='draft'?'active':b.status,startedAt:b.startedAt||now()},'batch-images-added')}
async function removeImages(id,imageIds){const b=await get(STORE,id);const remove=new Set(imageIds);return update(id,{imageIds:b.imageIds.filter(x=>!remove.has(x))},'batch-images-removed')}
async function moveImages(fromId,toId,imageIds){if(fromId===toId)return;await addImages(toId,imageIds);await removeImages(fromId,imageIds);await history()?.append?.({imageId:null,eventType:'batch-images-moved',actor:'director',sourceEngine:'batch',batchId:fromId,summary:`${imageIds.length} image(s) moved`,payload:{fromId,toId,imageIds}}).catch(()=>{});emit()}
async function reorderSelected(id,imageIds,direction){const b=await get(STORE,id);if(!b)return;const selected=new Set(imageIds);const list=[...b.imageIds];if(direction<0){for(let i=1;i<list.length;i++)if(selected.has(list[i])&&!selected.has(list[i-1]))[list[i-1],list[i]]=[list[i],list[i-1]]}else{for(let i=list.length-2;i>=0;i--)if(selected.has(list[i])&&!selected.has(list[i+1]))[list[i],list[i+1]]=[list[i+1],list[i]]}return update(id,{imageIds:list},'batch-reordered')}
async function migrate(){
  let batches=await all();
  if(batches.length){
    const current=await activeId();
    if(!current||!batches.some(b=>b.id===current&&b.status!=='archived')){
      const candidate=batches.find(b=>!['submitted','archived'].includes(b.status))||batches[0];
      if(candidate)await setActive(candidate.id);
    }
    return batches;
  }
  const records=recordEngine()?.all?.()||[];
  const ids=records.filter(r=>(r.batchIds||[]).includes('current-import')||r.source?.firstBatchId==='current-import').map(r=>r.id);
  if(ids.length)return[await create({name:'Imported Work',imageIds:ids,activate:true})];
  return[await create({name:'New Batch',imageIds:[],activate:true})];
}
async function stageResolvedInbox(){
  const records=pendingInboxRecords();
  if(!records.length)throw new Error('No resolved Inbox images are waiting to batch.');
  const ids=records.map(r=>r.id),candidateSet=new Set(ids);
  let b=await active();
  const usable=b&&!['submitted','archived'].includes(b.status);
  const activeIds=b?.imageIds||[];
  const exactExisting=usable&&activeIds.length>0&&activeIds.every(id=>candidateSet.has(id))&&ids.every(id=>activeIds.includes(id));
  if(exactExisting)return{batch:b,added:0,outcomes:outcomeCountsForRecords(records)};
  if(usable&&activeIds.length===0){
    b=await addImages(b.id,ids);
    return{batch:b,added:ids.length,outcomes:outcomeCountsForRecords(records)};
  }
  b=await create({name:'Inbox Batch',imageIds:ids,activate:true});
  return{batch:b,added:ids.length,outcomes:outcomeCountsForRecords(records)};
}
function standardReport(batch){const records=batch.imageIds.map(id=>recordEngine()?.get(id,{touch:false})).filter(r=>r&&!r.attributes?.rejected);const reactionTotals={},themeTotals={},primFusionTotals={};let aiCovered=0;for(const r of records){const d=r.analysis?.director||{};(d.selectedReactions||[]).forEach(x=>reactionTotals[x]=(reactionTotals[x]||0)+1);(d.themes||[]).filter(Boolean).forEach(x=>{const key=typeof x==='string'?x:(x.label||x.id||'Unknown');themeTotals[key]=(themeTotals[key]||0)+1});if((d.selectedReactions||[]).length>=2){const key=(d.selectedReactions||[]).join(' × ');primFusionTotals[key]=(primFusionTotals[key]||0)+1}if(r.analysis?.ai&&Object.keys(r.analysis.ai).length)aiCovered++}return{id:uid('report'),schemaVersion:1,batchId:batch.id,batchName:batch.name,submissionVersion:batch.submissionVersion+1,createdAt:now(),counts:counts(batch),reactionTotals,themeTotals,primFusionTotals,aiCoverage:aiCovered,sourceSummary:records.reduce((a,r)=>{const k=r.source?.type||'unknown';a[k]=(a[k]||0)+1;return a},{}),imageIds:records.map(r=>r.id)}}
async function validate(id){const b=await get(STORE,id);if(!b)throw new Error('Batch not found');const c=counts(b);return{batch:b,counts:c,canSubmit:c.total>0&&c.incomplete===0&&c.partial===0&&c.inaccessible===0}}
async function submit(id,{allowFlagged=true}={}){
  const check=await validate(id);
  if(!check.counts.total)throw new Error('Batch is empty');
  if(check.counts.inaccessible)throw new Error(`${check.counts.inaccessible} image(s) are inaccessible`);
  if(check.counts.incomplete)throw new Error(`${check.counts.incomplete} non-flagged image(s) are incomplete`);
  if(check.counts.partial)throw new Error(`${check.counts.partial} image(s) are only partially classified`);
  const b=check.batch,nextVersion=(b.submissionVersion||0)+1,submittedAt=now(),preOutcomes=outcomeCounts(b);
  const report=window.genreactrixReportsEngine?.generateStandardBatchReport?await window.genreactrixReportsEngine.generateStandardBatchReport(b.id,nextVersion):standardReport(b);
  if(!window.genreactrixReportsEngine)await put(REPORTS,report);
  for(const imageId of b.imageIds){
    const r=recordEngine()?.get(imageId,{touch:false});if(!r)continue;
    const shared={timestamps:{batchedAt:submittedAt},metadata:{extended:{lastBatchSubmissionId:b.id,lastBatchSubmittedAt:submittedAt}}};
    if(r.attributes?.rejected)recordEngine().update(imageId,shared,'batch-reject-submitted');
    else recordEngine().update(imageId,{...shared,workflow:{stage:'batched'}},'batch-submitted');
  }
  const submitted=await update(id,{status:'submitted',submittedAt,completedAt:submittedAt,submissionVersion:nextVersion,reportIds:[...(b.reportIds||[]),report.id]},'batch-submitted');
  let recycled=0;
  for(const imageId of b.imageIds){
    const r=recordEngine()?.get(imageId,{touch:false});
    if(r?.storage?.mode==='temporary'&&!r.attributes?.saved&&!r.attributes?.flagged&&!r.attributes?.rejected){if(await window.genreactrixImagesEngine?.moveToRecycle?.(imageId))recycled++}
  }
  await history()?.append?.({imageId:null,eventType:'batch-report-generated',actor:'system',sourceEngine:'batch',batchId:id,summary:'Standard batch report generated',payload:{reportId:report.id,counts:report.counts,recycled,outcomes:preOutcomes}}).catch(()=>{});
  await create({name:'New Batch',imageIds:[],activate:true});
  window.genreactrixNotificationsEngine?.create?.({severity:'info',title:'Batch submitted',message:`${b.name} · ${b.imageIds.length} images · ${recycled} recycled`,ownerEngine:'batch',relatedBatchId:id,relatedReportId:report.id,actionTarget:'batch',actionLabel:'Batch',dedupeKey:`batch:${id}:submission:${nextVersion}`,resolved:true});
  emit();return{submitted,report,recycled,outcomes:preOutcomes};
}
async function reopen(id){const b=await get(STORE,id);if(!b||b.status!=='submitted')throw new Error('Only submitted batches can be reopened');const next=await update(id,{status:'reopened',reopenedAt:now()},'batch-reopened');await setActive(id);return next}
async function archive(id){return update(id,{status:'archived',archivedAt:now()},'batch-archived')}
async function report(id){return get(REPORTS,id)}
async function reportsForBatch(batchId){if(window.genreactrixReportsEngine?.all)return (await window.genreactrixReportsEngine.all()).filter(r=>r.batchId===batchId).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));return (await getAll(REPORTS)).filter(r=>r.batchId===batchId).sort((a,b)=>b.createdAt.localeCompare(a.createdAt))}
async function snapshot(){const b=await active();snapshotCache={activeBatch:b,activeBatchId:b?.id||null,counts:b?counts(b):{total:0,ready:0,rejected:0,incomplete:0,partial:0,flagged:0,saved:0,inaccessible:0,submitted:0,remaining:0},outcomes:b?outcomeCounts(b):outcomeCountsForRecords([]),pending:pendingInboxSnapshot(),batches:await all(),reports:b?await reportsForBatch(b.id):[]};engine.activeIdCached=snapshotCache.activeBatchId;engine.snapshotCached=snapshotCache;return structuredClone(snapshotCache)}
function emit(){window.dispatchEvent(new CustomEvent('genreactrix:batch'));window.renderPortraitControlStation?.();renderConsole().catch(()=>{})}
let activeFilter='all';
async function renderConsole(){const snap=await snapshot();const b=snap.activeBatch;const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=String(v)};set('portraitBatchName',b?.name||'No active batch');set('portraitReadyBatchCount',snap.counts.ready);set('portraitBatchTotal',snap.counts.total);set('portraitBatchRemaining',snap.counts.remaining);set('portraitSavedCurrent',snap.counts.saved);set('portraitFlaggedCurrent',snap.counts.flagged);const select=document.getElementById('batchSelect');if(select){select.innerHTML=snap.batches.map(x=>`<option value="${x.id}" ${x.id===b?.id?'selected':''}>${x.name} · ${x.status}</option>`).join('')}set('batchTotal',snap.counts.total);set('batchReady',snap.counts.ready);set('batchRejected',snap.counts.rejected);set('batchIncomplete',snap.counts.incomplete);set('batchPartial',snap.counts.partial);set('batchFlagged',snap.counts.flagged);set('batchSaved',snap.counts.saved);set('batchInaccessible',snap.counts.inaccessible);set('batchSubmitted',snap.counts.submitted);set('batchOutcomeKeep',snap.outcomes.keep);set('batchOutcomeReview',snap.outcomes.review);set('batchOutcomeRecycle',snap.outcomes.recycle);set('batchOutcomeReject',snap.outcomes.reject);set('batchOutcomeLinked',snap.outcomes.linked+snap.outcomes.retain);set('portraitBatchOutcomeKeep',snap.pending.keep);set('portraitBatchOutcomeReview',snap.pending.review);set('portraitBatchOutcomeRecycle',snap.pending.recycle);set('portraitBatchOutcomeReject',snap.pending.reject);set('portraitBatchOutcomeLinked',snap.pending.linked+snap.pending.retain);const meta=document.getElementById('batchMeta');if(meta)meta.innerHTML=b?`<span>${b.status}</span><span>Created ${new Date(b.createdAt).toLocaleString()}</span><span>Submission v${b.submissionVersion||0}</span>`:'';const pause=document.getElementById('batchPause');if(pause)pause.textContent=b?.status==='paused'?'Activate':'Pause';const records=(b?.imageIds||[]).map((id,index)=>({id,index,record:recordEngine()?.get(id,{touch:false})}));const visible=records.filter(({record})=>activeFilter==='all'||recordState(record)===activeFilter||(activeFilter==='saved'&&record?.attributes?.saved)||(activeFilter==='flagged'&&record?.attributes?.flagged));set('batchVisibleCount',`${visible.length} visible`);document.querySelectorAll('[data-batch-filter]').forEach(btn=>btn.classList.toggle('active',btn.dataset.batchFilter===activeFilter));const list=document.getElementById('batchContents');if(list)list.innerHTML=visible.map(({id,index,record:r})=>{const state=recordState(r);const tags=[state,r?.attributes?.saved?'Saved':'',r?.attributes?.flagged?'Flagged':''].filter(Boolean);return `<label class="batch-image-row" data-state="${state}"><input type="checkbox" value="${id}"><span class="batch-order">${index+1}</span><span><strong>${r?.name||r?.source?.originalFilename||id}</strong><small class="batch-tags">${tags.map(t=>`<span class="batch-tag">${t}</span>`).join('')}</small></span></label>`}).join('')||'<p class="batch-empty">No images match this view.</p>';const reports=document.getElementById('batchReportHistory');if(reports)reports.innerHTML=snap.reports.map(r=>`<button class="batch-report-row" data-report-id="${r.id}" type="button"><span>v${r.submissionVersion||1} · ${new Date(r.createdAt).toLocaleString()}</span><strong>${r.counts?.total||r.imageIds?.length||0} images</strong></button>`).join('')||'<p class="batch-empty">No submissions yet.</p>';reports?.querySelectorAll('[data-report-id]').forEach(btn=>btn.addEventListener('click',()=>window.genreactrixReportsEngine?.openReport?.(btn.dataset.reportId)||window.genreactrixReportsEngine?.openConsole?.()))}
function openConsole(){document.getElementById('batchDialog')?.showModal();renderConsole()}
function selectedIds(){return[...document.querySelectorAll('#batchContents input:checked')].map(x=>x.value)}
function showFilter(filter){activeFilter=filter;renderConsole()}
async function showSubmissionVerification(){
  const b=await active();if(!b)throw new Error('No active batch');
  const check=await validate(b.id),outcomes=outcomeCounts(b);
  const box=document.getElementById('batchVerifySummary');
  if(box)box.innerHTML=`<div class="batch-verify-summary"><span>Batch</span><strong>${b.name}</strong><span>Total</span><strong>${check.counts.total}</strong><span>Report + Keep</span><strong>${outcomes.keep}</strong><span>Report + Review hold</span><strong>${outcomes.review}</strong><span>Report + Recycle</span><strong>${outcomes.recycle}</strong><span>Report + No file move</span><strong>${outcomes.linked+outcomes.retain}</strong><span>Reject hold (not reported)</span><strong>${outcomes.reject}</strong><span>Partial</span><strong>${check.counts.partial}</strong><span>Incomplete</span><strong>${check.counts.incomplete}</strong><span>Blocked</span><strong>${check.counts.inaccessible}</strong></div>${check.canSubmit?'':'<p class="batch-verify-warning">This batch is not ready. Review incomplete or blocked images before submission.</p>'}`;
  const confirmBtn=document.getElementById('batchVerifyConfirm');if(confirmBtn)confirmBtn.disabled=!check.canSubmit;
  document.getElementById('batchVerifyDialog')?.showModal();return{...check,outcomes};
}
async function quickSubmit(){const staged=await stageResolvedInbox();await showSubmissionVerification();return staged}

function initUi(){const byId=id=>document.getElementById(id);byId('batchDialogClose')?.addEventListener('click',()=>byId('batchDialog')?.close());byId('batchSelect')?.addEventListener('change',e=>setActive(e.target.value));byId('batchCreate')?.addEventListener('click',async()=>{const name=prompt('Batch name','New Batch');if(name)await create({name,imageIds:[],activate:true})});byId('batchRename')?.addEventListener('click',async()=>{const b=await active();if(!b)return;const name=prompt('Batch name',b.name);if(name)await update(b.id,{name},'batch-renamed')});byId('batchPause')?.addEventListener('click',async()=>{const b=await active();if(!b)return;await update(b.id,{status:b.status==='paused'?'active':'paused',startedAt:b.startedAt||now()},b.status==='paused'?'batch-activated':'batch-paused')});byId('batchAddAvailable')?.addEventListener('click',async()=>{const b=await active();const n=Math.max(1,Number(byId('batchAddCount').value)||100);const ids=(recordEngine()?.query?.({stage:'available'})||[]).filter(eligible).map(r=>r.id).filter(id=>!b.imageIds.includes(id)).slice(0,n);await addImages(b.id,ids);byId('batchStatus').textContent=`Added ${ids.length}`});byId('batchAddAll')?.addEventListener('click',async()=>{const b=await active();const ids=(recordEngine()?.query?.({stage:'available'})||[]).filter(eligible).map(r=>r.id).filter(id=>!b.imageIds.includes(id));await addImages(b.id,ids);byId('batchStatus').textContent=`Added ${ids.length}`});byId('batchStageInbox')?.addEventListener('click',async()=>{try{const staged=await stageResolvedInbox();byId('batchStatus').textContent=`Staged ${staged.outcomes.total} resolved Inbox image(s) · ${staged.outcomes.reject} Reject · ${staged.outcomes.recycle} Recycle · ${staged.outcomes.keep} Keep · ${staged.outcomes.review} Review`;await renderConsole()}catch(e){byId('batchStatus').textContent=e.message}});byId('batchRemoveSelected')?.addEventListener('click',async()=>{const b=await active(),ids=selectedIds();if(ids.length&&confirm(`Remove ${ids.length} image(s) from ${b.name}?`))await removeImages(b.id,ids)});byId('batchMoveSelected')?.addEventListener('click',async()=>{const b=await active(),ids=selectedIds();if(!ids.length)return;const choices=(await all()).filter(x=>x.id!==b.id&&x.status!=='archived');if(!choices.length){byId('batchStatus').textContent='Create another batch first.';return}const name=prompt(`Move ${ids.length} image(s) to:\n${choices.map((x,i)=>`${i+1}. ${x.name}`).join('\n')}`,'1');const target=choices[Math.max(0,Number(name)-1)];if(target)await moveImages(b.id,target.id,ids)});byId('batchMoveUp')?.addEventListener('click',async()=>{const b=await active();await reorderSelected(b.id,selectedIds(),-1)});byId('batchMoveDown')?.addEventListener('click',async()=>{const b=await active();await reorderSelected(b.id,selectedIds(),1)});byId('batchShuffle')?.addEventListener('click',async()=>{const b=await active();const ids=[...b.imageIds];for(let i=ids.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]]}await update(b.id,{imageIds:ids},'batch-shuffled')});byId('batchValidate')?.addEventListener('click',async()=>{const b=await active(),v=await validate(b.id);byId('batchStatus').textContent=v.canSubmit?'Ready to submit':`${v.counts.incomplete} incomplete · ${v.counts.partial} partial · ${v.counts.inaccessible} blocked`;if(!v.canSubmit)showFilter(v.counts.inaccessible?'inaccessible':v.counts.partial?'partial':'incomplete')});byId('batchSubmit')?.addEventListener('click',showSubmissionVerification);byId('batchVerifyCancel')?.addEventListener('click',()=>byId('batchVerifyDialog')?.close());byId('batchVerifyReview')?.addEventListener('click',async()=>{const b=await active(),v=await validate(b.id);showFilter(v.counts.inaccessible?'inaccessible':v.counts.partial?'partial':'incomplete');byId('batchVerifyDialog')?.close();byId('batchDialog')?.showModal()});byId('batchVerifyConfirm')?.addEventListener('click',async()=>{const b=await active();try{const r=await submit(b.id);byId('batchVerifyDialog')?.close();byId('batchStatus').textContent=`Submitted · report ${r.report.id} · ${r.recycled} recycled`;renderConsole()}catch(e){byId('batchStatus').textContent=e.message;byId('batchVerifyDialog')?.close()}});byId('batchReopen')?.addEventListener('click',async()=>{const id=byId('batchSelect').value;try{await reopen(id)}catch(e){byId('batchStatus').textContent=e.message}});byId('batchArchive')?.addEventListener('click',async()=>{const b=await active();if(b&&confirm(`Archive ${b.name}?`))await archive(b.id)});byId('batchSelectAll')?.addEventListener('change',e=>document.querySelectorAll('#batchContents input[type=checkbox]').forEach(x=>x.checked=e.target.checked));document.querySelectorAll('[data-batch-filter]').forEach(btn=>btn.addEventListener('click',()=>showFilter(btn.dataset.batchFilter)))}

async function verify(){const issues=[],batches=await all(),recordIds=new Set(recordEngine()?.all?.().map(r=>r.id)||[]);for(const b of batches){for(const id of b.imageIds||[])if(!recordIds.has(id))issues.push({type:'batch-missing-image',batchId:b.id,imageId:id,severity:'attention'});if(b.status==='submitted'&&!(b.reportIds||[]).length)issues.push({type:'submitted-batch-missing-report',batchId:b.id,severity:'critical'})}return{batchCount:batches.length,issueCount:issues.length,issues}}
const engine={create,all,active,setActive,addImages,removeImages,moveImages,reorderSelected,update,validate,submit,reopen,archive,snapshot,openConsole,quickSubmit,stageResolvedInbox,pendingInboxSnapshot,outcomeCounts,reportsForBatch,verify,activeId,activeIdCached:null,snapshotCached:snapshotCache};window.genreactrixBatchEngine=engine;window.addEventListener('DOMContentLoaded',async()=>{await migrate();initUi();renderConsole();emit()});window.addEventListener('genreactrix:image-record',()=>renderConsole());
})();
