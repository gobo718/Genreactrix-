
const CATEGORY_NAMES = ['Joy','Wonder','Comfort','Beauty','Humor','Curiosity','Fear','Disgust','Sadness','Anger','Tension','Awe','Surreal'];
const STORAGE_KEY = 'genreactrix_workspace_v016';
const APP_VERSION = '0.3.13';
const WORKSPACE_SCHEMA_VERSION = 3;
const MAX_UNDO = 100;
const TAXONOMY_KEY = 'genreactrix_taxonomy_v018';
const DEFAULT_TAXONOMY = CATEGORY_NAMES.map((category, categoryIndex) => ({
  category,
  words: Array.from({length: 13}, (_, wordIndex) => `Word ${categoryIndex + 1}.${wordIndex + 1}`)
}));


function storageGet(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
}

function storageSet(key, value, context = 'Browser data') {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    const indicator = document.getElementById('saveStateIndicator');
    if (indicator) {
      indicator.textContent = 'Save failed';
      indicator.dataset.state = 'error';
      indicator.title = error?.message || 'Browser storage is unavailable.';
    }
    const status = document.getElementById('modeStatus');
    if (status) status.textContent = `${context} could not be saved. Export your workspace before closing this page.`;
    console.error(`Genreactrix ${context.toLowerCase()} save failed:`, error);
    return false;
  }
}

function storageGetJSON(key, fallback) {
  const raw = storageGet(key, '');
  if (!raw) return structuredClone(fallback);
  try {
    return JSON.parse(raw);
  } catch {
    return structuredClone(fallback);
  }
}

function loadTaxonomy() {
  try {
    const parsed = storageGetJSON(TAXONOMY_KEY, null);
    if (!Array.isArray(parsed) || parsed.length !== DEFAULT_TAXONOMY.length) return structuredClone(DEFAULT_TAXONOMY);
    return DEFAULT_TAXONOMY.map((fallback, index) => ({
      category: String(parsed[index]?.category || fallback.category).trim() || fallback.category,
      words: Array.from({length: 13}, (_, wordIndex) => {
        const value = parsed[index]?.words?.[wordIndex];
        return String(value || fallback.words[wordIndex]).trim() || fallback.words[wordIndex];
      })
    }));
  } catch {
    return structuredClone(DEFAULT_TAXONOMY);
  }
}

let taxonomy = loadTaxonomy();

const el = {
  folder: document.getElementById('folder'),
  fileSearch: document.getElementById('fileSearch'),
  jumpFile: document.getElementById('jumpFile'),
  image: document.getElementById('image'),
  empty: document.getElementById('empty'),
  progress: document.getElementById('progress'),
  progressHud: document.getElementById('progressHud'),
  progressBreakdown: document.getElementById('progressBreakdown'),
  saveStateIndicator: document.getElementById('saveStateIndicator'),
  saveDraft: document.getElementById('saveDraft'),
  reviewMode: document.getElementById('reviewMode'),
  skipCompleted: document.getElementById('skipCompleted'),
  modeStatus: document.getElementById('modeStatus'),
  statusFilter: document.getElementById('statusFilter'),
  previous: document.getElementById('previous'),
  next: document.getElementById('next'),
  save: document.getElementById('save'),
  saveStay: document.getElementById('saveStay'),
  deleteAnnotation: document.getElementById('deleteAnnotation'),
  resetAnnotation: document.getElementById('resetAnnotation'),
  clearImage: document.getElementById('clearImage'),
  flag: document.getElementById('flag'),
  flagReason: document.getElementById('flagReason'),
  flagReasonOptions: document.getElementById('flagReasonOptions'),
  nextUnreviewed: document.getElementById('nextUnreviewed'),
  finishReview: document.getElementById('finishReview'),
  clear: document.getElementById('clear'),
  genres: document.getElementById('genres'),
  reactions: document.getElementById('reactions'),
  favorite: document.getElementById('favorite'),
  review: document.getElementById('review'),
  confidence: document.getElementById('confidence'),
  confidenceValue: document.getElementById('confidenceValue'),
  duplicateWarning: document.getElementById('duplicateWarning'),
  exportData: document.getElementById('export'),
  exportCsv: document.getElementById('exportCsv'),
  importData: document.getElementById('import'),
  resetWorkspace: document.getElementById('resetWorkspace'),
  taxonomyEditor: document.getElementById('taxonomyEditor'),
  taxonomyFields: document.getElementById('taxonomyFields'),
  saveTaxonomy: document.getElementById('saveTaxonomy'),
  resetTaxonomy: document.getElementById('resetTaxonomy'),
  taxonomyStatus: document.getElementById('taxonomyStatus'),
  aside: document.querySelector('aside')
};

let files = [];
let index = 0;
let objectUrl = null;
let activeCategoryIndex = Number(storageGet('genreactrix_active_category', '0') || 0);
let undoStack = [];
let sessionStarted = Date.now();
let sessionSaves = 0;
let reviewModeEnabled = false;
let statusFilter = 'all';
let skipCompletedEnabled = false;
let duplicateScanToken = 0;
const duplicateOf = new Map();

function emptyWorkspace() {
  return {annotations:{}, reviewQueue:[], favorites:[], confidence:{}, flags:{}, flagReasons:[], lastImageId:null, draft:null};
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizeSelections(value) {
  const max = DEFAULT_TAXONOMY.length * 13 - 1;
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map(Number).filter(item => Number.isInteger(item) && item >= 0 && item <= max))];
}

function normalizeAnnotation(value) {
  if (!isPlainObject(value)) return null;
  return {
    imageId: typeof value.imageId === 'string' ? value.imageId : undefined,
    selections: normalizeSelections(value.selections),
    genres: typeof value.genres === 'string' ? value.genres : ''
  };
}

function normalizeIdList(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter(item => typeof item === 'string' && item.trim()).map(item => item.trim()))];
}

function normalizeWorkspace(value) {
  const source = isPlainObject(value) ? value : {};
  const annotations = {};
  if (isPlainObject(source.annotations)) {
    Object.entries(source.annotations).forEach(([id, annotation]) => {
      if (!id.trim()) return;
      const normalized = normalizeAnnotation(annotation);
      if (normalized) annotations[id] = normalized;
    });
  }
  const confidence = {};
  if (isPlainObject(source.confidence)) {
    Object.entries(source.confidence).forEach(([id, score]) => {
      const numeric = Number(score);
      if (id.trim() && Number.isFinite(numeric)) confidence[id] = Math.max(0, Math.min(100, numeric));
    });
  }
  const flags = {};
  if (isPlainObject(source.flags)) {
    Object.entries(source.flags).forEach(([id, reason]) => {
      if (!id.trim()) return;
      const normalizedReason = String(reason || '').trim();
      flags[id] = normalizedReason;
    });
  }
  const flagReasons = normalizeIdList(source.flagReasons);
  Object.values(flags).forEach(reason => {
    if (reason && !flagReasons.some(item => item.toLowerCase() === reason.toLowerCase())) flagReasons.push(reason);
  });
  const draft = normalizeAnnotation(source.draft);
  if (draft && typeof source.draft?.imageId === 'string') draft.imageId = source.draft.imageId;
  return {
    annotations,
    reviewQueue: normalizeIdList(source.reviewQueue),
    favorites: normalizeIdList(source.favorites),
    confidence,
    flags,
    flagReasons,
    lastImageId: typeof source.lastImageId === 'string' ? source.lastImageId : null,
    draft: draft?.imageId ? draft : null
  };
}

function preserveUnreadableWorkspace(rawText) {
  if (!rawText) return;
  try {
    storageSet(`${STORAGE_KEY}_unreadable_${Date.now()}`, rawText, 'Unreadable workspace recovery copy');
  } catch {
    // Storage may be unavailable or full; recovery cannot be guaranteed here.
  }
}

const workspace = loadWorkspace();

function loadWorkspace() {
  let rawText = '';
  try {
    rawText = storageGet(STORAGE_KEY, '') || '';
    return rawText ? normalizeWorkspace(JSON.parse(rawText)) : emptyWorkspace();
  } catch {
    preserveUnreadableWorkspace(rawText);
    return emptyWorkspace();
  }
}

function currentFile() { return files[index] || null; }
function currentImageId() {
  const file = currentFile();
  return file ? (file.webkitRelativePath || file.name) : null;
}

function currentSelection() {
  return [...document.querySelectorAll('#reactions input[type="checkbox"]')]
    .map((input, i) => input.checked ? i : null)
    .filter(Number.isInteger);
}

function captureState() {
  return {imageId: currentImageId(), selections: currentSelection(), genres: el.genres.value};
}

function applyState(state) {
  if (!state) return;
  const selections = new Set(state.selections || []);
  document.querySelectorAll('#reactions input[type="checkbox"]').forEach((input, i) => {
    input.checked = selections.has(i);
  });
  el.genres.value = state.genres || '';
}

function markSaved() {
  if (el.saveStateIndicator) {
    el.saveStateIndicator.textContent = 'Saved';
    el.saveStateIndicator.dataset.state = 'saved';
  }
}

function markSaving() {
  if (el.saveStateIndicator) {
    el.saveStateIndicator.textContent = 'Saving…';
    el.saveStateIndicator.dataset.state = 'saving';
  }
}

function markSaveError(error) {
  if (el.saveStateIndicator) {
    el.saveStateIndicator.textContent = 'Save failed';
    el.saveStateIndicator.dataset.state = 'error';
    el.saveStateIndicator.title = error?.message || 'Browser storage is unavailable.';
  }
  if (el.modeStatus) el.modeStatus.textContent = 'Save failed. Export your workspace before closing this page.';
}

function persistWorkspace(includeDraft = true) {
  markSaving();
  if (includeDraft && currentImageId()) workspace.draft = captureState();
  try {
    if (!storageSet(STORAGE_KEY, JSON.stringify(normalizeWorkspace(workspace)), 'Workspace')) throw new Error('Browser storage is unavailable.');
    markSaved();
    return true;
  } catch (error) {
    markSaveError(error);
    console.error('Genreactrix workspace save failed:', error);
    return false;
  }
}

function pushUndo() {
  undoStack.push(captureState());
  if (undoStack.length > MAX_UNDO) undoStack.shift();
}

function undo() {
  const state = undoStack.pop();
  if (!state || state.imageId !== currentImageId()) return;
  applyState(state);
  persistWorkspace();
}

function restoreAnnotationFocus() {
  const active = document.activeElement;
  if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement || active?.isContentEditable) active.blur();
  const main = document.querySelector('main');
  main.tabIndex = -1;
  main.focus({preventScroll:true});
}

