# Genreactrix v0.9.40.99 — Compound PrimFusion Name Casing

## v0.9.40.99

- Naming-only cleanup: **PFM0110 🧸🤢 Uglycute → UglyCute** and **PFM0411 🤣👻 Comedy Horror → ComedyHorror**.
- Establishes the closed-compound display style used by **CreepyCute, UglyCute, ComedyHorror, PartyTime**, and similar compound PrimFusion labels.
- Stable PFM identities, Prim pairings, definitions/AI meanings, exactly-three Theme behavior, and all diagnostic/scoring logic are unchanged.
- Bundles Worker **0.9.6.44-compound-name-casing**. PrimFusion Matrix remains **0.0.0.0**.
- No layout or geometry changes.

# Genreactrix v0.9.40.98 — Semantic Calibration Pass

## v0.9.40.98

- Synchronizes the site with Worker **0.9.6.43-semantic-calibration** while keeping PrimFusion Matrix **0.0.0.0**.
- Redefines **PFM0110 🧸🤢 as Uglycute** — “so ugly it’s cute” appeal — while preserving its stable PFM identity.
- Applies the locked **PFM0309 Humiliation** wording and booked refinements/gates for Saccharine, Surreal, Liminal, Zany, Grossout, Freakshow, Parodic, Limerence, Horror, Obsessive, Uglycute, and Goofy.
- Prompt Diagnostics separates positive **MATCH EVIDENCE** from **GATE CONFIRMED**, uses explicit confidence calibration, and strengthens cue/meaning and evidence-fidelity rules.
- Adds post-parse consistency validation: score/component/WHY contradictions and same-wave cross-concept contamination trigger a focused quality repair instead of being saved as completed results.
- Normal exactly-three Theme selection remains mandatory; when the third-best fit is weak, confidence should fall rather than evidence being fabricated.
- Prompt Diagnostics keeps the 90-second diagnostics-only provider timeout; normal AI timeout remains unchanged.
- No evaluation-version or Matrix-version increment is created. Test-era reports remain disposable until the baseline is deliberately locked.

# Genreactrix v0.9.40.97 — Prompt Diagnostics Image Reference

## v0.9.40.97

- Adds a **sticky diagnostic-image thumbnail** inside portrait Settings → Prompt Diagnostics so the image remains visible while reviewing long 105-concept reasoning.
- The thumbnail follows the currently selected Image Record or loaded Saved Run.
- Tap the thumbnail to open the existing full Image Inspector / zoom path.
- Uses the existing image asset or permanent thumbnail; no duplicate image binary is added to Prompt Diagnostics history.
- No Prompt Diagnostics scoring, evidence, execution-mode, Matrix, or evaluation behavior changes.
- Bundled Worker source is synchronized to **0.9.6.42-prompt-diagnostics-component-parser**; Matrix remains **0.0.0.0**.

## Inherited from v0.9.40.96

- Adds **Print / PDF**, **Export HTML**, and **Export JSON** to portrait Settings → Prompt Diagnostics.
- Print/HTML reports are fully expanded and include run metadata, evidence-source configuration, normal three-Theme result, a 105-concept score index, exact stored Worker definitions, every stored definition-component assessment/reason, and each overall score reason.
- HTML is standalone and portable; JSON preserves the complete saved diagnostic run in machine-readable form.
- Future diagnostic calls now retain successful-call response protocol and focused-repair/fallback metadata for later reports. Existing runs remain exportable; older runs correctly note that successful-call repair counts were not retained by the earlier site build.
- No AI calls are required to export a saved run. Worker remains `0.9.6.40-prompt-diagnostics-three-wave-fallback`.

## Inherited from v0.9.40.95
- Prompt Diagnostics results now expand to natural height; the Settings body owns scrolling.
- Hidden Settings panels are explicitly suppressed so Queue/Storage/etc. cannot leak below Prompt Diagnostics.

## Inherited from v0.9.40.94
- Adds **3 × 5 waves** as a Prompt Diagnostics execution mode: five 3-concept calls per 15-concept batch, 35 calls for a complete 105-concept pass when no fallback repair is needed.
- Preserves **5 × 3**, **15 at once**, and the existing **15 ↔ 5 comparison** mode.
- Prompt Diagnostics still uses the exact current Worker definitions for all 14 Prims and 91 PrimFusion Themes; scoring semantics and evidence-source combinations are unchanged.
- Worker parser now accepts score lines such as `P01 SCORE 0 - reason` instead of discarding the score because explanatory text follows it.
- If a concept still fails to enumerate its full numbered definition after one focused whole-concept repair, only that concept falls back to groups of five definition components.
- After fallback component chunks are complete, the Worker asks for a fresh final 0–100 score derived from those completed component findings.
- Component fallback is not the default path and does not fragment definitions that already complete normally.
- Requires Worker `0.9.6.40-prompt-diagnostics-three-wave-fallback`.

# Genreactrix v0.9.40.93 — Prompt Diagnostics Call Modes

## v0.9.40.93
- Adds three Prompt Diagnostics execution modes: **15 at once**, **5 × 3 waves**, and **Compare both**.
- The 105-concept vocabulary and exact current Worker definitions are unchanged. Only diagnostic call grouping changes.
- 5 × 3 mode persists each 5-concept wave immediately; a later wave failure does not discard earlier completed waves.
- Compare both evaluates each concept once in a 5-concept wave and once in the 15-concept batch, then shows the two confidence scores and absolute difference together.
- Compare both runs the smaller waves first so their evidence is preserved before the larger comparison call is attempted.
- Live status now identifies the active batch, execution pass, wave number, concept range, completed evaluations, and exact failed call.
- Full 105 runs automatically advance call-by-call until complete, stopped, or failed.
- Prompt Diagnostics remains research-only and does not alter normal Theme selection, Reactions, Director data, Batch, or evaluation versions.
- Requires Worker `0.9.6.37-prompt-diagnostics-call-modes`.



