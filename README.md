## v0.9.40.32 — Quarantine + Defective

This release completes the next bounded lifecycle migration after the accepted v0.9.40.31 Origin Gates pass. It turns the preliminary Quarantine stage into a real Queue-owned investigation hold with durable case history and the two canonical manual outcomes: Release or Defective.

### Quarantine trigger
- A suspected Problem Image enters **Quarantine** only after **three distinct isolated AI attempts** fail on that image while the surrounding Queue images process normally.
- AI attempts now carry a unique per-attempt ID even when the same AI job item is retried. This repairs the older preliminary counter, which reused one item ID and therefore could not reliably reach three.
- Interior images require the immediate image before and after them to have completed normally. A first/last Queue image may use the next/previous two normal images so an edge item cannot retry forever merely because it lacks two-sided neighbors.
- Adjacent/broad failure clusters are not treated as isolated Problem Images.
- Provider-wide conditions such as authentication, connection/network, rate-limit, quota, or missing Worker configuration do not increment the isolated-image streak.
- `Workers AI vision failed` is no longer automatically classified as provider-wide; if it occurs on one image while surrounding images succeed, it can contribute legitimate image-specific Quarantine evidence.

### Quarantine ownership and retry safety
- Added `quarantine-engine.js`, owned by Queue.
- Each open Quarantine Case stores Image ID, trigger, isolated-attempt IDs, linked AI Job IDs, ordered error evidence, timestamps, and final resolution.
- Quarantine is outside normal Queue ordering and remains part of Active processing exactly once.
- Automatic Flow-through, Buffer, Cycle/Missing, ordinary AI job retry, stranded-job resume, and generic Failed targeting all exclude Quarantine.
- **Daily Housekeeping does not touch Quarantine.**
- Existing records already carrying `workflow.stage = quarantine` are migrated into an explicit Quarantine Case without rewriting image assets.

### Manual investigation outcomes
- The existing Queue console now shows open Quarantine cases in its existing list area.
- **Release** clears current/partial AI working data, preserves diagnostic History, resets the isolated-failure streak, and returns the Image Record to Queue as a fresh AI candidate.
- Once released, normal Queue/AI behavior may pick the image up again; the retry is no longer occurring *inside* Quarantine.
- **Defective** is a destructive technical finalization and requires confirmation.
- Defective deletes the full-resolution working/kept asset directly rather than routing it through Recycle.
- The permanent 64×64 thumbnail, Image Record, Origin Metadata, AI diagnostics/history, and Quarantine Case remain.
- Defective is a final historical/reporting state. It is excluded from Active counts, generic AI-failure export, and all future AI candidate/retry paths.
- Defective remains distinct from Director Reject.

### Queue presentation
- The existing six-cell Queue summary geometry is preserved.
- Its former generic **Failed** summary cell now displays **Quarantine**, because Quarantine is the canonical Queue-owned technical hold; ordinary job failures remain visible in the existing job list/details.
- No new Queue panel, breakpoint, Portrait/Landscape composition, or CSS rule was added.

### Preservation
- `styles.css` is byte-for-byte identical to v0.9.40.31.
- Existing non-script `index.html` structure remains exactly 1,549 elements with the same 673 IDs and the same tag/ID/class signature.
- No Origin/Dupe/Repeat semantics, Batch, Post-processing, Purgatory, Keep, Recycle, Director Evaluation, PrimFusion, Reaction 60/40 mathematics, Worker prompts, or accepted Portrait/Landscape geometry is redesigned.
- One new nonvisual root engine is added: `quarantine-engine.js`.

### Verification performed
- JavaScript syntax validation passes across all root project engines and Worker JavaScript sources.
- Quarantine lifecycle tests pass for: three unique isolated failures; ordered three-attempt case evidence; Release → fresh Queue; Defective finalization; provider-global failure exclusion; first/last Queue edge handling; and adjacent failure-cluster exclusion.
- Home-count test passes: Quarantine remains Active exactly once; Defective is final and excluded from Active.
- Structural preservation check passes: CSS checksum is unchanged and the non-script HTML tag/ID/class structure is identical to v0.9.40.31.

### Real-device acceptance gate
1. Confirm an ordinary healthy image still follows Queue → AI → Staged normally and that Portrait/Landscape remain visually unchanged.
2. If you have an image that repeatedly fails AI while neighboring images succeed, allow three distinct attempts. It should stop automatically in **Queue → Quarantine** rather than continuing to spend AI attempts.
3. Open Queue. The Quarantine row should show **Release** and **Defective**.
4. Release should return it to Queue for a fresh try. If you intentionally test Defective instead, confirm the warning: the full-resolution image is deleted directly while its permanent thumbnail/record/diagnostics remain.

## v0.9.40.31 — Origin Gates

This release implements the next bounded lifecycle migration after the accepted v0.9.40.30 Home-count pass. It makes Dupe, Repeat, true Import Failure, and Retry Import Source first-class **Origin** behavior instead of silently skipping duplicate-looking sources or creating pre-admission failures as ordinary Image Records.

### Canonical Origin naming
- The Director-facing module/count name is now **Origin** rather than **Images**.
- The existing module identifiers remain `images` internally to avoid an unnecessary codewide identifier migration.
- The existing Origin console geometry is preserved. Its former **Review** slot is relabeled **Gates** and is reused for Origin-case actions.

### Dupe
- New candidates are fingerprinted with SHA-256 and a permanent 64×64 candidate thumbnail before admission.
- Existing thumbnails provide a lightweight shortlist for legacy records that predate full-content fingerprints; available full-resolution blobs are then checked for exact identity.
- A suspected duplicate is stopped at Origin and receives an Origin Dupe case linking the candidate record/thumbnail, original Image Record, and detection evidence.
- **Sustain** permanently records that specific fingerprint as a Dupe. Future encounters of that fingerprint auto-block without another review.
- **Overrule** explicitly admits the stored candidate into normal processing and Queue.

### Repeat / Re-evaluation
- An exact fingerprint match to an already evaluated/processed Image Record is a **Repeat**, not a Dupe.
- Repeat is blocked at Origin and does not create another Image Record.
- **Re-evaluate** is the explicit bypass. It reuses the stable Image ID, preserves prior state in History, installs a fresh working source, clears the current AI/Director evaluation state, and returns the image to Queue for a new evaluation.

### Import Failure
- A file/URL that cannot be read or admitted now creates an **Origin Import Failure case**, not a new `import-failed` Image Record.
- The short error/source identity is retained and automatic re-attempts of that failed source are suppressed.
- **Retry** is manual and may override suppression.
- Daily Housekeeping does not retry true Import Failure.
- Legacy `import-failed` Image Records from earlier builds are preserved rather than destructively rewritten in this migration.

### Retry Import Source
- Added the canonical `origin-source-retry` lifecycle state for an already-known Image Record whose required full-resolution working source is missing.
- Up to three immediate non-AI source attempts are made where a retrievable URL exists.
- Unresolved source recovery moves the known image to Origin and creates a Retry Import Source case, preventing double ownership/counting in Queue/Inbox.
- Daily Housekeeping may perform one non-AI retry of unresolved source-recovery cases. Successful recovery restores the prior lifecycle stage.

### Import/accounting boundary
- Import no longer silently removes known URLs before Origin evaluation; repeated encounters reach the Origin gate logic.
- Import Job counters distinguish admitted Image Records, Origin gates, duplicate/repeat gates, and true failures. Image IDs contain only successfully admitted Image Records.
- Image Records now retain their Import Job ID in normalized source metadata, preserving the v0.9.40.29 Origin-count accounting contract.
- Home Origin accounting includes unresolved Import work, pending Dupe review, and Image Records currently owned by Retry Import Source without counting any candidate twice.

### Preservation
- `styles.css` is byte-for-byte identical to v0.9.40.30.
- No Portrait/Landscape sizing, spacing, breakpoint, image viewport, Director controls, AI calculation, 60/40 Reaction mathematics, Batch, Post-processing, Purgatory, Keep, or Recycle behavior is redesigned here.
- One new root engine file is added: `origin-gate-engine.js`. Release structure remains shallow and well under the 100-file practical ceiling.

