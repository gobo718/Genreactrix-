# Genreactrix AI Worker

Current bundled Worker: v0.9.6.57-maintenance-targeted-repair.

## Worker 0.9.6.57 — Bundled maintenance + targeted repair

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
4. Deploy: `npm run deploy`
5. Enter the deployed Worker URL and the same analysis key in Genreactrix → AI.

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
