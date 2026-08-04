const GENREACTRIX_BUILD="v0.9.8.0";
const PRIMFUSION_LABEL_FIT = Object.freeze({ preferredPx: 9, stepPx: 0.25, allowedShrinkRatio: 0.15, individualMinimumPx: 1 });
function setDirectorStatus(message){
  const status=$("directorStatus");
  if(status) status.textContent=message;
}
console.info(`Genreactrix JavaScript loaded: ${GENREACTRIX_BUILD}`);
const PRIMITIVES = [
  {id:"P01",name:"Beautiful",symbol:"✨"},
  {id:"P02",name:"Adorable",symbol:"🧸"},
  {id:"P03",name:"Tragic",symbol:"😭"},
  {id:"P04",name:"Funny",symbol:"🤣"},
  {id:"P05",name:"Intense",symbol:"💥"},
  {id:"P06",name:"Weird",symbol:"🌀"},
  {id:"P07",name:"Hell",symbol:"🎟️"},
  {id:"P08",name:"Dreamy",symbol:"🌌"},
  {id:"P09",name:"Zazzly",symbol:"🌶️"},
  {id:"P10",name:"Disgusting",symbol:"🤢"},
  {id:"P11",name:"Eerie",symbol:"👻"},
  {id:"P12",name:"Smart",symbol:"🧠"},
  {id:"P13",name:"Celebration",symbol:"🎉"}
];
const PRIMITIVE_BY_ID = Object.fromEntries(PRIMITIVES.map(p=>[p.id,p]));
const PRIMITIVE_BY_NAME = Object.fromEntries(PRIMITIVES.map(p=>[p.name,p]));
const primitivePairId=(a,b)=>[a,b].sort().join("|");
const primFusionCellId=(a,b)=>`CELL:${primitivePairId(a,b)}`;



const CANONICAL_PRIMFUSION_LABELS = {
  "Adorable|Adorable": "Adorable",
  "Adorable|Beautiful": "Cherubic",
  "Adorable|Funny": "Goofy",
  "Adorable|Tragic": "Pitiful",
  "Adorable|Zazzly": "Kawaii",
  "Adorable|Celebration": "Heartwarming",
  "Adorable|Smart": "Precocious",
  "Adorable|Intense": "Spirited",
  "Adorable|Eerie": "Haunted",
  "Adorable|Disgusting": "Grimy",
  "Adorable|Dreamy": "Whimsical",
  "Adorable|Hell": "Camp",
  "Adorable|Weird": "Bizarre",
  "Beautiful|Beautiful": "Beautiful",
  "Beautiful|Funny": "Charming",
  "Beautiful|Tragic": "Melancholic",
  "Beautiful|Zazzly": "Horny",
  "Beautiful|Celebration": "Radiant",
  "Beautiful|Smart": "Elegant",
  "Beautiful|Intense": "Majestic",
  "Beautiful|Eerie": "Ethereal",
  "Beautiful|Disgusting": "Grotesque",
  "Beautiful|Dreamy": "Sublime",
  "Beautiful|Hell": "Irreverent",
  "Beautiful|Weird": "Surreal",
  "Funny|Funny": "Funny",
  "Funny|Tragic": "Ironic",
  "Funny|Zazzly": "Blue Humor",
  "Celebration|Funny": "Jubilant",
  "Funny|Smart": "Witty",
  "Funny|Intense": "Wild",
  "Eerie|Funny": "Macabre",
  "Disgusting|Funny": "Grossout",
  "Dreamy|Funny": "Absurd",
  "Funny|Hell": "Satirical",
  "Funny|Weird": "Bonkers",
  "Tragic|Tragic": "Tragic",
  "Tragic|Zazzly": "Impotent",
  "Celebration|Tragic": "Bittersweet",
  "Smart|Tragic": "Poignant",
  "Intense|Tragic": "Devastating",
  "Eerie|Tragic": "Lonesome",
  "Disgusting|Tragic": "Horrific",
  "Dreamy|Tragic": "Liminal",
  "Hell|Tragic": "Dark",
  "Tragic|Weird": "Nightmarish",
  "Zazzly|Zazzly": "Zazzly",
  "Celebration|Zazzly": "Hedonism",
  "Smart|Zazzly": "Kinky",
  "Intense|Zazzly": "Lust",
  "Eerie|Zazzly": "Carnal",
  "Disgusting|Zazzly": "Lewd",
  "Dreamy|Zazzly": "Limerence",
  "Hell|Zazzly": "Risqué",
  "Weird|Zazzly": "FreakyDeaky",
  "Celebration|Celebration": "Celebration",
  "Celebration|Smart": "Triumphant",
  "Celebration|Intense": "Exhilarating",
  "Celebration|Eerie": "Spiritual",
  "Celebration|Disgusting": "Indulgent",
  "Celebration|Dreamy": "Wonder",
  "Celebration|Hell": "Snarky",
  "Celebration|Weird": "Delirious",
  "Smart|Smart": "Smart",
  "Intense|Smart": "Brilliant",
  "Eerie|Smart": "Mysterious",
  "Disgusting|Smart": "Clinical",
  "Dreamy|Smart": "Visionary",
  "Hell|Smart": "Parodic",
  "Smart|Weird": "Madcap",
  "Intense|Intense": "Intense",
  "Eerie|Intense": "Foreboding",
  "Disgusting|Intense": "Brutal",
  "Dreamy|Intense": "Epic",
  "Hell|Intense": "Outrageous",
  "Intense|Weird": "Chaotic",
  "Eerie|Eerie": "Eerie",
  "Disgusting|Eerie": "Morbid",
  "Dreamy|Eerie": "Spectral",
  "Eerie|Hell": "Unhinged",
  "Eerie|Weird": "Uncanny",
  "Disgusting|Disgusting": "Disgusting",
  "Disgusting|Dreamy": "Putrid",
  "Disgusting|Hell": "Tasteless",
  "Disgusting|Weird": "Mutant",
  "Dreamy|Dreamy": "Dreamy",
  "Dreamy|Hell": "Surreal",
  "Dreamy|Weird": "Psychedelic",
  "Hell|Hell": "Ticket to Hell",
  "Hell|Weird": "Absurdist",
  "Weird|Weird": "Weird"
};

function canonicalPrimFusionLabel(firstName, secondName){
  const key=[firstName,secondName].sort().join("|");
  return CANONICAL_PRIMFUSION_LABELS[key] || (firstName===secondName ? firstName : `${firstName} + ${secondName}`);
}

const BASE_THEMES = [
  "Fantasy","Nature","Mythology","Cute","Food","Animal","Magic","Adventure",
  "Comedy","Romance","Science Fiction","Holiday","Transformation",
  "Dreamlike","Mechanical","Aquatic","Celestial","Domestic","Gothic",
  "Royalty","Sports","Music","Transportation","Weather","Horror","Mystery"
];

const DEMOS = [
  {
    src: svgData("MUTOSIS","🦄","🦥"),
    description:"A dreamy creature mashup combining a unicorn with a sloth. The composition is whimsical, gentle, and intentionally improbable.",
    aiThemes:[["Fantasy",96],["Cute",82],["Nature",59]],
    aiWeights:{P01:79,P02:72,P03:4,P04:18,P05:12,P06:42,P07:0,P08:88,P09:5,P10:0,P11:8,P12:34,P13:21}
  },
  {
    src: svgData("MUTOSIS","🐙","🫖"),
    description:"An octopus–teapot hybrid with domestic and aquatic visual cues. The humor comes from treating an object as a living creature.",
    aiThemes:[["Aquatic",93],["Comedy",77],["Domestic",65]],
    aiWeights:{P01:18,P02:12,P03:2,P04:91,P05:20,P06:85,P07:4,P08:27,P09:9,P10:5,P11:15,P12:72,P13:33}
  },
  {
    src: svgData("MUTOSIS","🐈","🌙"),
    description:"A cat merged with a crescent moon. The image reads as nocturnal fantasy with celestial and magical themes.",
    aiThemes:[["Celestial",94],["Magic",89],["Fantasy",86]],
    aiWeights:{P01:88,P02:64,P03:3,P04:9,P05:17,P06:39,P07:0,P08:92,P09:4,P10:0,P11:31,P12:44,P13:16}
  }
];