function buildCategories() {
  el.reactions.replaceChildren();
  taxonomy.forEach((group, categoryIndex) => {
    const card = document.createElement('section');
    card.className = 'reaction';
    card.dataset.categoryIndex = String(categoryIndex);

    const heading = document.createElement('button');
    heading.type = 'button';
    heading.className = 'reaction-heading';
    heading.textContent = group.category;
    heading.addEventListener('click', () => setActiveCategory(categoryIndex, true));

    const words = document.createElement('div');
    words.className = 'words';
    for (let wordIndex = 0; wordIndex < 13; wordIndex++) {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.addEventListener('change', persistWorkspace);
      const badge = document.createElement('span');
      badge.className = 'numeric-shortcut-badge';
      badge.textContent = wordIndex < 9 ? String(wordIndex + 1) : '·';
      label.dataset.reactionIndex = String(categoryIndex * 13 + wordIndex);
      label.append(input, ` ${group.words[wordIndex]}`, badge);
      words.append(label, document.createElement('br'));
    }
    card.append(heading, words);
    el.reactions.append(card);
  });
  setActiveCategory(Math.min(activeCategoryIndex, CATEGORY_NAMES.length - 1), true);
}

function setActiveCategory(nextIndex, open = true) {
  const categories = [...document.querySelectorAll('.reaction')];
  if (!categories.length) return;
  activeCategoryIndex = Math.max(0, Math.min(nextIndex, categories.length - 1));
  storageSet('genreactrix_active_category', String(activeCategoryIndex), 'Active category');
  categories.forEach((category, i) => {
    const active = i === activeCategoryIndex;
    category.dataset.activeCategory = String(active);
    category.classList.toggle('open', active && open);
  });
}

function toggleActiveCategory() {
  const category = document.querySelector(`.reaction[data-category-index="${activeCategoryIndex}"]`);
  if (category) category.classList.toggle('open');
}

function toggleNumericOption(number) {
  const category = document.querySelector(`.reaction[data-category-index="${activeCategoryIndex}"]`);
  const input = category?.querySelectorAll('input[type="checkbox"]')[number - 1];
  if (!input) return;
  pushUndo();
  input.checked = !input.checked;
  input.dispatchEvent(new Event('change', {bubbles:true}));
}

function clearCurrentSelection(recordUndo = true) {
  if (recordUndo) pushUndo();
  document.querySelectorAll('#reactions input[type="checkbox"]').forEach(input => input.checked = false);
  el.genres.value = '';
  persistWorkspace();
}

function restoreCurrent() {
  const id = currentImageId();
  const saved = workspace.annotations[id];
  document.querySelectorAll('#reactions input[type="checkbox"]').forEach(input => input.checked = false);
  el.genres.value = '';
  if (saved) applyState(saved);
  if (workspace.draft?.imageId === id) applyState(workspace.draft);
  undoStack = [];
}

function toggleMembership(listName) {
  const id = currentImageId();
  if (!id) return;
  const list = workspace[listName];
  const position = list.indexOf(id);
  if (position >= 0) list.splice(position, 1);
  else list.push(id);
  persistWorkspace();
  updateCurrentControls();
}

function setConfidence(value) {
  const id = currentImageId();
  if (!id) return;
  const score = Math.max(0, Math.min(100, Number(value)));
  workspace.confidence[id] = score;
  if (score < automationRules.autoReviewThreshold && !workspace.reviewQueue.includes(id)) workspace.reviewQueue.push(id);
  persistWorkspace();
  updateCurrentControls();
}

function renderFlagReasonOptions() {
  if (!el.flagReasonOptions) return;
  el.flagReasonOptions.replaceChildren();
  workspace.flagReasons.forEach(reason => {
    const option = document.createElement('option');
    option.value = reason;
    el.flagReasonOptions.append(option);
  });
}

function toggleFlag() {
  const id = currentImageId();
  if (!id) return;
  const existing = Object.prototype.hasOwnProperty.call(workspace.flags, id);
  if (existing && !el.flagReason.value.trim()) {
    delete workspace.flags[id];
    persistWorkspace(false);
    updateCurrentControls();
    refreshSearchAndRelationships();
    el.modeStatus.textContent = 'Flag removed';
    return;
  }
  const reason = el.flagReason.value.trim();
  workspace.flags[id] = reason;
  if (reason && !workspace.flagReasons.some(item => item.toLowerCase() === reason.toLowerCase())) {
    workspace.flagReasons.push(reason);
    workspace.flagReasons.sort((a,b) => a.localeCompare(b));
    renderFlagReasonOptions();
  }
  persistWorkspace(false);
  updateCurrentControls();
  refreshSearchAndRelationships();
  el.modeStatus.textContent = reason ? `Flagged: ${reason}` : 'Image flagged';
}

function updateCurrentControls() {
  const id = currentImageId();
  const favorite = id ? workspace.favorites.includes(id) : false;
  const review = id ? workspace.reviewQueue.includes(id) : false;
  const flagged = id ? Object.prototype.hasOwnProperty.call(workspace.flags, id) : false;
  const confidence = id && Number.isFinite(Number(workspace.confidence[id]))
    ? Number(workspace.confidence[id]) : 50;
  el.favorite.disabled = !id;
  el.review.disabled = !id;
  el.confidence.disabled = !id;
  if (el.flag) el.flag.disabled = !id;
  if (el.flagReason) el.flagReason.disabled = !id;
  if (el.clearImage) el.clearImage.disabled = !id;
  if (el.resetAnnotation) el.resetAnnotation.disabled = !id || !workspace.annotations[id];
  if (el.deleteAnnotation) el.deleteAnnotation.disabled = !id || (!workspace.annotations[id] && !workspace.flags[id] && !workspace.favorites.includes(id) && !workspace.reviewQueue.includes(id));
  el.favorite.setAttribute('aria-pressed', String(favorite));
  el.review.setAttribute('aria-pressed', String(review));
  el.favorite.textContent = favorite ? '★ Favorite' : '☆ Favorite';
  el.review.textContent = review ? '✓ Review' : 'Review';
  if (el.flag) {
    el.flag.setAttribute('aria-pressed', String(flagged));
    el.flag.textContent = flagged ? '⚑ Update Flag' : '⚐ Flag';
  }
  if (el.flagReason) el.flagReason.value = flagged ? String(workspace.flags[id] || '') : '';
  el.confidence.value = String(confidence);
  el.confidenceValue.value = id ? `${confidence}%` : '—';
}

function updateHud() {
  const loadedIds = new Set(files.map(file => file.webkitRelativePath || file.name));
  const completed = files.length
    ? Object.keys(workspace.annotations).filter(id => loadedIds.has(id)).length
    : Object.keys(workspace.annotations).length;
  const hours = Math.max((Date.now() - sessionStarted) / 3600000, 1 / 3600);
  const rate = Math.round(sessionSaves / hours);
  const percent = files.length ? Math.round((completed / files.length) * 100) : 0;
  el.progressHud.textContent = `Completed: ${completed}${files.length ? ` / ${files.length}` : ''} (${percent}%) • Session: ${sessionSaves} • ${rate}/hr`;
  const remaining = Math.max(files.length - completed, 0);
  el.progressBreakdown.textContent = `Remaining ${remaining} • Favorites ${workspace.favorites.length} • Review ${workspace.reviewQueue.length} • Flags ${Object.keys(workspace.flags).length} • Duplicates ${duplicateOf.size}`;
}

function updateNavigation() {
  const targets = navigableIndexes();
  const disabled = targets.length < 2;
  el.previous.disabled = disabled;
  el.next.disabled = disabled;
}

function alignIndexToCurrentFilter() {
  const targets = navigableIndexes();
  if (!targets.length) return targets;
  if (!targets.includes(index)) index = targets.find(fileIndex => fileIndex >= index) ?? targets[0];
  return targets;
}