## v0.9.40.92
- Adds a persistent Prompt Diagnostics status panel in portrait Settings.
- Shows RUNNING / PAUSED / COMPLETE / FAILED / INTERRUPTED state, current batch out of 7, and completed concepts out of 105.
- Shows a seven-step batch track and preserves the failed batch marker.
- Failed runs now visibly render their saved exact error instead of only `0/105 · failed`.
- Cloud API errors retain HTTP status and provider diagnostics when the Worker supplies them.
- No Worker behavior or diagnostic scoring methodology changed in this site-only build.

## v0.9.40.91
- Adds portrait Settings → Prompt Diagnostics.
- Uses the current Worker registry definitions directly: 14 Prims + 91 PrimFusion Themes = 105 concepts.
- Seven balanced batches of 15 (2 Prims + 13 Themes), with independent 0–100 confidence and definition-part reasoning.
- Supports Image, Reactions, AI Description, and any selected combination; first-15 testing can be continued to the full 105 only when useful.
- Diagnostic history is isolated from normal evaluation data.

# Genreactrix v0.9.40.90 — Reports Image List Stability Repair

## v0.9.40.90
- Replaces Reports research-gallery thumbnail rendering with lightweight Image Record cards.
- Matching Images, Uncertain Images, and Difficult Images perform no image/blob/thumbnail reads while the report renders.
- Result cards retain filename, workflow state, Director completion, AI–Director agreement, Saved/Flagged status, and review reasons where applicable.
- Tapping a result still opens the existing Image Inspector, where image viewing is explicit and isolated from report rendering.
- Removes the v0.9.40.89 thumbnail hydration queue, object-URL lifecycle, IntersectionObserver path, and thumbnail loading placeholders from Reports.
- Query/filter semantics, research calculations/exports, Productivity, lifecycle engines, and Worker behavior are unchanged.
- Worker remains `0.9.6.35-reaction-rerun-combined-multimodal`.

## v0.9.40.89
- Repairs the Reports research-gallery loader after v0.9.40.88 could stall the phone browser while rendering Matching Images.
- Report galleries now use only the stored Genreactrix thumbnail blob (`storage.thumbnailKey` / image ID). They never fall back to full-resolution assets, hyperlinks, or remote source URLs.
- Missing stored thumbnails resolve to **Thumbnail unavailable** rather than triggering a remote/full-image fetch.
- The report body renders immediately; thumbnail hydration is asynchronous and is no longer awaited by `openReport`.
- Thumbnail work is lazy and bounded: near-viewport cards are queued through `IntersectionObserver` with at most two thumbnail reads active at a time; the no-observer fallback is deferred and uses the same concurrency bound.
- Closing or replacing a report cancels pending gallery hydration and revokes report-only object URLs.
- Report calculations, query/filter semantics, exports, Inspector behavior, lifecycle engines, and Cloudflare Worker remain unchanged.

## v0.9.40.88
- Adds the booked Reports research-output views: Matching Images, Uncertain Images, Difficult Images, and Productivity.
- Matching Images renders the actual filtered population as a thumbnail gallery; tapping a card opens the existing Image Inspector.
- Uncertain Images reports only recorded uncertainty evidence currently supported by the app: AI Analysis/SHOW AI was opened or was recorded visible during a Director commit.
- Difficult Images reports explicit stored evidence: Undo, Redo, a prior Director classification changed after AI was viewed, or a manual Review flag.
- Adds report telemetry for future SHOW AI openings by appending a history event when the existing AI button opens the AI workspace; no Director classification or lifecycle behavior changes.
- Productivity reports Director-complete image counts and timestamp-supported completion span/throughput. It does not fabricate per-image work duration when no start/duration evidence exists.
- Adds Research JSON and Research CSV exports containing the selected population, normalized Director/AI fields, AI reaction scores, workflow/source/timestamps, agreement, and review signals.
- Extends Report Help for all new output views and research exports.
- Existing v0.9.40.87 filters, operators, query semantics, accepted agreement behavior, AI Theme Usage, lifecycle behavior, and Worker behavior are preserved.

# Genreactrix v0.9.40.87 — Reports Output Help

## v0.9.40.87
- Adds in-app Reports Help for every current report-output module plus the specialized `AI Theme Usage · Latest Run` report.
- Each help entry explains what the module shows, what question it answers, the output fields/counts produced, when to select it, and a concrete example.
- Clarifies that Scope + Filters determine the matching image population first; report-module checkboxes only choose which analyses are produced for that population.
- Documents the default matching-image rows returned by Custom Reports.
- Reuses the existing phone-readable Reports help dialog styling.
- No report calculations, query semantics, filter/operator behavior, lifecycle behavior, Worker behavior, or layout geometry changed.

# Genreactrix v0.9.40.86 — Reports Negated Filter Help

## v0.9.40.86
- Expands Reports Filter Help so every visible filter explicitly explains the result of selecting `Does not have`.
- Compound filters show the negation of the whole condition, including cases such as `NOT(Funny AND NOT Adorable)` and reaction-combination negation.
- Numeric/comparison help states the inverse threshold/range and preserves the existing rule that records missing required usable AI/comparison data remain excluded.
- Gives the exact selection pattern for the inverse: keep the shown fields and change only the Operator where applicable.
- No filter names, operator vocabulary, query semantics, lifecycle behavior, Worker behavior, or layout geometry changed.