function svgData(label,a,b){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800">
  <defs><radialGradient id="g"><stop stop-color="#493761"/><stop offset="1" stop-color="#17141e"/></radialGradient></defs>
  <rect width="800" height="800" rx="64" fill="url(#g)"/>
  <text x="400" y="210" fill="#d9c3ff" font-size="48" text-anchor="middle" font-family="system-ui">${label}</text>
  <text x="315" y="500" font-size="210" text-anchor="middle">${a}</text>
  <text x="490" y="500" font-size="210" text-anchor="middle">${b}</text>
  <text x="400" y="670" fill="#f4eef8" font-size="32" text-anchor="middle" font-family="system-ui">Genreactrix demo image</text>
  </svg>`;
  return "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);
}

const state = {
  files: [],
  demoIndex: 0,
  index: 0,
  records: {},
  selectedReactions: [],
  themes: [null,null,null],
  targetSlot: 1,
  flagged: false,
  writeIn: "",
  retention: "keep",
  history: [],
  future: [],
  writeIns: ["Horror","Dreamcore"],
  objectUrls: [],
  visitBaseline: null,
  aiRuns: {}
};

const $ = id => document.getElementById(id);
const currentKey = () => state.files.length ? (state.files[state.index].id || state.files[state.index].name) : `demo-${state.demoIndex}`;
const currentDemo = () => DEMOS[state.demoIndex % DEMOS.length];

function currentSource(){
  return state.files.length ? state.files[state.index].url : currentDemo().src;
}
function currentDescription(){
  return state.files.length
    ? "AI freeform description placeholder for this locally loaded image. Structured AI data can be connected later without changing the console modules."
    : currentDemo().description;
}
function defaultAiRun(){
  if(state.files.length){
    return {
      id:`${currentKey()}-placeholder`,
      createdAt:new Date().toISOString(),
      model:"unconnected-placeholder",
      interpretationSystemVersion:"IS-1",
      weights:Object.fromEntries(PRIMITIVES.map(p=>[p.id,0])),
      themes:[],
      description:currentDescription()
    };
  }
  const demo=currentDemo();
  return {
    id:`demo-${state.demoIndex}-base`,
    createdAt:new Date().toISOString(),
    model:"demo-static",
    interpretationSystemVersion:"IS-1",
    weights:{...demo.aiWeights},
    themes:demo.aiThemes.map(([label,weight])=>({id:`theme:${label.toLowerCase()}`,label,weight})),
    description:demo.description
  };
}
function currentAiRuns(){
  const key=currentKey();
  if(!state.aiRuns[key]?.length) state.aiRuns[key]=[defaultAiRun()];
  return state.aiRuns[key];
}
function currentAiRun(){ return currentAiRuns().at(-1); }
function currentAiThemes(){ return currentAiRun().themes.map(t=>[t.label,t.weight]); }
function currentAiWeights(){ return currentAiRun().weights || {}; }

function classificationState(){
  return {
    selectedReactions:[...state.selectedReactions],
    themes:JSON.parse(JSON.stringify(state.themes)),
    flagged:!!state.flagged,
    writeIn:state.writeIn||"",
    retention:state.retention||"keep"
  };
}
function snapshot(){
  return JSON.parse(JSON.stringify({
    sourceType:state.files.length?"files":"demo",
    demoIndex:state.demoIndex,
    index:state.index,
    key:currentKey(),
    working:classificationState(),
    records:state.records,
    aiRuns:state.aiRuns
  }));
}
function snapshotsEqual(a,b){
  if(!a||!b) return false;
  return JSON.stringify(a)===JSON.stringify(b);
}
function pushHistory(){
  const next=snapshot();
  const last=state.history[state.history.length-1];
  if(snapshotsEqual(last,next)){
    updateUndoRedo();
    return false;
  }
  state.history.push(next);
  if(state.history.length>100) state.history.shift();
  state.future=[];
  updateUndoRedo();
  return true;
}
function applyClassification(data){
  state.selectedReactions=[...(data?.selectedReactions||[])];
  state.themes=normalizeThemes(data?.themes||[null,null,null]);
  state.flagged=!!data?.flagged;
  state.writeIn=data?.writeIn||"";
  state.retention=data?.retention||"keep";
}
function persistRecords(){
  try{
    const recordsJson=JSON.stringify(state.records);
    const aiRunsJson=JSON.stringify(state.aiRuns);
    localStorage.setItem("genreactrix-v0.9.2j-records",recordsJson);
    localStorage.setItem("genreactrix-v0.9.2j-ai-runs",aiRunsJson);
    // Verify the classification write immediately. A failed or blocked write must
    // not masquerade as a successful save in the UI.
    if(localStorage.getItem("genreactrix-v0.9.2j-records")!==recordsJson){
      throw new Error("Classification storage verification failed");
    }
    return true;
  }catch(error){
    console.error("Genreactrix could not persist classification data",error);
    setDirectorStatus("Save failed. Classification data was not stored.");
    return false;
  }
}
function restoreSnapshot(s){
  state.records=JSON.parse(JSON.stringify(s.records||{}));
  state.aiRuns=JSON.parse(JSON.stringify(s.aiRuns||{}));
  state.demoIndex=s.demoIndex||0;
  state.index=s.index||0;
  applyClassification(s.working||state.records[s.key]);
  persistRecords();
  syncDirectorRecordHistory("director-history-restored");
  state.visitBaseline=classificationState();
  renderAll();
}
function writeClassificationForKey(key, data){
  state.records[key]=JSON.parse(JSON.stringify(data));
  return persistRecords();
}
function readClassificationForKey(key){
  const record=state.records[key];
  return record ? JSON.parse(JSON.stringify(record)) : emptyClassification();
}
function saveCurrent(){
  const saved=writeClassificationForKey(currentKey(),classificationState());
  if(saved) syncDirectorRecordHistory("director-classified");
  return saved;
}
function syncDirectorRecordHistory(eventType="director-classified"){
  const imageId=currentKey();
  const recordEngine=window.genreactrixImageRecordEngine;
  if(!recordEngine?.get||!recordEngine.get(imageId,{touch:false})) return;
  const data={...classificationState(),aiVisible:Boolean(document.getElementById("directorAiConsole")?.open),recordedAt:new Date().toISOString()};
  try{recordEngine.update(imageId,{analysis:{director:data},components:{directorReactions:"current",directorThemes:"current",primFusion:state.selectedReactions.length>=2?"current":"missing"},attributes:{flagged:Boolean(state.flagged),needsReview:Boolean(state.flagged)},timestamps:{flaggedAt:state.flagged?new Date().toISOString():null}},eventType);}catch(error){console.warn("Director record could not be synchronized",error);}
}
function emptyClassification(){
  return {selectedReactions:[],themes:[null,null,null],flagged:false,writeIn:"",retention:"keep"};
}
function loadCurrent(){
  const key=currentKey();
  applyClassification(readClassificationForKey(key));
  state.visitBaseline=classificationState();
  // Paint the destination image's classification immediately, before any
  // nonclassification console work.
  renderThemes();
  renderReactions();
  renderAll();
}
function advanceImageIndex(){
  if(state.files.length) state.index=(state.index+1)%state.files.length;
  else state.demoIndex=(state.demoIndex+1)%DEMOS.length;
}
function commitAndAdvance(sourceKey){
  // Theme 1 is one transaction: persist the source image under the key that
  // was active when selection began, then switch identity and load a fresh
  // destination record. No working Theme state is carried across the boundary.
  const saveOk=writeClassificationForKey(sourceKey,classificationState());
  if(!saveOk) return;
  advanceImageIndex();
  const destinationKey=currentKey();
  applyClassification(readClassificationForKey(destinationKey));
  state.visitBaseline=classificationState();
  if($("themeWorkspace")?.open) $("themeWorkspace").close();
  renderAll();
}
function navigateImage(delta){
  if(state.files.length){
    state.index=(state.index+delta+state.files.length)%state.files.length;
  }else{
    state.demoIndex=(state.demoIndex+delta+DEMOS.length)%DEMOS.length;
  }
  loadCurrent();
}
function nextImage(){ navigateImage(1); }
function prevImage(){ navigateImage(-1); }
function normalizeTheme(value){
  if(!value) return null;
  if(typeof value==="object" && value.id) return value;
  return {id:`legacy:${String(value).toLowerCase()}`,label:String(value),kind:"legacy"};
}
function normalizeThemes(values){ return [0,1,2].map(i=>normalizeTheme(values?.[i])); }
function themeLabel(theme){ return normalizeTheme(theme)?.label || "—"; }
function renderReactions(){
  const bar=$("reactionBar");
  const expanded=$("directorReactionGrid");
  bar.innerHTML="";
  expanded.innerHTML="";
  PRIMITIVES.forEach((p,i)=>{
    const make=()=>{
      const b=document.createElement("button");
      b.className="reaction-button"+(state.selectedReactions.includes(i)?" selected":"");
      b.innerHTML=`<span class="reaction-symbol" aria-hidden="true">${p.symbol}</span>`;
      b.setAttribute("aria-label",p.name);
      b.title=p.name;
      b.setAttribute("aria-pressed",state.selectedReactions.includes(i));
      b.addEventListener("click",()=>{
        pushHistory();
        const n=state.selectedReactions.indexOf(i);
        if(n>=0) state.selectedReactions.splice(n,1); else state.selectedReactions.push(i);
        saveCurrent(); renderReactions(); renderComparison();
      });
      return b;
    };
    bar.appendChild(make());
    expanded.appendChild(make());
  });
}
function renderThemes(){
  for(let i=0;i<3;i++){
    const value=themeLabel(state.themes[i]);
    $(`themeValue${i+1}`).textContent=value;
    $(`expandedTheme${i+1}`).textContent=value;
    const summary=$(`themeSummary${i+1}`);
    if(summary) summary.textContent=value;
  }
}
function renderImage(){
  const src=currentSource();
  $("mainImage").src=src;
  $("mainImage").hidden=false;
  if(typeof resetImageTransform==="function") resetImageTransform();
  $("imageEmpty").hidden=true;
  $("inspectionImage").src=src;
  if($("aiWorkspaceImage")) $("aiWorkspaceImage").src=src;
  if($("aiWorkspacePortraitImage")) $("aiWorkspacePortraitImage").src=src;
  if($("directorThumbnail")) $("directorThumbnail").src=src;
  if($("directorPortraitThumbnail")) $("directorPortraitThumbnail").src=src;
  const description=currentAiRun().description || currentDescription();
  $("aiDescription").textContent=description;
  $("inspectionDescription").textContent=description;
  const total=state.files.length || DEMOS.length;
  const position=state.files.length ? state.index+1 : state.demoIndex+1;
  $("profileName").textContent=state.files.length ? state.files[state.index].name : `Demo image ${position}`;
  $("profilePosition").textContent=`${position} / ${total}`;
  $("profileRetention").textContent=state.retention;
  $("profileFlagged").textContent=state.flagged ? "Yes" : "No";
  if($("aiWorkspaceDescription")) $("aiWorkspaceDescription").textContent=description;
  if($("tabletAiDescription")) $("tabletAiDescription").textContent=description;
  $("progressText").textContent=`${state.files.length?"Image":"Demo image"} ${position} / ${total}`;
}
function renderFlag(){
  $("directorFlagBtn").setAttribute("aria-pressed",state.flagged);
}
function renderDirectorFields(){
  $("directorWriteIn").value=state.writeIn;
  $("retentionControl").value=state.retention;
}
function renderPrimitiveWeights(target, {showDirector=false}={}){
  if(!target) return;
  target.innerHTML="";
  target.className="primitive-weight-grid" + (target.id==="homeAiPrimitives" ? " compact" : "");
  const weights=currentAiWeights();
  PRIMITIVES.forEach((p,index)=>{
    const item=document.createElement("div");
    item.className="primitive-weight-item"+(showDirector && state.selectedReactions.includes(index)?" director-selected":"");
    item.innerHTML=`<span class="primitive-weight-symbol" title="${p.name}">${p.symbol}</span><small>${weights[p.id]>0?`${Math.round(weights[p.id])}%`:"-%"}</small>`;
    target.appendChild(item);
  });
}
function isFoldedLandscapeHome(){
  return window.innerWidth>window.innerHeight && window.innerHeight<600;
}

function fitFoldedLandscapeDescription(){
  const panel=document.querySelector(".image-console .ai-description");
  const text=$("aiDescription");
  if(!panel || !text){return;}

  panel.style.removeProperty("--folded-ai-description-size");
  text.style.fontSize="";
  if(!isFoldedLandscapeHome()) return;

  const preferredPx=11.52; // .72rem at the default 16px root size
  const minimumPx=8.8;
  const stepPx=.2;
  let size=preferredPx;
  text.style.fontSize=`${size}px`;

  // Prefer the largest readable size that fits before relying on vertical scrolling.
  while(size>minimumPx && panel.scrollHeight>panel.clientHeight+1){
    size=Math.max(minimumPx,+(size-stepPx).toFixed(2));
    text.style.fontSize=`${size}px`;
  }
  panel.dataset.descriptionFitPx=String(size);
  panel.dataset.descriptionScrolls=String(panel.scrollHeight>panel.clientHeight+1);
}

function scheduleFoldedLandscapeDescriptionFit(){
  requestAnimationFrame(()=>requestAnimationFrame(fitFoldedLandscapeDescription));
}


function fitAdaptiveWorkspaceDescription(panelSelector, preferredPx=18, minimumPx=11){
  const panel=document.querySelector(panelSelector);
  const text=panel?.querySelector("p");
  if(!panel || !text) return;
  text.style.fontSize="";
  text.style.overflowY="hidden";
  let size=preferredPx;
  text.style.fontSize=`${size}px`;
  const fits=()=>text.scrollHeight<=text.clientHeight+1;
  while(size>minimumPx && !fits()){
    size=Math.max(minimumPx,+(size-.25).toFixed(2));
    text.style.fontSize=`${size}px`;
  }
  text.style.overflowY=fits()?"hidden":"auto";
  panel.dataset.descriptionFitPx=String(size);
  panel.dataset.descriptionScrolls=String(!fits());
}

function scheduleWorkspaceDescriptionFits(){
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    if(document.getElementById("aiWorkspace")?.open)
      fitAdaptiveWorkspaceDescription("#aiWorkspace .ai-freeform-panel",18,11);
    if(document.getElementById("imageWorkspace")?.open)
      fitAdaptiveWorkspaceDescription("#imageWorkspace .inspection-ai-description",18,11);
  }));
}

function renderAi(){
  renderPrimitiveWeights($("homeAiPrimitives"));
  renderPrimitiveWeights($("aiPrimitives"));
  renderPrimitiveWeights($("tabletAiPrimitives"));
  const themeTargets=[$("aiThemes"),$("tabletAiThemes")];
  themeTargets.forEach(themes=>{
    if(!themes) return;
    themes.innerHTML="";
    currentAiThemes().forEach(([label,weight])=>themes.appendChild(aiThemeSuggestion(label,weight)));
  });
}
function aiThemeSuggestion(label,weight){
  const b=document.createElement("button");
  b.className="ai-suggestion";
  b.innerHTML=`<span>${label}</span><strong>${weight}%</strong>`;
  b.addEventListener("click",()=>selectTheme({id:`theme:${label.toLowerCase()}`,label,kind:"established"}));
  return b;
}
function renderComparison(){
  const directorThemes=state.themes.filter(Boolean).map(themeLabel);
  const aiThemes=currentAiThemes();
  $("inspectionDirectorThemes").textContent=directorThemes.length?directorThemes.join(", "):"—";
  $("inspectionAiThemes").textContent=aiThemes.length?aiThemes.map(([label,weight])=>`${label} ${weight}%`).join(", "):"—";
  $("profileRetention").textContent=state.retention;
  $("profileFlagged").textContent=state.flagged?"Yes":"No";
}


let tabletAiVisible=false;
function renderTabletWorkbench(){
  const root=$("tabletWorkbench");
  if(!root) return;
  $("tabletWorkbenchImage").src=currentSource();
  const prims=$("tabletWorkbenchPrims");
  prims.innerHTML="";
  const weights=currentAiWeights();
  PRIMITIVES.forEach((p,i)=>{
    const b=document.createElement("button");
    b.type="button";
    b.className="tablet-prim-button"+(state.selectedReactions.includes(i)?" selected":"");
    b.title=p.name;
    b.innerHTML=`<span class="symbol">${p.symbol}</span><span class="pct">${weights[p.id]??0}%</span>`;
    b.addEventListener("click",()=>{pushHistory();const n=state.selectedReactions.indexOf(i);if(n>=0)state.selectedReactions.splice(n,1);else state.selectedReactions.push(i);saveCurrent();renderAll();});
    prims.appendChild(b);
  });
  for(let i=0;i<3;i++) $("tabletWorkbenchTheme"+(i+1)).textContent=themeLabel(state.themes[i]);
  currentAiThemes().slice(0,3).forEach(([label,weight],i)=>$("tabletWorkbenchAiTheme"+(i+1)).textContent=tabletAiVisible?`${label} ${weight}%`:"—");
  $("tabletWorkbenchAiDescription").textContent=tabletAiVisible?(currentAiRun().description||currentDescription()):"";
  root.classList.toggle("ai-visible",tabletAiVisible);
  $("tabletShowAiBtn").setAttribute("aria-pressed",String(tabletAiVisible));
  $("tabletShowAiBtn").textContent=tabletAiVisible?"HIDE AI":"SHOW AI";
  renderPrimFusionMatrix("","tabletWorkbenchMatrix");
}


function portraitRecordValues(){
  return Object.values(state.records || {});
}
function renderPortraitControlStation(){
  const station=$("portraitControlStation");
  if(!station) return;
  const total=state.files.length;
  const position=total?Math.min(state.index+1,total):0;
  const records=portraitRecordValues();
  const flagged=records.filter(record=>record?.flagged).length + (state.flagged && !state.records[currentKey()] ? 1 : 0);
  const saved=records.filter(record=>record?.saved).length;
  const analyzed=state.files.filter(file=>Boolean(state.aiRuns?.[file.id || file.name]?.length)).length;
  const aiQueue=window.genreactrixAiQueueEngine?.snapshot?.() || {pending:0,available:Math.max(0,total-analyzed),bufferTarget:25};
  $("portraitQueuedCount").textContent=String(aiQueue.pending);
  $("portraitAvailableCount").textContent=String(aiQueue.available);
  $("portraitReadyBatchCount").textContent=String(records.length);
  $("portraitSavedTotal").textContent=String(saved);
  $("portraitFlaggedTotal").textContent=String(flagged);
  $("portraitSavedCurrent").textContent=String(saved);
  $("portraitFlaggedCurrent").textContent=String(flagged);
  $("portraitAiReadyCount").textContent=String(analyzed);
  if($("portraitAiPendingCount")) $("portraitAiPendingCount").textContent=String(aiQueue.pending);
  if($("portraitAiBufferTarget")) $("portraitAiBufferTarget").textContent=String(aiQueue.bufferTarget);
  const imageEngine=window.genreactrixImagesEngine?.snapshot?.() || {temporary:0,linked:0,saved:0,flagged:0};
  if($("portraitTempImageCount")) $("portraitTempImageCount").textContent=String(imageEngine.temporary);
  if($("portraitLinkedImageCount")) $("portraitLinkedImageCount").textContent=String(imageEngine.linked);
  if($("portraitReferenceImageCount")) $("portraitReferenceImageCount").textContent=String(imageEngine.saved);
  if($("portraitEngineFlaggedCount")) $("portraitEngineFlaggedCount").textContent=String(imageEngine.flagged);
}
function setPortraitStationStatus(message){
  const status=$("portraitStationStatus");
  if(status) status.textContent=message;
}

function renderAll(){
  // Classification fields render first so image/profile rendering can never leave
  // Theme 1/2/3 showing the previous image if a later render stage fails.
  renderThemes();
  renderReactions();
  renderFlag();
  renderDirectorFields();
  renderImage();
  renderAi();
  scheduleFoldedLandscapeDescriptionFit();
  scheduleWorkspaceDescriptionFits();
  renderComparison();
  updateUndoRedo();
  renderTabletTargetSlots();
  renderPrimFusionMatrix($("tabletThemeSearch")?.value || "", "tabletPrimFusionMatrix");
  renderTabletWorkbench();
  renderPortraitControlStation();
}

function openThemeWorkspace(slot=1){
  state.targetSlot=Number(slot);
  const primFusionPanel=$("landscapePrimFusionPanel");
  if(primFusionPanel && window.innerWidth>window.innerHeight){
    primFusionPanel.classList.add("primfusion-collapsed");
    $("landscapePrimFusionToggle")?.setAttribute("aria-expanded","false");
    if($("landscapePrimFusionToggle")) $("landscapePrimFusionToggle").textContent="Expand PrimFusion Matrix";
    document.querySelector("#themeWorkspace .workspace-shell")?.classList.remove("primfusion-expanded");
  }
  renderTargetSlot(true);
  $("themeSearch").value="";
  renderPrimFusionMatrix("");
  renderWriteIns();
  $("themeError").textContent="";
  $("themeWorkspace").showModal();
}
function renderTargetSlot(blink=false){
  document.querySelectorAll(".slot-button[data-target-slot]").forEach(b=>{
    const active=Number(b.dataset.targetSlot)===state.targetSlot;
    b.classList.toggle("active",active);
    b.classList.remove("commit-alert");
  });
  renderTabletTargetSlots();
  if(blink && state.targetSlot===1){
    requestAnimationFrame(()=>document.querySelector('.slot-button[data-target-slot="1"]').classList.add("commit-alert"));
  }
}
function renderPrimFusionMatrix(filter, targetId="primFusionMatrix"){
  const primFusion=$(targetId);
  if(!primFusion) return;
  primFusion.innerHTML="";

  const q=(filter||"").trim().toLowerCase();
  const landscapeSingleGrid=targetId==="primFusionMatrix" && window.innerWidth > window.innerHeight;
  const singleGrid=targetId==="tabletPrimFusionMatrix" || targetId==="tabletWorkbenchMatrix" || landscapeSingleGrid;
  const bands=singleGrid
    ? [PRIMITIVES.map((_,index)=>index)]
    : [[0,1,2,3],[4,5,6,7,8],[9,10,11,12]];

  bands.forEach((columnIndexes,bandIndex)=>{
    const section=document.createElement("section");
    section.className="true-primfusion-band";
    if(singleGrid) section.classList.add("single-primfusion-primFusion");

    if(!singleGrid){
      const title=document.createElement("div");
      title.className="primfusion-band-title";
      title.textContent=`PrimFusion Matrix ${bandIndex+1} of ${bands.length}`;
      section.appendChild(title);
    }

    const scroller=document.createElement("div");
    scroller.className="primfusion-scroller";

    const grid=document.createElement("div");
    grid.className="true-primfusion-grid";
    grid.style.setProperty("--band-columns", columnIndexes.length);

    const corner=document.createElement("div");
    corner.className="primfusion-corner";
    corner.textContent="×";
    grid.appendChild(corner);

    columnIndexes.forEach(ci=>{
      const col=PRIMITIVES[ci];
      const head=document.createElement("button");
      head.className="primfusion-axis-header primfusion-column-header";
      head.type="button";
      head.innerHTML=`<span>${col.symbol}</span><small>${col.name}</small>`;
      head.title=`Select ${col.name}`;
      head.addEventListener("click",()=>selectTheme({id:`primitive:${col.id}`,label:col.name,kind:"primitive",primitiveId:col.id}));
      grid.appendChild(head);
    });

    PRIMITIVES.forEach((row,ri)=>{
      const rowHead=document.createElement("button");
      rowHead.className="primfusion-axis-header primfusion-row-header";
      rowHead.type="button";
      rowHead.innerHTML=`<span>${row.symbol}</span><small>${row.name}</small>`;
      rowHead.title=`Select ${row.name}`;
      rowHead.addEventListener("click",()=>selectTheme({id:`primitive:${row.id}`,label:row.name,kind:"primitive",primitiveId:row.id}));
      grid.appendChild(rowHead);

      columnIndexes.forEach(ci=>{
        const col=PRIMITIVES[ci];
        const combo = canonicalPrimFusionLabel(row.name,col.name);
        const cell=document.createElement("button");
        cell.type="button";
        cell.className="primfusion-intersection";
        cell.innerHTML=ri===ci
          ? `<span class="primfusion-combo-symbol">${row.symbol}</span><small class="primfusion-combo-label">${row.name}</small>`
          : `<span class="primfusion-combo-symbol">${row.symbol}${col.symbol}</span><small class="primfusion-combo-label">${combo}</small>`;
        cell.title=combo;
        const visible=!q || combo.toLowerCase().includes(q);
        cell.hidden=!visible;
        cell.addEventListener("click",()=>selectTheme({id:primFusionCellId(row.id,col.id),label:combo,kind:"primFusion",primitiveIds:[row.id,col.id].sort()}));
        grid.appendChild(cell);
      });
    });

    scroller.appendChild(grid);
    section.appendChild(scroller);
    primFusion.appendChild(section);
  });

  const directMatches=[...BASE_THEMES,...state.writeIns]
    .filter(t=>!q || t.toLowerCase().includes(q))
    .slice(0,20);

  if(directMatches.length){
    const quick=document.createElement("section");
    quick.className="quick-theme-results";
    const heading=document.createElement("div");
    heading.className="primfusion-band-title";
    heading.textContent=q ? "Matching established Themes" : "Established Themes";
    quick.appendChild(heading);
    const wrap=document.createElement("div");
    wrap.className="quick-theme-buttons";
    directMatches.forEach(t=>{
      const b=document.createElement("button");
      b.type="button";
      b.textContent=t;
      b.addEventListener("click",()=>selectTheme({id:`theme:${t.toLowerCase()}`,label:t,kind:"established"}));
      wrap.appendChild(b);
    });
    quick.appendChild(wrap);
    primFusion.prepend(quick);
  }

  requestAnimationFrame(()=>requestAnimationFrame(()=>schedulePrimFusionFit(primFusion,0)));
}
function renderWriteIns(){
  const list=$("writeinList"); list.innerHTML="";
  state.writeIns.forEach(t=>{
    const b=document.createElement("button"); b.textContent=t;
    b.addEventListener("click",()=>selectTheme({id:`writein:${t.toLowerCase()}`,label:t,kind:"writein"})); list.appendChild(b);
  });
}
function selectTheme(themeInput){
  const sourceKey=currentKey();
  const sourceSlot=state.targetSlot;
  const theme=normalizeTheme(themeInput);
  const target=sourceSlot-1;
  const duplicate=state.themes.some((t,i)=>i!==target && normalizeTheme(t)?.id===theme.id);
  if(duplicate){
    const message=`“${theme.label}” is already selected in another Theme field. Choose a different Theme or clear the duplicate first.`;
    $("themeError").textContent=message;
    $("tabletThemeError").textContent=message;
    return;
  }
  pushHistory();
  state.themes[target]=theme;
  if(sourceSlot===1){
    commitAndAdvance(sourceKey);
    return;
  }
  const saveOk=writeClassificationForKey(sourceKey,classificationState());
  if(!saveOk) return;
  renderThemes();
  renderComparison();
}

function primFusionAutoFitEntries(root=document){
  return [...root.querySelectorAll(".primfusion-axis-header, .primfusion-intersection")]
    .filter(square=>{
      if(square.hidden) return false;
      const style=getComputedStyle(square);
      return style.display!=="none" && style.visibility!=="hidden";
    })
    .map(square=>{
      const label=square.matches(".primfusion-axis-header")
        ? square.querySelector("small")
        : square.querySelector(".primfusion-combo-label");
      return label ? {square,label} : null;
    })
    .filter(Boolean);
}

function cancelScheduledPrimFusionFit(root){
  // v0.9.3.18: fitting is intentionally disabled. PrimFusion labels use one
  // fixed, conservative size so the matrix is immediately usable.
}

function schedulePrimFusionFit(root,delay=0){
  if(!root) return;
  requestAnimationFrame(()=>autoFitPrimFusionLabels(root));
}

function autoFitPrimFusionLabels(root=document){
  if(!root || !root.isConnected) return;

  const panel=root.closest('.landscape-primfusion-panel');
  const rect=root.getBoundingClientRect();
  if((panel && panel.classList.contains('primfusion-collapsed')) ||
     root.hidden || getComputedStyle(root).display==='none' ||
     rect.width<=1 || rect.height<=1){
    return;
  }

  const labels=root.querySelectorAll(
    '.primfusion-axis-header small, .primfusion-intersection .primfusion-combo-label'
  );
  labels.forEach(label=>{
    label.style.fontSize='5.0625px';
    label.classList.remove('autofit-shrunk','autofit-tier-75','autofit-tier-50');
    label.removeAttribute('title');
    label.dataset.autofitSize='5.0625px';
  });

  root.classList.remove('primfusion-fitting');
  root.classList.add('primfusion-fitted');
  root.dataset.autofitVisibleCount=String(labels.length);
  root.dataset.autofitSharedPx='5.0625';
  root.dataset.autofitTier75Count='0';
  root.dataset.autofitTier50Count='0';
}

function renderTabletTargetSlots(){
  document.querySelectorAll("[data-tablet-target-slot]").forEach(button=>{
    button.classList.toggle("active", Number(button.dataset.tabletTargetSlot)===state.targetSlot);
  });
}

function updateTabletSearch(){
  const q=$("tabletThemeSearch").value.trim();
  renderPrimFusionMatrix(q,"tabletPrimFusionMatrix");
  const existing=[...BASE_THEMES,...state.writeIns].find(t=>t.toLowerCase()===q.toLowerCase());
  const create=$("tabletCreateThemeBtn");
  if(q && !existing){
    create.hidden=false;
    create.textContent=`Create new Theme: “${q}”`;
  }else{
    create.hidden=true;
    create.textContent="";
  }
}

function createTabletTheme(){
  const q=$("tabletThemeSearch").value.trim();
  if(!q) return;
  if(![...BASE_THEMES,...state.writeIns].some(t=>t.toLowerCase()===q.toLowerCase())){
    state.writeIns.push(q);
    localStorage.setItem("genreactrix-v0.9.1-writeins",JSON.stringify(state.writeIns));
  }
  $("tabletCreateThemeBtn").hidden=true;
  renderPrimFusionMatrix(q,"tabletPrimFusionMatrix");
  $("tabletThemeError").textContent=`Created “${q}”. Select it normally for Theme ${state.targetSlot}.`;
}

function updateSearch(){
  const q=$("themeSearch").value.trim();
  renderPrimFusionMatrix(q);
  const existing=[...BASE_THEMES,...state.writeIns].find(t=>t.toLowerCase()===q.toLowerCase());
  const create=$("createThemeBtn");
  if(q && !existing){
    create.hidden=false;
    create.textContent=`Create new Theme: “${q}”`;
  }else{
    create.hidden=true;
    create.textContent="";
  }
}
function createTheme(){
  const q=$("themeSearch").value.trim();
  if(!q) return;
  if(![...BASE_THEMES,...state.writeIns].some(t=>t.toLowerCase()===q.toLowerCase())){
    state.writeIns.push(q);
    localStorage.setItem("genreactrix-v0.9.1-writeins",JSON.stringify(state.writeIns));
    renderWriteIns();
    $("themeError").textContent=`Created “${q}”. Select it normally for Theme ${state.targetSlot}.`;
  }
  $("createThemeBtn").hidden=true;
}

function undo(){
  const current=snapshot();
  let target=null;
  while(state.history.length){
    const candidate=state.history.pop();
    if(!snapshotsEqual(current,candidate)){
      target=candidate;
      break;
    }
  }
  if(!target){
    updateUndoRedo();
    return false;
  }
  if(!snapshotsEqual(state.future[state.future.length-1],current)) state.future.push(current);
  restoreSnapshot(target);
  updateUndoRedo();
  return true;
}
function redo(){
  const current=snapshot();
  let target=null;
  while(state.future.length){
    const candidate=state.future.pop();
    if(!snapshotsEqual(current,candidate)){
      target=candidate;
      break;
    }
  }
  if(!target){
    updateUndoRedo();
    return false;
  }
  if(!snapshotsEqual(state.history[state.history.length-1],current)) state.history.push(current);
  restoreSnapshot(target);
  updateUndoRedo();
  return true;
}
function updateUndoRedo(){
  $("undoBtn").disabled=!state.history.length;
  $("redoBtn").disabled=!state.future.length;
  if($("tabletUndoBtn")) $("tabletUndoBtn").disabled=!state.history.length;
  if($("tabletRedoBtn")) $("tabletRedoBtn").disabled=!state.future.length;
  if($("directorUndoBtn")) $("directorUndoBtn").disabled=!state.history.length;
  if($("directorRedoBtn")) $("directorRedoBtn").disabled=!state.future.length;
}

const landscapePrimFusionToggle=$("landscapePrimFusionToggle");
if(landscapePrimFusionToggle){
  landscapePrimFusionToggle.addEventListener("click",()=>{
    const panel=$("landscapePrimFusionPanel");
    const collapsed=panel.classList.toggle("primfusion-collapsed");
    landscapePrimFusionToggle.setAttribute("aria-expanded",String(!collapsed));
    landscapePrimFusionToggle.textContent=collapsed?"Expand PrimFusion Matrix":"Collapse PrimFusion Matrix";
    document.querySelector("#themeWorkspace .workspace-shell")?.classList.toggle("primfusion-expanded",!collapsed);
    if(!collapsed){
      renderPrimFusionMatrix($("themeSearch")?.value || "", "primFusionMatrix");
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        $("primFusionMatrix")?.scrollIntoView({block:"start",behavior:"smooth"});
      }));
    }else{
      document.querySelector("#themeWorkspace .workspace-shell")?.scrollTo({top:0,behavior:"instant"});
    }
  });
}


function isTabletWorkspace(){
  return window.innerWidth>=600 && window.innerWidth<=1199 && window.innerHeight>=500;
}

document.addEventListener("click",e=>{
  const opener=e.target.closest("[data-open]");
  if(opener && !isTabletWorkspace()){ $(opener.dataset.open).showModal(); scheduleWorkspaceDescriptionFits(); }
  const closer=e.target.closest("[data-close]");
  if(closer) $(closer.dataset.close).close();
  const themeField=e.target.closest(".theme-field");
  if(themeField){
    if(isTabletWorkspace()){
      state.targetSlot=Number(themeField.dataset.slot);
      renderTabletTargetSlots();
      document.getElementById("tabletPrimFusionMatrix")?.scrollIntoView({block:"start",behavior:"smooth"});
    }else{
      openThemeWorkspace(themeField.dataset.slot);
    }
  }
});

$("openAiBtn").addEventListener("click",()=>{ if(!isTabletWorkspace()){ $("aiWorkspace").showModal(); scheduleWorkspaceDescriptionFits(); } });
$("directorPrimFusionBtn").addEventListener("click",()=>{
  if($("directorWorkspace").open) $("directorWorkspace").close();
  openThemeWorkspace(state.targetSlot || 1);
});
$("prevBtn").addEventListener("click",prevImage);
$("nextBtn").addEventListener("click",nextImage);
$("undoBtn").addEventListener("click",undo);
$("redoBtn").addEventListener("click",redo);
$("tabletPrevBtn")?.addEventListener("click",prevImage);
$("tabletNextBtn")?.addEventListener("click",nextImage);
$("tabletUndoBtn")?.addEventListener("click",undo);
$("tabletRedoBtn")?.addEventListener("click",redo);
$("directorFlagBtn").addEventListener("click",()=>{
  pushHistory(); state.flagged=!state.flagged; saveCurrent();
  if(state.files.length) window.genreactrixImagesEngine?.setFlagged?.(currentKey(),state.flagged);
  renderFlag(); renderComparison(); renderPortraitControlStation();
});
$("directorNextBtn").addEventListener("click",nextImage);
$("directorWriteIn").addEventListener("change",e=>{
  pushHistory(); state.writeIn=e.target.value.trim(); saveCurrent(); renderComparison();
});
$("retentionControl").addEventListener("change",e=>{
  pushHistory(); state.retention=e.target.value; saveCurrent(); renderComparison();
});
document.querySelectorAll(".slot-button").forEach(b=>b.addEventListener("click",()=>{
  const slot=Number(b.dataset.targetSlot);
  state.targetSlot=(state.targetSlot===slot && slot!==1)?1:slot;
  renderTargetSlot(state.targetSlot===1);
}));
$("themeSearch").addEventListener("input",updateSearch);
$("themeSearch").addEventListener("keydown",e=>{
  if(e.key!=="Enter") return;
  e.preventDefault();
  const q=e.currentTarget.value.trim();
  const existing=[...BASE_THEMES,...state.writeIns].find(t=>t.toLowerCase().startsWith(q.toLowerCase()));
  if(existing) selectTheme(existing);
  else createTheme();
});
$("createThemeBtn").addEventListener("click",createTheme);
document.querySelectorAll("[data-tablet-target-slot]").forEach(button=>button.addEventListener("click",()=>{
  state.targetSlot=Number(button.dataset.tabletTargetSlot);
  renderTargetSlot(state.targetSlot===1);
}));
$("tabletThemeSearch").addEventListener("input",updateTabletSearch);
$("tabletThemeSearch").addEventListener("keydown",e=>{
  if(e.key!=="Enter") return;
  e.preventDefault();
  const q=e.currentTarget.value.trim();
  const existing=[...BASE_THEMES,...state.writeIns].find(t=>t.toLowerCase().startsWith(q.toLowerCase()));
  if(existing) selectTheme(existing); else createTabletTheme();
});
$("tabletCreateThemeBtn").addEventListener("click",createTabletTheme);
$("resetOriginalBtn").addEventListener("click",()=>{
  if(!confirm("Discard all classification changes made since you entered this image?")) return;
  pushHistory();
  const keepFlag=state.flagged;
  const keepRetention=state.retention;
  applyClassification(state.visitBaseline||{});
  state.flagged=keepFlag;
  state.retention=keepRetention;
  saveCurrent(); renderAll();
});
$("clearCurrentBtn").addEventListener("click",()=>{
  if(!confirm("Clear all classification data for this image? AI analysis and the flag will be kept.")) return;
  if(!confirm("This will blank reactions, Theme 1/2/3, and classification write-in data. Continue?")) return;
  pushHistory();
  state.selectedReactions=[];
  state.themes=[null,null,null];
  state.writeIn="";
  saveCurrent(); renderAll();
});
$("directorUndoBtn").addEventListener("click",undo);
$("directorRedoBtn").addEventListener("click",redo);
$("rerunAiBtn").addEventListener("click",()=>{
  if(!confirm("Rerun AI analysis for this image? The existing AI run will be kept in history.")) return;
  const previous=currentAiRun();
  const next={...JSON.parse(JSON.stringify(previous)),id:`${currentKey()}-${Date.now()}`,createdAt:new Date().toISOString(),model:"demo-static-rerun"};
  state.aiRuns[currentKey()].push(next);
  persistRecords();
  const recordEngine=window.genreactrixImageRecordEngine;
  if(recordEngine?.get?.(currentKey(),{touch:false})) recordEngine.update(currentKey(),{analysis:{ai:next},components:{aiReactions:"current",aiThemes:"current",aiDescription:"current"}},"ai-reanalyzed");
  renderAll();
});

async function applyEngineWorkingFiles(files){
  state.objectUrls.forEach(URL.revokeObjectURL);
  state.objectUrls=[];
  state.files=[...files];
  for(let i=state.files.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[state.files[i],state.files[j]]=[state.files[j],state.files[i]];}
  state.index=0;
  loadCurrent();
  window.genreactrixAiQueueEngine?.maintainBuffer?.();
  renderPortraitControlStation();
}
async function loadImageFolder(fileList,limit=null){
  const batchId=await window.genreactrixBatchEngine?.activeId?.()||"current-import";
  const records=await window.genreactrixImagesEngine.importFiles(fileList,{limit,batchId});
  if(window.genreactrixBatchEngine?.addImages) await window.genreactrixBatchEngine.addImages(batchId,records.map(r=>r.id));
  const files=await window.genreactrixImagesEngine.workingFiles(records.map(record=>record.id));
  await applyEngineWorkingFiles(files);
  setPortraitStationStatus(`${records.length} image${records.length===1?"":"s"} copied into Temporary Import.`);
}
let pendingPortraitImportLimit=null;
$("folderInput").addEventListener("change",async e=>{
  try{ await loadImageFolder(e.target.files,pendingPortraitImportLimit); }
  catch(error){ setPortraitStationStatus(`Import failed: ${error.message||error}`); }
  pendingPortraitImportLimit=null;
  e.target.value="";
});
$("tabletFolderInput")?.addEventListener("change",e=>loadImageFolder(e.target.files));




const LAYOUT_KEY="genreactrix-v0.9.1-layout";
const layoutState={imageFraction:1,directorFraction:1.18,aiFraction:.82,locked:false,imageCollapsed:false};
function applyLayout(){
  document.documentElement.style.setProperty("--image-console-fr",`${layoutState.imageFraction}fr`);
  document.documentElement.style.setProperty("--director-console-fr",`${layoutState.directorFraction}fr`);
  document.documentElement.style.setProperty("--ai-console-fr",`${layoutState.aiFraction}fr`);
  $("app").querySelector(".base-layout").classList.toggle("divider-locked",layoutState.locked);
  document.querySelector(".image-console").classList.toggle("supporting-collapsed",layoutState.imageCollapsed);
  $("lockDividerBtn").setAttribute("aria-pressed",layoutState.locked);
  $("lockDividerBtn").textContent=layoutState.locked?"🔒 Layout":"🔓 Layout";
  $("resetViewBtn").disabled=layoutState.locked;
  $("resetViewBtn").setAttribute("aria-disabled",String(layoutState.locked));
  $("collapseImageBtn").textContent=layoutState.imageCollapsed?"＋":"−";
}
function saveLayout(){localStorage.setItem(LAYOUT_KEY,JSON.stringify(layoutState));}
function resetLayout(){
  Object.assign(layoutState,{imageFraction:1,directorFraction:1.18,aiFraction:.82,locked:false,imageCollapsed:false});
  applyLayout(); saveLayout();
}
try{Object.assign(layoutState,JSON.parse(localStorage.getItem(LAYOUT_KEY)||"{}"));}catch{}
applyLayout();
$("resetViewBtn").addEventListener("click",resetLayout);
$("lockDividerBtn").addEventListener("click",()=>{layoutState.locked=!layoutState.locked;applyLayout();saveLayout();});
$("collapseImageBtn").addEventListener("click",()=>{layoutState.imageCollapsed=!layoutState.imageCollapsed;applyLayout();saveLayout();});

let dividerPointer=null;
function isTabletMode(){return matchMedia("(min-width: 600px) and (min-height: 500px)").matches;}
function isLandscapeMode(){return matchMedia("(orientation: landscape)").matches;}
function dividerIsAvailable(kind){
  return kind==="ai" ? isTabletMode() : (isTabletMode() || isLandscapeMode());
}
function beginDividerDrag(kind,e){
  if(layoutState.locked || !dividerIsAvailable(kind)) return;
  dividerPointer={id:e.pointerId,kind};
  e.currentTarget.setPointerCapture(e.pointerId);
}
function moveDivider(kind,e){
  if(!dividerPointer || dividerPointer.id!==e.pointerId || dividerPointer.kind!==kind || layoutState.locked) return;
  const box=document.querySelector(".base-layout").getBoundingClientRect();
  const tablet=isTabletMode();
  const dividerWidth=10;
  const gap=tablet ? dividerWidth*2 : dividerWidth;
  const usable=Math.max(1,box.width-gap);
  const relative=Math.max(0,Math.min(usable,e.clientX-box.left));

  if(!tablet){
    if(kind!=="image") return;
    const total=layoutState.imageFraction+layoutState.directorFraction;
    const left=Math.max(.55,Math.min(total-.65,(relative/usable)*total));
    layoutState.imageFraction=+left.toFixed(3);
    layoutState.directorFraction=+Math.max(.65,total-left).toFixed(3);
    applyLayout();
    return;
  }

  const total=layoutState.imageFraction+layoutState.directorFraction+layoutState.aiFraction;
  if(kind==="image"){
    const left=Math.max(.55,Math.min(total-1.15,(relative/usable)*total));
    const remainder=total-left;
    const pair=layoutState.directorFraction+layoutState.aiFraction;
    layoutState.imageFraction=+left.toFixed(3);
    layoutState.directorFraction=+Math.max(.65,remainder*(layoutState.directorFraction/pair)).toFixed(3);
    layoutState.aiFraction=+Math.max(.5,total-layoutState.imageFraction-layoutState.directorFraction).toFixed(3);
  }else{
    const leftTotal=Math.max(1.2,Math.min(total-.5,(relative/usable)*total));
    const pair=layoutState.imageFraction+layoutState.directorFraction;
    layoutState.imageFraction=+Math.max(.55,leftTotal*(layoutState.imageFraction/pair)).toFixed(3);
    layoutState.directorFraction=+Math.max(.65,leftTotal-layoutState.imageFraction).toFixed(3);
    layoutState.aiFraction=+Math.max(.5,total-leftTotal).toFixed(3);
  }
  applyLayout();
}
function endDividerDrag(e){
  if(dividerPointer?.id===e.pointerId){dividerPointer=null;saveLayout();}
}
[
  [$("consoleDivider"),"image"],
  [$("aiConsoleDivider"),"ai"]
].forEach(([divider,kind])=>{
  divider.addEventListener("pointerdown",e=>beginDividerDrag(kind,e));
  divider.addEventListener("pointermove",e=>moveDivider(kind,e));
  divider.addEventListener("pointerup",endDividerDrag);
  divider.addEventListener("pointercancel",endDividerDrag);
  divider.addEventListener("dblclick",()=>{
    if(layoutState.locked || !dividerIsAvailable(kind)) return;
    const total=layoutState.imageFraction+layoutState.directorFraction+layoutState.aiFraction;
    const imageNeed=Math.max(280,document.querySelector(".image-console").scrollWidth);
    const directorNeed=Math.max(360,document.querySelector(".director-console").scrollWidth);
    const aiNeed=Math.max(280,document.querySelector(".tablet-ai-console").scrollWidth);
    const needTotal=imageNeed+directorNeed+aiNeed;
    if(kind==="image"){
      const pair=imageNeed+directorNeed;
      const pairFraction=layoutState.imageFraction+layoutState.directorFraction;
      layoutState.imageFraction=+(pairFraction*(imageNeed/pair)).toFixed(3);
      layoutState.directorFraction=+(pairFraction-layoutState.imageFraction).toFixed(3);
    }else{
      const pair=directorNeed+aiNeed;
      const pairFraction=layoutState.directorFraction+layoutState.aiFraction;
      layoutState.directorFraction=+(pairFraction*(directorNeed/pair)).toFixed(3);
      layoutState.aiFraction=+(pairFraction-layoutState.directorFraction).toFixed(3);
    }
    applyLayout();saveLayout();
  });
  divider.addEventListener("keydown",e=>{
    if(layoutState.locked || !dividerIsAvailable(kind) || !["ArrowLeft","ArrowRight"].includes(e.key)) return;
    e.preventDefault();
    const delta=e.key==="ArrowLeft"?-.04:.04;
    if(kind==="image"){
      layoutState.imageFraction=Math.max(.55,layoutState.imageFraction+delta);
      layoutState.directorFraction=Math.max(.65,layoutState.directorFraction-delta);
    }else{
      layoutState.directorFraction=Math.max(.65,layoutState.directorFraction+delta);
      layoutState.aiFraction=Math.max(.5,layoutState.aiFraction-delta);
    }
    applyLayout();saveLayout();
  });
});

const LEGACY_SAVED_LAYOUTS_KEY="genreactrix-v0.8.0-saved-layouts";
const DIRECTOR_ACCOUNT_KEY="genreactrix-current-director-account";
const WORKSPACE_PROFILE_KEY="genreactrix-v0.9.1-workspace-profile";
const WORKSPACE_PROFILES={
  "classification":{imageFraction:1,directorFraction:1.18,aiFraction:.82,imageCollapsed:false},
  "image-study":{imageFraction:1.55,directorFraction:.95,aiFraction:.62,imageCollapsed:false},
  "ai-review":{imageFraction:.78,directorFraction:1.02,aiFraction:1.42,imageCollapsed:false},
  "primfusion-analysis":{imageFraction:.82,directorFraction:1.02,aiFraction:.82,imageCollapsed:true}
};
function currentDirectorAccount(){return localStorage.getItem(DIRECTOR_ACCOUNT_KEY)||"local-director";}
function savedLayoutsKey(){return `genreactrix-v0.9.1-saved-layouts:${currentDirectorAccount()}`;}
function readSavedLayouts(){
  try{
    const current=localStorage.getItem(savedLayoutsKey());
    if(current) return JSON.parse(current);
    const legacy=localStorage.getItem(LEGACY_SAVED_LAYOUTS_KEY);
    if(legacy){localStorage.setItem(savedLayoutsKey(),legacy);return JSON.parse(legacy);}
    return {};
  }catch{return {};}
}
function writeSavedLayouts(layouts){localStorage.setItem(savedLayoutsKey(),JSON.stringify(layouts));}
function applyWorkspaceProfile(name,{persist=true}={}){
  const profile=WORKSPACE_PROFILES[name]||WORKSPACE_PROFILES.classification;
  Object.assign(layoutState,profile);
  applyLayout();saveLayout();
  $("workspaceProfileSelect").value=name in WORKSPACE_PROFILES?name:"classification";
  if(persist) localStorage.setItem(WORKSPACE_PROFILE_KEY,$("workspaceProfileSelect").value);
}
function refreshSavedLayouts(){
  const select=$("savedLayoutSelect");
  const layouts=readSavedLayouts();
  select.innerHTML='<option value="">Saved Layouts</option>';
  Object.keys(layouts).sort().forEach(name=>{
    const option=document.createElement("option"); option.value=name; option.textContent=name; select.appendChild(option);
  });
}
$("saveLayoutBtn").addEventListener("click",()=>{
  const name=prompt("Name this workspace layout:","My Layout");
  if(!name?.trim()) return;
  const layouts=readSavedLayouts();
  layouts[name.trim()]={imageFraction:layoutState.imageFraction,directorFraction:layoutState.directorFraction,aiFraction:layoutState.aiFraction,imageCollapsed:layoutState.imageCollapsed};
  writeSavedLayouts(layouts);
  refreshSavedLayouts();
  $("savedLayoutSelect").value=name.trim();
});
$("savedLayoutSelect").addEventListener("change",e=>{
  if(!e.target.value) return;
  const saved=readSavedLayouts()[e.target.value];
  if(saved){Object.assign(layoutState,saved);applyLayout();saveLayout();}
});
$("workspaceProfileSelect").addEventListener("change",e=>applyWorkspaceProfile(e.target.value));
let initialWorkspaceProfile=localStorage.getItem(WORKSPACE_PROFILE_KEY)||"classification";
if(initialWorkspaceProfile===["matrix","analysis"].join("-")) initialWorkspaceProfile="primfusion-analysis";
$("workspaceProfileSelect").value=initialWorkspaceProfile in WORKSPACE_PROFILES?initialWorkspaceProfile:"classification";
refreshSavedLayouts();

try{
  // v0.9.3.18 preserves the verified v0.9.2j storage namespace and clean classification namespace.
  // Earlier namespaces are left untouched as an archive because prior builds
  // may have written the same Theme values into multiple image records.
  const currentRecords=localStorage.getItem("genreactrix-v0.9.2j-records");
  state.records=currentRecords?JSON.parse(currentRecords):{};
  state.aiRuns=JSON.parse(localStorage.getItem("genreactrix-v0.9.2j-ai-runs")||"{}");
  state.writeIns=JSON.parse(localStorage.getItem("genreactrix-v0.9.1-writeins")||localStorage.getItem("genreactrix-v0.8.0-writeins")||localStorage.getItem("genreactrix-v0.7.0-writeins")||'["Horror","Dreamcore"]');
}catch(error){ console.warn("Genreactrix storage migration skipped",error); }



// v0.9.1 Desktop Mode: image zoom/pan, keyboard workflow, and primFusion navigation.
const imageTransform={scale:1,x:0,y:0,pointerId:null,startX:0,startY:0,originX:0,originY:0};
function applyImageTransform(){
  const image=$("mainImage");
  image.style.transform=`translate(${imageTransform.x}px, ${imageTransform.y}px) scale(${imageTransform.scale})`;
  $("imageViewport").classList.toggle("is-zoomed",imageTransform.scale>1);
}
function resetImageTransform(){
  Object.assign(imageTransform,{scale:1,x:0,y:0,pointerId:null});
  $("imageViewport").classList.remove("is-panning");
  applyImageTransform();
}
$("imageViewport").addEventListener("wheel",e=>{
  if(!e.ctrlKey && !isDesktopMode()) return;
  e.preventDefault();
  const old=imageTransform.scale;
  imageTransform.scale=Math.max(1,Math.min(6,old*(e.deltaY<0?1.12:.89)));
  if(imageTransform.scale===1){imageTransform.x=0;imageTransform.y=0;}
  applyImageTransform();
},{passive:false});
$("imageViewport").addEventListener("dblclick",resetImageTransform);
$("imageViewport").addEventListener("pointerdown",e=>{
  if(imageTransform.scale<=1) return;
  imageTransform.pointerId=e.pointerId;
  imageTransform.startX=e.clientX;imageTransform.startY=e.clientY;
  imageTransform.originX=imageTransform.x;imageTransform.originY=imageTransform.y;
  e.currentTarget.setPointerCapture(e.pointerId);
  e.currentTarget.classList.add("is-panning");
});
$("imageViewport").addEventListener("pointermove",e=>{
  if(imageTransform.pointerId!==e.pointerId) return;
  imageTransform.x=imageTransform.originX+(e.clientX-imageTransform.startX);
  imageTransform.y=imageTransform.originY+(e.clientY-imageTransform.startY);
  applyImageTransform();
});
function endImagePan(e){
  if(imageTransform.pointerId!==e.pointerId) return;
  imageTransform.pointerId=null;$("imageViewport").classList.remove("is-panning");
}
$("imageViewport").addEventListener("pointerup",endImagePan);
$("imageViewport").addEventListener("pointercancel",endImagePan);

function isDesktopMode(){return matchMedia("(min-width: 1200px) and (min-height: 650px)").matches;}
function editableTarget(target){return target.matches("input,textarea,select,[contenteditable='true']");}
document.addEventListener("keydown",e=>{
  if(e.key==="Escape"){
    const openDialog=[...document.querySelectorAll("dialog[open]")].pop();
    if(openDialog){e.preventDefault();openDialog.close();}
    return;
  }
  if(editableTarget(e.target)) return;
  if(e.altKey && ["1","2","3","4"].includes(e.key)){
    e.preventDefault();
    const names=["classification","image-study","ai-review","primfusion-analysis"];
    applyWorkspaceProfile(names[Number(e.key)-1]);
    return;
  }
  if(e.key.toLowerCase()==="n" || e.key==="ArrowRight"){e.preventDefault();nextImage();return;}
  if(e.key.toLowerCase()==="p" || e.key==="ArrowLeft"){e.preventDefault();prevImage();return;}
  if(e.key.toLowerCase()==="f"){$("directorFlagBtn").click();}
});
$("tabletPrimFusionMatrix").addEventListener("keydown",e=>{
  if(!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) return;
  const buttons=[...$("tabletPrimFusionMatrix").querySelectorAll("button:not([hidden])")];
  const index=buttons.indexOf(document.activeElement);
  if(index<0) return;
  e.preventDefault();
  const columns=14;
  const delta=e.key==="ArrowLeft"?-1:e.key==="ArrowRight"?1:e.key==="ArrowUp"?-columns:columns;
  buttons[Math.max(0,Math.min(buttons.length-1,index+delta))]?.focus();
});

let primFusionFitResizeTimer;
let lastPrimFusionLandscapeState=window.innerWidth > window.innerHeight;
window.addEventListener("resize",()=>{
  clearTimeout(primFusionFitResizeTimer);
  primFusionFitResizeTimer=setTimeout(()=>{
    const primFusionLandscapeState=window.innerWidth > window.innerHeight;
    if(primFusionLandscapeState!==lastPrimFusionLandscapeState){
      lastPrimFusionLandscapeState=primFusionLandscapeState;
      renderPrimFusionMatrix($("themeSearch")?.value||"","primFusionMatrix");
    }
    schedulePrimFusionFit($("primFusionMatrix"),0);
    schedulePrimFusionFit($("tabletPrimFusionMatrix"),0);
    scheduleFoldedLandscapeDescriptionFit();
    scheduleWorkspaceDescriptionFits();
  },120);
});


// v0.9.3.2: hydrate the active demo/image record from persistent storage only
// after all renderer dependencies (including image transform state) exist.
loadCurrent();


document.getElementById("tabletShowAiBtn")?.addEventListener("click",()=>{tabletAiVisible=!tabletAiVisible;renderTabletWorkbench();});
document.querySelectorAll("[data-tablet-workbench-slot]").forEach(button=>button.addEventListener("click",()=>{state.targetSlot=Number(button.dataset.tabletWorkbenchSlot);renderTabletWorkbench();}));


// Canonical Image Record Engine + shared Images Engine.
// The Image Record Engine owns identity, provenance, workflow state, extensible metadata,
// analysis containers, locking, queries, integrity checks, and recycle-bin state.
// The Images Engine owns acquisition and blobs, and updates records only through this engine.
const IMAGE_RECORD_SCHEMA_VERSION=1;
const IMAGE_RECORDS_KEY="genreactrix-image-records-v1";
const LEGACY_IMAGE_ENGINE_MANIFEST_KEY="genreactrix-image-engine-manifest-v1";
const RECYCLE_RETENTION_KEY="genreactrix-recycle-retention-days";
const IMAGE_ENGINE_DB_NAME="genreactrix-image-engine";
const IMAGE_ENGINE_DB_VERSION=2;
const IMAGE_ENGINE_BLOB_STORE="image-blobs";
const HISTORY_ENGINE_STORE="history-events";

function createImageId(prefix="img"){
  const random=globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${random}`;
}
function safeUrl(value){
  try{ const url=new URL(String(value).trim()); return ["http:","https:"].includes(url.protocol)?url.href:""; }
  catch(error){ return ""; }
}
function openImageEngineDatabase(){
  return new Promise((resolve,reject)=>{
    if(!globalThis.indexedDB){ reject(new Error("IndexedDB is unavailable")); return; }
    const request=indexedDB.open(IMAGE_ENGINE_DB_NAME,IMAGE_ENGINE_DB_VERSION);
    request.onupgradeneeded=()=>{
      const db=request.result;
      if(!db.objectStoreNames.contains(IMAGE_ENGINE_BLOB_STORE)) db.createObjectStore(IMAGE_ENGINE_BLOB_STORE);
      if(!db.objectStoreNames.contains(HISTORY_ENGINE_STORE)){
        const history=db.createObjectStore(HISTORY_ENGINE_STORE,{keyPath:"entryId"});
        history.createIndex("imageId","imageId",{unique:false});
        history.createIndex("eventType","eventType",{unique:false});
        history.createIndex("timestamp","timestamp",{unique:false});
        history.createIndex("batchId","batchId",{unique:false});
        history.createIndex("actor","actor",{unique:false});
      }
    };
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error || new Error("Could not open image storage"));
  });
}
async function imageBlobPut(key,blob){
  const db=await openImageEngineDatabase();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(IMAGE_ENGINE_BLOB_STORE,"readwrite");
    tx.objectStore(IMAGE_ENGINE_BLOB_STORE).put(blob,key);
    tx.oncomplete=()=>{db.close();resolve();};
    tx.onerror=()=>{db.close();reject(tx.error);};
  });
}
async function imageBlobGet(key){
  const db=await openImageEngineDatabase();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(IMAGE_ENGINE_BLOB_STORE,"readonly");
    const request=tx.objectStore(IMAGE_ENGINE_BLOB_STORE).get(key);
    request.onsuccess=()=>resolve(request.result || null);
    request.onerror=()=>reject(request.error);
    tx.oncomplete=()=>db.close();
  });
}
async function imageBlobDelete(key){
  const db=await openImageEngineDatabase();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(IMAGE_ENGINE_BLOB_STORE,"readwrite");
    tx.objectStore(IMAGE_ENGINE_BLOB_STORE).delete(key);
    tx.oncomplete=()=>{db.close();resolve();};
    tx.onerror=()=>{db.close();reject(tx.error);};
  });
}

