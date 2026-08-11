## v0.9.39.93
- Added the finalized 14 Prim reaction definitions to the Worker Reaction prompt.
- Replaced independent 0–100 AI reaction scoring with the 114-point comparative method.
- Requires all 14 whole-number allocations, minimum 1 each, exact total 114.
- Worker subtracts 1 locally and stores/display-consumes the resulting 100-point distribution.
- Preserves each raw allocation as `allocationPoints`.
- Reaction prompt version is `genreactrix-reactions-v3-114-point-prims`.
- Matrix remains pre-live v0.0.0.0.
- Legacy binary agreement thresholds are intentionally not reinterpreted in this build.

## v0.9.39.92
- Pre-live PrimFusion Matrix v0.0.0.0 vocabulary refinements: Horny → Exposure, Dark → Shame, Rejected → Humiliation.
- Worker v0.9.6.3 now receives all 91 canonical PrimFusion Theme definitions and image cues instead of free-form Theme naming without the Matrix vocabulary.
- Theme prompt now exhausts the Matrix before Custom fallback and rejects synonym/variant, setting, object, profession, standalone-Prim, Theme+subject, and “and” compound Custom shortcuts.
- Prior test outputs are preserved rather than silently rewritten.

## v0.9.39.91
- Corrected the v0.9.39.90 Landscape image-fit implementation.
- The workbench image and focused Image View now fill a fixed viewport box while
  `object-fit: contain` preserves the source aspect ratio and shows the full image.
- Letterboxing is allowed; automatic cropping is not.
- Worker remains unchanged at v0.9.6.2.

## v0.9.39.90
- Consolidated verified Landscape repair: full-image contain geometry, legacy/current AI Theme and Reaction adapters, exact shared AI/Customs four-button geometry, and booked state colors.
- Flag severity is now Review (yellow), Delete (red), Reject (hot magenta); button label remains Flag. Long-press opens the existing action menu.
- Reject is now a held Landscape disposition, visible through All/Reject filtering and excluded from Feed instead of being immediately recycled.
- Standard batch reporting excludes held Reject records; batch submission preserves them pending dedicated Reject export/finalization.
- Worker unchanged at v0.9.6.2.

## v0.9.39.89
- Tightened **Cycle** to a hard maximum of three total Missing passes for the frozen starting population.
- Cycle stops earlier only when all selected components become current, the user stops it, or a provider/global failure pauses it.
- Changing failure messages or changing unresolved image/component combinations never extends the three-pass ceiling.
- Removed v0.9.39.88's repeated-identical-failure-set stop criterion; three total passes is now the retry boundary.
- Worker remains unchanged at v0.9.6.2.

# Genreactrix Acceptance History

Consolidated from the historical `ACCEPTANCE-v*.txt` files. Original text is preserved below.

## v0.9.39.27

Genreactrix v0.9.39.27 — Acceptance checklist

IMPLEMENTED / STATICALLY VERIFIED
[PASS] Image View contains AI freeform description panel.
[PASS] Image View Director primitives use canonical 4–5–4 positions for the first 13 reactions.
[PASS] Image View selection ring is larger than the emoji glyph.
[PASS] Image View Director themes are three vertically stacked fields below the image.
[PASS] Image View custom reactions remain renderable after the canonical 13.
[PASS] Customs Add Theme and Add Reaction controls are fully sized in stable heading rows.
[PASS] Customs Add controls have capture-phase mobile pointer handling and dialog fallback.
[PASS] Customs contextual button remains the existing Customs / AI Analysis button.
[PASS] AI rerun controls remain 2×4 and constrained to the existing control band.
[PASS] Flag hold captures pointer, has document-level release fallback, and Android contextmenu long-press fallback.
[PASS] JavaScript syntax check passes.
[PASS] ZIP integrity check passes.

DEVICE QA REQUIRED
[ ] Confirm both Customs Add dialogs actually open on Galaxy Z Fold 6.
[ ] Confirm Customs buttons are not clipped and layout is visually acceptable.
[ ] Confirm 2-second Flag hold opens Flag actions.
[ ] Confirm AI 2×4 controls fit without overlap on-device.
[ ] Confirm Image View matches intended visual hierarchy and 4–5–4 readability.
[ ] Confirm tap-to-return works across the entire Image View image region.
[ ] Confirm Keep, Previous/Next, Undo/Redo remain intact.

## v0.9.39.30

