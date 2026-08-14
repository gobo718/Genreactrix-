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
  async function completeJob(job,records,gates){const stats=gateStats(gates),status=stats.importFailures?'completed-with-failures':'completed';return window.genreactrixImportJobEngine.patch(job.id,{status,completedAt:now(),imported:records.length,failed:stats.importFailures,duplicateCount:stats.duplicates,skipped:stats.skipped,imageIds:records.map(r=>r.id),metadata:{...(job.metadata||{}),originGateIds:gates.map(g=>g.id),originGateCount:gates.length}})}
  async function runUrls(text,options={}){
    const preview=await previewUrls(text,options);if(!preview.found)throw new Error('No eligible image URLs were found.');
    const job=await window.genreactrixImportJobEngine.create({sourceType:'urls',sourceLabel:options.sourceLabel||'URL list',profileId:options.profileId||null,targetBatchId:null,mode:options.mode||'link',requested:preview.requested,metadata:{prefetch:Boolean(options.prefetch)}});
    await window.genreactrixImportJobEngine.patch(job.id,{status:'running',startedAt:now(),found:preview.found});
    try{
      const sourceText=preview.rows.map(r=>r.url).join('\n'),records=await window.genreactrixImagesEngine.importUrls(sourceText,{limit:preview.found,mode:options.mode==='temporary'?'download':'link',prefetch:Boolean(options.prefetch),importJobId:job.id}),gates=records.originGates||[];
      await completeJob(job,records,gates);const stats=gateStats(gates);
      window.genreactrixNotificationsEngine?.create?.({severity:stats.importFailures?'attention':'info',title:'Import complete',message:`${records.length} imported${gates.length?` · ${gates.length} Origin gate${gates.length===1?'':'s'}`:''}${stats.importFailures?` · ${stats.importFailures} failure${stats.importFailures===1?'':'s'}`:''}`,ownerEngine:'origin',relatedJobId:job.id,dedupeKey:`import:${job.id}:complete`,resolved:!stats.importFailures});
      window.dispatchEvent(new CustomEvent('genreactrix:import-complete',{detail:{jobId:job.id,imageIds:records.map(r=>r.id),originGateIds:gates.map(g=>g.id)}}));return{job:await window.genreactrixImportJobEngine.get(job.id),records,gates,preview};
    }catch(error){await window.genreactrixImportJobEngine.patch(job.id,{status:'failed',completedAt:now(),failed:preview.found,errors:[String(error?.message||error)]});throw error}
  }
  const IMAGE_FILE_RE=/\.(?:jpe?g|png|gif|webp|bmp|avif|heic|heif)$/i;
  function isImageFile(file){const type=String(file?.type||'').toLowerCase();return type.startsWith('image/')||IMAGE_FILE_RE.test(String(file?.name||''))}
  async function runFiles(fileList,options={}){
    const files=[...fileList].filter(isImageFile).slice(0,Math.max(1,Number(options.limit)||100));if(!files.length)throw new Error('No eligible image file was selected.');
    const detectedFolder=String(files[0]?.webkitRelativePath||'').split('/').filter(Boolean)[0]||'',single=!detectedFolder&&files.length===1,job=await window.genreactrixImportJobEngine.create({sourceType:single?'file':'folder',sourceLabel:options.sourceLabel||detectedFolder||(single?files[0].name:'Folder import'),profileId:options.profileId||null,targetBatchId:null,mode:'temporary',requested:files.length});
    await window.genreactrixImportJobEngine.patch(job.id,{status:'running',startedAt:now(),found:files.length});
    try{const records=await window.genreactrixImagesEngine.importFiles(files,{limit:files.length,importJobId:job.id}),gates=records.originGates||[];await completeJob(job,records,gates);window.dispatchEvent(new CustomEvent('genreactrix:import-complete',{detail:{jobId:job.id,imageIds:records.map(r=>r.id),originGateIds:gates.map(g=>g.id)}}));return{job:await window.genreactrixImportJobEngine.get(job.id),records,gates}}
    catch(error){await window.genreactrixImportJobEngine.patch(job.id,{status:'failed',completedAt:now(),failed:files.length,errors:[String(error?.message||error)]});throw error}
  }
  async function dashboard(){const jobs=await window.genreactrixImportJobEngine.all(),records=window.genreactrixImagesEngine?.allRecords?.()||[],output=(window.genreactrixInboxAiOutputRecords?.()||[]).length,origin=await window.genreactrixOriginGateEngine?.snapshot?.()||{};return{active:jobs.filter(j=>['running','paused'].includes(j.status)),recent:jobs.slice(0,20),failed:jobs.filter(j=>j.status==='failed'||j.status==='completed-with-failures'),pendingAi:records.filter(r=>['queued','ai-partial'].includes(r.workflow?.stage)&&!r.attributes?.failed).length,aiOutput:output,origin}}
  window.genreactrixImportEngine={allProfiles,saveProfile,previewUrls,runUrls,runFiles,dashboard,verify:()=>window.genreactrixImportJobEngine.verify()};
})();
