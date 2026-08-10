const GENREACTRIX_BUILD="v0.9.39.44";
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
  {id:"P07",name:"Ticket",symbol:"🎟️"},
  {id:"P08",name:"Dreamy",symbol:"🌌"},
  {id:"P09",name:"Zazzly",symbol:"🌶️"},
  {id:"P10",name:"Disgusting",symbol:"🤢"},
  {id:"P11",name:"Scary",symbol:"👻"},
  {id:"P12",name:"Smart",symbol:"🧠"},
  {id:"P13",name:"Celebration",symbol:"🎉"},
  {id:"P14",name:"Angry",symbol:"🤬"}
];
const PRIMITIVE_BY_ID = Object.fromEntries(PRIMITIVES.map(p=>[p.id,p]));
const PRIMITIVE_BY_NAME = Object.fromEntries(PRIMITIVES.map(p=>[p.name,p]));

const CUSTOM_REACTION_LIBRARY_KEY="genreactrix-custom-reactions-v1";
const CUSTOM_THEME_LIBRARY_KEY="genreactrix-custom-themes-v2";
const CUSTOM_THEME_LEGACY_KEYS=["genreactrix-v0.9.1-writeins","genreactrix-v0.8.0-writeins","genreactrix-v0.7.0-writeins"];
const slugifyCustom=value=>String(value||"").trim().toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||`item-${Date.now()}`;
function readJsonArray(key){try{const value=JSON.parse(localStorage.getItem(key)||"[]");return Array.isArray(value)?value:[]}catch{return []}}
function writeJsonArray(key,value){localStorage.setItem(key,JSON.stringify(Array.isArray(value)?value:[]));}
function dedupeReactionRefs(refs){const seen=new Set();return (Array.isArray(refs)?refs:[]).filter(ref=>{if(!ref?.id)return false;const key=`${ref.type||"canonical"}:${ref.id}`;if(seen.has(key))return false;seen.add(key);return true;}).map(ref=>({type:ref.type==="custom"?"custom":"canonical",id:String(ref.id)}));}
function normalizedReactionRefs(theme){if(!theme)return[];if(Array.isArray(theme.reactionRefs))return dedupeReactionRefs(theme.reactionRefs);if(Array.isArray(theme.primitiveIds))return dedupeReactionRefs(theme.primitiveIds.map(id=>({type:"canonical",id})));if(theme.primitiveId)return[{type:"canonical",id:theme.primitiveId}];return[];}
function reactionRefKey(ref){if(!ref?.id)return"";return`${ref.type==="custom"?"custom":"canonical"}:${String(ref.id)}`;}
function normalizeCustomReaction(value){if(!value)return null;const label=String(value.label||value.name||"").trim();const emoji=String(value.emoji||value.symbol||"").trim();if(!label||!emoji)return null;return{id:String(value.id||`custom-reaction:${slugifyCustom(label)}`),label,emoji,kind:"customReaction",createdAt:value.createdAt||new Date().toISOString(),updatedAt:value.updatedAt||new Date().toISOString()};}
function normalizeCustomThemeRecord(value){if(!value)return null;if(typeof value==="string")value={label:value};const label=String(value.label||value.name||"").trim();if(!label)return null;return{id:String(value.id||`custom-theme:${slugifyCustom(label)}`),label,kind:"customTheme",reactionRefs:normalizedReactionRefs(value),createdAt:value.createdAt||new Date().toISOString(),updatedAt:value.updatedAt||new Date().toISOString()};}
function loadCustomReactions(){return readJsonArray(CUSTOM_REACTION_LIBRARY_KEY).map(normalizeCustomReaction).filter(Boolean);}
function saveCustomReactions(records){const normalized=records.map(normalizeCustomReaction).filter(Boolean);writeJsonArray(CUSTOM_REACTION_LIBRARY_KEY,normalized);state.customReactions=normalized;return normalized;}
function loadCustomThemes(){let records=readJsonArray(CUSTOM_THEME_LIBRARY_KEY).map(normalizeCustomThemeRecord).filter(Boolean);if(!records.length){let legacy=[];for(const key of CUSTOM_THEME_LEGACY_KEYS){legacy=readJsonArray(key);if(legacy.length)break;}records=legacy.map(normalizeCustomThemeRecord).filter(Boolean);if(records.length)writeJsonArray(CUSTOM_THEME_LIBRARY_KEY,records);}return records;}
function saveCustomThemes(records){const normalized=records.map(normalizeCustomThemeRecord).filter(Boolean);writeJsonArray(CUSTOM_THEME_LIBRARY_KEY,normalized);state.customThemes=normalized;state.writeIns=normalized.map(item=>item.label);return normalized;}
function allReactionRecords(){return[...PRIMITIVES.map(p=>({id:p.id,label:p.name,emoji:p.symbol,kind:"canonicalReaction",type:"canonical"})),...(state.customReactions||[]).map(r=>({...r,type:"custom"}))];}
function reactionRecordFromRef(ref){if(!ref)return null;if(ref.type==="custom")return(state.customReactions||[]).find(r=>r.id===ref.id)||{id:ref.id,label:"Missing custom reaction",emoji:"?",kind:"missingReaction",type:"custom"};const p=PRIMITIVE_BY_ID[ref.id];return p?{id:p.id,label:p.name,emoji:p.symbol,kind:"canonicalReaction",type:"canonical"}:null;}
function customReactionSelectionToken(id){return`custom:${id}`;}

const primitivePairId=(a,b)=>[a,b].sort().join("|");
const primFusionCellId=(a,b)=>`CELL:${primitivePairId(a,b)}`;



const CANONICAL_PRIMFUSION_LABELS = {
  "Beautiful|Beautiful": "Beautiful",
  "Adorable|Beautiful": "Cozy",
  "Beautiful|Tragic": "Melancholic",
  "Beautiful|Funny": "Charming",
  "Beautiful|Intense": "Majestic",
  "Beautiful|Weird": "Surreal",
  "Beautiful|Ticket": "Irreverent",
  "Beautiful|Dreamy": "Romance",
  "Beautiful|Zazzly": "Horny",
  "Beautiful|Disgusting": "Grotesque",
  "Beautiful|Scary": "Vulnerable",
  "Beautiful|Smart": "Elegant",
  "Beautiful|Celebration": "Festive",
  "Angry|Beautiful": "Pretentious",
  "Adorable|Adorable": "Adorable",
  "Adorable|Tragic": "Pitiful",
  "Adorable|Funny": "Goofy",
  "Adorable|Intense": "Joy",
  "Adorable|Weird": "Bizarre",
  "Adorable|Ticket": "Camp",
  "Adorable|Dreamy": "Whimsical",
  "Adorable|Zazzly": "Kawaii",
  "Adorable|Disgusting": "Grimy",
  "Adorable|Scary": "CreepyCute",
  "Adorable|Smart": "Innocence",
  "Adorable|Celebration": "Playful",
  "Adorable|Angry": "Saccharine",
  "Tragic|Tragic": "Tragic",
  "Funny|Tragic": "Ironic",
  "Intense|Tragic": "Devastating",
  "Tragic|Weird": "Nightmarish",
  "Ticket|Tragic": "Dark",
  "Dreamy|Tragic": "Liminal",
  "Tragic|Zazzly": "Rejected",
  "Disgusting|Tragic": "Despair",
  "Scary|Tragic": "Foreboding",
  "Smart|Tragic": "Poignant",
  "Celebration|Tragic": "Bittersweet",
  "Angry|Tragic": "Dysphoria",
  "Funny|Funny": "Funny",
  "Funny|Intense": "Cringe",
  "Funny|Weird": "Zany",
  "Funny|Ticket": "Satirical",
  "Dreamy|Funny": "Absurd",
  "Funny|Zazzly": "Ribaldry",
  "Disgusting|Funny": "Grossout",
  "Funny|Scary": "Comedy Horror",
  "Funny|Smart": "Witty",
  "Celebration|Funny": "PartyTime",
  "Angry|Funny": "Trolling",
  "Intense|Intense": "Intense",
  "Intense|Weird": "Chaotic",
  "Intense|Ticket": "Outrageous",
  "Dreamy|Intense": "Epic",
  "Intense|Zazzly": "Lust",
  "Disgusting|Intense": "Brutal",
  "Intense|Scary": "Terror",
  "Intense|Smart": "Brilliant",
  "Celebration|Intense": "Pride",
  "Angry|Intense": "Aggressive",
  "Weird|Weird": "Weird",
  "Ticket|Weird": "Freakshow",
  "Dreamy|Weird": "Psychedelic",
  "Weird|Zazzly": "FreakyDeaky",
  "Disgusting|Weird": "Mutant",
  "Scary|Weird": "Macabre",
  "Smart|Weird": "Alien",
  "Celebration|Weird": "Delirious",
  "Angry|Weird": "Monstrous",
  "Ticket|Ticket": "Ticket",
  "Dreamy|Ticket": "Medicated",
  "Ticket|Zazzly": "Exploitation",
  "Disgusting|Ticket": "Tasteless",
  "Scary|Ticket": "Execrable",
  "Smart|Ticket": "Parodic",
  "Celebration|Ticket": "Snarky",
  "Angry|Ticket": "Wickedness",
  "Dreamy|Dreamy": "Dreamy",
  "Dreamy|Zazzly": "Limerence",
  "Disgusting|Dreamy": "Putrid",
  "Dreamy|Scary": "Eerie",
  "Dreamy|Smart": "Ethereal",
  "Celebration|Dreamy": "Magical",
  "Angry|Dreamy": "Phantasmagoric",
  "Zazzly|Zazzly": "Zazzly",
  "Disgusting|Zazzly": "Lewd",
  "Scary|Zazzly": "Seduction",
  "Smart|Zazzly": "Kinky",
  "Celebration|Zazzly": "Hedonism",
  "Angry|Zazzly": "Sadomasochism",
  "Disgusting|Disgusting": "Disgusting",
  "Disgusting|Scary": "Horror",
  "Disgusting|Smart": "Greed",
  "Celebration|Disgusting": "Indulgent",
  "Angry|Disgusting": "Repulsive",
  "Scary|Scary": "Scary",
  "Scary|Smart": "Paranoia",
  "Celebration|Scary": "Spirituality",
  "Angry|Scary": "Violated",
  "Smart|Smart": "Smart",
  "Celebration|Smart": "Glory",
  "Angry|Smart": "Obsessive",
  "Celebration|Celebration": "Celebration",
  "Angry|Celebration": "Revenge",
  "Angry|Angry": "Angry"
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
    aiWeights:{P01:79,P02:72,P03:4,P04:18,P05:12,P06:42,P07:0,P08:88,P09:5,P10:0,P11:8,P12:34,P13:21,P14:0}
  },
  {
    src: svgData("MUTOSIS","🐙","🫖"),
    description:"An octopus–teapot hybrid with domestic and aquatic visual cues. The humor comes from treating an object as a living creature.",
    aiThemes:[["Aquatic",93],["Comedy",77],["Domestic",65]],
    aiWeights:{P01:18,P02:12,P03:2,P04:91,P05:20,P06:85,P07:4,P08:27,P09:9,P10:5,P11:15,P12:72,P13:33,P14:0}
  },
  {
    src: svgData("MUTOSIS","🐈","🌙"),
    description:"A cat merged with a crescent moon. The image reads as nocturnal fantasy with celestial and magical themes.",
    aiThemes:[["Celestial",94],["Magic",89],["Fantasy",86]],
    aiWeights:{P01:88,P02:64,P03:3,P04:9,P05:17,P06:39,P07:0,P08:92,P09:4,P10:0,P11:31,P12:44,P13:16,P14:0}
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
  writeIns: [],
  customThemes: [],
  customReactions: [],
  objectUrls: [],
  visitBaseline: null,
  aiRuns: {}
};