Genreactrix v0.9.39.30 acceptance target

IMPLEMENTED IN THIS PASS
- Image View lower verification region is now two columns: three Director theme boxes at left, 4-5-4 Director reactions at right.
- Director theme boxes are vertically thicker and no longer full-width bars.
- Reaction ring/emoji ratio is preserved while the complete reaction unit is scaled down to fit beside the Director theme boxes.
- Image View is constrained to the viewport to prevent the verification layout from extending the page downward.
- Customs Add buttons now have an independent inline dialog opener that does not depend on the later app.js Customs initialization path.
- Removed the layered pointerdown/pointerup/capture fallback stack that could interfere with ordinary mobile button activation.
- CSS/JS cache keys bumped to v0.9.39.30.

DEVICE QA STILL REQUIRED
- Add Custom Theme opens on the Fold 6.
- Add Custom Reaction opens on the Fold 6.
- Custom creation/save/edit/persistence/search can only be evaluated after those dialogs are accessible.
- Image View geometry matches the intended physical proportions on the Fold 6.

## v0.9.39.32

Genreactrix v0.9.39.32 — PrimFusion canonical vocabulary sync

[PASS] Website matrix synchronized from PrimFusion_Website_Matrix_Scary_Angry_Completed All fixed.xlsx.
[PASS] Canonical primitive count is 14.
[PASS] P07 remains stable and is displayed as Ticket (🎟️).
[PASS] P11 remains stable and is displayed as Scary (👻).
[PASS] P14 Angry (🤬) added.
[PASS] 105 unique unordered/self PrimFusion cells are defined for 14 primitives.
[PASS] Final Angry fusions are present, including Sadomasochism and Wickedness.
[PASS] Final semantic revisions include Spirituality, Exploitation, Pride, Greed, Magical, Rejected, Eerie, and the Scary column revisions.
[PASS] Landscape interlocked matrix is 15 rows × 7 cells and preserves the compact 7-column instrument width.
[PASS] Customs canonical reaction list includes Ticket, Scary, and Angry.
[PASS] Worker AI vocabulary includes all 14 current canonical primitive names.
[PASS] JavaScript syntax checks passed.

Device QA remains required for Fold landscape/portrait visual fit after adding the 14th canonical reaction.

## v0.9.39.37

Genreactrix v0.9.39.37 — Report #14

Targeted changes only:
- AI/Judgment reaction layout unchanged; rings only enlarged and shifted right so emoji center inside with clearance.
- Image View reaction layout unchanged; selection rings slightly enlarged/right-shifted only.
- Keep idle border matches neighboring toolbar buttons; selected Keep remains green.
- Customs Add/Save/Edit/Delete uses the canonical app.js handlers only; competing fallback runtime is no longer loaded.
- Customs drawer furniture reduced further; first Add Custom Theme row moved down to clear AI Analysis; edit/delete controls remain inside drawer.
- Bottom-right green Angry matrix symbol follows green pattern: bottom-left placement.

No intentional changes to the approved two-row AI reaction brick layout, percentages, image geometry, or Image View theme layout.

## v0.9.39.38

Genreactrix v0.9.39.38 QA punch-list

1. Judgment reaction layout remains the approved two-row brick wall.
2. Only selection ring geometry changed: larger circles, moved right/down so emoji are optically centered.
3. Idle Keep button matches neighboring toolbar buttons on Judgment and Image View; selected Keep remains green.
4. Add Custom Theme is moved below the AI Analysis return control; no button overlap.
5. Add Theme/Add Reaction use direct canonical handlers.
6. Saving custom themes/reactions preserves Customs mode and immediately refreshes the list.
7. Existing edit/delete list controls remain inside the Customs drawer.
8. Bottom-right Angry green matrix marker is explicitly bottom-left aligned.

## v0.9.39.41

Genreactrix v0.9.39.41 — Customs Execution Recovery

Scope: Customs only. No UI redesign or unrelated layout changes.

Root causes repaired:
1. reactionRefKey() was referenced by Custom Theme/Reaction validation and picker code but did not exist. Both Add dialogs threw before opening.
2. $$() was referenced immediately after Customs event wiring but did not exist, stopping the remainder of app.js initialization.

