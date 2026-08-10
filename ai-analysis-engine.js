/* Genreactrix AI Analysis Engine v1
   Persistent modular jobs, adapted from Billy Labs job/provider patterns and connected
   to Genreactrix Image Record + History engines. No synthetic AI results are produced. */
(()=>{'use strict';
 const DB='genreactrix-ai-analysis',VERSION=1,JOBS='jobs',ITEMS='items';
 const COMPONENTS=[
  ['reactions','Reactions','aiReactions'],['themes','Themes','aiThemes'],['description','Description','aiDescription']
 ];
 const clone=v=>v==null?v:structuredClone(v),now=()=>new Date().toISOString(),id=p=>`${p}_${Date.now().toString(36)}_${crypto.randomUUID().slice(0,8)}`;
 const openDb=()=>new Promise((resolve,reject)=>{const r=indexedDB.open(DB,VERSION);r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains(JOBS)){const s=db.createObjectStore(JOBS,{keyPath:'id'});s.createIndex('state','state');s.createIndex('createdAt','createdAt')}if(!db.objectStoreNames.contains(ITEMS)){const s=db.createObjectStore(ITEMS,{keyPath:'id'});s.createIndex('jobId','jobId');s.createIndex('state','state');s.createIndex('imageId','imageId')}};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
 const tx=(store,mode,fn)=>openDb().then(db=>new Promise((resolve,reject)=>{const t=db.transaction(store,mode),s=t.objectStore(store);let out;try{out=fn(s,t)}catch(e){db.close();reject(e);return}t.oncomplete=()=>{db.close();resolve(out)};t.onerror=()=>{db.close();reject(t.error)}}));
 const put=(store,value)=>tx(store,'readwrite',s=>s.put(clone(value)));
 const all=store=>openDb().then(db=>new Promise((resolve,reject)=>{const t=db.transaction(store,'readonly'),r=t.objectStore(store).getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error);t.oncomplete=()=>db.close()}));
 const byIndex=(store,index,value)=>openDb().then(db=>new Promise((resolve,reject)=>{const t=db.transaction(store,'readonly'),r=t.objectStore(store).index(index).getAll(value);r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error);t.oncomplete=()=>db.close()}));
 const componentMap=()=>Object.fromEntries(COMPONENTS.map(([id])=>[id,{enabled:false,behavior:'analyze'}]));
 const portraitKey=id=>({reactionReasons:'reaction-reasons',genreReasons:'genre-reasons'}[id]||id);
 function savedComponentDefaults(){try{return window.genreactrixSettingsEngine?.get?.('ai.components.default',{})||{}}catch{return {}}}
 function syncComponentChecksFromDefaults(){const saved=savedComponentDefaults();document.querySelectorAll('[data-ai-component]').forEach(row=>{const input=row.querySelector('input'),select=row.querySelector('select'),key=portraitKey(row.dataset.aiComponent);if(input&&Object.prototype.hasOwnProperty.call(saved,key))input.checked=Boolean(saved[key]);if(select)select.value='analyze'})}
 function saveComponentDefaultsFromGrid(){const next={...savedComponentDefaults()};document.querySelectorAll('[data-ai-component]').forEach(row=>{const input=row.querySelector('input'),key=portraitKey(row.dataset.aiComponent);if(input)next[key]=Boolean(input.checked)});window.genreactrixSettingsEngine?.set?.('ai.components.default',next);document.querySelectorAll('[data-portrait-ai-output]').forEach(input=>{if(Object.prototype.hasOwnProperty.call(next,input.dataset.portraitAiOutput))input.checked=Boolean(next[input.dataset.portraitAiOutput])});return next}
 const q=()=>window.genreactrixQueueEngine;
 let snapshotCache={pending:0,available:0,ready:0,bufferTarget:25,jobs:[],items:[]};
 let maintainBufferPromise=null;
 function eligibleRecords(config){let rows=window.genreactrixImageRecordEngine?.all?.()||[];if(config.target==='flagged')rows=rows.filter(r=>r.attributes.flagged);else if(config.target==='saved')rows=rows.filter(r=>r.attributes.saved);else if(config.target==='failed')rows=rows.filter(r=>r.attributes.failed||Object.values(r.components||{}).includes('failed'));else if(config.target==='current'){const active=window.genreactrixBatchEngine?.activeIdCached||null;rows=active?rows.filter(r=>(r.batchIds||[]).includes(active)):rows.filter(r=>(r.batchIds||[]).includes('current-import'));}else if(config.target==='selected'){const ids=new Set((config.imageIds||[]).map(String));rows=rows.filter(r=>ids.has(String(r.id)));}if(config.order==='oldest')rows.sort((a,b)=>a.createdAt.localeCompare(b.createdAt));if(config.order==='newest')rows.sort((a,b)=>b.createdAt.localeCompare(a.createdAt));if(config.order==='random')rows.sort(()=>Math.random()-.5);if(config.quantityMode==='random')rows.sort(()=>Math.random()-.5);if(config.quantityMode!=='all')rows=rows.slice(0,Math.max(1,Number(config.quantity)||100));return rows;}
 function shouldRun(record,component,behavior){const field=COMPONENTS.find(([id])=>id===component)?.[2];const status=record.components?.[field]||'missing';return behavior==='reanalyze'||['missing','stale','failed','partial'].includes(status)}
 async function imageInput(record){if(record.storage?.hyperlink)return{imageUrl:record.storage.hyperlink};const blob=await window.imageBlobGet?.(record.id).catch(()=>null);if(!blob)throw new Error('Image source is unavailable');const dataUrl=await new Promise((resolve,reject)=>{const fr=new FileReader();fr.onload=()=>resolve(fr.result);fr.onerror=()=>reject(fr.error);fr.readAsDataURL(blob)});return{imageDataUrl:dataUrl}}
 async function createJob(config){const selected=Object.entries(config.components||{}).filter(([,v])=>v.enabled);if(!selected.length)throw new Error('Choose at least one AI component');const existingItems=await all(ITEMS),activeImageIds=new Set(existingItems.filter(i=>['queued','processing'].includes(i.state)).map(i=>i.imageId));const rows=eligibleRecords(config).filter(r=>{if(activeImageIds.has(r.id))return false;if(config.skipFailed){const hasFailed=selected.some(([c])=>{const field=COMPONENTS.find(([id])=>id===c)?.[2];return field&&r.components?.[field]==='failed'});if(hasFailed)return false;}return selected.some(([c,v])=>shouldRun(r,c,v.behavior));});if(!rows.length)return {id:null,schemaVersion:1,state:'completed',createdAt:now(),startedAt:null,completedAt:now(),config:clone(config),total:0,completed:0,failed:0,skipped:0,processing:0,message:'No eligible images',stopRequested:false};const job={id:id('ai_job'),schemaVersion:1,state:'queued',createdAt:now(),startedAt:null,completedAt:null,config:clone(config),total:rows.length,completed:0,failed:0,skipped:0,processing:0,message:'Queued',stopRequested:false};await put(JOBS,job);const queueJob=await q()?.createJob?.({id:`queue_${job.id}`,type:'ai',ownerEngine:'ai-analysis',ownerJobId:job.id,label:`AI analysis · ${rows.length} image${rows.length===1?'':'s'}`,state:'queued',total:rows.length,imageIds:rows.map(r=>r.id),batchId:window.genreactrixBatchEngine?.activeIdCached||null,message:'Queued'});const queueRows=[];for(const [order,record] of rows.entries()){const item={id:id('ai_item'),jobId:job.id,imageId:record.id,order,state:'queued',attempts:0,error:'',components:selected.map(([component,settings])=>({component,behavior:settings.behavior,state:'queued'}))};await put(ITEMS,item);queueRows.push({id:`queue_${item.id}`,imageId:record.id,ownerItemId:item.id,order,type:'ai',state:'queued'})}if(queueJob)await q()?.addItems?.(queueJob.id,queueRows);emit();return clone(job)}
 async function updateJob(job,patch){Object.assign(job,patch);await put(JOBS,job);emit();return job}
 async function processItem(job,item){
  item.state='processing';item.attempts++;item.error='';await put(ITEMS,item);await q()?.setItemState?.(`queue_${item.id}`,'processing',{attempts:item.attempts});job.processing=1;await updateJob(job,{message:`Analyzing ${job.completed+job.failed+1} of ${job.total}`});
  let record=window.genreactrixImageRecordEngine.get(item.imageId,{touch:false});if(!record)throw new Error('Image record not found');
  const pending=item.components.filter(c=>c.state==='queued'||c.state==='failed');
  for(const c of pending){const field=COMPONENTS.find(([id])=>id===c.component)?.[2];window.genreactrixImageRecordEngine.setComponent(record.id,field,'processing')}
  const input=await imageInput(record),errors=[];
  for(const c of pending){
    const field=COMPONENTS.find(([id])=>id===c.component)?.[2];
    try{
      const payload=await window.GenreactrixCloudApi.analyzeImage({imageId:record.id,components:[c.component],componentBehaviors:{[c.component]:c.behavior},promptRefs:job.config.promptRefs||{},...input},window.GenreactrixCloudApi.getKey());
      const result=payload.result||payload.report||payload;
      if(!result||typeof result!=='object')throw new Error('AI provider returned no structured result');
      if(!Object.prototype.hasOwnProperty.call(result.components||{},c.component))throw new Error(`AI provider omitted ${c.component}`);
      c.state='complete';
      record=window.genreactrixImageRecordEngine.get(record.id,{touch:false})||record;
      const previous=record.analysis?.ai||{};
      const analysis={...previous,components:{...(previous.components||{}),[c.component]:result.components[c.component]},provider:result.provider||previous.provider||{},model:result.model||result.provider?.model||previous.model||'',promptVersions:{...(previous.promptVersions||{}),...(result.promptVersions||{})},requested:[...new Set([...(previous.requested||[]),c.component])],recordedAt:now(),jobId:job.id};
      window.genreactrixImageRecordEngine.attachAI(record.id,analysis,{[field]:'current'});
      await window.genreactrixHistoryEngine.append({imageId:record.id,eventType:'ai-analysis',actor:'ai',sourceEngine:'ai-analysis',jobId:job.id,summary:`AI analyzed ${c.component}`,payload:{analysis:{components:{[c.component]:result.components[c.component]},provider:result.provider||{},model:analysis.model,promptVersions:result.promptVersions||{},requested:[c.component],jobId:job.id},componentUpdates:{[field]:'current'},partial:false}});
    }catch(error){
      const message=`${c.component}: ${String(error.message||error)}`;c.state='failed';errors.push(message);window.genreactrixImageRecordEngine.setComponent(record.id,field,'failed');
      await window.genreactrixHistoryEngine.append({imageId:record.id,eventType:'ai-failed',actor:'system',sourceEngine:'ai-analysis',jobId:job.id,summary:message,payload:{error:message,component:c.component}}).catch(()=>{});
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
 async function snapshot(){const jobs=await all(JOBS),items=await all(ITEMS);snapshotCache={pending:items.filter(i=>['queued','processing'].includes(i.state)).length,available:eligibleRecords({target:'current',quantityMode:'all',components:{reactions:{enabled:true,behavior:'analyze'}}}).length,ready:(window.genreactrixImageRecordEngine?.all?.()||[]).filter(r=>['current'].includes(r.components.aiReactions)&&['current'].includes(r.components.aiThemes)&&['current'].includes(r.components.aiDescription)).length,bufferTarget:Math.max(0,Number(window.genreactrixSettingsEngine?.get?.('ai.buffer.target',25))||25),quickAddAmount:Math.max(1,Number(window.genreactrixSettingsEngine?.get?.('defaults.ai.quickAdd',100))||100),jobs,items};return clone(snapshotCache)}
 function snapshotCached(){return clone(snapshotCache)}
 async function queueNext(count,outputs=null,options={}){const map=componentMap(),selected=outputs||window.selectedPortraitAiOutputs?.()||{};for(const [key,on] of Object.entries(selected)){const normalized={'reaction-reasons':'reactionReasons','genre-reasons':'genreReasons'}[key]||key;if(map[normalized])map[normalized]={enabled:Boolean(on),behavior:'analyze'}}const config={target:'current',quantityMode:'next',quantity:count,order:'queue',components:map,skipFailed:Boolean(options.skipFailed)};const job=await createJob(config);if(job.total&&window.GenreactrixCloudApi?.isConfigured())await run(job.id);render();return job.total}
 async function maintainBuffer(){if(!Boolean(window.genreactrixSettingsEngine?.get?.('ai.lookAhead.enabled',true)))return 0;if(maintainBufferPromise)return maintainBufferPromise;maintainBufferPromise=(async()=>{const snap=await snapshot();const needed=Math.max(0,snap.bufferTarget-snap.pending-snap.ready);if(!needed)return 0;return queueNext(needed,null,{skipFailed:true})})();try{return await maintainBufferPromise}finally{maintainBufferPromise=null}}
 function emit(){window.dispatchEvent(new CustomEvent('genreactrix:ai-jobs'));render()}
 function configFromForm(){const components=componentMap();document.querySelectorAll('[data-ai-component]').forEach(row=>{const key=row.dataset.aiComponent;components[key]={enabled:row.querySelector('input').checked,behavior:row.querySelector('select').value}});const promptRefs={};for(const [key,v] of Object.entries(components))if(v.enabled){const p=window.genreactrixPromptLibraryEngine?.active?.(key);if(p)promptRefs[key]={id:p.id,version:p.version,name:p.name}}return{target:document.getElementById('aiTarget').value,quantity:Number(document.getElementById('aiQuantity').value)||100,quantityMode:document.getElementById('aiQuantityMode').value,order:document.getElementById('aiOrder').value,components,promptRefs}}
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
  const pre=document.getElementById('aiPreflight');if(pre){try{const cfg=configFromForm();const enabled=Object.entries(cfg.components).filter(([,v])=>v.enabled);const eligible=eligibleRecords(cfg).filter(r=>enabled.some(([c,v])=>shouldRun(r,c,v.behavior))).length;pre.textContent=`${eligible} eligible image${eligible===1?'':'s'} · ${enabled.length} component${enabled.length===1?'':'s'} selected`;}catch(e){pre.textContent=e.message}}
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
  document.getElementById('aiPromptVersion').value=window.genreactrixSettingsEngine?.get?.('ai.prompt.version','genreactrix-v1')||'genreactrix-v1';
  syncComponentChecksFromDefaults();render();d.showModal();
 }
 function initUi(){
  const grid=document.getElementById('aiComponentGrid');
  if(grid)grid.innerHTML=COMPONENTS.map(([key,label])=>`<label class="ai-component-option" data-ai-component="${key}"><input type="checkbox" ${['reactions','themes','description'].includes(key)?'checked':''}><span>${label}</span><select aria-label="${label} behavior"><option value="analyze">Missing</option><option value="reanalyze">Rerun</option></select></label>`).join('');
  document.getElementById('aiAnalysisClose')?.addEventListener('click',()=>document.getElementById('aiAnalysisDialog')?.close());
  document.getElementById('aiSaveProvider')?.addEventListener('click',async()=>{
    window.GenreactrixCloudApi.configure(document.getElementById('aiWorkerUrl').value);window.GenreactrixCloudApi.setKey(document.getElementById('aiAnalysisKey').value);
    window.genreactrixSettingsEngine?.set?.('ai.provider.model',document.getElementById('aiModelName').value.trim());window.genreactrixSettingsEngine?.set?.('ai.prompt.version',document.getElementById('aiPromptVersion').value.trim()||'genreactrix-v1');
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
  document.querySelectorAll('#aiAnalysisDialog input,#aiAnalysisDialog select').forEach(el=>{if(!['aiWorkerUrl','aiAnalysisKey','aiModelName','aiPromptVersion'].includes(el.id))el.addEventListener('change',()=>{if(el.closest?.('[data-ai-component]'))saveComponentDefaultsFromGrid();render()})});
  document.getElementById('aiJobList')?.addEventListener('click',e=>{const b=e.target.closest('[data-ai-job-id]');if(!b)return;document.getElementById('aiJobSummary').dataset.jobId=b.dataset.aiJobId;render()});
  const current=()=>document.getElementById('aiJobSummary').dataset.jobId||null;
  document.getElementById('aiPauseJob')?.addEventListener('click',()=>current()&&pause(current()));document.getElementById('aiResumeJob')?.addEventListener('click',()=>current()&&resume(current()));document.getElementById('aiStopJob')?.addEventListener('click',()=>current()&&stop(current()));document.getElementById('aiRetryFailed')?.addEventListener('click',()=>current()&&retryFailed(current()));
 }

 async function verify(){const jobs=await all(JOBS),items=await all(ITEMS),issues=[],jobIds=new Set(jobs.map(j=>j.id));for(const item of items){if(!jobIds.has(item.jobId))issues.push({type:'ai-item-missing-job',recordId:item.id,severity:'attention'});if(item.state==='processing'&&!jobs.some(j=>j.id===item.jobId&&j.state==='running'))issues.push({type:'ai-item-stuck-processing',recordId:item.id,severity:'attention'})}for(const job of jobs)if(job.state==='running'&&Date.now()-new Date(job.startedAt||job.createdAt).getTime()>86400000)issues.push({type:'ai-job-stuck',jobId:job.id,severity:'attention'});return{jobCount:jobs.length,itemCount:items.length,issueCount:issues.length,issues}}
 const engine={createJob,run,pause,resume,stop,retryFailed,snapshot,snapshotCached,queueNext,maintainBuffer,openConsole,verify,components:COMPONENTS};window.genreactrixAiAnalysisEngine=engine;window.genreactrixAIAnalysisEngine=engine;window.addEventListener('DOMContentLoaded',async()=>{q()?.registerType?.('ai',{pause,resume,stop,retry:retryFailed});initUi();syncComponentChecksFromDefaults();await reconcileCancelledJobs();await recoverInterruptedAiJobs();const startAfterSettings=async()=>{window.GenreactrixCloudApi?.reload?.();syncComponentChecksFromDefaults();await resumeStrandedJobs();render();maintainBuffer().catch(console.warn)};if(window.genreactrixSettingsEngine?.ready)await startAfterSettings();else window.addEventListener('genreactrix:settings-ready',()=>startAfterSettings().catch(console.warn),{once:true});render()});window.addEventListener('genreactrix:image-record',()=>render());
})();
