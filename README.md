# Genreactrix v0.9.40.141 — Theme Sweep catastrophic-failure override

## v0.9.40.141 change

Theme Sweep keeps the atomic pass-completion gate from v0.9.40.140, but a blocked pass now exposes a **Continue with N** escape hatch. After confirmation, the valid population is processed normally, unrecoverable failed images remain held and excluded from Bundling, and only the valid most-repeated triplet (if any) advances to the next shuffled pass. The override is available on Pass 1, Pass 2, and Pass 3 and appears only while a pass is blocked by failures. Retry Failed remains the preferred path when recovery is possible.

Blocked sweeps also remain recognized as active across page reloads so their provisional valid images cannot be accidentally released before the user retries or explicitly continues.


Experimental Theme-selection release paired with Worker v0.9.6.88-theme-sweep-pack-recovery.

## Queue hold before AI

AI Console adds **Hold Queue until Start analysis**. When enabled, automatic flow and AI buffer intake are suspended so a full pack can accumulate in Queue. Pressing **Start analysis** remains an explicit manual send to AI and works while the hold is enabled. Worker v0.9.6.88 is unchanged.

## Theme Sweep
- The AI Console now shows exactly three Theme Sweep status fields: Pass 1, Pass 2, Pass 3.
- Pass 1 runs the selected AI population using the fixed canonical 91-Theme order and holds those images from Bundle creation until the pass finishes.
- After Pass 1, the single most-repeated exact three-Theme result (only when repeated at least twice) remains held; all other valid Theme results are released for normal bundling.
- Pass 2 reruns only the held set. The Worker shuffles the 91 Themes once for that pass and keeps that exact order for every image in the pass. The most-repeated exact triplet is held again; the rest are released.
- Pass 3 shuffles once more and reruns the remaining held set as verification. Valid results are released after Pass 3 rather than applying another low-population frequency guess.
- Theme failures with no valid three-Theme result stay held for the next pass; unresolved Pass 3 failures remain held for attention rather than entering a Bundle.
- Theme definitions, human-vote scoring, Reaction generation, Description generation, and the specialized Director Theme Rerun machinery are unchanged.
- Home portrait layout is unchanged.

## Baseline
The frozen return baseline remains site v0.9.40.137 + Worker v0.9.6.84-theme-exhaustion-slop-warning.

---

## Historical release notes
The older sections below are retained only for provenance. Their upload/version instructions are superseded by v0.9.40.141 + Worker v0.9.6.88.

# Genreactrix v0.9.40.137 — Exhaustive Theme recovery + SLOP? Warning

- Pairs with Worker v0.9.6.84-theme-exhaustion-slop-warning. Upload the Worker first, then this site build.
- Normal Theme analysis now expands only into previously unaudited Themes and keeps expanding until three adversarial-audit survivors exist or the full current 91-Theme vocabulary has genuinely been exhausted. Rejected Themes are never resurrected and the audit is not weakened.
- If full-vocabulary exhaustion still leaves fewer than three defensible Themes, the Worker returns only the legitimate survivors and records a puce **SLOP?** Slop Warning instead of fabricating a third Theme or failing the image.
- Existing puke-green **SLOP?** remains Slop Detected and overrides the puce warning when an undismissed detected assessment already exists. Both open the same Director SLOP decision menu.
- Filter adds SLOP? (either state), Slop Warning, and Slop Detected. Warning color is sampled from the approved reference image at #6F4A45.
- Provider/infrastructure/parser failures do not create Slop Warning. Theme Rerun Director-constrained failure behavior is unchanged.
- No PrimFusion definitions, Matrix version, fallback models/cooldown, AMA behavior, or kill-switch UI changed.

---

# Genreactrix v0.9.40.136 — AMA metadata type-check cleanup

- Pairs with Worker v0.9.6.83-ama-meta-typecheck-cleanup. Upload the Worker first, then this site build.
- Behavior-neutral cleanup only: rewrites `amaUniqueThemeMetas()` iteration so AI, Director, and candidate sources are passed as explicit string literals instead of being inferred from a mixed nested array.
- Eliminates the Cloudflare editor TypeScript warning `TS2345: string | any[] is not assignable to string` seen in Worker v0.9.6.82.
- All v0.9.40.135 / Worker v0.9.6.82 Theme calibration, AMA integrity, Print/PDF, provider readiness, fallback, and cooldown behavior is otherwise unchanged.
- AI kill-switch UI/behavior remains deferred.