Automated browser-DOM verification performed against the patched source:
PASS — Add Custom Theme opens dialog.
PASS — Theme validation enables Save after a valid name.
PASS — Save persists to genreactrix-custom-themes-v2.
PASS — Saved theme renders immediately in the Customs list.
PASS — Theme edit opens existing record and persists rename.
PASS — Theme delete removes record and list row.
PASS — Add Custom Reaction opens dialog.
PASS — Reaction validation enables Save after name + emoji.
PASS — Save persists to genreactrix-custom-reactions-v1.
PASS — Saved reaction renders immediately in the Customs list.
PASS — Reaction edit opens existing record and persists rename.
PASS — Reaction delete removes record and list row.
PASS — Custom Theme reaction picker includes canonical + custom reactions.
PASS — Reaction-expression order persists as reactionRefs.
PASS — Saving leaves the user in Customs (drawer remains open; no reload).

No changes made to Image View, reaction layout, PrimFusion, AI UI, or other accepted screens.

## v0.9.39.42

Genreactrix v0.9.39.42 — Canonical Reaction Geometry

Scope: Judgment reaction geometry only.

Acceptance:
- 14 canonical reactions remain in two rows.
- Bottom row centers are exact horizontal midpoints between adjacent top-row centers.
- Custom reactions continue the same brick sequence to the right.
- AI percentages use the same horizontal slot coordinates as their corresponding primitives.
- Red/teal rings use one shared offset (+4px right, +3px down) relative to the symbol box.
- Entire reaction grid is shifted +6px vertically as one unit.
- No Image View, Customs CRUD, PrimFusion, or AI workflow changes.

## v0.9.39.43

Genreactrix v0.9.39.43 — Shared-Center Reaction Completion

Scope: Judgment reaction geometry only.

Acceptance:
- 14 canonical reactions remain in two rows.
- Bottom-row centers are exact horizontal midpoints between adjacent top-row centers.
- Custom reactions continue the same two-row brick sequence to the right.
- AI percentages use the same horizontal slot coordinates as their corresponding primitives.
- Red/teal ring center equals emoji/symbol-box center exactly: left 50%, top 50%, translate(-50%,-50%).
- No independent X/Y ring nudge remains.
- Entire reaction grid retains the +6px whole-group vertical placement.
- Image View is untouched.
- Customs CRUD is untouched.
- PrimFusion and AI workflow are untouched.

## v0.9.39.44

v0.9.39.44 acceptance
1. Judgment only: each primitive button owns symbol + ring + AI percentage.
2. Ring and emoji share one center.
3. AI percentage shares the slot X center.
4. Top row remains 7 canonical primitives.
5. Bottom row remains 7 canonical primitives at exact half-column midpoints.
6. Image View and Customs are untouched.

## v0.9.39.45

Genreactrix v0.9.39.45
Scope: Judgment reaction geometry only.
- One explicit slot-center coordinate per primitive.
- Ring and emoji share the exact center.
- Bottom-row X slots are the exact half-step between top-row slots.
- AI percentage is a child of the same slot and shares its X center.
- No Image View or Customs changes.

## v0.9.39.46

Genreactrix v0.9.39.46 — canonical Judgment ring-core recovery

Scope:
- Judgment reaction strip only.
- Replaced pseudo-element rings with explicit reaction-core / reaction-ring markup.
- Ring and emoji use the same 40px core center by construction.
- Disabled all legacy .symbol::after ring rendering on Judgment.
- Bottom-row X centers remain midpoint-derived from the top row.
- AI percentage shares the slot X center with a fixed lower Y offset.
- Reaction group uses row center Y values 30% / 60% to center its complete footprint in the header band.
- No Image View, Customs CRUD, PrimFusion, or unrelated UI changes.

## v0.9.39.47

Genreactrix v0.9.39.47 — canonical interleaved Judgment order

Scope intentionally limited to the Judgment reaction strip.

Acceptance targets:
1. Primitive #1 is the first top-row slot.
2. Primitive #2 is the first bottom-row slot, centered halfway between top #1 and top #3.
3. Primitive #3 is the second top-row slot.
4. Primitive #4 is the second bottom-row slot, continuing the same alternating sequence.
5. The alternating order continues through all 14 canonical primitives and then through custom reactions.
6. Ring and emoji remain on the same shared center established in v0.9.39.46.
7. Canonical AI percentages remain attached to their primitive slot; custom reactions do not display fabricated AI percentages when no custom AI weight exists.
8. Image View and Customs CRUD/UI are unchanged.

## v0.9.39.48

Genreactrix v0.9.39.48 — ordered Judgment slots + custom AI percentages

