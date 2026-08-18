# Genreactrix AI Worker

Current bundled Worker: v0.9.6.49-playful-snarky-calibration.

## Worker 0.9.6.49 — Playful / Snarky calibration

- PFM0113 Playful now explicitly recognizes playful role-taking, dress-up, character customization, make-believe, character experimentation, and deliberately fun/lighthearted presentation when they function as play.
- PFM0713 Snarky now gates out general humor, silliness, playfulness, costumes, joking, and lightheartedness unless the evidence is specifically sarcastic, cutting, mocking, dismissive, or contemptuous.
- No global Prompt Diagnostics semantic rule was added from this image.
- Matrix remains 0.0.0.0.
- Inherits 0.9.6.48 parser/final-score recovery behavior unchanged.

---

# Genreactrix AI Worker

Current bundled Worker: v0.9.6.48-prompt-diagnostics-final-score-label-recovery.

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