function createHistoryEngine(){
  const schemaVersion=1;
  const now=()=>new Date().toISOString();
  const clone=value=>value==null?value:structuredClone(value);
  const nextId=()=>createImageId("history");
  function withStore(mode,work){
    return openImageEngineDatabase().then(db=>new Promise((resolve,reject)=>{
      const tx=db.transaction(HISTORY_ENGINE_STORE,mode);
      const store=tx.objectStore(HISTORY_ENGINE_STORE);
      let result;
      try{result=work(store,tx);}catch(error){db.close();reject(error);return;}
      tx.oncomplete=()=>{db.close();resolve(result);};
      tx.onerror=()=>{db.close();reject(tx.error||new Error("History transaction failed"));};
      tx.onabort=()=>{db.close();reject(tx.error||new Error("History transaction aborted"));};
    }));
  }
  async function append(input={}){
    if(!input.imageId) throw new Error("History entry requires an Image ID");
    let previousEntryId=input.previousEntryId||null;
    if(!previousEntryId){
      const existing=await timeline(input.imageId);
      const category=String(input.eventType||"updated").split("-")[0];
      previousEntryId=existing.filter(entry=>String(entry.eventType).split("-")[0]===category).at(-1)?.entryId||null;
    }
    const entry={
      schemaVersion:Number(input.schemaVersion)||schemaVersion,
      entryId:input.entryId||nextId(),
      imageId:input.imageId,
      eventType:input.eventType||"updated",
      timestamp:input.timestamp||now(),
      actor:input.actor||"system",
      sourceEngine:input.sourceEngine||"unknown",
      batchId:input.batchId||null,
      jobId:input.jobId||null,
      previousEntryId,
      summary:input.summary||"",
      payload:clone(input.payload||{})
    };
    await withStore("readwrite",store=>store.add(entry));
    window.dispatchEvent(new CustomEvent("genreactrix:history",{detail:{type:"appended",entry:clone(entry)}}));
    return clone(entry);
  }
  function collectByIndex(indexName,value,direction="next"){
    return openImageEngineDatabase().then(db=>new Promise((resolve,reject)=>{
      const tx=db.transaction(HISTORY_ENGINE_STORE,"readonly");
      const store=tx.objectStore(HISTORY_ENGINE_STORE);
      const source=indexName?store.index(indexName):store;
      const request=indexName?source.openCursor(IDBKeyRange.only(value),direction):source.openCursor(null,direction);
      const results=[];
      request.onsuccess=()=>{const cursor=request.result;if(cursor){results.push(clone(cursor.value));cursor.continue();}};
      request.onerror=()=>reject(request.error);
      tx.oncomplete=()=>{db.close();resolve(results);};
      tx.onerror=()=>{db.close();reject(tx.error);};
    }));
  }
  async function timeline(imageId){
    const entries=await collectByIndex("imageId",imageId);
    return entries.sort((a,b)=>String(a.timestamp).localeCompare(String(b.timestamp)));
  }
  async function eventsByType(eventType){return collectByIndex("eventType",eventType);}
  async function latest(imageId,eventType=null){
    const entries=(await timeline(imageId)).filter(entry=>!eventType||entry.eventType===eventType);
    return entries.at(-1)||null;
  }
  async function aiHistory(imageId){return (await timeline(imageId)).filter(entry=>entry.eventType.startsWith("ai-"));}
  async function directorHistory(imageId){return (await timeline(imageId)).filter(entry=>entry.eventType.startsWith("director-"));}
  async function lifecycleHistory(imageId){return (await timeline(imageId)).filter(entry=>["stage-changed","recycled","recycle-restored","recycle-purged","archived"].includes(entry.eventType));}
  async function storageHistory(imageId){return (await timeline(imageId)).filter(entry=>["downloaded","download-fallback","reference-downloaded","reference-saved","reference-missing","recycled","recycle-restored","recycle-purged"].includes(entry.eventType));}
  function diffValues(previous,current){
    const before=previous?.payload?.analysis||previous?.payload?.director||previous?.payload?.current||null;
    const after=current?.payload?.analysis||current?.payload?.director||current?.payload?.current||null;
    return {before:clone(before),after:clone(after),changed:JSON.stringify(before)!==JSON.stringify(after)};
  }
  async function compareEntries(firstId,secondId){
    const all=await collectByIndex(null,null);
    const first=all.find(entry=>entry.entryId===firstId)||null;
    const second=all.find(entry=>entry.entryId===secondId)||null;
    return {first,second,...diffValues(first,second)};
  }
  async function verifyContinuity(imageRecords=[]){
    const entries=await collectByIndex(null,null);
    const issues=[];
    const entryIds=new Set();
    const recordIds=new Set(imageRecords.map(record=>record.id));
    for(const entry of entries){
      if(entryIds.has(entry.entryId))issues.push({type:"duplicate-entry-id",entryId:entry.entryId});
      entryIds.add(entry.entryId);
      if(!recordIds.has(entry.imageId))issues.push({type:"history-without-record",entryId:entry.entryId,imageId:entry.imageId});
      if(entry.previousEntryId&&!entries.some(candidate=>candidate.entryId===entry.previousEntryId))issues.push({type:"broken-previous-link",entryId:entry.entryId,previousEntryId:entry.previousEntryId});
      if(Number.isNaN(Date.parse(entry.timestamp)))issues.push({type:"invalid-timestamp",entryId:entry.entryId});
    }
    return {checkedAt:now(),entryCount:entries.length,issueCount:issues.length,issues};
  }
  return {append,timeline,eventsByType,latest,aiHistory,directorHistory,lifecycleHistory,storageHistory,compareEntries,verifyContinuity};
}
window.genreactrixHistoryEngine=createHistoryEngine();
function appendHistory(entry){
  window.genreactrixHistoryEngine?.append(entry).catch(error=>console.warn("History entry could not be stored",error));
}