Scope:
- Judgment reaction strip only.
- Stable canonical order uses primitive IDs rather than emoji symbol matching.
- Historical nth-child placement/transform rules are explicitly neutralized for the current slot engine.
- Custom reactions append only after all 14 canonical primitives.
- When AI Reactions is shown, every custom primitive displays a percentage; missing AI weights display 0%.
- Future AI results can populate a custom reaction by storing its score under the custom reaction ID or its custom: token.
- No Image View redesign in this build.

## v0.9.39.49

Genreactrix v0.9.39.49 — Reaction Strip Vertical Clearance

Scope is intentionally narrow.

1. AI percentage labels move 3px upward relative to their primitive slot.
2. The entire Judgment reaction array (emoji + rings + percentages) moves upward together by 2% of the reaction band.
3. Horizontal ordering, brick geometry, custom reaction placement, ring/emoji centering, and Image View are unchanged.
4. Customs CRUD and AI percentage behavior from v0.9.39.48 remain unchanged.

## v0.9.39.50

Genreactrix v0.9.39.50 — Image View Continuous Reaction Field

Scope: Image View reaction field only.

Acceptance:
- Canonical order: row 1 = 🧸 😭 🌶️ 🧠 👻 🌌 🌀
- Canonical order: row 2 = ✨ 🤣 🎉 💥 🤢 🎟️ 🤬, half-slot offset
- Customs continue in rows 3–4 using the same interleaved sequence
- No extra gap between canonical and custom rows
- Ring and emoji share exact slot center
- Ring:glyph size ratio preserved while scaled down
- Complete field centered horizontally and vertically in available Image View prim area
- No AI percentages on Image View
- No unrelated UI changes

## v0.9.39.51

Genreactrix v0.9.39.51 — Image View Slot Authority Recovery

Scope:
- Image View reaction geometry only.
- Preserve v0.9.39.50 canonical/custom 4-row continuous brick algorithm.
- Prevent legacy nth-child !important placement rules from overriding slot positions.

Verification:
- applyLandscapeImageViewGridPosition now writes grid-column and grid-row as inline !important declarations.
- This outranks historical stylesheet !important nth-child placement rules.
- No Judgment, Customs CRUD, PrimFusion, AI percentage, or unrelated UI logic changed.

## v0.9.39.52

Genreactrix v0.9.39.52 — Image View Compact Fit Authority

Scope: Image View reaction field fit only.

Verified source changes:
- Keeps the v0.9.39.51 canonical/custom slot engine unchanged.
- Overrides historical #landscapeImageView size/grid rules at matching specificity.
- Uses 15 slot columns and four uniform 31px rows.
- Keeps rows 2→3 at the same spacing as every other adjacent row (no customs section gap).
- Locks ring:glyph ratio to 34:24 (28.333px ring / 20px glyph).
- Centers ring and glyph on the same slot center.
- Centers the complete reaction field in the available Image View reaction area.
- No Judgment, Customs CRUD, theme, image, navigation, or AI behavior changes.

## v0.9.39.53

Genreactrix v0.9.39.53 — Image View Ring Clearance Calibration

Scope
- Image View reaction field only.

Acceptance
- Preserve v0.9.39.52 canonical/custom ordering and four-row brick geometry.
- Preserve shared ring/emoji center points.
- Increase ring clearance around emoji to approximate the accepted Judgment-page visual ratio.
- Ring diameter: 34px.
- Emoji font size: 17.85px.
- Symbol box: 27.2px.
- Ring stroke: 2.55px.
- Row pitch: 35px.
- Do not modify Judgment page, Customs behavior, AI percentages, or unrelated UI.

## v0.9.39.55

Genreactrix v0.9.39.55 — Image View Ring Center + Touch Calibration (Cache-Busted)

Scope:
- Fix packaging/version cache-busting defect from v0.9.39.54.
- Make the already-authored Image View ring calibration actually load in-browser.

Acceptance:
- Internal/visible build markers read v0.9.39.55.
- styles.css and app.js URLs use ?v=0.9.39.55.
- Image View ring diameter is 50px.
- Image View glyph size is 17px.
- Ring and emoji share the same 50px centered box.
- Existing Image View slot/order geometry is unchanged.
- No unrelated UI changes.

## v0.9.39.57

Genreactrix v0.9.39.57 — Image View Bounded Field Scaling