# Genreactrix v0.9.40.85 — Reports Filter Help

## v0.9.40.85
- Adds in-app Reports Filter Help covering every current filter.
- Each entry explains what the filter tests and gives the exact field/operator selections with an example.
- Explicitly explains that `Has / equals` means the filter condition as written evaluates true, including compound filters such as `Funny AND NOT Adorable`.
- Adds no filter names, operator changes, query-semantic changes, lifecycle changes, Worker changes, or layout redesign.

# Genreactrix v0.9.40.84 — Reports Query Surface Completion

## v0.9.40.84
- Completes the booked Reports reaction-query surface without changing lifecycle, layout, AI scoring, or Worker behavior.
- Adds Director reaction combination, Director reaction-without-another, AI reaction bounded-range, reaction-specific Director/AI minimum and maximum filters, thresholded Director disagreement, AI-only signals, and Director-only signals.
- AI-only and Director-only filters require a completed Director record so unfinished records cannot masquerade as Director “No” decisions.
- Keeps the accepted v0.9.40.83 aggregate AI–Director agreement threshold behavior unchanged.
- Invalid or blank numeric/range thresholds match nothing instead of coercing to zero.
- Numeric comparison predicates require real comparable AI data even when negated; missing/non-comparable records do not become false-positive “NOT” matches.
- Reaction-name inputs now offer the 14 canonical Reaction names while preserving typed/custom query text where applicable.

# Genreactrix v0.9.40.83 — Reports Agreement Threshold Input Integrity

## v0.9.40.83
- AI–Director and AI-reaction numeric threshold filters now reject blank/non-numeric thresholds instead of coercing them to 0.
- The Reaction-name input is now shown only for AI reaction filters; agreement filters expose only their numeric Percent value input, preventing threshold entry into the wrong field.
- Agreement calculation/completion semantics from v0.9.40.82 are unchanged.
- AI–Director agreement now evaluates only Director-complete Image Records.
- Incomplete/unclassified/blocked/partial Director records remain in report populations but receive `aiAgreement: null`.
- Per-reaction agreement comparable counts exclude incomplete Director records.
- AI-disagreement filters exclude incomplete Director records instead of treating missing Director choices as fourteen explicit No votes.
- Completion statistics use Director completion state and no longer infer completion merely from a Batched lifecycle stage.
- No Image Record rewrite, Director workflow change, layout change, or Worker change.

# Genreactrix v0.9.40.81 — Reports Record Interpretation Integrity

## v0.9.40.81
- Reports now prefers canonical Director `reactions` when present, falling back to legacy `selectedReactions`.
- Matching-image rows use Image Record `originalFilename` / `originalUrl`.
- PrimFusion rows/groups fall back to the resolved Director reaction pair when no labeled fusion object is stored.
- Classification dates use Director `recordedAt` / `updatedAt` with processed timestamp fallback.
- AI–Director breakdown includes AI-only reaction signals as well as Director-selected reactions.
- No Image Record rewrite, Director behavior change, layout change, or Worker change.
- Worker remains `0.9.6.35-reaction-rerun-combined-multimodal`.

---

# Genreactrix v0.9.40.80 — Reports Filter Logic Integrity

## v0.9.40.80 — Reports query integrity

- Fixes mixed normal/history **OR** report filters so every visible condition participates in one true OR expression instead of being split into accidental AND groups.
- Makes the visible **Does not have** operator actually negate Director exact-set, source, Batch, Saved, Flagged, AI threshold/disagreement, and history-backed filters.
- Saved/Flagged filters now use the operator itself as the boolean choice: **Has / equals** = true; **Does not have** = false. The generic Value field is ignored for those boolean filters.
- Newly finalized Batch records are synchronized into the Reports store immediately using their deterministic Batch-record ID; startup migration remains an idempotent recovery path instead of the normal handoff.
- A Reports sync failure cannot roll back an already-completed Batch; it is surfaced for attention and remains recoverable by startup migration.
- No report layout redesign, new report dimensions, lifecycle changes, Housekeeping changes, or Worker changes.
- Worker remains `0.9.6.35-reaction-rerun-combined-multimodal`.

---

## v0.9.40.77 — clean Daily Housekeeping / Recycle acceptance baseline
- Removes all temporary Housekeeping acceptance diagnostics and hard-coded test targets after on-device acceptance.
- Keeps the validated local-calendar-day Purgatory dedupe fix: one Daily Housekeeping Purgatory retry per local day.
- Keeps normal Daily Housekeeping behavior for Purgatory, Retry Import Source, and expired Recycle retention; AI and Quarantine remain outside the Housekeeping call path.
- Keeps the generic Fold-router query/hash handoff repair discovered during diagnostics; no diagnostic query parameters or listeners remain.
- Worker remains `0.9.6.35-reaction-rerun-combined-multimodal`.