### Verification performed
- JavaScript syntax validation passes across the project and Worker sources.
- Engine tests pass: first-time admission; active-image Dupe; Sustain + future auto-block; processed-image Repeat; Import Failure suppression; mixed Import Job admitted/gated accounting; and Origin active-count reconciliation including Retry Import Source.

### Real-device acceptance gate
1. Import one genuinely new image: it should enter Queue normally.
2. Import the same still-active image again: it should stop under **Origin → Gates** as Dupe; test Sustain or Overrule.
3. After an image has been evaluated/processed, importing the exact same file should appear as **Repeat** and offer **Re-evaluate** rather than creating a second Image Record.
4. Existing accepted Portrait/Landscape geometry must remain unchanged.

## v0.9.40.30 — Section-aligned Home main counts

This release corrects the Director-facing naming of the Home main counts without changing the authoritative v0.9.40.29 accounting model or the accepted layout.

### Main count names now match the section buttons
- The existing six main-count slots now read **Active / Images / Queue / AI / Batch / Reports**.
- **Images** shows current Origin/pre-admission image work for the + Images section.
- **Queue** shows the authoritative Queue population: Waiting + In AI + Partial + Staged.
- **AI** shows images currently In AI; it remains a Queue-owned process population and is not added again to Active.
- **Batch** shows the current Inbox work population represented by the Batch section.
- **Reports** shows the current stored report-record count already used by the Reports section.
- **Active** remains the project-wide active-image accounting total: Origin + Queue + Quarantine + Inbox + Post-processing + Purgatory.

### Navigation semantics
- Tapping Images, Queue, AI, Batch, or Reports in the main count row opens the correspondingly named section.
- Tapping Active shows the canonical active-image reconciliation detail.
- Internal lifecycle terms such as Origin, Quarantine, Post-processing, and Purgatory remain implementation/state vocabulary rather than competing top-level section names.

### Preservation
- No Home count arithmetic or lifecycle ownership rules changed from v0.9.40.29.
- `home-count-engine.js` is unchanged.
- `styles.css` is byte-for-byte identical to v0.9.40.29.
- Portrait Control Station tag/ID/class structure is unchanged; only main-count text/data semantics and build metadata changed.
- No Batch, Post-processing, Purgatory, AI calculation, Worker, persistence, image-data, spacing, sizing, breakpoint, Portrait, or Landscape geometry changes.

### Acceptance gate
On the phone, confirm the main row reads **Active / Images / Queue / AI / Batch / Reports** and that each named count opens the section with the same name. Counts should otherwise behave exactly as in v0.9.40.29.

## v0.9.40.29 — Authoritative Home active-processing counts

This release follows the validated v0.9.40.28 Batch/Post-processing boundary. It rebuilds Home counting against the canonical lifecycle state spine without changing the accepted screen geometry.

### Authoritative count spine
- **Active = Origin + Queue + Quarantine + Inbox + Post-processing + Purgatory.**
- **Queue = Waiting + In AI + Partially AI Processed + Staged.** AI remains a process over Queue-owned images and is not added again.
- **Inbox = Working + Review + Depot + Delete + Reject.**
- **Keep is an overlapping Inbox attribute** and never adds a second image to Inbox Total or Active.
- Final Keep, Recycle Bin, permanent Records, Pack/Bundle/Batch group counts, and AI call/job telemetry are not added to the Active image total.
- Added a maintenance checker that flags any non-final Image Record that does not resolve to one authoritative active owner/location.

### Existing Home layout, corrected meanings
- The existing six status slots under + Images are reused, in the same order and geometry, for **Active / Origin / Queue / Quarantine / Post / Purgatory**.
- Batch continues to show Inbox Total plus **Working / Review / Depot / Delete / Reject**, with Keep shown separately as the independent overlapping attribute.
- Queue Home status now shows **Waiting / Partial / Staged** image populations instead of queue-job telemetry.
- AI Home status shows **In AI / Buffer / Staged / Failed**. In AI and Staged are Queue-owned populations; Buffer is configuration; Failed is AI diagnostic information and is not added to Active.
- Bundle count remains explicitly labeled as a different group unit.

### Origin accounting
- New Imports stamp their Import Job ID into Image Record source metadata. This lets Home subtract admitted records from the still-active Origin population immediately during a multi-image import rather than briefly counting the same image in both Origin and Queue.
- Import-job create/update events now refresh Home counts while intake is running.

### Preservation
- **`styles.css` is byte-for-byte identical to v0.9.40.28.**
- Portrait Control Station tag/ID/class structure is identical to v0.9.40.28; only status labels/meaning and build metadata change.
- No Batch/Post-processing/Purgatory transaction behavior changes.
- No AI calculation, Worker, Reaction/Theme, image blob, retention, or layout breakpoint changes.

### Real-device acceptance gate
Use one new image and watch its lifecycle: after Import it should increase Queue/Active; while AI runs it should move within Queue accounting rather than increase Active; after Staging and Bundle it should move from Queue to Inbox with the same Active total; after successful Batch it should leave Active. Existing accepted Portrait/Landscape geometry must remain unchanged.

## v0.9.40.28 — Batch confirmation button repair

- Fixes the real-device v0.9.40.27 regression where the final **Batch these images → Batch** button could be tapped repeatedly without submitting.
- The async click handler now captures the selected Image IDs before crossing its first `await`, rather than reading `event.currentTarget` after the browser has cleared the event dispatch target.
- The v0.9.40.27 Post-processing/Purgatory transaction engine is unchanged.
- Real-device acceptance passed: Batch reported success, the selected image left Inbox, and Batch history updated.
- No layout/CSS changes.

## v0.9.40.27 — Atomic Post-processing + Purgatory

This release crosses the bounded Batch → Post-processing migration boundary established in the 2026-08-14 handoff. It changes lifecycle/data behavior only; the accepted `.25` layouts and CSS are preserved.

### Batch commit boundary
- Batch candidates may still be loaded from eligible Inbox work, but **only the Director-selected images at confirmation become committed Batch members**.
- The selected set is frozen into the Batch record before Post-processing begins, including each image’s terminal decision, Keep state, route, final stage, evaluation version, and source-storage mode.
- Interrupted `submitting` Batches retain a submission token and frozen committed items so the same submission can be resumed after reload rather than silently restarted or duplicated.

### Atomic Post-processing
- Added `post-processing-engine.js` with a persistent per-image transaction plan and attempt journal.
- Required Keep / exclusion writes are completed before the authoritative Image Record is finalized. If a required pre-commit write fails, newly written fragments are rolled back (or prior values restored) and the item is not treated as finalized.
- Non-Keep working copies are routed to **Recycle Bin** by authoritative record commit; the existing full-resolution blob is not rewritten merely to move lifecycle ownership.
- Keep remains independent of Depot / Delete / Reject. A kept Delete/Reject image can retain the full-resolution asset while also receiving its exclusion record.
- Successful commits stamp the Batch submission, frozen terminal, Post-processing plan ID, and completion time for idempotent retry/recovery.

### Purgatory + recovery
- Failed Post-processing items receive **three automatic attempts** with a complete ordered attempt/error history.
- After three failures, the unresolved frozen plan remains in **Purgatory** instead of producing a half-finalized result.
- Maintenance exposes individual **Retry** and **Retry All**; each invocation performs exactly one new non-AI attempt per targeted unresolved item.
- Added `housekeeping-engine.js`; once per local day it gives eligible Purgatory items one non-AI retry and runs the existing Recycle retention purge. It never initiates AI work.
- Reload recovery reconciles interrupted attempts. A legacy partial Batch result is inferred as complete only when the required final record **and** required Keep / Recycle / exclusion artifacts are all present.

### Safety / preservation
- No local IndexedDB/localStorage reset.
- No full-resolution blob migration or reserialization.
- No AI rerun and no 60/40 calculation change.
- Permanent 64×64 thumbnails are unchanged.
- Legacy fields remain available; this release does not delete the compatibility data introduced by the State Spine/Bundle migration.
- **No `styles.css`, layout geometry, spacing, sizing, or breakpoint changes.**
- DuckDuckGo latency work from experimental `.26` is not carried forward; `.27` is based on the accepted `.25` branch.

