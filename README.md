# Genreactrix v0.9.40.126 — AI AMA adaptive interview chunks

- Pairs with Worker v0.9.6.73-ai-ama-adaptive-chunks. Upload the Worker first, then this site build.
- Keeps the persistent/resumable AMA architecture and all 68 canonical interview questions unchanged.
- A fresh unfinished interview block first tries its normal block (up to 9 questions) once.
- If that provider call times out or returns a transient 5xx/429 failure, the site immediately falls back to groups of up to 3 questions.
- If a 3-question recovery call fails the same way, only that group falls back again to single-question calls.
- Valid answers from every successful or partial response are checkpointed immediately; already-saved Q&A are never rerun merely because a later chunk fails.
- On Resume, a partially completed block skips the large attempt and starts from the first missing question group.
- Existing saved failures from v0.9.40.125 are recognized: if that block already has a recorded question-stage failure, .126 skips another full-block wait and enters 3-question recovery immediately.
- Interview chunks no longer receive a hidden second 90-second Worker retry at the same size; the adaptive fallback owns recovery instead. Visual-read/candidate stages retain their existing reliability behavior.
- Live AMA status names the exact Q range and whether the call is a primary block attempt, 3-question recovery, or single-question recovery. A final pause records the precise Q ID(s) that failed.
- No Theme ranking, definitions, confidence semantics, PrimFusion Matrix, image lifecycle, Theme Rerun, Tuned, SLOP?, completed AMA report/history, or post-Batch outcome behavior changed. Matrix remains 0.0.0.0.

---

# Genreactrix v0.9.40.125 — AI AMA live-stage diagnostics

- Site-only diagnostic patch. Worker remains v0.9.6.72-ai-ama-resumable; no Worker upload is required.
- While an AMA call is active, the AI AMA dialog now names the exact stage, question block, Q-number range, saved Q&A count, and elapsed seconds.
- After the first 90-second provider window passes, the status explicitly notes that the Worker's automatic retry may be active; longer waits note that retry or missing-answer repair may be in progress.
- The Run button also names the current operation (Reading image, Auditing Themes, Q-range, Finalizing) instead of only saying “Running AMA…”.
- Failed/paused AMAs now preserve the last error visibly in the AI AMA dialog, including the failing stage/block and saved progress. Reopening the dialog no longer overwrites that diagnostic with a generic “Incomplete AMA” message.
- Resume messaging states that only the unfinished step/block is restarted and previously saved answers remain protected.
- No AMA persistence architecture, Theme ranking, definitions, Matrix version, image lifecycle, Tuned, SLOP?, or normal Theme Rerun behavior changed.

---

# Genreactrix v0.9.40.124 — Resumable AI AMA execution

- Replaces the single long-running AI AMA request with persistent, resumable execution.
- Creates an AMA run record before the first provider call and checkpoints the visual read, candidate audit, and each completed interview block.
- Splits the 68-question interview into eight small Worker calls (maximum nine questions per block).
- If a provider/network failure interrupts a run, already-saved answers remain intact and **Resume AI AMA** continues from the first unfinished block.
- A partially answered block preserves valid returned Q&A and can repair/retry only the missing portion on resume.
- The immutable numbered AMA report is created only after all 68 core answers and all question blocks are complete.
- Existing completed AMA reports, AMA History, follow-up Q&A, exports, Tuned, SLOP?, Theme Rerun lifecycle isolation, Theme definitions, and Matrix 0.0.0.0 remain unchanged.
- Worker counterpart: v0.9.6.72-ai-ama-resumable.

---

# Genreactrix v0.9.40.123 — AI AMA engine initialization fix
## v0.9.40.123

- Fixes **AI AMA failed: AMA Engine is unavailable**.
- Defines the missing `getReport()` AMA-history adapter before the engine export is constructed.
- AMA Engine now completes initialization and publishes `window.genreactrixAmaEngine`.
- Retains the v0.9.40.122 AI AMA, Tuned, SLOP?, filtering, history, export, and post-Batch outcome behavior.
- No Prim/PrimFusion semantic definition changes. PrimFusion Matrix remains 0.0.0.0.