Scope: Image View reaction field only.

Acceptance criteria:
- Preserve v0.9.39.56 ring/emoji shared-center geometry.
- Preserve ring-to-emoji ratio and all relative slot positions.
- Preserve canonical rows 1/2 and custom rows 3/4 continuous brick formation.
- Uniformly scale the entire finished reaction field only when needed to fit within the available Image View reaction region.
- Keep the scaled reaction field horizontally and vertically centered.
- No unrelated UI changes.

## v0.9.39.58

Genreactrix v0.9.39.58 — Image View Horizontal Field Centering

Scope: Image View reaction field horizontal position only.

Acceptance criteria:
- Preserve v0.9.39.57 ring/emoji shared-center geometry.
- Preserve ring size, emoji size, field scale, slot spacing, four-row brick pattern, and vertical position.
- Preserve canonical rows 1/2 and custom rows 3/4 continuation.
- Anchor the finished reaction field midpoint to the exact horizontal midpoint of the available Image View reaction region.
- No unrelated UI changes.

## v0.9.39.60

Genreactrix v0.9.39.60 — Image View Reaction Field Centering

1. In Image View, the complete emoji/ring formation is centered horizontally and vertically inside its reaction region.
2. No ring, emoji, spacing, row, stagger, custom-reaction, or relative-position geometry changes.
3. Formation fitting remains uniform scaling of the finished field only when required.
4. No positional margins or `left:50%` translation are used to center the field.
5. No layout behavior outside Image View is changed.

## v0.9.39.62

Genreactrix v0.9.39.62 — Image View Rendered-Bounds Centering

Scope: Image View only.

- Uses the rendered reaction-region and rendered formation bounding boxes to compute center delta.
- Moves the finished formation as one rigid object.
- Does not change ring size, emoji size, spacing, stagger, custom placement, or formation geometry.
- Visible build version and app.js/styles.css cache-busting query strings are bumped to v0.9.39.62 so GitHub Pages/mobile browsers load the new assets.

## v0.9.39.63

Genreactrix v0.9.39.63 — Folded-Landscape Customs Workspace

Acceptance criteria
- Opening Customs lands on Custom Search with an empty search query.
- The top control row reads Custom Search / Custom Reactions / Custom Themes / AI Analysis.
- Search, Reactions, and Themes panels remain mounted but only the active panel participates in layout/painting.
- Search results are separated into Custom Reactions and Custom Themes.
- Custom Reaction chips show emoji + label + pencil; Custom Theme chips show label + pencil; no delete control is shown on chips.
- Tapping a custom retains the existing selection behavior; pencil opens the existing Edit dialog, where Delete remains available.
- Reactions and Themes each offer A-Z, Date, and Top (usage count) sorting plus an ascending/descending arrow and independent scrolling.
- Custom chips size to their contents and wrap instead of stretching to full rows.
- Focusing Custom Search promotes the Customs workspace over the visual viewport above the Android keyboard; unused Image View content is not shown or visibly compressed.
- Leaving search focus restores the normal folded-landscape layout.
- Existing creation/edit/delete logic, vocabulary versioning, AI Analysis drawer behavior, and Image View centering remain unchanged.

## v0.9.39.64

Genreactrix v0.9.39.64 — Customs control-band polish

- Custom Search, Custom Reactions, Custom Themes, and AI Analysis are 28px tall in folded landscape, matching the AI drawer buttons.
- The existing 30px control-band footprint is preserved.
- The 2px released by compressing the buttons becomes breathing room beneath the drawer border/divider.
- The Customs workspace below begins at the same position as v0.9.39.63; no workspace geometry is changed.
- No Customs behavior, data, search, sorting, editing, keyboard handling, or drawer switching logic is changed.

## v0.9.39.65

Genreactrix v0.9.39.65 — PrimFusion Matrix Pass 1

Source baseline: v0.9.39.64 customs-button-spacing.

Scope:
- Matrix version remains 0.0.0.0 (pre-batch / not yet used).
- Updated nine PrimFusion labels only in matrix data and pair-to-label references.
- No CSS, geometry, font, matrix placement, or interaction changes.
- Non-matrix generic vocabulary is intentionally untouched.

Renames:
PFM0112 Precocious -> Innocence
PFM0113 Heartwarming -> Playful
PFM0208 Sublime -> Romance
PFM0211 Gothic -> Vulnerable
PFM0310 Horrific -> Despair
PFM0311 Harrowing -> Foreboding
PFM0612 Madcap -> Alien
PFM0812 Visionary -> Ethereal
PFM1011 Visceral -> Horror

