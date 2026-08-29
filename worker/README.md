# Genreactrix AI Worker 0.9.6.146-theme-taxonomy-refresh

- v0.9.6.146 applies the approved 12-Prim / 66-Theme taxonomy and definition refresh. Matrix version remains 0.0.0.0.


- Server jobs can start while local-image uploads are still arriving.
- Each uploaded image is queued immediately when its own R2 source becomes ready.
- Only ready queued items are dispatched; duplicate queue deliveries use an atomic queued→processing claim.
- During preparing/idempotent creation, the submitted manifest is authoritative and orphan rows are removed.
- PFM0712 (Angry + Celebration) is now **Badass**; Revenge is retired. Stable code and Prim components are unchanged.
- Applies the approved Hilarious, FreakyDeaky, and Shame definition tuning.
- PrimFusion Matrix styling and geometry are unchanged by companion site v0.9.40.196.
- Provider lanes, server-job orchestration, independent Theme audit, Description pipeline, and deterministic Theme-derived Reactions are otherwise unchanged.
- Companion site: v0.9.40.196.

# Genreactrix AI Worker 0.9.6.143-server-handoff-idempotency

- Server job creation is now idempotent by `clientJobId` and requested item ids.
- Concurrent duplicate creates converge on the same server job instead of creating competing D1 jobs whose shared item ids collide.
- `ai_job_items` inserts use insert-if-missing semantics and are followed by ownership verification.
- Partial/competing historical handoffs for the same client job are consolidated onto the canonical job; duplicate server-job shells are marked superseded.
- A previously cancelled duplicate handoff can be reopened when the same still-active local client job explicitly resubmits it; completed work is preserved.
- Server-job creation validates the complete manifest before creating D1 state.
- No AI prompt or taxonomy telemetry changed; this is orchestration/storage only.
- Companion site: v0.9.40.196.

# Genreactrix AI Worker 0.9.6.142-zazzlyparty

- PFM0912 (Zazzly + Celebration) is now **ZazzlyParty**; Hedonism is retired.
- ZazzlyParty requires both visible Zazzly/sexy presentation and visible celebration/party context. Either component alone is insufficient.
- PFM0912 keeps its stable code and P09 + P12 components.
- Theme prompt telemetry advances only to mark the changed active taxonomy semantics.
- All other Theme definitions, provider lanes, Description behavior, server-job orchestration, and six-slot Theme-derived Reactions are unchanged.
- Companion site: v0.9.40.192.

# Genreactrix AI Worker 0.9.6.141-schadenfreude-freakshow-swap

- PFM0304 (Tragic + Funny) is now **Schadenfreude**, using the Director-supplied victim/observer, expression, contextual, and negative-sample definition.
- PFM0612 (Weird + Celebration) is now **Freakshow**, preserving the full calibrated Freakshow definition and its public-nudity/transgression gate.
- Delirious is retired. PFM codes, Prim components, 66-Theme count, fixed shuffled code orders, and six-slot Theme-derived Reactions remain unchanged.
- Preserves Worker 0.9.6.140 unified Description rerun v5 behavior and all server-job/rerun orchestration.
- Theme prompt telemetry advances only to mark the changed active taxonomy semantics.
- Companion site: v0.9.40.191.

# Genreactrix AI Worker 0.9.6.139-server-reruns-full66

- Server-job Queue execution now accepts the existing Theme Rerun and Description Rerun request payloads unchanged; the Worker continues to execute the same `analyze()` rerun code paths.
- Both fixed shuffled Theme-order catalogs now include the complete current 66-Theme vocabulary, including Cheeky, Cursed, and Halloween.
- Existing 63-Theme relative ordering is preserved; only the three previously omitted Themes are inserted.
- Worker module initialization asserts complete/unique fixed Theme catalogs so stale vocabulary cannot silently recur.
- Fresh Theme telemetry advances to `genreactrix-themes-pfm-v36-mistral-primary-whole-run-full66-fixed-orders`; unconstrained Theme-rerun telemetry advances to `genreactrix-themes-pfm-v25-rerun-human-vote-raw-full66-fixed-shuffled-order`.
- Glory/Freakshow/Description calibration, provider order, Theme-derived Reactions, and taxonomy are otherwise unchanged.
- Companion site: v0.9.40.190.

# Genreactrix AI Worker 0.9.6.138-targeted-server-retry

- Adds targeted `retry-failed` control for server jobs so the site can requeue only retryable failed item IDs.
- Images already isolated to Quarantine/Defective are not requeued merely because another image in the same server job needs a retry.
- Preserves the complete v0.9.6.137 Glory/Freakshow/Description calibration, provider order, Theme Sweep request semantics, and Theme-derived Reaction architecture.
- Required companion Worker for site v0.9.40.189 automatic AI-to-manual-Bundle orchestration.

# Genreactrix AI Worker 0.9.6.137-glory-freakshow-description-calibration

- Current embedded Worker source synchronized with the deployed calibration build.
- Glory requires independent achievement/honor/acclaim evidence; physique/confidence alone is insufficient.
- Freakshow rejects public nudity/transgression alone as sufficient evidence.
- Description performs an independent sexual-salience/body-display check.
- v0.9.40.189 changes browser orchestration only: automatic retry/Theme Sweep continuation now runs to the manual Bundle boundary; Worker AI pipeline behavior is otherwise unchanged.

# Genreactrix AI Worker 0.9.6.136-cloudflare-typecheck-fix