const $ = id => document.getElementById(id);
const $$ = selector => document.querySelectorAll(selector);
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
function saveCurrent(action="commit"){
  const imageId=currentKey();
  const legacy=classificationState();
  const engine=window.genreactrixDirectorClassificationEngine;
  if(engine){
    engine.begin(imageId,legacy);
    engine.patchDraft(imageId,{reactions:legacy.selectedReactions,themes:legacy.themes,notes:legacy.writeIn,flagged:legacy.flagged,retention:legacy.retention,aiVisible:Boolean(document.getElementById("directorAiConsole")?.open)});
    const result=engine.commit(imageId,{action,aiVisible:Boolean(document.getElementById("directorAiConsole")?.open)});
    if(!result.ok){setDirectorStatus(`Classification not saved: ${result.issues.join(", ")}`);return false;}
  }
  legacy.evaluationVersion=currentEvaluationVersion();
  const saved=writeClassificationForKey(imageId,legacy);
  if(saved){
    localStorage.setItem(EVALUATION_USED_KEY,"1");
    syncDirectorRecordHistory("director-classified");
    lockBatchEvaluationVersion().catch(console.warn);
  }
  return saved;
}
function syncDirectorRecordHistory(eventType="director-classified"){
  const imageId=currentKey();
  const recordEngine=window.genreactrixImageRecordEngine;
  if(!recordEngine?.get||!recordEngine.get(imageId,{touch:false})) return;
  const data={...classificationState(),evaluationVersion:currentEvaluationVersion(),aiVisible:Boolean(document.getElementById("directorAiConsole")?.open),recordedAt:new Date().toISOString()};
  try{recordEngine.update(imageId,{analysis:{director:data},components:{directorReactions:"current",directorThemes:"current",primFusion:state.selectedReactions.length>=2?"current":"missing"},attributes:{flagged:Boolean(state.flagged),needsReview:Boolean(state.flagged)},timestamps:{flaggedAt:state.flagged?new Date().toISOString():null}},eventType);}catch(error){console.warn("Director record could not be synchronized",error);}
}
function emptyClassification(){
  return {selectedReactions:[],themes:[null,null,null],flagged:false,writeIn:"",retention:"keep"};
}
function loadCurrent(){
  const key=currentKey();
  const legacy=readClassificationForKey(key);
  const engine=window.genreactrixDirectorClassificationEngine;
  const canonical=engine?.migrate?.(key,legacy)||null;
  applyClassification(canonical?{selectedReactions:canonical.reactions,themes:canonical.themes,flagged:canonical.flagged,writeIn:canonical.notes,retention:canonical.retention}:legacy);
  engine?.begin?.(key,canonical||legacy);
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
  saveImageTransformForCurrent?.();
  if(state.files.length){
    state.index=(state.index+delta+state.files.length)%state.files.length;
  }else{
    state.demoIndex=(state.demoIndex+delta+DEMOS.length)%DEMOS.length;
  }
  loadCurrent();
}
function nextImage(){ navigateImage(1); }
function prevImage(){ navigateImage(-1); }
const DIRECTOR_LAST_KEY="genreactrix-director-last-image-v1";
function directorSetting(id,fallback){try{return window.genreactrixSettingsEngine?.get?.(id,fallback)??fallback}catch{return fallback}}
function imageCount(){return state.files.length||DEMOS.length}
function imageKeyAt(index){return state.files.length?(state.files[index]?.id||state.files[index]?.name):`demo-${index}`}
function goToImageIndex(index,{remember=true}={}){
  const count=imageCount();if(!count)return false;
  if(remember)localStorage.setItem(DIRECTOR_LAST_KEY,JSON.stringify({source:state.files.length?"files":"demo",index:state.files.length?state.index:state.demoIndex,key:currentKey()}));
  saveImageTransformForCurrent?.();
  const next=((index%count)+count)%count;
  if(state.files.length)state.index=next;else state.demoIndex=next;
  loadCurrent();return true;
}
function directorRecordForIndex(index){const key=imageKeyAt(index);return window.genreactrixDirectorClassificationEngine?.get?.(key)||null}
function findDirectorIndex(predicate,{random=false}={}){
  const count=imageCount(),current=state.files.length?state.index:state.demoIndex;if(!count)return -1;
  const matches=[];
  for(let step=1;step<=count;step++){const idx=(current+step)%count,record=directorRecordForIndex(idx);if(predicate(record,imageKeyAt(idx),idx))matches.push(idx);}
  if(!matches.length)return -1;return random?matches[Math.floor(Math.random()*matches.length)]:matches[0];
}
function navigateDirectorMode(mode){
  let idx=-1;
  if(mode==="next")return goToImageIndex((state.files.length?state.index:state.demoIndex)+1);
  if(mode==="random")idx=findDirectorIndex(()=>true,{random:true});
  else if(mode==="next-incomplete")idx=findDirectorIndex(r=>!r||!["complete"].includes(r.completion));
  else if(mode==="next-flagged")idx=findDirectorIndex(r=>Boolean(r?.flagged));
  else if(mode==="next-blocked")idx=findDirectorIndex(r=>r?.completion==="blocked"||Boolean(r?.blocked));
  if(idx<0){setDirectorStatus(`No ${mode.replace("next-","")} image found.`);return false;}
  return goToImageIndex(idx);
}
function commitDirectorAndFollowSetting(){
  const ok=saveCurrent("director-commit");if(!ok)return false;
  setDirectorStatus("Classification committed.");
  const behavior=directorSetting("director.postCommit","stay");
  if(behavior==="next")navigateDirectorMode("next");
  if(behavior==="next-incomplete")navigateDirectorMode("next-incomplete");
  return true;
}
function returnToLastDirectorImage(){
  try{const last=JSON.parse(localStorage.getItem(DIRECTOR_LAST_KEY)||"null");if(!last)return setDirectorStatus("No previous image recorded.");return goToImageIndex(Number(last.index)||0,{remember:false});}catch{return false;}
}
function normalizeTheme(value){
  if(!value) return null;
  if(typeof value==="object" && value.id) return {...value,reactionRefs:normalizedReactionRefs(value)};
  return {id:`legacy:${String(value).toLowerCase()}`,label:String(value),kind:"legacy"};
}
function normalizeThemes(values){ return [0,1,2].map(i=>normalizeTheme(values?.[i])); }
function themeLabel(theme){ return normalizeTheme(theme)?.label || "—"; }
function renderReactions(){
  const bar=$("reactionBar");
  const expanded=$("directorReactionGrid");
  if(!bar||!expanded)return;
  bar.innerHTML="";expanded.innerHTML="";
  const records=allReactionRecords();
  records.forEach((record,index)=>{
    const canonical=record.type==="canonical";
    const token=canonical?PRIMITIVES.findIndex(p=>p.id===record.id):customReactionSelectionToken(record.id);
    const make=()=>{
      const b=document.createElement("button");
      b.className="reaction-button"+(state.selectedReactions.includes(token)?" selected":"")+(canonical?"":" custom-reaction-button");
      b.innerHTML=`<span class="reaction-symbol" aria-hidden="true">${record.emoji}</span>`;
      b.setAttribute("aria-label",record.label);b.title=record.label;b.setAttribute("aria-pressed",String(state.selectedReactions.includes(token)));
      if(!canonical)b.dataset.customReaction=record.id;
      b.addEventListener("click",()=>{pushHistory();const n=state.selectedReactions.indexOf(token);if(n>=0)state.selectedReactions.splice(n,1);else state.selectedReactions.push(token);saveCurrent("director-reaction-auto");renderAll();});
      return b;
    };
    bar.appendChild(make());expanded.appendChild(make());
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
  if(typeof restoreImageTransformForCurrent==="function") restoreImageTransformForCurrent();
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
  $("directorFlagBtn")?.setAttribute("aria-pressed",String(state.flagged));
  $("tabletFlagBtn")?.setAttribute("aria-pressed",String(state.flagged));
  $("landscapeImageViewFlagBtn")?.setAttribute("aria-pressed",String(state.flagged));
  $("landscapeImageViewSaveBtn")?.setAttribute("aria-pressed",String(state.retention==="keep"));
}
function renderDirectorFields(){
  $("directorWriteIn").value=state.writeIn;
  $("retentionControl").value=state.retention;
}
function renderDirectorWorkspaceState(){
  const engine=window.genreactrixDirectorClassificationEngine;
  const imageId=currentKey();
  const canonical=engine?.get?.(imageId)||null;
  const completion=canonical?.completion||engine?.completion?.({reactions:state.selectedReactions,themes:state.themes,primFusion:state.selectedReactions.length>=2?state.selectedReactions.slice(0,2):null})||"unclassified";
  const labels={unclassified:"Unclassified",partial:"Partial",complete:"Complete",blocked:"Blocked"};
  [$("directorStateStrip"),$("directorWorkspaceStateStrip")].filter(Boolean).forEach(strip=>{
    const completionEl=strip.querySelector('[data-state="completion"]');
    if(completionEl){completionEl.textContent=labels[completion]||completion;completionEl.dataset.tone=completion;}
    const set=(name,show)=>{const el=strip.querySelector(`[data-state="${name}"]`);if(el)el.hidden=!show;};
    set("draft",Boolean(engine?.isDirty?.(imageId)));
    set("saved",Boolean(canonical?.saved));
    set("flagged",Boolean(state.flagged||canonical?.flagged));
    set("ai",Boolean(canonical?.aiVisible||document.getElementById("directorAiConsole")?.open));
    set("ready",completion==="complete"&&!canonical?.blocked);
    set("blocked",completion==="blocked"||Boolean(canonical?.blocked));
    set("locked",Boolean(canonical?.locked));
  });
  const revert=$("directorRevertDraftBtn");
  if(revert) revert.disabled=!engine?.isDirty?.(imageId);
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


const tabletLandscapeView={face:"matrix",aiReactions:false,aiThemes:false,aiDescription:false,customs:false,activeThemeSlot:null,customsTab:"search"};
const landscapeCustomSort={
  reactions:{mode:"alpha",direction:"asc"},
  themes:{mode:"alpha",direction:"asc"}
};
const landscapeCustomScroll={reactions:0,themes:0,search:0};
const AI_RERUN_LOCK_KEY="genreactrix-ai-rerun-lock-v1";
let tabletAiRerunLocked=localStorage.getItem(AI_RERUN_LOCK_KEY)!=="0";
function syncTabletAiRerunControls(){
  const lock=$("tabletAiRerunLockBtn");
  lock?.setAttribute("aria-pressed",String(tabletAiRerunLocked));
  ["tabletAiRerunReactionsBtn","tabletAiRerunThemesBtn","tabletAiRerunDescriptionBtn"].forEach(id=>{const b=$(id);if(b)b.disabled=tabletAiRerunLocked;});
}

function renderLandscapeInterlockedMatrix(targetId="tabletWorkbenchMatrix"){
  const root=$(targetId);
  if(!root) return;
  root.innerHTML="";

  // Exact source of truth: PrimFusion_Interlocked_Matrix_Compact_Screenshot_Match.xlsm, B2:H14.
  const topSymbols=["🧸", "✨", "🤣", "😭", "🌶️", "🎉", "🧠"];
  const bottomSymbols=["🌀", "🎟️", "🌌", "🤢", "👻", "💥", "🧠"];
  const leftSymbols=["🤬", "💥", "👻", "🤢", "🌌", "🎟️", "🌀", "🧸", "🌀", "🎟️", "🌌", "🤢", "👻", "💥", "🤬"];
  const rightSymbols=["🤬", "💥", "👻", "🤢", "🌌", "🎟️", "🌀", "🧸", "✨", "🤣", "😭", "🌶️", "🎉", "🧠", "🤬"];
  const matrixRows=[[{"value":"Saccharine","tone":"lavender"},{"value":"Pretentious","tone":"lavender"},{"value":"Trolling","tone":"lavender"},{"value":"Dysphoria","tone":"lavender"},{"value":"Sadomasochism","tone":"lavender"},{"value":"Revenge","tone":"lavender"},{"value":"Obsessive","tone":"lavender"}],[{"value":"Joy","tone":"lavender"},{"value":"Majestic","tone":"lavender"},{"value":"Cringe","tone":"lavender"},{"value":"Devastating","tone":"lavender"},{"value":"Lust","tone":"lavender"},{"value":"Pride","tone":"lavender"},{"value":"Brilliant","tone":"lavender"}],[{"value":"CreepyCute","tone":"lavender"},{"value":"Vulnerable","tone":"lavender"},{"value":"Comedy Horror","tone":"lavender"},{"value":"Foreboding","tone":"lavender"},{"value":"Seduction","tone":"lavender"},{"value":"Spirituality","tone":"lavender"},{"value":"Paranoia","tone":"lavender"}],[{"value":"Grimy","tone":"lavender"},{"value":"Grotesque","tone":"lavender"},{"value":"Grossout","tone":"lavender"},{"value":"Despair","tone":"lavender"},{"value":"Lewd","tone":"lavender"},{"value":"Indulgent","tone":"lavender"},{"value":"Greed","tone":"lavender"}],[{"value":"Whimsical","tone":"lavender"},{"value":"Romance","tone":"lavender"},{"value":"Absurd","tone":"lavender"},{"value":"Liminal","tone":"lavender"},{"value":"Limerence","tone":"lavender"},{"value":"Magical","tone":"lavender"},{"value":"Ethereal","tone":"lavender"}],[{"value":"Camp","tone":"lavender"},{"value":"Irreverent","tone":"lavender"},{"value":"Satirical","tone":"lavender"},{"value":"Dark","tone":"lavender"},{"value":"Exploitation","tone":"lavender"},{"value":"Snarky","tone":"lavender"},{"value":"Parodic","tone":"lavender"}],[{"value":"Bizarre","tone":"lavender"},{"value":"Surreal","tone":"lavender"},{"value":"Zany","tone":"lavender"},{"value":"Nightmarish","tone":"lavender"},{"value":"FreakyDeaky","tone":"lavender"},{"value":"Delirious","tone":"lavender"},{"value":"Alien","tone":"lavender"}],[{"value":"🧸","tone":"green"},{"value":"Cozy","tone":"lavender"},{"value":"Goofy","tone":"lavender"},{"value":"Pitiful","tone":"lavender"},{"value":"Kawaii","tone":"lavender"},{"value":"Playful","tone":"lavender"},{"value":"Innocence","tone":"lavender"}],[{"value":"🌀","tone":"green"},{"value":"✨","tone":"green"},{"value":"Charming","tone":"lavender"},{"value":"Melancholic","tone":"lavender"},{"value":"Horny","tone":"lavender"},{"value":"Festive","tone":"lavender"},{"value":"Elegant","tone":"lavender"}],[{"value":"Freakshow","tone":"peach"},{"value":"🎟️","tone":"green"},{"value":"🤣","tone":"green"},{"value":"Ironic","tone":"lavender"},{"value":"Ribaldry","tone":"lavender"},{"value":"PartyTime","tone":"lavender"},{"value":"Witty","tone":"lavender"}],[{"value":"Psychedelic","tone":"peach"},{"value":"Medicated","tone":"peach"},{"value":"🌌","tone":"green"},{"value":"😭","tone":"green"},{"value":"Rejected","tone":"lavender"},{"value":"Bittersweet","tone":"lavender"},{"value":"Poignant","tone":"lavender"}],[{"value":"Mutant","tone":"peach"},{"value":"Tasteless","tone":"peach"},{"value":"Putrid","tone":"peach"},{"value":"🤢","tone":"green"},{"value":"🌶️","tone":"green"},{"value":"Hedonism","tone":"lavender"},{"value":"Kinky","tone":"lavender"}],[{"value":"Macabre","tone":"peach"},{"value":"Execrable","tone":"peach"},{"value":"Eerie","tone":"peach"},{"value":"Horror","tone":"peach"},{"value":"👻","tone":"green"},{"value":"🎉","tone":"green"},{"value":"Glory","tone":"lavender"}],[{"value":"Chaotic","tone":"peach"},{"value":"Outrageous","tone":"peach"},{"value":"Epic","tone":"peach"},{"value":"Brutal","tone":"peach"},{"value":"Terror","tone":"peach"},{"value":"💥","tone":"green"},{"value":"🧠","tone":"green"}],[{"value":"Monstrous","tone":"peach"},{"value":"Wickedness","tone":"peach"},{"value":"Phantasmagoric","tone":"peach"},{"value":"Repulsive","tone":"peach"},{"value":"Violated","tone":"peach"},{"value":"Aggressive","tone":"peach"},{"value":"🤬","tone":"green"}]];

  const primitiveForSymbol=symbol=>PRIMITIVES.find(p=>p.symbol===symbol);
  const pairForLabel=(label)=>{
    const match=Object.entries(CANONICAL_PRIMFUSION_LABELS).find(([,value])=>value===label);
    return match ? match[0].split("|") : null;
  };
  const choosePrimitive=primitive=>{
    if(!primitive || tabletLandscapeView.activeThemeSlot===null) return;
    state.targetSlot=tabletLandscapeView.activeThemeSlot;
    selectTheme({id:`primitive:${primitive.id}`,label:primitive.name,kind:"primitive",primitiveId:primitive.id});
  };
  const appendAxisButton=(holder,symbol)=>{
    const primitive=primitiveForSymbol(symbol);
    const button=document.createElement("button");
    button.type="button";
    button.title=primitive?`Select ${primitive.name}`:symbol;
    button.textContent=symbol;
    button.addEventListener("click",()=>choosePrimitive(primitive));
    holder.appendChild(button);
  };

  const shell=document.createElement("div");
  shell.className="interlocked-matrix-shell";
  const top=document.createElement("div");
  top.className="interlocked-axis interlocked-axis-top";
  topSymbols.forEach(symbol=>appendAxisButton(top,symbol));
  shell.appendChild(top);

  const body=document.createElement("div");
  body.className="interlocked-matrix-body";
  const left=document.createElement("div");
  left.className="interlocked-axis interlocked-axis-left";
  const grid=document.createElement("div");
  grid.className="interlocked-matrix-grid";
  const right=document.createElement("div");
  right.className="interlocked-axis interlocked-axis-right";

  matrixRows.forEach((row,rowIndex)=>{
    appendAxisButton(left,leftSymbols[rowIndex]);
    appendAxisButton(right,rightSymbols[rowIndex]);
    row.forEach((entry,columnIndex)=>{
      const cell=document.createElement("button");
      cell.type="button";
      cell.className=`interlocked-cell interlocked-${entry.tone}`;
      if(entry.tone==="green"){
        const nextIsGreen=row[columnIndex+1]?.tone==="green";
        const bottomRightAngry=rowIndex===matrixRows.length-1 && columnIndex===row.length-1 && entry.value==="🤬";
        cell.classList.add((nextIsGreen||bottomRightAngry)?"interlocked-diagonal-lower":"interlocked-diagonal-upper");
        if(bottomRightAngry) cell.classList.add("interlocked-bottom-right-angry");
      }
      cell.textContent=entry.value;
      const primitive=primitiveForSymbol(entry.value);
      if(primitive){
        const cellTheme={id:`primitive:${primitive.id}`,label:primitive.name,kind:"primitive",primitiveId:primitive.id};
        cell.dataset.themeId=cellTheme.id;
        cell.title=`Select ${primitive.name}`;
        cell.addEventListener("click",()=>choosePrimitive(primitive));
      }else{
        const pair=pairForLabel(entry.value);
        const primitives=pair?.map(name=>PRIMITIVE_BY_NAME[name]).filter(Boolean) || [];
        const cellTheme=primitives.length===2 ? {id:primFusionCellId(primitives[0].id,primitives[1].id),label:entry.value,kind:"primFusion",primitiveIds:[primitives[0].id,primitives[1].id].sort()} : null;
        if(cellTheme){
          cell.dataset.themeId=cellTheme.id;
          }
        cell.title=primitives.length===2 ? `${primitives[0].symbol}${primitives[1].symbol} ${entry.value}` : entry.value;
        cell.addEventListener("click",()=>{
          if(!cellTheme || tabletLandscapeView.activeThemeSlot===null) return;
          state.targetSlot=tabletLandscapeView.activeThemeSlot;
          selectTheme(cellTheme);
        });
      }
      grid.appendChild(cell);
    });
  });

  body.append(left,grid,right);
  shell.appendChild(body);
  const bottom=document.createElement("div");
  bottom.className="interlocked-axis interlocked-axis-bottom";
  bottomSymbols.forEach(symbol=>appendAxisButton(bottom,symbol));
  shell.appendChild(bottom);
  root.appendChild(shell);
}



function fitLandscapeAiDescription(){
  const panel=document.getElementById("tabletWorkbenchAiDescription");
  if(!panel || panel.hidden || !panel.isConnected) return;
  const startSize=10;
  const minimumSize=1;
  panel.classList.remove("ai-description-scroll");
  panel.style.setProperty("--ai-description-font-size",`${startSize}px`);
  let size=startSize;
  while(size>minimumSize && (panel.scrollHeight>panel.clientHeight || panel.scrollWidth>panel.clientWidth)){
    size-=1;
    panel.style.setProperty("--ai-description-font-size",`${size}px`);
  }
  if(panel.scrollHeight>panel.clientHeight || panel.scrollWidth>panel.clientWidth){
    panel.classList.add("ai-description-scroll");
  }
}

/* v0.9.39.45 — deterministic Judgment reaction geometry.
   One slot center owns the ring, emoji, and percentage. The bottom row uses
   the exact midpoint X between adjacent top-row centers. */
function judgmentReactionGridPosition(index){
  /* v0.9.39.47 — canonical primitive order is interleaved across the two
     brick rows: 1 top, 2 bottom, 3 top, 4 bottom, and so on.  Every
     bottom-row center therefore lands exactly halfway between its adjacent
     top-row centers.  Custom reactions continue the same sequence. */
  const pair=Math.floor(index / 2);
  return index % 2 === 0
    ? {row:1,start:1 + (pair * 2)}
    : {row:2,start:2 + (pair * 2)};
}
function applyJudgmentReactionGeometry(prims,pctRow){
  if(!prims) return;
  const buttons=[...prims.children];
  let requiredHalfColumns=15;
  const positions=buttons.map((button,index)=>{
    const pos=judgmentReactionGridPosition(index);
    requiredHalfColumns=Math.max(requiredHalfColumns,pos.start+1);
    return {button,pos};
  });
  const halfColumns=Math.max(20,requiredHalfColumns);
  prims.style.setProperty('--reaction-half-columns',String(halfColumns));
  /* Slot center is the center of the historical two-half-column span. */
  positions.forEach(({button,pos})=>{
    const centerUnit=pos.start+1;
    const x=(centerUnit/halfColumns)*100;
    /* Two-row V1 only. These are symbol-center coordinates inside the fixed
       reaction band, leaving the percentage beneath the symbol. */
    const y=pos.row===1?28:58;
    button.style.setProperty('--reaction-slot-x',`${x}%`);
    button.style.setProperty('--reaction-slot-y',`${y}%`);
    button.style.removeProperty('grid-column');
    button.style.removeProperty('grid-row');
  });
  if(pctRow) pctRow.style.setProperty('--reaction-half-columns',String(halfColumns));
}

function renderTabletWorkbench(){
  const root=$("tabletWorkbench");
  if(!root) return;
  $("tabletWorkbenchImage").src=currentSource();
  const prims=$("tabletWorkbenchPrims");
  const pctRow=$("tabletWorkbenchPrimPcts");
  prims.innerHTML="";
  if(pctRow) pctRow.innerHTML="";
  const weights=currentAiWeights();
  /* v0.9.39.49 — explicit canonical Judgment order by stable primitive ID.
     Avoid symbol matching so variation-selector differences can never create
     empty slots or shift later canonical/custom reactions. */
  const judgmentReactionOrder=["P02","P01","P03","P04","P09","P13","P12","P05","P11","P10","P08","P07","P06","P14"];
  judgmentReactionOrder.forEach(primitiveId=>{
    const primitiveIndex=PRIMITIVES.findIndex(item=>item.id===primitiveId);
    const p=PRIMITIVES[primitiveIndex];
    if(!p) return;
    const b=document.createElement("button");
    b.type="button";
    b.className="tablet-prim-button"+(state.selectedReactions.includes(primitiveIndex)?" selected":"");
    b.title=p.name;
    b.setAttribute("aria-pressed",String(state.selectedReactions.includes(primitiveIndex)));
    const pctText=tabletLandscapeView.aiReactions?`${weights[p.id]??0}%`:"";
    b.innerHTML=`<span class="reaction-core" aria-hidden="true"><span class="reaction-ring"></span><span class="symbol">${p.symbol}</span></span><span class="pct" aria-hidden="${String(!tabletLandscapeView.aiReactions)}">${pctText}</span>`;
    b.addEventListener("click",()=>{pushHistory();const n=state.selectedReactions.indexOf(primitiveIndex);if(n>=0)state.selectedReactions.splice(n,1);else state.selectedReactions.push(primitiveIndex);saveCurrent("director-reaction-auto");renderAll();});
    prims.appendChild(b);
  });

  (state.customReactions||[]).forEach(record=>{
    const token=customReactionSelectionToken(record.id);
    const b=document.createElement("button");
    const rawCustomWeight=weights[record.id] ?? weights[token] ?? 0;
    const customPctText=tabletLandscapeView.aiReactions?`${Number(rawCustomWeight)||0}%`:"";
    b.type="button";
    b.className="tablet-prim-button custom-reaction-button"+(state.selectedReactions.includes(token)?" selected":"");
    b.title=record.label;
    b.dataset.customReaction=record.id;
    b.setAttribute("aria-pressed",String(state.selectedReactions.includes(token)));
    b.innerHTML=`<span class="reaction-core" aria-hidden="true"><span class="reaction-ring"></span><span class="symbol">${record.emoji}</span></span><span class="pct custom" aria-hidden="${String(!tabletLandscapeView.aiReactions)}">${customPctText}</span>`;
    b.addEventListener("click",()=>{pushHistory();const n=state.selectedReactions.indexOf(token);if(n>=0)state.selectedReactions.splice(n,1);else state.selectedReactions.push(token);saveCurrent("director-custom-reaction-auto");renderAll();});
    prims.appendChild(b);
  });
  renderLandscapeCustoms();
  applyJudgmentReactionGeometry(prims,pctRow);
  const customReactionCount=prims.querySelectorAll("[data-custom-reaction]").length;
  prims.classList.toggle("has-custom-reactions",customReactionCount>0);
  prims.classList.toggle("custom-reactions-many",customReactionCount>=3);
  for(let i=0;i<3;i++){
    const directorValue=themeLabel(state.themes[i]);
    $("tabletWorkbenchTheme"+(i+1)).textContent=directorValue;
    document.querySelector(`[data-tablet-workbench-slot="${i+1}"]`)?.classList.toggle("active",tabletLandscapeView.activeThemeSlot===i+1);
  }
  const sortedAiThemes=currentAiThemes()
    .map(([label,weight])=>({label,weight:Number(weight)||0}))
    .sort((a,b)=>b.weight-a.weight)
    .slice(0,3);
  for(let i=0;i<3;i++){
    const value=sortedAiThemes[i];
    $("tabletWorkbenchAiTheme"+(i+1)).textContent=value?.label||"—";
    $("tabletWorkbenchAiThemePct"+(i+1)).textContent=value?`${value.weight}%`:"—";
  }
  $("tabletWorkbenchAiDescription").textContent=currentAiRun().description||currentDescription();
  root.classList.toggle("face-judgment",tabletLandscapeView.face==="judgment");
  $("tabletMatrixFace")?.setAttribute("aria-hidden",String(tabletLandscapeView.face!=="matrix"));
  $("tabletJudgmentFace")?.setAttribute("aria-hidden",String(tabletLandscapeView.face!=="judgment"));
  $("tabletAiThemesPanel").hidden=!tabletLandscapeView.aiThemes || tabletLandscapeView.customs;
  $("tabletWorkbenchAiDescription").hidden=!tabletLandscapeView.aiDescription || tabletLandscapeView.customs;
  $("tabletCustomsDrawer").hidden=!tabletLandscapeView.customs;
  $("tabletSlidingDrawer")?.classList.toggle("customs-active",tabletLandscapeView.customs);
  [["tabletAiReactionsBtn","aiReactions"],["tabletAiThemesBtn","aiThemes"],["tabletAiDescriptionBtn","aiDescription"]].forEach(([id,key])=>$(id)?.setAttribute("aria-pressed",String(tabletLandscapeView[key])));
  const contextualCustomsBtn=$("tabletCustomsBtn");
  if(contextualCustomsBtn){
    contextualCustomsBtn.setAttribute("aria-pressed",String(tabletLandscapeView.customs));
    contextualCustomsBtn.textContent=tabletLandscapeView.customs?"AI Analysis":"Customs";
    contextualCustomsBtn.setAttribute("aria-label",tabletLandscapeView.customs?"Return to AI Analysis":"Open Customs");
  }
  $("tabletFlagBtn")?.setAttribute("aria-pressed",String(state.flagged));
  const keepOn=state.retention==="keep";
  $("tabletSaveBtn")?.setAttribute("aria-pressed",String(keepOn));
  $("landscapeImageViewSaveBtn")?.setAttribute("aria-pressed",String(keepOn));
  syncTabletAiRerunControls();

  // AI theme fields use the exact rendered width and height of the existing
  // Director theme fields. The drawer panel is positioned immediately to the
  // right of that Director stack; no duplicate Director fields are rendered.
  const directorStack=document.querySelector(".landscape-director-themes");
  const directorField=directorStack?.querySelector(".tablet-theme-cell");
  const aiPanel=$("tabletAiThemesPanel");
  if(directorStack && directorField && aiPanel){
    const stackRect=directorStack.getBoundingClientRect();
    const fieldRect=directorField.getBoundingClientRect();
    aiPanel.style.setProperty("--director-stack-width",`${stackRect.width}px`);
    aiPanel.style.setProperty("--director-stack-height",`${stackRect.height}px`);
    aiPanel.style.setProperty("--director-field-width",`${fieldRect.width}px`);
    aiPanel.style.setProperty("--director-field-height",`${fieldRect.height}px`);
    const drawerRect=$("tabletSlidingDrawer")?.getBoundingClientRect();
    if(drawerRect){
      aiPanel.style.setProperty("--ai-theme-panel-top",`${Math.max(0,stackRect.top-drawerRect.top)}px`);
      const descriptionPanel=$("tabletWorkbenchAiDescription");
      if(descriptionPanel){
        descriptionPanel.style.setProperty("--director-stack-width",`${stackRect.width}px`);
        descriptionPanel.style.setProperty("--director-stack-height",`${stackRect.height}px`);
        descriptionPanel.style.setProperty("--ai-theme-panel-top",`${Math.max(0,stackRect.top-drawerRect.top)}px`);
      }
    }
  }
  renderLandscapeInterlockedMatrix("tabletWorkbenchMatrix");
  requestAnimationFrame(fitLandscapeAiDescription);
}


function portraitRecordValues(){
  return window.genreactrixImageRecordEngine?.all?.() || Object.values(state.records || {});
}
let portraitRefreshPending=false;
async function refreshPortraitControlStation(){
  if(portraitRefreshPending) return;
  portraitRefreshPending=true;
  try{
    const records=portraitRecordValues();
    const imageEngine=window.genreactrixImagesEngine?.snapshot?.() || {available:0,temporary:0,linked:0,saved:0,flagged:0,recycle:0};
    const [batchSnapshot,aiSnapshot,reports] = await Promise.all([
      window.genreactrixBatchEngine?.snapshot?.().catch(()=>null) || null,
      window.genreactrixAiAnalysisEngine?.snapshot?.().catch(()=>null) || null,
      window.genreactrixReportsEngine?.all?.().catch(()=>[]) || []
    ]);
    const queueSnapshot=window.genreactrixQueueEngine?.snapshot?.() || {summary:{}};
    const q=queueSnapshot.summary||{};
    const b=batchSnapshot || window.genreactrixBatchEngine?.snapshotCached || {activeBatch:null,counts:{total:0,ready:0,remaining:0,saved:0,flagged:0}};
    const a=aiSnapshot || window.genreactrixAiAnalysisEngine?.snapshotCached?.() || {ready:0,pending:0,bufferTarget:25,items:[]};
    const savedTotal=records.filter(r=>r?.attributes?.saved || r?.saved).length;
    const flaggedTotal=records.filter(r=>r?.attributes?.flagged || r?.flagged).length;
    const set=(id,value)=>{const el=$(id);if(el)el.textContent=String(value ?? 0)};
    set('portraitBatchName',b.activeBatch?.name||'No active batch');
    set('portraitBatchTotal',b.counts?.total||0);
    set('portraitReadyBatchCount',b.counts?.ready||0);
    set('portraitBatchRemaining',b.counts?.remaining||0);
    set('portraitSavedTotal',savedTotal);
    set('portraitFlaggedTotal',flaggedTotal);
    set('portraitSavedCurrent',b.counts?.saved||0);
    set('portraitFlaggedCurrent',b.counts?.flagged||0);
    set('portraitAvailableCount',imageEngine.available||0);
    set('portraitTempImageCount',imageEngine.temporary||0);
    set('portraitLinkedImageCount',imageEngine.linked||0);
    set('portraitReferenceImageCount',imageEngine.saved||0);
    set('portraitEngineFlaggedCount',imageEngine.flagged||0);
    set('portraitRecycleImageCount',imageEngine.recycle||0);
    set('portraitAiReadyCount',a.ready||0);
    set('portraitAiPendingCount',a.pending||0);
    set('portraitAiBufferTarget',a.bufferTarget||0);
    set('portraitAiFailedCount',(a.items||[]).filter(item=>item.state==='failed').length);
    set('portraitQueueRunningCount',q.running||0);
    set('portraitQueuedCount',q.queued||0);
    set('portraitQueueFailedCount',(q.failed||0)+(q.blocked||0));
    set('portraitQueueDirectorCount',q.directorRemaining ?? b.counts?.remaining ?? 0);
    set('portraitQueueReadyCount',q.readyToBatch ?? b.counts?.ready ?? 0);
    const sorted=[...(reports||[])].sort((x,y)=>String(y.createdAt||'').localeCompare(String(x.createdAt||'')));
    const lastAuto=sorted.find(r=>r.automatic);
    const lastCustom=sorted.find(r=>!r.automatic);
    set('portraitLastReport',lastAuto?.title||'None');
    set('portraitLastCustomReport',lastCustom?.title||'None');
    set('portraitReportCount',sorted.length);
    set('portraitReportFailedCount',q.reportsPending ? 0 : (queueSnapshot.jobs||[]).filter(j=>j.type==='report'&&['failed','completed-with-failures'].includes(j.state)).length);
  } finally { portraitRefreshPending=false; }
}
function renderPortraitControlStation(){
  if(!$('portraitControlStation')) return;
  refreshPortraitControlStation().catch(console.warn);
}
let portraitStatusTimer=null;
function setPortraitStationStatus(message){
  const status=$('portraitStationStatus');
  if(!status) return;
  status.textContent=message||'';
  status.hidden=!message;
  clearTimeout(portraitStatusTimer);
  if(message) portraitStatusTimer=setTimeout(()=>{status.textContent='';status.hidden=true},4200);
}

function renderAll(){
  // Classification fields render first so image/profile rendering can never leave
  // Theme 1/2/3 showing the previous image if a later render stage fails.
  renderThemes();
  renderReactions();
  renderFlag();
  renderDirectorFields();
  renderDirectorWorkspaceState();
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
    : [[0,1,2,3],[4,5,6,7,8],[9,10,11,12,13]];

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

  const directMatches=[...BASE_THEMES.map(label=>({id:`theme:${slugifyCustom(label)}`,label,kind:"established"})),...(state.customThemes||[])]
    .filter(theme=>!q || theme.label.toLowerCase().includes(q))
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
    directMatches.forEach(theme=>{
      const b=document.createElement("button");
      b.type="button";b.textContent=theme.label;
      if(theme.kind==="customTheme")b.classList.add("custom-theme-result");
      b.addEventListener("click",()=>selectTheme(theme));
      wrap.appendChild(b);
    });
    quick.appendChild(wrap);
    primFusion.prepend(quick);
  }

  requestAnimationFrame(()=>requestAnimationFrame(()=>schedulePrimFusionFit(primFusion,0)));
}
function renderWriteIns(){
  const list=$("writeinList");if(!list)return;list.innerHTML="";
  (state.customThemes||[]).forEach(theme=>{const b=document.createElement("button");b.textContent=theme.label;b.className="custom-theme-result";b.addEventListener("click",()=>selectTheme(theme));list.appendChild(b);});
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
  const saveOk=saveCurrent("director-theme-auto");
  if(!saveOk) return;
  renderThemes();
  renderComparison();
  if(tabletLandscapeView.activeThemeSlot===sourceSlot){
    tabletLandscapeView.activeThemeSlot=null;
    renderTabletWorkbench();
  }
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
    const record=normalizeCustomThemeRecord({label:q,reactionRefs:[]});
    saveCustomThemes([...(state.customThemes||[]),record]);
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
    const record=normalizeCustomThemeRecord({label:q,reactionRefs:[]});
    saveCustomThemes([...(state.customThemes||[]),record]);
    renderWriteIns();
    $("themeError").textContent=`Created “${q}”. Select it normally for Theme ${state.targetSlot}.`;
  }
  $("createThemeBtn").hidden=true;
}

function undo(){
  const engine=window.genreactrixDirectorClassificationEngine;
  const restored=engine?.undo?.(currentKey());
  if(restored){applyClassification({selectedReactions:restored.reactions,themes:restored.themes,flagged:restored.flagged,writeIn:restored.notes,retention:restored.retention});writeClassificationForKey(currentKey(),classificationState());renderAll();updateUndoRedo();return true;}
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
  const engine=window.genreactrixDirectorClassificationEngine;
  const restored=engine?.redo?.(currentKey());
  if(restored){applyClassification({selectedReactions:restored.reactions,themes:restored.themes,flagged:restored.flagged,writeIn:restored.notes,retention:restored.retention});writeClassificationForKey(currentKey(),classificationState());renderAll();updateUndoRedo();return true;}
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
  const directorEngine=window.genreactrixDirectorClassificationEngine;
  const engineUndo=directorEngine?.canUndo?.(currentKey());
  const engineRedo=directorEngine?.canRedo?.(currentKey());
  $("undoBtn").disabled=!(engineUndo||state.history.length);
  $("redoBtn").disabled=!(engineRedo||state.future.length);
  if($("tabletUndoBtn")) $("tabletUndoBtn").disabled=!(engineUndo||state.history.length);
  if($("tabletRedoBtn")) $("tabletRedoBtn").disabled=!(engineRedo||state.future.length);
  if($("directorUndoBtn")){ $("directorUndoBtn").disabled=!(engineUndo||state.history.length); const tx=directorEngine?.peekUndo?.(currentKey()); $("directorUndoBtn").title=tx?`Undo ${tx.action||"classification"}`:"Nothing to undo"; }
  if($("directorRedoBtn")){ $("directorRedoBtn").disabled=!(engineRedo||state.future.length); const tx=directorEngine?.peekRedo?.(currentKey()); $("directorRedoBtn").title=tx?`Redo ${tx.action||"classification"}`:"Nothing to redo"; }
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
$("directorCommitBtn")?.addEventListener("click",commitDirectorAndFollowSetting);
$("directorNextIncompleteBtn")?.addEventListener("click",()=>navigateDirectorMode("next-incomplete"));
$("directorNextFlaggedBtn")?.addEventListener("click",()=>navigateDirectorMode("next-flagged"));
$("directorNextBlockedBtn")?.addEventListener("click",()=>navigateDirectorMode("next-blocked"));
$("directorRandomBtn")?.addEventListener("click",()=>navigateDirectorMode("random"));
$("directorReturnBtn")?.addEventListener("click",returnToLastDirectorImage);
$("directorClearReactionsBtn")?.addEventListener("click",()=>{
  if(!state.selectedReactions.length)return;
  pushHistory();state.selectedReactions=[];
  window.genreactrixDirectorClassificationEngine?.patchDraft?.(currentKey(),{reactions:[],primFusion:null});
  saveCurrent("clear-reactions");renderAll();setDirectorStatus("Reactions cleared.");
});
$("directorRevertDraftBtn")?.addEventListener("click",()=>{
  const engine=window.genreactrixDirectorClassificationEngine;
  const restored=engine?.revertDraft?.(currentKey());
  if(!restored) return;
  applyClassification({selectedReactions:restored.reactions,themes:restored.themes,flagged:restored.flagged,writeIn:restored.notes,retention:restored.retention});
  setDirectorStatus("Draft reverted.");
  renderAll();
});
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
  window.genreactrixAiAnalysisEngine?.maintainBuffer?.();
  renderPortraitControlStation();
}
async function loadImageFolder(fileList,limit=null){
  const batchId=await window.genreactrixBatchEngine?.activeId?.()||"current-import";
  const importResult=window.pendingImportEngineMode?await window.genreactrixImportEngine.runFiles(fileList,{limit,target:"active-batch"}):null;
  window.pendingImportEngineMode=false;
  const records=importResult?.records||await window.genreactrixImagesEngine.importFiles(fileList,{limit,batchId});
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
  state.writeIns=JSON.parse(localStorage.getItem("genreactrix-v0.9.1-writeins")||localStorage.getItem("genreactrix-v0.8.0-writeins")||localStorage.getItem("genreactrix-v0.7.0-writeins")||'[]');
  state.customReactions=loadCustomReactions();
  state.customThemes=loadCustomThemes();
  state.writeIns=state.customThemes.map(item=>item.label);
  cleanupPlaceholderCustoms();
}catch(error){ console.warn("Genreactrix storage migration skipped",error); }



// v0.9.1 Desktop Mode: image zoom/pan, keyboard workflow, and primFusion navigation.
const imageTransform={scale:1,x:0,y:0,pointerId:null,startX:0,startY:0,originX:0,originY:0};
const IMAGE_TRANSFORM_KEY="genreactrix-director-image-transforms-v1";
function loadImageTransforms(){try{return JSON.parse(localStorage.getItem(IMAGE_TRANSFORM_KEY)||"{}")||{};}catch{return {};}}
const imageTransformsById=loadImageTransforms();
function saveImageTransformForCurrent(){
  const id=currentKey?.(); if(!id) return;
  imageTransformsById[id]={scale:imageTransform.scale,x:imageTransform.x,y:imageTransform.y};
  localStorage.setItem(IMAGE_TRANSFORM_KEY,JSON.stringify(imageTransformsById));
}
function restoreImageTransformForCurrent(){
  const saved=imageTransformsById[currentKey?.()]||{scale:1,x:0,y:0};
  Object.assign(imageTransform,{scale:Number(saved.scale)||1,x:Number(saved.x)||0,y:Number(saved.y)||0,pointerId:null});
  applyImageTransform();
}
function applyImageTransform(){
  const image=$("mainImage");
  image.style.transform=`translate(${imageTransform.x}px, ${imageTransform.y}px) scale(${imageTransform.scale})`;
  $("imageViewport").classList.toggle("is-zoomed",imageTransform.scale>1);
  saveImageTransformForCurrent();
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


document.getElementById("tabletWorkspaceFlipBtn")?.addEventListener("click",()=>{tabletLandscapeView.face=tabletLandscapeView.face==="matrix"?"judgment":"matrix";if(tabletLandscapeView.face==="matrix")tabletLandscapeView.customs=false;renderTabletWorkbench();});
document.getElementById("tabletAiReactionsBtn")?.addEventListener("click",()=>{tabletLandscapeView.aiReactions=!tabletLandscapeView.aiReactions;renderTabletWorkbench();});
document.getElementById("tabletAiThemesBtn")?.addEventListener("click",()=>{tabletLandscapeView.aiThemes=!tabletLandscapeView.aiThemes;renderTabletWorkbench();});
document.getElementById("tabletAiDescriptionBtn")?.addEventListener("click",()=>{tabletLandscapeView.aiDescription=!tabletLandscapeView.aiDescription;renderTabletWorkbench();});
document.getElementById("tabletCustomsBtn")?.addEventListener("click",()=>{
  const opening=!tabletLandscapeView.customs;
  tabletLandscapeView.customs=opening;
  if(opening){
    tabletLandscapeView.customsTab="search";
    if($("tabletCustomSearch"))$("tabletCustomSearch").value="";
    landscapeCustomScroll.search=0;
  }
  renderTabletWorkbench();
  if(opening)renderLandscapeCustoms();
});

function createComponentAiRerun(component){
  if(tabletAiRerunLocked)return;
  if(!confirm(`Rerun AI ${component} for this image? The prior AI analysis will remain in history.`))return;
  const previous=currentAiRun()||defaultAiRun();
  const next={...JSON.parse(JSON.stringify(previous)),id:`${currentKey()}-${Date.now()}`,createdAt:new Date().toISOString(),model:"demo-static-rerun",rerunComponent:component};
  state.aiRuns[currentKey()] ||= [];
  state.aiRuns[currentKey()].push(next);persistRecords();
  const recordEngine=window.genreactrixImageRecordEngine;
  if(recordEngine?.get?.(currentKey(),{touch:false}))recordEngine.update(currentKey(),{analysis:{ai:next},components:{aiReactions:"current",aiThemes:"current",aiDescription:"current"}},`ai-${component}-reanalyzed`);
  renderAll();setDirectorStatus(`AI ${component} rerun recorded.`);
}
$("tabletAiRerunLockBtn")?.addEventListener("click",()=>{tabletAiRerunLocked=!tabletAiRerunLocked;localStorage.setItem(AI_RERUN_LOCK_KEY,tabletAiRerunLocked?"1":"0");syncTabletAiRerunControls();});
$("tabletAiRerunReactionsBtn")?.addEventListener("click",()=>createComponentAiRerun("reactions"));
$("tabletAiRerunThemesBtn")?.addEventListener("click",()=>createComponentAiRerun("themes"));
$("tabletAiRerunDescriptionBtn")?.addEventListener("click",()=>createComponentAiRerun("description"));
syncTabletAiRerunControls();

document.getElementById("tabletSaveBtn")?.addEventListener("click",async()=>{
  const id=currentKey();
  const keepOn=state.retention!=="keep";
  pushHistory();state.retention=keepOn?"keep":"discard";
  saveCurrent(keepOn?"image-retention-keep":"image-retention-release");
  try{
    const record=window.genreactrixImagesEngine?.recordById?.(id);
    if(record){
      if(keepOn)await window.genreactrixImagesEngine.saveReference(id);
      else window.genreactrixImageRecordEngine?.update?.(id,{attributes:{saved:false},timestamps:{savedAt:null}},"reference-keep-cleared");
    }
    renderAll();renderLandscapeImageView();
    setDirectorStatus(keepOn?"Full-resolution image marked Keep for batching.":"Keep cleared; full-resolution image may recycle after batching.");
  }catch(error){
    console.warn("Image Keep state could not be stored",error);
    setDirectorStatus("Keep changed in the working evaluation, but storage preference could not be persisted.");
  }
});
document.querySelectorAll("[data-tablet-workbench-slot]").forEach(button=>button.addEventListener("click",()=>{const slot=Number(button.dataset.tabletWorkbenchSlot);state.targetSlot=slot;tabletLandscapeView.activeThemeSlot=slot;renderTabletWorkbench();}));

// v0.9.39.24 — focused Image View. This is a verification mode, not an editor.
const landscapeImageViewState={open:false,scale:1,x:0,y:0,pointers:new Map(),gestureMoved:false,pinched:false,downAt:0};
function resetLandscapeImageViewTransform(){
  landscapeImageViewState.scale=1;landscapeImageViewState.x=0;landscapeImageViewState.y=0;
  landscapeImageViewState.pointers.clear();landscapeImageViewState.gestureMoved=false;landscapeImageViewState.pinched=false;
  applyLandscapeImageViewTransform();
}
function applyLandscapeImageViewTransform(){
  const image=$("landscapeImageViewImage");if(!image)return;
  image.style.transform=`translate(${landscapeImageViewState.x}px, ${landscapeImageViewState.y}px) scale(${landscapeImageViewState.scale})`;
}
function landscapeImageViewReactionSelected(value){return state.selectedReactions.includes(value)}

/* v0.9.39.50 — Image View reaction geometry.
   Canonical primitives occupy the first two interleaved brick rows; customs
   continue immediately beneath them in rows three and four using the same
   top/bottom sequence. Each item owns one slot center; CSS centers both the
   glyph and selection ring on that slot. */
/* v0.9.39.56 — Image View uses one explicit reaction field.
   Each item owns one center point. Ring and emoji are siblings inside a
   reaction-core and therefore cannot drift onto separate coordinate systems.
   The finished field has an explicit bounding box and is centered as a unit. */
const LANDSCAPE_IMAGE_REACTION_GEOMETRY={
  ring:44,
  glyph:17,
  stroke:2.6,
  stepX:60,
  stepY:38
};
function landscapeImageViewCenter(index,custom=false){
  const g=LANDSCAPE_IMAGE_REACTION_GEOMETRY;
  if(!custom){
    const col=Math.floor(index/2);
    return index%2===0
      ? {x:col*g.stepX,y:0}
      : {x:(col+.5)*g.stepX,y:g.stepY};
  }
  /* Customs continue as rows 3/4 without a section gap:
     #1,#2,#4,#6... on row 3; #3,#5,#7... on row 4. */
  if(index===0)return{x:0,y:g.stepY*2};
  if(index===1)return{x:g.stepX,y:g.stepY*2};
  const n=index-2;
  return n%2===0
    ? {x:(Math.floor(n/2)+.5)*g.stepX,y:g.stepY*3}
    : {x:(Math.floor(n/2)+2)*g.stepX,y:g.stepY*2};
}
function finalizeLandscapeImageReactionField(field,points){
  const g=LANDSCAPE_IMAGE_REACTION_GEOMETRY;
  if(!points.length){
    field.style.width='0px';field.style.height='0px';
    field.style.setProperty('--iv-field-scale','1');
    field.style.setProperty('--iv-center-x','0px');
    field.style.setProperty('--iv-center-y','0px');
    return;
  }
  const r=g.ring/2;
  const minX=Math.min(...points.map(p=>p.x))-r;
  const maxX=Math.max(...points.map(p=>p.x))+r;
  const minY=Math.min(...points.map(p=>p.y))-r;
  const maxY=Math.max(...points.map(p=>p.y))+r;
  const fieldWidth=maxX-minX;
  const fieldHeight=maxY-minY;
  field.style.width=`${fieldWidth}px`;
  field.style.height=`${fieldHeight}px`;
  field.style.setProperty('--iv-origin-x',`${-minX}px`);
  field.style.setProperty('--iv-origin-y',`${-minY}px`);
  field.style.setProperty('--iv-center-x','0px');
  field.style.setProperty('--iv-center-y','0px');

  /* v0.9.39.62 — fit and center from rendered geometry, not assumed layout.
     The reaction field remains one rigid object. After the browser resolves the
     actual Image View grid, measure both the available reaction region and the
     transformed field, then translate only the field by the exact center delta.
     No ring, glyph, slot, stagger, or custom-reaction geometry is changed. */
  const root=field.parentElement;
  const settle=()=>{
    if(!root||!field.isConnected)return;
    const inset=8;
    const rootRect=root.getBoundingClientRect();
    if(rootRect.width<=0||rootRect.height<=0)return;
    const availableWidth=Math.max(1,rootRect.width-inset);
    const availableHeight=Math.max(1,rootRect.height-inset);
    const scale=Math.min(1,availableWidth/fieldWidth,availableHeight/fieldHeight);
    field.style.setProperty('--iv-field-scale',String(Number.isFinite(scale)&&scale>0?scale:1));
    field.style.setProperty('--iv-center-x','0px');
    field.style.setProperty('--iv-center-y','0px');

    requestAnimationFrame(()=>{
      if(!field.isConnected)return;
      const rr=root.getBoundingClientRect();
      const fr=field.getBoundingClientRect();
      const dx=(rr.left+rr.width/2)-(fr.left+fr.width/2);
      const dy=(rr.top+rr.height/2)-(fr.top+fr.height/2);
      field.style.setProperty('--iv-center-x',`${dx}px`);
      field.style.setProperty('--iv-center-y',`${dy}px`);
    });
  };
  requestAnimationFrame(settle);
}
function placeLandscapeImageReaction(item,point){
  item.style.left=`calc(var(--iv-origin-x) + ${point.x}px)`;
  item.style.top=`calc(var(--iv-origin-y) + ${point.y}px)`;
}
function renderLandscapeImageView(){
  if(!landscapeImageViewState.open)return;
  const image=$("landscapeImageViewImage");if(image)image.src=currentSource();
  const description=$("landscapeImageViewDescription");if(description){
    description.textContent=currentAiRun().description||currentDescription()||"";
    description.title=description.textContent;
  }
  const primRoot=$("landscapeImageViewPrims");if(primRoot){
    primRoot.innerHTML="";
    const field=document.createElement("div");field.className="landscape-image-view-reaction-field";primRoot.appendChild(field);
    const points=[];
    const order=["🧸","✨","😭","🤣","🌶️","🎉","🧠","💥","👻","🤢","🌌","🎟️","🌀","🤬"];
    order.forEach((symbol,displayIndex)=>{
      const index=PRIMITIVES.findIndex(item=>item.symbol===symbol);const primitive=PRIMITIVES[index];if(!primitive)return;
      const point=landscapeImageViewCenter(displayIndex,false);points.push(point);
      const item=document.createElement("div");item.className="landscape-image-view-prim"+(landscapeImageViewReactionSelected(index)?" selected":"");item.title=primitive.name;item.setAttribute("aria-label",`${primitive.name}${landscapeImageViewReactionSelected(index)?", selected":""}`);
      item.innerHTML=`<span class="reaction-core" aria-hidden="true"><span class="reaction-ring"></span><span class="symbol">${primitive.symbol}</span></span>`;
      placeLandscapeImageReaction(item,point);field.appendChild(item);
    });
    (state.customReactions||[]).forEach((record,customIndex)=>{
      const token=customReactionSelectionToken(record.id);const point=landscapeImageViewCenter(customIndex,true);points.push(point);
      const item=document.createElement("div");item.className="landscape-image-view-prim custom"+(landscapeImageViewReactionSelected(token)?" selected":"");item.title=record.label;item.setAttribute("aria-label",`${record.label}${landscapeImageViewReactionSelected(token)?", selected":""}`);
      item.innerHTML=`<span class="reaction-core" aria-hidden="true"><span class="reaction-ring"></span><span class="symbol">${record.emoji}</span></span>`;
      placeLandscapeImageReaction(item,point);field.appendChild(item);
    });
    finalizeLandscapeImageReactionField(field,points);
  }
  const themeRoot=$("landscapeImageViewThemes");if(themeRoot){
    themeRoot.innerHTML="";
    for(let i=0;i<3;i++){
      const row=document.createElement("div");row.className="landscape-image-view-theme";row.innerHTML=`<b>${i+1}</b><strong>${themeLabel(state.themes[i])}</strong>`;themeRoot.appendChild(row);
    }
  }
  $("landscapeImageViewFlagBtn")?.setAttribute("aria-pressed",String(state.flagged));
}
function openLandscapeImageView(){
  landscapeImageViewState.open=true;
  const trigger=$("tabletImageViewBtn");if(trigger){trigger.disabled=true;trigger.style.pointerEvents="none";}
  const view=$("landscapeImageView");if(view)view.hidden=false;
  resetLandscapeImageViewTransform();renderLandscapeImageView();
}
function closeLandscapeImageView(){
  landscapeImageViewState.open=false;
  const trigger=$("tabletImageViewBtn");if(trigger){trigger.disabled=true;trigger.style.pointerEvents="none";}
  const view=$("landscapeImageView");if(view)view.hidden=true;
  resetLandscapeImageViewTransform();
  // Keep the underlying normal-view image inert long enough to absorb the
  // synthetic click that follows pointerup on some Android browsers.
  setTimeout(()=>{if(trigger){trigger.disabled=false;trigger.style.pointerEvents="";}},420);
}
function navigateLandscapeImageView(delta){navigateImage(delta);resetLandscapeImageViewTransform();renderLandscapeImageView()}
$("tabletImageViewBtn")?.addEventListener("click",openLandscapeImageView);
$("landscapeImageViewPrevBtn")?.addEventListener("click",e=>{e.stopPropagation();navigateLandscapeImageView(-1)});
$("landscapeImageViewNextBtn")?.addEventListener("click",e=>{e.stopPropagation();navigateLandscapeImageView(1)});
const flagHoldState={timer:null,long:false,startedAt:0,button:null,pointerId:null};
function openFlagAdminDialog(){
  flagHoldState.long=true;
  const dialog=$("flagAdminDialog");
  if(!dialog)return;
  try{if(typeof dialog.showModal==="function"&&!dialog.open)dialog.showModal();else dialog.setAttribute("open","");}
  catch{dialog.setAttribute("open","");}
}
function beginFlagHold(e){
  if(e.pointerType==="mouse"&&e.button!==0)return;
  e.preventDefault();e.stopPropagation();
  clearTimeout(flagHoldState.timer);
  flagHoldState.long=false;flagHoldState.startedAt=performance.now();flagHoldState.button=e.currentTarget;flagHoldState.pointerId=e.pointerId;
  try{e.currentTarget?.setPointerCapture?.(e.pointerId);}catch{}
  flagHoldState.timer=setTimeout(()=>{flagHoldState.timer=null;navigator.vibrate?.(30);openFlagAdminDialog();},2000);
}
function finishFlagHold(e,cancelled=false){
  if(e){e.preventDefault?.();e.stopPropagation?.();}
  const elapsed=flagHoldState.startedAt?performance.now()-flagHoldState.startedAt:0;
  clearTimeout(flagHoldState.timer);flagHoldState.timer=null;
  // Some Android browsers emit pointercancel during a stationary long hold.
  // Treat a ~2 second cancelled hold as the intended administrative gesture.
  if(cancelled&&!flagHoldState.long&&elapsed>=1900)openFlagAdminDialog();
  if(!cancelled&&!flagHoldState.long&&elapsed<1900){$("directorFlagBtn")?.click();renderFlag();renderLandscapeImageView();}
  flagHoldState.startedAt=0;flagHoldState.button=null;flagHoldState.pointerId=null;
  setTimeout(()=>flagHoldState.long=false,80);
}
["landscapeImageViewFlagBtn","tabletFlagBtn"].forEach(id=>{
  const b=$(id);if(!b)return;
  b.style.touchAction="none";
  b.addEventListener("pointerdown",beginFlagHold,{passive:false});
  b.addEventListener("pointerup",e=>finishFlagHold(e,false),{passive:false});
  b.addEventListener("pointercancel",e=>finishFlagHold(e,true),{passive:false});
  b.addEventListener("contextmenu",e=>{e.preventDefault();e.stopPropagation();openFlagAdminDialog();});
  b.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();},{capture:true});
});