function createImageRecordEngine(){
  const now=()=>new Date().toISOString();
  let records=[];
  try{ records=JSON.parse(localStorage.getItem(IMAGE_RECORDS_KEY)||"[]"); }catch(error){ records=[]; }
  if(!Array.isArray(records)||!records.length){
    try{ records=JSON.parse(localStorage.getItem(LEGACY_IMAGE_ENGINE_MANIFEST_KEY)||"[]"); }catch(error){ records=[]; }
  }
  const defaultComponents=()=>({
    aiReactions:"missing",aiThemes:"missing",aiDescription:"missing",aiEmotion:"missing",
    aiReactionReasons:"missing",aiGenreReasons:"missing",directorReactions:"missing",
    directorThemes:"missing",primFusion:"missing"
  });
  const normalize=record=>({
    schemaVersion:Number(record.schemaVersion)||IMAGE_RECORD_SCHEMA_VERSION,
    id:record.id||createImageId(),
    name:record.name||"Untitled image",
    createdAt:record.createdAt||record.addedAt||now(),
    accessedAt:record.accessedAt||null,
    updatedAt:record.updatedAt||record.addedAt||now(),
    source:{
      type:record.source?.type||record.sourceType||"unknown",
      originalLocation:record.source?.originalLocation||record.originalLocation||"",
      originalUrl:record.source?.originalUrl||record.originalUrl||"",
      originalFilename:record.source?.originalFilename||record.name||"",
      importMethod:record.source?.importMethod||record.acquisitionMode||"unknown",
      firstBatchId:record.source?.firstBatchId||record.batchId||"current-import",
      dataset:record.source?.dataset||null,
      license:record.source?.license||null,
      attribution:record.source?.attribution||null
    },
    storage:{
      mode:record.storage?.mode||record.storageState||"temporary",
      temporaryKey:record.storage?.temporaryKey ?? (["temporary","reference","recycle"].includes(record.storageState)?record.id:null),
      referenceKey:record.storage?.referenceKey ?? (record.storageState==="reference"?record.id:null),
      hyperlink:record.storage?.hyperlink||record.originalUrl||"",
      recycle:{deletedAt:record.storage?.recycle?.deletedAt||null,priorMode:record.storage?.recycle?.priorMode||null},
      missingReference:Boolean(record.storage?.missingReference),
      mimeType:record.storage?.mimeType||record.mimeType||"",
      size:Number(record.storage?.size ?? record.size)||0,
      lastModified:Number(record.storage?.lastModified ?? record.lastModified)||0,
      hash:record.storage?.hash||record.fileHash||""
    },
    workflow:{stage:record.workflow?.stage||({available:"available",queued:"queued",processed:"director-complete"}[record.lifecycleState]||record.lifecycleState||"imported")},
    attributes:{
      saved:Boolean(record.attributes?.saved||record.savedAt||record.storageState==="reference"),
      flagged:Boolean(record.attributes?.flagged||record.flaggedAt),
      locked:Boolean(record.attributes?.locked),
      hyperlinkOnly:Boolean(record.attributes?.hyperlinkOnly||record.storageState==="linked"),
      needsReview:Boolean(record.attributes?.needsReview||record.flaggedAt),
      failed:Boolean(record.attributes?.failed||record.error),
      archived:Boolean(record.attributes?.archived),
      inRecycleBin:Boolean(record.attributes?.inRecycleBin||record.storageState==="recycle")
    },
    components:{...defaultComponents(),...(record.components||{})},
    analysis:{ai:record.analysis?.ai||null,director:record.analysis?.director||null},
    metadata:{core:record.metadata?.core||{},extended:record.metadata?.extended||{}},
    batchIds:Array.isArray(record.batchIds)?record.batchIds:[record.batchId||"current-import"],
    timestamps:{
      savedAt:record.timestamps?.savedAt||record.savedAt||null,
      flaggedAt:record.timestamps?.flaggedAt||record.flaggedAt||null,
      processedAt:record.timestamps?.processedAt||record.processedAt||null
    },
    error:record.error||""
  });
  records=records.map(normalize);
  const persist=()=>localStorage.setItem(IMAGE_RECORDS_KEY,JSON.stringify(records));
  persist();
  localStorage.removeItem(LEGACY_IMAGE_ENGINE_MANIFEST_KEY);
  const emit=(type,record,detail={})=>window.dispatchEvent(new CustomEvent("genreactrix:image-record",{detail:{type,imageId:record?.id||null,record:record?structuredClone(record):null,...detail}}));
  const mutable=id=>records.find(r=>r.id===id)||null;
  const clone=value=>value?structuredClone(value):null;
  function create(input={}){ const record=normalize(input); if(mutable(record.id)) throw new Error("Duplicate Image ID"); records.push(record);persist();emit("created",record);appendHistory({imageId:record.id,eventType:"record-created",actor:"system",sourceEngine:"image-record",batchId:record.batchIds?.[0]||null,summary:"Image record created",payload:{current:clone(record)}});return clone(record); }
  function get(id,{touch=true}={}){ const record=mutable(id);if(!record)return null;if(touch){record.accessedAt=now();record.updatedAt=now();persist();emit("accessed",record);}return clone(record); }
  function update(id,patch={},reason="updated"){
    const record=mutable(id);if(!record)return null;if(record.attributes.locked&&reason!=="unlock"&&reason!=="integrity")throw new Error("Image record is locked");
    const merged=normalize({...record,...patch,source:{...record.source,...(patch.source||{})},storage:{...record.storage,...(patch.storage||{}),recycle:{...record.storage.recycle,...(patch.storage?.recycle||{})}},workflow:{...record.workflow,...(patch.workflow||{})},attributes:{...record.attributes,...(patch.attributes||{})},components:{...record.components,...(patch.components||{})},analysis:{...record.analysis,...(patch.analysis||{})},metadata:{core:{...record.metadata.core,...(patch.metadata?.core||{})},extended:{...record.metadata.extended,...(patch.metadata?.extended||{})}},timestamps:{...record.timestamps,...(patch.timestamps||{})}});
    const before=clone(record);
    Object.assign(record,merged,{updatedAt:now()});persist();emit(reason,record);
    if(reason!=="accessed")appendHistory({imageId:record.id,eventType:reason,actor:reason.startsWith("ai-")?"ai":reason.startsWith("director-")?"director":"system",sourceEngine:"image-record",batchId:record.batchIds?.at(-1)||null,summary:reason.replaceAll("-"," "),payload:{before,current:clone(record),patch:clone(patch)}});
    return clone(record);
  }
  function setStage(id,stage){return update(id,{workflow:{stage}},"stage-changed");}
  function setAttribute(id,key,value){return update(id,{attributes:{[key]:Boolean(value)}},"attribute-changed");}
  function setComponent(id,key,status){return update(id,{components:{[key]:status}},"component-changed");}
  function attachAI(id,data,componentUpdates={}){return update(id,{analysis:{ai:{...data,recordedAt:now()}},components:componentUpdates},"ai-attached");}
  function attachDirector(id,data,componentUpdates={}){return update(id,{analysis:{director:{...data,recordedAt:now()}},components:componentUpdates},"director-attached");}
  function setLocked(id,locked){return update(id,{attributes:{locked:Boolean(locked)}},locked?"locked":"unlock");}
  function query(filters={}){return records.filter(record=>Object.entries(filters).every(([key,value])=>{
    if(key==="stage")return record.workflow.stage===value;
    if(key in record.attributes)return record.attributes[key]===value;
    if(key==="batchId")return record.batchIds.includes(value);
    if(key==="sourceType")return record.source.type===value;
    if(key==="component")return record.components[value]&&record.components[value]!=="missing";
    return true;
  })).map(clone);}
  function integrity(){
    const issues=[];const ids=new Set();
    records.forEach(record=>{
      if(ids.has(record.id))issues.push({imageId:record.id,type:"duplicate-id"});ids.add(record.id);
      if(!record.source.originalLocation&&!record.source.originalUrl)issues.push({imageId:record.id,type:"missing-provenance"});
      if(record.attributes.saved&&!record.storage.referenceKey)issues.push({imageId:record.id,type:"saved-without-reference"});
      if(record.attributes.inRecycleBin&&!record.storage.recycle.deletedAt)issues.push({imageId:record.id,type:"recycle-without-date"});
      if(record.schemaVersion>IMAGE_RECORD_SCHEMA_VERSION)issues.push({imageId:record.id,type:"future-schema"});
    });
    return {checkedAt:now(),recordCount:records.length,issueCount:issues.length,issues};
  }
  function all(){return records.map(clone);}
  return {create,get,update,setStage,setAttribute,setComponent,attachAI,attachDirector,setLocked,query,integrity,all,_mutable:mutable};
}
window.genreactrixImageRecordEngine=createImageRecordEngine();

