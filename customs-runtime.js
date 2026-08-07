/* Genreactrix v0.9.39.32 — independent Customs dialog runtime.
   This module intentionally has no dependency on app.js reaching its late Customs block. */
(()=>{
  'use strict';
  const $=id=>document.getElementById(id);
  const THEME_KEY='genreactrix-custom-themes-v2';
  const REACTION_KEY='genreactrix-custom-reactions-v1';
  const PRIMS=[
    ['P01','Beautiful','✨'],['P02','Adorable','🧸'],['P03','Tragic','😭'],['P04','Funny','🤣'],
    ['P05','Intense','💥'],['P06','Weird','🌀'],['P07','Ticket','🎟️'],['P08','Dreamy','🌌'],
    ['P09','Zazzly','🌶️'],['P10','Disgusting','🤢'],['P11','Scary','👻'],['P12','Smart','🧠'],['P13','Celebration','🎉'],['P14','Angry','🤬']
  ];
  let themeRefs=[];
  let editingThemeId=null;
  let editingReactionId=null;
  const read=(k)=>{try{const v=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(v)?v:[]}catch{return[]}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const slug=v=>String(v||'').trim().toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||`item-${Date.now()}`;
  const close=id=>{const d=$(id); if(!d)return; try{d.close()}catch{} d.removeAttribute('open'); d.style.removeProperty('z-index');};
  const show=id=>{const d=$(id);if(!d)return;d.hidden=false;try{if(!d.open&&d.showModal)d.showModal();else if(!d.open)d.setAttribute('open','')}catch{d.setAttribute('open','')}d.style.zIndex='2147483000';};
  const key=r=>`${r.type||'canonical'}:${r.id}`;
  function allReactions(){return PRIMS.map(([id,label,emoji])=>({type:'canonical',id,label,emoji})).concat(read(REACTION_KEY).map(r=>({type:'custom',id:r.id,label:r.label,emoji:r.emoji})));}
  function renderPreview(){
    const root=$('customThemeExpressionPreview'); if(!root)return; root.innerHTML=''; root.classList.toggle('empty',!themeRefs.length);
    themeRefs.forEach((ref,index)=>{
      const rec=allReactions().find(r=>key(r)===key(ref))||{emoji:'?',label:'Missing reaction'};
      const chip=document.createElement('button'); chip.type='button'; chip.className='custom-expression-chip'; chip.dataset.index=index;
      chip.innerHTML=`<span>${rec.emoji}</span><strong>${rec.label}</strong><i>×</i>`;
      chip.querySelector('i').addEventListener('click',e=>{e.stopPropagation();themeRefs.splice(index,1);renderPicker();});
      let timer=0,active=false,pointerId=null;
      const stop=()=>{clearTimeout(timer);if(active){chip.classList.remove('reordering');document.body.classList.remove('custom-reorder-active')}active=false; if(pointerId!==null&&chip.hasPointerCapture?.(pointerId))chip.releasePointerCapture(pointerId); pointerId=null;};
      chip.addEventListener('pointerdown',e=>{pointerId=e.pointerId;timer=setTimeout(()=>{active=true;chip.classList.add('reordering');document.body.classList.add('custom-reorder-active');chip.setPointerCapture?.(e.pointerId);navigator.vibrate?.(25)},360)});
      chip.addEventListener('pointermove',e=>{if(!active)return;e.preventDefault();const t=document.elementFromPoint(e.clientX,e.clientY)?.closest('.custom-expression-chip');if(!t||t===chip)return;const from=Number(chip.dataset.index),to=Number(t.dataset.index);if(Number.isInteger(from)&&Number.isInteger(to)){const [item]=themeRefs.splice(from,1);themeRefs.splice(to,0,item);renderPicker();}});
      chip.addEventListener('pointerup',stop);chip.addEventListener('pointercancel',stop);
      root.appendChild(chip);
    });
  }
  function validate(){
    const tl=$('customThemeLabel')?.value.trim()||'';
    const rl=$('customReactionLabel')?.value.trim()||'';
    const re=$('customReactionEmoji')?.value.trim()||'';
    if($('customThemeSaveBtn')) $('customThemeSaveBtn').disabled=!tl;
    if($('customReactionSaveBtn')) $('customReactionSaveBtn').disabled=!(rl&&re);
  }
  function renderPicker(){
    const root=$('customThemeReactionPicker'); if(!root)return; root.innerHTML='';
    allReactions().forEach(rec=>{
      const ref={type:rec.type,id:rec.id}; const selected=themeRefs.some(x=>key(x)===key(ref));
      const b=document.createElement('button');b.type='button';b.className='custom-reaction-choice'+(selected?' selected':'');
      b.innerHTML=`<span>${rec.emoji}</span><strong>${rec.label}</strong>`;
      b.addEventListener('click',()=>{const i=themeRefs.findIndex(x=>key(x)===key(ref));if(i>=0)themeRefs.splice(i,1);else themeRefs.push(ref);renderPicker();});
      root.appendChild(b);
    });
    renderPreview();validate();
  }
  function openTheme(record=null){
    editingThemeId=record?.id||null;themeRefs=Array.isArray(record?.reactionRefs)?record.reactionRefs.map(x=>({type:x.type==='custom'?'custom':'canonical',id:String(x.id)})):[];
    $('customThemeDialogTitle').textContent=record?'Edit Custom Theme':'Add Custom Theme';$('customThemeLabel').value=record?.label||'';
    if($('customThemeDeleteBtn'))$('customThemeDeleteBtn').hidden=!record;renderPicker();show('customThemeDialog');setTimeout(()=>$('customThemeLabel')?.focus(),0);
  }
  function openReaction(record=null){
    editingReactionId=record?.id||null;$('customReactionDialogTitle').textContent=record?'Edit Custom Reaction':'Add Custom Reaction';
    $('customReactionLabel').value=record?.label||'';$('customReactionEmoji').value=record?.emoji||'';if($('customReactionDeleteBtn'))$('customReactionDeleteBtn').hidden=!record;validate();show('customReactionDialog');setTimeout(()=>$('customReactionLabel')?.focus(),0);
  }
  function saveTheme(){
    const label=$('customThemeLabel').value.trim();if(!label)return;const id=editingThemeId||`custom-theme:${slug(label)}`;let rows=read(THEME_KEY).filter(x=>x.id!==editingThemeId&&x.id!==id);
    rows.push({id,label,kind:'customTheme',reactionRefs:themeRefs,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});write(THEME_KEY,rows);close('customThemeDialog');location.reload();
  }
  function saveReaction(){
    const label=$('customReactionLabel').value.trim(),emoji=$('customReactionEmoji').value.trim();if(!label||!emoji)return;const id=editingReactionId||`custom-reaction:${slug(label)}`;let rows=read(REACTION_KEY).filter(x=>x.id!==editingReactionId&&x.id!==id);
    rows.push({id,label,emoji,kind:'customReaction',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});write(REACTION_KEY,rows);close('customReactionDialog');location.reload();
  }
  function init(){
    // v0.9.39.34: when the canonical app Customs implementation loaded successfully,
    // do not intercept its buttons in capture phase. The earlier shim caused saves to
    // reload the page and prevented the app's edit/delete workflow from owning state.
    if(typeof window.openCustomThemeDialog==='function' && typeof window.openCustomReactionDialog==='function'){
      validate();
      return;
    }
    // Fallback only: own the two landscape Add buttons if the canonical app did not load.
    [['tabletAddCustomThemeBtn',()=>openTheme()],['tabletAddCustomReactionBtn',()=>openReaction()]].forEach(([id,fn])=>{
      const el=$(id);if(el)el.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();fn();},true);
    });
    window.addEventListener('genreactrix:open-custom-dialog',e=>{const id=e.detail?.dialogId;if(id==='customThemeDialog')openTheme();else if(id==='customReactionDialog')openReaction();});
    document.querySelectorAll('[data-close-custom-dialog]').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();close(btn.dataset.closeCustomDialog);},true));
    $('customThemeLabel')?.addEventListener('input',validate,true);$('customReactionLabel')?.addEventListener('input',validate,true);$('customReactionEmoji')?.addEventListener('input',validate,true);
    $('customThemeSaveBtn')?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();saveTheme();},true);
    $('customReactionSaveBtn')?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();saveReaction();},true);
    // If the original app opens either dialog, make sure the picker/validation are still present.
    $('customThemeDialog')?.addEventListener('toggle',()=>{if($('customThemeDialog').open)renderPicker();});
    validate();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