// Finish a Flag hold even if Android releases the pointer outside the button.
document.addEventListener("pointerup",e=>{if(flagHoldState.pointerId===e.pointerId&&flagHoldState.startedAt)finishFlagHold(e,false);},{passive:false});
document.addEventListener("pointercancel",e=>{if(flagHoldState.pointerId===e.pointerId&&flagHoldState.startedAt)finishFlagHold(e,true);},{passive:false});
$("flagForRejectionAction")?.addEventListener("click",()=>{$("flagAdminDialog")?.close();setDirectorStatus("Image flagged for rejection review.")});
$("rejectImageAction")?.addEventListener("click",()=>{$("flagAdminDialog")?.close();setDirectorStatus("Reject workflow will be completed in the lifecycle checkpoint.")});
$("landscapeImageViewSaveBtn")?.addEventListener("click",e=>{e.stopPropagation();$("tabletSaveBtn")?.click();renderLandscapeImageView()});
const landscapeImageCanvas=$("landscapeImageViewCanvas");
landscapeImageCanvas?.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();},{capture:true});
function landscapePointerDistance(){const p=[...landscapeImageViewState.pointers.values()];if(p.length<2)return 0;return Math.hypot(p[1].x-p[0].x,p[1].y-p[0].y)}
function landscapePointerMidpoint(){const p=[...landscapeImageViewState.pointers.values()];if(p.length<2)return{x:0,y:0};return{x:(p[0].x+p[1].x)/2,y:(p[0].y+p[1].y)/2}}
landscapeImageCanvas?.addEventListener("pointerdown",e=>{
  e.preventDefault();landscapeImageCanvas.setPointerCapture?.(e.pointerId);
  landscapeImageViewState.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY});
  landscapeImageViewState.downAt=performance.now();landscapeImageViewState.gestureMoved=false;
  if(landscapeImageViewState.pointers.size===2){landscapeImageViewState.pinched=true;landscapeImageViewState.gestureMoved=true;landscapeImageViewState.startDistance=landscapePointerDistance();landscapeImageViewState.startScale=landscapeImageViewState.scale;landscapeImageViewState.startMid=landscapePointerMidpoint();landscapeImageViewState.startX=landscapeImageViewState.x;landscapeImageViewState.startY=landscapeImageViewState.y}
  else if(landscapeImageViewState.pointers.size===1){landscapeImageViewState.panStartX=landscapeImageViewState.x;landscapeImageViewState.panStartY=landscapeImageViewState.y}
});
landscapeImageCanvas?.addEventListener("pointermove",e=>{
  const pointer=landscapeImageViewState.pointers.get(e.pointerId);if(!pointer)return;e.preventDefault();pointer.x=e.clientX;pointer.y=e.clientY;
  if(Math.hypot(pointer.x-pointer.startX,pointer.y-pointer.startY)>5)landscapeImageViewState.gestureMoved=true;
  if(landscapeImageViewState.pointers.size>=2){
    const distance=landscapePointerDistance();const midpoint=landscapePointerMidpoint();const ratio=landscapeImageViewState.startDistance?distance/landscapeImageViewState.startDistance:1;
    landscapeImageViewState.scale=Math.max(1,Math.min(8,landscapeImageViewState.startScale*ratio));
    landscapeImageViewState.x=landscapeImageViewState.startX+(midpoint.x-landscapeImageViewState.startMid.x);
    landscapeImageViewState.y=landscapeImageViewState.startY+(midpoint.y-landscapeImageViewState.startMid.y);
    if(landscapeImageViewState.scale===1){landscapeImageViewState.x=0;landscapeImageViewState.y=0}
    applyLandscapeImageViewTransform();return;
  }
  if(landscapeImageViewState.pointers.size===1 && landscapeImageViewState.scale>1){landscapeImageViewState.x=landscapeImageViewState.panStartX+(pointer.x-pointer.startX);landscapeImageViewState.y=landscapeImageViewState.panStartY+(pointer.y-pointer.startY);applyLandscapeImageViewTransform()}
});
function endLandscapeImagePointer(e){
  if(!landscapeImageViewState.pointers.has(e.pointerId))return;e.preventDefault();
  const wasSingle=landscapeImageViewState.pointers.size===1;const elapsed=performance.now()-landscapeImageViewState.downAt;
  landscapeImageViewState.pointers.delete(e.pointerId);
  if(wasSingle && !landscapeImageViewState.gestureMoved && !landscapeImageViewState.pinched && elapsed<550){closeLandscapeImageView();return}
  if(landscapeImageViewState.pointers.size===0){landscapeImageViewState.pinched=false;landscapeImageViewState.gestureMoved=false}
}
landscapeImageCanvas?.addEventListener("pointerup",endLandscapeImagePointer);
landscapeImageCanvas?.addEventListener("pointercancel",endLandscapeImagePointer);


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
    const qJob=await window.genreactrixQueueEngine?.createJob?.({type:"acquisition",ownerEngine:"images",label:`Folder import · ${selected.length} image${selected.length===1?"":"s"}`,state:"running",total:selected.length,batchId,message:"Copying images"});
    const qItems=[];
    for(const [order,file] of selected.entries()){
      const id=createImageId("local");const qItem={id:qJob?`queue_import_${id}`:null,imageId:id,order,type:"acquisition",state:"processing"};if(qJob){await window.genreactrixQueueEngine.addItems(qJob.id,[qItem]);qItems.push(qItem)}
      let record=records.create({id,name:file.name,source:{type:"file",originalLocation:file.webkitRelativePath||file.name,originalFilename:file.name,importMethod:"temporary-copy",firstBatchId:batchId},storage:{mode:"temporary",temporaryKey:id,mimeType:file.type,size:file.size,lastModified:file.lastModified},workflow:{stage:"available"},batchIds:[batchId]});
      try{await imageBlobPut(id,file);if(qItem.id)await window.genreactrixQueueEngine.setItemState(qItem.id,"complete");}catch(error){record=records.update(id,{attributes:{failed:true},error:String(error?.message||error)},"storage-failed");if(qItem.id)await window.genreactrixQueueEngine.setItemState(qItem.id,"failed",{error:String(error?.message||error)});}
      created.push(record);
    }
    if(qJob)await window.genreactrixQueueEngine.setJobState(qJob.id,created.some(r=>r.attributes?.failed)?"completed-with-failures":"completed",created.some(r=>r.attributes?.failed)?"Import completed with failures":"Import complete");
    activeSessionIds=created.map(r=>r.id);return created;
  }
  async function prefetchUrls(text,{limit=null}={}){const raw=[...new Set(String(text||"").split(/\r?\n|,\s*(?=https?:)/).map(safeUrl).filter(Boolean))];const urls=Number.isFinite(limit)&&limit>0?raw.slice(0,limit):raw;return urls.map((url,index)=>({url,index,host:new URL(url).host,name:decodeURIComponent(new URL(url).pathname.split("/").pop()||`remote-${index+1}`)}));}
  async function importUrls(text,{limit=null,mode="link",prefetch=true,batchId="current-import"}={}){
    const sources=await prefetchUrls(text,{limit});const created=[];
    const qJob=await window.genreactrixQueueEngine?.createJob?.({type:"acquisition",ownerEngine:"images",label:`URL ${mode==="download"?"download":"intake"} · ${sources.length}`,state:"running",total:sources.length,batchId,message:mode==="download"?"Downloading images":"Creating hyperlinks"});
    for(const [order,source] of sources.entries()){
      const id=createImageId("url"),qItemId=qJob?`queue_url_${id}`:null;if(qJob)await window.genreactrixQueueEngine.addItems(qJob.id,[{id:qItemId,imageId:id,order,type:"acquisition",state:"processing"}]);
      let record=records.create({id,name:source.name,source:{type:"url",originalLocation:source.url,originalUrl:source.url,originalFilename:source.name,importMethod:mode==="download"?"temporary-copy":"hyperlink-only",firstBatchId:batchId},storage:{mode:mode==="download"?"temporary":"linked",temporaryKey:mode==="download"?id:null,hyperlink:source.url},workflow:{stage:"available"},attributes:{hyperlinkOnly:mode!=="download"},batchIds:[batchId]});
      if(mode==="download")try{const response=await fetch(source.url,{mode:"cors"});if(!response.ok)throw new Error(`HTTP ${response.status}`);const blob=await response.blob();if(!blob.type.startsWith("image/"))throw new Error("URL did not return an image");await imageBlobPut(id,blob);record=records.update(id,{storage:{mimeType:blob.type,size:blob.size}},"downloaded");}catch(error){record=records.update(id,{storage:{mode:"linked",temporaryKey:null,hyperlink:source.url},attributes:{hyperlinkOnly:true,failed:true},error:String(error?.message||error)},"download-fallback");}
      if(qItemId)await window.genreactrixQueueEngine.setItemState(qItemId,record.attributes?.failed?"failed":"complete",record.attributes?.failed?{error:record.error||"Download failed; hyperlink retained"}:{});created.push(record);
    }
    if(qJob)await window.genreactrixQueueEngine.setJobState(qJob.id,created.some(r=>r.attributes?.failed)?"completed-with-failures":"completed",created.some(r=>r.attributes?.failed)?"URL intake completed with failures":"URL intake complete");
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
  async function purgeExpired(){const days=Math.max(0,Number(window.genreactrixSettingsEngine?.get?.("recycle.retentionDays",30) ?? localStorage.getItem(RECYCLE_RETENTION_KEY))||30);if(days<=0)return{purged:0,freed:0};const before=new Date(Date.now()-days*86400000).toISOString();return purgeRecycle({before});}
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
  const saved=Math.max(1,Math.floor(Number(window.genreactrixSettingsEngine?.get?.("defaults.images.amount",100) ?? localStorage.getItem(PORTRAIT_DEFAULT_AMOUNT_KEY))||100));
  input.value=String(saved);
  input.addEventListener("change",()=>{
    const amount=portraitDefaultAmount();
    window.genreactrixSettingsEngine?.set?.("defaults.images.amount",amount);
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
  try{ saved=window.genreactrixSettingsEngine?.get?.("ai.components.default",{}) || JSON.parse(localStorage.getItem(PORTRAIT_AI_OUTPUTS_KEY)||"{}"); }catch(error){ saved={}; }
  controls.forEach(control=>{
    if(Object.prototype.hasOwnProperty.call(saved,control.dataset.portraitAiOutput)) control.checked=Boolean(saved[control.dataset.portraitAiOutput]);
    control.addEventListener("change",()=>window.genreactrixSettingsEngine?.set?.("ai.components.default",selectedPortraitAiOutputs()));
  });
}


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
      {key:"quantity",label:"Images",type:"number",min:1,getDefault:()=>Math.max(1,Number(window.genreactrixSettingsEngine?.get?.("defaults.ai.quickAdd",100) ?? localStorage.getItem(AI_QUICK_ADD_KEY))||100)},
      {key:"outputs",label:"Outputs",type:"ai-outputs",getDefault:()=>selectedPortraitAiOutputs()}
    ],
    summarize:p=>{
      const labels={reactions:"Reactions",themes:"Themes",description:"Description",emotion:"Emotion","reaction-reasons":"Reaction reasons","genre-reasons":"Genre reasons"};
      const selected=Object.entries(p.outputs||{}).filter(([,on])=>on).map(([key])=>labels[key]);
      return [`Quantity: ${p.quantity}`,`Outputs: ${selected.join(", ")||"None"}`];
    },
    validate:p=>Object.values(p.outputs||{}).some(Boolean)?"":"Choose at least one AI output.",
    run:async p=>{
      const added=await window.genreactrixAiAnalysisEngine.queueNext(Math.max(1,Number(p.quantity)||100),p.outputs);
      setPortraitStationStatus(added?`${added} images added to the AI queue.`:"No additional unanalyzed images are available.");
    }
  },
  "queue.open":{module:"queue",name:"Open queue",defaultLabel:"Open queue",fields:[],summarize:()=>["View: Queue"],run:()=>window.genreactrixQueueEngine?.openConsole?.()},
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
  try{ saved=window.genreactrixSettingsEngine?.get?.("quick.presets",{}) || JSON.parse(localStorage.getItem(QUICK_PRESETS_KEY)||"{}"); }catch(error){ saved={}; }
  const merged=structuredClone(DEFAULT_QUICK_PRESETS);
  Object.keys(merged).forEach(module=>[1,2].forEach(slot=>{
    if(saved?.[module]?.[slot]) merged[module][slot]={...merged[module][slot],...saved[module][slot],params:{...merged[module][slot].params,...(saved[module][slot].params||{})}};
  }));
  return merged;
}
let quickPresets=loadQuickPresets();
function saveQuickPresets(){ window.genreactrixSettingsEngine?.set?.("quick.presets",quickPresets); }
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
window.genreactrixAiAnalysisEngine?.maintainBuffer?.();
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
    if(module==="images") window.genreactrixImagesConsole?.open?.();
    else if(module==="ai") window.genreactrixAiAnalysisEngine?.openConsole?.();
    else if(module==="batch") window.genreactrixBatchEngine?.openConsole?.();
    else if(module==="reports") window.genreactrixReportsEngine?.openConsole?.();
    else if(module==="queue") window.genreactrixQueueEngine?.openConsole?.();
    else setPortraitStationStatus(`Open the full ${button.textContent.trim()} console.`);
  });
  bindLongPress(button,()=>openModuleQuickManager(module));
});
document.getElementById("portraitMailboxBtn")?.addEventListener("click",()=>window.genreactrixNotificationsEngine?.openConsole?.());
document.querySelectorAll("[data-portrait-status]").forEach(button=>button.addEventListener("click",()=>{
  const target=button.dataset.portraitStatus||"";
  if(target.startsWith("batch-")||target==="saved-total"||target==="flagged-total") window.genreactrixBatchEngine?.openConsole?.();
  else if(target.startsWith("queue-")) window.genreactrixQueueEngine?.openConsole?.();
  else if(target.startsWith("reports-")) window.genreactrixReportsEngine?.openConsole?.();
  else if(target.startsWith("images-")) { window.genreactrixImagesConsole?.open?.(); const section=target.replace("images-",""); setTimeout(()=>document.querySelector(`[data-images-section="${section}"]`)?.click(),0); }
}));

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