- Cloudflare JavaScript type-check compatibility repair for the server-job Worker.
- Preserves technical retry-history telemetry and corrects the Queue consumer call signature.
- Runtime behavior remains the deployed 0.9.6.136 Cloudflare typecheck-fixed server-job runner; v0.9.40.188 changes only the site Danger Zone cleanup path; Worker behavior is unchanged.

# Genreactrix AI Worker 0.9.6.135-server-job-runner

- Adds durable AI pass orchestration using D1 (`GENREACTRIX_JOBS_DB`), R2 (`GENREACTRIX_AI_IMAGES`), and Queue (`GENREACTRIX_AI_JOB_QUEUE`).
- The Queue consumer calls the existing `analyze()` function for each image; the AI pipeline itself is unchanged.
- New authenticated `/api/genreactrix/jobs` endpoints create, upload, start, inspect, pause/resume/cancel/retry, and harvest server jobs.
- `/api/health` reports `serverJobs.enabled` only when all three bindings are present.
- The old synchronous `/api/genreactrix/analyze` and `/api/genreactrix/analyze-stream` paths remain unchanged and available.

# Genreactrix AI Worker 0.9.6.134-open-three-filled — final three PrimFusion slots

- Active taxonomy: 12 Prims / 66 assigned PrimFusion Themes / 0 open pair slots.
- Adds PFM0109 Cheeky, PFM0708 Cursed, and PFM1112 Halloween.
- Prompt Diagnostics: 78 concepts across 6 batches (15, 15, 15, 15, 15, 3).
- Preserves deterministic six-slot Theme-derived Reactions; no AI Reaction scan.
- Preserves approved PFM0104 Goofy / PFM0204 Camp.

---

# Genreactrix AI Worker 0.9.6.133-smart-matrix-cache-repair — Smart matrix/cache repair

- Active taxonomy remains 12 Prims / 63 assigned PrimFusion Themes / 3 open pair slots.
- Restores the approved PFM0104 Goofy / PFM0204 Camp mapping in the Worker registry.
- Prompt Diagnostics remains 75 concepts / 5 complete batches.
- No AI Reaction scan is reintroduced.

---

# Genreactrix AI Worker 0.9.6.132-p13-audit-repair — P13 audit repair

Matrix identity and taxonomy remain unchanged from 0.9.6.131: 12 Prims, 63 assigned PrimFusion Themes, 3 open pair slots.

- Repairs Prompt Diagnostics batching for the 75-concept post-Smart vocabulary.
- Uses five complete 15-concept batches, balanced as 3+12, 3+12, 2+13, 2+13, 2+13 Prim/Theme concepts.
- Removes the stale seven-batch validator path that could throw during Worker module initialization.
- Retains intentional legacy P13→P12 migration references outside the active taxonomy.

---

# Genreactrix AI Worker 0.9.6.131-smart-retired — Smart retired / Celebration renumbered

Matrix identity remains 0.0.0.0. Active taxonomy: 12 Prims, 63 assigned PrimFusion Themes, 3 open pair slots.

- Retires Smart/P12.
- Moves Celebration P13 → P12.
- Retires Innocence, Elegant, and Gloomy.
- Mundane → PFM0203 (Beautiful + Tragic).
- Glory → PFM0512 (Intense + Celebration).
- All surviving former Celebration PFMxx13 codes are recoded to PFMxx12.
- Fixed shuffled Theme-order arrays are remapped by Theme identity, not positional rank.

---

# Genreactrix AI Worker 0.9.6.130 — Smart cleanup

Current behavior: no AI Reaction scan. Reactions remain derived 100% from the three selected Themes as six equal 1/6 Theme→Prim slots; duplicate Prims accumulate. Theme/Description provider routing remains Mistral → GPT-4.1 mini → Qwen 3.7 Plus.

Matrix identity remains 0.0.0.0. Active taxonomy: 13 Prims, 66 assigned PrimFusion Themes, 12 open pair slots. This release applies the approved Smart cleanup relocations, definition carryovers, and synchronized fixed Theme-order arrays.

---

## 0.9.6.130 — Smart cleanup

- Relocates Spirituality, Overstimulated, Shame, Despair, Absurd, Medicated, Excess, Foreboding, and Paranoia by stable PFM cell code.
- Retires standalone Cringe, Witty, Devastating, Zany, and Macabre.
- Adds Hilarious at PFM0405 using the prior Witty definition unchanged.
- Despair absorbs visible Devastating loss/ruin/aftermath coverage; Goofy absorbs useful Zany eccentric/comic coverage with its anti-catch-all gate retained.
- Active AI Theme vocabulary is 66; total Prompt Diagnostic concepts are 79 including 13 Prims.
- No Reaction scan is reintroduced; Theme-derived Reaction architecture and provider/audit behavior are unchanged.

## 0.9.6.121 — Qwen 3.7 Plus non-thinking

- Fresh Theme acceptance now uses the compact `theme-decision-audit` stage: only the three delivered Themes are audited on the decision-critical path.
- The strict SUPPORTED / WEAK / REJECT, GATE_PASS / GATE_FAIL, and contradiction rules are preserved.
- The previous heavy Theme diagnostic (all active Prim scores + up to 12 serious candidates + selected-Theme audit) is retained as `theme-reporting-diagnostic` behind `/api/genreactrix/theme-report-diagnostic`.
- The ordinary `/api/genreactrix/analyze` and `/api/genreactrix/analyze-stream` endpoints are preserved.
- v0.9.6.119 TransformStream compatibility repair is retained.
- Provider order remains **Mistral → GPT-4.1 mini → Qwen 3.7 Plus**.
- Qwen 3.7 Plus requests set `enable_thinking:false`; live provider telemetry reports `thinkingMode: disabled`.

