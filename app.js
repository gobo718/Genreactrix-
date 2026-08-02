const PRIMITIVES = [
  {name:"Celebration",symbol:"🎉"},
  {name:"Smart",symbol:"🧠"},
  {name:"Eerie",symbol:"👻"},
  {name:"Disgusting",symbol:"🤢"},
  {name:"Zazzly",symbol:"🌶️"},
  {name:"Dreamy",symbol:"🌌"},
  {name:"Hell",symbol:"🎟️"},
  {name:"Funny",symbol:"🤣"},
  {name:"Adorable",symbol:"🧸"},
  {name:"Weird",symbol:"🌀"},
  {name:"Intense",symbol:"💥"},
  {name:"Beautiful",symbol:"✨"},
  {name:"Tragic",symbol:"😭"}
];


const CANONICAL_MATRIX_LABELS = {
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

function canonicalMatrixLabel(firstName, secondName){
  const key=[firstName,secondName].sort().join("|");
  return CANONICAL_MATRIX_LABELS[key] || (firstName===secondName ? firstName : `${firstName} + ${secondName}`);
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
    aiPrimitives:[["Wonder",94],["Beauty",79],["Comfort",61]]
  },
  {
    src: svgData("MUTOSIS","🐙","🫖"),
    description:"An octopus–teapot hybrid with domestic and aquatic visual cues. The humor comes from treating an object as a living creature.",
    aiThemes:[["Aquatic",93],["Comedy",77],["Domestic",65]],
    aiPrimitives:[["Humor",91],["Surreal",85],["Curiosity",72]]
  },
  {
    src: svgData("MUTOSIS","🐈","🌙"),
    description:"A cat merged with a crescent moon. The image reads as nocturnal fantasy with celestial and magical themes.",
    aiThemes:[["Celestial",94],["Magic",89],["Fantasy",86]],
    aiPrimitives:[["Beauty",88],["Awe",76],["Comfort",64]]
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
  objectUrls: []
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
function currentAiThemes(){ return state.files.length ? [["Fantasy",91],["Nature",66],["Surreal",43]] : currentDemo().aiThemes; }
function currentAiPrimitives(){ return state.files.length ? [["Wonder",86],["Curiosity",72],["Surreal",58]] : currentDemo().aiPrimitives; }

function snapshot(){
  return JSON.parse(JSON.stringify({
    key: currentKey(),
    selectedReactions: state.selectedReactions,
    themes: state.themes,
    flagged: state.flagged,
    writeIn: state.writeIn,
    retention: state.retention
  }));
}
function pushHistory(){
  state.history.push(snapshot());
  if(state.history.length>100) state.history.shift();
  state.future=[];
  updateUndoRedo();
}
function restoreSnapshot(s){
  state.selectedReactions=[...s.selectedReactions];
  state.themes=[...s.themes];
  state.flagged=!!s.flagged;
  state.writeIn=s.writeIn||"";
  state.retention=s.retention||"keep";
  renderAll();
}
function saveCurrent(){
  state.records[currentKey()] = snapshot();
  localStorage.setItem("genreactrix-v0.8.0-records", JSON.stringify(state.records));
}
function loadCurrent(){
  const rec=state.records[currentKey()];
  state.selectedReactions=rec ? [...rec.selectedReactions] : [];
  state.themes=rec ? [...rec.themes] : [null,null,null];
  state.flagged=rec ? !!rec.flagged : false;
  state.writeIn=rec ? (rec.writeIn||"") : "";
  state.retention=rec ? (rec.retention||"keep") : "keep";
  renderAll();
}
function commitAndAdvance(){
  saveCurrent();
  nextImage();
}
function nextImage(){
  if(state.files.length){
    state.index=(state.index+1)%state.files.length;
  }else{
    state.demoIndex=(state.demoIndex+1)%DEMOS.length;
  }
  loadCurrent();
}
function prevImage(){
  if(state.files.length){
    state.index=(state.index-1+state.files.length)%state.files.length;
  }else{
    state.demoIndex=(state.demoIndex-1+DEMOS.length)%DEMOS.length;
  }
  loadCurrent();
}

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
    const value=state.themes[i] || "—";
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
  const description=currentDescription();
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
function renderAi(){
  const targets=[
    [$("aiPrimitives"),$("aiThemes")],
    [$("tabletAiPrimitives"),$("tabletAiThemes")]
  ];
  targets.forEach(([prim,themes])=>{
    if(!prim || !themes) return;
    prim.innerHTML=""; themes.innerHTML="";
    currentAiPrimitives().forEach(([label,confidence])=>prim.appendChild(aiSuggestion(label,confidence,false)));
    currentAiThemes().forEach(([label,confidence])=>themes.appendChild(aiSuggestion(label,confidence,true)));
  });
}
function aiSuggestion(label,confidence,isTheme){
  const b=document.createElement("button");
  b.className="ai-suggestion";
  b.innerHTML=`<span>${label}</span><strong>${confidence}%</strong>`;
  if(isTheme) b.addEventListener("click",()=>selectTheme(label));
  return b;
}
function renderComparison(){
  const directorReactionIndexes=[...state.selectedReactions];
  const directorReactionHtml=directorReactionIndexes.length
    ? directorReactionIndexes.map(i=>`<span class="comparison-reaction" title="${PRIMITIVES[i].name}">${PRIMITIVES[i].symbol}</span>`).join("")
    : "—";
  const directorThemes=state.themes.filter(Boolean);
  const aiReactions=currentAiPrimitives();
  const aiThemes=currentAiThemes();

  $("inspectionDirectorReactions").innerHTML=directorReactionHtml;
  $("inspectionDirectorThemes").textContent=directorThemes.length ? directorThemes.join(", ") : "—";
  $("inspectionAiReactions").textContent=aiReactions.length
    ? aiReactions.map(([label,confidence])=>`${label} ${confidence}%`).join(", ")
    : "—";
  $("inspectionAiThemes").textContent=aiThemes.length
    ? aiThemes.map(([label,confidence])=>`${label} ${confidence}%`).join(", ")
    : "—";

  $("profileRetention").textContent=state.retention;
  $("profileFlagged").textContent=state.flagged ? "Yes" : "No";
}
function renderAll(){
  renderImage(); renderReactions(); renderThemes(); renderFlag(); renderDirectorFields(); renderAi(); renderComparison(); updateUndoRedo();
  renderTabletTargetSlots();
  renderThemeMatrix($("tabletThemeSearch")?.value || "", "tabletThemeMatrix");
}

function openThemeWorkspace(slot=1){
  state.targetSlot=Number(slot);
  renderTargetSlot(true);
  $("themeSearch").value="";
  renderThemeMatrix("");
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
function renderThemeMatrix(filter, targetId="themeMatrix"){
  const matrix=$(targetId);
  if(!matrix) return;
  matrix.innerHTML="";

  const q=(filter||"").trim().toLowerCase();
  const tabletSingleGrid=targetId==="tabletThemeMatrix";
  const bands=tabletSingleGrid
    ? [PRIMITIVES.map((_,index)=>index)]
    : [[0,1,2,3],[4,5,6,7,8],[9,10,11,12]];

  bands.forEach((columnIndexes,bandIndex)=>{
    const section=document.createElement("section");
    section.className="true-matrix-band";
    if(tabletSingleGrid) section.classList.add("single-13-matrix");

    if(!tabletSingleGrid){
      const title=document.createElement("div");
      title.className="matrix-band-title";
      title.textContent=`Theme matrix ${bandIndex+1} of ${bands.length}`;
      section.appendChild(title);
    }

    const scroller=document.createElement("div");
    scroller.className="matrix-scroller";

    const grid=document.createElement("div");
    grid.className="true-matrix-grid";
    grid.style.setProperty("--band-columns", columnIndexes.length);

    const corner=document.createElement("div");
    corner.className="matrix-corner";
    corner.textContent="×";
    grid.appendChild(corner);

    columnIndexes.forEach(ci=>{
      const col=PRIMITIVES[ci];
      const head=document.createElement("button");
      head.className="matrix-axis-header matrix-column-header";
      head.type="button";
      head.innerHTML=`<span>${col.symbol}</span><small>${col.name}</small>`;
      head.title=`Select ${col.name}`;
      head.addEventListener("click",()=>selectTheme(col.name));
      grid.appendChild(head);
    });

    PRIMITIVES.forEach((row,ri)=>{
      const rowHead=document.createElement("button");
      rowHead.className="matrix-axis-header matrix-row-header";
      rowHead.type="button";
      rowHead.innerHTML=`<span>${row.symbol}</span><small>${row.name}</small>`;
      rowHead.title=`Select ${row.name}`;
      rowHead.addEventListener("click",()=>selectTheme(row.name));
      grid.appendChild(rowHead);

      columnIndexes.forEach(ci=>{
        const col=PRIMITIVES[ci];
        const combo = canonicalMatrixLabel(row.name,col.name);
        const cell=document.createElement("button");
        cell.type="button";
        cell.className="matrix-intersection";
        cell.innerHTML=ri===ci
          ? `<span class="matrix-combo-symbol">${row.symbol}</span><small class="matrix-combo-label">${row.name}</small>`
          : `<span class="matrix-combo-symbol">${row.symbol}${col.symbol}</span><small class="matrix-combo-label">${combo}</small>`;
        cell.title=combo;
        const visible=!q || combo.toLowerCase().includes(q);
        cell.hidden=!visible;
        cell.addEventListener("click",()=>selectTheme(combo));
        grid.appendChild(cell);
      });
    });

    scroller.appendChild(grid);
    section.appendChild(scroller);
    matrix.appendChild(section);
  });

  const directMatches=[...BASE_THEMES,...state.writeIns]
    .filter(t=>!q || t.toLowerCase().includes(q))
    .slice(0,20);

  if(directMatches.length){
    const quick=document.createElement("section");
    quick.className="quick-theme-results";
    const heading=document.createElement("div");
    heading.className="matrix-band-title";
    heading.textContent=q ? "Matching established Themes" : "Established Themes";
    quick.appendChild(heading);
    const wrap=document.createElement("div");
    wrap.className="quick-theme-buttons";
    directMatches.forEach(t=>{
      const b=document.createElement("button");
      b.type="button";
      b.textContent=t;
      b.addEventListener("click",()=>selectTheme(t));
      wrap.appendChild(b);
    });
    quick.appendChild(wrap);
    matrix.prepend(quick);
  }

  requestAnimationFrame(()=>autoFitMatrixLabels(matrix));
}
function renderWriteIns(){
  const list=$("writeinList"); list.innerHTML="";
  state.writeIns.forEach(t=>{
    const b=document.createElement("button"); b.textContent=t;
    b.addEventListener("click",()=>selectTheme(t)); list.appendChild(b);
  });
}
function selectTheme(theme){
  const target=state.targetSlot-1;
  const duplicate=state.themes.some((t,i)=>i!==target && t===theme);
  if(duplicate){
    const message=`“${theme}” is already selected in another Theme field. Choose a different Theme or clear the duplicate first.`;
    $("themeError").textContent=message;
    $("tabletThemeError").textContent=message;
    return;
  }
  pushHistory();
  state.themes[target]=theme;
  saveCurrent(); renderThemes(); renderComparison();
  if(state.targetSlot===1){
    if($("themeWorkspace").open) $("themeWorkspace").close();
    commitAndAdvance();
  }else{
    const message=`Theme ${state.targetSlot} set to ${theme}. Choose Theme 1 when ready to commit and advance.`;
    $("themeError").textContent=message;
    $("tabletThemeError").textContent=message;
  }
}


const MATRIX_LABEL_FIT = {
  preferredPx: 9,
  stepPx: 0.25,
  allowedShrinkRatio: 0.15
};

function matrixAutoFitEntries(root=document){
  return [...root.querySelectorAll(".matrix-axis-header, .matrix-intersection")]
    .filter(square=>{
      if(square.hidden) return false;
      const style=getComputedStyle(square);
      return style.display!=="none" && style.visibility!=="hidden";
    })
    .map(square=>{
      const label=square.matches(".matrix-axis-header")
        ? square.querySelector("small")
        : square.querySelector(".matrix-combo-label");
      return label ? {square,label} : null;
    })
    .filter(Boolean);
}

function matrixAvailableWidth(entry){
  const squareStyle=getComputedStyle(entry.square);
  return Math.max(0, entry.square.clientWidth
    - parseFloat(squareStyle.paddingLeft||0)
    - parseFloat(squareStyle.paddingRight||0));
}

function matrixLabelOverflows(entry){
  return entry.label.scrollWidth > matrixAvailableWidth(entry) + 0.5;
}

function fitMatrixLabelExactly(entry, startPx){
  let size=startPx;
  entry.label.style.fontSize=`${size}px`;
  for(let attempt=0; attempt<8 && matrixLabelOverflows(entry); attempt+=1){
    const available=matrixAvailableWidth(entry);
    const measured=Math.max(entry.label.scrollWidth, 0.01);
    size=+(size * (available/measured) * 0.985).toFixed(3);
    entry.label.style.fontSize=`${size}px`;
  }
  return size;
}

function autoFitMatrixLabels(root=document){
  const entries=matrixAutoFitEntries(root);
  if(!entries.length) return;

  const {stepPx,allowedShrinkRatio}=MATRIX_LABEL_FIT;
  entries.forEach(({label})=>{
    label.style.fontSize="";
    label.classList.remove("autofit-shrunk","autofit-ellipsized");
    label.removeAttribute("title");
  });
  entries.forEach(entry=>{
    entry.preferredPx=parseFloat(getComputedStyle(entry.label).fontSize) || MATRIX_LABEL_FIT.preferredPx;
  });

  const allowedShrinkCount=Math.floor(entries.length*allowedShrinkRatio);
  let globalReductionPx=0;
  for(let guard=0;guard<80;guard+=1){
    let overflowCount=0;
    entries.forEach(entry=>{
      const size=Math.max(0.1,entry.preferredPx-globalReductionPx);
      entry.label.style.fontSize=`${size}px`;
      if(matrixLabelOverflows(entry)) overflowCount+=1;
    });
    if(overflowCount<=allowedShrinkCount) break;
    globalReductionPx=+(globalReductionPx+stepPx).toFixed(2);
  }

  entries.forEach(entry=>{
    const sharedSize=Math.max(0.1,entry.preferredPx-globalReductionPx);
    const finalSize=matrixLabelOverflows(entry)
      ? fitMatrixLabelExactly(entry,sharedSize)
      : sharedSize;
    entry.label.dataset.autofitSize=String(finalSize);
    entry.label.classList.toggle("autofit-shrunk",finalSize<sharedSize-0.01);
  });

  root.dataset.autofitVisibleCount=String(entries.length);
  root.dataset.autofitAllowedShrinkCount=String(allowedShrinkCount);
  root.dataset.autofitGlobalReductionPx=String(globalReductionPx);
}

function renderTabletTargetSlots(){
  document.querySelectorAll("[data-tablet-target-slot]").forEach(button=>{
    button.classList.toggle("active", Number(button.dataset.tabletTargetSlot)===state.targetSlot);
  });
}

function updateTabletSearch(){
  const q=$("tabletThemeSearch").value.trim();
  renderThemeMatrix(q,"tabletThemeMatrix");
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
  renderThemeMatrix(q,"tabletThemeMatrix");
  $("tabletThemeError").textContent=`Created “${q}”. Select it normally for Theme ${state.targetSlot}.`;
}

function updateSearch(){
  const q=$("themeSearch").value.trim();
  renderThemeMatrix(q);
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
  if(!state.history.length) return;
  state.future.push(snapshot());
  restoreSnapshot(state.history.pop());
}
function redo(){
  if(!state.future.length) return;
  state.history.push(snapshot());
  restoreSnapshot(state.future.pop());
}
function updateUndoRedo(){
  $("undoBtn").disabled=!state.history.length;
  $("redoBtn").disabled=!state.future.length;
}

document.addEventListener("click",e=>{
  const opener=e.target.closest("[data-open]");
  if(opener) $(opener.dataset.open).showModal();
  const closer=e.target.closest("[data-close]");
  if(closer) $(closer.dataset.close).close();
  const themeField=e.target.closest(".theme-field");
  if(themeField) openThemeWorkspace(themeField.dataset.slot);
});

$("openAiBtn").addEventListener("click",()=> $("aiWorkspace").showModal());
$("directorMatrixBtn").addEventListener("click",()=>{
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
$("resetOriginalBtn").addEventListener("click",()=>{pushHistory(); state.selectedReactions=[]; state.themes=[null,null,null]; state.flagged=false; saveCurrent(); renderAll();});
$("clearCurrentBtn").addEventListener("click",()=>{pushHistory(); state.selectedReactions=[]; state.themes=[null,null,null]; saveCurrent(); renderAll();});

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
  document.documentElement.style.setProperty("--image-console-fr",layoutState.imageFraction);
  document.documentElement.style.setProperty("--director-console-fr",layoutState.directorFraction);
  document.documentElement.style.setProperty("--ai-console-fr",layoutState.aiFraction);
  $("app").querySelector(".base-layout").classList.toggle("divider-locked",layoutState.locked);
  document.querySelector(".image-console").classList.toggle("supporting-collapsed",layoutState.imageCollapsed);
  $("lockDividerBtn").setAttribute("aria-pressed",layoutState.locked);
  $("lockDividerBtn").textContent=layoutState.locked?"🔒 Layout":"🔓 Layout";
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
  "matrix-analysis":{imageFraction:.82,directorFraction:1.02,aiFraction:.82,imageCollapsed:true}
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
const initialWorkspaceProfile=localStorage.getItem(WORKSPACE_PROFILE_KEY)||"classification";
$("workspaceProfileSelect").value=initialWorkspaceProfile in WORKSPACE_PROFILES?initialWorkspaceProfile:"classification";
refreshSavedLayouts();

try{
  state.records=JSON.parse(localStorage.getItem("genreactrix-v0.8.0-records")||localStorage.getItem("genreactrix-v0.7.0-records")||"{}");
  state.writeIns=JSON.parse(localStorage.getItem("genreactrix-v0.9.1-writeins")||localStorage.getItem("genreactrix-v0.8.0-writeins")||localStorage.getItem("genreactrix-v0.7.0-writeins")||'["Horror","Dreamcore"]');
}catch{}
renderAll();



// v0.9.1 Desktop Mode: image zoom/pan, keyboard workflow, and matrix navigation.
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
    const names=["classification","image-study","ai-review","matrix-analysis"];
    applyWorkspaceProfile(names[Number(e.key)-1]);
    return;
  }
  if(e.key.toLowerCase()==="n" || e.key==="ArrowRight"){e.preventDefault();nextImage();return;}
  if(e.key.toLowerCase()==="p" || e.key==="ArrowLeft"){e.preventDefault();prevImage();return;}
  if(e.key.toLowerCase()==="f"){$("directorFlagBtn").click();}
});
$("tabletThemeMatrix").addEventListener("keydown",e=>{
  if(!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) return;
  const buttons=[...$("tabletThemeMatrix").querySelectorAll("button:not([hidden])")];
  const index=buttons.indexOf(document.activeElement);
  if(index<0) return;
  e.preventDefault();
  const columns=14;
  const delta=e.key==="ArrowLeft"?-1:e.key==="ArrowRight"?1:e.key==="ArrowUp"?-columns:columns;
  buttons[Math.max(0,Math.min(buttons.length-1,index+delta))]?.focus();
});

let matrixFitResizeTimer;
window.addEventListener("resize",()=>{
  clearTimeout(matrixFitResizeTimer);
  matrixFitResizeTimer=setTimeout(()=>{autoFitMatrixLabels($("themeMatrix"));autoFitMatrixLabels($("tabletThemeMatrix"));},120);
});