### Acceptance gate
On a real browser/device, submit at least one normal non-Keep Depot image and confirm it leaves Inbox and appears as Batched + Recycle. Then verify ordinary Portrait/Landscape operation remains visually identical to `.25`. A forced storage failure should remain recoverable in Purgatory rather than produce a partial finalization.

## v0.9.40.25 — Cross-browser portrait rotation

- Fixes DuckDuckGo/Android tall-phone portrait routing after rotating out of Landscape.
- Phone Portrait is now recognized by tall portrait geometry as well as the historical `<600px` CSS-width gate.
- Preserves true tablet/unfolded portrait behavior; only tall portrait viewports (aspect ratio 2:3 or narrower) receive the phone Portrait station.
- No lifecycle, Bundle, AI, Landscape geometry, Worker, or image-data changes.

## v0.9.40.24 — State spine + Bundle migration

Current implementation authority: 2026-08-14 system/data/module map. This is the first bounded source migration toward the canonical Origin → Queue → AI process → Staged → Bundle → Inbox → Batch → Post-processing model. It deliberately changes lifecycle/data ownership before any new Landscape redesign.

### Queue / AI / Inbox ownership
- Successful Import now enters **Queue** directly. The old post-Import `available` stage normalizes to Queue waiting.
- **AI is a process, not image storage.** Images remain Queue-owned while AI is working.
- Valid incomplete AI work normalizes to **Partially AI Processed** in Queue.
- Images with all three core AI components complete become **Staged** in Queue.
- AI completion no longer automatically manufactures an Inbox item.
- Partially AI Processed items are prioritized ahead of untouched Queue work; the most-complete partials resume first.

### Pack → Bundle correction
- **Pack** remains the Origin/import-preparation grouping term.
- **Bundle** is now the Queue → Inbox grouping term.
- Existing legacy Inbox Pack membership is copied into Bundle metadata without deleting the legacy fields.
- The old `genreactrix-landscape-inbox-v1` local data is copied into the new Bundle store when needed; the legacy store is retained as a rollback safety source.
- Bundle membership remains available as Inbox filter/search metadata.

### Automatic flow-through vs Buffer
- Normal default operation is **Automatic flow-through**: AI works toward the next configured Bundle.
- Default Bundle size is currently **50** and remains editable.
- When at least the configured number are Staged, exactly that many are Bundled into Inbox; excess remains Staged.
- **Complete whatever is available** remains an explicit option for an undersized final remainder.
- **Buffer** is now treated as a separate optional operating mode rather than being layered onto normal automatic flow-through.
- Existing Buffer target, refill threshold, and priority controls are retained for live testing; no functionality was removed merely because its final usefulness is still being evaluated.

### Lifecycle spine and recovery groundwork
- Added `lifecycle-engine.js` as the canonical image-state spine.
- Added `bundle-engine.js` for Queue → Inbox grouping/transfer.
- Added canonical stages for Queue waiting, AI processing, AI partial, Staged, Inbox working, Post-processing, Purgatory, Quarantine, and existing final states.
- Added preliminary Problem Image / Quarantine detection for three isolated AI failures with successfully processed neighboring images.
- AI stop/recovery paths now reconcile images back to Queue-owned lifecycle states rather than treating AI as a storage location.

### Migration safety
- Image Record schema advances to v3.
- Legacy `inboxPackIds`, history, and old Inbox Pack storage are retained while Bundle equivalents are added.
- Existing full-resolution IndexedDB image blobs are not rewritten by the lifecycle/Bundle migration.
- Existing Inbox records with legacy Pack membership remain Inbox records.
- Existing AI-complete records without Inbox membership migrate to Staged rather than being pushed into Inbox.
- Thumbnail-at-Import, the existing 60/40 Reaction calculation, Inbox terminal behavior, Keep, and Recycle behavior are intentionally preserved.

### Temporary controls / terminology
- Portrait and Queue controls now expose **Staged**, **Bundle Staged**, Bundle size, Automatic flow, and Bundle remainder handling.
- Landscape user-facing Pack filtering is renamed to **Bundle** while legacy internal IDs remain temporarily for compatibility.
- Images/Import dashboard wording now uses Queue/Staged instead of Available/AI Output where this migration touches the UI.

### Deliberately not included in this release
- No Landscape geometry/CSS consolidation beyond tiny temporary control styling.
- No final Batch-tag selection refactor yet.
- No atomic Post-processing/Purgatory implementation yet.
- No Daily Housekeeping migration yet.
- No full Quarantine investigation UI or Defective finalization yet.
- No full Dupe/Repeat report implementation yet.
- No server/account file-storage migration.
- No Worker change.

## v0.9.40.19 — Single-file selection/import repair
- **Choose File now stages one selected image**; the main **Import** button imports that specific file. This matches the rest of the Add panel instead of silently auto-importing on file selection.
- Fixed stale cache-busting: `import-engine.js` was still requested as `?v=0.9.40.14` while the page was v0.9.40.16, which could leave Chrome/GitHub Pages running older import logic.
- File intake now accepts image files by MIME type **or image filename extension** so Android file pickers that return an empty/odd MIME type do not discard a valid image.
- Single-file imports are labeled as file imports rather than folder imports.

## v0.9.40.16 — Single image file intake

- Added **Choose File** beside **Choose folder** in the Portrait + Images Add panel.
- Choose File accepts one specific image (`image/*`) and imports exactly that selected file into the normal import/Queue path.
- The permanent 64×64 thumbnail continues to be created at Import by the existing image import engine.
- No Worker change.

## v0.9.40.15 — Portrait console fit + plain workflow labels

- Flag tap now toggles Review immediately. The previous handler incorrectly treated the synchronous image-record update as a Promise, so the record changed immediately but the UI did not repaint until a later render.
- Long press behavior is unchanged: it still opens the Exclusion menu.
- Exclusion menu buttons are now visually literal: solid red **DELETE** and solid hot-magenta **REJECT**. Emoji markers were removed.
- Landscape geometry is otherwise unchanged from v0.9.40.14.
- Portrait + Images, AI, Batch, Queue, and Reports dialogs are now hard-constrained to the phone viewport so their uniformly scaled temporary surfaces cannot widen beyond the dialog and clip off-screen.
- The previous 116–143% width compensation used with CSS zoom was removed; it was the direct cause of the horizontal clipping shown on Android.
- User-facing workflow labels are now **Review**, **Delete**, and **Reject**. Color remains visual styling only, not part of the button/state name.

## v0.9.40.13 — Inbox terminal lifecycle + Portrait housekeeping

Current implementation authority: 2026-08-12 Director review. This release migrates the live website away from the ambiguous legacy sideline / Ready / To batch / No Move model. Historical sections below are retained as history and may describe superseded behavior.

### Current Inbox workflow
- Images remain in **Inbox until Batch**. Before Batch they are simply being worked.
- Exactly one workflow terminal may be selected at a time: **Review**, **Depot**, **Delete**, or **Reject**. Selecting one clears the other three.
- **Review** stays in Inbox and is not Batch-eligible.
- **Depot**, **Delete**, and **Reject** are Batch-eligible.
- **Keep** is an independent full-resolution retention attribute. It may coexist with any terminal, including Delete and Reject. Turning Keep off only clears Keep.
- **Save** remains distinct from Keep: Save preserves editable working evaluation data; Keep preserves the full-resolution asset.

### Flag and Depot controls
- Landscape **Flag tap** = Review.
- Landscape **Flag long press** opens Exclusion: **Delete** or **Reject**.
- **Depot** is the explicit Director-finished-for-now terminal.
- Legacy sidelining behavior migrates to Review; Depot is a new explicit terminal rather than a blind rename.
- Landscape geometry from v0.9.40.12 is preserved; only the requested control/state behavior was changed.

