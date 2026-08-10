(function(){
  const $=id=>document.getElementById(id);
  const esc=value=>String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  let selected=new Set();
  let activeSection="add";
  function engine(){ return window.genreactrixImagesEngine; }
  function all(){ try{return engine()?.allRecords?.()||[];}catch{return [];} }
  function status(text){ if($("imagesConsoleStatus")) $("imagesConsoleStatus").textContent=text||""; }
  function listFor(section){
    const records=all();
    if(section==="review") return records.filter(r=>!["recycle","purged","rejected","archived"].includes(r.workflow?.stage)&&!r.attributes?.inRecycleBin);
    if(section==="saved") return records.filter(r=>r.attributes?.saved||r.storage?.mode==="reference");
    if(section==="flagged") return records.filter(r=>r.attributes?.flagged||r.attributes?.rejectionFlagged);
    if(section==="recycle") return records.filter(r=>r.attributes?.inRecycleBin);
    if(section==="failures") return records.filter(r=>r.error||r.attributes?.failedOperation||r.attributes?.missingSource);
    if(section==="history") return records.slice().sort((a,b)=>String(b.createdAt||"").localeCompare(String(a.createdAt||"")));
    return [];
  }
  function renderList(section){
    const id={review:"imagesReviewList",saved:"imagesSavedList",flagged:"imagesFlaggedList",recycle:"imagesRecycleList",failures:"imagesFailuresList",history:"imagesHistoryList"}[section];
    if(!id||!$(id)) return;
    const records=listFor(section);
    $(id).innerHTML=records.length?records.map(r=>{
      const source=r.source?.originalName||r.source?.originalUrl||r.name||r.id;
      const state=[r.workflow?.stage,r.attributes?.saved?"Kept":"",r.attributes?.flagged?"Review Flagged":"",r.attributes?.rejectionFlagged?"Rejection Flagged":"",r.attributes?.parked?"Parked":"",r.attributes?.inRecycleBin?"Recycle":"",r.error?"Failed":""].filter(Boolean).join(" · ");
      return `<label class="images-record-row"><input type="checkbox" data-image-select="${esc(r.id)}" ${selected.has(r.id)?"checked":""}><span><strong>${esc(source)}</strong><small>${esc(r.id)} · ${esc(state||"Available")}</small></span></label>`;
    }).join(""):`<p class="images-empty">No ${esc(section)} images.</p>`;
    $(id).querySelectorAll("[data-image-select]").forEach(box=>box.addEventListener("change",()=>{box.checked?selected.add(box.dataset.imageSelect):selected.delete(box.dataset.imageSelect);}));
  }

  async function renderDashboard(){
    const d=await window.genreactrixImportEngine?.dashboard?.(); if(!d)return;
    $("importActiveCount").textContent=d.active.length; $("importFailedCount").textContent=d.failed.length; $("importPendingAiCount").textContent=d.pendingAi; $("importReadyDirectorCount").textContent=d.readyForDirector;
    $("importRecentJobs").innerHTML=d.recent.map(j=>`<article class="images-record-row"><span><strong>${esc(j.sourceLabel||j.sourceType)}</strong><small>${esc(j.status)} · ${j.imported||0} imported · ${j.failed||0} failed · ${new Date(j.createdAt).toLocaleString()}</small></span></article>`).join("")||"<p class=\"images-empty\">No import jobs.</p>";
  }

  function switchSection(section){
    activeSection=section;
    document.querySelectorAll("[data-images-panel]").forEach(p=>p.hidden=p.dataset.imagesPanel!==section);
    document.querySelectorAll("[data-images-section]").forEach(b=>b.classList.toggle("active",b.dataset.imagesSection===section));
    if(section==="dashboard") { renderDashboard(); return; }
    if(section!=="add") renderList(section);
  }
  async function preview(){
    const qty=Math.max(1,Number($("imagesConsoleQuantity")?.value)||100);
    const rows=await engine()?.prefetchUrls?.($("imagesConsoleUrls")?.value||"",{limit:qty})||[];
    $("imagesConsoleSummary").textContent=rows.length?`${rows.length} eligible source${rows.length===1?"":"s"} found.`:"No eligible URLs found.";
  }
  async function doImport(){
    const qty=Math.max(1,Number($("imagesConsoleQuantity")?.value)||100);
    const mode=$("imagesConsoleMode")?.value||"link";
    if(mode==="prefetch"){ await preview(); return; }
    const text=$("imagesConsoleUrls")?.value||"";
    const button=$("imagesConsoleImport"); button.disabled=true;
    try{
      const batchId=await window.genreactrixBatchEngine?.activeId?.()||"current-import";
      const result=await window.genreactrixImportEngine?.runUrls?.(text,{limit:qty,mode:mode==="download"?"temporary":"link",prefetch:Boolean($("imagesConsolePrefetch")?.checked),target:"active-batch"});
      const records=result?.records||[];
      if(!records.length) throw new Error("No eligible images to import.");
      if(window.genreactrixBatchEngine?.addImages) await window.genreactrixBatchEngine.addImages(batchId,records.map(r=>r.id));
      status(`${records.length} image${records.length===1?"":"s"} imported.`);
      $("imagesConsoleSummary").textContent=`Imported ${records.length}.`;
      switchSection("review");
      window.dispatchEvent(new CustomEvent("genreactrix:image-record"));
    }catch(error){status(`Import failed: ${error.message||error}`);}finally{button.disabled=false;}
  }
  async function restoreSelected(){
    const ids=[...selected]; if(!ids.length){status("Select recycle items first.");return;}
    let restored=0; for(const id of ids){try{await engine()?.restoreFromRecycle?.(id); restored++;}catch{}}
    selected.clear(); status(`${restored} restored.`); renderList("recycle"); window.dispatchEvent(new CustomEvent("genreactrix:image-record"));
  }
  async function emptyRecycle(){
    const records=listFor("recycle"); if(!records.length){status("Recycle bin is empty.");return;}
    if(!confirm(`Permanently purge ${records.length} eligible recycle item${records.length===1?"":"s"}? Records and analysis remain.`)) return;
    const result=await engine()?.purgeRecycle?.({all:true}); status(`${result?.purged||0} recycle item${result?.purged===1?"":"s"} purged.`); renderList("recycle"); window.dispatchEvent(new CustomEvent("genreactrix:image-record"));
  }
  function open(){
    const amount=window.genreactrixSettingsEngine?.getCached?.("defaults.images")||window.genreactrixSettingsEngine?.getCached?.("defaults.urls")||100;
    if($("imagesConsoleQuantity")) $("imagesConsoleQuantity").value=String(amount);
    switchSection("add"); $("imagesConsoleDialog")?.showModal();
  }
  function init(){
    $("imagesConsoleClose")?.addEventListener("click",()=>$("imagesConsoleDialog")?.close());
    document.querySelectorAll("[data-images-section]").forEach(b=>b.addEventListener("click",()=>switchSection(b.dataset.imagesSection)));
    $("imagesConsolePreview")?.addEventListener("click",()=>preview().catch(e=>status(String(e.message||e))));
    $("imagesConsoleImport")?.addEventListener("click",()=>doImport());
    $("imagesConsoleFolder")?.addEventListener("click",()=>{window.pendingPortraitImportLimit=Math.max(1,Number($("imagesConsoleQuantity")?.value)||100); window.pendingImportEngineMode=true; $("imagesConsoleDialog")?.close(); $("folderInput")?.click();});
    $("imagesRestoreSelected")?.addEventListener("click",restoreSelected);
    $("imagesEmptyRecycle")?.addEventListener("click",emptyRecycle);
  }
  window.genreactrixImagesConsole={open,render:()=>switchSection(activeSection)};
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init); else init();
})();