## v0.9.40.76 — controlled Housekeeping test #4
- Temporary query-gated diagnostic: `?housekeepingOriginSourceTest=1`.
- Uses the already-purged dated `PURGATORY_TEST_` rubber-band-ball record only as a safe known Image Record with a retained permanent thumbnail.
- Seeds exactly one temporary **Retry Import Source** case and one temporary **true Import Failure** case.
- Runs real Daily Housekeeping once. Acceptance requires Retry Import Source to receive one successful Housekeeping retry and resolve, while true Import Failure remains blocked with zero retry attempts.
- The temporary recoverable source is the record's own retained thumbnail exposed through a short-lived same-page blob URL; no external network source and no Worker AI call are used.
- Safety gates abort before mutation if real Purgatory, real Retry Import Source, or expired/near-expiry Recycle work is present.
- Diagnostic cleanup removes both temporary Origin cases, removes the temporary recovered working asset, restores the exact Image Record snapshot, removes diagnostic-created Image Record history, restores the prior Daily Housekeeping marker, and revokes the temporary blob URL.
- The READY/RUNNING/PASS/INCOMPLETE in-page panel pattern from accepted test #3 is retained.
- The v0.9.40.73 local-calendar-day dedupe fix remains in production Post-processing code.
- Worker remains `0.9.6.35-reaction-rerun-combined-multimodal`. No Worker redeploy is required.
- No layout geometry, CSS, AI, Quarantine, Recycle, Maintenance, or Investigation behavior changes.

## v0.9.40.75 — Housekeeping test #3 accepted
- On-device acceptance passed: first Daily Housekeeping run added exactly one `daily` Purgatory retry; a second forced run on the same local calendar day added none.
- Temporary Purgatory state cleaned successfully.
- The local-calendar-day dedupe correction is validated.

### v0.9.40.75 launcher repair
- Preserves `?housekeepingPurgatoryTest=1` while routing through the Fold unfolded mirror.
- Synchronizes the Housekeeping script cache-bust and visible build labels to v0.9.40.75.
- Shows a persistent READY/RUNNING/PASS/INCOMPLETE diagnostic panel for test #3.
- No Worker, lifecycle, Recycle, AI, Quarantine, or layout-geometry changes.


## v0.9.40.75 — controlled Purgatory daily-retry acceptance

- Temporary query-gated diagnostic: `?housekeepingPurgatoryTest=1`.
- Hard-scoped to the already-purged `PURGATORY_TEST_` throwaway Image ID used for Recycle acceptance.
- Seeds a temporary Purgatory plan with three pre-recorded automatic failures, then runs Daily Housekeeping twice.
- Acceptance requires the first Daily Housekeeping run to add exactly one `daily` attempt and the second forced run on the same local calendar day to add none.
- Fixes a discovered local-day/UTC-date dedupe defect by recording the Housekeeping local day on daily attempts and comparing that explicit day.
- The temporary Post-processing plan and Purgatory lifecycle state are cleaned up after the diagnostic.
- No Worker change.

## v0.9.40.72 — Recycle expiry diagnostic removed after acceptance

- Removes the temporary `?recycleExpiryTest=1` controlled Recycle-expiry diagnostic after on-device acceptance.
- Accepted traveler: Recycle restore -> controlled expiry -> normal Daily Housekeeping purge -> permanent Image Record retained -> permanent 64×64 thumbnail retained.
- Normal Daily Housekeeping remains non-AI and does not retry or operate Quarantine.
- Keeps the accepted v0.9.40.70 History Image unavailable-overlay fix.
- No Recycle lifecycle, Post-processing, Maintenance, Investigation geometry, or Worker behavior changed.
- Worker remains `0.9.6.35-reaction-rerun-combined-multimodal`.

## v0.9.40.70 — History Image unavailable-overlay repair

- Fixes the shared Investigation preview hide-state so `Image data unavailable` is not rendered over a valid full-resolution image or thumbnail.
- No image lifecycle, Recycle, Maintenance, layout geometry, or Worker behavior changed.
- Worker remains `0.9.6.35-reaction-rerun-combined-multimodal`.

## v0.9.40.69 — Diagnostic injector removed after acceptance
- Removes the temporary `PURGATORY_TEST_` Post-processing fault injector now that the Batch → Post-processing → Purgatory → manual Retry → Recycle traveler has passed on-device acceptance.
- Normal Post-processing behavior is restored for every filename, including names beginning with `PURGATORY_TEST_`.
- Keeps the accepted singular Maintenance wording: **1 Purgatory item is ready to retry**.
- Keeps the v0.9.40.68 Maintenance Quick Check `issue` TDZ repair and Maintenance Inspector preview fallback through the Images Engine display resolver.
- Keeps v0.9.40.66 Image View Depot and Inbox Thumbnail View unchanged.
- Worker remains **0.9.6.35-reaction-rerun-combined-multimodal**; no Worker redeploy is required.
- No Landscape geometry or CSS changes.

## v0.9.40.68 — Purgatory Retry / Inspector Repair
- Repairs the Maintenance Quick Check temporal-dead-zone bug that could throw `ReferenceError: Cannot access 'issue' before initialization` while resolving repairable findings.
- Uses singular Purgatory Retry-All wording when exactly one item is unresolved.
- Maintenance Image Inspector now resolves preview data through the Images Engine display resolver first, allowing cached full-resolution or permanent-thumbnail fallback.
- The temporary Purgatory fault injector remained present only for traveler acceptance and is removed in v0.9.40.69.

## Historical v0.9.40.67 — Maintenance Console Entry Fix

## v0.9.40.67 — Open Maintenance repaired; Purgatory diagnostic continues
- Defines the missing Maintenance Engine `openConsole()` API that Settings and operational shortcuts already call.
- `Open maintenance` now closes Settings, opens the existing Maintenance dialog, and refreshes current maintenance data.
- No Worker change. No Landscape geometry change.
- v0.9.40.66 Image View Depot, Inbox Thumbnail View, and `PURGATORY_TEST_` post-processing diagnostic remain intact.

## Historical Genreactrix v0.9.40.66 — Image View Depot + Inbox Thumbnail View

## v0.9.40.66 — Bundled navigation update; Purgatory diagnostic continues