["genreactrix:image-record","genreactrix:batch","genreactrix:queue","genreactrix:report","genreactrix:notification","genreactrix:settings"].forEach(type=>window.addEventListener(type,()=>refreshPortraitControlStation().catch(console.warn)));
window.addEventListener("orientationchange",()=>setTimeout(()=>refreshPortraitControlStation().catch(console.warn),120));

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

// v0.9.22.0 Research Session Manager UI
(()=>{
'use strict';
let selectedSessionId=null;
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function renderSessionLists(){const eng=window.genreactrixResearchSessionEngine;if(!eng)return;const sessions=await eng.allSessions();const active=await eng.active();selectedSessionId=selectedSessionId||active?.id||sessions[0]?.id||null;$('researchSessionStatus').textContent=active?`Active · ${active.name}`:'No active session';$('researchSessionList').innerHTML=sessions.map(s=>`<button class="research-session-item ${s.id===selectedSessionId?'active':''}" data-session-id="${s.id}"><strong>${esc(s.name)}</strong><div class="research-session-meta">${esc(s.status)} · ${new Date(s.updatedAt).toLocaleString()}</div></button>`).join('')||'<p>No sessions yet.</p>';await loadSelectedSession()}
async function loadSelectedSession(){const eng=window.genreactrixResearchSessionEngine;if(!eng||!selectedSessionId)return;const sessions=await eng.allSessions(),s=sessions.find(x=>x.id===selectedSessionId);if(!s)return;for(const [id,key] of [['researchSessionName','name'],['researchSessionDescription','description'],['researchSessionObjectives','objectives'],['researchSessionQuestions','questions'],['researchSessionConclusions','conclusions']])$(id).value=s[key]||'';const [sn,bm,ws,ac]=await Promise.all([eng.snapshots(s.id),eng.bookmarks(s.id),eng.workingSets(s.id),eng.activity(s.id)]);$('researchSnapshotList').innerHTML=sn.map(x=>`<button class="research-session-subitem" data-restore-snapshot="${x.id}">${esc(x.label)}<div class="research-session-meta">${new Date(x.createdAt).toLocaleString()}</div></button>`).join('')||'<p>None.</p>';$('researchBookmarkList').innerHTML=bm.map(x=>`<button class="research-session-subitem">${esc(x.type)} · ${esc(x.label)}</button>`).join('')||'<p>None.</p>';$('researchWorkingSetList').innerHTML=ws.map(x=>`<button class="research-session-subitem">${esc(x.name)} · ${x.imageIds.length} images</button>`).join('')||'<p>None.</p>';$('researchActivityList').innerHTML=ac.slice(0,30).map(x=>`<div class="research-session-subitem">${esc(x.summary)}<div class="research-session-meta">${new Date(x.createdAt).toLocaleString()}</div></div>`).join('')||'<p>None.</p>'}
async function openSessions(){await renderSessionLists();$('researchSessionDialog')?.showModal()}
window.addEventListener('DOMContentLoaded',()=>{
$('researchSessionsOpen')?.addEventListener('click',openSessions);$('researchSessionClose')?.addEventListener('click',()=>$('researchSessionDialog')?.close());$('researchSessionNew')?.addEventListener('click',async()=>{const name=prompt('Session name','Research session');if(!name)return;const s=await window.genreactrixResearchSessionEngine.createSession({name});selectedSessionId=s.id;await renderSessionLists()});$('researchSessionList')?.addEventListener('click',async e=>{const b=e.target.closest('[data-session-id]');if(!b)return;selectedSessionId=b.dataset.sessionId;await window.genreactrixResearchSessionEngine.setActive(selectedSessionId);await renderSessionLists()});$('researchSessionSave')?.addEventListener('click',async()=>{if(!selectedSessionId)return;await window.genreactrixResearchSessionEngine.updateSession(selectedSessionId,{name:$('researchSessionName').value,description:$('researchSessionDescription').value,objectives:$('researchSessionObjectives').value,questions:$('researchSessionQuestions').value,conclusions:$('researchSessionConclusions').value});await renderSessionLists()});$('researchSessionSnapshot')?.addEventListener('click',async()=>{const label=prompt('Snapshot label','Manual snapshot');if(label){await window.genreactrixResearchSessionEngine.snapshot(label);await renderSessionLists()}});$('researchSessionRestore')?.addEventListener('click',async()=>{const s=(await window.genreactrixResearchSessionEngine.allSessions()).find(x=>x.id===selectedSessionId);if(s)await window.genreactrixResearchSessionEngine.restoreWorkspace(s.workspace)});$('researchSessionBookmarkImage')?.addEventListener('click',async()=>{const id=window.genreactrixDirectorEngine?.getCurrentImageId?.()||window.currentImageId;if(id){await window.genreactrixResearchSessionEngine.bookmark('image',id,`Image ${id}`,window.genreactrixResearchSessionEngine.captureWorkspace());await renderSessionLists()}});$('researchSessionSearch')?.addEventListener('input',async e=>{const q=e.target.value.trim();if(!q){await renderSessionLists();return}const rows=await window.genreactrixResearchSessionEngine.search(q);$('researchSessionList').innerHTML=rows.map(x=>`<button class="research-session-item" data-session-id="${x.sessionId}"><strong>${esc(x.label)}</strong><div class="research-session-meta">${esc(x.kind)}</div></button>`).join('')||'<p>No matches.</p>'});$('researchSnapshotList')?.addEventListener('click',async e=>{const b=e.target.closest('[data-restore-snapshot]');if(!b)return;const list=await window.genreactrixResearchSessionEngine.snapshots(selectedSessionId),snap=list.find(x=>x.id===b.dataset.restoreSnapshot);if(snap)await window.genreactrixResearchSessionEngine.restoreWorkspace(snap.workspace)});
});
})();