# Genreactrix AI Worker

Current bundled Worker: v0.9.6.133-smart-matrix-cache-repair.

## Historical bundled Worker notes

## 0.9.6.111 — Goofy/Camp swap

- PFM0104 (Adorable + Funny) is now **Goofy**.
- PFM0204 (Beautiful + Funny) is now **Camp**.
- Charming remains retired.
- Keeps 13 active Prims, 78 active PrimFusion Themes, Angry=P07, and Matrix identity 0.0.0.0.
- No PFM codes or other Theme definitions change.

# Genreactrix AI Worker

Current bundled Worker: v0.9.6.103-url-resolution-repair.

## Worker 0.9.6.103 — URL resolution repair

- Keeps direct HTTPS image retrieval unchanged when the URL already returns image bytes.
- Resolves Wikimedia Commons `wiki/File:` pages through the Commons API to a bounded media rendition when available, with a direct-file redirect fallback.
- For other HTTPS HTML source pages, performs a bounded metadata/image candidate resolution pass before failing import.
- The same resolver is used by the authenticated image proxy and internal image-byte loading, so linked source-page records remain usable downstream.
- Mistral Description recovery, Theme/Reaction routing, and Matrix 0.0.0.0 are unchanged.

## Worker 0.9.6.102 — Production cleanup

- Preserves Mistral Description rescue and downstream primary/fallback recovery.
- Removes the completed one-time Blind Prim diagnostic endpoint and health advertisement.
- Matrix remains 0.0.0.0.

## Worker 0.9.6.101 — Mistral description resume routing

- Keeps Mistral description-only role.
- Adds Mistral to the provider readiness probe.
- Reuses a successful Mistral Description for Theme work using primary first, then existing fallback.
- Emits the successful Mistral Description in downstream failure diagnostics so the site can persist it rather than discard it.
- Accepts a preserved Mistral Description on a later Theme retry and resumes from Themes instead of rerunning Description.
- Matrix remains **0.0.0.0**.

## Worker 0.9.6.100 — Mistral description third fallback

- Preserves the accepted v0.9.6.99 Theme pipeline and mismatch recovery unchanged; Matrix remains **0.0.0.0**.
- Adds direct Mistral Chat Completions vision only after both existing fresh-description routes fail or return a refusal/limitation pattern.
- Default third-provider model: `ministral-14b-2512`.
- Requires Worker secret `MISTRAL_API_KEY`; optional `MISTRAL_DESCRIPTION_MODEL` overrides the model.
- Mistral is not added to general provider routing or any non-Description component.
- Description diagnostics identify successful third-provider rescue and preserve the preceding primary/backup failures.

## Worker 0.9.6.99 — Theme mismatch auto-recovery

- Matrix remains **0.0.0.0**.
- Hard Theme/evidence contradictions trigger one blocked Theme rescan; audit-only `GATE_FAIL` results get one unblocked confirmation rescan.
- Preliminary Theme rationales that contradict their selected Theme’s defining requirements get one blocked preliminary rescan.
- Pride, PartyTime, and Obsessive use the newly approved wording; approved Exposure, Brutal, and Grotesque calibration is preserved; Aggressive and Mundane remain unchanged.
- Theme/Prompt diagnostic provider timeout is 120 seconds. Malformed/incomplete Theme reasoning gets one immediate format retry; provider timeout exits for one fresh outer request rather than nesting another 120-second provider call.
- Corrects the prior pre-live Matrix metadata/file-name booboo; canonical Matrix identity is 0.0.0.0.

## Worker 0.9.6.97 — Targeted Theme-definition calibration

- Matrix remains v0.0.0.0; this pre-live Theme-definition calibration does not advance the Matrix version.
- Changes only PFM0512 Obsessive, PFM0210 Grotesque, PFM0510 Brutal, PFM0209 Exposure, and PFM0513 Pride wording.
- PFM0514 Aggressive and PFM1214 Mundane are unchanged.
- Inherits the v0.9.6.96 final Description-only fixed second shuffle unchanged; no additional AI calls or unrelated selection machinery changes.


## Worker 0.9.6.96 — Final Theme second shuffle

- One-variable continuation of v0.9.6.95.
- Preliminary Theme selection keeps the existing fixed shuffled order.
- Only the final Description-only Theme catalog presentation order changes, using a second fixed deterministic shuffle.
- No extra AI calls and no changes to prompts, definitions, Description/Zazzly behavior, providers, fallback routing, Theme reasoning, Reactions, or storage.

## Worker 0.9.6.95 — Preserve Theme machinery + Description refinement

- Preserves the existing image-based human-vote Theme selector as the preliminary Theme source.
- Adds the Theme-aware Description and description-only final Theme refinement.
- Any preliminary Zazzly-associated Theme triggers the exhaustive all-14 Zazzly Description procedure.
- Description refusal/limitation gets one alternate-provider retry.
- Existing Theme reasoning sidecar and ordinary Primary/Fallback routing remain in place.

---

# Genreactrix AI Worker

Current bundled Worker: v0.9.6.92-blind-prim-text-contract.

## Worker 0.9.6.92 — Blind Prim text-contract repair

- Fixes the new Blind Prim diagnostic without changing Primary/Fallback routing.
- Replaces provider-enforced JSON Schema for this diagnostic only with a minimal `PICK|P##|reason` / `NONE` text contract.
- Genreactrix parses and validates the response locally: zero picks remains valid; maximum four; unknown and duplicate Prim codes still fail.
- No Prim definitions, Theme behavior, Reaction behavior, provider circuit-breaker behavior, or ordinary AI analysis contracts changed.