---

# Genreactrix v0.9.40.135 — AMA calibration + integrity bundle

- Pairs with Worker v0.9.6.82-ama-calibration-integrity. Upload the Worker first, then this site build.
- Applies the current AMA-derived Theme-selection correction: ordinary visible context outranks forced emotional/semantic association; high confidence requires strong direct support.
- Preserves all 91 PrimFusion definitions and Matrix v0.0.0.0.
- Repairs Theme Rerun evidence source examples/recovery when no Description is included.
- Gives AI AMA canonical Prim definitions for Director primitive selections, explicit AI/Director ownership, repetition/placeholder/snapshot-integrity rejection, and targeted single-question recovery through the existing resumable flow.
- Repairs AI AMA Print / Save PDF on mobile by opening the print window synchronously from the tap.
- Test connection now probes Primary and Fallback independently without changing the 15-minute runtime fallback cooldown.
- Master AI kill-switch UI/behavior is intentionally NOT included in this build; it remains deferred for a separate UI design pass.
- Existing GPT-4.1 mini fallback, 3040 trigger, and 15-minute circuit breaker are unchanged.

# Genreactrix v0.9.40.134 — Theme evidence source-contract repair

- Pairs with Worker v0.9.6.81-theme-evidence-source-contract. Upload the Worker first, then this site build.
- Fixes the Stage-1 Theme literal-evidence transport contract exposed by the GPT-4.1 mini fallback: when no secondary AI Description context exists, the required output example now shows E1/E2/E3 as `image` facts instead of showing an invalid `analysis`-sourced E3.
- The second-attempt recovery instruction now follows the same source rule: image-only when no secondary context exists; image-or-analysis when context exists.
- The minimum evidence gate remains unchanged at 3 usable facts. No Theme definitions, Theme ranking, evidence semantics, Prim/PrimFusion definitions, Matrix data, or calibration rules changed.
- The 15-minute Workers AI `3040` circuit breaker and GPT-4.1 mini fallback from v0.9.40.133 / Worker v0.9.6.80 are preserved unchanged.

---

# Genreactrix v0.9.40.133 — Capacity fallback cooldown

- Pairs with Worker v0.9.6.80-capacity-fallback-cooldown. Upload the Worker first, then this site build.
- Adds a 15-minute provider circuit breaker for Workers AI error `3040` (out of capacity).
- The first `3040` falls through immediately to `openai/gpt-4.1-mini` through Cloudflare AI Gateway. Subsequent AI requests during the cooldown bypass the unavailable Workers AI model instead of paying a failed-attempt delay on every image.
- The browser persists the cooldown timestamp. When 15 minutes expires, the next AI request probes the original Workers AI model; success restores normal routing, while another `3040` starts another 15-minute fallback window.
- Fallback routing applies to the centralized Worker inference path used by Analysis, reruns, AMA, and Prompt Diagnostics.
- Provider/model routing telemetry is preserved so research output can identify whether Workers AI, OpenAI fallback, or a mixed request produced the result.
- No Theme-selection, Reaction, Description, AMA-question, Prim, PrimFusion, or Matrix semantics changed in this build. The v0.9.40.132 adversarial Theme calibration is preserved exactly.
- Cloudflare AI Gateway Unified Billing credits are required for the OpenAI fallback; no OpenAI API key is required.

---

# Genreactrix v0.9.40.132 — Theme adversarial decision pipeline

- Pairs with Worker v0.9.6.79-theme-adversarial-audit. Upload the Worker first, then this site build.
- Replaces direct image→final-Theme selection with a staged decision pipeline: literal evidence → broad candidate discovery → adversarial fit audit → final ranking.
- Stage 1 sees the image but no Theme names/codes and records only concrete evidence. Generic praise, mood inflation, and semantic conclusions are excluded.
- Stage 2 sees only the frozen evidence and the 91 Theme definitions and produces a broad candidate shortlist, explicitly including neutral/boring/literal competitors.
- Stage 3 adversarially attacks each candidate. A Theme cannot survive merely because the model can write a plausible rationale; SUPPORTED/WEAK candidates must cite positive evidence that distinguishes the Theme from a neutral/less-inferential reading. Unsupported emotional-salience substitutions are rejected.
- Stage 4 can choose only audit survivors. Rejected Themes are structurally ineligible for that final ranking; exactly-three remains mandatory only among surviving candidates.
- If the first candidate pool leaves fewer than three survivors, the Worker performs one broader candidate-expansion pass excluding rejected codes, audits those additions, and only then ranks.
- Theme Rerun keeps its frozen evidence/Director-constraint architecture but now adds an adversarial audit between each proposed open-slot selection and lock. Rejected proposals are forbidden and replaced before the rerun can finalize.
- New diagnostics preserve the literal evidence ledger, candidate codes, audit outcomes, and survivor codes for normal Theme Analysis; Theme Rerun diagnostics preserve adversarial audit rounds.
- No PrimFusion definitions changed. Matrix remains 0.0.0.0. Reaction Analysis, AMA, Tuned, SLOP?, lifecycle, history, and storage semantics are unchanged.