### Import and storage
- A permanent **64×64 thumbnail is created at Import**, for temporary copies and hyperlink-only imports. Batch does not create thumbnails.
- URL intake can load URLs from text/CSV/TSV/JSON/HTML/Markdown and from DOCX/XLSX/ODS package contents.
- Wording is now **Prefetch, then Import**. Prefetch only inspects and stops.
- Direct remote image retrieval falls back to the authenticated Worker image proxy when browser CORS blocks the source. Bundled Worker: **v0.9.6.24-import-proxy**.
- Keep ON commits the full-resolution asset to **Kept Images** storage and a matching lightweight **Kept Images ID** record using the same stable Image ID basename with different extensions.
- Keep OFF + temporary copy goes to Recycle after Batch; default full-resolution purge remains 30 days. Image Record + thumbnail remain.
- Keep OFF + hyperlink-only leaves the full-resolution source at Origin; Image Record + Origin Metadata + thumbnail remain.
- Delete and Reject both retain separate historical exclusion records plus the permanent thumbnail for later research.

### Batch / Queue / AI
- Batch eligibility is explicit: **Depot + Delete + Reject**. Review and ordinary Working items remain in Inbox.
- Batch no longer presents Ready, To batch, No Move, or legacy multi-batch staging controls as Director workflow choices.
- Queue shows Queue-owned Running / Queued / Paused / Failed only. Director, To batch, and visible Blocked counts are removed. Generic blocked capability remains internal for future use.
- **AI Output** replaces workflow AI Ready / AI Complete wording. AI remains a standalone workspace/service.

### Records and manifests
- Manifest/Records are lightweight direct records/indexes. They do not duplicate full-resolution images.
- Ordinary records are not bundled into ZIPs for routine retrieval. ZIP remains appropriate for deliberate export/transfer/backup operations such as AI failure export.
- Current-facing source terminology is **Origin Metadata**.

### Temporary Portrait housekeeping
- + Images, AI, Batch, and Queue dialogs are uniformly scaled in Fold portrait so their full temporary control surfaces fit without page-level scrolling; long dynamic lists retain their own local scroll area.
- + Images keeps all eight tabs visible together.

### Migration / compatibility
- Existing legacy sidelined record state is interpreted as Review, not Depot.
- Existing ready-for-director / ready-director / ai-complete internal record stages normalize to `inbox-working`.
- Existing historical evaluations and Batch records are not rewritten.

### Worker deployment from the project root
- `npm run deploy` now installs the local Wrangler dev dependency automatically before deployment, then deploys using `worker/wrangler.toml`. This avoids the previous root-level `wrangler: not found` failure when dependencies had not yet been installed.
- The Worker can still be managed directly from the `worker/` folder if preferred.

### Known launch dependency
Cross-browser/device durability for Custom Reactions, Custom Themes, and AI project configuration still requires a canonical server-side project datastore. The bundled Genreactrix Worker currently has Workers AI but no D1/KV project-data binding, so this release does **not** pretend browser-local Customs/configuration are cross-browser durable. That backend persistence pass remains required before launch. Backup/restore also remains under repair and must not be trusted to preserve full-resolution image bytes yet.

## v0.9.40.12 — confidence-weighted Theme contribution for 60/40 AI Reactions

- Keeps the same three-pronged AI update from v0.9.40.9.
- Refines only the Reaction hybrid math: the Theme side still owns 60 total points, but those 60 are now divided across the three AI Themes by their relative confidence values instead of flat 20-point-per-theme weighting.
- Each Theme’s allotted share is split evenly across its two Prims, so repeated Prims still accumulate naturally.
- Example: 100 / 50 / 50 Theme confidences become 30 / 15 / 15 Theme points, then each Theme splits its share across its two Prims.
- If Theme confidences are missing or unusable, the build falls back to equal 20 / 20 / 20 Theme weighting so the prior 60/40 behavior still works.

# Genreactrix

## v0.9.40.12 — Three-pronged AI usability update
- Adds optional Director text guidance for a freeform image-analysis rerun.
- Adds an explicit Theme failsafe that reruns Themes from the image with the existing AI freeform analysis as supplemental guidance. Normal Theme analysis remains image-only.
- AI Reaction output now uses a 60/40 hybrid: the three selected PrimFusion Themes contribute six 10-point Prim slots (60 total; repeated Prims accumulate) and the current direct AI Reaction vector contributes the remaining 40 points.
- Direct Reaction output is preserved separately as `directReactions`; canonical `components.reactions` becomes the hybrid vector once both direct Reactions and three matrix Themes are available.
- No additional AI provider call is used for the 60/40 arithmetic.
- Bundled AI Worker target: v0.9.6.23-registry.

## v0.9.40.7 — Inbox/Batch commit repair

- Repairs the Batch summary population. Portrait Batch now derives Total, Remaining, Ready, Keep, Review, Recycle, Reject, and No move from the same active Inbox population. It no longer mixes an arbitrary IndexedDB batch's Total/Remaining with Inbox pending-outcome counts.
- This specifically fixes the impossible-looking state seen after the v0.9.40.6 test (`Total 0 / Remaining 0 / Reject 35 / To batch 35`). With 35 resolved Reject images and no unresolved Inbox images, the panel now reports `Total 35 / Ready 35 / Remaining 0 / Reject 35 / To batch 35`.
- Batch submission now finalizes Reject Image records from `rejected-hold` to durable `rejected` state and stamps the batch-submission metadata before the batch is closed.
- Successful Batch submission removes the submitted image IDs from the active Inbox packs. Empty Packs are removed, the Inbox Pack count falls accordingly, and active `inboxPackIds` are cleared while their prior Pack IDs are preserved in `inboxHistoryPackIds` for traceability.
- A completed Batch therefore actually drains the corresponding Inbox work instead of leaving committed items stranded in Inbox.
- Batch submission now uses a `submitting` pre-commit state, preflights locked records before changing anything, verifies every image received its commit marker/state, reuses an existing report for the same submission version on retry rather than creating duplicate reports, and resumes an interrupted confirmed submission on the next load.
- The existing v0.9.40.6 stranded state is recoverable without deleting data: the pending Inbox Reject records remain visible, Batch current stages them, and successful confirmation commits them and removes them from Inbox.
- AI Worker, PrimFusion Matrix vocabulary, AI prompts, and Reaction/Theme classification are unchanged.

## v0.9.40.6 — Batch outcome staging and active-batch repair

- Fixes the direct cause of the inert Batch control: `batch-engine.js` exported an undefined `snapshotCached` identifier, throwing during module initialization before `window.genreactrixBatchEngine` could be installed. The export now initializes from the real snapshot cache.
- Repairs Batch startup when batch records exist but the active-batch pointer is missing; the engine now restores a usable active batch instead of leaving the dashboard at “No active batch.”
- Bumps the Batch IndexedDB schema version so missing Batch metadata/report stores can be repaired on existing devices.
- Resolved Inbox images now have an explicit pending-batch population. Reject Image counts as resolved batch work rather than disappearing from “To batch.” Parked, recycled, archived, already-batched, inaccessible, and incomplete records are not staged as resolved work.
- Batch current stages the resolved Inbox population before opening submission verification. The Batch console also has a literal “Stage resolved Inbox” control.
- Pending batch work is separated by the post-submit action: Keep, Review hold, Recycle, Reject hold, or No file move. The Portrait Batch panel shows the same disposition split.
- Submission verification now reports those exact outcomes. Reject records are excluded from the standard report and held for the rejection workflow; they are no longer incorrectly counted as “To recycle.”
- Submitted Reject records receive batch-submission metadata/timestamps while remaining in Reject hold, preventing the same Reject decision from appearing as perpetually unbatched.
- Queue “To batch” now reflects all resolved Inbox work waiting for batch, including Reject decisions, rather than only ordinary Ready classifications.
- Worker, PrimFusion Matrix vocabulary, AI prompts, and reaction/theme classification are unchanged in this site-only workflow repair.

## v0.9.40.4 — Fold 6 unfolded safe-control gutter

- Fixes the unfolded router so a Fold 6 opened in the wider physical orientation enters the unfolded wrapper instead of remaining on the normal responsive index page.
- The router now re-checks after resize/orientation changes, so rotating an already-open unfolded phone can enter the wrapper without a reload.
- Unfolded Portrait/Landscape selection now uses the physical Screen Orientation API first instead of browser viewport width/height. This prevents browser chrome on the near-square inner display from making both physical orientations look like Landscape.
- Existing Portrait and folded-Landscape canvases remain separate fixed-ratio layouts and are proportionally scaled to fit the unfolded display; unused area stays black.
- Swap Layout and Lock Orientation remain bottom-left and are guaranteed not to cover the mirrored canvas: existing black letterbox space is used when available; otherwise the canvas is proportionally reduced just enough to reserve a black control gutter.
- No Reaction, Theme, Matrix, Worker, or other gameplay behavior changed in this site-only correction.