## v0.9.39.66

Genreactrix v0.9.39.66 — PrimFusion current vocabulary sync

[PASS] Website PrimFusion Matrix labels synchronized to current 0.0.0.0 vocabulary.
[PASS] Current replacements include Cozy, Joy, Festive, Cringe, Zany, Ribaldry, PartyTime, Freakshow, Medicated, Magical, Seduction, and Glory.
[PASS] Matrix version remains 0.0.0.0 because the vocabulary has not yet been locked into historical evaluations.
[PASS] PrimFusion pair codes and primitive ordering unchanged.

## v0.9.39.67

Genreactrix v0.9.39.67 — Portrait AI Theme Usage Reports

[PASS] Existing portrait Reports module retained; no new top-level workflow added.
[PASS] Added "Most recent AI run" report scope using the existing AI job store.
[PASS] Added AI Theme Usage report module.
[PASS] Added one-tap "AI Theme Usage · Latest Run" report action.
[PASS] AI Theme Usage report shows: images in scope, images with Theme results, missing Theme results, custom selection rate, per-Theme total selections, percent of analyzed images, rank 1/2/3 counts, average confidence, Custom proposals, never-selected current PrimFusion Themes, prompt versions, and model metadata.
[PASS] Existing Director Reactions / Director Themes reporting remains unchanged; labels clarified in the UI.
[PASS] Existing report JSON/CSV export and stored-report history remain available.
[PASS] PrimFusion vocabulary and matrix version are unchanged by this reporting-only build.

## v0.9.39.68

Genreactrix v0.9.39.68

Focused recovery build for portrait AI testing.

Changes:
- Fix Queue Stop so completed jobs cannot be pushed into an endless “Stopping safely” state.
- Acquisition jobs without a stop adapter now cancel cleanly instead of hanging.
- Startup recovery resolves already-stuck acquisition jobs with terminal items.
- Cancelled AI jobs now cancel their queued AI items and reconcile their queue wrapper on startup.
- Queue action buttons are state-aware; Stop is no longer offered for finished jobs.
- AI Console component checkboxes now load/save the same default component-selection state used by the portrait quick controls.

No PrimFusion vocabulary, AI definitions, report calculations, or Worker behavior changed.

## v0.9.39.70

Genreactrix v0.9.39.70

Focused portrait AI-run recovery build.

Changes:
- Removes unsupported Emotion, Reaction reasons, and Genre reasons from the portrait quick AI controls and AI Analysis component grid.
- AI Analysis now exposes only Worker-supported outputs: Reactions, Themes, Description.
- On startup, persisted AI jobs stranded in queued state are automatically resumed instead of remaining inert.
- Preserves v0.9.39.69 portrait Queue viewport containment and prior queue recovery behavior.

No PrimFusion vocabulary, AI definitions, report calculations, or Worker behavior changed.


## v0.9.39.72

Genreactrix v0.9.39.72

Canonical-repo AI recovery and configuration persistence build.

Changes:
- Built directly from the uploaded current GitHub repository tree.
- Synchronizes visible/index/app build version at v0.9.39.72.
- Preserves Worker URL and Analysis key in Settings plus local fallback storage.
- Reloads Worker configuration after the Settings Engine is ready.
- Queued AI jobs wait safely when no Worker URL is configured instead of failing through the population.
- Queued AI jobs can be resumed, and stranded queued jobs resume only after settings/provider initialization.
- Saving provider configuration resumes stranded queued AI work.
- AI Missing/Rerun behavior is persisted for Reactions, Themes, and Description.
- Preserves three supported AI outputs only and portrait Queue viewport containment.
- Consolidates historical ACCEPTANCE txt files into ACCEPTANCE_HISTORY.md to reduce flat-root file count.

No PrimFusion vocabulary, AI definitions, report calculations, or Worker behavior changed.


---

Genreactrix v0.9.39.78

AI queue source-type preflight.

Changes:
- Local image records must successfully decode in the browser before they may enter a new AI queue.
- Unsupported or undecodable local image types are skipped before queue creation rather than sent to the Worker.
- AI transport no longer falls back to sending an original local file when JPEG preparation fails.
- Queue jobs retain a sourceRejects list and skipped count for unsupported/undecodable records.
- Browser-decodable local formats are still normalized to a temporary JPEG for AI transport; original stored images are unchanged.
- Preserves v0.9.39.77 AI image transport and all prior queue/provider recovery behavior.