async function hashFile(file) {
  const data = await file.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

async function scanDuplicates() {
  const token = ++duplicateScanToken;
  duplicateOf.clear();
  const firstByHash = new Map();
  el.modeStatus.textContent = `Scanning ${files.length} images…`;
  for (const file of files) {
    const id = file.webkitRelativePath || file.name;
    try {
      const hash = await hashFile(file);
      if (token !== duplicateScanToken) return;
      if (firstByHash.has(hash)) duplicateOf.set(id, firstByHash.get(hash));
      else firstByHash.set(hash, id);
    } catch {
      // Duplicate scanning must never block annotation.
    }
  }
  if (token !== duplicateScanToken) return;
  updateDuplicateWarning();
  updateNavigation();
  if (!reviewModeEnabled) {
    el.modeStatus.textContent = `${duplicateOf.size} duplicate${duplicateOf.size === 1 ? '' : 's'} found`;
  }
}

function updateDuplicateWarning() {
  const original = duplicateOf.get(currentImageId());
  el.duplicateWarning.hidden = !original;
  el.duplicateWarning.textContent = original ? `Duplicate of: ${original}` : '';
}

function showCurrent() {
  if (!files.length) {
    if (objectUrl) { URL.revokeObjectURL(objectUrl); objectUrl = null; }
    el.image.hidden = true;
    el.empty.hidden = false;
    el.empty.textContent = 'Choose a folder of images.';
    el.progress.textContent = 'No folder loaded';
    updateNavigation();
    updateHud();
    return;
  }
  const targets = alignIndexToCurrentFilter();
  if (!targets.length) {
    if (objectUrl) { URL.revokeObjectURL(objectUrl); objectUrl = null; }
    el.image.hidden = true;
    el.empty.hidden = false;
    el.empty.textContent = 'No images match the current review mode and filters.';
    el.progress.textContent = '0 matching images';
    updateCurrentControls();
    updateDuplicateWarning();
    updateNavigation();
    updateHud();
    return;
  }
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = URL.createObjectURL(currentFile());
  el.image.src = objectUrl;
  el.image.alt = currentImageId();
  el.image.hidden = false;
  el.empty.hidden = true;
  const visiblePosition = targets.indexOf(index) + 1;
  el.progress.textContent = `${visiblePosition} / ${targets.length}${reviewModeEnabled ? ' review' : ''}`;
  workspace.lastImageId = currentImageId();
  restoreCurrent();
  updateCurrentControls();
  updateDuplicateWarning();
  updateNavigation();
  updateHud();
}

function navigableIndexes() {
  return files.map((file, i) => ({id:file.webkitRelativePath || file.name, i}))
    .filter(item => {
      if (reviewModeEnabled && !workspace.reviewQueue.includes(item.id)) return false;
      if (skipCompletedEnabled && workspace.annotations[item.id]) return false;
      if (statusFilter === 'unreviewed' && workspace.annotations[item.id]) return false;
      if (statusFilter === 'completed' && !workspace.annotations[item.id]) return false;
      if (statusFilter === 'favorites' && !workspace.favorites.includes(item.id)) return false;
      if (statusFilter === 'duplicates' && !duplicateOf.has(item.id)) return false;
      if (statusFilter === 'flagged' && !Object.prototype.hasOwnProperty.call(workspace.flags, item.id)) return false;
      return true;
    })
    .map(item => item.i);
}

function moveImage(direction) {
  const targets = navigableIndexes();
  if (targets.length < 2) return;
  let position = targets.indexOf(index);
  if (position < 0) position = direction > 0 ? -1 : 0;
  index = targets[(position + direction + targets.length) % targets.length];
  showCurrent();
}

function toggleSkipCompleted() {
  skipCompletedEnabled = !skipCompletedEnabled;
  el.skipCompleted.setAttribute('aria-pressed', String(skipCompletedEnabled));
  el.skipCompleted.textContent = `Skip Completed: ${skipCompletedEnabled ? 'On' : 'Off'}`;
  alignIndexToCurrentFilter();
  showCurrent();
}

function toggleReviewMode() {
  reviewModeEnabled = !reviewModeEnabled;
  const targets = alignIndexToCurrentFilter();
  el.reviewMode.setAttribute('aria-pressed', String(reviewModeEnabled));
  el.reviewMode.textContent = `Review Mode: ${reviewModeEnabled ? 'On' : 'Off'}`;
  el.modeStatus.textContent = reviewModeEnabled
    ? `${targets.length} queued image${targets.length === 1 ? '' : 's'}`
    : 'All images';
  showCurrent();
}

function removeCurrentResearchData(id) {
  delete workspace.annotations[id];
  delete workspace.confidence[id];
  delete workspace.flags[id];
  workspace.favorites = workspace.favorites.filter(item => item !== id);
  workspace.reviewQueue = workspace.reviewQueue.filter(item => item !== id);
  if (workspace.draft?.imageId === id) workspace.draft = null;
}

function clearCurrentImage(preserveData = true) {
  const id = currentImageId();
  if (!id) return false;
  if (preserveData && (!workspace.annotations[id] || isDraftDifferentFromSaved())) {
    if (saveCurrent(false) === false) return false;
  }
  files.splice(index, 1);
  duplicateOf.delete(id);
  for (const [duplicateId, originalId] of [...duplicateOf.entries()]) {
    if (originalId === id) duplicateOf.delete(duplicateId);
  }
  if (index >= files.length) index = Math.max(files.length - 1, 0);
  workspace.lastImageId = currentImageId();
  persistWorkspace(false);
  showCurrent();
  scanDuplicates();
  el.modeStatus.textContent = `Picture cleared; saved data for “${id}” remains in reports`;
  return true;
}

function resetCurrentAnnotation() {
  const id = currentImageId();
  if (!id || !workspace.annotations[id]) {
    el.modeStatus.textContent = 'No saved annotation to reset';
    return false;
  }
  if (!confirm(`Reset the annotation for “${id}” and keep the picture loaded?`)) return false;
  createRecoveryCheckpoint(`Before resetting annotation: ${id}`, true);
  removeCurrentResearchData(id);
  persistWorkspace(false);
  restoreCurrent();
  updateCurrentControls();
  updateHud();
  refreshSearchAndRelationships();
  el.modeStatus.textContent = 'Annotation reset; picture remains ready for a fresh pass';
  return true;
}

function deleteCurrentAnnotation() {
  const id = currentImageId();
  if (!id) return false;
  const hasData = Boolean(workspace.annotations[id]) || Object.prototype.hasOwnProperty.call(workspace.flags, id) ||
    workspace.favorites.includes(id) || workspace.reviewQueue.includes(id) || Number.isFinite(Number(workspace.confidence[id]));
  if (!hasData) {
    el.modeStatus.textContent = 'No saved data to delete';
    return false;
  }
  if (!confirm(`Delete all saved data for “${id}” and clear the picture from the active workspace?`)) return false;
  createRecoveryCheckpoint(`Before deleting slide and data: ${id}`, true);
  removeCurrentResearchData(id);
  persistWorkspace(false);
  clearCurrentImage(false);
  refreshSearchAndRelationships();
  el.modeStatus.textContent = 'Picture and saved data deleted';
  return true;
}

function saveCurrent(advance = true) {
  const id = currentImageId();
  if (!id) return;
  workspace.annotations[id] = captureState();
  workspace.draft = null;
  sessionSaves++;
  persistWorkspace(false);
  updateHud();
  if (advance) moveImage(1);
}

function nextUnreviewed() {
  if (!files.length) return;
  const incomplete = files
    .map((file, fileIndex) => ({id: file.webkitRelativePath || file.name, fileIndex}))
    .filter(item => !workspace.annotations[item.id]);
  if (!incomplete.length) {
    el.modeStatus.textContent = 'All loaded images are saved';
    return;
  }
  const afterCurrent = incomplete.find(item => item.fileIndex > index) || incomplete[0];
  index = afterCurrent.fileIndex;
  showCurrent();
  el.modeStatus.textContent = `${incomplete.length} unsaved image${incomplete.length === 1 ? '' : 's'} remaining`;
}

function finishCurrentReview() {
  const id = currentImageId();
  if (!id) return;
  if (saveCurrent(false) === false) return;
  const queueIndex = workspace.reviewQueue.indexOf(id);
  if (queueIndex >= 0) workspace.reviewQueue.splice(queueIndex, 1);
  persistWorkspace(false);
  updateCurrentControls();
  updateHud();
  if (reviewModeEnabled && workspace.reviewQueue.length) {
    const targets = navigableIndexes();
    if (targets.length) {
      const nextTarget = targets.find(fileIndex => fileIndex > index) ?? targets[0];
      index = nextTarget;
      showCurrent();
    }
  } else {
    nextUnreviewed();
  }
  el.modeStatus.textContent = workspace.reviewQueue.length
    ? `Review finished · ${workspace.reviewQueue.length} remaining`
    : 'Review queue complete';
}

function saveStay() {
  if (saveCurrent(false) !== false) el.modeStatus.textContent = 'Annotation saved';
}

function isTypingTarget(target) {
  return target instanceof HTMLElement &&
    target.matches('input[type="text"], input:not([type]), textarea, [contenteditable="true"]');
}

function handleKeyboard(event) {
  if (isTypingTarget(event.target)) return;
  if (event.key === 'F2') { event.preventDefault(); toggleReviewMode(); return; }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); saveStay(); return; }
  if (event.shiftKey && event.key === 'Enter') { event.preventDefault(); finishCurrentReview(); return; }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
    event.preventDefault(); undo(); return;
  }
  if (event.key === 'ArrowLeft') { event.preventDefault(); moveImage(-1); }
  else if (event.key === 'ArrowRight') { event.preventDefault(); moveImage(1); }
  else if (event.key.toLowerCase() === 'f') { event.preventDefault(); toggleMembership('favorites'); }
  else if (event.key.toLowerCase() === 'r') { event.preventDefault(); toggleMembership('reviewQueue'); }
  else if (event.key === 'ArrowUp') { event.preventDefault(); setActiveCategory(activeCategoryIndex - 1, true); }
  else if (event.key === 'ArrowDown') { event.preventDefault(); setActiveCategory(activeCategoryIndex + 1, true); }
  else if (event.key === 'Enter') { event.preventDefault(); saveCurrent(true); }
  else if (event.key === 'Escape') { event.preventDefault(); clearCurrentSelection(); }
  else if (event.code === 'Space') { event.preventDefault(); toggleActiveCategory(); }
  else if (/^[1-9]$/.test(event.key)) { event.preventDefault(); toggleNumericOption(Number(event.key)); }
}

el.folder.addEventListener('change', event => {
  files = [...event.target.files]
    .filter(file => file.type.startsWith('image/'))
    .sort((a,b) => (a.webkitRelativePath || a.name).localeCompare(b.webkitRelativePath || b.name));
  const remembered = files.findIndex(file => (file.webkitRelativePath || file.name) === workspace.lastImageId);
  index = remembered >= 0 ? remembered : 0;
  showCurrent();
  scanDuplicates();
});
function jumpToFile() {
  const query = el.fileSearch.value.trim().toLowerCase();
  if (!query || !files.length) return;
  const found = files.findIndex((file, i) => i > index && (file.webkitRelativePath || file.name).toLowerCase().includes(query));
  const fallback = files.findIndex(file => (file.webkitRelativePath || file.name).toLowerCase().includes(query));
  const target = found >= 0 ? found : fallback;
  if (target >= 0) { index = target; showCurrent(); }
  else el.modeStatus.textContent = `No filename matching “${el.fileSearch.value.trim()}”`;
}

el.previous.addEventListener('click', () => moveImage(-1));
el.next.addEventListener('click', () => moveImage(1));
el.jumpFile.addEventListener('click', jumpToFile);
el.fileSearch.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); jumpToFile(); } });
el.clear.addEventListener('click', () => clearCurrentSelection());
function exportWorkspace() {
  const payload = {
    schemaVersion: WORKSPACE_SCHEMA_VERSION,
    appVersion: APP_VERSION,
    exportedAt: new Date().toISOString(),
    taxonomy,
    ...workspace
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = 'genreactrix-workspace.json';
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(anchor.href), 1000);
}

async function importWorkspace(file) {
  if (!file) return;
  const parsed = JSON.parse(await file.text());
  if (!isPlainObject(parsed) || !isPlainObject(parsed.annotations)) {
    throw new Error('Invalid Genreactrix workspace file.');
  }
  const imported = normalizeWorkspace(parsed);
  const transaction = beginTransactionSnapshot();
  createRecoveryCheckpoint('Before workspace import', true);
  try {
    workspace.annotations = imported.annotations;
    workspace.reviewQueue = imported.reviewQueue;
    workspace.favorites = imported.favorites;
    workspace.confidence = imported.confidence;
    workspace.flags = imported.flags;
    workspace.flagReasons = imported.flagReasons;
    workspace.lastImageId = imported.lastImageId || workspace.lastImageId;
    workspace.draft = imported.draft;
    if (Array.isArray(parsed.taxonomy)) {
      if (!storageSet(TAXONOMY_KEY, JSON.stringify(parsed.taxonomy), 'Imported taxonomy')) {
        throw new Error('Import parsed successfully, but the taxonomy could not be saved.');
      }
      taxonomy = loadTaxonomy();
      buildCategories();
    }
    if (!persistWorkspace(false)) {
      throw new Error('Import parsed successfully, but browser storage could not save it.');
    }
    renderFlagReasonOptions();
    restoreCurrent();
    updateCurrentControls();
    updateHud();
  } catch (error) {
    rollbackTransaction(transaction);
    throw error;
  }
}