function createImagesEngine(){
  const records=window.genreactrixImageRecordEngine;
  let activeSessionIds=[];
  let objectUrls=new Map();
  const now=()=>new Date().toISOString();
  const recordById=id=>records._mutable(id);
  const persistRecord=(id,patch,reason)=>records.update(id,patch,reason);
  function revokeObjectUrls(){objectUrls.forEach(url=>URL.revokeObjectURL(url));objectUrls.clear();}
  function snapshot(){
    const all=records.all();const count=p=>all.filter(p).length;
    return {total:all.length,available:count(r=>r.workflow.stage==="available"),queued:count(r=>r.workflow.stage==="queued"),processed:count(r=>["director-complete","ready-to-batch","batched"].includes(r.workflow.stage)),temporary:count(r=>r.storage.mode==="temporary"),linked:count(r=>r.storage.mode==="linked"),saved:count(r=>r.attributes.saved),flagged:count(r=>r.attributes.flagged),recycle:count(r=>r.attributes.inRecycleBin),discardable:count(r=>r.workflow.stage==="director-complete"&&r.storage.mode==="temporary"&&!r.attributes.flagged&&!r.attributes.saved)};
  }
  async function importFiles(fileList,{limit=null,batchId="current-import"}={}){
    const files=[...fileList].filter(file=>file.type.startsWith("image/"));const selected=Number.isFinite(limit)&&limit>0?files.slice(0,limit):files;const created=[];
    for(const file of selected){
      const id=createImageId("local");let record=records.create({id,name:file.name,source:{type:"file",originalLocation:file.webkitRelativePath||file.name,originalFilename:file.name,importMethod:"temporary-copy",firstBatchId:batchId},storage:{mode:"temporary",temporaryKey:id,mimeType:file.type,size:file.size,lastModified:file.lastModified},workflow:{stage:"available"},batchIds:[batchId]});
      try{await imageBlobPut(id,file);}catch(error){record=records.update(id,{attributes:{failed:true},error:String(error?.message||error)},"storage-failed");}
      created.push(record);
    }
    activeSessionIds=created.map(r=>r.id);return created;
  }
  async function prefetchUrls(text,{limit=null}={}){const raw=[...new Set(String(text||"").split(/\r?\n|,\s*(?=https?:)/).map(safeUrl).filter(Boolean))];const urls=Number.isFinite(limit)&&limit>0?raw.slice(0,limit):raw;return urls.map((url,index)=>({url,index,host:new URL(url).host,name:decodeURIComponent(new URL(url).pathname.split("/").pop()||`remote-${index+1}`)}));}
  async function importUrls(text,{limit=null,mode="link",prefetch=true,batchId="current-import"}={}){
    const sources=await prefetchUrls(text,{limit});const created=[];
    for(const source of sources){
      const id=createImageId("url");let record=records.create({id,name:source.name,source:{type:"url",originalLocation:source.url,originalUrl:source.url,originalFilename:source.name,importMethod:mode==="download"?"temporary-copy":"hyperlink-only",firstBatchId:batchId},storage:{mode:mode==="download"?"temporary":"linked",temporaryKey:mode==="download"?id:null,hyperlink:source.url},workflow:{stage:"available"},attributes:{hyperlinkOnly:mode!=="download"},batchIds:[batchId]});
      if(mode==="download")try{const response=await fetch(source.url,{mode:"cors"});if(!response.ok)throw new Error(`HTTP ${response.status}`);const blob=await response.blob();if(!blob.type.startsWith("image/"))throw new Error("URL did not return an image");await imageBlobPut(id,blob);record=records.update(id,{storage:{mimeType:blob.type,size:blob.size}},"downloaded");}catch(error){record=records.update(id,{storage:{mode:"linked",temporaryKey:null,hyperlink:source.url},attributes:{hyperlinkOnly:true,failed:true},error:String(error?.message||error)},"download-fallback");}
      created.push(record);
    }
    activeSessionIds=created.map(r=>r.id);return created;
  }
  async function fileForRecord(record){
    if(!record)return null;if(record.storage.mode==="linked")return{id:record.id,name:record.name,url:record.storage.hyperlink||record.source.originalUrl,imageRecord:record};
    const blob=await imageBlobGet(record.id);if(!blob){records.update(record.id,{storage:{missingReference:true}},"reference-missing");const fallback=record.storage.hyperlink||record.source.originalUrl;return fallback?{id:record.id,name:record.name,url:fallback,imageRecord:record}:null;}
    const prior=objectUrls.get(record.id);if(prior)URL.revokeObjectURL(prior);const url=URL.createObjectURL(blob);objectUrls.set(record.id,url);records.update(record.id,{accessedAt:now(),storage:{missingReference:false}},"accessed");return{id:record.id,name:record.name,url,imageRecord:records.get(record.id,{touch:false})};
  }
  async function workingFiles(ids=activeSessionIds){const selected=ids?.length?ids:records.query({stage:"available"}).map(r=>r.id);const files=[];for(const id of selected){const file=await fileForRecord(records.get(id,{touch:false}));if(file)files.push(file);}return files;}
  function setLifecycle(id,lifecycleState){const stage={processed:"director-complete"}[lifecycleState]||lifecycleState;return records.update(id,{workflow:{stage},timestamps:stage==="director-complete"?{processedAt:now()}:{}},"stage-changed");}
  function setFlagged(id,flagged=true){return records.update(id,{attributes:{flagged,needsReview:flagged},timestamps:{flaggedAt:flagged?now():null}},"flag-changed");}
  async function saveReference(id){let record=records.get(id,{touch:false});if(!record)throw new Error("Image record not found");if(record.storage.mode==="linked"){const response=await fetch(record.storage.hyperlink||record.source.originalUrl,{mode:"cors"});if(!response.ok)throw new Error(`HTTP ${response.status}`);const blob=await response.blob();if(!blob.type.startsWith("image/"))throw new Error("URL did not return an image");await imageBlobPut(id,blob);record=records.update(id,{storage:{mimeType:blob.type,size:blob.size,temporaryKey:id}},"reference-downloaded");}
    return records.update(id,{storage:{mode:"reference",referenceKey:id},attributes:{saved:true,hyperlinkOnly:false,inRecycleBin:false},timestamps:{savedAt:now()}},"reference-saved");
  }
  async function moveToRecycle(id){const record=records.get(id,{touch:false});if(!record||record.attributes.saved||record.attributes.flagged)return null;return records.update(id,{storage:{mode:"recycle",recycle:{deletedAt:now(),priorMode:record.storage.mode}},attributes:{inRecycleBin:true}},"recycled");}
  async function cleanupProcessed(){const candidates=records.all().filter(r=>r.workflow.stage==="director-complete"&&r.storage.mode==="temporary"&&!r.attributes.flagged&&!r.attributes.saved);for(const r of candidates)await moveToRecycle(r.id);return candidates.length;}
  async function restoreFromRecycle(id){const record=records.get(id,{touch:false});if(!record?.attributes.inRecycleBin)return null;return records.update(id,{storage:{mode:record.storage.recycle.priorMode||"temporary",recycle:{deletedAt:null,priorMode:null}},attributes:{inRecycleBin:false}},"recycle-restored");}
  async function purgeRecycle({before=null,freeBytes=null,all=false}={}){
    let candidates=records.all().filter(r=>r.attributes.inRecycleBin&&!r.attributes.saved&&!r.attributes.flagged).sort((a,b)=>String(a.storage.recycle.deletedAt).localeCompare(String(b.storage.recycle.deletedAt)));
    if(before)candidates=candidates.filter(r=>r.storage.recycle.deletedAt&&new Date(r.storage.recycle.deletedAt)<new Date(before));
    let freed=0,purged=0;
    for(const record of candidates){if(!all&&!before&&Number.isFinite(freeBytes)&&freed>=freeBytes)break;await imageBlobDelete(record.id).catch(()=>{});freed+=record.storage.size||0;purged++;records.update(record.id,{storage:{mode:record.storage.hyperlink?"linked":"none",temporaryKey:null,referenceKey:null,recycle:{deletedAt:null,priorMode:null}},attributes:{inRecycleBin:false,hyperlinkOnly:Boolean(record.storage.hyperlink)},workflow:{stage:"archived"}},"recycle-purged");}
    return{purged,freed};
  }
  async function purgeExpired(){const days=Math.max(0,Number(localStorage.getItem(RECYCLE_RETENTION_KEY))||30);if(days<=0)return{purged:0,freed:0};const before=new Date(Date.now()-days*86400000).toISOString();return purgeRecycle({before});}
  async function verifyStorage(){const issues=[];for(const record of records.all()){if(["temporary","reference","recycle"].includes(record.storage.mode)){const blob=await imageBlobGet(record.id).catch(()=>null);if(!blob){records.update(record.id,{storage:{missingReference:true}},"integrity");issues.push({imageId:record.id,type:"missing-blob"});}}}const recordIntegrity=records.integrity();const historyIntegrity=await window.genreactrixHistoryEngine.verifyContinuity(records.all());return{...recordIntegrity,storageIssues:issues,historyIntegrity,issueCount:recordIntegrity.issueCount+issues.length+historyIntegrity.issueCount};}
  function allRecords(){return records.all();}
  return{snapshot,importFiles,prefetchUrls,importUrls,workingFiles,setLifecycle,setFlagged,saveReference,cleanupProcessed,moveToRecycle,restoreFromRecycle,purgeRecycle,purgeExpired,verifyStorage,allRecords,recordById:id=>records.get(id,{touch:false}),revokeObjectUrls};
}
window.genreactrixImagesEngine=createImagesEngine();
window.genreactrixImagesEngine.purgeExpired().then(result=>{if(result.purged)console.info(`Recycle bin automatically purged ${result.purged} expired image(s).`);}).catch(console.warn);