No PrimFusion vocabulary, AI definitions, report calculations, or Worker behavior changed.

---

## v0.9.39.79

Genreactrix v0.9.39.79

AI eligibility selection-order correction.

Changes:
- AI scope filtering and Missing/Rerun eligibility are now evaluated before Quantity limits are applied.
- Quantity 1 no longer inspects only the first record in a scope and incorrectly reports 0 eligible when later records need analysis.
- Queue/processing records are excluded from the live preflight count.
- Preflight now shows total eligible images and how many the requested quantity will actually run.
- Preserves v0.9.39.78 source decode preflight, JPEG AI transport, failure quarantine, component isolation, provider diagnostics, and Reports.

No PrimFusion vocabulary, AI definitions, report calculations, or Worker behavior changed.

---

## v0.9.39.80

Genreactrix v0.9.39.80 — Canonical Feed / Park / Filter

Changes:
- Landscape rehydrates from canonical persisted Image Records.
- Landscape toolbar ends Keep → Park → Filter → Flip.
- Park is persistent, Indigo, and does not navigate automatically.
- Filter adds All / Feed and Include/Exclude controls for Review Flagged, Rejection Flagged, Kept, and Parked.
- Long-hold Flag adds the persistent rejection/deletion-intent state; Reject Image moves the asset to Recycle while retaining the Image Record/history.
- Portrait Images → Recycle is wired to canonical nested record fields.
- Legacy zero-item Queue shells are cleaned at startup.

This build still treated the Landscape population as the broad canonical record population rather than a Portrait-pushed Inbox, and its bundled worker folder was stale.


---

Genreactrix v0.9.39.81 — Inbox Handoff / Pack Filter / Sort

Acceptance targets
- Built from v0.9.39.80 website code.
- Bundled worker/ is exactly the v0.9.6.2 Worker patch source set supplied separately.
- Portrait is the handoff source: analyzed image packs are pushed into Inbox; Landscape does not pull from Portrait.
- Portrait AI panel provides Use Latest and Select Pack controls.
- Pack candidates come from persisted Portrait import jobs and are available only when every image in the pack has current Reactions, Themes, and Description AI components.
- Both Portrait folder intake paths and Portrait URL intake create persisted import jobs so every normal Portrait intake has a Pack identity available for later Inbox push.
- Select Pack opens a popup; selecting a pack pushes it into Inbox without cloning Image Records.
- Inbox can contain multiple pushed packs; pushing the same pack again does not duplicate it.
- Landscape no longer uses the three demo images as its working source. With an empty Inbox it shows an Inbox-empty state.
- Landscape uses the same canonical Image Records and stored AI Reactions, Themes, and Description created in Portrait.
- All = all usable Inbox records, including Parked and Flagged for Deletion.
- Feed = usable Inbox records except Parked and Flagged for Deletion.
- Filter “Or Select:” Include/Exclude categories: Flagged for Review, Flagged for Deletion, Kept, Parked, Seen.
- Seen is marked when a canonical Inbox image is actually displayed in Landscape. Exclude Seen provides the unseen population.
- Pack is a special Filter control with no Include/Exclude checkboxes. Select Pack opens a popup of Inbox packs; unchosen/greyed means all Inbox packs.
- Sort is inside Filter with Pack Order, Newest First, Oldest First, Filename A–Z, and Randomize.
- Randomize uses a persisted seed so the randomized order survives reloads/sessions until the sort is changed; selecting Randomize again after another sort produces a new order.
- Filter state, Pack filter state, sort mode, and Inbox pack list persist across reloads/sessions.
- Existing Park / Filter / Flip toolbar order remains Keep → Park → Filter → Flip (PF Chang(e)).
- Recycle remains the existing Portrait system; this build does not redesign it.
- Reaction and Theme filter/sort options are explicitly deferred.


---

Genreactrix v0.9.39.82 — Ready Push / Pack Creation / Failed Export

SOURCE
- Built directly from Genreactrix v0.9.39.81.
- Bundled worker/ is the exact supplied Genreactrix Worker v0.9.6.2 patch.

