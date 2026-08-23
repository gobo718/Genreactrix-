(function(){
  'use strict';
  const PROFILE_KEY='genreactrix-import-profiles-v1';
  const now=()=>new Date().toISOString();
  const profiles=()=>{try{return JSON.parse(localStorage.getItem(PROFILE_KEY)||'[]')}catch{return[]}};
  const saveProfiles=p=>localStorage.setItem(PROFILE_KEY,JSON.stringify(p));
  function profileDefaults(){return{id:'default',name:'Default intake',sourceType:'urls',mode:window.genreactrixSettingsEngine?.get?.('acquisition.defaultMode','link')||'link',quantity:Number(window.genreactrixSettingsEngine?.get?.('defaults.urls',100))||100,prefetch:true,target:'queue'}}
  function allProfiles(){const p=profiles();return p.length?p:[profileDefaults()]}
  function saveProfile(profile){const p=allProfiles().filter(x=>x.id!==profile.id);p.push({...profile,id:profile.id||`profile_${Date.now()}`,updatedAt:now()});saveProfiles(p);return p[p.length-1]}
  function normalizeUrls(text){return String(text||'').split(/\r?\n|,\s*(?=https?:)/).map(v=>v.trim()).filter(v=>/^https?:\/\//i.test(v))}
  function existingByUrl(){return new Map((window.genreactrixImagesEngine?.allRecords?.()||[]).filter(r=>r.source?.originalUrl).map(r=>[r.source.originalUrl,r]))}
  async function previewUrls(text,options={}){const urls=normalizeUrls(text).slice(0,Math.max(1,Number(options.limit)||100)),existing=existingByUrl(),rows=urls.map(url=>({url,knownSource:existing.has(url),existingImageId:existing.get(url)?.id||null,eligible:true}));return{sourceType:'urls',requested:Math.max(1,Number(options.limit)||100),found:rows.length,eligible:rows.length,knownSourceMatches:rows.filter(r=>r.knownSource).length,invalid:0,rows,estimatedBytes:null}}
  function gateStats(gates=[]){const importFailures=gates.filter(g=>g.type==='import-failure').length,duplicates=gates.filter(g=>g.type==='dupe'||g.type==='repeat').length;return{importFailures,duplicates,gated:gates.length,skipped:Math.max(0,gates.length-importFailures)}}
  async function completeJob(job,records,gates,pack){const stats=gateStats(gates),status=stats.importFailures?'completed-with-failures':'completed';return window.genreactrixImportJobEngine.patch(job.id,{status,completedAt:now(),imported:records.length,failed:stats.importFailures,duplicateCount:stats.duplicates,skipped:stats.skipped,imageIds:records.map(r=>r.id),packId:pack?.id||job.packId||null,metadata:{...(job.metadata||{}),originPackId:pack?.id||job.packId||null,originGateIds:gates.map(g=>g.id),originGateCount:gates.length}})}
  async function createPack({sourceType,sourceLabel,intakeMode,candidateCount,sourceContext={}}){const engine=window.genreactrixOriginPackEngine;if(!engine?.create)throw new Error('Origin Pack engine is unavailable');return engine.create({sourceType,sourceLabel,intakeMode,candidateCount,sourceContext,status:'draft'})}
  async function finishPack(pack,job,records,gates,status=null){if(!pack)return null;const stats=gateStats(gates),finalStatus=status||(gates.length?'completed-with-gates':'completed');return window.genreactrixOriginPackEngine.complete(pack.id,{status:finalStatus,importJobId:job?.id||null,imageIds:records.map(r=>r.id),originGateIds:gates.map(g=>g.id),metadata:{importStatus:job?.status||finalStatus,admittedCount:records.length,gateCount:gates.length,duplicateCount:stats.duplicates,importFailureCount:stats.importFailures}})}
  async function runUrls(text,options={}){
    const preview=await previewUrls(text,options);if(!preview.found)throw new Error('No eligible image URLs were found.');
    const sourceLabel=options.sourceLabel||'URL list',intakeMode=options.mode||'link';
    const pack=await createPack({sourceType:'urls',sourceLabel,intakeMode,candidateCount:preview.found,sourceContext:{requested:preview.requested,found:preview.found,prefetch:Boolean(options.prefetch),profileId:options.profileId||null}});
    const job=await window.genreactrixImportJobEngine.create({sourceType:'urls',sourceLabel,profileId:options.profileId||null,targetBatchId:null,mode:intakeMode,requested:preview.requested,packId:pack.id,metadata:{prefetch:Boolean(options.prefetch),originPackId:pack.id}});
    await window.genreactrixOriginPackEngine.patch(pack.id,{status:'importing',startedAt:now(),importJobId:job.id});
    await window.genreactrixImportJobEngine.patch(job.id,{status:'running',startedAt:now(),found:preview.found});
    try{
      const sourceText=preview.rows.map(r=>r.url).join('\n'),records=await window.genreactrixImagesEngine.importUrls(sourceText,{limit:preview.found,mode:options.mode==='temporary'?'download':'link',prefetch:Boolean(options.prefetch),importJobId:job.id,packId:pack.id}),gates=records.originGates||[];
      const completedJob=await completeJob(job,records,gates,pack);await finishPack(pack,completedJob,records,gates);const stats=gateStats(gates);
      window.genreactrixNotificationsEngine?.create?.({severity:stats.importFailures?'attention':'info',title:'Import complete',message:`${records.length} imported${gates.length?` · ${gates.length} Origin gate${gates.length===1?'':'s'}`:''}${stats.importFailures?` · ${stats.importFailures} failure${stats.importFailures===1?'':'s'}`:''}`,ownerEngine:'origin',relatedJobId:job.id,dedupeKey:`import:${job.id}:complete`,resolved:!stats.importFailures});
      window.dispatchEvent(new CustomEvent('genreactrix:import-complete',{detail:{jobId:job.id,packId:pack.id,imageIds:records.map(r=>r.id),originGateIds:gates.map(g=>g.id)}}));return{job:await window.genreactrixImportJobEngine.get(job.id),pack:await window.genreactrixOriginPackEngine.get(pack.id),records,gates,preview};
    }catch(error){await window.genreactrixImportJobEngine.patch(job.id,{status:'failed',completedAt:now(),failed:preview.found,errors:[String(error?.message||error)]});await window.genreactrixOriginPackEngine.patch(pack.id,{status:'failed',completedAt:now(),metadata:{error:String(error?.message||error)}});throw error}
  }
  const IMAGE_FILE_RE=/\.(?:jpe?g|png|gif|webp|bmp|avif|heic|heif)$/i;
  function isImageFile(file){const type=String(file?.type||'').toLowerCase();return type.startsWith('image/')||IMAGE_FILE_RE.test(String(file?.name||''))}
  async function runFiles(fileList,options={}){
    const files=[...fileList].filter(isImageFile).slice(0,Math.max(1,Number(options.limit)||100));if(!files.length)throw new Error('No eligible image file was selected.');
    const sourceLabel=options.sourceLabel||(files.length===1?files[0].name:`${files.length} selected files`);
    const pack=await createPack({sourceType:'file-selection',sourceLabel,intakeMode:'temporary',candidateCount:files.length,sourceContext:{selectedCount:files.length,profileId:options.profileId||null,sampleFilenames:files.slice(0,25).map(f=>f.name)}});
    const job=await window.genreactrixImportJobEngine.create({sourceType:'file-selection',sourceLabel,profileId:options.profileId||null,targetBatchId:null,mode:'temporary',requested:files.length,packId:pack.id,metadata:{originPackId:pack.id}});
    await window.genreactrixOriginPackEngine.patch(pack.id,{status:'importing',startedAt:now(),importJobId:job.id});
    await window.genreactrixImportJobEngine.patch(job.id,{status:'running',startedAt:now(),found:files.length});
    try{
      const records=await window.genreactrixImagesEngine.importFiles(files,{limit:files.length,importJobId:job.id,packId:pack.id}),gates=records.originGates||[];
      const completedJob=await completeJob(job,records,gates,pack);await finishPack(pack,completedJob,records,gates);
      window.dispatchEvent(new CustomEvent('genreactrix:import-complete',{detail:{jobId:job.id,packId:pack.id,imageIds:records.map(r=>r.id),originGateIds:gates.map(g=>g.id)}}));return{job:await window.genreactrixImportJobEngine.get(job.id),pack:await window.genreactrixOriginPackEngine.get(pack.id),records,gates};
    }catch(error){await window.genreactrixImportJobEngine.patch(job.id,{status:'failed',completedAt:now(),failed:files.length,errors:[String(error?.message||error)]});await window.genreactrixOriginPackEngine.patch(pack.id,{status:'failed',completedAt:now(),metadata:{error:String(error?.message||error)}});throw error}
  }
  async function dashboard(){const jobs=await window.genreactrixImportJobEngine.all(),records=window.genreactrixImagesEngine?.allRecords?.()||[],output=(window.genreactrixInboxAiOutputRecords?.()||[]).length,origin=await window.genreactrixOriginGateEngine?.snapshot?.()||{};return{active:jobs.filter(j=>['running','paused'].includes(j.status)),recent:jobs.slice(0,20),failed:jobs.filter(j=>j.status==='failed'||j.status==='completed-with-failures'),pendingAi:records.filter(r=>['queued','ai-partial'].includes(r.workflow?.stage)&&!r.attributes?.failed).length,aiOutput:output,origin}}
  window.genreactrixImportEngine={allProfiles,saveProfile,previewUrls,runUrls,runFiles,dashboard,verify:async()=>({importJobs:await window.genreactrixImportJobEngine.verify(),originPacks:await window.genreactrixOriginPackEngine?.verify?.()})};
})();
(function(){
  'use strict';

  const REPAIR_ID='url-image-display-cache-v1';
  const DB_NAME='genreactrix-image-engine';
  const BLOB_STORE='image-blobs';
  const objectUrls=new Map();
  let installTimer=0;
  let startupRepairStarted=false;

  function sourceUrl(record){
    return String(record?.storage?.hyperlink||record?.source?.originalUrl||'').trim();
  }

  function isLinkedSource(record){
    return Boolean(record)&&record.storage?.mode==='linked'&&!record.attributes?.saved&&Boolean(sourceUrl(record));
  }

  function isActive(record){
    return Boolean(record)&&!record.attributes?.inRecycleBin&&!record.attributes?.rejected&&!record.attributes?.archived;
  }

  function openImageDb(){
    return new Promise((resolve,reject)=>{
      if(!globalThis.indexedDB){reject(new Error('IndexedDB is unavailable'));return;}
      const request=indexedDB.open(DB_NAME);
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error||new Error('Image database could not be opened'));
    });
  }

  async function blobGet(id){
    const db=await openImageDb();
    return new Promise((resolve,reject)=>{
      let tx;
      try{tx=db.transaction(BLOB_STORE,'readonly');}
      catch(error){db.close();reject(error);return;}
      const request=tx.objectStore(BLOB_STORE).get(id);
      request.onsuccess=()=>resolve(request.result||null);
      request.onerror=()=>reject(request.error||new Error('Image cache read failed'));
      tx.oncomplete=()=>db.close();
      tx.onerror=()=>{try{db.close();}catch{}};
    });
  }

  async function blobPut(id,blob){
    const db=await openImageDb();
    await new Promise((resolve,reject)=>{
      let tx;
      try{tx=db.transaction(BLOB_STORE,'readwrite');}
      catch(error){db.close();reject(error);return;}
      tx.objectStore(BLOB_STORE).put(blob,id);
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error||new Error('Image cache write failed'));
      tx.onabort=()=>reject(tx.error||new Error('Image cache write aborted'));
    });
    db.close();
    await window.genreactrixProjectRuntimeEngine?.registerAsset?.({
      imageId:id,
      kind:'working-fullres',
      state:'working',
      database:DB_NAME,
      store:BLOB_STORE,
      storageKey:id,
      mimeType:blob?.type||'',
      size:blob?.size||0,
      metadata:{urlDisplayCache:true,repairId:REPAIR_ID}
    });
  }

  async function fetchImage(url){
    let directError=null;
    try{
      const response=await fetch(url,{mode:'cors'});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const blob=await response.blob();
      if(!blob.type?.startsWith('image/'))throw new Error('URL did not return an image');
      return blob;
    }catch(error){directError=error;}

    if(window.GenreactrixCloudApi?.isConfigured?.()&&window.GenreactrixCloudApi?.getKey?.()){
      try{
        const blob=await window.GenreactrixCloudApi.fetchImage(url);
        if(!blob?.type?.startsWith('image/'))throw new Error('Worker did not return an image');
        return blob;
      }catch(proxyError){
        throw new Error(`Could not retrieve image directly (${directError?.message||directError}) or through the configured Worker (${proxyError?.message||proxyError})`);
      }
    }
    throw directError||new Error('Could not retrieve image');
  }

  async function cacheRecord(record){
    if(!isLinkedSource(record))return null;
    const id=String(record.id);
    let blob=await blobGet(id).catch(()=>null);
    if(!blob){
      blob=await fetchImage(sourceUrl(record));
      await blobPut(id,blob);
    }
    return blob;
  }

  function objectUrl(id,blob){
    const key=String(id);
    const old=objectUrls.get(key);
    if(old)URL.revokeObjectURL(old);
    const next=URL.createObjectURL(blob);
    objectUrls.set(key,next);
    return next;
  }

  async function materialize(record,engine){
    const blob=await cacheRecord(record);
    if(!blob)return null;
    return{
      id:record.id,
      name:record.name,
      url:objectUrl(record.id,blob),
      imageRecord:engine.recordById?.(record.id)||record,
      isRemoteSource:false,
      isUrlDisplayCache:true
    };
  }

  async function repairRecords(records,{concurrency=3}={}){
    const queue=(Array.isArray(records)?records:[]).filter(record=>isActive(record)&&isLinkedSource(record));
    if(!queue.length)return{requested:0,repaired:0,failed:0};
    let cursor=0,repaired=0,failed=0;
    const worker=async()=>{
      while(cursor<queue.length){
        const record=queue[cursor++];
        try{await cacheRecord(record);repaired++;}
        catch(error){failed++;console.warn('URL image cache repair could not retrieve source',record?.id,error);}
      }
    };
    await Promise.all(Array.from({length:Math.min(Math.max(1,concurrency),queue.length)},worker));
    return{requested:queue.length,repaired,failed};
  }

  function install(){
    const engine=window.genreactrixImagesEngine;
    if(!engine?.displayFile)return false;
    if(engine.__urlImageDisplayRepair===REPAIR_ID)return true;

    const originalDisplayFile=engine.displayFile.bind(engine);
    engine.displayFile=async function(id,options={}){
      const record=engine.recordById?.(id)||null;
      if(isLinkedSource(record)){
        try{
          const local=await materialize(record,engine);
          if(local)return local;
        }catch(error){
          console.warn('URL image local display cache failed; falling back to recorded source',id,error);
          try{
            const thumb=await engine.thumbnailBlobGet?.(record.storage?.thumbnailKey||record.id);
            if(thumb)return{id:record.id,name:record.name,url:objectUrl(record.id,thumb),imageRecord:record,isThumbnail:true,fullResolutionUnavailable:true,isUrlDisplayFallback:true};
          }catch{}
        }
      }
      return originalDisplayFile(id,options);
    };

    engine.cacheLinkedSource=async id=>{
      const record=engine.recordById?.(id)||null;
      return cacheRecord(record);
    };
    engine.repairLinkedSourceAssets=async options=>repairRecords(engine.allRecords?.()||[],options);
    engine.__urlImageDisplayRepair=REPAIR_ID;

    if(!startupRepairStarted){
      startupRepairStarted=true;
      Promise.resolve(window.genreactrixImagesStartupReady).catch(()=>null).then(async()=>{
        const result=await repairRecords(engine.allRecords?.()||[],{concurrency:3});
        if(result.repaired){
          console.info(`Genreactrix URL image repair cached ${result.repaired}/${result.requested} linked image source(s).`);
          window.dispatchEvent(new CustomEvent('genreactrix:image-record'));
        }
      }).catch(error=>console.warn('Genreactrix URL image startup repair failed',error));
    }
    return true;
  }

  if(!install()){
    installTimer=window.setInterval(()=>{
      if(install())window.clearInterval(installTimer);
    },50);
    window.setTimeout(()=>{if(installTimer)window.clearInterval(installTimer);},10000);
  }

  window.addEventListener('pagehide',()=>{
    for(const url of objectUrls.values())URL.revokeObjectURL(url);
    objectUrls.clear();
  },{once:true});
})();
