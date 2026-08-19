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