el.save.addEventListener('click', () => saveCurrent(true));
el.saveStay?.addEventListener('click', saveStay);
el.deleteAnnotation?.addEventListener('click', deleteCurrentAnnotation);
el.resetAnnotation?.addEventListener('click', resetCurrentAnnotation);
el.clearImage?.addEventListener('click', clearCurrentImage);
el.flag?.addEventListener('click', toggleFlag);
el.flagReason?.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); toggleFlag(); } });
el.nextUnreviewed?.addEventListener('click', nextUnreviewed);
el.finishReview?.addEventListener('click', finishCurrentReview);
el.favorite.addEventListener('click', () => toggleMembership('favorites'));
el.review.addEventListener('click', () => toggleMembership('reviewQueue'));
el.confidence.addEventListener('input', event => setConfidence(event.target.value));
el.reviewMode.addEventListener('click', toggleReviewMode);
el.skipCompleted.addEventListener('click', toggleSkipCompleted);
el.statusFilter.addEventListener('change', event => {
  statusFilter = event.target.value;
  const targets = alignIndexToCurrentFilter();
  el.modeStatus.textContent = `${targets.length} matching image${targets.length === 1 ? '' : 's'}`;
  showCurrent();
});
function resetWorkspace() {
  const count = Object.keys(workspace.annotations).length;
  const confirmed = window.confirm(`Delete ${count} saved annotation${count === 1 ? '' : 's'}, favorites, review flags, confidence scores, and draft data? Export first if needed.`);
  if (!confirmed) return;
  createRecoveryCheckpoint('Before workspace reset', true);
  workspace.annotations = {};
  workspace.reviewQueue = [];
  workspace.favorites = [];
  workspace.flags = {};
  workspace.flagReasons = [];
  workspace.confidence = {};
  workspace.draft = null;
  workspace.lastImageId = currentImageId();
  persistWorkspace(false);
  restoreCurrent();
  updateCurrentControls();
  updateHud();
  el.modeStatus.textContent = 'Workspace reset';
}

el.exportData.addEventListener('click', exportWorkspace);
el.resetWorkspace.addEventListener('click', resetWorkspace);
el.importData.addEventListener('change', async event => {
  try {
    await importWorkspace(event.target.files[0]);
    el.modeStatus.textContent = 'Workspace imported';
  } catch (error) {
    el.modeStatus.textContent = error.message;
  } finally {
    event.target.value = '';
  }
});
el.genres.addEventListener('input', persistWorkspace);
document.addEventListener('keydown', handleKeyboard);
document.addEventListener('click', event => {
  if (event.target.closest('button')) queueMicrotask(restoreAnnotationFocus);
});
window.addEventListener('beforeunload', () => persistWorkspace());

buildCategories();
renderFlagReasonOptions();
showCurrent();
queueMicrotask(restoreAnnotationFocus);

const ui = {
  dashboard: document.getElementById('dashboard'),
  draftState: document.getElementById('draftState'),
  selectionCount: document.getElementById('selectionCount'),
  saveDraft: document.getElementById('saveDraft'),
  shortcutButton: document.getElementById('toggleShortcuts'),
  shortcutHelp: document.getElementById('shortcutHelp')
};

function isDraftDifferentFromSaved() {
  const id = currentImageId();
  if (!id) return false;
  const saved = workspace.annotations[id] || {selections:[], genres:''};
  const current = captureState();
  return JSON.stringify(saved.selections || []) !== JSON.stringify(current.selections || []) ||
    (saved.genres || '') !== (current.genres || '');
}

function updateWorkflowDashboard() {
  const completed = Object.keys(workspace.annotations).length;
  const total = files.length;
  const pending = total ? Math.max(total - completed, 0) : 0;
  const selected = currentSelection().length;
  if (ui.dashboard) {
    ui.dashboard.textContent = `Saved ${completed}${total ? ` / ${total}` : ''} · Pending ${pending} · Favorites ${workspace.favorites.length} · Review ${workspace.reviewQueue.length} · Flags ${Object.keys(workspace.flags).length}${reviewModeEnabled ? ' · Review Mode' : ''}`;
  }
  if (ui.selectionCount) ui.selectionCount.textContent = `${selected} reaction${selected === 1 ? '' : 's'} selected`;
  if (ui.draftState) {
    const dirty = isDraftDifferentFromSaved();
    ui.draftState.textContent = dirty ? 'Draft differs from saved annotation' : 'Current annotation saved';
    ui.draftState.dataset.dirty = String(dirty);
  }
}

const basePersistWorkspace = persistWorkspace;
persistWorkspace = function(includeDraft = true) {
  const saved = basePersistWorkspace(includeDraft);
  updateWorkflowDashboard();
  return saved;
};

const baseUpdateHud = updateHud;
updateHud = function() {
  baseUpdateHud();
  updateWorkflowDashboard();
};

function reactionLabel(selectionIndex) {
  const categoryIndex = Math.floor(Number(selectionIndex) / 13);
  const wordIndex = Number(selectionIndex) % 13;
  const group = taxonomy[categoryIndex];
  return group ? `${group.category}: ${group.words[wordIndex]}` : `Reaction ${selectionIndex}`;
}

function renderTaxonomyEditor() {
  if (!el.taxonomyFields) return;
  el.taxonomyFields.replaceChildren();
  taxonomy.forEach((group, categoryIndex) => {
    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = `Category ${categoryIndex + 1}`;
    const categoryInput = document.createElement('input');
    categoryInput.value = group.category;
    categoryInput.dataset.category = String(categoryIndex);
    categoryInput.setAttribute('aria-label', `Category ${categoryIndex + 1} name`);
    const words = document.createElement('div');
    words.className = 'taxonomy-word-grid';
    group.words.forEach((word, wordIndex) => {
      const input = document.createElement('input');
      input.value = word;
      input.dataset.category = String(categoryIndex);
      input.dataset.word = String(wordIndex);
      input.setAttribute('aria-label', `${group.category} term ${wordIndex + 1}`);
      words.append(input);
    });
    fieldset.append(legend, categoryInput, words);
    el.taxonomyFields.append(fieldset);
  });
}

function readTaxonomyEditor() {
  return DEFAULT_TAXONOMY.map((fallback, categoryIndex) => {
    const categoryField = el.taxonomyFields.querySelector(`input[data-category="${categoryIndex}"]:not([data-word])`);
    const category = categoryField?.value.trim() || fallback.category;
    const words = Array.from({length: 13}, (_, wordIndex) => {
      const field = el.taxonomyFields.querySelector(`input[data-category="${categoryIndex}"][data-word="${wordIndex}"]`);
      return field?.value.trim() || fallback.words[wordIndex];
    });
    return {category, words};
  });
}

function saveTaxonomy() {
  taxonomy = readTaxonomyEditor();
  if (!storageSet(TAXONOMY_KEY, JSON.stringify(taxonomy), 'Taxonomy')) {
    el.taxonomyStatus.textContent = 'Taxonomy save failed';
    return;
  }
  buildCategories();
  restoreCurrent();
  updateWorkflowDashboard();
  el.taxonomyStatus.textContent = 'Taxonomy saved';
}

function resetTaxonomy() {
  if (!window.confirm('Restore all category and reaction labels to their defaults? Existing annotations keep their reaction indexes.')) return;
  taxonomy = structuredClone(DEFAULT_TAXONOMY);
  if (!storageSet(TAXONOMY_KEY, JSON.stringify(taxonomy), 'Taxonomy')) {
    el.taxonomyStatus.textContent = 'Taxonomy reset failed';
    return;
  }
  renderTaxonomyEditor();
  buildCategories();
  restoreCurrent();
  updateWorkflowDashboard();
  el.taxonomyStatus.textContent = 'Default taxonomy restored';
}

function csvCell(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replaceAll('"','""')}"` : text;
}

function exportCsv() {
  const rows = [['imageId','genres','selectedReactionIndexes','selectedReactionLabels','favorite','review','confidence','flagReason']];
  const ids = new Set([
    ...Object.keys(workspace.annotations),
    ...workspace.favorites,
    ...workspace.reviewQueue,
    ...Object.keys(workspace.flags),
    ...Object.keys(workspace.confidence),
    ...Object.keys(workspace.flags)
  ]);
  [...ids].sort().forEach(id => {
    const annotation = workspace.annotations[id] || {};
    rows.push([
      id,
      annotation.genres || '',
      (annotation.selections || []).join('|'),
      (annotation.selections || []).map(reactionLabel).join('|'),
      workspace.favorites.includes(id),
      workspace.reviewQueue.includes(id),
      workspace.confidence[id] ?? '',
      workspace.flags[id] ?? ''
    ]);
  });
  const content = rows.map(row => row.map(csvCell).join(',')).join('\n');
  const blob = new Blob([content], {type:'text/csv;charset=utf-8'});
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = 'genreactrix-annotations.csv';
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(anchor.href), 1000);
  el.modeStatus.textContent = `${rows.length - 1} records exported to CSV`;
}

el.exportCsv?.addEventListener('click', exportCsv);
ui.saveDraft?.addEventListener('click', () => {
  persistWorkspace(true);
  el.modeStatus.textContent = 'Draft saved locally';
});

if (ui.shortcutButton && ui.shortcutHelp) {
  const key = 'genreactrix_shortcut_help';
  ui.shortcutHelp.hidden = storageGet(key, 'closed') !== 'open';
  ui.shortcutButton.addEventListener('click', () => {
    ui.shortcutHelp.hidden = !ui.shortcutHelp.hidden;
    storageSet(key, ui.shortcutHelp.hidden ? 'closed' : 'open', 'Shortcut help preference');
  });
}

document.querySelectorAll('#reactions input[type="checkbox"]').forEach(input => {
  input.addEventListener('change', updateWorkflowDashboard);
});
el.genres.addEventListener('input', updateWorkflowDashboard);
window.setInterval(() => persistWorkspace(true), 30000);
renderTaxonomyEditor();
el.saveTaxonomy?.addEventListener('click', saveTaxonomy);
el.resetTaxonomy?.addEventListener('click', resetTaxonomy);
updateWorkflowDashboard();


// v0.1.9 — workspace search and relationship engine
const relationshipUi = {
  search: document.getElementById('workspaceSearch'),
  scope: document.getElementById('searchScope'),
  confidence: document.getElementById('searchConfidence'),
  favoritesOnly: document.getElementById('searchFavorites'),
  reviewOnly: document.getElementById('searchReview'),
  clear: document.getElementById('clearWorkspaceSearch'),
  summary: document.getElementById('searchSummary'),
  results: document.getElementById('searchResults'),
  related: document.getElementById('relatedResults'),
  insights: document.getElementById('relationshipInsights')
};

function annotationRecord(imageId) {
  const annotation = workspace.annotations[imageId] || {selections: [], genres: ''};
  const selections = Array.isArray(annotation.selections) ? annotation.selections.map(Number).filter(Number.isFinite) : [];
  return {
    imageId,
    genres: String(annotation.genres || ''),
    selections,
    reactionLabels: selections.map(reactionLabel),
    confidence: Number(workspace.confidence[imageId] ?? 0),
    favorite: workspace.favorites.includes(imageId),
    review: workspace.reviewQueue.includes(imageId),
    flag: Object.prototype.hasOwnProperty.call(workspace.flags, imageId),
    flagReason: String(workspace.flags[imageId] || '')
  };
}

