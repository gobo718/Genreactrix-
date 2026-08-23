/* Genreactrix Cloud API v1 — adapted from Billy Labs' proven cloud boundary. */
(()=>{'use strict';
 const BASE_KEY='genreactrix-ai-worker-base',KEY_KEY='genreactrix-ai-analysis-key',FALLBACK_UNTIL_KEY='genreactrix-ai-fallback-until-v1';
 const normalize=v=>String(v||'').trim().replace(/\/+$/,'');
 let base=normalize(window.genreactrixSettingsEngine?.get?.('ai.worker.base','')||localStorage.getItem(BASE_KEY)||window.GENREACTRIX_AI_WORKER_BASE||'');
 const currentProviderRouting=()=>{const until=Number(localStorage.getItem(FALLBACK_UNTIL_KEY)||0);if(until>Date.now())return{mode:'fallback',fallbackUntil:until,reason:'3040'};if(until)localStorage.removeItem(FALLBACK_UNTIL_KEY);return null;};
 const withProviderRouting=specimen=>{const route=currentProviderRouting();return route?{...(specimen||{}),providerRouting:route}:{...(specimen||{})};};
 const absorbProviderRouting=payload=>{const route=payload?.providerRouting||payload?.result?.provider?.routing||payload?.providerDiagnostic||null;const until=Number(route?.fallbackUntil)||0;if(until>Date.now())localStorage.setItem(FALLBACK_UNTIL_KEY,String(until));else if(route?.mode==='primary'&&localStorage.getItem(FALLBACK_UNTIL_KEY))localStorage.removeItem(FALLBACK_UNTIL_KEY);};
 const request=async(path,init={})=>{if(!base)throw new Error('AI Worker URL is not configured');const response=await fetch(`${base}${path}`,{...init,headers:{'content-type':'application/json',...(init.headers||{})}});const payload=await response.json().catch(()=>({}));absorbProviderRouting(payload);if(!response.ok){const error=new Error(payload.error||`AI request failed (${response.status})`);error.httpStatus=response.status;error.providerDiagnostic=payload.providerDiagnostic||null;error.responsePayload=payload;throw error}return payload;};
 const storedKey=()=>String(window.genreactrixSettingsEngine?.get?.('ai.worker.accessKey','')||localStorage.getItem(KEY_KEY)||'');
 const verifyConnection=async()=>{
  if(!base)throw new Error('AI Worker URL is not configured');
  const healthResponse=await fetch(`${base}/api/health`,{method:'GET',headers:{'content-type':'application/json'}}),health=await healthResponse.json().catch(()=>({}));
  if(!healthResponse.ok)throw new Error(health.error||`AI health check failed (${healthResponse.status})`);
  if((health.vision||'').toLowerCase()==='not-configured')throw new Error('Worker connected · AI binding not configured');
  const key=storedKey();if(!key)throw new Error('Worker connected · Analysis key missing');
  const authResponse=await fetch(`${base}/api/genreactrix/analyze`,{method:'POST',headers:{'content-type':'application/json','x-analysis-key':key},body:'{}'}),auth=await authResponse.json().catch(()=>({}));
  if(authResponse.status===401)throw new Error('Worker connected · Analysis key rejected');
  if(authResponse.status===503)throw new Error(auth.error||'Worker connected · analysis access not configured');
  if(authResponse.ok||/imageId and components are required/i.test(String(auth.error||''))){
    const readinessResponse=await fetch(`${base}/api/genreactrix/provider-readiness`,{method:'POST',headers:{'content-type':'application/json','x-analysis-key':key},body:'{}'}),readinessPayload=await readinessResponse.json().catch(()=>({}));
    if(!readinessResponse.ok)throw new Error(readinessPayload.error||`Worker connected · provider readiness probe failed (${readinessResponse.status})`);
    return{...health,auth:'verified',providers:readinessPayload.result||readinessPayload};
  }
  throw new Error(auth.error||`Worker connected · authentication probe failed (${authResponse.status})`);
 };
 window.GenreactrixCloudApi=Object.freeze({
  configure(value){base=normalize(value);window.genreactrixSettingsEngine?.set?.('ai.worker.base',base);if(base)localStorage.setItem(BASE_KEY,base);else localStorage.removeItem(BASE_KEY);window.GENREACTRIX_AI_WORKER_BASE=base;return base;},
  getBaseUrl:()=>base,isConfigured:()=>Boolean(base),getKey:()=>storedKey(),setKey:value=>{const key=String(value||'');window.genreactrixSettingsEngine?.set?.('ai.worker.accessKey',key);if(key)localStorage.setItem(KEY_KEY,key);else localStorage.removeItem(KEY_KEY);return key;},
  reload(){base=normalize(window.genreactrixSettingsEngine?.get?.('ai.worker.base','')||localStorage.getItem(BASE_KEY)||window.GENREACTRIX_AI_WORKER_BASE||base||'');return base;},
  health:()=>request('/api/health',{method:'GET'}),verifyConnection,
  providerReadiness:()=>request('/api/genreactrix/provider-readiness',{method:'POST',headers:{'x-analysis-key':storedKey()},body:'{}'}),
  fetchImage:async(imageUrl,key=storedKey())=>{
    if(!base)throw new Error('AI Worker URL is not configured');
    const response=await fetch(`${base}/api/genreactrix/image`,{method:'POST',headers:{'content-type':'application/json','x-analysis-key':String(key||'')},body:JSON.stringify({imageUrl:String(imageUrl||'')})});
    if(!response.ok){const payload=await response.json().catch(()=>({}));throw new Error(payload.error||`Image proxy failed (${response.status})`)}
    const blob=await response.blob();if(!blob.type?.startsWith('image/'))throw new Error('Image proxy did not return an image');return blob;
  },
  analyzeImage:(specimen,key)=>request('/api/genreactrix/analyze',{method:'POST',headers:{'x-analysis-key':String(key||'')},body:JSON.stringify(withProviderRouting(specimen))}),
  analyzeImageWithRouting:(specimen,key,providerRouting)=>request('/api/genreactrix/analyze',{method:'POST',headers:{'x-analysis-key':String(key||'')},body:JSON.stringify({...specimen,providerRouting:providerRouting||null})}),
  ama:(specimen,key)=>request('/api/genreactrix/ama',{method:'POST',headers:{'x-analysis-key':String(key||'')},body:JSON.stringify(withProviderRouting(specimen))}),
  promptDiagnostics:(specimen,key)=>request('/api/genreactrix/prompt-diagnostics',{method:'POST',headers:{'x-analysis-key':String(key||'')},body:JSON.stringify(withProviderRouting(specimen))})
 });
 window.addEventListener('genreactrix:settings-ready',()=>window.GenreactrixCloudApi.reload(),{once:true});
})();