- Worker remains **0.9.6.35-reaction-rerun-combined-multimodal**; no Worker redeploy is required.
- **Image View Depot:** the enlarged Image View now has a five-button row: **Back | Next | Flag | Keep | Depot**. Depot is the same canonical `attributes.depot` state used by the normal Director view, not a parallel flag. Toggling from either view updates both controls.
- Image View Depot uses the same normal-view visual identity: ordinary toolbar treatment while off; booked indigo/purple Depot treatment while on.
- **Inbox Thumbnail View:** the existing Filter popup now has a **Thumbnail View** button at bottom-right. It opens a separate modal grid, so the accepted Landscape workspace does not get squeezed or rearranged.
- The thumbnail grid uses the current Inbox Filter and Sort result, uses stored permanent thumbnails first, identifies the current image, and shows filenames beneath thumbnails. Tapping a thumbnail jumps directly to that exact Inbox image and closes the modal.
- **Purgatory traveler diagnostic remains intentionally present:** a newly imported image whose original filename begins exactly with `PURGATORY_TEST_` still fails its first three automatic Post-processing attempts, then allows manual Retry / Retry All through normally. Files without that prefix are unaffected.
- The two unrelated CSS mutations produced during the interrupted `.66` generation were removed before packaging; normal Director and AI control geometry remains byte-for-byte equivalent in those rules to `.65`.

## v0.9.40.65 — Controlled Post-processing failure traveler

- **Temporary diagnostic behavior.** A newly imported image whose original filename begins exactly with `PURGATORY_TEST_` is deliberately failed during its first **three automatic Post-processing attempts**.
- The injected failure occurs after the Batch/Post-processing attempt has started and before Images Engine finalization, so the image must remain unresolved in Purgatory rather than partially reaching Keep, Recycle, or a final exclusion stage.
- The diagnostic injection applies only to `automatic` attempts 1–3. **Manual Retry, Retry All, and Daily Housekeeping are not fault-injected**, allowing the real recovery path to complete.
- The error is explicitly named `GenreactrixDiagnosticPurgatoryFailure` and is preserved in the ordered Post-processing attempt/error history.
- Remove this diagnostic injector after the Purgatory traveler acceptance tests are complete.

## Prior accepted site baseline: v0.9.40.64

## Worker 0.9.6.35 — Combined Image + Description multimodal Scout

- Site build remains **v0.9.40.64**; accepted Reaction Rerun layout, checkbox behavior, queue coordination, and 60/40 recombination are unchanged.
- Image-only remains on the already-passing Llama 3.2 Vision path with the legacy `image` field.
- Description-only remains on the already-passing Llama 4 Scout text-only `guided_json` path and sends no image bytes.
- **Image + Description** now uses Llama 4 Scout as a true multimodal chat request: the same user message contains the Reaction prompt/Description as a text content part and the image as an `image_url` data-URI content part.
- Combined mode restores `guided_json` for the 14 Reaction weights/ranking/notes and removes the temporary v0.9.6.34 line protocol from the active path.
- The rerun instruction explicitly tells combined mode to reassess the image and AI Description together as the two selected evidence sources.
- Existing numeric-range, all-zero, all-identical, ranking, retry, and Hamilton apportionment gates remain unchanged.
- Worker advances to **0.9.6.35-reaction-rerun-combined-multimodal**.

## Worker 0.9.6.34 — Combined Image + Description line protocol

- Site build remains **v0.9.40.64**; accepted Reaction Rerun layout, checkbox behavior, queue coordination, and 60/40 recombination are unchanged.
- Image-only remains on the already-passing Llama 3.2 Vision text/JSON-tolerant path.
- Description-only remains on the already-passing Llama 4 Scout `guided_json` path and still sends no image bytes.
- **Image + Description** now requests a compact plain-text protocol: exactly one numeric `P01|weight` through `P14|weight` line plus one complete `RANKING|...` line. Reaction Reasons add four `NOTE|P##|reason` lines only when that component is requested.
- Combined-mode parsing is strict: every P01-P14 numeric line must be independently present. Missing or malformed values are rejected and retried rather than inferred from neighboring text.
- All existing numeric-range, all-zero, all-identical, ranking, and Hamilton apportionment gates remain unchanged.
- Worker advances to **0.9.6.34-reaction-rerun-combined-line-protocol**.

## Worker 0.9.6.32 — Reaction rerun Vision routing

- Site build remains **v0.9.40.64**; accepted Reaction Rerun layout and queue coordination are unchanged.
- Image-only and Image + Description Reaction reruns now use the configured Genreactrix Vision model (`@cf/meta/llama-3.2-11b-vision-instruct` by default) with actual image bytes.
- Image-bearing Reaction responses are requested as text, parsed locally, and then passed through the same strict 14-Prim weight/ranking/top-four-note validator before 100-point apportionment.
- Description-only keeps the already-passing Llama 4 Scout `guided_json` path and sends no image bytes.
- The all-zero and all-identical Reaction gates remain hard failures; image-bearing reruns retry once after a semantic/format validation failure.
- Worker advances to **0.9.6.33-reaction-reasons-optional**.

Built forward from v0.9.40.63. Accepted Landscape geometry and the Reaction Rerun checkbox layout are unchanged.

## v0.9.40.64 — Explicit Reaction rerun queue repair