## v0.9.40.1 — Zazzly / Liminal tuning + unfolded Fold 6 wrapper

- App build: v0.9.40.1.
- AI Worker target: v0.9.6.23-registry.
- P09 Zazzly is expanded with explicit nudity, casual nudity, mirror-selfie, body-display, body-part emphasis, tight/form-fitting clothing, athletic/uniform, exhibitionism, and sexually salient presentation routes.
- P02 Beautiful is deliberately over-restrained for this research pass: human faces, bodies, physique, skin, clothing, posing, nudity, and human physical attractiveness are not valid Beautiful evidence. Non-human aesthetics can still support Beautiful independently.
- PFM0308 Liminal is tightened to a Backrooms-style environmental definition with a required spatial/environmental gate; empty, dark, eerie, weird, or personless images do not qualify by themselves.
- Matrix remains pre-batch v0.0.0.0.
- Unfolded near-square touch viewports now use a mirror wrapper instead of inventing a third layout. Upright selects the existing Portrait layout; sideways selects the existing folded-Landscape layout.
- The wrapper scales the selected existing layout proportionally to the actual available viewport and leaves unused screen area black.
- Bottom-left Swap Layout provides manual override; Lock Orientation freezes the selected app layout while unfolded. Folding/closing returns to normal automatic site behavior.
- Meme/Studio planning is intentionally not included in this release.

## v0.9.40.0 — Reaction research repair + AI Info restoration

- App build: v0.9.40.0.
- AI Worker: v0.9.6.13-registry.
- Reaction Analysis now asks AI for comparative relative weights and a complete strongest-to-weakest ranking across all 14 Prims; the Worker, not the model, performs the exact 100 discretionary + 14 baseline bookkeeping.
- Worker uses deterministic largest-remainder apportionment, validates exact 100 displayed / 114 raw totals, preserves raw AI weights/ranking/effort notes, and stores the primary + secondary Reaction Combo.
- Obvious low-effort/collapsed Reaction output receives at most one reassessment. Provider-call timeout is bounded at 45 seconds rather than allowing repeated long waits.
- Reactions Info and Themes Info are restored as independently selectable AI outputs. When selected with their paired classification, they share the same underlying assessment so the explanation cannot drift away from the result it explains.
- Portrait AI controls use the approved two-row layout: Reactions / Themes / Description, then Reactions Info / Themes Info.
- Custom AI Theme generation is switched OFF for research without deleting the fallback implementation; AI must currently choose three matrix Themes so vocabulary weaknesses remain visible.
- Kawaii is locked at Matrix v0.0.0.0 as: “Highly stylized Japanese cute aesthetic using exaggerated sweetness or toy-like, childlike, or chibi-style proportions.”
- Worker Theme vocabulary is synchronized to the current pre-batch definition file, including Exposure, Shame, and Humiliation. Matrix version remains v0.0.0.0.
- Client-side Reaction re-normalization is removed; canonical Worker percentages are displayed directly.
- AI P-code/theme display resolution now respects the canonical Worker/Matrix P01=Adorable, P02=Beautiful numbering without changing the historical local UI slot order.
- Landscape component rerun failures now surface visibly instead of only appearing in status/console text.
- Reactions Info and Themes Info are available as report modules for research export.

## v0.9.39.99 — True AI rerun behavior / Reaction rerun diversity

- App build: v0.9.39.99.
- AI Worker: v0.9.6.5.
- The Worker now honors `componentBehaviors[component] = "reanalyze"`; previously the browser sent that flag but the Worker ignored it.
- A rerun is now a fresh independent reconsideration with modestly higher first-pass sampling while retaining deterministic fallback retries for structured-output recovery.
- Reaction prompt remains a 114-point allocation with a 1-point structural baseline per Prim and 100 discretionary points, but now explicitly distributes discretionary points to meaningful secondary reactions instead of encouraging winner-take-all 101/1/1/... allocations except when genuinely warranted.
- Stored raw allocation and derived 100-point reaction percentages remain unchanged in structure.
- Worker diagnostics now record whether each component ran as `analyze` or `reanalyze`.
- PrimFusion Matrix remains v0.0.0.0.

## v0.9.39.98 — PrimFusion AI theme label resolution
- AI theme results that arrive as internal PrimFusion codes (for example `PFM0812`) are resolved through the canonical PrimFusion Matrix before display.
- `PFM0812` now displays as `Ethereal` (P08 Dreamy + P12 Smart).
- Resolution is generic for all canonical `PFM####` codes; stored AI evidence/codes are not rewritten.

# Genreactrix Release Notes

## v0.9.39.98 — Reaction Percentage Total Normalization
- Fixes reaction percentage sets that could visibly total more than 100% (for example, a legacy/raw set totaling 150%).
- Stored AI reaction evidence is not rewritten or destroyed.
- All 14 canonical reaction values are normalized only at the percentage presentation boundary.
- Uses largest-remainder whole-number allocation, so the displayed canonical percentages total exactly 100% without rounding drift.
- Current 114-point/minus-1 Worker results remain proportionally unchanged except for any necessary integer display rounding.
- Landscape Judgment and the primitive percentage grids use the same normalization rule.
- Visible build labels and asset cache-busters are v0.9.39.97.
- Worker remains v0.9.6.4; PrimFusion Matrix remains v0.0.0.0.

# Genreactrix

## v0.9.39.96 — Landscape Reaction Percentages + Deterministic Asset Refresh
- Corrects the prior package/version mismatch: the page title, visible build labels, `app.js` cache-buster, and `styles.css` cache-buster now all identify v0.9.39.96.
- Landscape Judgment reaction percentage text is always populated from the canonical AI reaction weights; the AI Reactions toggle now controls explicit visibility instead of destroying/recreating the text.
- A current-image `ai-attached` event invalidates the presentation cache and repaints Landscape immediately, so fresh Reaction rerun percentages appear as soon as the canonical record is updated.
- A completed Reaction rerun forces AI Reactions visible and invalidates any cached run before repaint.
- Worker remains v0.9.6.4; PrimFusion Matrix remains v0.0.0.0.

## v0.9.39.95 — Landscape Reaction Percentages Visible

- Landscape Judgment now opens with AI Reactions enabled, so stored canonical reaction percentages are visible immediately.
- Completing an AI Reaction rerun explicitly enables AI Reactions before repainting the Judgment view.
- The AI Reactions button still toggles the percentage display off/on normally.
- Reaction scoring, Worker v0.9.6.4, and PrimFusion Matrix v0.0.0.0 are unchanged.
- No standalone acceptance file is added; release history remains consolidated in this README.

## v0.9.39.94 — real Landscape AI reruns

This build repairs AI rerun controls that previously created synthetic copies of the
prior AI record instead of calling the AI provider.

- Landscape Rerun Reactions, Themes, and Description now use the persistent AI Analysis Engine with `behavior: "reanalyze"`.
- Each component rerun targets only the currently displayed image.
- The AI Console's full Rerun AI Analysis button now reruns Reactions + Themes + Description through the same engine.
- The `demo-static-rerun` cloning path is removed.
- Rerun controls are held disabled during an active rerun to prevent duplicate/colliding jobs.
- Worker remains v0.9.6.4; Matrix remains pre-live v0.0.0.0.

See the consolidated Acceptance Archive later in this README for the verification contract.

## v0.9.39.93 — Prim reactions + 114-point scoring

This build adds the finalized 14 Prim reaction definitions to AI Reaction Analysis
and changes Reaction scoring to the 114-point comparative method.

- Worker v0.9.6.4.
- Matrix remains v0.0.0.0 because it is still pre-live.
- AI allocates exactly 114 whole points across all 14 Prims, minimum 1 each.
- Worker validates the raw allocation, subtracts 1 from each Prim, and exposes the
  remaining 100 points as the reaction percentages.
- Raw `allocationPoints` remain attached to each stored reaction result.
- Theme Analysis remains grounded in the canonical 91-theme catalog from v0.9.39.92.