---

## Worker 0.9.6.91 — Blind Prim diagnostic

- Preserves the v0.9.6.90 Theme reasoning diagnostic and all v0.9.6.89 Theme gates.
- Adds authenticated `/api/genreactrix/blind-prims` for the isolated 60-image Blind Prim experiment.
- Each call receives only the image plus the 14 canonical Prim definitions. It receives no Theme list, descriptions, prior AI results, Reaction scores, Director data, or PrimPicker state.
- Valid output is zero through four ranked Prim codes with one short concrete image-grounded reason each. Blank is valid; the Worker does not fill or repair missing Prim selections.
- Per-call provider/model routing is returned so mixed-provider runs are visible in the exported test data.

---

## Worker 0.9.6.89 — Theme definition gates

- Retains Worker 0.9.6.88 Theme Sweep order control and human-vote scoring behavior.
- Tightens only four Theme definitions with explicit negative gates: Satirical (PFM0407), Aggressive (PFM0514), Monstrous (PFM0614), and Repulsive (PFM1014).
- Pass 1 remains canonical; recovery Passes 2 and 3 retain one seeded shuffled order fixed across each pass.
- Reactions, Description, Theme scoring, Theme output contract, and sweep protocol are unchanged.

---

## Historical Worker release notes
The older sections below are provenance only; the current bundled Worker is v0.9.6.89.

# Genreactrix AI Worker

Historical bundled Worker: v0.9.6.84-theme-exhaustion-slop-warning.

## Worker 0.9.6.84 — Exhaustive Theme recovery + SLOP? Warning

- When the normal adversarial Theme audit has fewer than three survivors, every expansion pass excludes all previously audited candidates, not merely prior rejects.
- Recovery continues until three legitimate survivors exist or all 91 current PrimFusion Themes have been audited.
- Full-vocabulary exhaustion with fewer than three survivors returns only the legitimate survivors plus a structured Slop Warning; it does not fabricate a third Theme.
- Slop Warning is distinct from the existing AI Slop Detected advisory. Provider, parser, schema, and infrastructure failures remain ordinary failures and never become Slop Warning.
- Theme Rerun constraints/behavior, Theme definitions, Matrix v0.0.0.0, provider fallback, and 15-minute cooldown are unchanged.

---

# Genreactrix AI Worker

Current bundled Worker: v0.9.6.83-ama-meta-typecheck-cleanup.

## Worker 0.9.6.83 — AMA metadata type-check cleanup

Behavior-neutral cleanup of `amaUniqueThemeMetas()` to remove Cloudflare editor TS2345 inference from the previous mixed nested source array. AI, Director, and candidate metadata are now iterated explicitly; output ordering and de-duplication semantics are preserved.

## Worker 0.9.6.82 — AMA calibration + integrity

- AMA-derived Theme candidate/audit/final ranking contextual gating and confidence calibration.
- Theme Rerun no-Description evidence-source contract repair.
- AI AMA Prim-definition resolution, source ownership, answer-integrity and repetition checks.
- Provider readiness endpoint probes Primary and GPT-4.1 mini fallback independently without touching cooldown state.
- PrimFusion definitions, Matrix v0.0.0.0, and 15-minute 3040 fallback behavior remain unchanged.

# Genreactrix AI Worker

Current bundled Worker: v0.9.6.81-theme-evidence-source-contract.

## Worker 0.9.6.81 — Theme evidence source-contract repair

- Fixes the Stage-1 Theme literal-evidence output example for requests with no secondary AI Description context: E3 is now an `image` fact instead of an invalid `analysis` fact.
- The recovery instruction is source-aware as well: image-only without secondary context; image-or-analysis when secondary context is present.
- The parser still requires at least 3 usable facts; no evidentiary gate was weakened.
- No Theme definitions, Theme ranking, Prim/PrimFusion definitions, Matrix data, Reaction/Description/AMA semantics, or 15-minute capacity-fallback routing changed.

---


## Worker 0.9.6.80 — 3040 capacity fallback circuit breaker

- Primary Workers AI models remain unchanged. No Reaction, Theme, Description, AMA, Prompt Diagnostics, Prim, or PrimFusion prompt/definition changes are included.
- A Workers AI `3040` / out-of-capacity failure immediately activates `openai/gpt-4.1-mini` through Cloudflare AI Gateway; the failed primary call is not repeatedly retried first.
- The fallback stays active for 15 minutes. The Genreactrix browser stores the cooldown timestamp and sends it with subsequent AI requests, so those requests go directly to the fallback even if Cloudflare creates a fresh Worker isolate.
- After 15 minutes, the next AI request probes the original Workers AI model. Success restores primary routing; another `3040` starts a fresh 15-minute fallback window.
- Provider/model routing telemetry is returned with analyses and diagnostic/AMA calls so fallback-produced work is distinguishable from primary-model work.
- Third-party fallback calls use the existing `AI` binding with AI Gateway `default`. They require AI Gateway Unified Billing credits but do not require an OpenAI API key.

---

## Worker 0.9.6.79 — Theme adversarial decision pipeline