- Director-triggered Direct Reaction Rerun now serializes against existing AI work for the current image instead of being rejected by the generic active-image exclusion as `No eligible images`.
- If the current image already has queued/processing AI work, the rerun waits for that work to leave the active state before creating its own job.
- After the explicit rerun job is created, the workspace follows that exact job until it reaches a terminal state even if the queue engine starts it first. This removes the false `Queued` failure.
- A narrow race retry handles automatic AI work claiming the image between the idle check and explicit rerun job creation.
- Image-only, Image + Description, and Description-only use the same corrected job-coordination path.
- No Reaction 60/40 math, evidence-source semantics, Worker protocol, or accepted UI geometry changed.
- Worker remains **0.9.6.31-reaction-rerun-sources**; no Worker redeploy is required.

## v0.9.40.63 — Direct Reaction Rerun

- AI Rerun Reactions now opens a compact evidence-source workspace inside the existing 54px/two-row control band. No accepted Landscape panel, image, Theme, Reaction, or drawer geometry is resized.
- Two checkboxes define the rerun evidence source: **Image** and **Description**. Both are checked every time the workspace opens, making **Image + Description** the default.
- Valid modes are Image only, Image + Description, and Description only. Submit is disabled if neither source is selected.
- Description means the current AI Description artifact/projection. Description-only reruns do not send image bytes to the Worker.
- Only the direct Reaction 40% is rerun. The existing Theme-derived 60% remains authoritative and untouched; Combined Reactions are then recalculated from the unchanged Theme 60% plus the new direct 40%.
- Reaction rerun attempts record which evidence sources were used.
- Worker advances to **0.9.6.31-reaction-rerun-sources** to support Image-only, Image + Description, and Description-only Reaction assessment.

## v0.9.40.62 — Theme Rerun Clear

- Theme Rerun **Clear** now preserves the three Theme Red / Green / Neutral states exactly as selected.
- Clear removes all PrimPicker assignments from Theme 1, Theme 2, Theme 3, and General scopes.
- Clear removes every Theme Exclusion.
- Clear unselects every included AI Description reference/context selection.
- Clear does not erase Theme History or Description History, does not change the current Theme values, and does not submit or rerun AI.
- Successful Theme reruns continue to create a new immutable Theme artifact which becomes Current; prior Theme artifacts remain in Theme History.
- Worker remains **0.9.6.30-theme-rerun-parser-fallback**. No Worker change is required for v0.9.40.62.

## v0.9.40.61 — Theme Rerun Submit all-Neutral repair

- AI rerun failures now surface the actual failed-item Worker/provider error instead of only `Completed with 1 failure(s)`.
- Theme Rerun no longer depends on provider JSON Mode. The Worker requests a compact pipe-delimited text protocol for open Theme slots, then performs the authoritative PFM eligibility, Preserve/Replace, Theme Exclusion, uniqueness, confidence, and rationale validation locally.
- Preserve slots are now resolved locally and are not sent back to the model as output work. If every slot is Preserve, the Theme rerun completes without an AI provider call.
- The text parser tolerates harmless bullets/spacing and can still accept a valid JSON object if the model emits one voluntarily, but JSON is no longer requested for Theme reruns. Invalid line responses are retried up to two times with the exact parse failure fed into the recovery instruction.
- Bundled Worker: **0.9.6.30-theme-rerun-parser-fallback**.
- No Landscape geometry, Theme Rerun Clear semantics, or Current-retention behavior changed.
- Packaging correction: all hardcoded on-screen/site title version labels now report **v0.9.40.61**.
- The obsolete `genreactrix-v3-114-point-prims` AI Prompt-set default/fallback is retired. Existing copies of that stale label are cleared to blank on settings migration; blank now saves and remains blank. The Worker remains authoritative for actual per-component prompt versions returned with each analysis.
- `.61` cache-busts the changed Settings/App/AI-analysis scripts and awaits AI Provider setting writes before reporting Saved, preventing a browser-cached older script from resurrecting the retired Prompt-set label after refresh.

## AI Description rerun workspace

Opening **AI Rerun Description** temporarily repurposes the existing Reaction rectangle as a guidance/current-work text field. The surrounding Landscape regions do not move or resize. AI Themes and AI Description remain visible, and the rerun control band occupies the existing 4×2 AI-button footprint.

Button order, left-to-right then top-to-bottom:

**Save Draft · Select Draft · Preview Request · Submit**

**Review Reactions · Descriptions · Clear · Return**

### Current state and drafts

- Guidance and rerun choices are Current state and remain sticky through Return and repeated submissions until explicitly cleared or finalized through Batch.
- Blank/whitespace-only guidance is omitted from the AI request.
- Save Draft stores the complete current rerun setup as an **AI Desc Rerun Draft**.
- Select Draft restores the complete saved setup; the main Undo/Redo controls can reverse/reapply that restore.
- Immediately before Batch commitment, meaningful Current rerun state is automatically saved as an **AI Desc Rerun Draft**, then its live Current state is cleared.
- Portable Project backup already captures the project-scoped Current localStorage state; saved drafts live on the permanent Image Record.

### Selectable context

- The image is always included.
- Each of the 3 Director Themes and 3 AI Themes can be independently selected/deselected as AI context.
- **Descriptions** normal tap prefers the most recent prior Description. Long press opens the dated Description-version list.
- Descriptions checkboxes independently include any number of Description versions as AI context. Populating a Description does not automatically include it.
- The populated Description has a mirrored Include checkbox on the existing AI Description display.

### Edit mode from the existing AI Description field

No separate mode buttons are added.

- No deliberate cursor/highlight: **ALL / Rewrite All**.
- Blinking cursor in nonblank Description text: **ADD at cursor**.
- One contiguous highlighted span: **REPLACE highlighted section**.
- Add/Replace targeting turns the entire AI Description field **maroon**.
- Manual typing/pasting into the AI Description target is blocked; it is a targeting surface, not a direct editor.
- For Add/Replace the Worker returns only the insertion/replacement fragment. Genreactrix splices that fragment into the target locally, preserving all text outside the allowed boundary.