function allWorkspaceIds() {
  return [...new Set([
    ...files.map(file => file.webkitRelativePath || file.name),
    ...Object.keys(workspace.annotations),
    ...workspace.favorites,
    ...workspace.reviewQueue,
    ...Object.keys(workspace.confidence),
    ...Object.keys(workspace.flags)
  ])].sort((a, b) => a.localeCompare(b, undefined, {numeric:true, sensitivity:'base'}));
}

function normalizedTokens(value) {
  return new Set(String(value || '').toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(token => token.length > 1));
}

function recordSearchText(record, scope) {
  if (scope === 'filename') return record.imageId;
  if (scope === 'genres') return record.genres;
  if (scope === 'reactions') return record.reactionLabels.join(' ');
  if (scope === 'flags') return record.flagReason;
  return `${record.imageId} ${record.genres} ${record.reactionLabels.join(' ')} ${record.flagReason}`;
}

function activeSearchCriteria() {
  return {
    query: relationshipUi.search?.value.trim().toLowerCase() || '',
    scope: relationshipUi.scope?.value || 'all',
    minimumConfidence: Math.max(0, Math.min(100, Number(relationshipUi.confidence?.value || 0))),
    favoritesOnly: Boolean(relationshipUi.favoritesOnly?.checked),
    reviewOnly: Boolean(relationshipUi.reviewOnly?.checked)
  };
}

function searchWorkspaceRecords() {
  const criteria = activeSearchCriteria();
  return allWorkspaceIds().map(annotationRecord).filter(record => {
    if (criteria.query && !recordSearchText(record, criteria.scope).toLowerCase().includes(criteria.query)) return false;
    if (record.confidence < criteria.minimumConfidence) return false;
    if (criteria.favoritesOnly && !record.favorite) return false;
    if (criteria.reviewOnly && !record.review) return false;
    return true;
  });
}

function jumpToImageId(imageId) {
  const nextIndex = files.findIndex(file => (file.webkitRelativePath || file.name) === imageId);
  if (nextIndex < 0) {
    el.modeStatus.textContent = 'Load the matching image folder before opening this result';
    return;
  }
  index = nextIndex;
  showCurrent();
  document.getElementById('viewer')?.scrollIntoView({behavior:'smooth', block:'start'});
}

function resultButton(record, scoreLabel = '') {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'search-result-card';
  const title = document.createElement('strong');
  title.textContent = record.imageId;
  const metadata = document.createElement('span');
  const flags = [
    `${record.selections.length} reaction${record.selections.length === 1 ? '' : 's'}`,
    `${record.confidence}% confidence`,
    record.favorite ? '★ favorite' : '',
    record.flag ? `⚑ ${record.flagReason || 'flagged'}` : '',
    record.review ? 'review' : '',
    scoreLabel
  ].filter(Boolean).join(' · ');
  metadata.textContent = flags;
  const labels = document.createElement('small');
  labels.textContent = [record.genres, ...record.reactionLabels.slice(0, 4)].filter(Boolean).join(' · ') || 'No annotation text';
  button.append(title, metadata, labels);
  button.addEventListener('click', () => jumpToImageId(record.imageId));
  return button;
}

function renderWorkspaceSearch() {
  if (!relationshipUi.results || !relationshipUi.summary) return;
  const records = searchWorkspaceRecords();
  const criteria = activeSearchCriteria();
  relationshipUi.results.replaceChildren();
  records.slice(0, 100).forEach(record => relationshipUi.results.append(resultButton(record)));
  const filters = [
    criteria.query ? `“${criteria.query}” in ${criteria.scope}` : '',
    criteria.minimumConfidence ? `confidence ≥ ${criteria.minimumConfidence}%` : '',
    criteria.favoritesOnly ? 'favorites' : '',
    criteria.reviewOnly ? 'review queue' : ''
  ].filter(Boolean);
  relationshipUi.summary.textContent = `${records.length} matching record${records.length === 1 ? '' : 's'}${filters.length ? ` · ${filters.join(' · ')}` : ''}${records.length > 100 ? ' · showing first 100' : ''}`;
  if (!records.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-search';
    empty.textContent = 'No annotations match the current search.';
    relationshipUi.results.append(empty);
  }
}

function similarityScore(left, right) {
  const leftSelections = new Set(left.selections);
  const rightSelections = new Set(right.selections);
  const reactionIntersection = [...leftSelections].filter(value => rightSelections.has(value)).length;
  const reactionUnion = new Set([...leftSelections, ...rightSelections]).size;
  const reactionScore = reactionUnion ? reactionIntersection / reactionUnion : 0;
  const leftGenres = normalizedTokens(left.genres);
  const rightGenres = normalizedTokens(right.genres);
  const genreIntersection = [...leftGenres].filter(value => rightGenres.has(value)).length;
  const genreUnion = new Set([...leftGenres, ...rightGenres]).size;
  const genreScore = genreUnion ? genreIntersection / genreUnion : 0;
  return (reactionScore * 0.8) + (genreScore * 0.2);
}

function renderRelatedAnnotations() {
  if (!relationshipUi.related) return;
  relationshipUi.related.replaceChildren();
  const id = currentImageId();
  if (!id || !workspace.annotations[id]) {
    relationshipUi.related.textContent = 'Save the current annotation to calculate relationships.';
    return;
  }
  const current = annotationRecord(id);
  const related = allWorkspaceIds()
    .filter(otherId => otherId !== id && workspace.annotations[otherId])
    .map(otherId => ({record: annotationRecord(otherId), score: similarityScore(current, annotationRecord(otherId))}))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.record.imageId.localeCompare(b.record.imageId))
    .slice(0, 6);
  if (!related.length) {
    relationshipUi.related.textContent = 'No related saved annotations yet.';
    return;
  }
  related.forEach(item => relationshipUi.related.append(resultButton(item.record, `${Math.round(item.score * 100)}% related`)));
}