- Replaces normal direct Theme finalization with four stages: literal evidence → broad candidate discovery → adversarial fit audit → final rank.
- The literal evidence stage has image access but no Theme vocabulary and records only concrete facts. Candidate, audit, and final-rank stages have no image access and operate from the frozen evidence ledger.
- Candidate discovery deliberately keeps neutral, boring, ordinary, and less-inferential alternatives in play instead of favoring emotionally richer answers.
- The adversarial audit marks candidates SUPPORTED, WEAK, or REJECT. SUPPORTED/WEAK require positive E# evidence; a plausible post-hoc rationale is not enough.
- REJECTed candidates are structurally excluded from final ranking. If fewer than three candidates survive, one expansion pass searches for additional candidates excluding rejected codes and audits the additions.
- Theme Rerun retains Director constraints and the frozen evidence ledger but now audits every proposed open-slot Theme before lock. Rejected rerun candidates are forbidden and must be replaced; up to three audit/replacement rounds are allowed.
- The Worker returns Theme decision diagnostics containing evidence, candidate shortlist, audits, and survivor codes; rerun diagnostics include audit rounds.
- No PrimFusion definitions changed. Matrix remains 0.0.0.0. Reaction Analysis, AMA, Tuned, SLOP?, lifecycle, history, and storage semantics are unchanged.

---


## Worker 0.9.6.76 — AI AMA answer-integrity validation

- Keeps the 23-step 3-question AMA plan and 3→1 recovery architecture unchanged.
- Uses all recognized question-ID markers as hard answer boundaries, including unrequested IDs, so one answer cannot swallow later provider-generated questions.
- Three-question calls require explicit attributable IDs; unlabeled multi-question output is not accepted.
- Single-question recovery accepts unlabeled prose only after validation. Generated questions, question-bank continuations, wrong Q-ID markers, and obvious prompt continuation are rejected instead of checkpointed.
- Rejected answers return a reason plus a bounded raw provider preview for live diagnostics.
- Single-question output is capped more tightly to reduce runaway question-bank generation without changing the 90-second provider timeout.
- No canonical AMA question wording, Theme logic, definitions, confidence, lifecycle, Tuned, SLOP?, report/history semantics, or Matrix behavior changed. Matrix remains 0.0.0.0.

---

# Genreactrix AI Worker

Current bundled Worker at that release: v0.9.6.75-ai-ama-parser-tolerance.

## Worker 0.9.6.75 — Tolerant AI AMA answer parsing

- Keeps the 23-step fixed 3-question AMA plan and 3→1 recovery architecture unchanged.
- Makes AMA answer parsing tolerant of common model formatting variants instead of requiring only a literal line-start `Q##:` marker.
- Single-question recovery treats any nonempty provider text as the requested answer if no explicit Q-number wrapper is present.
- Multi-question parse failures expose a bounded raw-response preview for diagnostics rather than discarding provider text invisibly.
- No prompt/question wording, provider timeout, Theme logic, lifecycle, Tuned, SLOP?, definitions, report/history, or Matrix behavior changed. Matrix remains 0.0.0.0.

---

# Genreactrix AI Worker

Current bundled Worker: v0.9.6.74-ai-ama-3q-resumable.

## Worker 0.9.6.74 — Fixed 3-question resumable AI AMA

- Changes the canonical resumable AMA question plan from 9-question blocks to 3-question steps, producing 23 steps for the 68-question interview (22 groups of 3 plus Q67–Q68).
- A resumable question request accepts at most the three canonical IDs belonging to that step.
- Each current-granularity interview call makes one provider attempt and returns every usable answer plus explicit missing IDs. It performs no missing-answer repair pass.
- The site owns the only interview fallback: a failed or partial 3-question step is reduced to one-question calls for the missing IDs.
- Visual read and candidate-audit reliability behavior is unchanged. AMA history/report semantics, Theme logic, lifecycle isolation, Tuned, SLOP?, definitions, and Matrix behavior remain unchanged. Matrix remains 0.0.0.0.

---

# Genreactrix AI Worker

Current bundled Worker: v0.9.6.73-ai-ama-adaptive-chunks.

## Worker 0.9.6.73 — Adaptive AI AMA question chunks

- Adds canonical question-subset support inside each existing 9-question AMA block, allowing the site to request 9, 3, or 1 question without changing the 68-question bank.
- Resumable interview question calls now make one 90-second provider attempt at their current granularity. They do not silently retry the same oversized chunk for a second 90-second window.
- Missing IDs are returned as partial results instead of triggering a hidden repair call; the site checkpoints valid answers and reduces only the missing work.
- Existing visual read, candidate audit, AMA history/report semantics, Theme logic, lifecycle isolation, Tuned, SLOP?, definitions, and Matrix behavior remain unchanged. Matrix remains 0.0.0.0.

---

# Genreactrix AI Worker

Current bundled Worker: v0.9.6.72-ai-ama-resumable.

## Worker 0.9.6.72 — Resumable AI AMA execution

- Adds independent AMA modes for visual read, candidate audit, and small question blocks.
- Uses eight question blocks with at most nine core questions per request instead of holding the complete 68-question interview open in one request.
- Keeps the AMA-specific 90-second provider timeout and one transient retry per provider call.
- Question-block responses preserve valid answers and report any still-missing IDs rather than inserting placeholder answers.
- The site can persist each successful stage and resume from the first unfinished block after timeout, provider failure, refresh, or network interruption.
- Legacy `mode=run` remains available for compatibility, but v0.9.40.124/.125 use the resumable modes.
- No Theme selection/rerun, SLOP, Prim/PrimFusion definition, lifecycle, or Matrix behavior changes. Matrix remains 0.0.0.0.

---

# Genreactrix AI Worker

Current bundled Worker: v0.9.6.70-ai-ama-slop-advisory.

## Worker 0.9.6.70 — AI AMA + SLOP advisory

