const GENREACTRIX_BUILD="v0.9.3.13";
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
const currentKey = () => state.files.length ? state.files[state.index].name : `demo-${state.demoIndex}`;
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
  return writeClassificationForKey(currentKey(),classificationState());
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
  const singleGrid=targetId==="tabletPrimFusionMatrix" || landscapeSingleGrid;
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
  // v0.9.3.13: fitting is intentionally disabled. PrimFusion labels use one
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
  return window.innerWidth>=600 && window.innerWidth<=1199 && window.innerHeight>=600;
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
$("directorFlagBtn").addEventListener("click",()=>{
  pushHistory(); state.flagged=!state.flagged; saveCurrent(); renderFlag(); renderComparison();
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
  persistRecords(); renderAll();
});

$("folderInput").addEventListener("change",e=>{
  state.objectUrls.forEach(URL.revokeObjectURL);
  state.objectUrls=[];
  state.files=[...e.target.files].filter(f=>f.type.startsWith("image/")).map(file=>{
    const url=URL.createObjectURL(file); state.objectUrls.push(url); return {name:file.name,url};
  });
  // Randomize once, then resume in this random queue.
  for(let i=state.files.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[state.files[i],state.files[j]]=[state.files[j],state.files[i]];}
  state.index=0; loadCurrent();
});




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
function isTabletMode(){return matchMedia("(min-width: 600px) and (min-height: 600px)").matches;}
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
  // v0.9.3.13 preserves the verified v0.9.2j storage namespace and clean classification namespace.
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