// v0.9.8.0 adds the persistent modular AI Analysis Engine while preserving the Control Station, Images, Image Record, and History engines.
// Portrait remains a client of shared capabilities. Quick buttons store references
// to engine actions plus validated parameter snapshots; they do not duplicate action logic.
const PORTRAIT_DEFAULT_AMOUNT_KEY="genreactrix-portrait-default-amount";
const AI_QUEUE_KEY="genreactrix-ai-lookahead-queue";
const AI_BUFFER_TARGET_KEY="genreactrix-ai-buffer-target";
const AI_QUICK_ADD_KEY="genreactrix-ai-quick-add";
const PORTRAIT_AI_OUTPUTS_KEY="genreactrix-portrait-ai-outputs";
const QUICK_PRESETS_KEY="genreactrix-quick-action-presets-v1";

function portraitDefaultAmount(){
  const input=document.getElementById("portraitDefaultAmount");
  const parsed=Math.max(1,Math.floor(Number(input?.value)||100));
  if(input) input.value=String(parsed);
  return parsed;
}
function syncPortraitDefaultAmount(){
  const input=document.getElementById("portraitDefaultAmount");
  if(!input) return;
  const saved=Math.max(1,Math.floor(Number(localStorage.getItem(PORTRAIT_DEFAULT_AMOUNT_KEY))||100));
  input.value=String(saved);
  input.addEventListener("change",()=>{
    const amount=portraitDefaultAmount();
    localStorage.setItem(PORTRAIT_DEFAULT_AMOUNT_KEY,String(amount));
    renderQuickButtons();
    setPortraitStationStatus(`Quick-add default set to ${amount} images.`);
  });
}