function relationshipPairs() {
  const counts = new Map();
  Object.values(workspace.annotations).forEach(annotation => {
    const selections = [...new Set((annotation?.selections || []).map(Number).filter(Number.isFinite))].sort((a,b) => a-b);
    for (let left = 0; left < selections.length; left++) {
      for (let right = left + 1; right < selections.length; right++) {
        const key = `${selections[left]}:${selections[right]}`;
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }
  });
  return [...counts.entries()]
    .map(([key, count]) => ({indexes:key.split(':').map(Number), count}))
    .sort((a,b) => b.count - a.count || a.indexes[0] - b.indexes[0] || a.indexes[1] - b.indexes[1]);
}

function renderRelationshipInsights() {
  if (!relationshipUi.insights) return;
  relationshipUi.insights.replaceChildren();
  const pairs = relationshipPairs().slice(0, 10);
  if (!pairs.length) {
    relationshipUi.insights.textContent = 'Save annotations with two or more reactions to build relationship data.';
    return;
  }
  pairs.forEach(pair => {
    const row = document.createElement('div');
    row.className = 'relationship-row';
    const label = document.createElement('span');
    label.textContent = `${reactionLabel(pair.indexes[0])} ↔ ${reactionLabel(pair.indexes[1])}`;
    const count = document.createElement('strong');
    count.textContent = String(pair.count);
    count.title = `${pair.count} saved annotation${pair.count === 1 ? '' : 's'}`;
    row.append(label, count);
    relationshipUi.insights.append(row);
  });
}

function refreshSearchAndRelationships() {
  renderWorkspaceSearch();
  renderRelatedAnnotations();
  renderRelationshipInsights();
}

[relationshipUi.search, relationshipUi.scope, relationshipUi.confidence, relationshipUi.favoritesOnly, relationshipUi.reviewOnly]
  .filter(Boolean)
  .forEach(control => control.addEventListener(control.type === 'search' ? 'input' : 'change', refreshSearchAndRelationships));
relationshipUi.clear?.addEventListener('click', () => {
  relationshipUi.search.value = '';
  relationshipUi.scope.value = 'all';
  relationshipUi.confidence.value = '0';
  relationshipUi.favoritesOnly.checked = false;
  relationshipUi.reviewOnly.checked = false;
  refreshSearchAndRelationships();
});

const baseShowCurrentForRelationships = showCurrent;
showCurrent = function() {
  baseShowCurrentForRelationships();
  refreshSearchAndRelationships();
};
const baseSaveCurrentForRelationships = saveCurrent;
saveCurrent = function(advance = true) {
  baseSaveCurrentForRelationships(advance);
  refreshSearchAndRelationships();
};
const baseToggleMembershipForRelationships = toggleMembership;
toggleMembership = function(listName) {
  baseToggleMembershipForRelationships(listName);
  refreshSearchAndRelationships();
};

refreshSearchAndRelationships();

// v0.2.0 — workflow automation and validation
const AUTOMATION_KEY = 'genreactrix_automation_v020';
const DEFAULT_AUTOMATION = {
  requireReaction: false,
  requireGenre: false,
  autoReviewThreshold: 60,
  autoNextUnreviewed: true
};

function loadAutomationRules() {
  try {
    const saved = storageGetJSON(AUTOMATION_KEY, {});
    return {
      requireReaction: Boolean(saved.requireReaction),
      requireGenre: Boolean(saved.requireGenre),
      autoReviewThreshold: Math.max(0, Math.min(100, Number(saved.autoReviewThreshold ?? 60))),
      autoNextUnreviewed: saved.autoNextUnreviewed !== false
    };
  } catch {
    return {...DEFAULT_AUTOMATION};
  }
}

let automationRules = loadAutomationRules();
let lastValidationIssues = [];
const automationUi = {
  requireReaction: document.getElementById('requireReaction'),
  requireGenre: document.getElementById('requireGenre'),
  threshold: document.getElementById('autoReviewThreshold'),
  nextUnreviewed: document.getElementById('autoNextUnreviewed'),
  save: document.getElementById('saveAutomation'),
  validate: document.getElementById('runValidation'),
  repair: document.getElementById('repairWorkspace'),
  status: document.getElementById('automationStatus'),
  summary: document.getElementById('validationSummary'),
  results: document.getElementById('validationResults')
};

function syncAutomationForm() {
  automationUi.requireReaction.checked = automationRules.requireReaction;
  automationUi.requireGenre.checked = automationRules.requireGenre;
  automationUi.threshold.value = String(automationRules.autoReviewThreshold);
  automationUi.nextUnreviewed.checked = automationRules.autoNextUnreviewed;
}

function saveAutomationRules() {
  automationRules = {
    requireReaction: automationUi.requireReaction.checked,
    requireGenre: automationUi.requireGenre.checked,
    autoReviewThreshold: Math.max(0, Math.min(100, Number(automationUi.threshold.value || 0))),
    autoNextUnreviewed: automationUi.nextUnreviewed.checked
  };
  if (storageSet(AUTOMATION_KEY, JSON.stringify(automationRules), 'Workflow rules')) {
    automationUi.status.textContent = 'Workflow rules saved.';
  } else {
    automationUi.status.textContent = 'Workflow rule save failed.';
  }
}

function currentSaveProblems() {
  const problems = [];
  if (automationRules.requireReaction && currentSelection().length === 0) problems.push('Select at least one reaction.');
  if (automationRules.requireGenre && !el.genres.value.trim()) problems.push('Enter at least one genre.');
  return problems;
}

function validateWorkspace() {
  const issues = [];
  const annotationIds = new Set(Object.keys(workspace.annotations));
  const loadedIds = new Set(files.map(file => file.webkitRelativePath || file.name));
  const validMax = taxonomy.length * 13 - 1;

  Object.entries(workspace.annotations).forEach(([id, annotation]) => {
    if (!annotation || typeof annotation !== 'object') {
      issues.push({id, code:'invalid-annotation', severity:'error', message:'Annotation record is not an object.', repairable:true});
      return;
    }
    const selections = Array.isArray(annotation.selections) ? annotation.selections : [];
    const invalidSelections = selections.filter(value => !Number.isInteger(Number(value)) || Number(value) < 0 || Number(value) > validMax);
    if (invalidSelections.length) issues.push({id, code:'invalid-reactions', severity:'error', message:`${invalidSelections.length} reaction index${invalidSelections.length === 1 ? '' : 'es'} fall outside the current taxonomy.`, repairable:true});
    if (!selections.length) issues.push({id, code:'no-reactions', severity:'warning', message:'Saved annotation has no selected reactions.', repairable:false});
    if (!String(annotation.genres || '').trim()) issues.push({id, code:'no-genre', severity:'warning', message:'Saved annotation has no genre.', repairable:false});
    if (loadedIds.size && !loadedIds.has(id)) issues.push({id, code:'not-loaded', severity:'info', message:'Saved record is not present in the currently loaded folder.', repairable:false});
  });

  Object.entries(workspace.confidence).forEach(([id, value]) => {
    const score = Number(value);
    if (!Number.isFinite(score) || score < 0 || score > 100) issues.push({id, code:'invalid-confidence', severity:'error', message:'Confidence is not a number from 0 to 100.', repairable:true});
    if (!annotationIds.has(id)) issues.push({id, code:'orphan-confidence', severity:'warning', message:'Confidence exists without a saved annotation.', repairable:true});
  });

  ['favorites','reviewQueue'].forEach(listName => {
    const seen = new Set();
    workspace[listName].forEach(id => {
      if (seen.has(id)) issues.push({id, code:`duplicate-${listName}`, severity:'warning', message:`Duplicate entry in ${listName === 'favorites' ? 'favorites' : 'review queue'}.`, repairable:true});
      seen.add(id);
      if (!annotationIds.has(id)) issues.push({id, code:`orphan-${listName}`, severity:'info', message:`${listName === 'favorites' ? 'Favorite' : 'Review flag'} exists without a saved annotation.`, repairable:true});
    });
  });

  lastValidationIssues = issues;
  renderValidationIssues();
  return issues;
}

function renderValidationIssues() {
  const issues = lastValidationIssues;
  automationUi.results.replaceChildren();
  const errors = issues.filter(issue => issue.severity === 'error').length;
  const warnings = issues.filter(issue => issue.severity === 'warning').length;
  const repairable = issues.filter(issue => issue.repairable).length;
  automationUi.summary.textContent = issues.length
    ? `${issues.length} issue${issues.length === 1 ? '' : 's'} · ${errors} error${errors === 1 ? '' : 's'} · ${warnings} warning${warnings === 1 ? '' : 's'} · ${repairable} safely repairable`
    : 'No workspace integrity issues found.';
  issues.slice(0, 200).forEach(issue => {
    const row = document.createElement('div');
    row.className = 'validation-issue';
    row.dataset.severity = issue.severity;
    const text = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = issue.id;
    const detail = document.createElement('small');
    detail.textContent = `${issue.severity.toUpperCase()} · ${issue.message}${issue.repairable ? ' · Safe repair available' : ''}`;
    text.append(title, detail);
    const jump = document.createElement('button');
    jump.type = 'button';
    jump.textContent = 'Open';
    jump.disabled = !files.some(file => (file.webkitRelativePath || file.name) === issue.id);
    jump.addEventListener('click', () => {
      const target = files.findIndex(file => (file.webkitRelativePath || file.name) === issue.id);
      if (target >= 0) { index = target; showCurrent(); }
    });
    row.append(text, jump);
    automationUi.results.append(row);
  });
}

function repairWorkspaceIssues() {
  const issues = lastValidationIssues.length ? lastValidationIssues : validateWorkspace();
  const repairableCount = issues.filter(issue => issue.repairable).length;
  if (!repairableCount) {
    automationUi.status.textContent = 'No safe repairs were needed.';
    return;
  }
  createRecoveryCheckpoint('Before safe workspace repair', true);
  let repairs = 0;
  const validMax = taxonomy.length * 13 - 1;
  const annotationIds = new Set(Object.keys(workspace.annotations));

  issues.forEach(issue => {
    if (!issue.repairable) return;
    if (issue.code === 'invalid-annotation') {
      delete workspace.annotations[issue.id]; repairs++;
    } else if (issue.code === 'invalid-reactions') {
      const annotation = workspace.annotations[issue.id];
      if (annotation) {
        annotation.selections = [...new Set((annotation.selections || []).map(Number).filter(value => Number.isInteger(value) && value >= 0 && value <= validMax))];
        repairs++;
      }
    } else if (issue.code === 'invalid-confidence') {
      const score = Number(workspace.confidence[issue.id]);
      workspace.confidence[issue.id] = Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 50;
      repairs++;
    } else if (issue.code === 'orphan-confidence') {
      delete workspace.confidence[issue.id]; repairs++;
    }
  });

  ['favorites','reviewQueue'].forEach(listName => {
    const before = workspace[listName].length;
    workspace[listName] = [...new Set(workspace[listName])].filter(id => annotationIds.has(id));
    repairs += before - workspace[listName].length;
  });

  persistWorkspace(false);
  updateCurrentControls();
  updateHud();
  validateWorkspace();
  automationUi.status.textContent = repairs ? `${repairs} safe repair${repairs === 1 ? '' : 's'} applied.` : 'No safe repairs were needed.';
}

const baseSaveCurrentForAutomation = saveCurrent;
saveCurrent = function(advance = true) {
  const problems = currentSaveProblems();
  if (problems.length) {
    el.modeStatus.textContent = `Save blocked: ${problems.join(' ')}`;
    automationUi.status.textContent = `Save blocked: ${problems.join(' ')}`;
    return false;
  }
  const id = currentImageId();
  if (id) {
    const score = Number(workspace.confidence[id] ?? el.confidence.value ?? 50);
    if (score < automationRules.autoReviewThreshold && !workspace.reviewQueue.includes(id)) workspace.reviewQueue.push(id);
  }
  baseSaveCurrentForAutomation(false);
  if (advance) {
    if (automationRules.autoNextUnreviewed) nextUnreviewed();
    else moveImage(1);
  }
  refreshSearchAndRelationships();
  return true;
};

automationUi.save.addEventListener('click', saveAutomationRules);
automationUi.validate.addEventListener('click', validateWorkspace);
automationUi.repair.addEventListener('click', repairWorkspaceIssues);
syncAutomationForm();


// v0.2.1 — batch operations and review queue manager
const batchUi = {
  scope: document.getElementById('batchScope'),
  operation: document.getElementById('batchOperation'),
  valueWrap: document.getElementById('batchValueWrap'),
  value: document.getElementById('batchValue'),
  preview: document.getElementById('previewBatch'),
  apply: document.getElementById('applyBatch'),
  undo: document.getElementById('undoBatch'),
  status: document.getElementById('batchStatus'),
  previewResults: document.getElementById('batchPreview'),
  queueSort: document.getElementById('queueSort'),
  queueSummary: document.getElementById('queueSummary'),
  queueResults: document.getElementById('queueResults')
};
let pendingBatch = null;
let lastBatchSnapshot = null;

function uniqueIds(ids) { return [...new Set(ids.filter(Boolean))]; }
function loadedImageIds() { return files.map(file => file.webkitRelativePath || file.name); }
function batchTargetIds(scope = batchUi.scope.value) {
  if (scope === 'loaded') return uniqueIds(loadedImageIds());
  if (scope === 'unreviewed') return uniqueIds(loadedImageIds().filter(id => !workspace.annotations[id]));
  if (scope === 'review') return uniqueIds(workspace.reviewQueue);
  if (scope === 'favorites') return uniqueIds(workspace.favorites);
  return uniqueIds(searchWorkspaceRecords().map(record => record.id));
}
function operationNeedsValue(operation = batchUi.operation.value) {
  return ['confidence','add-genre','remove-genre'].includes(operation);
}
function normalizedBatchValue(operation, rawValue) {
  if (operation === 'confidence') {
    const value = Number(rawValue);
    return Number.isFinite(value) && value >= 0 && value <= 100 ? Math.round(value) : null;
  }
  const value = String(rawValue || '').trim();
  return value || null;
}
function batchDescription(operation, value) {
  return ({
    'add-review':'Add to review queue','remove-review':'Remove from review queue',
    favorite:'Mark favorite',unfavorite:'Remove favorite',confidence:`Set confidence to ${value}`,
    'add-genre':`Add genre “${value}”`,'remove-genre':`Remove genre “${value}”`
  })[operation] || operation;
}
function previewBatch() {
  const operation = batchUi.operation.value;
  const ids = batchTargetIds();
  const value = operationNeedsValue(operation) ? normalizedBatchValue(operation, batchUi.value.value) : null;
  if (operationNeedsValue(operation) && value === null) {
    pendingBatch = null; batchUi.apply.disabled = true;
    batchUi.status.textContent = operation === 'confidence' ? 'Enter a confidence from 0 to 100.' : 'Enter a genre value.';
    batchUi.previewResults.innerHTML = '';
    return;
  }
  pendingBatch = {operation, ids, value};
  batchUi.apply.disabled = ids.length === 0;
  batchUi.status.textContent = `${batchDescription(operation, value)} will affect ${ids.length} record${ids.length === 1 ? '' : 's'}.`;
  batchUi.previewResults.innerHTML = ids.length
    ? ids.slice(0, 12).map(id => `<div>${escapeHtml(id)}</div>`).join('') + (ids.length > 12 ? `<small>+ ${ids.length - 12} more</small>` : '')
    : '<div class="empty-search">No records match this target set.</div>';
}
function snapshotBatchState(ids) {
  return {
    ids:[...ids],
    annotations:Object.fromEntries(ids.map(id => [id, workspace.annotations[id] ? structuredClone(workspace.annotations[id]) : null])),
    confidence:Object.fromEntries(ids.map(id => [id, Object.hasOwn(workspace.confidence,id) ? workspace.confidence[id] : null])),
    reviewQueue:[...workspace.reviewQueue], favorites:[...workspace.favorites], flags:{...workspace.flags}, flagReasons:[...workspace.flagReasons]
  };
}
function setMembership(listName, id, present) {
  const list = workspace[listName];
  const at = list.indexOf(id);
  if (present && at < 0) list.push(id);
  if (!present && at >= 0) list.splice(at, 1);
}
function updateGenre(id, value, add) {
  const record = workspace.annotations[id] || {imageId:id,selections:[],genres:''};
  const genres = String(record.genres || '').split(',').map(v => v.trim()).filter(Boolean);
  const matches = genres.some(v => v.toLowerCase() === value.toLowerCase());
  if (add && !matches) genres.push(value);
  if (!add) record.genres = genres.filter(v => v.toLowerCase() !== value.toLowerCase()).join(', ');
  else record.genres = genres.join(', ');
  workspace.annotations[id] = record;
}
function applyPendingBatch() {
  if (!pendingBatch || !pendingBatch.ids.length) return;
  const {operation, ids, value} = pendingBatch;
  if (!confirm(`${batchDescription(operation, value)} for ${ids.length} record${ids.length === 1 ? '' : 's'}?`)) return;
  createRecoveryCheckpoint('Before batch operation', true);
  lastBatchSnapshot = snapshotBatchState(ids);
  ids.forEach(id => {
    if (operation === 'add-review') setMembership('reviewQueue', id, true);
    else if (operation === 'remove-review') setMembership('reviewQueue', id, false);
    else if (operation === 'favorite') setMembership('favorites', id, true);
    else if (operation === 'unfavorite') setMembership('favorites', id, false);
    else if (operation === 'confidence') workspace.confidence[id] = value;
    else if (operation === 'add-genre') updateGenre(id, value, true);
    else if (operation === 'remove-genre') updateGenre(id, value, false);
  });
  persistWorkspace(false);
  batchUi.undo.disabled = false;
  batchUi.status.textContent = `Applied: ${batchDescription(operation, value)} to ${ids.length} record${ids.length === 1 ? '' : 's'}.`;
  pendingBatch = null; batchUi.apply.disabled = true;
  updateCurrentControls(); updateHud(); refreshSearchAndRelationships(); renderReviewQueue();
}
function undoLastBatch() {
  if (!lastBatchSnapshot) return;
  workspace.reviewQueue = [...lastBatchSnapshot.reviewQueue];
  workspace.favorites = [...lastBatchSnapshot.favorites];
  workspace.flags = {...(lastBatchSnapshot.flags || {})};
  workspace.flagReasons = [...(lastBatchSnapshot.flagReasons || [])];
  lastBatchSnapshot.ids.forEach(id => {
    const annotation = lastBatchSnapshot.annotations[id];
    if (annotation === null) delete workspace.annotations[id]; else workspace.annotations[id] = annotation;
    const confidence = lastBatchSnapshot.confidence[id];
    if (confidence === null) delete workspace.confidence[id]; else workspace.confidence[id] = confidence;
  });
  persistWorkspace(false);
  batchUi.status.textContent = `Undid the last batch affecting ${lastBatchSnapshot.ids.length} record${lastBatchSnapshot.ids.length === 1 ? '' : 's'}.`;
  lastBatchSnapshot = null; batchUi.undo.disabled = true;
  updateCurrentControls(); updateHud(); refreshSearchAndRelationships(); renderReviewQueue();
}
function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}
function renderReviewQueue() {
  const loaded = new Set(loadedImageIds());
  let ids = uniqueIds(workspace.reviewQueue);
  const sort = batchUi.queueSort.value;
  if (sort === 'filename') ids.sort((a,b) => a.localeCompare(b));
  else if (sort === 'confidence') ids.sort((a,b) => Number(workspace.confidence[a] ?? 50) - Number(workspace.confidence[b] ?? 50) || a.localeCompare(b));
  else ids.reverse();
  batchUi.queueSummary.textContent = `${ids.length} queued record${ids.length === 1 ? '' : 's'} · ${ids.filter(id => loaded.has(id)).length} currently loaded`;
  batchUi.queueResults.innerHTML = '';
  if (!ids.length) { batchUi.queueResults.innerHTML = '<div class="empty-search">Review queue is empty.</div>'; return; }
  ids.forEach(id => {
    const row = document.createElement('div'); row.className = 'queue-row';
    const info = document.createElement('button'); info.type = 'button'; info.className = 'queue-open';
    info.disabled = !loaded.has(id); info.innerHTML = `<strong>${escapeHtml(id)}</strong><span>${workspace.confidence[id] ?? 50}% confidence${loaded.has(id) ? '' : ' · source not loaded'}</span>`;
    info.addEventListener('click', () => jumpToImageId(id));
    const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Remove';
    remove.addEventListener('click', () => { setMembership('reviewQueue', id, false); persistWorkspace(false); renderReviewQueue(); updateHud(); refreshSearchAndRelationships(); });
    row.append(info, remove); batchUi.queueResults.append(row);
  });
}
function syncBatchValueControl() {
  const needs = operationNeedsValue();
  batchUi.valueWrap.hidden = !needs;
  batchUi.value.type = batchUi.operation.value === 'confidence' ? 'number' : 'text';
  if (batchUi.value.type === 'number') { batchUi.value.min='0'; batchUi.value.max='100'; batchUi.value.step='5'; }
  batchUi.apply.disabled = true; pendingBatch = null;
}