### Preview, review, clear, and return

- Preview Request exposes the complete request before an AI call, including operation, always-included image, guidance/no guidance, selected Themes/no Themes, included Description versions/no Descriptions, and exact cursor/highlight target.
- Review Reactions is press-and-hold reference viewing only. Releasing restores the rerun workspace unchanged.
- Clear offers **Clear Text Entry** and **Clear Highlights/Cursor** independently; its Submit path requires confirmation.
- Return exits without discarding Current rerun state.

### Immutable AI history

Every actual Description submission creates a new AI attempt/artifact version. The exact structured rerun request is retained with attempt/history metadata. Add/Replace also preserves the raw returned edit fragment in immutable history while the live Description projection contains only the complete resulting Description.

## Worker contract

This build extends the bundled Cloudflare Worker to accept structured Description rerun context: selected Themes, included Description versions, and All/Add/Replace target information. The bundled Worker now supports both structured Description reruns and Director-guided Theme reruns. The current Worker version is **0.9.6.30-theme-rerun-parser-fallback**.

The updated Worker must be deployed before testing actual structured Submit calls. UI-only inspection does not require a Worker call.

## Protected scope

- No existing Landscape CSS rule was edited; v0.9.40.48 CSS remains an exact prefix of this build and the new workstation styles are scoped/appended.
- No existing image, Director Theme, AI Theme, AI Description, drawer, or surrounding panel geometry was moved.
- Existing v0.9.40.48 AI-drawer load defaults remain intact outside rerun mode.
- 60/40 Reaction architecture is unchanged.

Real-device/browser acceptance is still required.


## v0.9.40.50 surgical correction
- The populated-Description **Include** checkbox now receives the same measured vertical offset as the AI Description panel.
- This keeps the checkbox with the populated AI Description field instead of falling back onto the Submit-button row.
- No rerun behavior, surrounding geometry, typography, Worker contract, or other UI logic changed.


## v0.9.40.52 — Theme Rerun PrimPicker visual pass

- Adds the Landscape Theme Rerun 4×2 control shell.
- Adds PrimPicker with code-backed P01–P14 rows, fixed ascending order, one-emoji-width spacing, and centered status dots.
- AI Theme cells cycle Neutral → Replace (red) → Preserve (green) → Neutral. Replace slots create Theme-specific PrimPicker rows; General fills the remaining row until all three slots are specific.
- Tap cycles Mandatory → Preferred → Optional → Discouraged → Forbidden → Unchosen. Long-press opens direct status selection or Clear.
- Destructive row loss requires confirmation; Clear resets PrimPicker assignments while retaining Theme selections/rows.
- Theme rerun submission/history/exclusions/description-context actions remain reserved for a later bounded pass; Worker is unchanged.
- Renames the AI Description rerun control label Classics → Descriptions.

## v0.9.40.52 — PrimPicker Discouraged Dot Contrast
- Darkens the Discouraged red-orange status dot to a deeper red-orange so it is visually distinct from Forbidden hot magenta.
- No PrimPicker behavior or surrounding Landscape geometry changed.
- Worker unchanged from v0.9.40.51.


## v0.9.40.53 — Theme Exclusions

- Theme Exclusions is now a working Theme-rerun control.
- The exclusion catalog is generated from stable PFM codes (PFM0102 through the canonical non-diagonal PrimFusion set); visible Theme words are resolved from those codes at render time.
- Tap a Theme to prohibit it from being returned by this rerun; tap again to remove the prohibition.
- Exclusions are stored in Current rerun state by PFM code, persist per image, and survive closing/reopening the Theme rerun workspace.
- The exclusion dialog is searchable by displayed Theme name (and internally by PFM code), with selected exclusions shown in hot magenta.
- A preserved/green current Theme cannot simultaneously be excluded; the UI blocks either conflicting action instead of silently resolving it.
- PrimPicker behavior and accepted Landscape geometry are unchanged from v0.9.40.52.
- Theme Exclusions are state/UI only in this bounded pass; Preview/Submit wiring remains for subsequent Theme-rerun passes. Worker files are unchanged.


## v0.9.40.54 — Theme Rerun Description Context

- The Theme Rerun **Descriptions** control now reuses the established AI Description-rerun history behavior.
- On the first Theme-rerun Current state for an image, the current AI Description is populated and included by default, preserving the Image + current Description failsafe.
- Normal tap on **Descriptions** populates the most recent prior Description when one exists. Long press opens the dated/versioned Description history.
- Every history row has an independent **Include** checkbox; any number of Description artifacts may be included simultaneously.
- Tapping a history row populates it for inspection but does not change its Include state.
- The populated Description receives the same mirrored **Include** checkbox beside the existing AI Description field.
- Theme-rerun Description state stores artifact IDs/references, not human-readable labels; immutable Description history remains the authority.
- Existing PrimPicker, Theme Exclusions, Theme-state controls, and accepted Landscape geometry are unchanged.
- This is a UI/state pass only. Preview Request and Submit do not consume the selected Description context yet. Worker files are unchanged from v0.9.40.53.


## v0.9.40.55 — Saved Draft deletion

- **Select Draft** entries now support deletion by long-press.
- A long-press opens a destructive confirmation before removing that saved AI Description rerun draft.
- A normal tap still restores the draft exactly as before.
- This pass does not change Theme Rerun state, AI request behavior, Worker code, or accepted Landscape geometry.


## v0.9.40.56 — Theme Rerun Preview Request