---

# Genreactrix v0.9.40.129 — AI AMA answer-integrity validation

- Pairs with Worker v0.9.6.76-ai-ama-answer-integrity. Upload the Worker first, then this site build.
- Keeps the fixed 3-question AMA plan, one-question recovery, all 68 canonical questions, provider timeout, Theme logic, Matrix, lifecycle, Tuned, SLOP?, history, and report semantics unchanged.
- Fixes cross-question answer bleed: every recognized `Q##` / `Question ##` marker is now a hard parsing boundary even when that ID was not requested. An answer to Q9 therefore cannot absorb a provider continuation beginning with Q10.
- Three-question responses are strict: only explicitly attributable, validated answers are checkpointed.
- Single-question recovery still accepts unlabeled prose, but only when it looks like an actual answer. It rejects generated questions, question-bank continuations, wrong/unrequested Q-markers, and other obvious prompt-continuation output.
- The Worker returns rejection reasons and a bounded provider-response preview for any missing/invalid answer. The site independently validates returned answers before persistence as a second integrity gate.
- AMA run persistence also filters obviously malformed core answers before counting them toward 68/68, preventing a structurally complete but corrupted incomplete run from being finalized.
- Existing immutable completed AMA reports are not rewritten. The previously exported .75 gravel AMA remains diagnostic/invalid evidence and should not be used for calibration.
- Matrix remains 0.0.0.0.

---

# Genreactrix v0.9.40.128 — AI AMA tolerant answer parsing

- Pairs with Worker v0.9.6.75-ai-ama-parser-tolerance. Upload the Worker first, then this site build.
- Keeps the fixed 3-question AMA plan with one-question recovery and all 68 canonical questions unchanged.
- Fixes the Q10-style parser defect: AMA answers no longer require the exact literal `Q10:` wrapper. The parser accepts `Q10:`, `Q10 —`, `Q10.`, `**Q10:**`, `Question 10:`, bullets, and surrounding whitespace.
- For a one-question recovery call, any nonempty provider text is accepted as that question's answer when no recognizable question wrapper is present; attribution is unambiguous because only one question was asked.
- If a multi-question response is still unparseable, the Worker returns a short raw provider-response preview so diagnostics can show what was actually received.
- No Theme ranking, AMA question wording, timeout, definitions, confidence, Matrix, lifecycle, Tuned, SLOP?, history, or report semantics changed. Matrix remains 0.0.0.0.

---

# Genreactrix v0.9.40.127 — AI AMA 3-question execution

- Pairs with Worker v0.9.6.74-ai-ama-3q-resumable. Upload the Worker first, then this site build.
- Keeps the persistent/resumable AMA architecture and all 68 canonical interview questions unchanged.
- Removes the 9-question interview tier entirely. Normal AMA interview execution is now fixed at three canonical questions per step: Q1–Q3, Q4–Q6, and so on, with the final step Q67–Q68.
- Every usable answer from a three-question response is checkpointed immediately.
- If a three-question step times out, errors, or returns only some requested answers, only the still-missing question(s) fall back to one-question calls. There are no interview answer-repair passes and no retry of the same three-question step before single-question recovery.
- Existing incomplete 9-question runs are migrated in place to the 3-question plan without discarding saved answers. A saved 9/68 run therefore resumes at Q10–Q12, not Q10–Q18.
- Progress UI reports the exact 3-question step (23 total for 68 questions), Q range, saved count, elapsed time, and single-question recovery when needed.
- Completed report/history semantics, Theme ranking, definitions, confidence, PrimFusion Matrix, image lifecycle, Theme Rerun, Tuned, SLOP?, and post-Batch outcomes are unchanged. Matrix remains 0.0.0.0.

---

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