batchUi.operation.addEventListener('change', syncBatchValueControl);
batchUi.scope.addEventListener('change', () => { pendingBatch = null; batchUi.apply.disabled = true; });
batchUi.preview.addEventListener('click', previewBatch);
batchUi.apply.addEventListener('click', applyPendingBatch);
batchUi.undo.addEventListener('click', undoLastBatch);
batchUi.queueSort.addEventListener('change', renderReviewQueue);
syncBatchValueControl();
renderReviewQueue();

const baseRefreshForBatch = refreshSearchAndRelationships;
refreshSearchAndRelationships = function() { baseRefreshForBatch(); renderReviewQueue(); };


// v0.2.2 — validation and conflict detection
const conflictUi = {
  scan: document.getElementById('runConflictScan'),
  summary: document.getElementById('conflictSummary'),
  results: document.getElementById('conflictResults')
};
let lastConflicts = [];

function normalizedBasename(id) {
  return String(id).split(/[\\/]/).pop().trim().toLowerCase();
}
function normalizedGenres(record) {
  return String(record?.genres || '').split(',').map(v => v.trim().toLowerCase()).filter(Boolean).sort();
}
function annotationFingerprint(id) {
  const record = workspace.annotations[id] || {};
  const selections = [...new Set((record.selections || []).map(Number).filter(Number.isInteger))].sort((a,b)=>a-b);
  return JSON.stringify({selections, genres:normalizedGenres(record), confidence:Number(workspace.confidence[id] ?? 50), favorite:workspace.favorites.includes(id), review:workspace.reviewQueue.includes(id)});
}
function detectWorkspaceConflicts() {
  const conflicts = [];
  const ids = Object.keys(workspace.annotations);
  const byBasename = new Map();
  ids.forEach(id => {
    const key = normalizedBasename(id);
    if (!byBasename.has(key)) byBasename.set(key, []);
    byBasename.get(key).push(id);
  });
  byBasename.forEach((group, basename) => {
    if (group.length < 2) return;
    const fingerprints = new Map();
    group.forEach(id => {
      const fp = annotationFingerprint(id);
      if (!fingerprints.has(fp)) fingerprints.set(fp, []);
      fingerprints.get(fp).push(id);
    });
    conflicts.push({
      type: fingerprints.size > 1 ? 'basename-disagreement' : 'duplicate-source-name',
      severity: fingerprints.size > 1 ? 'error' : 'warning',
      title: basename,
      ids: group,
      message: fingerprints.size > 1
        ? `${group.length} records share this filename but contain different annotation state.`
        : `${group.length} records share this filename and identical annotation state.`
    });
  });

  ids.forEach(id => {
    const score = Number(workspace.confidence[id] ?? 50);
    if (score < automationRules.autoReviewThreshold && !workspace.reviewQueue.includes(id)) {
      conflicts.push({type:'low-confidence-not-queued', severity:'warning', title:id, ids:[id], message:`Confidence is ${score}%, below the ${automationRules.autoReviewThreshold}% workflow threshold, but the record is not in review.`});
    }
    const record = workspace.annotations[id] || {};
    const selections = Array.isArray(record.selections) ? record.selections : [];
    const unique = new Set(selections.map(Number));
    if (unique.size !== selections.length) conflicts.push({type:'duplicate-reaction-selection', severity:'warning', title:id, ids:[id], message:'The annotation contains duplicate reaction indexes.'});
  });

  taxonomy.forEach((group, categoryIndex) => {
    const seen = new Map();
    group.words.forEach((word, wordIndex) => {
      const key = String(word).trim().toLowerCase();
      if (!key) return;
      if (!seen.has(key)) seen.set(key, []);
      seen.get(key).push(wordIndex);
    });
    seen.forEach((positions, key) => {
      if (positions.length > 1) conflicts.push({type:'taxonomy-duplicate-label', severity:'warning', title:group.category, ids:[], message:`“${group.words[positions[0]]}” appears ${positions.length} times in this category.`});
    });
  });
  lastConflicts = conflicts;
  renderConflicts();
  return conflicts;
}
function renderConflicts() {
  conflictUi.results.replaceChildren();
  const errors = lastConflicts.filter(c => c.severity === 'error').length;
  conflictUi.summary.textContent = lastConflicts.length
    ? `${lastConflicts.length} conflict${lastConflicts.length===1?'':'s'} · ${errors} disagreement${errors===1?'':'s'}`
    : 'No annotation, workflow, filename, or taxonomy conflicts found.';
  lastConflicts.slice(0,200).forEach(conflict => {
    const row=document.createElement('div'); row.className='conflict-row'; row.dataset.severity=conflict.severity;
    const text=document.createElement('div');
    const title=document.createElement('strong'); title.textContent=conflict.title;
    const detail=document.createElement('small'); detail.textContent=`${conflict.severity.toUpperCase()} · ${conflict.message}`;
    text.append(title,detail); row.append(text);
    if (conflict.ids.length) {
      const actions=document.createElement('div'); actions.className='conflict-actions';
      const loaded=conflict.ids.find(id => files.some(file => (file.webkitRelativePath || file.name)===id));
      const open=document.createElement('button'); open.type='button'; open.textContent='Open'; open.disabled=!loaded; open.addEventListener('click',()=>loaded&&jumpToImageId(loaded)); actions.append(open);
      if (conflict.type==='low-confidence-not-queued') {
        const fix=document.createElement('button'); fix.type='button'; fix.textContent='Queue'; fix.addEventListener('click',()=>{ setMembership('reviewQueue', conflict.ids[0], true); persistWorkspace(false); detectWorkspaceConflicts(); renderReviewQueue(); updateHud(); }); actions.append(fix);
      }
      if (conflict.type==='duplicate-reaction-selection') {
        const fix=document.createElement('button'); fix.type='button'; fix.textContent='Deduplicate'; fix.addEventListener('click',()=>{ const r=workspace.annotations[conflict.ids[0]]; r.selections=[...new Set((r.selections||[]).map(Number))]; persistWorkspace(false); detectWorkspaceConflicts(); }); actions.append(fix);
      }
      row.append(actions);
    }
    conflictUi.results.append(row);
  });
}
conflictUi.scan.addEventListener('click', detectWorkspaceConflicts);
const baseValidateWorkspaceForConflicts = validateWorkspace;
validateWorkspace = function() {
  const issues = baseValidateWorkspaceForConflicts();
  detectWorkspaceConflicts();
  return issues;
};