- **Preview Request** now renders the complete current Theme-rerun request without sending an AI call.
- The preview always identifies the image as included.
- All three current Theme slots are shown with their Neutral / Red / Green instruction and whether PrimPicker guidance applies. Green/protected Theme slots are explicitly marked untouched.
- PrimPicker preview is grouped by its active Theme/General scopes. Primitive identity remains code-backed; the interface resolves the current human-readable Prim names from those P-codes.
- Prim states are displayed in the locked order: Mandatory, Preferred, Optional, Discouraged, Forbidden, Unchosen. Unchosen is shown with its derived 40/50 effective weight for that scope; it is not treated as a selectable 40/50 state.
- Theme Exclusions are previewed from their stored PFM codes while displaying the current Theme names.
- Included Description artifacts are shown with date/time, version, and full text. The preview explicitly says when no descriptions or no exclusions are included.
- **Submit** and **Theme History** remain intentionally unwired in this bounded pass. Preview performs no Worker call.
- The v0.9.40.55 long-press Saved Draft deletion fix is carried forward.
- Preview uses the established scrollable request-preview modal language; no accepted Landscape workspace geometry was changed. Worker files are unchanged.



## v0.9.40.58 — Stable Include Reserve

- Fixes the repeatable Description-width collapse when repeatedly changing Theme rerun states.
- The mirrored Include control reserve is now recalculated from the baseline Description padding on every render instead of compounding the previous render's reserve.
- No Landscape geometry, Theme sizing, Reaction geometry, or Worker behavior changed from v0.9.40.57.

## v0.9.40.57 — Landscape Packing + Include Repair

- Removes the large blank band below the 4×2 AI/rerun button band using live rendered measurements rather than a guessed offset.
- The space below the second button row is made exactly equal to the rendered gap between button row 1 and row 2.
- Director Themes move upward by that measured amount and grow by the same amount, so their bottom edge stays fixed. AI Themes and AI Description continue to inherit the exact Director geometry.
- Horizontal Landscape geometry and reaction X coordinates are not changed.
- The outer image socket remains square; its internal content box reserves the overlapped strip so Director Theme fields do not cover image pixels.
- Fixes Theme Rerun's mirrored Include control so it is positioned on the AI Description instead of the Submit button.
- Reserves the measured Include-control footprint inside AI Description in both rerun modes so Description text cannot render underneath the checkbox.
- Carries forward Theme Rerun Preview Request and long-press Saved Draft deletion. Worker files remain unchanged.


## v0.9.40.59 — Theme Rerun Theme History
- Theme History is now a read-only modal backed by immutable `themes` artifacts.
- Entries show date/time, current/version status, the three Theme labels derived from stable fusion codes when available, weights, which slots changed from the prior artifact, and recorded attempt context.
- Tapping a history entry expands details only; it never changes the current Theme rerun state.
- Submit remains intentionally unwired for the next bounded pass.
- No Landscape geometry or Worker files changed in this pass.

## v0.9.40.60 — Theme Rerun Submit

- **Submit** now executes the structured Theme rerun shown by Preview Request.
- Image input is always included. Included Description artifacts are passed as additional Theme context.
- Green/Preserve slots are immutable and are copied forward by their stable `PFM####` code.
- Red/Replace slots cannot return their current PFM code. Neutral slots may keep or replace their current PFM.
- Theme Exclusions are hard prohibitions. Protected Theme codes are also excluded from every open slot so the three final Themes remain unique.
- PrimPicker uses code-backed `P##` assignments. Mandatory and Forbidden are hard gates; Preferred, Optional, derived Unchosen, and Discouraged are steering weights. The Worker calculates each eligible fusion's preference from the two P-code weights while continuing to judge image fit.
- Impossible hard-constraint combinations fail before the AI call instead of silently relaxing Director instructions.
- The Worker schema restricts each slot to its eligible PFM code set and validates uniqueness; invalid duplicate/eligibility responses are retried up to two times.
- Successful Theme reruns create a new immutable Theme artifact and AI attempt containing the exact Theme-rerun context. The existing direct-Reaction artifact remains untouched; the Theme-derived 60% and combined Reaction artifact are recalculated through the established 60/40 architecture.
- Theme History can immediately expose the new version and its recorded rerun context.
- Current Theme-rerun controls remain available after Submit for further fine-tuning. If the new confidences reorder the three displayed AI Theme rows, Theme-state instructions and Theme-specific PrimPicker scopes are remapped to the corresponding rerun result so they do not attach to the wrong displayed Theme.
- No Landscape CSS or geometry changed from v0.9.40.59.
- **Worker deploy required:** bundled Worker `0.9.6.26-theme-rerun-submit`.


Worker 0.9.6.29 Theme Rerun format compatibility: rerun output now uses the established Theme Analysis `rank|matrix|PFM|confidence|reason` protocol, while the Worker parser remains backward-compatible with the short-lived v0.9.6.28 `THEME n|PFM|confidence|reason` format.


Worker 0.9.6.30 Theme Rerun parser fallback: accepts Markdown table rows, prose/Markdown PFM selections, and ordered PFM-code output in addition to the established pipe protocol. Slot-specific eligibility remains authoritative; final parse failures now include a short provider-response preview for diagnosis.


Worker 0.9.6.33 validation note: top-four effort notes are optional for reactions-only requests and remain required for reactionReasons requests.

## v0.9.40.80 Reports output completeness
- Custom reports no longer hide all non-AI-Theme modules when AI Theme Usage is selected.
- Dedicated AI Theme Usage reports keep the specialized theme table only.
- No layout, lifecycle, Housekeeping, Post-processing, or Worker behavior changes.