function selectedPortraitAiOutputs(){
  return Object.fromEntries([...document.querySelectorAll("[data-portrait-ai-output]")].map(item=>[item.dataset.portraitAiOutput,item.checked]));
}
function syncPortraitAiOutputs(){
  const controls=[...document.querySelectorAll("[data-portrait-ai-output]")];
  if(!controls.length) return;
  let saved={};
  try{ saved=JSON.parse(localStorage.getItem(PORTRAIT_AI_OUTPUTS_KEY)||"{}"); }catch(error){ saved={}; }
  controls.forEach(control=>{
    if(Object.prototype.hasOwnProperty.call(saved,control.dataset.portraitAiOutput)) control.checked=Boolean(saved[control.dataset.portraitAiOutput]);
    control.addEventListener("change",()=>localStorage.setItem(PORTRAIT_AI_OUTPUTS_KEY,JSON.stringify(selectedPortraitAiOutputs())));
  });
}

function createAiLookAheadQueueEngine(){
  let pending=[];
  try{ pending=JSON.parse(localStorage.getItem(AI_QUEUE_KEY)||"[]"); }
  catch(error){ pending=[]; }
  if(!Array.isArray(pending)) pending=[];

  const bufferTarget=()=>Math.max(0,Math.floor(Number(localStorage.getItem(AI_BUFFER_TARGET_KEY))||25));
  const quickAddAmount=()=>Math.max(1,Math.floor(Number(localStorage.getItem(AI_QUICK_ADD_KEY))||100));
  const currentKeys=()=>state.files.map(file=>file.id || file.name);
  const analyzedKeys=()=>new Set(currentKeys().filter(key=>Boolean(state.aiRuns?.[key]?.length)));
  const persist=()=>localStorage.setItem(AI_QUEUE_KEY,JSON.stringify(pending));

  function normalize(){
    const current=new Set(currentKeys());
    const analyzed=analyzedKeys();
    pending=[...new Set(pending)].filter(key=>current.has(key)&&!analyzed.has(key));
    persist();
  }
  function availableKeys(){
    normalize();
    const pendingSet=new Set(pending);
    const analyzed=analyzedKeys();
    return currentKeys().filter(key=>!pendingSet.has(key)&&!analyzed.has(key));
  }
  function queueNext(count){
    const additions=availableKeys().slice(0,Math.max(0,Math.floor(Number(count)||0)));
    pending.push(...additions);
    normalize();
    renderPortraitControlStation();
    return additions.length;
  }
  function maintainBuffer(){
    normalize();
    const needed=Math.max(0,bufferTarget()-pending.length);
    return needed?queueNext(needed):0;
  }
  function snapshot(){
    normalize();
    return {pending:pending.length,available:availableKeys().length,bufferTarget:bufferTarget(),quickAddAmount:quickAddAmount()};
  }
  return {queueNext,maintainBuffer,snapshot};
}

window.genreactrixAiQueueEngine=createAiLookAheadQueueEngine();

const QUICK_ACTIONS={
  "images.add-folder":{
    module:"images",name:"Add from folder",defaultLabel:"Folder · Add",
    fields:[{key:"quantity",label:"Images",type:"number",min:1,getDefault:()=>portraitDefaultAmount()}],
    summarize:p=>[`Source: Folder`,`Quantity: ${p.quantity}`],
    run:p=>{ pendingPortraitImportLimit=Math.max(1,Number(p.quantity)||portraitDefaultAmount()); document.getElementById("folderInput")?.click(); }
  },
  "images.add-urls":{
    module:"images",name:"Add from URLs",defaultLabel:"URLs · Add",
    fields:[{key:"quantity",label:"Images",type:"number",min:1,getDefault:()=>portraitDefaultAmount()}],
    summarize:p=>[`Source: URLs`,`Quantity: ${p.quantity}`],
    run:p=>openImageIntakeDialog({quantity:p.quantity})
  },
  "batch.current":{
    module:"batch",name:"Batch current work",defaultLabel:"Batch current",
    fields:[],summarize:()=>["Target: Current import","Standard report: Automatic"],
    run:async()=>{try{const result=await window.genreactrixBatchEngine?.quickSubmit?.();if(result)setPortraitStationStatus(`Batch submitted. ${result.report.counts.total} images · report generated.`)}catch(error){setPortraitStationStatus(error.message||String(error))}}
  },
  "ai.analyze-more":{
    module:"ai",name:"Analyze more images",defaultLabel:"Analyze more",
    fields:[
      {key:"quantity",label:"Images",type:"number",min:1,getDefault:()=>window.genreactrixAiQueueEngine.snapshot().quickAddAmount},
      {key:"outputs",label:"Outputs",type:"ai-outputs",getDefault:()=>selectedPortraitAiOutputs()}
    ],
    summarize:p=>{
      const labels={reactions:"Reactions",themes:"Themes",description:"Description",emotion:"Emotion","reaction-reasons":"Reaction reasons","genre-reasons":"Genre reasons"};
      const selected=Object.entries(p.outputs||{}).filter(([,on])=>on).map(([key])=>labels[key]);
      return [`Quantity: ${p.quantity}`,`Outputs: ${selected.join(", ")||"None"}`];
    },
    validate:p=>Object.values(p.outputs||{}).some(Boolean)?"":"Choose at least one AI output.",
    run:p=>{
      const added=window.genreactrixAiQueueEngine.queueNext(Math.max(1,Number(p.quantity)||100));
      setPortraitStationStatus(added?`${added} images added to the AI look-ahead queue.`:"No additional unanalyzed images are available.");
    }
  },
  "queue.open":{module:"queue",name:"Open queue",defaultLabel:"Open queue",fields:[],summarize:()=>["View: Queue"],run:()=>setPortraitStationStatus("Open the Queue console.")},
  "reports.open":{module:"reports",name:"Open reports",defaultLabel:"Open reports",fields:[],summarize:()=>["View: Reports"],run:()=>window.genreactrixReportsEngine?.openConsole?.()}
};

const DEFAULT_QUICK_PRESETS={
  batch:{1:{visible:true,actionId:"batch.current",label:"Batch current",params:{}},2:{visible:false,actionId:"",label:"",params:{}}},
  images:{1:{visible:true,actionId:"images.add-folder",label:"Folder · Add",params:{}},2:{visible:true,actionId:"images.add-urls",label:"URLs · Add",params:{}}},
  ai:{1:{visible:true,actionId:"ai.analyze-more",label:"Analyze more",params:{}},2:{visible:false,actionId:"",label:"",params:{}}},
  queue:{1:{visible:false,actionId:"",label:"",params:{}},2:{visible:false,actionId:"",label:"",params:{}}},
  reports:{1:{visible:false,actionId:"",label:"",params:{}},2:{visible:false,actionId:"",label:"",params:{}}}
};