// v0.2.3 — recovery checkpoints and persistent history
const RECOVERY_KEY = 'genreactrix_recovery_v023';
const MAX_CHECKPOINTS = 12;
const recoveryUi = {
  panel: document.getElementById('recoveryPanel'),
  label: document.getElementById('checkpointLabel'),
  create: document.getElementById('createCheckpoint'),
  download: document.getElementById('downloadCheckpoint'),
  clear: document.getElementById('clearCheckpoints'),
  status: document.getElementById('recoveryStatus'),
  list: document.getElementById('checkpointList')
};

function loadCheckpoints() {
  try {
    const parsed = storageGetJSON(RECOVERY_KEY, []);
    return Array.isArray(parsed) ? parsed.filter(item => item && item.snapshot).slice(0, MAX_CHECKPOINTS) : [];
  } catch { return []; }
}
let recoveryCheckpoints = loadCheckpoints();

function persistCheckpoints() {
  return storageSet(RECOVERY_KEY, JSON.stringify(recoveryCheckpoints.slice(0, MAX_CHECKPOINTS)), 'Recovery history');
}

function clonePlain(value) {
  return JSON.parse(JSON.stringify(value));
}

function checkpointSnapshot() {
  persistWorkspace(false);
  return {
    appVersion: APP_VERSION,
    workspace: clonePlain(workspace),
    taxonomy: clonePlain(taxonomy),
    automationRules: clonePlain(automationRules)
  };
}

function createRecoveryCheckpoint(label = '', automatic = false) {
  const now = new Date();
  const checkpoint = {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now.toISOString(),
    label: String(label || '').trim() || (automatic ? 'Automatic safety checkpoint' : 'Manual checkpoint'),
    automatic: Boolean(automatic),
    snapshot: checkpointSnapshot()
  };
  recoveryCheckpoints.unshift(checkpoint);
  recoveryCheckpoints = recoveryCheckpoints.slice(0, MAX_CHECKPOINTS);
  persistCheckpoints();
  renderRecoveryHistory();
  recoveryUi.status.textContent = `Checkpoint created: ${checkpoint.label}`;
  return checkpoint;
}

function restoreRecoveryCheckpoint(checkpoint) {
  if (!checkpoint?.snapshot) return;
  if (!confirm(`Restore “${checkpoint.label}”? Current workspace state will be replaced.`)) return;
  const restored = checkpoint.snapshot;
  const current = checkpointSnapshot();
  recoveryCheckpoints.unshift({
    id: `${Date.now()}-pre-restore`,
    createdAt: new Date().toISOString(),
    label: `Before restoring ${checkpoint.label}`,
    automatic: true,
    snapshot: current
  });
  const source = restored.workspace || {};
  workspace.annotations = clonePlain(source.annotations || {});
  workspace.reviewQueue = [...new Set(source.reviewQueue || [])];
  workspace.favorites = [...new Set(source.favorites || [])];
  workspace.flags = {...(source.flags || {})};
  workspace.flagReasons = normalizeIdList(source.flagReasons || []);
  workspace.confidence = clonePlain(source.confidence || {});
  workspace.lastImageId = source.lastImageId || null;
  workspace.draft = source.draft || null;
  if (Array.isArray(restored.taxonomy) && restored.taxonomy.length === DEFAULT_TAXONOMY.length) {
    taxonomy = clonePlain(restored.taxonomy);
    if (!storageSet(TAXONOMY_KEY, JSON.stringify(taxonomy), 'Restored taxonomy')) {
      recoveryUi.status.textContent = 'Restore failed while saving the taxonomy.';
      return;
    }
    buildCategories();
    renderTaxonomyEditor();
  }
  if (restored.automationRules) {
    automationRules = {...DEFAULT_AUTOMATION, ...clonePlain(restored.automationRules)};
    if (!storageSet(AUTOMATION_KEY, JSON.stringify(automationRules), 'Restored workflow rules')) {
      recoveryUi.status.textContent = 'Restore failed while saving workflow rules.';
      return;
    }
    syncAutomationForm();
  }
  persistWorkspace(false);
  persistCheckpoints();
  showCurrent();
  updateHud();
  refreshSearchAndRelationships();
  validateWorkspace();
  renderRecoveryHistory();
  recoveryUi.status.textContent = `Restored: ${checkpoint.label}`;
}

function deleteRecoveryCheckpoint(id) {
  recoveryCheckpoints = recoveryCheckpoints.filter(item => item.id !== id);
  persistCheckpoints();
  renderRecoveryHistory();
  recoveryUi.status.textContent = 'Checkpoint removed.';
}

function checkpointDownload(checkpoint) {
  if (!checkpoint) return;
  const safe = checkpoint.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'checkpoint';
  const blob = new Blob([JSON.stringify(checkpoint, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `genreactrix-${safe}-${checkpoint.createdAt.slice(0,10)}.json`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  recoveryUi.status.textContent = `Downloaded: ${checkpoint.label}`;
}

function renderRecoveryHistory() {
  recoveryUi.list.replaceChildren();
  recoveryUi.download.disabled = recoveryCheckpoints.length === 0;
  recoveryUi.clear.disabled = recoveryCheckpoints.length === 0;
  if (!recoveryCheckpoints.length) {
    recoveryUi.list.innerHTML = '<div class="empty-search">No recovery checkpoints.</div>';
    return;
  }
  recoveryCheckpoints.forEach(checkpoint => {
    const row = document.createElement('div'); row.className = 'checkpoint-row';
    const meta = document.createElement('div'); meta.className = 'checkpoint-meta';
    const title = document.createElement('strong'); title.textContent = checkpoint.label;
    const detail = document.createElement('small');
    const count = Object.keys(checkpoint.snapshot?.workspace?.annotations || {}).length;
    detail.textContent = `${checkpoint.automatic ? 'Automatic' : 'Manual'} · ${new Date(checkpoint.createdAt).toLocaleString()} · ${count} annotations`;
    meta.append(title, detail);
    const actions = document.createElement('div'); actions.className = 'checkpoint-actions';
    const restore = document.createElement('button'); restore.type='button'; restore.textContent='Restore'; restore.addEventListener('click', () => restoreRecoveryCheckpoint(checkpoint));
    const download = document.createElement('button'); download.type='button'; download.textContent='Download'; download.addEventListener('click', () => checkpointDownload(checkpoint));
    const remove = document.createElement('button'); remove.type='button'; remove.textContent='Delete'; remove.addEventListener('click', () => deleteRecoveryCheckpoint(checkpoint.id));
    actions.append(restore, download, remove); row.append(meta, actions); recoveryUi.list.append(row);
  });
}

recoveryUi.create.addEventListener('click', () => {
  createRecoveryCheckpoint(recoveryUi.label.value, false);
  recoveryUi.label.value = '';
});
recoveryUi.label.addEventListener('keydown', event => {
  if (event.key === 'Enter') { event.preventDefault(); recoveryUi.create.click(); }
});
recoveryUi.download.addEventListener('click', () => checkpointDownload(recoveryCheckpoints[0]));
recoveryUi.clear.addEventListener('click', () => {
  if (!recoveryCheckpoints.length || !confirm(`Delete all ${recoveryCheckpoints.length} recovery checkpoints?`)) return;
  recoveryCheckpoints = []; persistCheckpoints(); renderRecoveryHistory(); recoveryUi.status.textContent = 'Recovery history cleared.';
});

// Destructive operations create checkpoints only after their confirmation gates.

renderRecoveryHistory();


// v0.3.5 stabilization: register the offline cache only when served over HTTP(S).
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(error => {
      console.warn('Genreactrix service worker registration failed:', error);
    });
  });
}


// v0.3.13 transactional state helpers
function beginTransactionSnapshot() {
  return {
    workspace: clonePlain(workspace),
    taxonomy: clonePlain(taxonomy),
    automationRules: clonePlain(automationRules)
  };
}
function validateTransactionSnapshot(snapshot) {
  return Boolean(snapshot && isPlainObject(snapshot) && isPlainObject(snapshot.workspace)
    && Array.isArray(snapshot.taxonomy) && isPlainObject(snapshot.automationRules));
}
function rollbackTransaction(snapshot) {
  if (!validateTransactionSnapshot(snapshot)) return false;
  workspace.annotations = clonePlain(snapshot.workspace.annotations || {});
  workspace.reviewQueue = [...new Set(snapshot.workspace.reviewQueue || [])];
  workspace.favorites = [...new Set(snapshot.workspace.favorites || [])];
  workspace.flags = {...(snapshot.workspace.flags || {})};
  workspace.flagReasons = normalizeIdList(snapshot.workspace.flagReasons || []);
  workspace.confidence = clonePlain(snapshot.workspace.confidence || {});
  workspace.lastImageId = snapshot.workspace.lastImageId || null;
  workspace.draft = snapshot.workspace.draft ? clonePlain(snapshot.workspace.draft) : null;
  taxonomy = clonePlain(snapshot.taxonomy);
  automationRules = {...DEFAULT_AUTOMATION, ...clonePlain(snapshot.automationRules)};
  storageSet(TAXONOMY_KEY, JSON.stringify(taxonomy), 'Rollback taxonomy');
  storageSet(AUTOMATION_KEY, JSON.stringify(automationRules), 'Rollback workflow rules');
  persistWorkspace(false);
  buildCategories();
  renderTaxonomyEditor();
  syncAutomationForm();
  showCurrent();
  return true;
}