See the consolidated Acceptance Archive later in this README for scope and the research-integrity note about
legacy binary AI-agreement thresholds.

## v0.9.39.92 — PrimFusion Theme vocabulary update

- Matrix remains pre-live v0.0.0.0.
- PFM0209: Exposure replaces Horny.
- PFM0307: Shame replaces Dark.
- PFM0309: Humiliation replaces Rejected.
- Worker v0.9.6.3 now grounds Theme Analysis in the complete 91-Theme PrimFusion definition catalog before permitting Custom fallback.
- Existing Landscape full-image containment from v0.9.39.91 is preserved.

---

## Acceptance Archive

Standalone acceptance/checkpoint files are intentionally consolidated here to keep the release archive shallow and below the practical mobile-upload file-count ceiling. The historical consolidated record follows; any loose source record that was not already preserved verbatim in that history is appended afterward.

## v0.9.39.94
- Replaced the Landscape component rerun fake-clone path with real AI Analysis Engine `reanalyze` jobs targeted to the current image.
- Repaired the AI Console full rerun button to use the same real engine for Reactions, Themes, and Description.
- Removed `demo-static-rerun` synthetic success recording.
- Disabled rerun controls while a rerun is active to prevent current-image job collisions.
- Worker remains v0.9.6.4; Matrix remains pre-live v0.0.0.0.

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

### Additional acceptance source records

The following standalone acceptance records were present in the source archive but were not already preserved verbatim in the consolidated history above.

#### ACCEPTANCE-v0.9.39.73.txt

```text
Genreactrix v0.9.39.73

Interrupted AI-run recovery build.

Changes:
- Detects AI jobs persisted as Running across a page reload and converts them back to Queued before startup resume.
- Converts any AI item persisted as Processing back to Queued so the image can actually be retried.
- Reconciles the Queue wrapper state with the recovered AI job before resuming.
- Preserves v0.9.39.72 Worker URL/key persistence, Settings-ready startup ordering, Missing/Rerun persistence, three supported AI outputs, Reports, and portrait Queue containment.
- Keeps historical acceptance notes consolidated in ACCEPTANCE_HISTORY.md; only the current acceptance file remains separate.

No PrimFusion vocabulary, AI definitions, report calculations, or Worker behavior changed.
```

#### ACCEPTANCE-v0.9.39.74.txt

```text
Genreactrix v0.9.39.74

Focused AI provider diagnostics and safe-failure build.

Changes:
- Missing is again the default behavior for Reactions, Themes, and Description. Rerun is an explicit per-run choice and is no longer persisted as the default.
- Test connection now verifies both the Worker health endpoint and the saved Analysis key without exposing the key.
- Selected AI job details now show the latest concrete failure message.
- Global provider/configuration failures pause a job after the first failed request instead of burning through the rest of the queue.
- Preserves v0.9.39.73 interrupted-running recovery, v0.9.39.72 provider persistence, three supported AI outputs, Reports, and portrait Queue containment.

No PrimFusion vocabulary, AI Theme definitions, report calculations, or live Worker code changed.
```

#### ACCEPTANCE-v0.9.39.75.txt

```text
Genreactrix v0.9.39.75

Focused AI component-isolation recovery build.

Changes:
- Runs Reactions, Themes, and Description as independent Worker requests instead of one long all-or-nothing request.
- Preserves successful component results even if a later component fails.
- Component-specific errors identify exactly which analysis failed.
- Global provider/network failures still pause the job after the first affected component.
- Preserves v0.9.39.74 provider/key verification, Missing defaults, interrupted-job recovery, queue containment, and prior report/PrimFusion work.

No PrimFusion vocabulary or AI definitions changed.
```

#### ACCEPTANCE-v0.9.39.76.txt

```text
Genreactrix v0.9.39.76

Focused AI automatic-look-ahead failure quarantine build.

Changes:
- Automatic look-ahead no longer requeues images whose selected AI components are already marked failed.
- Failed AI images remain available for deliberate manual Retry or Rerun; they are only excluded from automatic buffer refill.
- Preserves v0.9.39.75 component-isolated AI requests and v0.9.39.74 provider/key diagnostics.
- Prevents repeated automatic failure storms from recycling the same failed images.

No PrimFusion vocabulary, AI definitions, report calculations, or Worker behavior changed.
```

#### ACCEPTANCE-v0.9.39.80.txt

```text
Genreactrix v0.9.39.80 — Canonical Feed / Park / Filter

Acceptance targets
- Landscape rehydrates from canonical persisted Image Records on startup and after Portrait imports.
- Import no longer shuffles the working image order.
- Landscape toolbar ends Keep → Park → Filter → Flip.
- Park is Indigo, persists on the Image Record, and does not navigate automatically.
- Feed excludes Parked and Flagged-for-Rejection images; All includes all non-recycled/non-rejected records.
- Filter popup has All / Feed at top, “Or Select:” heading, and Include/Exclude checkboxes for Flagged for Review, Flagged for Rejection, Kept, Parked.
- Include categories use OR; Exclude wins after inclusion; no base/include selection yields zero images.
- Filter settings persist across reloads/sessions.
- Long-hold Flag → Flag for Rejection now persists; Reject Image moves full-resolution content to Portrait Recycle while retaining Image Record/history.
- Portrait Images → Recycle supports restore and Empty now against canonical nested record fields.
- Legacy zero-item Queue jobs are cleaned at startup; real jobs are preserved.
- Existing AI Theme Usage report and three-component AI architecture remain intact.
```

#### ACCEPTANCE-v0.9.39.83.txt

```text
Genreactrix v0.9.39.83 — Portrait Queue / Reports Compression

SOURCE
- Built directly from Genreactrix v0.9.39.82.
- No workflow, AI, Inbox, Pack, Filter, Sort, Recycle, or Worker behavior changed.
- Bundled worker/ remains the exact supplied Genreactrix Worker v0.9.6.2 patch from v0.9.39.82.

PORTRAIT LAYOUT CHANGE ONLY
- Queue: all four status buttons are compressed vertically.
- Reports: all four status buttons are compressed vertically.
- Requested visual reduction: 16 px total per button on the current Fold portrait presentation (8 px top + 8 px bottom).
- Implementation reduces the portrait min-height from 28px to 20px and removes the 4px vertical CSS padding, preserving horizontal padding and font sizes.
- Queue and Reports row gaps remain unchanged.
- No controls above or below these two status grids are moved or resized directly.

VERIFICATION
- Version markers synchronized to v0.9.39.83.
- JavaScript syntax unchanged/passes.
- Worker source unchanged from v0.9.39.82.
- Release remains flat at archive root with only required worker/ nesting.
```

#### ACCEPTANCE-v0.9.39.84.txt

```text
Genreactrix v0.9.39.84 — Landscape Canonical Layout Restore

SOURCE
- Built directly from Genreactrix v0.9.39.83.
- Retains all v0.9.39.82/.83 Inbox, Pack, Failed Export, Filter, Sort, portrait compression, and Worker v0.9.6.2 behavior.

LANDSCAPE RESTORE
- Restores the previously approved Landscape workstation instead of treating the Inbox/Filter feature as a redesign.
- PrimFusion Matrix renders even when the Inbox/feed is currently empty.
- Empty-feed messaging remains over the image area only; it no longer prevents the Matrix/workspace from rendering.
- Original Landscape toolbar sizing, typography, spacing, and ordinary-button treatment are restored.
- Toolbar is the old layout plus exactly two controls: Park and Filter. Nine equal columns total.
- Park is visually ordinary while idle and indigo only when Park is active.
- Filter is visually ordinary while the default Feed/Pack Order filter is active and teal only when a custom filter/sort/Pack selection is active.
- Keep is not shown selected when there is no current image; its prior green selected treatment remains when an actual image is Kept.
- No Inbox/Pack/Filter/Sort workflow behavior was removed.

VERIFICATION
- Version markers synchronized to v0.9.39.84.
- app.js passes node --check.
- Worker folder unchanged from v0.9.39.83 / exact v0.9.6.2 bundle.
- Release remains flat at archive root with only required worker/ nesting.
```

#### ACCEPTANCE-v0.9.39.85.txt

