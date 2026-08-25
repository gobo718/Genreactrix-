# Genreactrix v0.9.40.168 — Live AI status reporting

Behavior/UI release based on v0.9.40.167. Requires Worker v0.9.6.118 for full live provider/stage telemetry.

## Change
- Reuses the existing **Selected job** box as a live AI activity readout; no new panel and no layout/geometry changes.
- Shows current image number/name, elapsed time, request family, provider, provider-cycle stage, and live state.
- Reports provider attempt starts, successes, failures, whole-Theme-run acceptance/discard, Worker completion, local save phase, and the most recent transitions.
- Supports simultaneous Reaction and Theme/Description requests without hiding that they are running concurrently.
- Keeps the last image/job activity visible after completion for the current session; persisted job history remains unchanged.
- Updates Provider readiness wording to the actual roster: **Mistral · GPT-4.1 mini · Qwen 3.7 Plus**.
- Manual **Start analysis** now selects the newly created job so the bottom box follows the run immediately.
- If the streaming endpoint is unavailable, analysis falls back to the existing non-streaming request path rather than failing solely because live telemetry is unavailable.

## Worker dependency
- Worker v0.9.6.118 adds the additive `/api/genreactrix/analyze-stream` NDJSON endpoint.
- The ordinary `/api/genreactrix/analyze` endpoint is preserved unchanged for compatibility.
- Provider order remains **Mistral → GPT-4.1 mini → Qwen 3.7 Plus**; no Theme, Reaction, Description, scoring, gating, or routing semantics were changed by the reporting feature.

## Not changed
- No existing AI console regions were moved, resized, rearranged, or reflowed.
- No Theme/Reaction definitions or Matrix identity changed.
- No Queue, Bundle, Batch, lifecycle, report, or storage behavior changed.