- Adds the authenticated AI AMA interview endpoint used by site v0.9.40.122.
- Runs the complete 68-question AI-versus-Director Theme interview for the current immutable snapshot and supports linked follow-up Q&A.
- Saves the Theme-definition snapshot used by the AMA for historical audit.
- Adds a separate SLOP advisory after Theme selection during Origin analysis and later reruns. SLOP cannot skip, replace, or weaken exactly-three Theme selection.
- Theme selection/rerun definitions and PrimFusion Registry are unchanged from the prior Worker baseline.
- PrimFusion Matrix remains 0.0.0.0.

---

# Genreactrix AI Worker

Current bundled Worker: v0.9.6.68-theme-rerun-plain-text-selection-transport.

## Worker 0.9.6.68 — current bundled snapshot

- Theme Rerun Stage 2 uses plain-text compact selection transport.
- Frozen evidence, E# support, exactly-three PFM selection, targeted repair, and Theme Edit Log behavior are unchanged.
- This Worker is unchanged by Genreactrix site v0.9.40.120.
- No Prim or PrimFusion semantic definition changes. Matrix remains **0.0.0.0**.

---

# Genreactrix AI Worker

Current bundled Worker: v0.9.6.61-theme-edit-log-version-fix.

## Worker 0.9.6.61 — synchronized site/version-label release

- Worker behavior is unchanged from 0.9.6.60.
- Version is advanced only to keep the deployed Worker synchronized with Genreactrix v0.9.40.115.
- Theme Rerun targeted repair, Reaction targeted weight repair, and Theme Edit Log rationale behavior are unchanged.
- No Prim or PrimFusion semantic definition changes. Matrix remains **0.0.0.0**.

---

# Genreactrix AI Worker

Current bundled Worker: v0.9.6.60-theme-change-checkbox-alignment.

## Worker 0.9.6.60 — synchronized site-layout release

- Worker behavior is unchanged from 0.9.6.59.
- Version is advanced only to keep the deployed Worker synchronized with Genreactrix v0.9.40.114.
- Theme Rerun targeted repair, Reaction targeted weight repair, and Theme-change rationale behavior are unchanged.
- No Prim or PrimFusion semantic definition changes. Matrix remains **0.0.0.0**.

---

# Genreactrix AI Worker

Current bundled Worker: v0.9.6.59-theme-change-reasoning-cache-fix.

## Worker 0.9.6.59 — synchronized site-fix release

- Worker behavior is unchanged from 0.9.6.58.
- Version is advanced only to keep the deployed Worker synchronized with Genreactrix v0.9.40.113.
- Theme Rerun targeted repair, Reaction targeted weight repair, and Theme-change rationale behavior are unchanged.
- No Prim or PrimFusion semantic definition changes. Matrix remains **0.0.0.0**.

---

# Genreactrix AI Worker

Current bundled Worker: v0.9.6.58-theme-change-reasoning.

## Worker 0.9.6.58 — Theme-change reasoning + targeted repair

- Theme Rerun accepts `explainChanges`; it defaults to **true** when absent for backward compatibility.
- When enabled, each open Theme stores its brief image-grounded rationale with the immutable Theme artifact.
- When disabled, the returned Theme artifact does not retain an incidental rationale.
- Theme Rerun preserves valid PFM-code selections and makes a small repair call only for missing open Theme slots.
- Already accepted Theme slots are immutable during repair; slot eligibility, exclusions, PrimPicker requirements, Preserve/Replace behavior, and unique final PFM codes remain enforced.
- Reaction Analysis preserves every valid P01–P14 weight and makes a small repair call only for missing, non-numeric, or out-of-range weights.
- Valid reaction weights are never recalculated merely because another Prim weight failed.
- Matrix remains **0.0.0.0**. No Prim or PrimFusion semantic definitions changed in this Worker.

Current bundled Worker: v0.9.6.56-nostalgia-theme-rerun-code-first.

## Worker 0.9.6.56 — Nostalgia + Theme Rerun code-first recovery

- PFM0308 Liminal is replaced by Nostalgia with the approved definition: **Old-timey, vintage, retro, memory-filled, or evocative of the past, childhood, bygone eras, or “the good old days.”**
- Theme Rerun resolves returned selections from valid eligible PFM codes; provider-written Theme-name text is ignored for identity.
- Recovers the observed Markdown block format such as `**Theme 1: Neutral** * PFM code: PFM0206 * Confidence: 100 * Reason: ...`.
- Existing Preserve/Replace, exclusion, PrimPicker, uniqueness, and slot eligibility rules remain enforced.
- Matrix remains **0.0.0.0**. No other definition changes.

# Genreactrix AI Worker

Current bundled Worker: v0.9.6.55-romance-obsessive-mundane-calibration.

## Worker 0.9.6.55 — Romance + Obsessive/Mundane calibration

- PFM0208 Romance tightened to specifically romantic evidence and explicitly includes marriage proposals and engagements.
- PFM0512 Brilliant renamed to Obsessive; existing Obsessive semantics moved intact.
- PFM1214 Obsessive renamed to Mundane with ordinary/dull/commonplace semantics.
- Matrix remains 0.0.0.0.
- All Worker parsing/recovery/self-check behavior from 0.9.6.54 is retained.


- Adds a 105-wide final-score self-check: the AI must re-read its own completed component assessments/reasons and revise a conflicting score. Assessment → score; never score → assessment. No new evidence may be invented during the self-check.
- Adds `<ASSESSMENT>` placeholder recovery: when a provider returns `CODE.NN <ASSESSMENT> - reason`, the Worker preserves the reason and makes a tiny label-only repair call for that exact component instead of guessing from prose or stopping the run.
- Refines only PFM0308 Liminal, PFM0412 Witty, PFM0414 Trolling, PFM0610 Mutant, PFM0614 Monstrous, PFM0712 Parodic, PFM0713 Snarky, and PFM1011 Horror.
- PFM0308 begins with the canonical requirement `Liminal is always quiet.`
- PFM0713 defines smirk versus an ordinary smile.
- PFM0614 is synchronized into the Worker registry; the prior site text and Worker registry had diverged.
- Matrix remains 0.0.0.0.