// v0.9.39.24 — structured customs, editing/reordering, and evaluation-vocabulary versioning.
const EVALUATION_VERSION_KEY="genreactrix-evaluation-vocabulary-version-v1";
const EVALUATION_USED_KEY="genreactrix-evaluation-vocabulary-used-v1";
const CUSTOM_PLACEHOLDER_CLEANUP_KEY="genreactrix-custom-placeholder-cleanup-v1";
const customThemeDraft={reactionRefs:[],editingId:null};
const customReactionDraft={editingId:null};
const CUSTOM_REORDER_HOLD_MS=360;
function currentEvaluationVersion(){return localStorage.getItem(EVALUATION_VERSION_KEY)||"0.0.0";}
function setEvaluationVersion(v){localStorage.setItem(EVALUATION_VERSION_KEY,v);window.dispatchEvent(new CustomEvent("genreactrix:evaluation-version",{detail:{version:v}}));return v;}
function bumpEvaluationVersion(kind){const parts=currentEvaluationVersion().split(".").map(n=>Number(n)||0);if(kind==="major")return setEvaluationVersion(`${parts[0]+1}.0.0`);if(kind==="minor")return setEvaluationVersion(`${parts[0]}.${parts[1]+1}.0`);return setEvaluationVersion(`${parts[0]}.${parts[1]}.${parts[2]+1}`);}
function taxonomyHasBeenUsed(){return localStorage.getItem(EVALUATION_USED_KEY)==="1";}
async function lockBatchEvaluationVersion(){const engine=window.genreactrixBatchEngine;if(!engine?.active||!engine?.update)return;const batch=await engine.active();if(!batch)return;const version=batch.evaluationVersion||currentEvaluationVersion();if(!batch.evaluationVersion)await engine.update(batch.id,{evaluationVersion:version},"evaluation-version-locked");}
async function flagCurrentBatchForReevaluation(reason,previousVersion,newVersion){const batch=await window.genreactrixBatchEngine?.active?.();const records=window.genreactrixImageRecordEngine;if(!batch||!records?.get||!records?.update)return;for(const id of batch.imageIds||[]){const record=records.get(id,{touch:false});if(!record?.analysis?.director)continue;records.update(id,{attributes:{needsReevaluation:true},analysis:{evaluationVersion:record.analysis?.evaluationVersion||previousVersion,reevaluationReason:reason,reevaluationTargetVersion:newVersion}},"evaluation-recheck-required");}await window.genreactrixBatchEngine.update(batch.id,{reevaluationRequired:true,reevaluationTargetVersion:newVersion},"batch-evaluation-vocabulary-changed");}
async function registerVocabularyMutation(kind,reason){if(!taxonomyHasBeenUsed())return currentEvaluationVersion();const previous=currentEvaluationVersion(),next=bumpEvaluationVersion(kind);await flagCurrentBatchForReevaluation(reason,previous,next);return next;}
function cleanupPlaceholderCustoms(){const placeholders=new Set(["horror","dreamcore","horny","none"]);const themes=(state.customThemes||[]).filter(x=>!placeholders.has(String(x.label||"").trim().toLowerCase()));const reactions=(state.customReactions||[]).filter(x=>!placeholders.has(String(x.label||"").trim().toLowerCase()));if(themes.length!==(state.customThemes||[]).length)saveCustomThemes(themes);if(reactions.length!==(state.customReactions||[]).length)saveCustomReactions(reactions);localStorage.setItem(CUSTOM_PLACEHOLDER_CLEANUP_KEY,"2");}
function customThemeValidation(){const label=$("customThemeLabel")?.value.trim()||"";const id=`custom-theme:${slugifyCustom(label)}`;const keys=customThemeDraft.reactionRefs.map(reactionRefKey);if(!label)return{valid:false,message:"Theme name is required."};if((state.customThemes||[]).some(item=>item.id===id&&item.id!==customThemeDraft.editingId))return{valid:false,message:"A custom theme with that name already exists."};if(new Set(keys).size!==keys.length)return{valid:false,message:"Duplicate reactions are not allowed. Edit the expression before saving."};return{valid:true,message:""};}
function customReactionValidation(){const label=$("customReactionLabel")?.value.trim()||"",emoji=$("customReactionEmoji")?.value.trim()||"";const id=`custom-reaction:${slugifyCustom(label)}`;if(!label||!emoji)return{valid:false,message:"Reaction word/name and emoji are required."};if((state.customReactions||[]).some(item=>item.id===id&&item.id!==customReactionDraft.editingId))return{valid:false,message:"A custom reaction with that name already exists."};return{valid:true,message:""};}
function updateCustomDialogValidation(showMessage=false){const tv=customThemeValidation(),rv=customReactionValidation();if($("customThemeSaveBtn"))$("customThemeSaveBtn").disabled=!tv.valid;if($("customReactionSaveBtn"))$("customReactionSaveBtn").disabled=!rv.valid;if($("customThemeStatus"))$("customThemeStatus").textContent=showMessage&&!tv.valid?tv.message:"";if($("customReactionStatus"))$("customReactionStatus").textContent=showMessage&&!rv.valid?rv.message:"";}
function moveDraftReaction(chip,target){const from=Number(chip.dataset.index),to=Number(target.dataset.index);if(from===to||!Number.isInteger(from)||!Number.isInteger(to)||from<0||to<0||from>=customThemeDraft.reactionRefs.length||to>=customThemeDraft.reactionRefs.length)return;const[item]=customThemeDraft.reactionRefs.splice(from,1);customThemeDraft.reactionRefs.splice(to,0,item);renderCustomThemePicker();}
function wireLongPressReorder(chip){let timer=0,active=false,pointerId=null;const stop=()=>{clearTimeout(timer);timer=0;if(active){active=false;chip.classList.remove("reordering");document.body.classList.remove("custom-reorder-active");}if(pointerId!==null&&chip.hasPointerCapture?.(pointerId))chip.releasePointerCapture(pointerId);pointerId=null;};chip.addEventListener("pointerdown",e=>{if(e.button!==undefined&&e.button!==0)return;pointerId=e.pointerId;timer=setTimeout(()=>{active=true;chip.classList.add("reordering");document.body.classList.add("custom-reorder-active");chip.setPointerCapture?.(e.pointerId);navigator.vibrate?.(25);},CUSTOM_REORDER_HOLD_MS);});chip.addEventListener("pointermove",e=>{if(!active)return;e.preventDefault();const target=document.elementFromPoint(e.clientX,e.clientY)?.closest?.(".custom-expression-chip");if(target&&target!==chip)moveDraftReaction(chip,target);});chip.addEventListener("pointerup",stop);chip.addEventListener("pointercancel",stop);chip.addEventListener("lostpointercapture",stop);}
function renderCustomExpressionPreview(){const preview=$("customThemeExpressionPreview");if(!preview)return;preview.innerHTML="";if(!customThemeDraft.reactionRefs.length){preview.classList.add("empty");return;}preview.classList.remove("empty");customThemeDraft.reactionRefs.forEach((ref,index)=>{const record=reactionRecordFromRef(ref);const chip=document.createElement("button");chip.type="button";chip.className="custom-expression-chip";chip.dataset.index=String(index);chip.title=record?.label||"Missing reaction";chip.innerHTML=`<span aria-hidden="true">${record?.emoji||"?"}</span><i aria-hidden="true">×</i>`;chip.querySelector("i")?.addEventListener("click",e=>{e.stopPropagation();customThemeDraft.reactionRefs.splice(index,1);renderCustomThemePicker();});wireLongPressReorder(chip);preview.appendChild(chip);});}
function renderCustomThemePicker(){const root=$("customThemeReactionPicker");if(!root)return;root.innerHTML="";allReactionRecords().forEach(record=>{const ref={type:record.type,id:record.id},key=reactionRefKey(ref),selected=customThemeDraft.reactionRefs.some(item=>reactionRefKey(item)===key);const b=document.createElement("button");b.type="button";b.className="custom-reaction-choice"+(selected?" selected":"");b.innerHTML=`<span>${record.emoji}</span>`;b.title=record.label;b.setAttribute("aria-label",record.label);b.addEventListener("click",()=>{const index=customThemeDraft.reactionRefs.findIndex(item=>reactionRefKey(item)===key);if(index>=0)customThemeDraft.reactionRefs.splice(index,1);else customThemeDraft.reactionRefs.push(ref);renderCustomThemePicker();});root.appendChild(b);});renderCustomExpressionPreview();updateCustomDialogValidation();}
function safelyShowDialog(dialog){
  if(!dialog)return false;
  dialog.hidden=false;
  dialog.style.removeProperty("display");
  try{
    if(!dialog.open&&typeof dialog.showModal==="function")dialog.showModal();
    if(!dialog.open)dialog.setAttribute("open","");
  }catch(error){
    console.warn("Dialog fallback",error);
    dialog.setAttribute("open","");
  }
  dialog.style.zIndex="2147483000";
  return true;
}
function openCustomReactionDialog(record=null){customReactionDraft.editingId=record?.id||null;if($("customReactionDialogTitle"))$("customReactionDialogTitle").textContent=record?"Edit Custom Reaction":"Add Custom Reaction";if($("customReactionLabel"))$("customReactionLabel").value=record?.label||"";if($("customReactionEmoji"))$("customReactionEmoji").value=record?.emoji||"";if($("customReactionDeleteBtn"))$("customReactionDeleteBtn").hidden=!record;if($("customReactionStatus"))$("customReactionStatus").textContent="";updateCustomDialogValidation();const dialog=$("customReactionDialog");safelyShowDialog(dialog);requestAnimationFrame(()=>$("customReactionLabel")?.focus());}
function openCustomThemeDialog(record=null){customThemeDraft.editingId=record?.id||null;customThemeDraft.reactionRefs=normalizedReactionRefs(record||{});if($("customThemeDialogTitle"))$("customThemeDialogTitle").textContent=record?"Edit Custom Theme":"Add Custom Theme";if($("customThemeLabel"))$("customThemeLabel").value=record?.label||"";if($("customThemeDeleteBtn"))$("customThemeDeleteBtn").hidden=!record;if($("customThemeStatus"))$("customThemeStatus").textContent="";renderCustomThemePicker();const dialog=$("customThemeDialog");safelyShowDialog(dialog);requestAnimationFrame(()=>$("customThemeLabel")?.focus());}
window.openCustomReactionDialog=openCustomReactionDialog;window.openCustomThemeDialog=openCustomThemeDialog;window.saveCustomReactionFromDialog=saveCustomReactionFromDialog;window.saveCustomThemeFromDialog=saveCustomThemeFromDialog;
async function saveCustomReactionFromDialog(){const validation=customReactionValidation();if(!validation.valid){updateCustomDialogValidation(true);return;}const label=$("customReactionLabel").value.trim(),emoji=$("customReactionEmoji").value.trim(),id=`custom-reaction:${slugifyCustom(label)}`,before=(state.customReactions||[]).find(x=>x.id===customReactionDraft.editingId);const record=normalizeCustomReaction({...(before||{}),id,label,emoji,updatedAt:new Date().toISOString()});saveCustomReactions([...(state.customReactions||[]).filter(x=>x.id!==customReactionDraft.editingId),record]);try{if(before)await registerVocabularyMutation("major","custom reaction edited");else if(taxonomyHasBeenUsed())await registerVocabularyMutation("major","custom reaction added");}catch(error){console.warn("Custom reaction vocabulary log failed",error);}$("customReactionDialog")?.close();tabletLandscapeView.face="judgment";tabletLandscapeView.customs=true;renderAll();renderLandscapeCustoms();renderCustomThemePicker();}
async function saveCustomThemeFromDialog(){const validation=customThemeValidation();if(!validation.valid){updateCustomDialogValidation(true);return;}const label=$("customThemeLabel").value.trim(),id=`custom-theme:${slugifyCustom(label)}`,before=(state.customThemes||[]).find(x=>x.id===customThemeDraft.editingId);const record=normalizeCustomThemeRecord({...(before||{}),id,label,reactionRefs:customThemeDraft.reactionRefs,updatedAt:new Date().toISOString()});saveCustomThemes([...(state.customThemes||[]).filter(x=>x.id!==customThemeDraft.editingId),record]);try{if(before)await registerVocabularyMutation("patch","custom theme edited");else if(taxonomyHasBeenUsed())await registerVocabularyMutation("minor","custom theme added");}catch(error){console.warn("Custom theme vocabulary log failed",error);}$("customThemeDialog")?.close();tabletLandscapeView.face="judgment";tabletLandscapeView.customs=true;renderWriteIns();renderAll();renderLandscapeCustoms();}
async function deleteCustomTheme(){const id=customThemeDraft.editingId,record=(state.customThemes||[]).find(x=>x.id===id);if(!record||!confirm(`Delete custom theme “${record.label}”?`))return;saveCustomThemes((state.customThemes||[]).filter(x=>x.id!==id));try{if(taxonomyHasBeenUsed())await registerVocabularyMutation("minor","custom theme deleted");}catch(error){console.warn("Custom theme delete log failed",error);}$("customThemeDialog")?.close();tabletLandscapeView.face="judgment";tabletLandscapeView.customs=true;renderAll();renderLandscapeCustoms();}
async function deleteCustomReaction(){const id=customReactionDraft.editingId,record=(state.customReactions||[]).find(x=>x.id===id);if(!record||!confirm(`Delete custom reaction “${record.label}”? Themes using it will retain a missing-reference marker until edited.`))return;saveCustomReactions((state.customReactions||[]).filter(x=>x.id!==id));state.selectedReactions=state.selectedReactions.filter(x=>x!==customReactionSelectionToken(id));saveCurrent("director-custom-reaction-delete");try{if(taxonomyHasBeenUsed())await registerVocabularyMutation("major","custom reaction deleted");}catch(error){console.warn("Custom reaction delete log failed",error);}$("customReactionDialog")?.close();tabletLandscapeView.face="judgment";tabletLandscapeView.customs=true;renderAll();renderLandscapeCustoms();renderCustomThemePicker();}
function reorderCustomLibrary(kind,fromId,toId){const isTheme=kind==="theme",items=[...(isTheme?state.customThemes:state.customReactions)],from=items.findIndex(x=>x.id===fromId),to=items.findIndex(x=>x.id===toId);if(from<0||to<0||from===to)return;const[item]=items.splice(from,1);items.splice(to,0,item);isTheme?saveCustomThemes(items):saveCustomReactions(items);renderLandscapeCustoms();}
function wireLibraryReorder(node,kind,id){let timer=0,active=false,pointerId=null,moved=false,suppressClick=false;const list=node.parentElement;const saveDomOrder=()=>{if(!list)return;const ids=[...list.querySelectorAll(`.landscape-custom-item[data-kind="${kind}"]`)].map(item=>item.dataset.id);const source=kind==="theme"?(state.customThemes||[]):(state.customReactions||[]);const byId=new Map(source.map(item=>[item.id,item]));const ordered=ids.map(key=>byId.get(key)).filter(Boolean);source.forEach(item=>{if(!ids.includes(item.id))ordered.push(item);});kind==="theme"?saveCustomThemes(ordered):saveCustomReactions(ordered);};const finish=e=>{clearTimeout(timer);timer=0;if(active){active=false;node.classList.remove("reordering");document.body.classList.remove("custom-reorder-active");if(moved)saveDomOrder();suppressClick=true;setTimeout(()=>{suppressClick=false;},0);}if(pointerId!==null&&node.hasPointerCapture?.(pointerId))node.releasePointerCapture(pointerId);pointerId=null;moved=false;};node.addEventListener("click",e=>{if(suppressClick){e.preventDefault();e.stopImmediatePropagation();}},true);node.addEventListener("pointerdown",e=>{if(e.button!==undefined&&e.button!==0)return;pointerId=e.pointerId;moved=false;timer=setTimeout(()=>{active=true;node.classList.add("reordering");document.body.classList.add("custom-reorder-active");node.setPointerCapture?.(e.pointerId);navigator.vibrate?.(25);},CUSTOM_REORDER_HOLD_MS);});node.addEventListener("pointermove",e=>{if(!active)return;e.preventDefault();const target=document.elementFromPoint(e.clientX,e.clientY)?.closest?.(`.landscape-custom-item[data-kind="${kind}"]`);if(!target||target===node||target.parentElement!==list)return;const rect=target.getBoundingClientRect();const after=e.clientY>rect.top+rect.height/2;list.insertBefore(node,after?target.nextSibling:target);moved=true;});node.addEventListener("pointerup",finish);node.addEventListener("pointercancel",finish);node.addEventListener("lostpointercapture",finish);}
function customUsageCounts(){
  const reactionCounts=new Map(),themeCounts=new Map();
  const countRecord=record=>{
    (record?.selectedReactions||record?.reactions||[]).forEach(value=>{
      if(typeof value!=="string"||!value.startsWith("custom:"))return;
      const id=value.slice(7);reactionCounts.set(id,(reactionCounts.get(id)||0)+1);
    });
    (record?.themes||[]).forEach(value=>{
      const theme=normalizeTheme(value);if(!theme?.id||!(theme.kind==="customTheme"||String(theme.id).startsWith("custom-theme:")))return;
      themeCounts.set(theme.id,(themeCounts.get(theme.id)||0)+1);
    });
  };
  Object.values(state.records||{}).forEach(countRecord);
  return {reactionCounts,themeCounts};
}
function sortLandscapeCustoms(items,kind){
  const cfg=landscapeCustomSort[kind],usage=customUsageCounts(),counts=kind==="reactions"?usage.reactionCounts:usage.themeCounts;
  const direction=cfg.direction==="desc"?-1:1;
  return [...items].sort((a,b)=>{
    let result=0;
    if(cfg.mode==="date") result=String(a.createdAt||"").localeCompare(String(b.createdAt||""));
    else if(cfg.mode==="top") result=(counts.get(a.id)||0)-(counts.get(b.id)||0);
    else result=String(a.label||"").localeCompare(String(b.label||""),undefined,{sensitivity:"base"});
    if(result===0) result=String(a.label||"").localeCompare(String(b.label||""),undefined,{sensitivity:"base"});
    return result*direction;
  });
}
function createLandscapeCustomChip(item,kind){
  const isReaction=kind==="reaction";
  const chip=document.createElement("div");
  chip.className="customs-chip";
  chip.dataset.kind=kind;chip.dataset.id=item.id;
  const main=document.createElement("button");
  main.type="button";main.className="customs-chip-main";
  if(isReaction){
    const token=customReactionSelectionToken(item.id);
    main.classList.toggle("selected",state.selectedReactions.includes(token));
    main.innerHTML=`<span class="customs-chip-emoji">${item.emoji}</span><span>${item.label}</span>`;
    main.setAttribute("aria-pressed",String(state.selectedReactions.includes(token)));
    main.addEventListener("click",()=>{pushHistory();const n=state.selectedReactions.indexOf(token);if(n>=0)state.selectedReactions.splice(n,1);else state.selectedReactions.push(token);saveCurrent("director-custom-reaction-auto");renderAll();});
  }else{
    main.textContent=item.label;
    main.addEventListener("click",()=>{if(tabletLandscapeView.activeThemeSlot===null)return;state.targetSlot=tabletLandscapeView.activeThemeSlot;selectTheme(item);});
  }
  const edit=document.createElement("button");
  edit.type="button";edit.className="customs-chip-edit";edit.textContent="✎";edit.title="Edit";edit.setAttribute("aria-label",`Edit ${item.label}`);
  edit.addEventListener("click",e=>{e.stopPropagation();isReaction?openCustomReactionDialog(item):openCustomThemeDialog(item);});
  chip.append(main,edit);
  return chip;
}
function setLandscapeCustomsTab(tab,{focusSearch=false}={}){
  const valid=["search","reactions","themes"];if(!valid.includes(tab))tab="search";
  tabletLandscapeView.customsTab=tab;
  const map={search:["tabletCustomSearchTab","tabletCustomSearchPanel"],reactions:["tabletCustomReactionsTab","tabletCustomReactionsPanel"],themes:["tabletCustomThemesTab","tabletCustomThemesPanel"]};
  Object.entries(map).forEach(([key,[tabId,panelId]])=>{
    const active=key===tab,b=$(tabId),panel=$(panelId);if(b){b.classList.toggle("active",active);b.setAttribute("aria-selected",String(active));}if(panel)panel.hidden=!active;
  });
  if(focusSearch&&tab==="search")requestAnimationFrame(()=>$('tabletCustomSearch')?.focus());
}
function renderLandscapeCustoms(){
  const reactionScroller=$("tabletCustomReactionList"),themeScroller=$("tabletCustomThemeList"),searchScroller=document.querySelector("#tabletCustomSearchPanel .customs-search-results");
  if(reactionScroller)landscapeCustomScroll.reactions=reactionScroller.scrollTop;
  if(themeScroller)landscapeCustomScroll.themes=themeScroller.scrollTop;
  if(searchScroller)landscapeCustomScroll.search=searchScroller.scrollTop;
  const q=$('tabletCustomSearch')?.value.trim().toLowerCase()||"";
  const themes=state.customThemes||[],reactions=state.customReactions||[];
  const themeList=$('tabletCustomThemeList'),reactionList=$('tabletCustomReactionList');
  if(themeList){themeList.innerHTML="";sortLandscapeCustoms(themes,"themes").forEach(item=>themeList.appendChild(createLandscapeCustomChip(item,"theme")));}
  if(reactionList){reactionList.innerHTML="";sortLandscapeCustoms(reactions,"reactions").forEach(item=>reactionList.appendChild(createLandscapeCustomChip(item,"reaction")));}
  const searchThemes=$('tabletCustomSearchThemeList'),searchReactions=$('tabletCustomSearchReactionList');
  const themeMatches=themes.filter(item=>!q||item.label.toLowerCase().includes(q));
  const reactionMatches=reactions.filter(item=>!q||item.label.toLowerCase().includes(q)||item.emoji.includes(q));
  if(searchThemes){searchThemes.innerHTML="";[...themeMatches].sort((a,b)=>a.label.localeCompare(b.label,undefined,{sensitivity:"base"})).forEach(item=>searchThemes.appendChild(createLandscapeCustomChip(item,"theme")));}
  if(searchReactions){searchReactions.innerHTML="";[...reactionMatches].sort((a,b)=>a.label.localeCompare(b.label,undefined,{sensitivity:"base"})).forEach(item=>searchReactions.appendChild(createLandscapeCustomChip(item,"reaction")));}
  if($('tabletCustomSearchThemeGroup'))$('tabletCustomSearchThemeGroup').hidden=themeMatches.length===0;
  if($('tabletCustomSearchReactionGroup'))$('tabletCustomSearchReactionGroup').hidden=reactionMatches.length===0;
  setLandscapeCustomsTab(tabletLandscapeView.customsTab||"search");
  requestAnimationFrame(()=>{
    if($("tabletCustomReactionList"))$("tabletCustomReactionList").scrollTop=landscapeCustomScroll.reactions;
    if($("tabletCustomThemeList"))$("tabletCustomThemeList").scrollTop=landscapeCustomScroll.themes;
    const scroller=document.querySelector("#tabletCustomSearchPanel .customs-search-results");if(scroller)scroller.scrollTop=landscapeCustomScroll.search;
  });
}
$("addCustomReactionBtn")?.addEventListener("click",()=>openCustomReactionDialog());
$("addCustomThemeBtn")?.addEventListener("click",()=>openCustomThemeDialog());
if($("tabletAddCustomThemeBtn")) $("tabletAddCustomThemeBtn").onclick=e=>{e.preventDefault();e.stopPropagation();openCustomThemeDialog();};
if($("tabletAddCustomReactionBtn")) $("tabletAddCustomReactionBtn").onclick=e=>{e.preventDefault();e.stopPropagation();openCustomReactionDialog();};
// v0.9.39.40: hard entry routing for Customs controls on mobile/Fold.
document.addEventListener("click",e=>{const target=e.target?.closest?.("#tabletAddCustomThemeBtn,#tabletAddCustomReactionBtn");if(!target)return;e.preventDefault();e.stopImmediatePropagation();if(target.id==="tabletAddCustomThemeBtn")openCustomThemeDialog();else openCustomReactionDialog();},true);
$("customReactionSaveBtn")?.addEventListener("click",saveCustomReactionFromDialog);
$("customThemeSaveBtn")?.addEventListener("click",saveCustomThemeFromDialog);
$("customReactionDeleteBtn")?.addEventListener("click",deleteCustomReaction);
$("customThemeDeleteBtn")?.addEventListener("click",deleteCustomTheme);
$("customThemeLabel")?.addEventListener("input",()=>updateCustomDialogValidation());
$("customReactionLabel")?.addEventListener("input",()=>updateCustomDialogValidation());
$("customReactionEmoji")?.addEventListener("input",()=>updateCustomDialogValidation());
$("tabletCustomSearch")?.addEventListener("input",renderLandscapeCustoms);
$("tabletCustomSearch")?.addEventListener("focus",()=>{document.documentElement.classList.add("landscape-keyboard-open");document.documentElement.classList.add("customs-search-focused");});
$("tabletCustomSearch")?.addEventListener("blur",()=>{document.documentElement.classList.remove("landscape-keyboard-open");document.documentElement.classList.remove("customs-search-focused");});
$("tabletCustomSearchTab")?.addEventListener("click",()=>setLandscapeCustomsTab("search",{focusSearch:false}));
$("tabletCustomReactionsTab")?.addEventListener("click",()=>setLandscapeCustomsTab("reactions"));
$("tabletCustomThemesTab")?.addEventListener("click",()=>setLandscapeCustomsTab("themes"));
[["tabletCustomReactionSort","reactions"],["tabletCustomThemeSort","themes"]].forEach(([id,kind])=>$(id)?.addEventListener("change",e=>{
  const cfg=landscapeCustomSort[kind];cfg.mode=e.target.value;cfg.direction=cfg.mode==="alpha"?"asc":"desc";
  const dir=$(kind==="reactions"?"tabletCustomReactionSortDirection":"tabletCustomThemeSortDirection");
  if(dir){dir.textContent=cfg.direction==="asc"?"↑":"↓";dir.setAttribute("aria-label",cfg.direction==="asc"?"Sort ascending":"Sort descending");dir.setAttribute("aria-pressed",String(cfg.direction==="desc"));}
  renderLandscapeCustoms();
}));
[["tabletCustomReactionSortDirection","reactions"],["tabletCustomThemeSortDirection","themes"]].forEach(([id,kind])=>$(id)?.addEventListener("click",e=>{const cfg=landscapeCustomSort[kind];cfg.direction=cfg.direction==="asc"?"desc":"asc";e.currentTarget.textContent=cfg.direction==="asc"?"↑":"↓";e.currentTarget.setAttribute("aria-label",cfg.direction==="asc"?"Sort ascending":"Sort descending");e.currentTarget.setAttribute("aria-pressed",String(cfg.direction==="desc"));renderLandscapeCustoms();}));
$$("[data-close-custom-dialog]").forEach(button=>button.addEventListener("click",()=>$(button.dataset.closeCustomDialog)?.close()));

window.addEventListener("resize",()=>requestAnimationFrame(fitLandscapeAiDescription));

// v0.9.39.24 — keep the focused Customs search visible above Android keyboards.
if(window.visualViewport){
  const syncViewport=()=>{document.documentElement.style.setProperty("--visual-viewport-height",`${window.visualViewport.height}px`);document.documentElement.style.setProperty("--visual-viewport-offset-top",`${window.visualViewport.offsetTop||0}px`);document.documentElement.style.setProperty("--visual-viewport-offset-left",`${window.visualViewport.offsetLeft||0}px`);};
  window.visualViewport.addEventListener("resize",syncViewport);
  window.visualViewport.addEventListener("scroll",syncViewport);
  syncViewport();
}