BOOKED CORRECTIONS
- A Pack does NOT exist before the Portrait push.
- Portrait Ready images are the current fully analyzed, unpushed population.
- Push to Inbox creates a new Pack at that moment with a stable ID, creation time, and frozen Image Record membership.
- Failed images remain behind and can join a later Pack only after a successful retry.

PORTRAIT
- Replaces the incorrect Use Latest / Select Pack pre-push controls with Push to Inbox.
- Push button operates on the current Ready population and shows its count.
- Ready excludes records already pushed to a Pack, Recycle, rejected, or archived.
- Adds Export Fails. Current Failed means an unpushed/non-recycled record with a failed Reactions, Themes, or Description component.

EXPORT FAILS
- Copies original failed images into a ZIP.
- Adds failure-manifest.json with Image ID, filename, failed components, exact error, AI job/run details, timestamps/configuration, model/prompt metadata where available, Worker URL, and site build.
- If any image cannot be copied, export aborts before anything is moved.
- After ZIP creation, asks for confirmation before moving originals.
- On confirmation, Genreactrix-managed originals move to the existing Recycle system.
- Exported items leave current Failed state and active AI/Queue failure state while failure history remains recorded.

INBOX / LANDSCAPE
- Landscape continues to use canonical Image Records from Packs already pushed into Inbox; no shadow image records.
- Pack picker is Landscape Filter-only and lists Packs already in Inbox.
- Pack filter remains unrestricted/grey when no Pack is selected.
- All includes Parked and Flagged for Deletion; Feed excludes them.
- Include/Exclude filters: Flagged for Review, Flagged for Deletion, Kept, Parked, Seen.
- Exclude Seen supplies the unseen view.
- Sorting remains inside Filter: Pack Order, Newest First, Oldest First, Filename A–Z, Randomize.
- Filter/Pack/sort state remains persistent.
- PF Chang(e) remains Keep → Park → Filter → Flip.
- Reaction/Theme filtering and sorting are NOT included.

RECYCLE
- Existing Portrait Recycle UI remains the recycle system.
- Export Fails moves originals there after confirmation; it does not redesign Recycle.

VERIFICATION REQUIRED BEFORE DELIVERY
- All JavaScript parses with node --check.
- HTML IDs are unique.
- v0.9.39.82 markers are synchronized in app/index/assets.
- No stale v0.9.39.81 executable/version markers outside history.
- Worker v0.9.6.2 bundled files match supplied patch byte-for-byte.
- ZIP is flat at project root except required worker/ nesting.
- Failure ZIP writer generates a standards-readable ZIP in validation.

## v0.9.39.84 — Landscape Canonical Layout Restore
Restored the approved Landscape workstation presentation after the Inbox/Filter implementation altered the visual state. Matrix remains rendered on an empty feed; toolbar returns to the canonical treatment with only Park and Filter added; idle Park/Filter match ordinary buttons and illuminate only when active; Keep cannot appear selected without a current image.


## v0.9.39.85
- Landscape state-light cleanup: idle state buttons match siblings, Park active blue, Filter active teal only for actual category/Pack filters, sort never counts as Filter active.


## v0.9.39.86

- Fold-landscape only: Park active state restored to indigo/purple-blue.
- Customs header changed from 74.5% + separately positioned AI Analysis to one literal four-column grid: Custom Search | Custom Reactions | Custom Themes | AI Analysis.
- Four Customs header controls use the AI top-row geometry: four equal columns, 4px gap, 28px height, 3px 5px padding, zero margin, line-height 1, clamp(8px,.76vw,10.5px).
- No other layout or workflow behavior changed.

## v0.9.39.87
- Added a lightweight portrait Live Event Log opened by a `>_` header button.
- Event Log is a session-scoped diagnostic overlay only; it does not replace existing status displays or alter workflow logic.
- Mirrors status text, queue progress/state, warnings/errors, window errors, and unhandled promise rejections into a timestamped command-prompt-style feed.
- Log is capped at 400 entries and includes a Clear control.
- Worker remains v0.9.6.2 unchanged.

## v0.9.39.88
- Added **Cycle** to AI Analysis as a bounded automatic Missing-pass helper.
- Cycle freezes the initial target population, then retries only unresolved selected AI components.
- It stops when the exact unresolved image/component set repeats on two consecutive passes, when everything succeeds, on a safe user stop, on provider pause, or at a 25-pass safety ceiling.
- Cycle emits progress into the v0.9.39.87 Live Event Log.
- Worker remains v0.9.6.2.