```text
Genreactrix v0.9.39.85 — Landscape state-light cleanup

Scope only:
- Preserve v0.9.39.84 restored Landscape layout and PrimFusion Matrix.
- Idle Keep, Park, and Filter exactly match ordinary toolbar buttons.
- Park active state is blue.
- Filter active state is teal only for category Include/Exclude or Pack filtering.
- Sort mode never activates the Filter toolbar light.
- Opening Filter never activates the Filter toolbar light.
- All/Feed controls are neutral while unchecked and highlighted only while checked.
- Sort control is visually neutral.
- Keep initial markup is idle; record state controls selection.
- No Inbox, Pack, AI, queue, reports, recycle, Worker, or matrix behavior changed.
```

#### ACCEPTANCE-v0.9.39.86.txt

```text
Genreactrix v0.9.39.86 — Fold Landscape Park + Customs Header Alignment

Scope
- Narrow visual/layout correction on top of v0.9.39.85.
- No Inbox, Pack, Filter logic, AI workflow, Recycle, Portrait, Matrix, or Worker redesign.

Required behavior
1. Idle Keep/Park/Filter remain visually identical to ordinary Landscape toolbar buttons.
2. Park ON is indigo/purple-blue (#493b86) with lavender-blue border (#9b8cff).
3. Filter ON remains teal only for an actual category Include/Exclude or selected Pack; sort choice does not activate Filter.
4. Customs top header is one four-slot grid: Custom Search | Custom Reactions | Custom Themes | AI Analysis.
5. The Customs four-slot row uses the same geometry as the AI top row: repeat(4,minmax(0,1fr)), gap 4px, 28px controls, padding 3px 5px, margin 0, line-height 1, font clamp(8px,.76vw,10.5px).
6. The old 74.5% Customs strip + separately positioned 24.5% AI Analysis approximation is no longer used in Customs mode.
7. Worker remains v0.9.6.2 byte-for-byte from v0.9.39.85.
```

#### ACCEPTANCE-v0.9.39.89.txt

```text
Genreactrix v0.9.39.89 — Cycle Three-Pass Limit

SCOPE
Narrow correction to v0.9.39.88 Cycle behavior. No Worker, Push/Pack, Matrix, AI provider,
classification, storage, or Live Event Log architecture changes.

ACCEPTANCE
1. AI > Run includes a Cycle button beside Start analysis.
2. Cycle uses the currently checked AI components but forces Missing behavior; component dropdowns are not permanently changed.
3. Cycle freezes the exact matching image population at button press, respecting Target, Quantity, Selection, and Order for that initial selection.
4. Cycle retries only unresolved selected AI components from that frozen population.
5. Cycle may run the frozen population a maximum of THREE total passes.
6. Failure messages, failure reasons, and changes in the unresolved image/component set do not extend the three-pass limit.
7. Cycle stops earlier if all selected components become current.
8. After pass 3, Cycle stops even when unresolved images/components remain and reports the remaining count.
9. Pressing Cycle while it is running requests a safe stop and changes the button to Stop Cycle.
10. A provider/global failure pauses the current AI job and stops Cycle rather than looping.
11. Cycle progress and stop reasons are written to the Live Event Log when available.
12. The former repeated-identical-failure-set stopping rule is removed; the hard three-pass ceiling is the retry boundary.
13. Worker remains byte-for-byte unchanged from v0.9.39.88 / Worker v0.9.6.2.
```

#### ACCEPTANCE-v0.9.39.90.txt

```text
Genreactrix v0.9.39.90 — Consolidated Landscape Repair

SCOPE
Repairs verified Landscape defects on the v0.9.39.89 baseline. Worker remains unchanged.
Filesystem-root exports and Reports-layout redesign remain separate future work.

ACCEPTANCE
1. Landscape normal view and Image View preserve the source image aspect ratio and display the complete image by scaling it to the available viewport; no forced 1:1 image socket crops the source.
2. Landscape AI Reactions accepts current and legacy stored reaction shapes, including object/array forms and percentage/confidence/score/weight values.
3. Landscape AI Themes accepts current and legacy stored Theme fields including theme, name, proposedName, label, and code.
4. AI top four controls and Customs top four controls use the exact same four-column width, gap, height, padding, radius, and top alignment.
5. A normal tap on Flag means Review. The button text always remains “Flag”; Review is shown by yellow.
6. Long-pressing Flag opens the existing Flag actions dialog only.
7. Choosing Flag for Deletion sets Delete severity and the Flag button red.
8. Choosing Reject Image sets Reject severity and the Flag button hot magenta. It moves the image out of normal Feed into a held Reject pile; it does NOT immediately move the asset to Recycle.
9. Flag severity is mutually exclusive: none, Review, Delete, or Reject.
10. Filter includes a Reject criterion. All includes Reject records. Feed excludes Reject, Delete-flagged, and Parked records.
11. The active Filter button uses the booked bluer teal (#0097A7).
12. Active Keep uses booked lime (#A6D900). Active Park retains booked indigo (#493B86).
13. Standard batch reports exclude held Reject records. Batch validation treats Reject as a resolved disposition, and batch submission does not recycle held Reject assets before their future rejection-export finalization.
14. Cycle remains capped at three passes. Live Event Log remains available.
15. Worker remains byte-for-byte unchanged at v0.9.6.2.

DEFERRED / NOT IN THIS BUILD
- Dedicated Internal Storage / Genreactrix filesystem root and subfolder writing.
- Reject ZIP + rejection manifest finalization into the dedicated Reject Image folder. Until that export path is implemented, Reject assets are deliberately held rather than prematurely recycled.
- Reports configuration screen responsive redesign.
```

#### ACCEPTANCE-v0.9.39.91.txt

```text
Genreactrix v0.9.39.91 — Full Image Containment

SCOPE
One blocking Landscape correction on top of v0.9.39.90. No AI, Matrix, Flag,
Filter, Push/Pack, storage, filesystem, report, queue, Cycle, or Worker changes.

ACCEPTANCE
1. The normal Landscape workbench displays the complete source image at scale 1.
2. The focused Landscape Image View displays the complete source image at scale 1.
3. Source aspect ratio is preserved.
4. The image is scaled by whichever dimension is limiting: wide images fit width or
   height as required; tall images fit height or width as required.
5. Empty viewport area is letterboxed/background space. No source pixels are cropped
   merely to fill the viewport.
6. Existing focused Image View zoom/pan behavior remains available after the initial
   contained fit.
7. Worker remains byte-for-byte unchanged from v0.9.39.90 / Worker v0.9.6.2.
```

#### ACCEPTANCE-v0.9.39.92.txt

```text
Genreactrix v0.9.39.92 — PrimFusion Theme Vocabulary Update

SCOPE
Pre-live Matrix v0.0.0.0 vocabulary correction and AI Theme-definition grounding on top of v0.9.39.91.
No Reaction scoring, 114-point scoring, image-fit, Flag/Reject, Filter, Pack, filesystem, report-layout, or Cycle changes.

MATRIX v0.0.0.0 CHANGES
1. PFM0209 [✨🌶️] Horny -> Exposure.
2. PFM0307 [😭🎟️] Dark -> Shame.
3. PFM0309 [😭🌶️] Rejected -> Humiliation.
4. Matrix version remains v0.0.0.0 because the Matrix has not gone live.
5. PrimFusion cell identities/codes are unchanged; only the pre-live Theme vocabulary is refined.

AI THEME CONTRACT
1. Worker updated from v0.9.6.2 to v0.9.6.3.
2. Theme Analysis receives the complete 91-Theme PrimFusion catalog with canonical definitions and image cues.
3. Definitions retain the existing PFM#### [emoji pair] Theme - definition; cue formatting.
4. Exposure definition/cues:
   PFM0209 [✨🌶️] Exposure - Being naked, indecently revealed, or too visibly exposed, especially in ways that feel shameful, embarrassing, humiliating, or sexually charged; visible nudity, uncovered body parts, flashing, revealing poses, or accidental bodily exposure.
5. Shame definition/cues:
   PFM0307 [😭🎟️] Shame - Painful self-conscious disgrace, embarrassment, exposure, or feeling unworthy, judged, or wanting to hide; averted gaze, covered face, hiding posture, blushing, shrinking, or visibly caught embarrassment.
6. Humiliation definition/cues:
   PFM0309 [😭🌶️] Humiliation - Being demeaned, degraded, ridiculed, exposed, rejected, or stripped of dignity by others or events; pointing or laughing onlookers, forced exposure, defeated posture, visible embarrassment, or submission.
7. Existing canonical Theme must be preferred when it reasonably represents the concept.
8. Synonyms, grammatical variants, broader/narrower wording, and Theme+subject combinations are not Customs.
9. Custom fallback is reserved for genuine semantic gaps.
10. Custom labels must be concise reusable abstract concepts; not settings, objects, professions, standalone Prims, or “and” compounds.

UNCHANGED
- Reaction Analysis remains the existing v0.9.6.2-style contract for now; the planned Prim-definition and 114-point work is not included here.
- Current historical/test AI outputs are not rewritten; raw prior model proposals remain intact.
```