---

## Worker 0.9.6.52 — Prompt Diagnostics assessment/reason recovery

- Component-chunk repairs now accept `CODE.PART :: component text` followed by `<allowed assessment>: <reason>` when the provider omits the literal `ASSESSMENT` and `REASON` labels.
- The fallback is exact-component anchored: the component heading must already be a valid expected component, the next substantive line must start with an allowed assessment token and delimiter, and it must contain a substantive reason.
- Unrelated prose clears the pending component; a new component cannot inherit an earlier component's assessment/reason.
- Existing 0.9.6.51 component-heading forms and all prior parser recovery remain supported.
- Regression coverage includes the observed PFM0513.01–PFM0513.03 response and strict no-cross-component/no-arbitrary-prose guardrails.
- No definition or semantic-scoring changes. Matrix remains 0.0.0.0.

---

## Worker 0.9.6.51 — Prompt Diagnostics component-heading recovery

- Component repairs accept the provider form `CODE.PART :: component text`, then `ASSESSMENT: <allowed token>`, then `REASON: <text>` on separate substantive lines.
- Scope is parser-only and exact-ID anchored. A heading does not create a result by itself; it becomes eligible only when the next substantive line is a structured allowed assessment, and the pending heading is discarded on unrelated prose or a new component.
- `REASON:` is treated as a formatting label and stripped before storing the component reason.
- Regression coverage includes the observed P01.07–P01.11 response plus no-cross-component/no-unrelated-prose guardrails.
- No definition or semantic-scoring changes. Matrix remains 0.0.0.0. Inherits 0.9.6.50 unlabeled-WHY recovery and all earlier recovery/calibration behavior.

---

## Worker 0.9.6.50 — Prompt Diagnostics unlabeled-WHY recovery

- Single-concept final-score repair accepts the provider form `CODE SCORE <0-100>` followed by a normal explanatory paragraph when the literal `WHY` label is omitted.
- Scope is deliberately narrow: final-score repair only, one target concept only, and only after a valid target score. Explicit WHY labels retain precedence. Foreign concept codes, placeholders, component records, and ambiguous structured output are rejected by this fallback.
- Covers the observed PFM0112 and PFM0204 failures without changing definitions or semantic scoring.
- Matrix remains 0.0.0.0. Inherits 0.9.6.49 Playful/Snarky calibration and all 0.9.6.48 parser/provider recovery behavior.

---

## Worker 0.9.6.49 — Playful / Snarky calibration

- PFM0113 Playful now explicitly recognizes playful role-taking, dress-up, character customization, make-believe, character experimentation, and deliberately fun/lighthearted presentation when they function as play.
- PFM0713 Snarky now gates out general humor, silliness, playfulness, costumes, joking, and lightheartedness unless the evidence is specifically sarcastic, cutting, mocking, dismissive, or contemptuous.
- No global Prompt Diagnostics semantic rule was added from this image.
- Matrix remains 0.0.0.0.
- Inherits 0.9.6.48 parser/final-score recovery behavior unchanged.

---

## Deployment

Adapted from the Billy Labs Cloudflare Workers AI Vision infrastructure.

1. Install dependencies: `npm install`
2. Set the analysis secret: `npx wrangler secret put ANALYSIS_KEY`
3. Accept the configured Workers AI model license in Cloudflare if prompted.
4. In Cloudflare AI Gateway, enable Unified Billing and load credits for the fallback provider. The default fallback is `openai/gpt-4.1-mini`; no OpenAI API key is required.
5. Deploy: `npm run deploy`
6. Enter the deployed Worker URL and the same analysis key in Genreactrix → AI.

The browser never receives provider credentials. The Worker accepts authenticated `POST /api/genreactrix/analyze` for AI results and `POST /api/genreactrix/image` as a bounded image-fetch proxy used when browser CORS would otherwise prevent Import from creating its required 64×64 thumbnail.



## Worker 0.9.6.48 — Prompt Diagnostics final-score label recovery

Single-concept final-score repair accepts harmless Markdown and unqualified `WHY` labels when the target concept is unambiguous, while multi-concept responses remain code-strict. Preserves 0.9.6.47 component-label recovery, 0.9.6.46 provider-timeout recovery, and 0.9.6.45 repair-state recovery. No semantic or Matrix changes.

## Reaction Rerun evidence routing

Worker v0.9.6.35 keeps Image-only on Llama 3.2 Vision and Description-only on Llama 4 Scout structured output. Image + Description uses Llama 4 Scout as a multimodal `messages` request containing both a text part and an `image_url` data-URI part, with `guided_json` for the 14-Prim Reaction assessment. The Worker retains the hard all-zero/all-identical/numeric validation gates and retries one invalid combined assessment before failing.


## Theme Rerun Submit

The analyze endpoint accepts a structured `themeRerun` context for Theme-only reruns. Stable PFM/P codes are authoritative. Preserve, Replace, PrimPicker, Theme Exclusions, and included Description references are enforced in the Worker before/while selecting the three Theme results.