function loadQuickPresets(){
  let saved={};
  try{ saved=JSON.parse(localStorage.getItem(QUICK_PRESETS_KEY)||"{}"); }catch(error){ saved={}; }
  const merged=structuredClone(DEFAULT_QUICK_PRESETS);
  Object.keys(merged).forEach(module=>[1,2].forEach(slot=>{
    if(saved?.[module]?.[slot]) merged[module][slot]={...merged[module][slot],...saved[module][slot],params:{...merged[module][slot].params,...(saved[module][slot].params||{})}};
  }));
  return merged;
}
let quickPresets=loadQuickPresets();
function saveQuickPresets(){ localStorage.setItem(QUICK_PRESETS_KEY,JSON.stringify(quickPresets)); }
function resolveActionParams(action,preset={}){
  const params={...(preset.params||{})};
  (action.fields||[]).forEach(field=>{
    if(params[field.key]===undefined || params[field.key]===null || params[field.key]==="") params[field.key]=field.getDefault?field.getDefault():"";
  });
  return params;
}
function renderQuickButtons(){
  document.querySelectorAll("[data-quick-slot]").forEach(button=>{
    const [module,slotText]=button.dataset.quickSlot.split(":");
    const preset=quickPresets?.[module]?.[Number(slotText)];
    const action=preset?.actionId?QUICK_ACTIONS[preset.actionId]:null;
    const visible=Boolean(preset?.visible&&action);
    button.hidden=!visible;
    if(!visible){ button.textContent=""; button.removeAttribute("data-action-id"); return; }
    const params=resolveActionParams(action,preset);
    let label=preset.label||action.defaultLabel||action.name;
    if(preset.actionId==="ai.analyze-more" && !preset.label) label=`Analyze +${params.quantity}`;
    button.textContent=label;
    button.dataset.actionId=preset.actionId;
    button.title="Long-press to edit this quick action";
  });
}
function executeQuickSlot(button){
  const [module,slotText]=button.dataset.quickSlot.split(":");
  const preset=quickPresets?.[module]?.[Number(slotText)];
  const action=preset?.actionId?QUICK_ACTIONS[preset.actionId]:null;
  if(!action) return;
  const params=resolveActionParams(action,preset);
  const error=action.validate?.(params);
  if(error){ openQuickAssignment(action,preset,Number(slotText)); return; }
  action.run(params);
}

let quickAssignment=null;
function fieldInputValue(field,root){
  if(field.type==="ai-outputs") return Object.fromEntries([...root.querySelectorAll("[data-assign-ai-output]")].map(input=>[input.dataset.assignAiOutput,input.checked]));
  const input=root.querySelector(`[data-assign-field="${field.key}"]`);
  return field.type==="number"?Math.max(Number(field.min)||0,Number(input?.value)||0):(input?.value||"");
}
function buildQuickFields(action,params){
  const root=document.getElementById("quickAssignFields");
  root.innerHTML="";
  (action.fields||[]).forEach(field=>{
    if(field.type==="ai-outputs"){
      const box=document.createElement("fieldset");
      box.className="quick-output-fields";
      box.innerHTML="<legend>Outputs</legend>";
      const labels={reactions:"Reactions",themes:"Themes",description:"Description",emotion:"Emotion","reaction-reasons":"Reaction reasons","genre-reasons":"Genre reasons"};
      Object.entries(labels).forEach(([key,label])=>{
        const item=document.createElement("label");
        item.innerHTML=`<input type="checkbox" data-assign-ai-output="${key}" ${params[field.key]?.[key]?"checked":""}> ${label}`;
        box.appendChild(item);
      });
      root.appendChild(box);
      return;
    }
    const label=document.createElement("label");
    label.textContent=field.label;
    const input=document.createElement("input");
    input.dataset.assignField=field.key;
    input.type=field.type||"text";
    if(field.min!==undefined) input.min=String(field.min);
    input.value=String(params[field.key]??"");
    label.appendChild(input);
    root.appendChild(label);
  });
}
function collectQuickAssignment(){
  const action=quickAssignment.action;
  const params={};
  (action.fields||[]).forEach(field=>params[field.key]=fieldInputValue(field,document.getElementById("quickAssignFields")));
  return {
    module:action.module,
    slot:Number(document.getElementById("quickAssignSlot").value),
    visible:document.getElementById("quickAssignVisible").checked,
    actionId:quickAssignment.actionId,
    label:document.getElementById("quickAssignLabel").value.trim()||action.defaultLabel||action.name,
    params
  };
}
function showQuickConfigure(){
  document.getElementById("quickAssignConfigure").hidden=false;
  document.getElementById("quickAssignReview").hidden=true;
}
function showQuickReview(){
  const candidate=collectQuickAssignment();
  const error=quickAssignment.action.validate?.(candidate.params);
  if(error){ setPortraitStationStatus(error); return; }
  quickAssignment.candidate=candidate;
  const lines=quickAssignment.action.summarize?.(candidate.params)||[];
  document.getElementById("quickAssignSummary").innerHTML=`
    <dl>
      <div><dt>Module</dt><dd>${candidate.module}</dd></div>
      <div><dt>Slot</dt><dd>Quick ${candidate.slot}</dd></div>
      <div><dt>Label</dt><dd>${candidate.label}</dd></div>
      <div><dt>Visible</dt><dd>${candidate.visible?"Yes":"No"}</dd></div>
      <div><dt>Action</dt><dd>${quickAssignment.action.name}</dd></div>
      ${lines.map(line=>{const [key,...rest]=line.split(":");return `<div><dt>${key}</dt><dd>${rest.join(":").trim()}</dd></div>`;}).join("")}
    </dl>`;
  document.getElementById("quickAssignConfigure").hidden=true;
  document.getElementById("quickAssignReview").hidden=false;
}
function openQuickAssignment(actionOrId,preset={},preferredSlot=1){
  const actionId=typeof actionOrId==="string"?actionOrId:Object.keys(QUICK_ACTIONS).find(key=>QUICK_ACTIONS[key]===actionOrId);
  const action=QUICK_ACTIONS[actionId];
  if(!action) return;
  const params=resolveActionParams(action,preset);
  quickAssignment={actionId,action,candidate:null};
  document.getElementById("quickAssignSlot").value=String(preferredSlot||1);
  document.getElementById("quickAssignLabel").value=preset.label||action.defaultLabel||action.name;
  document.getElementById("quickAssignVisible").checked=preset.visible!==false;
  buildQuickFields(action,params);
  showQuickConfigure();
  document.getElementById("quickAssignDialog")?.showModal();
}
function openModuleQuickManager(module){
  const existing=quickPresets[module]?.[1];
  const actionId=existing?.actionId || Object.keys(QUICK_ACTIONS).find(key=>QUICK_ACTIONS[key].module===module);
  if(actionId) openQuickAssignment(actionId,existing||{},1);
  else setPortraitStationStatus(`No quick actions are available for ${module} yet.`);
}

function bindLongPress(element,onLongPress){
  let timer=null,longPressed=false;
  const start=event=>{
    if(event.button!==undefined&&event.button!==0) return;
    longPressed=false;
    timer=setTimeout(()=>{ longPressed=true; onLongPress(event); },550);
  };
  const cancel=()=>{ if(timer) clearTimeout(timer); timer=null; };
  element.addEventListener("pointerdown",start);
  ["pointerup","pointercancel","pointerleave"].forEach(type=>element.addEventListener(type,cancel));
  element.addEventListener("click",event=>{
    if(longPressed){ event.preventDefault(); event.stopImmediatePropagation(); longPressed=false; }
  },true);
}

syncPortraitDefaultAmount();
syncPortraitAiOutputs();
window.genreactrixAiQueueEngine.maintainBuffer();
renderQuickButtons();

document.querySelectorAll("[data-quick-slot]").forEach(button=>{
  button.addEventListener("click",()=>executeQuickSlot(button));
  bindLongPress(button,()=>{
    const [module,slotText]=button.dataset.quickSlot.split(":");
    const preset=quickPresets[module][Number(slotText)];
    if(preset?.actionId) openQuickAssignment(preset.actionId,preset,Number(slotText));
  });
});
document.querySelectorAll("[data-module-button]").forEach(button=>{
  const module=button.dataset.moduleButton;
  button.addEventListener("click",()=>{
    if(module==="images") openImageIntakeDialog();
    else if(module==="ai") window.genreactrixAiAnalysisEngine?.openConsole?.();
    else if(module==="batch") window.genreactrixBatchEngine?.openConsole?.();
    else if(module==="reports") window.genreactrixReportsEngine?.openConsole?.();
    else if(module==="queue") window.genreactrixAiAnalysisEngine?.openConsole?.();
    else setPortraitStationStatus(`Open the full ${button.textContent.trim()} console.`);
  });
  bindLongPress(button,()=>openModuleQuickManager(module));
});
document.getElementById("portraitMailboxBtn")?.addEventListener("click",()=>setPortraitStationStatus("Open notifications."));
document.getElementById("portraitSettingsBtn")?.addEventListener("click",()=>{
  const dialog=document.getElementById("portraitSettingsDialog");
  if(dialog){
    document.getElementById("recycleRetentionDays").value=String(Math.max(0,Number(localStorage.getItem(RECYCLE_RETENTION_KEY))||30));
    dialog.showModal();
  }
});
document.getElementById("portraitSettingsClose")?.addEventListener("click",()=>document.getElementById("portraitSettingsDialog")?.close());
document.getElementById("recycleRetentionDays")?.addEventListener("change",event=>{
  const days=Math.max(0,Math.floor(Number(event.target.value)||30));event.target.value=String(days);localStorage.setItem(RECYCLE_RETENTION_KEY,String(days));setPortraitStationStatus(`Recycle retention set to ${days} days.`);
});
document.getElementById("recycleEmptyNow")?.addEventListener("click",async()=>{
  const result=await window.genreactrixImagesEngine.purgeRecycle({all:true});renderPortraitStation();setPortraitStationStatus(`Recycle bin purged ${result.purged} image(s).`);
});
document.getElementById("recycleEmptyBefore")?.addEventListener("click",async()=>{
  const date=document.getElementById("recycleBeforeDate")?.value;if(!date){setPortraitStationStatus("Choose a recycle cutoff date.");return;}
  const result=await window.genreactrixImagesEngine.purgeRecycle({before:new Date(`${date}T23:59:59`).toISOString()});renderPortraitStation();setPortraitStationStatus(`Purged ${result.purged} image(s) deleted before ${date}.`);
});
document.getElementById("recycleFreeMb")?.addEventListener("click",async()=>{
  const mb=Math.max(1,Number(document.getElementById("recycleFreeMbAmount")?.value)||100);const result=await window.genreactrixImagesEngine.purgeRecycle({freeBytes:mb*1024*1024});renderPortraitStation();setPortraitStationStatus(`Purged ${result.purged} oldest image(s), freeing ${(result.freed/1024/1024).toFixed(1)} MB.`);
});
document.getElementById("runImageIntegrityCheck")?.addEventListener("click",async()=>{
  const result=await window.genreactrixImagesEngine.verifyStorage();setPortraitStationStatus(`Integrity check: ${result.issueCount} issue(s) across ${result.recordCount} records.`);
});
document.querySelectorAll("[data-portrait-status]").forEach(button=>button.addEventListener("click",()=>setPortraitStationStatus(`Open ${button.dataset.portraitStatus.replaceAll("-"," ")}.`)));

document.querySelectorAll("[data-quick-dialog='cancel']").forEach(button=>button.addEventListener("click",()=>document.getElementById("quickAssignDialog")?.close()));
document.querySelector("[data-quick-dialog='review']")?.addEventListener("click",showQuickReview);
document.querySelector("[data-quick-dialog='edit']")?.addEventListener("click",showQuickConfigure);
document.querySelector("[data-quick-dialog='save']")?.addEventListener("click",()=>{
  const candidate=quickAssignment?.candidate;
  if(!candidate) return;
  quickPresets[candidate.module][candidate.slot]={visible:candidate.visible,actionId:candidate.actionId,label:candidate.label,params:candidate.params};
  saveQuickPresets();
  renderQuickButtons();
  document.getElementById("quickAssignDialog")?.close();
  setPortraitStationStatus(`${candidate.label} assigned to ${candidate.module} Quick ${candidate.slot}.`);
});


function parseImageIntakeUrls(){ return document.getElementById("imageUrlList")?.value || ""; }
function openImageIntakeDialog({quantity=null}={}){
  const amount=Math.max(1,Number(quantity)||portraitDefaultAmount());
  if($("imageUrlQuantity")) $("imageUrlQuantity").value=String(amount);
  if($("imageIntakePreview")) $("imageIntakePreview").textContent="";
  $("imageIntakeDialog")?.showModal();
}
$("imageIntakeClose")?.addEventListener("click",()=>$("imageIntakeDialog")?.close());
$("imageIntakeFolderBtn")?.addEventListener("click",()=>{
  pendingPortraitImportLimit=Math.max(1,Number($("imageUrlQuantity")?.value)||portraitDefaultAmount());
  $("imageIntakeDialog")?.close();
  $("folderInput")?.click();
});
$("imageUrlPreviewBtn")?.addEventListener("click",async()=>{
  const quantity=Math.max(1,Number($("imageUrlQuantity")?.value)||portraitDefaultAmount());
  const sources=await window.genreactrixImagesEngine.prefetchUrls(parseImageIntakeUrls(),{limit:quantity});
  const mode=$("imageUrlMode")?.value||"link";
  $("imageIntakePreview").textContent=sources.length?`${sources.length} valid URL${sources.length===1?"":"s"} · ${mode==="download"?"working copies":"hyperlinks"}`:"No valid HTTP/HTTPS URLs found.";
});
$("imageUrlAddBtn")?.addEventListener("click",async()=>{
  const quantity=Math.max(1,Number($("imageUrlQuantity")?.value)||portraitDefaultAmount());
  const mode=$("imageUrlMode")?.value||"link";
  const prefetch=Boolean($("imageUrlPrefetch")?.checked);
  const button=$("imageUrlAddBtn"); button.disabled=true;
  try{
    const batchId=await window.genreactrixBatchEngine?.activeId?.()||"current-import";
    const records=await window.genreactrixImagesEngine.importUrls(parseImageIntakeUrls(),{limit:quantity,mode,prefetch,batchId});
    if(window.genreactrixBatchEngine?.addImages) await window.genreactrixBatchEngine.addImages(batchId,records.map(r=>r.id));
    const files=await window.genreactrixImagesEngine.workingFiles(records.map(record=>record.id));
    await applyEngineWorkingFiles(files);
    const failures=records.filter(record=>record.error).length;
    $("imageIntakeDialog")?.close();
    setPortraitStationStatus(`${records.length} URL image${records.length===1?"":"s"} added${failures?` · ${failures} download fallback${failures===1?"":"s"}`:""}.`);
  }catch(error){ $("imageIntakePreview").textContent=`Add failed: ${error.message||error}`; }
  finally{ button.disabled=false; renderPortraitControlStation(); }
});

renderPortraitControlStation();