#### ACCEPTANCE-v0.9.39.93.txt

```text
Genreactrix v0.9.39.93 — Prim Reaction Definitions + 114-Point Scoring

MATRIX VERSION
PrimFusion Matrix remains v0.0.0.0. It has not gone live; this build does not
increment the Matrix taxonomy version.

WORKER
Worker version: v0.9.6.4
Reaction prompt: genreactrix-reactions-v3-114-point-prims
Theme prompt remains the catalog-grounded v2 Theme methodology.

REACTION CONTRACT
1. Worker receives the full canonical working definitions for all 14 Prims.
2. AI mimics a person choosing emoji buttons from what the image feels like or
   what word essence it gives off.
3. AI must return all 14 canonical reactions.
4. AI allocates exactly 114 whole points.
5. Every Prim receives at least 1 point.
6. The 100 discretionary points are concentrated on reactions a person would
   actually feel compelled to press.
7. Worker validates: all 14 present; integers only; each >=1; total exactly 114.
8. Invalid allocations retry through the existing bounded recovery path.
9. Worker subtracts 1 from every Prim locally.
10. Derived confidence values therefore total exactly 100 and are the percentages
    consumed by existing feed/UI/report readers.
11. Raw allocations are preserved per reaction as allocationPoints.
12. Diagnostics identify scoringMethod 114-point-min1-minus1.

RESEARCH INTEGRITY
Legacy binary AI-agreement logic elsewhere in the application was designed around
independent 0-100 scores and is not redefined in this build. Do not interpret its
50/70 thresholds as meaningful for new 114-point Reaction records until a new
comparison rule is deliberately specified.

OUT OF SCOPE
- No Matrix taxonomy/version increment.
- No new Theme changes.
- No Custom alert UI.
- No filesystem/export architecture changes.
- No change to the Director's reaction controls.
```

#### ACCEPTANCE-v0.9.39.94.txt

```text
Genreactrix v0.9.39.94 — Real AI Reruns in Landscape

MATRIX VERSION
PrimFusion Matrix remains v0.0.0.0. This repair does not change the Matrix taxonomy.

WORKER
Worker remains v0.9.6.4. No Worker code or prompt contract changes are required.

RERUN REPAIR
1. Landscape AI Rerun Reactions now creates a real AI Analysis Engine job for the current image with reactions set to behavior "reanalyze".
2. Landscape AI Rerun Themes does the same for Themes only.
3. Landscape AI Rerun Description does the same for Description only.
4. The AI Console's Rerun AI Analysis button now reruns Reactions + Themes + Description through the same real engine.
5. The previous synthetic path that cloned the prior result and stamped model "demo-static-rerun" has been removed.
6. Reruns target only the current image by using target "selected" with its image ID.
7. Prior AI results remain preserved by the existing Image Record + History engine behavior.
8. Rerun controls are disabled while a rerun is in flight so a second tap cannot silently collide with the active image job.
9. Provider/configuration failures are surfaced instead of being recorded as successful reruns.
10. Completed reruns repaint the current Landscape/AI views from the canonical Image Record.

OUT OF SCOPE
- No Matrix taxonomy/version increment.
- No Worker change.
- No AI prompt/scoring change.
- No Director classification behavior change.
- No layout/CSS redesign.
```

### Consolidation inventory

- 44 standalone `ACCEPTANCE-v*.txt` files were consolidated into this README.
- `ACCEPTANCE_HISTORY.md` was also consolidated into this README.
- Standalone acceptance/history files are intentionally omitted from the release ZIP.


## v0.9.40.4 unfolded stability fix
- Stops rotation from bouncing between index.html and unfolded.html.
- Fold exit now uses a conservative physical-screen aspect check, not transient viewport dimensions.
- Fold 6 inner-display entry detection tolerates Samsung/browser CSS scaling.
- Swap Layout remains the guaranteed manual path between existing Portrait and Landscape layouts.
- Safe control gutter remains outside the mirrored app canvas.


## v0.9.40.5 — Theme target safety toggle
- In the landscape/unfolded workbench, tapping an already-highlighted Theme 1/2/3 target now unselects it.
- With no Theme target highlighted, PrimFusion/theme taps cannot accidentally replace a Theme.
- Tapping a different Theme target still activates that target normally.
- No Worker, Matrix vocabulary, AI, or unfolded-orientation behavior changed.

## v0.9.40.19 — Android folder picker repair
- Folder inputs no longer pass `accept="image/*"` to Android/Chrome while using `webkitdirectory`.
- Android can therefore enumerate the selected folder instead of reporting `Upload 0 files` before Genreactrix receives the selection.
- Genreactrix still filters the returned files to supported image MIME types/extensions in application code, so non-image files in the folder are ignored.
- Single-file **Choose File** still uses `accept="image/*"`.
- No Worker change.


## v0.9.40.19 browser parity repair
- Chrome/Chromium folder intake now prefers `showDirectoryPicker()` and recursively enumerates image files, with the existing `webkitdirectory` input retained only as a fallback.
- Fold6 folded-landscape CSS now remains active through a 699px reported landscape viewport height so browsers with different toolbar/chrome heights render the same physical screen using the same folded geometry.
- Browser-local IndexedDB/localStorage is still isolated per browser. This build does not falsely merge Chrome and DuckDuckGo data; durable cross-browser project/image storage still requires the planned server-side persistence layer.

## v0.9.40.21 — IndexedDB import schema repair
- Bumps the image-engine IndexedDB schema from v3 to v4 so existing browsers run an upgrade transaction that creates any missing image, thumbnail, kept-image, kept-ID, Red/Delete-record, Reject-record, and history stores without deleting existing stores/data.
- Bumps Queue and Import Job IndexedDB schemas to force the same missing-store repair if an older browser database is incomplete.
- Refreshes cache keys for app.js, queue-engine.js, and import-job-engine.js so Chrome does not mix stale engine scripts with the current build.
- No Worker change.


## v0.9.40.22 — Landscape square-anchor restoration

- Restores the established square Landscape image viewport as the geometry anchor.
- Director Theme 1/2/3 fill the left-column remainder directly beneath the square.
- Existing measured AI Theme placement again mirrors Director theme width/height/vertical position row-for-row.
- AI Description retains the remaining lower-right rectangle beside the AI Theme stack.
- Reaction geometry, Customs Drawer, Image View, Portrait, Import, and IndexedDB behavior are not redesigned in this release.
- Busts the stale Landscape stylesheet cache key so browsers load the restored geometry instead of an older cached CSS file.

## v0.9.40.23 — AI automatic Inbox handoff
- Fixes a process mismatch that left completed AI Output outside Inbox until the Director pressed a manual Push button.
- Successful AI items now enter Inbox automatically when their AI job finishes.
- Completed items from a job that has some failures still enter Inbox; failed items remain in the AI failure/retry workflow.
- On first load after this update, existing fully analyzed AI Output that was stranded outside Inbox is automatically migrated into an Inbox Pack without rerunning AI.
- Removes the visible manual Push AI Output to Inbox control and updates stale empty-state/research-dashboard wording.
- Bumps the ai-analysis-engine cache key so Chrome cannot keep using the older handoff logic.
- No Landscape CSS or geometry changes in this release. The v0.9.40.22 Landscape override remains a temporary checkpoint pending the separately booked CSS excavation/consolidation.