Worker v0.9.6.28 moves Theme Rerun provider output off JSON Mode and onto a compact pipe-delimited text protocol. Preserved slots are resolved locally; only open slots are requested from the vision model. The Worker still validates every returned PFM against the exact slot candidate set and enforces final uniqueness. This specifically addresses the all-Neutral failure where the vision provider returned invalid JSON. Deploy this Worker before retesting Genreactrix v0.9.40.61 Theme Rerun Submit.


## Worker 0.9.6.32 — Reaction rerun Vision routing

Image-bearing Direct Reaction reruns use the configured Llama 3.2 Vision model with the image field. Because that model does not expose the Worker guided_json contract used by the Description-only path, the Worker requests text output, parses the returned 14-Prim assessment locally, and applies the same strict validation and Hamilton apportionment afterward. Description-only continues to use Llama 4 Scout guided_json and does not send image bytes.


Worker 0.9.6.33 validation note: top-four effort notes are optional for reactions-only requests and remain required for reactionReasons requests.


## Worker 0.9.6.34 — Combined Reaction evidence protocol

Image + Description Direct Reaction reruns use the Vision model with a compact strict line protocol (`P01|weight` through `P14|weight`, then `RANKING|...`). Every Prim weight must be independently present and numeric; malformed or missing values trigger a retry. Image-only and Description-only routing are unchanged from their accepted 0.9.6.33 behavior.


## Worker 0.9.6.37 — Prompt Diagnostics call modes

Prompt Diagnostics can evaluate a complete 15-concept batch or one exact 5-concept wave from that same batch. Both paths use the same live Prim/PrimFusion registry definitions and the same independent 0–100 definition-part scoring contract. Five-concept waves use a smaller output allowance and return wave metadata so the portrait diagnostic surface can persist and compare results call-by-call.


## Worker 0.9.6.44 — Compound PrimFusion name casing

Naming-only cleanup. **PFM0110** is now **UglyCute** and **PFM0411** is now **ComedyHorror**. Their stable PFM codes, Prim pairings, AI meanings, exactly-three Theme selection behavior, and Matrix `0.0.0.0` are unchanged. This establishes the closed-compound display style already used by names such as CreepyCute and PartyTime.

## Worker 0.9.6.43 — Semantic calibration + diagnostic consistency repair

Keeps Matrix `0.0.0.0`. Synchronizes the booked pre-lock PrimFusion wording changes, including the locked Humiliation definition and the PFM0110 redefinition as Uglycute. Prompt Diagnostics now uses MATCH_EVIDENCE versus GATE_CONFIRMED, explicit 0–100 calibration, cue≠meaning/evidence-fidelity rules, target isolation, and an automatic consistency/evidence repair when a complete response contradicts its own score or leaks unrelated same-wave concepts. Exactly-three normal Theme selection remains mandatory; weak forced-third matches should lower confidence rather than fabricate evidence. Diagnostics retain the 90-second provider timeout; normal analysis remains at 45 seconds.

## Worker 0.9.6.42 — Prompt Diagnostics component parser

Keeps Matrix version `0.0.0.0`, the locked PFM0309 Humiliation working definition, and the 90-second Prompt Diagnostics-only provider timeout from 0.9.6.41. Component repair parsing now anchors on the known component ID and accepts the assessment token after intervening definition text, including forms such as `PFM0412.02 :: [definition text]. SUPPORTS - reason`.

## Worker 0.9.6.41 — Prompt Diagnostics timeout + locked Humiliation

Prompt Diagnostics provider calls use a 90-second timeout while ordinary AI calls remain unchanged. PFM0309 Humiliation uses the locked pre-baseline working definition. Matrix version remains `0.0.0.0`; test-era report cleanup will occur before the historical Matrix baseline is locked.

## Worker 0.9.6.40 — Prompt Diagnostics 3 × 5 + adaptive definition repair

Adds 3-concept waves (five waves per 15-concept batch). The existing 5-concept and 15-concept paths remain available. If a concept cannot enumerate its complete numbered definition after one focused repair, the Worker falls back only for that concept to five-definition-component chunks, then derives a fresh final confidence score from the completed component findings. Score parsing also accepts trailing explanatory text after the numeric score.


### Worker 0.9.6.78 — Theme human-fit calibration
- Removes emotional/evocative/interestingness as a Theme-ranking advantage.
- Requires boring/neutral closer fits to outrank richer affective Themes.
- Blocks unsupported substitutions such as simplicity/minimalism -> playfulness and generic visual praise -> affective Theme evidence.
- Filters generic evaluative praise from Theme Rerun frozen evidence.
- Leaves PrimFusion definitions and Matrix version 0.0.0.0 unchanged.


## 0.9.6.108 taxonomy rebuild
- 13 active Prims; P07 Ticket retired with surviving IDs unchanged.
- 78 active fusion Themes; 91 total prompt-diagnostic concepts including standalone Prims.
- Theme/Reaction diagnostics derive active Prim counts from the registry.
- Preserves .107 per-image alternate-provider retry behavior.


## 0.9.6.109 P07 Angry fill
- Ticket remains retired. Former P14 Angry now occupies P07, producing contiguous active Prim IDs P01–P13.
- 78 active fusion Themes and 91 Prompt Diagnostics concepts are unchanged in count.
- Only Angry-involving PFM codes change; all P08–P13 identities remain stable.
- Preserves .108 taxonomy semantics and .107 per-image alternate-provider retry behavior.

- Adds `/api/genreactrix/theme-report-diagnostic` for the deferred full Theme reporting sidecar.
- Decision-critical Theme review uses the compact `theme-decision-audit` stage; Prim scoring and candidate enumeration are no longer on the critical path.

- Qwen 3.7 Plus requests set `enable_thinking:false`; live provider telemetry reports `thinkingMode: disabled`.
