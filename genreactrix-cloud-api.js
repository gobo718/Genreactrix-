/* Genreactrix Cloud API v1 — adapted from Billy Labs' proven cloud boundary. */
(()=>{'use strict';
 const BASE_KEY='genreactrix-ai-worker-base',KEY_KEY='genreactrix-ai-analysis-key';
 const normalize=v=>String(v||'').trim().replace(/\/+$/,'');
 let base=normalize(window.genreactrixSettingsEngine?.get?.('ai.worker.base','')||localStorage.getItem(BASE_KEY)||window.GENREACTRIX_AI_WORKER_BASE||'');
 const request=async(path,init={})=>{if(!base)throw new Error('AI Worker URL is not configured');const response=await fetch(`${base}${path}`,{...init,headers:{'content-type':'application/json',...(init.headers||{})}});const payload=await response.json().catch(()=>({}));if(!response.ok)throw new Error(payload.error||`AI request failed (${response.status})`);return payload;};
 window.GenreactrixCloudApi=Object.freeze({
  configure(value){base=normalize(value);window.genreactrixSettingsEngine?.set?.('ai.worker.base',base);if(base)localStorage.setItem(BASE_KEY,base);else localStorage.removeItem(BASE_KEY);window.GENREACTRIX_AI_WORKER_BASE=base;return base;},
  getBaseUrl:()=>base,isConfigured:()=>Boolean(base),getKey:()=>window.genreactrixSettingsEngine?.get?.('ai.worker.accessKey','')||localStorage.getItem(KEY_KEY)||'',setKey:value=>{const key=String(value||'');window.genreactrixSettingsEngine?.set?.('ai.worker.accessKey',key);if(key)localStorage.setItem(KEY_KEY,key);else localStorage.removeItem(KEY_KEY);return key;},
  reload(){base=normalize(window.genreactrixSettingsEngine?.get?.('ai.worker.base','')||localStorage.getItem(BASE_KEY)||window.GENREACTRIX_AI_WORKER_BASE||base||'');return base;},
  health:()=>request('/api/health',{method:'GET'}),
  analyzeImage:(specimen,key)=>request('/api/genreactrix/analyze',{method:'POST',headers:{'x-analysis-key':String(key||'')},body:JSON.stringify(specimen)})
 });
 window.addEventListener('genreactrix:settings-ready',()=>window.GenreactrixCloudApi.reload(),{once:true});
})();
