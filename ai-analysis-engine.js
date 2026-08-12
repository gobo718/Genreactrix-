/* Genreactrix AI Analysis Engine v1
   Persistent modular jobs, adapted from Billy Labs job/provider patterns and connected
   to Genreactrix Image Record + History engines. No synthetic AI results are produced. */
(()=>{'use strict';
 const DB='genreactrix-ai-analysis',VERSION=1,JOBS='jobs',ITEMS='items';
 const COMPONENTS=[
  ['reactions','Reactions','aiReactions'],['themes','Themes','aiThemes'],['description','Description','aiDescription'],
  ['reactionReasons','Reactions Info','aiReactionReasons'],['genreReasons','Themes Info','aiGenreReasons']
 ];
 const clone=v=>v==null?v:structuredClone(v),now=()=>new Date().toISOString(),id=p=>`${p}_${Date.now().toString(36)}_${crypto.randomUUID().slice(0,8)}`;
 const REACTION_PRIM_IDS=Array.from({length:14},(_,index)=>`P${String(index+1).padStart(2,'0')}`);
 const reactionNumber=value=>{const n=typeof value==='number'?value:Number(value?.percentage??value?.confidence??value?.score??value?.weight??value?.value??value);return Number.isFinite(n)?Math.max(0,n):0};
 function reactionMap(raw){const source=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};return Object.fromEntries(REACTION_PRIM_IDS.map(pid=>[pid,reactionNumber(source[pid])]));}
 function themePrimIds(theme){const code=String(theme?.code||theme?.id||theme?.value||'').trim().toUpperCase(),m=code.match(/^PFM(\d{2})(\d{2})$/);if(!m)return[];const ids=[`P${m[1]}`,`P${m[2]}`];return ids.every(pid=>REACTION_PRIM_IDS.includes(pid))?ids:[];}
 const themeConfidence=theme=>{const n=typeof theme?.confidence==='number'?theme.confidence:Number(theme?.confidence??theme?.percentage??theme?.score??theme?.weight??theme?.value??0);return Number.isFinite(n)&&n>0?n:0};
 function buildHybridReactions(components){
  const themes=Array.isArray(components?.themes)?components.themes.slice(0,3):[];
  if(themes.length!==3)return null;
  const parsed=themes.map(theme=>({theme,ids:themePrimIds(theme),confidence:themeConfidence(theme)}));
  if(parsed.some(row=>row.ids.length!==2))return null;
  const confidenceTotal=parsed.reduce((sum,row)=>sum+row.confidence,0);
  const equalFallback=!(confidenceTotal>0);
  const themeAllocations=parsed.map((row,index)=>({
   code:String(row.theme?.code||row.theme?.id||row.theme?.value||''),
   primIds:[...row.ids],
   confidence:row.confidence,
   themePoints:equalFallback?20:(60*row.confidence/confidenceTotal),
   index
  }));
  const themePoints=Object.fromEntries(REACTION_PRIM_IDS.map(pid=>[pid,0]));
  for(const row of themeAllocations){const share=row.themePoints/2;for(const pid of row.primIds)themePoints[pid]+=share;}
  const directSource=components?.directReactions||components?.reactionDiagnostics?.discretionaryAllocation||(!components?.reactionHybridDiagnostics?components?.reactions:null);
  if(!directSource)return null;
  const direct=reactionMap(directSource),directTotal=REACTION_PRIM_IDS.reduce((sum,pid)=>sum+direct[pid],0);
  if(!(directTotal>0))return null;
  const direct40=Object.fromEntries(REACTION_PRIM_IDS.map(pid=>[pid,direct[pid]*40/directTotal]));
  const hybrid=Object.fromEntries(REACTION_PRIM_IDS.map(pid=>[pid,themePoints[pid]+direct40[pid]]));
  return{hybrid,direct,themePoints,direct40,themeTotal:60,directTotal:40,total:100,confidenceTotal,equalFallback,themeAllocations,method:'theme-confidence-60-direct-40'};
 }
 function applyHybridReactions(components){const built=buildHybridReactions(components);if(!built)return components;if(!components.directReactions)components.directReactions=clone(built.direct);components.reactions=built.hybrid;components.reactionHybridDiagnostics={method:built.method,themePoints:built.themePoints,direct40:built.direct40,themeTotal:60,directTotal:40,total:100,confidenceTotal:built.confidenceTotal,equalFallback:built.equalFallback,themeAllocations:built.themeAllocations};return components;}
 const openDb=()=>new Promise((resolve,reject)=>{const r=indexedDB.open(DB,VERSION);r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains(JOBS)){const s=db.createObjectStore(JOBS,{keyPath:'id'});s.createIndex('state','state');s.createIndex('createdAt','createdAt')}if(!db.objectStoreNames.contains(ITEMS)){const s=db.createObjectStore(ITEMS,{keyPath:'id'});s.createIndex('jobId','jobId');s.createIndex('state','state');s.createIndex('imageId','imageId')}};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
 const tx=(store,mode,fn)=>openDb().then(db=>new Promise((resolve,reject)=>{const t=db.transaction(store,mode),s=t.objectStore(store);let out;try{out=fn(s,t)}catch(e){db.close();reject(e);return}t.oncomplete=()=>{db.close();resolve(out)};t.onerror=()=>{db.close();reject(t.error)}}));
 const put=(store,value)=>tx(store,'readwrite',s=>s.put(clone(value)));
 const all=store=>openDb().then(db=>new Promise((resolve,reject)=>{const t=db.transaction(store,'readonly'),r=t.objectStore(store).getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error);t.oncomplete=()=>db.close()}));
 const byIndex=(store,index,value)=>openDb().then(db=>new Promise((resolve,reject)=>{const t=db.transaction(store,'readonly'),r=t.objectStore(store).index(index).getAll(value);r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error);t.oncomplete=()=>db.close()}));
 const componentMap=()=>Object.fromEntries(COMPONENTS.map(([id])=>[id,{enabled:false,behavior:'analyze'}]));
 const portraitKey=id=>({'reaction-reasons':'reactionReasons','genre-reasons':'genreReasons'}[id]||id);
 function savedComponentDefaults(){try{return window.genreactrixSettingsEngine?.get?.('ai.components.default',{})||{}}catch{return {}}}
 function syncComponentChecksFromDefaults(){const saved=savedComponentDefaults();document.querySelectorAll('[data-ai-component]').forEach(row=>{const input=row.querySelector('input'),select=row.querySelector('select'),key=portraitKey(row.dataset.aiComponent);if(input&&Object.prototype.hasOwnProperty.call(saved,key))input.checked=Boolean(saved[key]);if(select)select.value='analyze'})}
 function saveComponentDefaultsFromGrid(){const next={...savedComponentDefaults()};document.querySelectorAll('[data-ai-component]').forEach(row=>{const input=row.querySelector('input'),key=portraitKey(row.dataset.aiComponent);if(input)next[key]=Boolean(input.checked)});window.genreactrixSettingsEngine?.set?.('ai.components.default',next);document.querySelectorAll('[data-portrait-ai-output]').forEach(input=>{if(Object.prototype.hasOwnProperty.call(next,input.dataset.portraitAiOutput))input.checked=Boolean(next[input.dataset.portraitAiOutput])});return next}
 const q=()=>window.genreactrixQueueEngine;
 let snapshotCache={pending:0,available:0,ready:0,bufferTarget:25,jobs:[],items:[]};
 let maintainBufferPromise=null;
 let cycleRunning=false,cycleStopRequested=false,cycleCurrentJobId=null;
 const CYCLE_MAX_PASSES=3;
 function eligibleRecords(config){let rows=window.genreactrixImageRecordEngine?.all?.()||[];if(config.target==='flagged')rows=rows.filter(r=>r.attributes.flagged);else if(config.target==='saved')rows=rows.filter(r=>r.attributes.saved);else if(config.target==='failed')rows=rows.filter(r=>r.attributes.failed||Object.values(r.components||{}).includes('failed'));else if(config.target==='current'){const active=window.genreactrixBatchEngine?.activeIdCached||null;rows=active?rows.filter(r=>(r.batchIds||[]).includes(active)):rows.filter(r=>(r.batchIds||[]).includes('current-import'));}else if(config.target==='selected'){const ids=new Set((config.imageIds||[]).map(String));rows=rows.filter(r=>ids.has(String(r.id)));}if(config.order==='oldest')rows.sort((a,b)=>a.createdAt.localeCompare(b.createdAt));if(config.order==='newest')rows.sort((a,b)=>b.createdAt.localeCompare(a.createdAt));if(config.order==='random')rows.sort(()=>Math.random()-.5);if(config.quantityMode==='random')rows.sort(()=>Math.random()-.5);return rows;}
 function applyQuantity(rows,config){if(config.quantityMode==='all')return rows;return rows.slice(0,Math.max(1,Number(config.quantity)||100));}
 function shouldRun(record,component,behavior){const field=COMPONENTS.find(([id])=>id===component)?.[2];const status=record.components?.[field]||'missing';return behavior==='reanalyze'||['missing','stale','failed','partial'].includes(status)}
 const AI_TRANSPORT_MAX_DIMENSION=1280,AI_TRANSPORT_JPEG_QUALITY=0.82;
 async function blobDataUrl(blob){return new Promise((resolve,reject)=>{const fr=new FileReader();fr.onload=()=>resolve(fr.result);fr.onerror=()=>reject(fr.error);fr.readAsDataURL(blob)})}
 async function normalizeAiImageBlob(blob){
  let bitmap=null;
  try{
   bitmap=await createImageBitmap(blob);
   const sourceWidth=Math.max(1,bitmap.width||1),sourceHeight=Math.max(1,bitmap.height||1),scale=Math.min(1,AI_TRANSPORT_MAX_DIMENSION/Math.max(sourceWidth,sourceHeight)),width=Math.max(1,Math.round(sourceWidth*scale)),height=Math.max(1,Math.round(sourceHeight*scale));
   const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)throw new Error('Canvas unavailable for AI image preparation');ctx.fillStyle='#fff';ctx.fillRect(0,0,width,height);ctx.drawImage(bitmap,0,0,width,height);
   const prepared=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('Could not prepare AI image')),'image/jpeg',AI_TRANSPORT_JPEG_QUALITY));
   return{blob:prepared,sourceBytes:blob.size||0,transportBytes:prepared.size||0,sourceWidth,sourceHeight,width,height};
  }finally{try{bitmap?.close?.()}catch{}}
 }
 async function validateAiSource(record){
  if(record.storage?.hyperlink)return{ok:true,kind:'linked',mimeType:record.storage?.mimeType||''};
  const blob=await window.imageBlobGet?.(record.id).catch(()=>null);if(!blob)return{ok:false,reason:'Image source is unavailable',mimeType:record.storage?.mimeType||''};
  const mimeType=String(blob.type||record.storage?.mimeType||'').toLowerCase();if(mimeType&&!mimeType.startsWith('image/'))return{ok:false,reason:`Not an image MIME type (${mimeType})`,mimeType};
  let bitmap=null;try{bitmap=await createImageBitmap(blob);if(!(bitmap.width>0&&bitmap.height>0))throw new Error('Image has no decodable dimensions');return{ok:true,kind:'local',mimeType,width:bitmap.width,height:bitmap.height};}catch(error){return{ok:false,reason:`Unsupported or undecodable image${mimeType?` (${mimeType})`:''}: ${String(error?.message||error)}`,mimeType};}finally{try{bitmap?.close?.()}catch{}}
 }
 async function imageInput(record){if(record.storage?.hyperlink)return{imageUrl:record.storage.hyperlink};const blob=await window.imageBlobGet?.(record.id).catch(()=>null);if(!blob)throw new Error('Image source is unavailable');try{const prepared=await normalizeAiImageBlob(blob),dataUrl=await blobDataUrl(prepared.blob);return{imageDataUrl:dataUrl}}catch(error){throw new Error(`AI image preparation failed: ${String(error?.message||error)}`)}}
 async function createJob(config){const selected=Object.entries(config.components||{}).filter(([,v])=>v.enabled);if(!selected.length)throw new Error('Choose at least one AI component');const existingItems=await all(ITEMS),activeImageIds=new Set(existingItems.filter(i=>['queued','processing'].includes(i.state)).map(i=>i.imageId));const candidates=applyQuantity(eligibleRecords(config).filter(r=>{if(activeImageIds.has(r.id))return false;if(config.skipFailed){const hasFailed=selected.some(([c])=>{const field=COMPONENTS.find(([id])=>id===c)?.[2];return field&&r.components?.[field]==='failed'});if(hasFailed)return false;}return selected.some(([c,v])=>shouldRun(r,c,v.behavior));}),config);const rows=[],sourceRejects=[];for(const record of candidates){const check=await validateAiSource(record);if(check.ok)rows.push(record);else sourceRejects.push({imageId:record.id,name:record.name||record.source?.originalFilename||record.id,mimeType:check.mimeType||record.storage?.mimeType||'',reason:check.reason});}if(!rows.length)return {id:null,schemaVersion:1,state:'completed',createdAt:now(),startedAt:null,completedAt:now(),config:clone(config),total:0,completed:0,failed:0,skipped:sourceRejects.length,sourceRejects,processing:0,message:sourceRejects.length?`No queueable images · ${sourceRejects.length} unsupported or undecodable`:'No eligible images',stopRequested:false};const job={id:id('ai_job'),schemaVersion:1,state:'queued',createdAt:now(),startedAt:null,completedAt:null,config:clone(config),total:rows.length,completed:0,failed:0,skipped:sourceRejects.length,sourceRejects,processing:0,message:sourceRejects.length?`Queued · ${sourceRejects.length} unsupported/undecodable skipped`:'Queued',stopRequested:false};await put(JOBS,job);const queueJob=await q()?.createJob?.({id:`queue_${job.id}`,type:'ai',ownerEngine:'ai-analysis',ownerJobId:job.id,label:`AI analysis · ${rows.length} image${rows.length===1?'':'s'}`,state:'queued',total:rows.length,imageIds:rows.map(r=>r.id),batchId:window.genreactrixBatchEngine?.activeIdCached||null,message:'Queued'});const queueRows=[];for(const [order,record] of rows.entries()){const item={id:id('ai_item'),jobId:job.id,imageId:record.id,order,state:'queued',attempts:0,error:'',components:selected.map(([component,settings])=>({component,behavior:settings.behavior,state:'queued'}))};await put(ITEMS,item);queueRows.push({id:`queue_${item.id}`,imageId:record.id,ownerItemId:item.id,order,type:'ai',state:'queued'})}if(queueJob)await q()?.addItems?.(queueJob.id,queueRows);emit();return clone(job)}
 async function updateJob(job,patch){Object.assign(job,patch);await put(JOBS,job);emit();return job}
 async function processItem(job,item){
  item.state='processing';item.attempts++;item.error='';await put(ITEMS,item);await q()?.setItemState?.(`queue_${item.id}`,'processing',{attempts:item.attempts});job.processing=1;await updateJob(job,{message:`Analyzing ${job.completed+job.failed+1} of ${job.total}`});
  let record=window.genreactrixImageRecordEngine.get(item.imageId,{touch:false});if(!record)throw new Error('Image record not found');
  const pending=item.components.filter(c=>c.state==='queued'||c.state==='failed');
  for(const c of pending){const field=COMPONENTS.find(([id])=>id===c.component)?.[2];window.genreactrixImageRecordEngine.setComponent(record.id,field,'processing')}
  const input=await imageInput(record),errors=[];

  // Paired Info components must share the same underlying AI assessment as the
  // classification they explain. Bundle each family into one Worker request.
  const groups=[];
  const take=(keys)=>{const rows=pending.filter(c=>keys.includes(c.component));if(rows.length)groups.push(rows)};
  take(['reactions','reactionReasons']);
  take(['themes','genreReasons']);
  take(['description']);
  for(const c of pending)if(!groups.some(group=>group.includes(c)))groups.push([c]);

  for(const group of groups){
    const requested=group.map(c=>c.component);
    const componentBehaviors=Object.fromEntries(group.map(c=>[c.component,c.behavior]));
    try{
      const existingDescription=String(record.analysis?.ai?.components?.description||record.analysis?.ai?.description||'').trim();
      const payload=await window.GenreactrixCloudApi.analyzeImage({imageId:record.id,components:requested,componentBehaviors,promptRefs:job.config.promptRefs||{},directorGuidance:String(job.config.analysisGuidance||'').trim().slice(0,1200),themeUseAnalysis:Boolean(job.config.themeUseAnalysis),themeAnalysisContext:job.config.themeUseAnalysis?existingDescription.slice(0,6000):'',...input},window.GenreactrixCloudApi.getKey());
      const result=payload.result||payload.report||payload;
      if(!result||typeof result!=='object')throw new Error('AI provider returned no structured result');
      for(const c of group)if(!Object.prototype.hasOwnProperty.call(result.components||{},c.component))throw new Error(`AI provider omitted ${c.component}`);

      const returned={};
      for(const c of group){c.state='complete';returned[c.component]=result.components[c.component]}
      if(requested.includes('reactions')&&result.components?.reactions) returned.directReactions=clone(result.components.reactions);
      if(result.components?.reactionDiagnostics) returned.reactionDiagnostics=result.components.reactionDiagnostics;
      if(result.components?.themeRecovery) returned.themeRecovery=result.components.themeRecovery;

      record=window.genreactrixImageRecordEngine.get(record.id,{touch:false})||record;
      const previous=record.analysis?.ai||{};
      const componentUpdates={};
      for(const c of group){const field=COMPONENTS.find(([id])=>id===c.component)?.[2];componentUpdates[field]='current'}
      const mergedComponents=applyHybridReactions({...(previous.components||{}),...returned});
      const analysis={...previous,components:mergedComponents,provider:result.provider||previous.provider||{},model:result.model||result.provider?.model||previous.model||'',promptVersions:{...(previous.promptVersions||{}),...(result.promptVersions||{})},requested:[...new Set([...(previous.requested||[]),...requested])],researchConfiguration:{...(previous.researchConfiguration||{}),...(result.researchConfiguration||{})},recordedAt:now(),jobId:job.id};
      window.genreactrixImageRecordEngine.attachAI(record.id,analysis,componentUpdates);
      await window.genreactrixHistoryEngine.append({imageId:record.id,eventType:'ai-analysis',actor:'ai',sourceEngine:'ai-analysis',jobId:job.id,summary:`AI analyzed ${requested.join(' + ')}`,payload:{analysis:{components:{...returned,...(analysis.components?.reactionHybridDiagnostics?{reactions:analysis.components.reactions,reactionHybridDiagnostics:analysis.components.reactionHybridDiagnostics}: {})},provider:result.provider||{},model:analysis.model,promptVersions:result.promptVersions||{},requested,jobId:job.id},componentUpdates,partial:false}});
    }catch(error){
      const message=`${requested.join('+')}: ${String(error.message||error)}`;errors.push(message);
      for(const c of group){c.state='failed';const field=COMPONENTS.find(([id])=>id===c.component)?.[2];window.genreactrixImageRecordEngine.setComponent(record.id,field,'failed')}
      await window.genreactrixHistoryEngine.append({imageId:record.id,eventType:'ai-failed',actor:'system',sourceEngine:'ai-analysis',jobId:job.id,summary:message,payload:{error:message,components:requested}}).catch(()=>{});
      if(isGlobalProviderFailure(message))break;
    }
  }
  for(const c of pending.filter(c=>c.state==='processing')){const field=COMPONENTS.find(([id])=>id===c.component)?.[2];c.state='failed';window.genreactrixImageRecordEngine.setComponent(record.id,field,'failed')}
  item.state=errors.length?'failed':'complete';item.error=errors.join(' | ');await put(ITEMS,item);await q()?.setItemState?.(`queue_${item.id}`,item.state,{error:item.error});return item.state;
 }

 function isGlobalProviderFailure(message){return /unauthorized|analysis access is not configured|ai worker url is not configured|failed to fetch|networkerror|load failed|workers ai binding ai is not configured|workers ai vision failed|rate limit|quota/i.test(String(message||''))}
 async function run(jobId){
  let job=(await all(JOBS)).find(j=>j.id===jobId);
  if(!job||job.state==='running')return;
  if(!window.GenreactrixCloudApi?.isConfigured?.()){await updateJob(job,{state:'queued',message:'Waiting for AI Worker configuration'});await q()?.setJobState?.(`queue_${job.id}`,'queued','Waiting for AI Worker configuration');return;}
  await updateJob(job,{state:'running',startedAt:job.startedAt||now(),stopRequested:false});await q()?.setJobState?.(`queue_${job.id}`,'running','AI analysis running');
  const items=(await byIndex(ITEMS,'jobId',job.id)).sort((a,b)=>a.order-b.order);
  let fatalMessage='';
  for(const item of items){
   job=(await all(JOBS)).find(j=>j.id===job.id);
   while(job.state==='paused'){await new Promise(r=>setTimeout(r,250));job=(await all(JOBS)).find(j=>j.id===job.id)}
   if(job.stopRequested||job.state==='cancelled')break;
   if(!['queued','failed'].includes(item.state))continue;
   try{const state=await processItem(job,item);job.processing=0;if(state==='complete')job.completed++;else job.failed++}
   catch(error){
    item.state='failed';item.error=String(error.message||error);await put(ITEMS,item);await q()?.setItemState?.(`queue_${item.id}`,'failed',{error:item.error});job.processing=0;job.failed++;
    for(const c of item.components){if(c.state==='queued'||c.state==='processing')c.state='failed';const field=COMPONENTS.find(([id])=>id===c.component)?.[2];window.genreactrixImageRecordEngine.setComponent(item.imageId,field,'failed')}
    await window.genreactrixHistoryEngine.append({imageId:item.imageId,eventType:'ai-failed',actor:'system',sourceEngine:'ai-analysis',jobId:job.id,summary:item.error,payload:{error:item.error,components:item.components}}).catch(()=>{});
    if(isGlobalProviderFailure(item.error))fatalMessage=item.error;
   }
   await updateJob(job,{completed:job.completed,failed:job.failed,processing:0});
   if(fatalMessage)break;
  }
  job=(await all(JOBS)).find(j=>j.id===job.id);
  if(fatalMessage){const message=`Paused after provider failure: ${fatalMessage}`;await updateJob(job,{state:'paused',processing:0,message});await q()?.setJobState?.(`queue_${job.id}`,'paused',message);render();return;}
  const stopped=job.stopRequested||job.state==='cancelled';const finalState=stopped?'cancelled':(job.failed?'completed-with-failures':'completed'),finalMessage=stopped?'Stopped safely':(job.failed?`Completed with ${job.failed} failure(s)`:'Completed');await updateJob(job,{state:finalState,completedAt:now(),message:finalMessage});await q()?.setJobState?.(`queue_${job.id}`,finalState,finalMessage);render();
 }
 async function pause(id){const j=(await all(JOBS)).find(x=>x.id===id);if(j?.state==='running'){await updateJob(j,{state:'paused',message:'Paused safely'});await q()?.setJobState?.(`queue_${id}`,'paused','Paused safely')}}
 async function resume(id){const j=(await all(JOBS)).find(x=>x.id===id);if(j&&['paused','queued'].includes(j.state)){await updateJob(j,{state:'queued',message:'Resuming'});await q()?.setJobState?.(`queue_${id}`,'queued','Resuming');run(id)}}
 async function stop(id){const j=(await all(JOBS)).find(x=>x.id===id);if(j&&['running','paused','queued'].includes(j.state)){const items=await byIndex(ITEMS,'jobId',id),hasProcessing=items.some(item=>item.state==='processing');await updateJob(j,{stopRequested:true,state:'cancelled',message:hasProcessing?'Stopping safely':'Stopped safely',completedAt:hasProcessing?j.completedAt:now()});if(!hasProcessing){for(const item of items.filter(item=>['queued','processing'].includes(item.state))){item.state='cancelled';item.error='Stopped by user';for(const c of item.components||[])if(['queued','processing'].includes(c.state))c.state='cancelled';await put(ITEMS,item);await q()?.setItemState?.(`queue_${item.id}`,'cancelled',{error:'Stopped by user'})}await q()?.setJobState?.(`queue_${id}`,'cancelled','Stopped safely')}else await q()?.setJobState?.(`queue_${id}`,'stopping','Stopping safely')}}
 async function reconcileCancelledJobs(){const jobs=await all(JOBS);for(const job of jobs.filter(j=>j.state==='cancelled')){const items=await byIndex(ITEMS,'jobId',job.id);for(const item of items.filter(i=>['queued','processing'].includes(i.state))){item.state='cancelled';item.error='Recovered cancelled job';for(const c of item.components||[])if(['queued','processing'].includes(c.state))c.state='cancelled';await put(ITEMS,item);await q()?.setItemState?.(`queue_${item.id}`,'cancelled',{error:'Recovered cancelled job'})}await q()?.setJobState?.(`queue_${job.id}`,'cancelled','Stopped safely')}}
 async function recoverInterruptedAiJobs(){const jobs=await all(JOBS);let recovered=0;for(const job of jobs.filter(j=>j.state==='running')){const items=await byIndex(ITEMS,'jobId',job.id);for(const item of items.filter(i=>i.state==='processing')){item.state='queued';item.error='Recovered after page reload';for(const c of item.components||[])if(c.state==='processing')c.state='queued';await put(ITEMS,item);await q()?.setItemState?.(`queue_${item.id}`,'queued',{error:'Recovered after page reload'});recovered++}job.state='queued';job.processing=0;job.stopRequested=false;job.message='Recovered after page reload';await put(JOBS,job);await q()?.setJobState?.(`queue_${job.id}`,'queued','Recovered after page reload');recovered++}if(recovered)emit();return recovered}
 async function retryFailed(id){const items=await byIndex(ITEMS,'jobId',id);for(const item of items.filter(i=>i.state==='failed')){item.state='queued';item.error='';item.components.forEach(c=>{if(c.state==='failed')c.state='queued'});await put(ITEMS,item)}const j=(await all(JOBS)).find(x=>x.id===id);if(j){j.state='queued';j.failed=0;j.completed=items.filter(i=>i.state==='complete').length;await put(JOBS,j);run(id)}}
 async function resumeStrandedJobs(){window.GenreactrixCloudApi?.reload?.();if(!window.GenreactrixCloudApi?.isConfigured?.())return 0;const stranded=(await all(JOBS)).filter(j=>j.state==='queued');for(const job of stranded)await run(job.id);return stranded.length}
 async function snapshot(){const jobs=await all(JOBS),items=await all(ITEMS);snapshotCache={pending:items.filter(i=>['queued','processing'].includes(i.state)).length,available:eligibleRecords({target:'current',quantityMode:'all',components:{reactions:{enabled:true,behavior:'analyze'}}}).length,ready:(window.genreactrixInboxReadyRecords?.()||[]).length,bufferTarget:Math.max(0,Number(window.genreactrixSettingsEngine?.get?.('ai.buffer.target',25))||25),quickAddAmount:Math.max(1,Number(window.genreactrixSettingsEngine?.get?.('defaults.ai.quickAdd',100))||100),jobs,items};return clone(snapshotCache)}
 function snapshotCached(){return clone(snapshotCache)}
 async function queueNext(count,outputs=null,options={}){const map=componentMap(),selected=outputs||window.selectedPortraitAiOutputs?.()||{};for(const [key,on] of Object.entries(selected)){const normalized={'reaction-reasons':'reactionReasons','genre-reasons':'genreReasons'}[key]||key;if(map[normalized])map[normalized]={enabled:Boolean(on),behavior:'analyze'}}const config={target:'current',quantityMode:'next',quantity:count,order:'queue',components:map,skipFailed:Boolean(options.skipFailed)};const job=await createJob(config);if(job.total&&window.GenreactrixCloudApi?.isConfigured())await run(job.id);render();return job.total}
 async function maintainBuffer(){if(!Boolean(window.genreactrixSettingsEngine?.get?.('ai.lookAhead.enabled',true)))return 0;if(maintainBufferPromise)return maintainBufferPromise;maintainBufferPromise=(async()=>{const snap=await snapshot();const needed=Math.max(0,snap.bufferTarget-snap.pending-snap.ready);if(!needed)return 0;return queueNext(needed,null,{skipFailed:true})})();try{return await maintainBufferPromise}finally{maintainBufferPromise=null}}
 function emit(){window.dispatchEvent(new CustomEvent('genreactrix:ai-jobs'));render()}
 function configFromForm(){const components=componentMap();document.querySelectorAll('[data-ai-component]').forEach(row=>{const key=row.dataset.aiComponent;components[key]={enabled:row.querySelector('input').checked,behavior:row.querySelector('select').value}});const promptRefs={};for(const [key,v] of Object.entries(components))if(v.enabled){const p=window.genreactrixPromptLibraryEngine?.active?.(key);if(p)promptRefs[key]={id:p.id,version:p.version,name:p.name}}return{target:document.getElementById('aiTarget').value,quantity:Number(document.getElementById('aiQuantity').value)||100,quantityMode:document.getElementById('aiQuantityMode').value,order:document.getElementById('aiOrder').value,components,promptRefs}}
 function cycleEvent(message,level='info'){const log=window.genreactrixEventLog;const fn=level==='warn'?log?.warn:level==='error'?log?.error:log?.info;fn?.(message,'CYCLE');}
 function setCycleUi(running,message=''){
  const button=document.getElementById('aiCycleBtn'),status=document.getElementById('aiCycleStatus'),start=document.getElementById('aiStartJob');
  if(button){button.textContent=running?'Stop Cycle':'Cycle';button.classList.toggle('is-running',running);button.title=running?'Stop after the current AI operation':'Repeat Missing analysis for the frozen selection, up to three total passes';}
  if(start)start.disabled=running;if(status)status.textContent=message;
 }
 function missingComponentsFrom(config){const next=componentMap();for(const [key,value] of Object.entries(config.components||{}))if(value.enabled&&next[key])next[key]={enabled:true,behavior:'analyze'};return next;}
 function unresolvedForCycle(imageIds,components){
  const wanted=new Set((imageIds||[]).map(String)),records=(window.genreactrixImageRecordEngine?.all?.()||[]).filter(record=>wanted.has(String(record.id))),out=[];
  const selected=Object.entries(components||{}).filter(([,value])=>value.enabled);
  for(const record of records)for(const [component] of selected){const field=COMPONENTS.find(([id])=>id===component)?.[2],status=record.components?.[field]||'missing';if(['missing','stale','failed','partial'].includes(status))out.push(`${record.id}:${component}`);}
  return out.sort();
 }
 async function cycleMissing(){
  if(cycleRunning){cycleStopRequested=true;setCycleUi(true,'Stopping…');cycleEvent('Stop requested.','warn');if(cycleCurrentJobId)await stop(cycleCurrentJobId);return;}
  try{
   if(!window.GenreactrixCloudApi.isConfigured())throw new Error('Save a Worker URL before starting Cycle');
   const base=configFromForm(),components=missingComponentsFrom(base),enabled=Object.values(components).some(value=>value.enabled);if(!enabled)throw new Error('Choose at least one AI component');
   const selectionConfig={...base,components};
   const activeItems=(await all(ITEMS)).filter(item=>['queued','processing'].includes(item.state)),activeIds=new Set(activeItems.map(item=>String(item.imageId)));
   const initialRows=applyQuantity(eligibleRecords(selectionConfig).filter(record=>!activeIds.has(String(record.id))&&Object.entries(components).some(([component,value])=>value.enabled&&shouldRun(record,component,'analyze'))),selectionConfig);
   const imageIds=initialRows.map(record=>record.id);if(!imageIds.length)throw new Error('No matching images need Missing analysis');
   const cycleConfig={...base,target:'selected',imageIds,quantityMode:'all',quantity:imageIds.length,components};
   cycleRunning=true;cycleStopRequested=false;setCycleUi(true,`Cycle · ${imageIds.length} images`);cycleEvent(`Started with ${imageIds.length} frozen image${imageIds.length===1?'':'s'}.`);
   let finished=false;
   for(let pass=1;pass<=CYCLE_MAX_PASSES&&!cycleStopRequested;pass++){
    const before=unresolvedForCycle(imageIds,components);if(!before.length){setCycleUi(true,'Cycle complete · 0 unresolved');cycleEvent(`Pass ${pass}: nothing unresolved. Cycle complete.`);finished=true;break;}
    setCycleUi(true,`Cycle pass ${pass} of ${CYCLE_MAX_PASSES} · ${before.length} unresolved`);cycleEvent(`Pass ${pass} of ${CYCLE_MAX_PASSES} starting · ${before.length} unresolved image/component pair${before.length===1?'':'s'}.`);
    const job=await createJob(cycleConfig);
    if(job.total){cycleCurrentJobId=job.id;await run(job.id);const finalJob=(await all(JOBS)).find(item=>item.id===job.id);cycleCurrentJobId=null;if(cycleStopRequested||finalJob?.state==='cancelled'){setCycleUi(true,'Cycle stopped');cycleEvent(`Stopped during pass ${pass}.`,'warn');break;}if(finalJob?.state==='paused'){setCycleUi(true,'Cycle paused by provider error');cycleEvent(`Stopped because pass ${pass} paused: ${finalJob.message}`,'error');break;}}
    const unresolved=unresolvedForCycle(imageIds,components);
    if(!unresolved.length){setCycleUi(true,`Cycle complete · pass ${pass}`);cycleEvent(`Pass ${pass} completed with 0 unresolved. Cycle complete.`);finished=true;break;}
    cycleEvent(`Pass ${pass} completed · ${unresolved.length} unresolved remain.`,'warn');
    if(pass===CYCLE_MAX_PASSES){const imageCount=new Set(unresolved.map(value=>value.split(':')[0])).size;setCycleUi(true,`Cycle limit · ${imageCount} image${imageCount===1?'':'s'} unresolved`);cycleEvent(`Cycle stopped after ${CYCLE_MAX_PASSES} total passes. ${imageCount} image${imageCount===1?'':'s'} remain unresolved across ${unresolved.length} selected component${unresolved.length===1?'':'s'}.`,'warn');finished=true;}
   }
   if(cycleStopRequested&&!finished)setCycleUi(true,'Cycle stopped');
  }catch(error){setCycleUi(false,String(error.message||error));cycleEvent(String(error.message||error),'error');return;}
  finally{cycleRunning=false;cycleCurrentJobId=null;const status=document.getElementById('aiCycleStatus')?.textContent||'';setCycleUi(false,status);render();}
 }
 async function render(){
  const snap=await snapshot();
  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=String(v)};
  set('portraitAiReadyCount',snap.ready);set('portraitAiPendingCount',snap.pending);set('portraitAiBufferTarget',snap.bufferTarget);
  set('aiDialogQueued',snap.items.filter(i=>i.state==='queued').length);set('aiDialogRunning',snap.items.filter(i=>i.state==='processing').length);set('aiDialogDone',snap.items.filter(i=>i.state==='complete').length);set('aiDialogFailed',snap.items.filter(i=>i.state==='failed').length);
  const ordered=[...snap.jobs].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
  const latest=ordered[0], selectedId=document.getElementById('aiJobSummary')?.dataset.jobId||latest?.id||'';
  const selected=ordered.find(j=>j.id===selectedId)||latest;
  const progress=document.getElementById('aiJobProgress');if(progress)progress.value=selected?.total?Math.round(((selected.completed+selected.failed)/selected.total)*100):0;
  const summary=document.getElementById('aiJobSummary');if(summary){summary.dataset.jobId=selected?.id||'';summary.textContent=selected?`${selected.message} · ${selected.completed}/${selected.total} complete · ${selected.failed} failed`:'No AI job selected.'}
  const list=document.getElementById('aiJobList');if(list)list.innerHTML=ordered.slice(0,20).map(j=>`<button type="button" class="ai-job-row ${j.id===selected?.id?'is-selected':''}" data-ai-job-id="${j.id}"><span>${j.state}<small>${new Date(j.createdAt).toLocaleString()} · ${j.message}</small></span><strong>${j.completed}/${j.total}</strong></button>`).join('')||'<div class="ai-job-detail">No AI jobs.</div>';
  const detail=document.getElementById('aiJobDetail');if(detail){if(!selected)detail.textContent='Select a job to inspect its target, components, failures, provider and prompt versions.';else{const enabled=Object.entries(selected.config?.components||{}).filter(([,v])=>v.enabled).map(([k,v])=>`${k}: ${v.behavior}`).join(', '),failures=snap.items.filter(i=>i.jobId===selected.id&&i.error).slice(-3).map(i=>i.error),failureText=failures.length?`\nLatest failure: ${failures[failures.length-1]}`:'';detail.textContent=`${selected.id}\nTarget: ${selected.config?.target||'—'} · ${selected.config?.quantityMode||'—'} ${selected.config?.quantity||''}\nOrder: ${selected.config?.order||'—'}\nComponents: ${enabled||'none'}\nCreated: ${selected.createdAt}\nState: ${selected.state} · ${selected.message}${failureText}`}}
  const pre=document.getElementById('aiPreflight');if(pre){try{const cfg=configFromForm();const enabled=Object.entries(cfg.components).filter(([,v])=>v.enabled),activeImageIds=new Set(snap.items.filter(i=>['queued','processing'].includes(i.state)).map(i=>i.imageId));const eligibleRows=eligibleRecords(cfg).filter(r=>!activeImageIds.has(r.id)&&enabled.some(([c,v])=>shouldRun(r,c,v.behavior))),eligible=eligibleRows.length,willRun=applyQuantity(eligibleRows,cfg).length;pre.textContent=`${eligible} eligible image${eligible===1?'':'s'} · ${willRun} will run · ${enabled.length} component${enabled.length===1?'':'s'} selected`;}catch(e){pre.textContent=e.message}}
  window.renderPortraitControlStation?.();
 }
 function openConsole(){
  const d=document.getElementById('aiAnalysisDialog');if(!d)return;
  document.getElementById('aiWorkerUrl').value=window.GenreactrixCloudApi.getBaseUrl();
  document.getElementById('aiAnalysisKey').value=window.GenreactrixCloudApi.getKey();
  document.getElementById('aiQuantity').value=String(Math.max(1,Number(window.genreactrixSettingsEngine?.get?.('defaults.ai.quickAdd',100))||100));
  document.getElementById('aiAutoEnabled').checked=Boolean(window.genreactrixSettingsEngine?.get?.('ai.lookAhead.enabled',true));
  document.getElementById('aiAutoBuffer').value=String(Math.max(0,Number(window.genreactrixSettingsEngine?.get?.('ai.buffer.target',25))||25));
  document.getElementById('aiAutoRefill').value=String(Math.max(0,Number(window.genreactrixSettingsEngine?.get?.('ai.buffer.refillThreshold',10))||10));
  document.getElementById('aiAutoPriority').value=window.genreactrixSettingsEngine?.get?.('ai.lookAhead.priority','low')||'low';
  document.getElementById('aiModelName').value=window.genreactrixSettingsEngine?.get?.('ai.provider.model','')||'';
  document.getElementById('aiPromptVersion').value=window.genreactrixSettingsEngine?.get?.('ai.prompt.version','genreactrix-v3-114-point-prims')||'genreactrix-v3-114-point-prims';
  syncComponentChecksFromDefaults();render();d.showModal();
 }
 function initUi(){
  const grid=document.getElementById('aiComponentGrid');
  if(grid)grid.innerHTML=COMPONENTS.map(([key,label])=>`<label class="ai-component-option" data-ai-component="${key}"><input type="checkbox" ${['reactions','themes','description'].includes(key)?'checked':''}><span>${label}</span><select aria-label="${label} behavior"><option value="analyze">Missing</option><option value="reanalyze">Rerun</option></select></label>`).join('');
  document.getElementById('aiAnalysisClose')?.addEventListener('click',()=>document.getElementById('aiAnalysisDialog')?.close());
  document.getElementById('aiSaveProvider')?.addEventListener('click',async()=>{
    window.GenreactrixCloudApi.configure(document.getElementById('aiWorkerUrl').value);window.GenreactrixCloudApi.setKey(document.getElementById('aiAnalysisKey').value);
    window.genreactrixSettingsEngine?.set?.('ai.provider.model',document.getElementById('aiModelName').value.trim());window.genreactrixSettingsEngine?.set?.('ai.prompt.version',document.getElementById('aiPromptVersion').value.trim()||'genreactrix-v3-114-point-prims');
    window.GenreactrixCloudApi.reload?.();document.getElementById('aiProviderStatus').textContent='Saved';await resumeStrandedJobs();render();maintainBuffer().catch(console.warn);
  });
  document.getElementById('aiSaveAutomatic')?.addEventListener('click',async()=>{
    await window.genreactrixSettingsEngine?.set?.('ai.lookAhead.enabled',document.getElementById('aiAutoEnabled').checked);
    await window.genreactrixSettingsEngine?.set?.('ai.buffer.target',Math.max(0,Number(document.getElementById('aiAutoBuffer').value)||0));
    await window.genreactrixSettingsEngine?.set?.('ai.buffer.refillThreshold',Math.max(0,Number(document.getElementById('aiAutoRefill').value)||0));
    await window.genreactrixSettingsEngine?.set?.('ai.lookAhead.priority',document.getElementById('aiAutoPriority').value);
    document.getElementById('aiAutomaticStatus').textContent='Saved';await render();if(document.getElementById('aiAutoEnabled').checked)maintainBuffer().catch(console.warn);
  });
  document.getElementById('aiHealthCheck')?.addEventListener('click',async()=>{const el=document.getElementById('aiProviderStatus');el.textContent='Checking…';try{const p=await window.GenreactrixCloudApi.verifyConnection();el.textContent=p.auth==='verified'?'Configured · key verified':(p.vision||p.status||'Connected')}catch(e){el.textContent=e.message}});
  document.getElementById('aiStartJob')?.addEventListener('click',async()=>{try{const cfg=configFromForm(), enabled=Object.values(cfg.components).some(v=>v.enabled);if(!enabled)throw new Error('Choose at least one AI component');if(!window.GenreactrixCloudApi.isConfigured())throw new Error('Save a Worker URL before starting');const j=await createJob(cfg);if(!j.total)throw new Error('No matching images need the selected analysis');await run(j.id)}catch(e){document.getElementById('aiJobSummary').textContent=e.message}});
  document.getElementById('aiCycleBtn')?.addEventListener('click',()=>cycleMissing());
  document.querySelectorAll('#aiAnalysisDialog input,#aiAnalysisDialog select').forEach(el=>{if(!['aiWorkerUrl','aiAnalysisKey','aiModelName','aiPromptVersion'].includes(el.id))el.addEventListener('change',()=>{if(el.closest?.('[data-ai-component]'))saveComponentDefaultsFromGrid();render()})});
  document.getElementById('aiJobList')?.addEventListener('click',e=>{const b=e.target.closest('[data-ai-job-id]');if(!b)return;document.getElementById('aiJobSummary').dataset.jobId=b.dataset.aiJobId;render()});
  const current=()=>document.getElementById('aiJobSummary').dataset.jobId||null;
  document.getElementById('aiPauseJob')?.addEventListener('click',()=>current()&&pause(current()));document.getElementById('aiResumeJob')?.addEventListener('click',()=>current()&&resume(current()));document.getElementById('aiStopJob')?.addEventListener('click',()=>current()&&stop(current()));document.getElementById('aiRetryFailed')?.addEventListener('click',()=>current()&&retryFailed(current()));
 }

 function safeExportName(value,fallback='image'){
  const clean=String(value||fallback).replace(/[\\/:*?"<>|\x00-\x1F]/g,'_').trim();return clean||fallback;
 }
 function crc32(bytes){
  let crc=0xffffffff;for(const byte of bytes){crc^=byte;for(let k=0;k<8;k++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return (crc^0xffffffff)>>>0;
 }
 function dosStamp(input){
  const d=input instanceof Date?input:new Date(input||Date.now()),year=Math.max(1980,d.getFullYear());
  return {time:((d.getHours()&31)<<11)|((d.getMinutes()&63)<<5)|((Math.floor(d.getSeconds()/2))&31),date:(((year-1980)&127)<<9)|(((d.getMonth()+1)&15)<<5)|(d.getDate()&31)};
 }
 function u16(v){return new Uint8Array([v&255,(v>>>8)&255]);}
 function u32(v){return new Uint8Array([v&255,(v>>>8)&255,(v>>>16)&255,(v>>>24)&255]);}
 function joinBytes(parts){const total=parts.reduce((n,p)=>n+p.length,0),out=new Uint8Array(total);let offset=0;for(const p of parts){out.set(p,offset);offset+=p.length;}return out;}
 async function storedZip(entries){
  const encoder=new TextEncoder(),locals=[],centrals=[];let offset=0;
  for(const entry of entries){
    const name=encoder.encode(entry.name),bytes=entry.bytes instanceof Uint8Array?entry.bytes:new Uint8Array(entry.bytes),crc=crc32(bytes),stamp=dosStamp(entry.date),size=bytes.length;
    const local=joinBytes([u32(0x04034b50),u16(20),u16(0),u16(0),u16(stamp.time),u16(stamp.date),u32(crc),u32(size),u32(size),u16(name.length),u16(0),name,bytes]);
    const central=joinBytes([u32(0x02014b50),u16(20),u16(20),u16(0),u16(0),u16(stamp.time),u16(stamp.date),u32(crc),u32(size),u32(size),u16(name.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(offset),name]);
    locals.push(local);centrals.push(central);offset+=local.length;
  }
  const centralBytes=joinBytes(centrals),localBytes=joinBytes(locals),end=joinBytes([u32(0x06054b50),u16(0),u16(0),u16(entries.length),u16(entries.length),u32(centralBytes.length),u32(localBytes.length),u16(0)]);
  return new Blob([localBytes,centralBytes,end],{type:'application/zip'});
 }
 function downloadBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
 async function exportFails(){
  const records=window.genreactrixCurrentAiFailureRecords?.()||[];if(!records.length)throw new Error('No current AI failures are available to export.');
  const [jobs,items]=await Promise.all([all(JOBS),all(ITEMS)]),jobsById=new Map(jobs.map(job=>[job.id,job])),recordIds=new Set(records.map(r=>r.id)),entries=[],manifestRows=[],usedNames=new Set();
  for(const record of records){
    let blob=await window.imageBlobGet?.(record.id).catch(()=>null);
    if(!blob){const url=record.storage?.hyperlink||record.source?.originalUrl;if(url){const response=await fetch(url,{mode:'cors'});if(response.ok)blob=await response.blob();}}
    if(!blob)throw new Error(`Could not copy ${record.source?.originalFilename||record.name||record.id}; export cancelled before anything moved.`);
    let filename=safeExportName(record.source?.originalFilename||record.name||`${record.id}.img`),base=filename,n=2;while(usedNames.has(filename)){const dot=base.lastIndexOf('.');filename=dot>0?`${base.slice(0,dot)}-${n++}${base.slice(dot)}`:`${base}-${n++}`;}usedNames.add(filename);
    entries.push({name:`images/${filename}`,bytes:new Uint8Array(await blob.arrayBuffer()),date:new Date(record.createdAt||Date.now())});
    const related=items.filter(item=>item.imageId===record.id&&item.error).sort((a,b)=>String(jobsById.get(a.jobId)?.createdAt||'').localeCompare(String(jobsById.get(b.jobId)?.createdAt||'')));
    const latest=related.at(-1)||null,job=latest?jobsById.get(latest.jobId):null;
    manifestRows.push({
      imageId:record.id,filename:record.source?.originalFilename||record.name||filename,zipPath:`images/${filename}`,
      failedComponents:[['reactions','aiReactions'],['themes','aiThemes'],['description','aiDescription'],['reactionReasons','aiReactionReasons'],['genreReasons','aiGenreReasons']].filter(([,field])=>record.components?.[field]==='failed').map(([component])=>component),
      error:latest?.error||record.error||'',aiJobId:latest?.jobId||null,attempts:latest?.attempts||0,jobCreatedAt:job?.createdAt||null,jobCompletedAt:job?.completedAt||null,
      model:window.genreactrixSettingsEngine?.get?.('ai.provider.model','')||null,promptVersion:window.genreactrixSettingsEngine?.get?.('ai.prompt.version','')||null,
      configuration:job?.config||null,workerBaseUrl:window.GenreactrixCloudApi?.getBaseUrl?.()||null,siteBuild:window.GENREACTRIX_BUILD||null
    });
  }
  const exportedAt=new Date().toISOString(),manifest={schemaVersion:1,type:'genreactrix-ai-failure-export',exportedAt,count:manifestRows.length,images:manifestRows};
  entries.unshift({name:'failure-manifest.json',bytes:new TextEncoder().encode(JSON.stringify(manifest,null,2)),date:new Date()});
  const zip=await storedZip(entries),stamp=exportedAt.replace(/[:.]/g,'-'),filename=`genreactrix-ai-fails-${stamp}.zip`;downloadBlob(zip,filename);
  const move=confirm(`Failure ZIP created with ${records.length} image${records.length===1?'':'s'} and manifest.\n\nAfter you have saved the ZIP, move these exported failures to Recycle?`);
  if(!move){render();window.renderPortraitControlStation?.();return{exported:records.length,moved:0,filename};}
  const affectedJobIds=new Set(),affectedItems=[];
  for(const item of items){if(recordIds.has(item.imageId)&&item.state==='failed'){item.state='exported';item.exportedAt=exportedAt;item.exportedError=item.error;await put(ITEMS,item);affectedJobIds.add(item.jobId);affectedItems.push(item);}}
  for(const record of records)await window.genreactrixImagesEngine?.moveAiFailureToRecycle?.(record.id);
  for(const item of affectedItems)await q()?.setItemState?.(`queue_${item.id}`,'cancelled',{error:'Failure exported; original moved to Recycle'}).catch(()=>{});
  for(const jobId of affectedJobIds){
    const rows=await byIndex(ITEMS,'jobId',jobId),job=(await all(JOBS)).find(j=>j.id===jobId);if(!job)continue;
    const failed=rows.filter(i=>i.state==='failed').length,exported=rows.filter(i=>i.state==='exported').length;
    job.completed=rows.filter(i=>i.state==='complete').length;job.failed=failed;job.skipped=rows.filter(i=>['cancelled','exported','skipped'].includes(i.state)).length;job.exportedFailures=exported;job.updatedAt=exportedAt;
    if(!failed&&['completed-with-failures','failed'].includes(job.state)){job.state='completed';job.message='Failures exported to Recycle';job.completedAt=job.completedAt||exportedAt;}
    await put(JOBS,job);
    const queueJobId=`queue_${jobId}`;const queueJob=q()?.getJob?.(queueJobId);if(queueJob&&!failed)await q()?.patchJob?.(queueJobId,{state:'completed',message:'Failures exported to Recycle',completedAt:queueJob.completedAt||exportedAt});
  }
  await q()?.refresh?.();emit();render();window.renderPortraitControlStation?.();window.dispatchEvent(new CustomEvent('genreactrix:ai-failures-exported',{detail:{imageIds:[...recordIds],filename,exportedAt}}));
  return{exported:records.length,moved:records.length,filename};
 }

 async function verify(){const jobs=await all(JOBS),items=await all(ITEMS),issues=[],jobIds=new Set(jobs.map(j=>j.id));for(const item of items){if(!jobIds.has(item.jobId))issues.push({type:'ai-item-missing-job',recordId:item.id,severity:'attention'});if(item.state==='processing'&&!jobs.some(j=>j.id===item.jobId&&j.state==='running'))issues.push({type:'ai-item-stuck-processing',recordId:item.id,severity:'attention'})}for(const job of jobs)if(job.state==='running'&&Date.now()-new Date(job.startedAt||job.createdAt).getTime()>86400000)issues.push({type:'ai-job-stuck',jobId:job.id,severity:'attention'});return{jobCount:jobs.length,itemCount:items.length,issueCount:issues.length,issues}}
 const engine={createJob,run,pause,resume,stop,retryFailed,exportFails,snapshot,snapshotCached,queueNext,maintainBuffer,cycleMissing,openConsole,verify,components:COMPONENTS};window.genreactrixAiAnalysisEngine=engine;window.genreactrixAIAnalysisEngine=engine;window.addEventListener('DOMContentLoaded',async()=>{q()?.registerType?.('ai',{pause,resume,stop,retry:retryFailed});initUi();syncComponentChecksFromDefaults();await reconcileCancelledJobs();await recoverInterruptedAiJobs();const startAfterSettings=async()=>{window.GenreactrixCloudApi?.reload?.();syncComponentChecksFromDefaults();await resumeStrandedJobs();render();maintainBuffer().catch(console.warn)};if(window.genreactrixSettingsEngine?.ready)await startAfterSettings();else window.addEventListener('genreactrix:settings-ready',()=>startAfterSettings().catch(console.warn),{once:true});render()});window.addEventListener('genreactrix:image-record',()=>render());
})();