- Adds **AI AMA** to Landscape Theme Rerun. It is available with the current three AI Themes and at least one Director Theme.
- **Run AI AMA?** captures the current total snapshot and creates a new immutable, numbered Q&A interview report. Director comparison is dynamic for 1, 2, or 3 Director Themes.
- The Worker answers the complete 68-question Director interview template, plus supports linked freeform follow-up questions without editing the original AMA report.
- **AMA History** is image-specific and lists numbered, dated AI-versus-Director snapshots. Saved reports are readable later and can be printed/saved as PDF, saved as HTML, or exported as JSON.
- Batch submission records a separate linked post-Batch outcome for existing AMAs so the immutable report itself is not rewritten. Agreement versus final Director result is preserved as outcome data.
- Adds **Tuned** status for images with AI work after the original Origin scan. Tuned opens the image's detailed AI lineage/history and is filterable.
- Adds advisory **SLOP?** detection during Origin AI analysis and later AI reruns. SLOP never skips or weakens the required exactly-three Theme task. The Director can review the AI reason and choose Yellow, Red, Hot Magenta, or NOT SLOP. SLOP is filterable.
- AI AMA, Tuned, and SLOP status colors are UI-only and do not print hexadecimal values in the interface.
- Retains v0.9.40.121 Theme Rerun lifecycle/placement recovery.
- No Prim/PrimFusion semantic definition changes. PrimFusion Matrix remains 0.0.0.0.
- Worker counterpart: v0.9.6.70-ai-ama-slop-advisory.

---

# Genreactrix v0.9.40.121 — Theme Rerun placement integrity reconciliation

- Recovers open Quarantine cases when Theme Rerun attempts incorrectly contributed to the three-isolated-failure threshold.
- Restores the image to its pre-rerun active stage without clearing its AI artifacts.
- Verifies the full-resolution payload before restoring placement.
- If the payload itself is missing, leaves the record untouched and creates an explicit Maintenance notification instead of silently pretending recovery succeeded.
- Also repairs Theme-Rerun images that are active but outside every authoritative lifecycle owner when history provides the prior stage.
- Correctly accounted images are not touched.
- No Theme definitions, scoring, Evidence Pass, Theme selection, or Matrix changes.

# Genreactrix v0.9.40.120 — Theme Rerun lifecycle isolation and recovery

## v0.9.40.120

- Theme Rerun AI jobs are lifecycle-isolated: they no longer move an image to AI Processing, Staged, Queue, Partial, or Quarantine.
- Theme Rerun cannot trigger automatic Bundle movement or automatic Queue/AI maintenance after its job.
- Each Theme Rerun job snapshots and guards the image lifecycle placement, Batch IDs, active/historical Bundle membership, storage references, recycle/archive/reject state, and isolated-failure/quarantine metadata.
- If any guarded field drifts during a Theme Rerun, the job restores the pre-rerun value without rolling back the new Theme artifact.
- Startup recovery inspects legacy Theme Rerun history and restores images whose most recent lifecycle changes were caused only by old Theme Rerun jobs. This includes Theme-Rerun-caused Quarantine.
- Theme Rerun attempts are removed from Quarantine isolation evidence; an invalid Quarantine case is voided when fewer than three non-Theme-Rerun isolated failures remain.
- No Theme prompt, Theme definition, confidence logic, Evidence Pass, exactly-three rule, PFM identity rule, or Theme Edit Log behavior changed.
- PrimFusion Matrix remains 0.0.0.0.
- Current Worker remains v0.9.6.68-theme-rerun-plain-text-selection-transport; no Worker upload is required for this site fix.

---

# Genreactrix v0.9.40.119 — Theme Rerun evidence-support selection

## v0.9.40.119

- Keeps the v0.9.40.118 frozen pre-selection Evidence Pass.
- Theme Rerun Stage 2 now returns only compact slot + PFM code + confidence + supporting E# IDs.
- The Stage 2 selection call has no image access and does not generate Theme Edit Log prose.
- Every open Theme choice must cite one or more valid facts from the frozen evidence ledger.
- Valid partial selections are preserved; only missing/malformed slots are repaired.
- Theme Edit Log explanation is generated only after the exactly-three selection is locked, without image access, using only the E# facts cited by that locked selection.
- Theme Edit Log schema is bumped so pre-v0.9.40.119 rerun logs are not presented as evidence-support logs.
- Normal Theme Analysis is unchanged. No Prim/PrimFusion semantic definition changes. PrimFusion Matrix remains 0.0.0.0.
- Worker counterpart: v0.9.6.65-theme-rerun-evidence-support-selection.